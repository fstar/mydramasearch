from app.extension import celery
import os

@celery.task
def sohu_movie_spider():
    shell = "cd spider_scrapy && scrapy crawl sohu_movie"
    os.system(shell)
    return True
