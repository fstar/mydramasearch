from flask import Blueprint

from app.celery_task.spider import sohu_movie_spider

Tasks_bp = Blueprint("Tasks_bp", __name__, url_prefix="/spider/Tasks")


@Tasks_bp.route("/start/<task_name>")
def start_task(task_name=None):
    if task_name is None:
        return "task name needed"
    else:
        if task_name == "sohu_movie":
            sohu_movie_spider.delay()
            return "ok"
        else:
            return "no task name: {0}".format(task_name)
