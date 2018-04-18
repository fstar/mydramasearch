# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class EpisodeItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    source_name = scrapy.Field()
    source_url = scrapy.Field()
    source_id = scrapy.Field()
    source_stills = scrapy.Field()
    source_desc = scrapy.Field()
    from_web = scrapy.Field()
    last_update_time = scrapy.Field()
    classify = scrapy.Field()
    starring = scrapy.Field()
    director = scrapy.Field()
    video_num = scrapy.Field()
    year = scrapy.Field()
    area = scrapy.Field()
    type_ = scrapy.Field()
    video_list = scrapy.Field()


class VideoItem(scrapy.Item):
    episode_id = scrapy.Field()
    source_name = scrapy.Field()
    source_url = scrapy.Field()
    source_video_id = scrapy.Field()
    episode_num = scrapy.Field()
    from_web = scrapy.Field()

