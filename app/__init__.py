from flask import Flask


from config import Config
from app.extension import db, csrf, redis_client, celery
from app.views.web import spider_management_bp
from app.views.api import api_bp


def create_app():
    """
    初始化app
    :return: app
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    csrf.init_app(app=app)
    celery.init_app(app=app)

    app.register_blueprint(spider_management_bp)
    app.register_blueprint(api_bp)

    from app.views.Task import Tasks_bp
    app.register_blueprint(Tasks_bp)

    csrf.exempt(spider_management_bp)
    csrf.exempt(api_bp)

    db.init_app(app)
    with app.test_request_context():
        db.create_all()

    redis_client.init_app(app)
    print(app.url_map)


    return app

app = create_app()
