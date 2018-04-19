from app.extension import db
from sqlalchemy import INTEGER, VARCHAR, DateTime, TEXT, func, SMALLINT, FLOAT
from app.extension import redis_client
import traceback
from sqlalchemy.exc import IntegrityError

class Episode(db.Model):
    """
    剧集信息
    """
    __tablename__ = "Episode"

    DOWNLOAD_ERROR = -1
    DOWNLOAD_NOT_TRIGGERED = 1
    DOWNLOADING = 2
    DOWNLOAD_FINISHED = 3


    id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)
    source_name = db.Column("source_name", VARCHAR(length=255), nullable=False)
    source_url = db.Column("source_url", VARCHAR(length=255), nullable=False)
    source_id = db.Column("source_id", VARCHAR(255), nullable=False, server_default="",
                          doc="episode id in source website, it can be string")
    source_stills = db.Column("source_stills", VARCHAR(length=255), nullable=False, server_default="")
    source_desc = db.Column("source_desc", TEXT(length=65535), nullable=False, default="")
    deleted = db.Column("deleted", SMALLINT, nullable=False, server_default="0", doc="是否删除, 0: no; 1: yes")
    download_status = db.Column("download_status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED),
                                doc="下载状态: -1:报错, 1:未下载, 2:下载中, 3:下载完成")
    download_num = db.Column("download_num", SMALLINT, nullable=False, server_default="0",
                             doc="下载数")

    from_web = db.Column("from_web", VARCHAR(255), nullable=False, doc="来源网站")

    last_update_time = db.Column("last_update_time", DateTime, doc="更新时间")
    create_time = db.Column("create_time", DateTime, nullable=False, server_default=func.now, doc="创建时间")

    classify = db.Column("classify", VARCHAR(length=255), nullable=False, server_default="",
                         doc="分类:悬疑, 古装, example: aaa;bbb;ccc. spilt by ';'")
    starring = db.Column("starring", VARCHAR(length=255), nullable=False, server_default="",
                         doc="演员(声优) ,example: aaa;bbb;ccc. spilt by ';'")
    director = db.Column("director", VARCHAR(length=255), nullable=False, server_default="",
                         doc="导演, example: aaa;bbb;ccc. spilt by ';'")
    video_num = db.Column("video_num", INTEGER, nullable=False, server_default="0")
    year = db.Column("year", VARCHAR(60), nullable=False, server_default="0", doc="年份")
    area = db.Column("area", VARCHAR(255), nullable=False, server_default="",
                         doc="地区")
    type_ = db.Column("type_", VARCHAR(64), nullable=False, doc="类型:电视剧, 动漫, 电影")

    def __init__(self, **kwargs):
        self.source_name = kwargs["source_name"]
        self.source_url = kwargs["source_url"]
        self.source_id = kwargs["source_id"]
        self.source_stills = kwargs["source_stills"]
        self.source_desc = kwargs["source_desc"]
        self.from_web = kwargs["from_web"]
        self.last_update_time = kwargs["last_update_time"]
        self.classify = kwargs["classify"]
        self.starring = kwargs["starring"]
        self.director = kwargs["director"]
        self.video_num = kwargs["video_num"]
        self.year = kwargs["year"]
        self.area = kwargs["area"]
        self.type_ = kwargs["type_"]

    @classmethod
    def is_exists(cls, source_id, from_web):
        query = cls.query.filter_by(source_id=source_id, from_web=from_web).first()
        if query:
            return query.id
        else:
            return False

    @classmethod
    def is_exists_by_id(cls, id_):
        query = cls.query.filter_by(id=id_).first()
        if query:
            return True
        else:
            return False


    @classmethod
    def insert(cls, **kwargs):
        for key in kwargs:
            if kwargs is None:
                kwargs[key] = ""
        id_ = cls.is_exists(source_id=kwargs["source_id"], from_web=kwargs["from_web"])
        if id_:
            return id_

        try:
            one = cls(**kwargs)
            db.session.add(one)
            db.session.flush()
            id_ = one.id
            db.session.commit()
            return id_
        except IntegrityError as e:
            id_ = cls.is_exists(source_id=kwargs["source_id"], from_web=kwargs["from_web"])
            if id_:
                return id_
            else:
                raise e
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            raise e

    def to_dict(self):
        return {
            "id": self.id,
            "source_name": self.source_name,
            "source_url": self.source_url,
            "source_id": self.source_id,
            "source_stills": self.source_stills,
            "source_desc": self.source_desc,
            "deleted": self.deleted,
            "download_status": self.download_status,
            "download_num": self.download_num,
            "from_web": self.from_web,
            "last_update_time": self.last_update_time,
            "create_time": self.create_time,
            "classify": self.classify,
            "starring": self.starring,
            "director": self.director,
            "video_num": self.video_num,
            "year": self.year,
            "area": self.area,
            "type_": self.type_,
        }

    @classmethod
    def query_list(cls, **kwargs):
        query = cls.query
        query_like = [
            "source_name",
            "source_url",
            "source_stills",
            "source_desc",
            "classify",
            "starring",
            "director",
        ]
        query_equal = [
            "source_id",
            "from_web",
            "type_",
            "year",
            "area"
        ]
        query_range = [
            "last_update_time_start",
            "last_update_time_end"
        ]
        if kwargs.get("with_deleted", None) is None or kwargs["with_deleted"] == 0:
            query = query.filter(cls.deleted != 1)

        for key in query_like:
            if key in kwargs and kwargs[key] is not None:
                query = query.filter(
                    getattr(cls, key).like("%{0}%".format(kwargs[key])))

        for key in query_equal:
            if key in kwargs and kwargs[key] is not None:
                query = query.filter(
                    getattr(cls, key) == kwargs[key]
                )

        for key in query_range:
            if key in kwargs and kwargs[key] is not None:
                temp = key.rsplit("_", maxsplit=1)
                print(getattr(cls, temp[0]))
                if temp[-1] == "start":
                    query = query.filter(
                        getattr(cls, temp[0]) >= kwargs[key]
                    )
                elif temp[-1] == "end":
                    query = query.filter(
                        getattr(cls, temp[-1]) >= kwargs[key]
                    )

        page = kwargs.get("page", 1)
        per_page = kwargs.get("per_page", 20)
        query = query.paginate(page=page, per_page=per_page)
        return query

    @classmethod
    def query_id(cls, id_):
        query = cls.query.filter_by(id=id_).first()
        if not query:
            return None
        else:
            return query.to_dict()

    @classmethod
    def delete(cls, id_):
        try:
            query = cls.query.filter_by(id=id_).first()
            query.deleted = 1
            db.session.commit()
            return True
        except:
            db.session.rollback()
            traceback.print_exc()
            return False

    @classmethod
    def update_query(cls, id_, **kwargs):
        try:
            key_list = [
                "last_update_time",
                "video_num",
                "download_status",
                "download_num",
            ]
            query = cls.query.filter_by(id=id_).first()
            for key in key_list:
                if kwargs.get(key, None) is not None:
                    setattr(query, key, kwargs[key])
            db.session.commit()
            return True
        except:
            db.session.rollback()
            traceback.print_exc()
            return False

