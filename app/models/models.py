# class SourceEpisode(db.Model):
#     """
#     the table to storage all episode from different websites
#     """
#     __tablename__ = "source_episode"
#
#     DOWNLOAD_ERROR = -1  # any video download error. priority: 1
#     DOWNLOAD_NOT_TRIGGERED = 1  # all videos do not trigger downloading
#     DOWNLOADING = 2  # any video is downloading  priority: 2
#     DOWNLOAD_FINISHED = 3  # all videos downloaded
#
#     UPLOAD_ERROR = -1
#     UPLOAD_NOT_TRIGGERED = 1
#     UPLOADING = 2
#     UPLOAD_FINISHED = 3
#
#     id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)
#     episode_id = db.Column("episode_id", INTEGER, nullable=False, doc="foreign key of episode's id")
#     web_id = db.Column("web_id", INTEGER, nullable=False)
#     source_name = db.Column("source_name", VARCHAR(length=255), nullable=False)
#     source_url = db.Column("source_url", VARCHAR(length=255), nullable=False)
#     source_id = db.Column("source_id", VARCHAR(255), nullable=False, server_default="",
#                           doc="episode id in source website, it can be string")
#     source_stills = db.Column("source_stills", VARCHAR(length=255), nullable=False, server_default="")
#     source_desc = db.Column("source_desc", TEXT(length=65535), nullable=False, default="")
#     fitamos = db.Column("fitamos", VARCHAR(20), nullable=False, server_default="s")
#     vv = db.Column("vv", BIGINT, doc="number of video view in the website", nullable=False, server_default="0")
#     deleted = db.Column("deleted", SMALLINT, nullable=False, server_default="0", doc="0: no; 1: yes")
#     download_status = db.Column("download_status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED),
#                                 doc="1:all videos not start downloading; 3: all videos downloaded; 2: else")
#     download_num = db.Column("download_num", SMALLINT, nullable=False, server_default="0",
#                              doc="number of videos downloaded")
#     upload_status = db.Column("upload_status", SMALLINT, nullable=False, server_default=str(UPLOAD_NOT_TRIGGERED))
#     # upload_num = db.Column("upload_num", SMALLINT, nullable=False, server_default="0",
#     #                        doc="number of videos uploaded")
#     update_status = db.Column("update_status", SMALLINT, nullable=False, server_default="1",
#                               doc="update status in source web. 1:updating; 2:update finished;")
#     accessable = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1),
#                            doc="accessable in source site; 0: no; 1: yes;")
#     last_update_time = db.Column("last_update_time", TIMESTAMP,
#                                  doc="last modify(add video in the case of update_status is 0, updating)"
#                                      "time of episode in table")
#     create_time = db.Column("create_time", TIMESTAMP, nullable=False, server_default=func.now(),
#                             doc="timestamp of row inserted")
#
#     episodeIndex = Index("episode_id", episode_id)
#
#     name = db.Column("name", VARCHAR(length=255), nullable=False, server_default="",
#                      doc="default: name_cn first, name_tw second, name_en last")
#     name_cn = db.Column("name_cn", VARCHAR(length=255), nullable=False, server_default="")
#     name_tw = db.Column("name_tw", VARCHAR(length=255), nullable=False, server_default="")
#     name_en = db.Column("name_en", VARCHAR(length=255), nullable=False, server_default="")
#     area_id = db.Column("area_id", INTEGER, nullable=False, server_default=str(Area.OTHERS))
#     alias = db.Column("alias", VARCHAR(length=255), nullable=False, server_default="",
#                       doc="example: aaa;bbb;ccc. spilt by ';'")
#     classify = db.Column("classify", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     starring = db.Column("starring", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     director = db.Column("director", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     video_num = db.Column("video_num", INTEGER, nullable=False, server_default="0")
#     year = db.Column("year", SMALLINT, nullable=False, server_default="0", doc="year of first show")
#     # text type can't have server default value
#     stills = db.Column("stills", VARCHAR(length=255), nullable=False, server_default="",
#                        doc="url of stills")
#     vip = db.Column("vip",SMALLINT, server_default="0")
#     upload_vsp_status = db.Column("upload_vsp_status", SMALLINT, server_default=str(0))
#     selected = db.Column("selected", SMALLINT, server_default=str(0), doc='0:未选用, 1:选用, 2:排除')
#
#
#     def __init__(self, **kwargs):
#         for key in kwargs.keys():
#             if kwargs[key] is None:
#                 kwargs.pop(key)
#         self.__dict__.update(kwargs)
#
#     @classmethod
#     def is_exists(cls, **kwargs):
#         # todo: optimize exists verify method
#         get_row = kwargs.get("get_row")
#         source_episode_id = kwargs.get("source_episode_id")
#         if source_episode_id is not None:
#             filter_clause = and_(cls.id == source_episode_id)
#         else:
#             web_id = kwargs.get("web_id")
#             source_id = kwargs.get("source_id")
#             if not all([web_id, source_id]):
#                 raise AssertionError("web_id and source_id must be set")
#             filter_clause = and_(cls.web_id == web_id, cls.source_id == source_id)
#         if get_row:
#             return cls.query.filter(filter_clause).first()
#         return cls.query.filter(filter_clause).count()
#
#
# class Video(db.Model):
#     """
#     all videos of episode
#     """
#     __tablename__ = "video"
#
#     DOWNLOAD_ERROR = -1
#     UPLOAD_ERROR = -2
#
#     DOWNLOAD_NOT_TRIGGERED = 1  # data catch finished
#     DOWNLOAD_PENDING = 2
#     DOWNLOADING = 3
#     DOWNLOADED = 4
#     UPLOAD_PENDING = 5
#     UPLOADING = 6
#     UPLOADED = 7
#
#     id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)  # 数据库中的id
#     source_episode_id = db.Column("source_episode_id", INTEGER, nullable=False,
#                                   doc="foreign key of source_episode's id")
#     source_video_id = db.Column("source_video_id", VARCHAR(length=255), nullable=False, doc="video id in source website")
#     episode_num = db.Column("episode_num", SMALLINT, nullable=False, doc="1 means episode 1")
#     web_id = db.Column("web_id", INTEGER, nullable=False,
#                        doc="video source web id;it may be different with source_episode web_id eg. 123kubo")
#     source_url = db.Column("source_url", TEXT(length=65535), nullable=False, doc="source url of video")
#     status = db.Column("status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED))
#     deleted = db.Column("deleted", SMALLINT, nullable=False, server_default=str(0), doc="0: no; 1: yes")
#     video_format = db.Column("video_format", VARCHAR(length=255), nullable=False, server_default="")
#     size = db.Column("size", INTEGER, nullable=False, server_default=str(0), doc="size of the video, unit: byte")
#     width = db.Column("width", INTEGER, nullable=False, server_default=str(0), doc="width of the video")
#     height = db.Column("height", INTEGER, nullable=False, server_default=str(0), doc="height of the video")
#     duration = db.Column("duration", INTEGER, nullable=False, server_default=str(0),
#                          doc="length of the video, unit: second")
#     hash = db.Column("hash", VARCHAR(255), nullable=False, server_default="",
#                      doc="hash of the video; use qiniu hash algorithm")
#     accessable = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1),
#                            doc="accessable in source site;0: no; 1: yes;")
#     download_speed = db.Column("download_speed", INTEGER, nullable=False, server_default=str(0),
#                                doc="unit: byte")
#     download_percent = db.Column("download_percent", FLOAT(), nullable=False, server_default=str(0))
#     create_time = db.Column("create_time", TIMESTAMP, nullable=False, server_default=func.now(),
#                             doc="timestamp of the row inserted")
#     uploaded_time = db.Column("uploaded_time", TIMESTAMP(), doc="timestamp of video upload succeeded if it's required")
#     aws_url = db.Column("aws_url", VARCHAR(255), nullable=False, server_default="")
#
#     sourceEpisodeIndex = Index("source_episode_id", source_episode_id)
#     vip = db.Column("vip",SMALLINT, server_default="0")
#
#     upload_vsp_status = db.Column("upload_vsp_status", SMALLINT, server_default=str(0))
#     source_name = db.Column("source_name", VARCHAR(255))
#
#
#     def __init__(self, **kwargs):
#         for key in kwargs.keys():
#             if kwargs[key] is None:
#                 kwargs.pop(key)
#         self.__dict__.update(kwargs)
#
#     @classmethod
#     def is_exists(cls, **kwargs):
#         # todo: optimize exists verify method
#         get_row = kwargs.get("get_row")
#         video_id = kwargs.get("video_id")
#         if video_id is not None:
#             filter_clause = and_(cls.id == video_id)
#         else:
#             web_id = kwargs.get("web_id")
#             source_video_id = kwargs.get("source_video_id")
#             if not all([web_id, source_video_id]):
#                 raise AssertionError("source_video_id and web_id must be set")
#             filter_clause = and_(cls.source_video_id == source_video_id, cls.web_id == web_id)
#         if get_row:
#             return cls.query.filter(filter_clause).first()
#         return cls.query.filter(filter_clause).count()
#
#     @staticmethod
#     def get_video_hash(file_path=None, input_stream=None):
#         if file_path:
#             return etag(file_path)
#         if input_stream:
#             return etag_stream(input_stream)
#         raise IOError("ERROR VALUE")
#
# class Movie(db.Model):
#     '''
#      Movie table
#     '''
#     __tablename__ = "movie"
#
#     DOWNLOAD_ERROR = -1
#     UPLOAD_ERROR = -2
#
#     DOWNLOAD_NOT_TRIGGERED = 1  # data catch finished
#     DOWNLOAD_PENDING = 2
#     DOWNLOADING = 3
#     DOWNLOADED = 4
#     UPLOAD_PENDING = 5
#     UPLOADING = 6
#     UPLOADED = 7
#
#     id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)
#     web_id = db.Column("web_id", INTEGER, nullable=False)
#     source_name = db.Column("source_name", VARCHAR(length=255), nullable=False)
#     source_url = db.Column("source_url", VARCHAR(length=255), nullable=False)
#     source_id = db.Column("source_id", VARCHAR(255), nullable=False, server_default="",
#                           doc="episode id in source website, it can be string")
#     source_stills = db.Column("source_stills", VARCHAR(length=255), nullable=False, server_default="")
#     source_desc = db.Column("source_desc", TEXT(length=65535), nullable=False, default="")
#     fitamos = db.Column("fitamos", VARCHAR(20), nullable=False, server_default="s")
#     vv = db.Column("vv", BIGINT, doc="number of video view in the website", nullable=False, server_default="0")
#     deleted = db.Column("deleted", SMALLINT, nullable=False, server_default="0", doc="0: no; 1: yes")
#     status = db.Column("status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED))
#     create_time = db.Column("create_time", TIMESTAMP, nullable=False, server_default=func.now(),
#                             doc="timestamp of row inserted")
#
#     MovieIndex = Index("source_id", source_id)
#
#     name_cn = db.Column("name_cn", VARCHAR(length=255), nullable=False, server_default="")
#     name_tw = db.Column("name_tw", VARCHAR(length=255), nullable=False, server_default="")
#     name_en = db.Column("name_en", VARCHAR(length=255), nullable=False, server_default="")
#     area_id = db.Column("area_id", INTEGER, nullable=False, server_default=str(Area.OTHERS))
#     alias = db.Column("alias", VARCHAR(length=255), nullable=False, server_default="",
#                       doc="example: aaa;bbb;ccc. spilt by ';'")
#     classify = db.Column("classify", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     starring = db.Column("starring", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     director = db.Column("director", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     year = db.Column("year", SMALLINT, nullable=False, server_default="0", doc="year of first show")
#
#     video_format = db.Column("video_format", VARCHAR(length=255), nullable=False, server_default="")
#     size = db.Column("size", INTEGER, nullable=False, server_default=str(0), doc="size of the video, unit: byte")
#     width = db.Column("width", INTEGER, nullable=False, server_default=str(0), doc="width of the video")
#     height = db.Column("height", INTEGER, nullable=False, server_default=str(0), doc="height of the video")
#     duration = db.Column("duration", INTEGER, nullable=False, server_default=str(0),
#                          doc="length of the video, unit: second")
#     hash = db.Column("hash", VARCHAR(255), nullable=False, server_default="",
#                      doc="hash of the video; use qiniu hash algorithm")
#     accessable = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1),
#                            doc="accessable in source site;0: no; 1: yes;")
#     download_speed = db.Column("download_speed", INTEGER, nullable=False, server_default=str(0),
#                                doc="unit: byte")
#     download_percent = db.Column("download_percent", FLOAT(), nullable=False, server_default=str(0))
#     uploaded_time = db.Column("uploaded_time", TIMESTAMP(), doc="timestamp of video upload succeeded if it's required")
#     aws_url = db.Column("aws_url", VARCHAR(255), nullable=False, server_default="")
#
#     group_id = db.Column("group_id", VARCHAR(255), nullable=False)
#     vip = db.Column("vip",SMALLINT, server_default="0")
#
#     upload_vsp_status = db.Column("upload_vsp_status", SMALLINT, server_default=str(0))
#     selected = db.Column("selected", SMALLINT, server_default=str(0), doc='0:未选用, 1:选用, 2:排除')
#
#
#
#
#     def __init__(self, **kwargs):
#         for key in kwargs.keys():
#             if kwargs[key] is None:
#                 kwargs.pop(key)
#         self.__dict__.update(kwargs)
#
#     @classmethod
#     def is_exists(cls, **kwargs):
#         # todo: optimize exists verify method
#         get_row = kwargs.get("get_row")
#         movie_id = kwargs.get("movie_id")
#         if movie_id is not None:
#             filter_clause = and_(cls.id == movie_id)
#         else:
#             web_id = kwargs.get("web_id")
#             source_id =kwargs.get("source_id")
#             filter_clause = and_(cls.web_id == web_id, cls.source_id == source_id)
#         if get_row:
#             return cls.query.filter(filter_clause).first()
#         return cls.query.filter(filter_clause).count()
#
# class SourceShow(db.Model):
#     """
#     the table to storage all episode from different websites
#     """
#     __tablename__ = "source_show"
#
#     DOWNLOAD_ERROR = -1  # any video download error. priority: 1
#     DOWNLOAD_NOT_TRIGGERED = 1  # all videos do not trigger downloading
#     DOWNLOADING = 2  # any video is downloading  priority: 2
#     DOWNLOAD_FINISHED = 3  # all videos downloaded
#
#     UPLOAD_ERROR = -1
#     UPLOAD_NOT_TRIGGERED = 1
#     UPLOADING = 2
#     UPLOAD_FINISHED = 3
#
#     id          = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)
#     web_id      = db.Column("web_id", INTEGER, nullable=False)
#     source_name = db.Column("source_name", VARCHAR(length=255), nullable=False)
#     source_url  = db.Column("source_url", VARCHAR(length=255), nullable=False)
#     source_id   = db.Column("source_id", VARCHAR(255), nullable=False, server_default="",
#                           doc="show id in source website, it can be string")
#     source_stills   = db.Column("source_stills", VARCHAR(length=255), nullable=False, server_default="")
#     source_desc     = db.Column("source_desc", TEXT(length=65535), nullable=False, default="")
#     fitamos         = db.Column("fitamos", VARCHAR(20), nullable=False, server_default="s")
#     vv              = db.Column("vv", BIGINT, doc="number of video view in the website", nullable=False, server_default="0")
#     deleted         = db.Column("deleted", SMALLINT, nullable=False, server_default="0", doc="0: no; 1: yes")
#     download_status = db.Column("download_status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED),
#                                 doc="1:all videos not start downloading; 3: all videos downloaded; 2: else")
#     download_num = db.Column("download_num", SMALLINT, nullable=False, server_default="0",
#                              doc="number of videos downloaded")
#     upload_status = db.Column("upload_status", SMALLINT, nullable=False, server_default=str(UPLOAD_NOT_TRIGGERED))
#     # upload_num = db.Column("upload_num", SMALLINT, nullable=False, server_default="0",
#     #                        doc="number of videos uploaded")
#     update_status = db.Column("update_status", SMALLINT, nullable=False, server_default="1",
#                               doc="update status in source web. 1:updating; 2:update finished;")
#     accessable = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1),
#                            doc="accessable in source site; 0: no; 1: yes;")
#     last_update_time = db.Column("last_update_time", TIMESTAMP,
#                                  doc="last modify(add video in the case of update_status is 0, updating)"
#                                      "time of show in table")
#     create_time = db.Column("create_time", TIMESTAMP, nullable=False, server_default=func.now(),
#                             doc="timestamp of row inserted")
#
#     name = db.Column("name", VARCHAR(length=255), nullable=False, server_default="",
#                      doc="default: name_cn first, name_tw second, name_en last")
#     name_cn = db.Column("name_cn", VARCHAR(length=255), nullable=False, server_default="")
#     name_tw = db.Column("name_tw", VARCHAR(length=255), nullable=False, server_default="")
#     name_en = db.Column("name_en", VARCHAR(length=255), nullable=False, server_default="")
#     area_id = db.Column("area_id", INTEGER, nullable=False, server_default=str(Area.OTHERS))
#     alias = db.Column("alias", VARCHAR(length=255), nullable=False, server_default="",
#                       doc="example: aaa;bbb;ccc. spilt by ';'")
#     classify = db.Column("classify", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     starring = db.Column("starring", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     director = db.Column("director", VARCHAR(length=255), nullable=False, server_default="",
#                          doc="example: aaa;bbb;ccc. spilt by ';'")
#     video_num = db.Column("video_num", INTEGER, nullable=False, server_default="0")
#     year = db.Column("year", SMALLINT, nullable=False, server_default="0", doc="year of first show")
#     vip = db.Column("vip",SMALLINT, server_default="0")
#     upload_vsp_status = db.Column("upload_vsp_status", SMALLINT, server_default=str(0))
#     selected = db.Column("selected", SMALLINT, server_default=str(0), doc='0:未选用, 1:选用, 2:排除')
#
#
#     def __init__(self, **kwargs):
#         for key in kwargs.keys():
#             if kwargs[key] is None:
#                 kwargs.pop(key)
#         self.__dict__.update(kwargs)
#
#     @classmethod
#     def is_exists(cls, **kwargs):
#         # todo: optimize exists verify method
#         get_row = kwargs.get("get_row")
#         source_show_id = kwargs.get("source_show_id")
#         if source_show_id is not None:
#             filter_clause = and_(cls.id == source_show_id)
#         else:
#             web_id = kwargs.get("web_id")
#             source_id = kwargs.get("source_id")
#             if not all([web_id, source_id]):
#                 raise AssertionError("web_id and source_id must be set")
#             filter_clause = and_(cls.web_id == web_id, cls.source_id == source_id)
#         if get_row:
#             return cls.query.filter(filter_clause).first()
#         return cls.query.filter(filter_clause).count()
#
# class ShowVideo(db.Model):
#     """
#     all videos of show
#     """
#     __tablename__ = "ShowVideo"
#
#     DOWNLOAD_ERROR = -1 # 影片下载报错
#     UPLOAD_ERROR   = -2 # 影片上传报错
#
#     DOWNLOAD_NOT_TRIGGERED = 1  # 影片待下载
#     DOWNLOAD_PENDING       = 2  # 影片在队列中
#     DOWNLOADING            = 3  # 影片下载中
#     DOWNLOADED             = 4  # 影片下载完成
#     UPLOAD_PENDING         = 5  # 影片在上传队列中
#     UPLOADING              = 6  # 影片上传中
#     UPLOADED               = 7  # 影片上传完成
#
#     id                = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)  # 数据库中的id
#     source_show_id    = db.Column("source_show_id", INTEGER, nullable=False,doc="foreign key of source_show's id") # 外键 连接到source_show
#     source_video_id   = db.Column("source_video_id", VARCHAR(length=255), nullable=False, doc="video id in source website") # 在目标网站里的视频id
#     source_video_name = db.Column("source_video_name", VARCHAR(length=255), nullable=False, doc="video name") # 视频名
#     show_num          = db.Column("show_num", VARCHAR(length=255), nullable=False) # 综艺节目的期号
#     web_id            = db.Column("web_id", INTEGER, nullable=False, doc="video source web id;it may be different with source_show web_id eg. 123kubo") # 目标网站id
#     source_url        = db.Column("source_url", TEXT(length=65535), nullable=False, doc="source url of video") # 视频的url
#     status            = db.Column("status", SMALLINT, nullable=False, server_default=str(DOWNLOAD_NOT_TRIGGERED)) # 视频的下载上传状态
#     deleted           = db.Column("deleted", SMALLINT, nullable=False, server_default=str(0), doc="0: no; 1: yes") # 视频是否删除
#     video_format      = db.Column("video_format", VARCHAR(length=255), nullable=False, server_default="") # 视频文件类型
#     size              = db.Column("size", INTEGER, nullable=False, server_default=str(0), doc="size of the video, unit: byte") # 视频文件大小
#     width             = db.Column("width", INTEGER, nullable=False, server_default=str(0), doc="width of the video") # 视频画面长度
#     height            = db.Column("height", INTEGER, nullable=False, server_default=str(0), doc="height of the video") # 视频画面宽度
#     duration          = db.Column("duration", INTEGER, nullable=False, server_default=str(0), doc="length of the video, unit: second") # 视频持续时间
#     hash              = db.Column("hash", VARCHAR(255), nullable=False, server_default="", doc="hash of the video; use qiniu hash algorithm") # 视频hash值
#     accessable        = db.Column("accessable", SMALLINT, nullable=False, server_default=str(1), doc="accessable in source site;0: no; 1: yes;") # 视频是否可以获取
#     download_speed    = db.Column("download_speed", INTEGER, nullable=False, server_default=str(0), doc="unit: byte")# 下载速度
#     download_percent  = db.Column("download_percent", FLOAT(), nullable=False, server_default=str(0)) # 下载进度
#     create_time       = db.Column("create_time", TIMESTAMP(), nullable=False, server_default=func.now(), doc="timestamp of the row inserted") # 创建时间
#     uploaded_time     = db.Column("uploaded_time", TIMESTAMP(), doc="timestamp of video upload succeeded if it's required") # 上传成功时间
#     aws_url           = db.Column("aws_url", VARCHAR(255), nullable=False, server_default="") # aws_s3上的url
#     vip               = db.Column("vip",SMALLINT, server_default="0")
#     upload_vsp_status = db.Column("upload_vsp_status", SMALLINT, server_default=str(0))
#
#
#     def __init__(self, **kwargs):
#         for key in kwargs.keys():
#             if kwargs[key] is None:
#                 kwargs.pop(key)
#         self.__dict__.update(kwargs)
#
#     @classmethod
#     def is_exists(cls, **kwargs):
#         # todo: optimize exists verify method
#         get_row = kwargs.get("get_row")
#         video_id = kwargs.get("video_id")
#         if video_id is not None:
#             filter_clause = and_(cls.id == video_id)
#         else:
#             web_id = kwargs.get("web_id")
#             source_video_id = kwargs.get("source_video_id")
#             if not all([web_id, source_video_id]):
#                 raise AssertionError("source_video_id and web_id must be set")
#             filter_clause = and_(cls.source_video_id == source_video_id, cls.web_id == web_id)
#         if get_row:
#             return cls.query.filter(filter_clause).first()
#         return cls.query.filter(filter_clause).count()
#
#     @staticmethod
#     def get_video_hash(file_path=None, input_stream=None):
#         if file_path:
#             return etag(file_path)
#         if input_stream:
#             return etag_stream(input_stream)
#         raise IOError("ERROR VALUE")
#
# class API_KEY(db.Model):
#     """
#        API_KEY table
#     """
#     __tablename__ = "ApiKey"
#
#     id = db.Column("id", INTEGER, primary_key=True, nullable=False, autoincrement=True)  # 数据库中的id
#     web_id = db.Column("web_id", INTEGER)
#     model = db.Column("model", VARCHAR(50))
#     api_key = db.Column("api_key", VARCHAR(255))
#     account = db.Column("account", VARCHAR(255))
#
#     @classmethod
#     def get_api_key(cls, web_id, model):
#         rows = cls.query.filter_by(web_id=web_id, model=model).first()
#         if rows:
#             return {"api_key":rows.api_key, "account":rows.account}
#         return {}
#
# class Source_Episode_Excel(db.Model):
#     __tablename__ = "source_episode_excel"
#     id = db.Column("id", INTEGER, primary_key=True)  # 数据库中的id
#     web_id = db.Column("web_id", INTEGER)
#     source_name = db.Column("source_name", VARCHAR(255))
#     classify = db.Column("classify")
#     starring = db.Column('starring')
#     year = db.Column('year')
#     area_id = db.Column('area_id')
#     avg_duration = db.Column('avg_duration')
#     vv = db.Column('vv')
#     accessable = db.Column('accessable')
#     source_url = db.Column('source_url')
#     notvip = db.Column('notvip')
#     vip = db.Column('vip')
#     selected = db.Column("selected")
#
# class Source_Show_Excel(db.Model):
#     __tablename__ = "source_show_excel"
#     id = db.Column("id", INTEGER, primary_key=True)  # 数据库中的id
#     web_id = db.Column("web_id", INTEGER)
#     source_name = db.Column("source_name", VARCHAR(255))
#     classify = db.Column("classify")
#     starring = db.Column('starring')
#     year = db.Column('year')
#     area_id = db.Column('area_id')
#     avg_duration = db.Column('avg_duration')
#     vv = db.Column('vv')
#     accessable = db.Column('accessable')
#     source_url = db.Column('source_url')
#     notvip = db.Column('notvip')
#     vip = db.Column('vip')
#     selected = db.Column("selected")
#
#
# class Movie_Excel(db.Model):
#     __tablename__ = "movie_excel"
#
#     id = db.Column("id", INTEGER, primary_key=True)  # 数据库中的id
#     web_id = db.Column("web_id", INTEGER)
#     source_name = db.Column("source_name", VARCHAR(255))
#     classify = db.Column("classify")
#     starring = db.Column('starring')
#     year = db.Column('year')
#     area_id = db.Column('area_id')
#     avg_duration = db.Column('duration')
#     vv = db.Column('vv')
#     accessable = db.Column('accessable')
#     source_url = db.Column('source_url')
#     vip = db.Column('vip')
#     selected = db.Column("selected")
