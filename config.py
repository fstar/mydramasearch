import os

env = os.getenv("mydramasearchenv", "dev")
if env == "dev":
    db_username = "tests"
    db_password = "tests"
    db_host = "localhost"
    db_port = 3306
    db_name = "videosearch"


    redis_host = "localhost"
    redis_port = 6379
    redis_password = ""
    redis_db_name = 0

    mongodb_host = "localhost"
    mongodb_port = 27017
    mongodb_user = "root"
    mongodb_password = "1qaz2wsx"
    mongodb_db_name = "videosearch"

    log_path ="./log/"

    celery_redis_host = "localhost"
    celery_redis_port = 6379
    celery_redis_password = ""
    celery_redis_db_name = 1
    """
    记录:
    1. 慢请求log开启
    2. 慢查询log开启
    """


elif env == "pro":
    db_username = "tests"
    db_password = "123456"
    db_host = "localhost"
    db_port = 3306
    db_name = "videosearch"

    redis_host = "localhost"
    redis_port = 6379
    redis_password = ""
    redis_db_name = 0

    mongodb_host = "localhost"
    mongodb_port = 27017
    mongodb_user = "root"
    mongodb_password = "1qaz2wsx"
    mongodb_db_name = "videosearch"
    log_path = "./log/"

else:
    raise "No mydramasearchenv"

class Config:
    SECRET_KEY = "videosearch"

    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://%s:%s@%s:%s/%s?charset=utf8" % (
    db_username, db_password, db_host, db_port, db_name)
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024 * 1024
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_MAX_OVERFLOW = 1000
    SQLALCHEMY_POOL_SIZE = 5
    SQLALCHEMY_POOL_TIMEOUT = 10
    SQLALCHEMY_POOL_RECYCLE = 30

    REDIS_HOST = redis_host
    REDIS_PORT = redis_port
    REDIS_PASSWORD = redis_password
    REDIS_DB_NAME = redis_db_name

    REDIS_URL = "redis://:%s@%s:%s/%s" % (redis_password, redis_host,
                                          redis_port, redis_db_name)
    MONGO_URI = "mongodb://%s:%s@%s:%s/%s" % (mongodb_user, mongodb_password, mongodb_host,
                                              mongodb_port, mongodb_db_name)
    MONGO_MAX_POOL_SIZE = 100

    CELERY_BROKER_URL = "redis://:%s@%s:%s/%s" % (celery_redis_password, celery_redis_host,
                                                  celery_redis_port, celery_redis_db_name)
    LOG_PATH = log_path



