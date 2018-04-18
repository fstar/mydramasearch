# -*- coding: utf-8 -*-
import http.client as httplib

from flask import jsonify, make_response



def succeed_resp(status_code=httplib.OK, **kwargs):
    return make_response(jsonify(response_code=1, response_msg="success", **kwargs), status_code)


def failed_resp(message, status_code=httplib.OK):
    return make_response(jsonify(response_code=0, response_msg=message), status_code)




