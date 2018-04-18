from flask_pymongo import PyMongo
from flask_redis import FlaskRedis
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect
from celery import Celery

from config import Config


class FlaskCelery(Celery):
    def init_app(self, app):
        self.conf.update(app.config)
        BaseTask = self.Task

        class ContextTask(BaseTask):
            abstract = True

            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return BaseTask.__call__(self, *args, **kwargs)
        self.Task = ContextTask


db = SQLAlchemy()
redis_client = FlaskRedis()  # Restrict redis
mongo_client = PyMongo()
celery = FlaskCelery(__name__, broker=Config.CELERY_BROKER_URL)
csrf = CsrfProtect()



# run celery : celery -A module-name.celery worker
# celery -A webApp.celery  worker
# http://stackoverflow.com/questions/25884951/attributeerror-flask-object-has-no-attribute-user-options