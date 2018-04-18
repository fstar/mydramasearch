from flask_restful import Resource, reqparse
from app.models.video_models import Episode
from app.views.common.utils import succeed_resp, failed_resp


Episode_parser = reqparse.RequestParser(trim=True)
Episode_parser.add_argument('source_name', type=str, required=True, location="form", nullable=False, help="source_name must be needed")
Episode_parser.add_argument('source_url', type=str, required=True, location="form", nullable=False, help="source_url must be needed")
Episode_parser.add_argument('source_id', type=str, required=True, location="form", nullable=False, help="source_id must be needed")
Episode_parser.add_argument('source_stills', type=str, location="form",)
Episode_parser.add_argument('source_desc', type=str, location="form",)
Episode_parser.add_argument('from_web', type=str, required=True, location="form", nullable=False, help="from_web must be needed")
Episode_parser.add_argument('last_update_time', type=str, location="form")
Episode_parser.add_argument('classify', type=str, location="form")
Episode_parser.add_argument('starring', type=str, location="form")
Episode_parser.add_argument('director', type=str, location="form")
Episode_parser.add_argument('video_num', type=int, location="form")
Episode_parser.add_argument('year', type=str, location="form")
Episode_parser.add_argument('area', type=str, location="form")
Episode_parser.add_argument('type_', type=str, location="form", required=True, nullable=False, help="type_ must be needed")


Get_Episode_parser = reqparse.RequestParser(trim=True)
Get_Episode_parser.add_argument('source_name', type=str, location="args")
Get_Episode_parser.add_argument('source_stills', type=str, location="args")
Get_Episode_parser.add_argument('source_desc', type=str, location="args")
Get_Episode_parser.add_argument('from_web', type=str, location="args")
Get_Episode_parser.add_argument("last_update_time_start", type=str, location="args")
Get_Episode_parser.add_argument("last_update_time_end", type=str, location="args")
Get_Episode_parser.add_argument('classify', type=str, location="args")
Get_Episode_parser.add_argument('starring', type=str, location="args")
Get_Episode_parser.add_argument('director', type=str, location="args")
Get_Episode_parser.add_argument('year', type=str, location="args")
Get_Episode_parser.add_argument('area', type=str, location="args")
Get_Episode_parser.add_argument('type_', type=str, location="args")
Get_Episode_parser.add_argument("with_deleted", type=int, location="args")
Get_Episode_parser.add_argument("page", type=int, location="args")
Get_Episode_parser.add_argument("perpage", type=int, location="args")

Update_Episode_parser = reqparse.RequestParser(trim=True)
Update_Episode_parser.add_argument('last_update_time', type=str, location="form")
Update_Episode_parser.add_argument('video_num', type=int, location="form")
Update_Episode_parser.add_argument('download_status', type=int, location="form")
Update_Episode_parser.add_argument('download_num', type=int, location="form")

class Episode_api(Resource):
    def get(self, id_=None):
        args = Get_Episode_parser.parse_args(strict=True)
        if id_ is None:
            data = Episode.query_list(**args)
            result = {
                "data": [i.to_dict() for i in data.items],
                "total": data.total,
                "page": data.page,
                "per_page": data.per_page
            }
            return succeed_resp(result=result)
        else:
            result = Episode.query_id(id_)
            return succeed_resp(result=result)

    def post(self):
        try:
            data = Episode_parser.parse_args(strict=True)
            id_ = Episode.insert(**data)
            return succeed_resp(id_=id_)
        except Exception as e:
            return failed_resp(message=str(e))

    def delete(self, id_):
        if Episode.delete(id_):
            return succeed_resp(message="ok")
        else:
            return failed_resp(message="failed")

    def patch(self, id_):
        data = Update_Episode_parser.parse_args()
        if Episode.update_query(id_, **data):
            return succeed_resp(message="ok")
        else:
            return failed_resp(message="failed")

