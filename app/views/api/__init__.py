from flask import Blueprint
from flask_restful import Api
api_bp = Blueprint(__name__, "api_bp", url_prefix="/spider/api")

from app.views.api.Episode_api_view import Episode_api
from app.views.api.Video_api_view import Video_api

api_api = Api(api_bp)
api_api.add_resource(Episode_api, "/Episode", "/Episode/<int:id_>")
api_api.add_resource(Video_api, "/Video", "/Video/<int:id_>")


