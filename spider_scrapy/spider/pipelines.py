# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import treq
from twisted.internet import defer
from spider.settings import Episode_API, Video_API
import requests

class SpiderPipeline(object):
    def process_item(self, item, spider):
        Episode = {
            key:item[key]
            for key in ["source_name",
                        "source_url",
                        "source_id",
                        "source_stills",
                        "source_desc",
                        "from_web",
                        "classify",
                        "starring",
                        "director",
                        "video_num",
                        "year",
                        "area",
                        "type_"]
        }
        req = requests.post(Episode_API, data=Episode)
        result = req.json()
        print(result)
        if result["response_code"] == 1:
            source_id = result["id_"]
            for i in item["video_list"]:
                Video = i
                Video["episode_id"] = source_id
                req = requests.post(Video_API, data=Video)
                result = req.json()
                print(result)
        else:
            print("error")
        return item
