from flask_restful import Resource, reqparse
from app.models.video_models import Video
from app.views.common.utils import succeed_resp, failed_resp


Post_Video_parser = reqparse.RequestParser(trim=True)
Post_Video_parser.add_argument('episode_id', type=str, required=True, location="form", nullable=False, help="episode_id must be needed")
Post_Video_parser.add_argument('source_name', type=str, required=True, location="form", nullable=False, help="source_name must be needed")
Post_Video_parser.add_argument('source_video_id', type=str, required=True, location="form", nullable=False, help="source_video_id must be needed")
Post_Video_parser.add_argument('episode_num', type=str, location="form",)
Post_Video_parser.add_argument('from_web', type=str, required=True, location="form", nullable=False, help="from_web must be needed")
Post_Video_parser.add_argument('source_url', type=str, required=True, location="form", nullable=False, help="source_url must be needed")


Get_Video_parser = reqparse.RequestParser(trim=True)
Get_Video_parser.add_argument('episode_id', type=int, location="args", required=True, nullable=False, help="episode_id must be needed")
Get_Video_parser.add_argument('with_deleted', type=int, location="args")


Update_Video_parser = reqparse.RequestParser(trim=True)
Update_Video_parser.add_argument('status', type=int, location="form")
Update_Video_parser.add_argument('video_format', type=str, location="form")
Update_Video_parser.add_argument('size', type=int, location="form")
Update_Video_parser.add_argument('width', type=int, location="form")
Update_Video_parser.add_argument('height', type=int, location="form")
Update_Video_parser.add_argument('duration', type=float, location="form")
Update_Video_parser.add_argument('hash', type=str, location="form")
Update_Video_parser.add_argument('accessable', type=int, location="form")
Update_Video_parser.add_argument('download_speed', type=float, location="form")
Update_Video_parser.add_argument('download_percent', type=float, location="form")


import traceback
class Video_api(Resource):
    def get(self):
        args = Get_Video_parser.parse_args(strict=True)
        data = Video.query_by_episode_id(**args)
        return succeed_resp(result=data)

    def post(self):
        try:
            data = Post_Video_parser.parse_args(strict=True)
            id_ = Video.insert(**data)
            if not id_:
                return succeed_resp(message="已存在")
            return succeed_resp(id_=id_)
        except Exception as e:
            traceback.print_exc()
            return failed_resp(message=str(e))

    def delete(self, id_):
        if Video.delete(id_):
            return succeed_resp(message="ok")
        else:
            return failed_resp(message="failed")

    def patch(self, id_):
        data = Update_Video_parser.parse_args()
        if Video.update_query(id_, **data):
            return succeed_resp(message="ok")
        else:
            return failed_resp(message="failed")

