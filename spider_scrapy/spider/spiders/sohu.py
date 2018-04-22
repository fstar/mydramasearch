import scrapy
from ..items import EpisodeItem, VideoItem
import re


def get_source_id(url):
    l = url.rfind("/")
    r = url.rfind(".")
    return url[l+1:r]


def get_year(string):
    pattern = re.compile("(\d+)")
    match = pattern.findall(string)
    if match:
        year = match[0]
    else:
        year = 0
    return year


class Sohu_Movie(scrapy.Spider):
    name = "sohu_movie"
    is_over = True
    web = "sohu"

    def start_requests(self):
        url = "https://so.tv.sohu.com/list_p1100_p2_p3_p4_p5_p6_p7_p8_p9_p10{index}_p11_p12_p13.html"
        index = 1
        # while (not self.is_over):
        for i in range(1, 200):
            print(index)
            yield scrapy.Request(url=url.format(index=index), callback=self.parse, meta={"index": index})
            index += 1

    def parse(self, response):
        li_list = response.xpath("//ul[@class='st-list cfix']/li")
        for li in li_list:
            url = li.xpath("./div[@class='st-pic']/a/@href").extract_first()
            if not url.startswith("http:"):
                url = "http:"+url
            if "film.sohu.com" in url:
                continue
            yield scrapy.Request(url=url, callback=self.detail)

    def detail(self, response):
        one = EpisodeItem()
        one["source_name"] = response.xpath("//h2/text()").extract_first()
        if one["source_name"].startswith("电影："):
            one["source_name"] = one["source_name"].replace("电影：","")

        one["source_url"] = response.url
        one["source_id"] = get_source_id(response.url)

        img_url = response.xpath("//div[@class='movie-pic']/a/img/@src").extract_first()
        if img_url:
            if not img_url.startswith("http:"):
                img_url = "http:"+img_url
            one["source_stills"] = img_url
        else:
            one["source_stills"] = ""

        desc = response.xpath("//span[@class='full_intro']/text()").extract_first()
        if desc:
            one["source_desc"] = desc.replace("&nbsp;","").replace("\xa0","")
        else:
            one["source_desc"] = ""

        one["from_web"] = self.web

        dom = response.xpath("//ul[@class='cfix mB20']/li")
        for li in dom:
            span = li.xpath("./span/text()").extract_first()
            if "上映时间" in span:
                one["year"] = get_year(span)
            elif "地区" in span:
                area = li.xpath("./a/text()").extract_first()
                one["area"] = area
            elif "类型" in span:
                classify = li.xpath("./a/text()").extract()
                classify = ";".join(classify)
                one["classify"] = classify
            elif "主演" in span:
                starring = li.xpath("./a/text()").extract()
                starring = ";".join(starring)
                one["starring"] = starring
            elif "导演" in span:
                director = li.xpath("./a/text()").extract()
                director = ";".join(director)
                one["director"] = director
        one["video_num"] = 1
        one["type_"] = "电影"

        video = VideoItem()
        video["source_name"] = one["source_name"]
        video["source_url"] = response.xpath("//a[@class='btn-playFea']/@href").extract_first()
        if not video["source_url"].startswith("http:"):
            video["source_url"] = "http:" + video["source_url"]
        video["source_video_id"] = get_source_id(video["source_url"])
        video["episode_num"] = 1
        video["from_web"] = self.web
        
        one["video_list"] = [video]
        yield one
