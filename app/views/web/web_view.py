from flask import render_template
from app.views.web import spider_management_bp


@spider_management_bp.route("/login", methods=["POST", "GET"])
def login():
    return render_template("spider/login.html")


@spider_management_bp.route("/index", methods=["POST", "GET"])
def index():
    return render_template("spider/index.html")


@spider_management_bp.route("/video", methods=["POST", "GET"])
def video():
    return render_template("spider/video.html")


@spider_management_bp.route("/video/get_series", methods=["POST", "GET"])
def get_series():
    return render_template("spider/series.html")


@spider_management_bp.route("/error_spider", methods=["POST", "GET"])
def error_spider():
    return render_template("spider/error_video.html")


@spider_management_bp.route("/movie", methods=["POST", "GET"])
def movie():
    return render_template("spider/movie.html")


@spider_management_bp.route("/show", methods=["POST", "GET"])
def show():
    return render_template("spider/show.html")


@spider_management_bp.route("/show/get_series", methods=["POST", "GET"])
def show_series():
    return render_template("spider/show_series.html")
