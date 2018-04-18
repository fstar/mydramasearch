# -*- coding:utf-8 -*-
import time
from hashlib import md5
from sqlalchemy import INTEGER, VARCHAR, TIMESTAMP, Index, func

from app.extension import db

class User(db.Model):
    """
        用户表
    """
    ON = 1
    OFF = 0
    __tablename__ = "User"

    uid = db.Column("uid", INTEGER, primary_key=True, nullable=False, autoincrement=True)
    username = db.Column("username", VARCHAR(length=64), nullable=False)
    password = db.Column("password", VARCHAR(length=64), nullable=False)
    email = db.Column("email", VARCHAR(length=255), nullable=False, server_default="")
    token = db.Column("token", VARCHAR(255), nullable=False)                                   # 用户token

    register_time = db.Column("register_time", TIMESTAMP, nullable=False, server_default=func.now())
    last_login_time = db.Column("last_login_time", TIMESTAMP, nullable=False, server_default=func.now(),
                                onupdate=func.now())
    status = db.Column("status", INTEGER(), default=1)

    usernameIndex = Index("username", username, unique=True)
    emailIndex = Index("email", email, unique=True)

    def __init__(self, **kwargs):
        for key in kwargs.keys():
            if kwargs[key] is None:
                kwargs.pop(key)
        self.__dict__.update(kwargs)

    @classmethod
    def get_salt(cls):
        salt = md5(str(time.time())).hexdigest()
        return salt

    @classmethod
    def encrypt_password(cls, password, salt):
        password = md5("{}".format(password)).hexdigest()
        return md5(password + salt).hexdigest()

    @classmethod
    def generate_auth_token(cls, uid, username, prefix, random_seed):
        token = md5("concentration-{}-{}-insistence".format(uid, random_seed)).hexdigest()
        auth_token = "{}-{}-{}-auth-{}".format(prefix, uid, username, token)
        return auth_token

    @classmethod
    def get_user(cls, username, password):
        user_row = cls.query.filter_by(username=username, active=cls.ON).first()
        if user_row:
            password = cls.encrypt_password(password, salt=user_row.salt)
            if password == user_row.password:
                return user_row
        return None

    @classmethod
    def insert(cls, username, password, email):
        one = cls(username=username, password=password, email=email)
        one["password"] = cls.encrypt_password(password)

        db.session.add(one)
        db.session.flush()
        one["token"] = cls.generate_auth_token(one.uid, username, "MD")
        db.session.commit()


class Role(db.Model):
    """
        角色表
    """
    __tablename__ = "Role"

    role_id = db.Column("role_id", INTEGER, primary_key=True, nullable=False, autoincrement=True,
                        doc="value is 1 means it is admin which has all permissions")
    role_name = db.Column("role_name", VARCHAR(255), nullable=False)
    create_time = db.Column("create_time", TIMESTAMP, nullable=False, server_default=func.now)
    status = db.Column("status", INTEGER(), default=1)  # 角色状态, 1.正常 0.停用

    def __init__(self, role_name):
        self.role_name = role_name

    @classmethod
    def insert(cls, role_name):
        one = cls(role_name)
        db.session.add(one)
        db.session.commit()

class Module(db.Model):
    """
        模块表
    """
    __tablename__ = "Module"
    module_id = db.Column("module_id", INTEGER(), primary_key=True, nullable=False, autoincrement=True)  # 模块id
    module_name = db.Column("module_name", VARCHAR(255), nullable=False)  # 模块名
    status = db.Column("status", INTEGER(), default=1)  # 模块状态, 1.正常 0.停用
    create_time = db.Column("create_time", TIMESTAMP, server_default=func.now)  # 创建时间

    def __init__(self, module_name):
        self.module_name = module_name

    @classmethod
    def insert(cls, module_name):
        one = cls(module_name)
        db.session.add(one)
        db.session.commit()

class Role_Module(db.Model):
    """
        角色模块关联表
    """
    __tablename__ = "Role_Module"
    id = db.Column("id", INTEGER(), primary_key=True, nullable=False, autoincrement=True)                # 角色与模块关联id
    role_id = db.Column("role_id", INTEGER(), db.ForeignKey("Role.id"), nullable=False)                  # 角色id, 外键, 关联Role表id
    module_id = db.Column("module_id", INTEGER(), db.ForeignKey("Module.id"), nullable=False)            # 模块id, 外键, 关联Module表id
    status = db.Column("status", INTEGER(), default=1)                                                   # 关联状态, 1.正常 0.停用

    def __init__(self, role_id, module_id):
        self.role_id = role_id
        self.module_id = module_id

    @classmethod
    def insert(cls, role_id, module_id):
        one = cls(role_id, module_id)
        db.session.add(one)
        db.session.commit()


class User_role(db.Model):
    """
        用户角色关联表
    """
    __tablename__ = 'User_Role'

    RUN = 1
    STOP = 0
    ERROR = -1

    id = db.Column("id", INTEGER(), primary_key=True, nullable=False, autoincrement=True)  # 分组id
    user_id = db.Column("user_id", INTEGER(), db.ForeignKey("User.uid"), nullable=False)  # 用户id
    role_id = db.Column("role_id", INTEGER(), db.ForeignKey("Role.id"), nullable=False)  # 分组id
    status = db.Column('status', INTEGER(), nullable=False, default=1)  # 分组状态

    def __init__(self, user_id, role_id):
        self.User_id = user_id
        self.role_id = role_id

    @classmethod
    def insert(cls, user_id, role_id):
        one = cls(user_id, role_id)
        db.session.add(one)
        db.session.commit()