class Video(db.Model):
    """
    单集信息
    """
    __tablename__ = "video"

    DOWNLOAD_ERROR = -1

    DOWNLOAD_NOT_TRIGGERED = 1  # data catch finished
    DOWNLOAD_PENDING = 2
    DOWNLOADING = 3
    DOWNLOADED = 4

    id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)  # 数据库中的id
    episode_id = db.Column("source_episode_id", INTEGER, nullable=False, doc="外键, episode表的id")
    source_name = db.Column("source_name", VARCHAR(255), doc="视频名")
    source_video_id = db.Column("source_video_id", VARCHAR(length=255), nullable=False,
                                doc="视频在目标网站的id")
    episode_num = db.Column("episode_num", SMALLINT, nullable=False, doc="集数, 1 表示第一集")
    from_web = db.Column("from_web", VARCHAR(255), nullable=False, doc="来源网站")

    source_url = db.Column("source_url", TEXT(length=65535), nullable=False, doc="source url of video")
    status = db.Column("status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED))
    deleted = db.Column("deleted", SMALLINT, nullable=False, server_default=str(0), doc="是否删除, 0: no; 1: yes")
    video_format = db.Column("video_format", VARCHAR(length=255), nullable=False, server_default="", doc="视频类型")
    size = db.Column("size", INTEGER, nullable=False, server_default=str(0), doc="大小")
    width = db.Column("width", INTEGER, nullable=False, server_default=str(0), doc="宽")
    height = db.Column("height", INTEGER, nullable=False, server_default=str(0), doc="高")
    duration = db.Column("duration", INTEGER, nullable=False, server_default=str(0),
                         doc="长度, 精确到秒")
    hash = db.Column("hash", VARCHAR(255), nullable=False, server_default="",
                     doc="视频的hash值")
    accessable = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1),
                           doc="是否可看")
    download_speed = db.Column("download_speed", INTEGER, nullable=False, server_default=str(0),
                               doc="下载速度")
    download_percent = db.Column("download_percent", FLOAT(), nullable=False, server_default=str(0),doc="下载进度")
    create_time = db.Column("create_time", DateTime, nullable=False, server_default=func.now,
                            doc="timestamp of the row inserted")

    def __init__(self, **kwargs):
        self.episode_id = kwargs["episode_id"]
        self.source_name = kwargs["source_name"]
        self.source_video_id = kwargs["source_video_id"]
        self.episode_num = kwargs["episode_num"]
        self.from_web = kwargs["from_web"]
        self.source_url = kwargs["source_url"]

    @classmethod
    def is_exists(cls, episode_id, source_video_id, from_web):
        query = cls.query.filter_by(episode_id=episode_id, source_video_id=source_video_id, from_web=from_web).first()
        if query:
            return True
        else:
            return False

    @classmethod
    def insert(cls, **kwargs):
        for key in kwargs:
            if kwargs is None:
                kwargs[key] = ""

        if not Episode.is_exists_by_id(kwargs["episode_id"]):
            raise Exception("From_web:{0} Episode_id: {1} 不存在".format(kwargs["from_web"], kwargs["episode_id"]))

        duplicate_key = "{0}_{1}_{2}".format(kwargs["from_web"], kwargs["episode_id"], kwargs["source_video_id"])
        is_duplicate = redis_client._redis_client.sadd("Video_list:dupefilter", duplicate_key)
        if is_duplicate == 0 or cls.is_exists(kwargs["episode_id"], kwargs["source_video_id"], kwargs["from_web"]):
            print("{0} 已存在!!".format(duplicate_key))
            return False
        try:
            one = cls(**kwargs)
            db.session.add(one)
            db.session.flush()
            id_ = one.id
            db.session.commit()
            return id_

        except Exception as e:
            db.session.rollback()
            redis_client._redis_client.srem("Video_list:dupefilter", duplicate_key)
            traceback.print_exc()
            raise e

    def to_dict(self):
        return {
            "id": self.id,
            "episode_id": self.episode_id,
            "source_name": self.source_name,
            "source_video_id": self.source_video_id,
            "episode_num": self.episode_num,
            "from_web": self.from_web,
            "source_url": self.source_url,
            "status": self.status,
            "deleted": self.deleted,
            "video_format": self.video_format,
            "size": self.size,
            "width": self.width,
            "height": self.height,
            "duration": self.duration,
            "hash": self.hash,
            "accessable": self.accessable,
            "download_speed": self.download_speed,
            "download_percent": self.download_percent,
            "create_time": self.create_time,
        }

    @classmethod
    def delete(cls, id_):
        try:
            query = cls.query.filter_by(id=id_).first()
            query.deleted = 1
            db.session.commit()
            return True
        except:
            db.session.rollback()
            traceback.print_exc()
            return False

    @classmethod
    def query_by_episode_id(cls, **kwargs):
        query = cls.query.filter_by(episode_id=kwargs["episode_id"])
        if kwargs.get("with_deleted", None) is None or kwargs["with_deleted"] == 0:
            query = query.filter(cls.deleted != 1)
        query = query.all()
        return [i.to_dict() for i in query]

    @classmethod
    def update_query(cls, id_, **kwargs):
        try:
            key_list = [
                "status",
                "video_format",
                "size",
                "width",
                "height",
                "duration",
                "hash",
                "accessable",
                "download_speed",
                "download_percent"
            ]
            query = cls.query.filter_by(id=id_).first()
            for key in key_list:
                if kwargs.get(key, None) is not None:
                    setattr(query, key, kwargs[key])
            db.session.commit()
            return True
        except:
            db.session.rollback()
            traceback.print_exc()
            return False


