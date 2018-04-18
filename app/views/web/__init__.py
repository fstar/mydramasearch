from flask import Blueprint
spider_management_bp = Blueprint(__name__, "spider_management_bp", url_prefix="/spider/management")

from app.views.web.web_view import *