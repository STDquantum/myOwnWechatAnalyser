import json
import sqlite3
import struct
import requests
import os
import hashlib
import time

# 朋友圈类型
MOMENT_TYPE_IMAGE = 1  # 正常文字图片
MOMENT_TYPE_TEXT_ONLY = 2  # 纯文字
MOMENT_TYPE_SHARED = 3  # 分享
MOMENT_TYPE_VIDEOSHARE = 5  # 分享视频
MOMENT_TYPE_COVER = 7  # 朋友圈封面
MOMENT_TYPE_EMOJI = 10  # 分享了表情包
MOMENT_TYPE_VIDEO = 15  # 视频
MOMENT_TYPE_OAVIDEO = 28  # 视频号
"""
link_from: 视频创作者,
link_content: 视频描述,
link_url: 链接,
link_image: 封面图片
"""
MOMENT_TYPE_APPLET = 30  # 小程序
MOMENT_TYPE_MUSIC = 42  # 音乐


class SnsParser:
    def __init__(self, content, attr):
        self.content = content
        self.attr = attr
        if self._get_ts_value(self.content, 2) != self._get_ts_value(self.attr, 2):
            self.attr = None

    def get_sns_id(self):
        return self.content[1][1]

    def get_username(self):
        return self._get_ts_value(self.content, 2)

    def get_content_text(self):
        return self._get_ts_value(self.content, 5)

    def get_applet(self):
        ret = self.content[8][0][1]
        image = []
        if 5 in ret:
            image = ret[5][0][1][6][1]
        return ret[3][1], image, ret[4][1]

    def get_video_share(self):
        ret = self.content[8][0][1]
        return ret[3][1], ret[4][1], ret[5][0][1][3][1], ret[5][0][1][6][1]

    def get_music_image(self):
        ret = self.content
        return (
            ret[7][0][1][3][1],
            ret[8][0][1][1][1],
            ret[8][0][1][3][1],
            ret[8][0][1][4][1],
            ret[8][0][1][5][0][1][6][1],
            ret[8][0][1][5][0][1][4][1],
        )

    def get_content_medias(self):
        ret = self._get_ts_value(self.content, 8)
        if type(ret) == list and len(ret) > 0:
            ret = ret[0]
            if type(ret) == tuple and len(ret) > 1:
                ret = ret[1]
                if type(ret) == dict:
                    ret = self._get_ts_value(ret, 5)
                    if type(ret) == list and len(ret) > 0:
                        medias = []
                        for media in ret:
                            if type(media) == tuple and len(media) > 1:
                                media = media[1]
                                if type(media) == dict:
                                    media = self._get_ts_value(media, 4)
                                    if media not in [None, ""]:
                                        medias.append(media)
                        return medias
        return None

    def get_type_video(self):
        ret = self.content[8][0][1][5][0][1]
        return [ret[4][1]], [ret[6][1]]

    def get_oa_video_cover(self):
        ret = self.content[8][0][1][9][0][1]
        return ret[3][1], ret[5][1], ret[8][0][1][2][1], ret[8][0][1][3][1]

    def get_url_info(self):
        ret = self._get_ts_value(self.content, 8)
        if type(ret) == list and len(ret) > 0:
            ret = ret[0]
            if type(ret) == tuple and len(ret) > 1:
                ret = ret[1]
                if type(ret) == dict:
                    title = self._get_ts_value(ret, 3)
                    url = self._get_ts_value(ret, 4)
                    return url, title, None
        return (None, None, None)

    def get_timestamp(self):
        return self._get_ts_value(self.content, 4)

    def get_location(self, feed):
        ret = self._get_ts_value(self.content, 6)
        if type(ret) == list and len(ret) > 0:
            ret = ret[0]
            if type(ret) == tuple and len(ret) > 1:
                ret = ret[1]
                if type(ret) == dict:
                    latitude = 0
                    longitude = 0
                    try:
                        latitude = float(self._get_ts_value(ret, 2))
                    except Exception as e:
                        pass
                    try:
                        longitude = float(self._get_ts_value(ret, 1))
                    except Exception as e:
                        pass
                    if latitude != 0 or longitude != 0:
                        feed.location_latitude = latitude
                        feed.location_longitude = longitude
                        try:
                            address1 = self._get_ts_value(ret, 3) or ""
                            address2 = self._get_ts_value(ret, 5) or ""
                            address3 = self._get_ts_value(ret, 15) or ""
                            feed.location_address = " ".join(
                                (address1, address2, address3)
                            )
                        except Exception as e:
                            feed.location_address = None
                        feed.location_type = LOCATION_TYPE_GOOGLE

    def get_likes(self, feed):
        feed.like_count = 0
        ret = self._get_ts_value(self.attr, 9)
        if type(ret) == list and len(ret) > 0:
            for like in ret:
                if type(like) == tuple and len(like) > 1:
                    like = like[1]
                    if type(like) == dict:
                        fl = feed.create_like()
                        fl.sender_id = self._get_ts_value(like, 1)
                        fl.sender_remark = self._get_ts_value(like, 2)
                        try:
                            fl.timestamp = int(self._get_ts_value(like, 6))
                        except Exception as e:
                            pass
                        feed.like_count += 1
        if feed.like_count == 0:
            feed.like_id = 0

    def get_comments(self, feed):
        feed.comment_count = 0
        ret = self._get_ts_value(self.attr, 12)
        if type(ret) == list and len(ret) > 0:
            for comment in ret:
                if type(comment) == tuple and len(comment) > 1:
                    comment = comment[1]
                    if type(comment) == dict:
                        fm = feed.create_comment()
                        fm.sender_id = self._get_ts_value(comment, 1)
                        fm.sender_remark = self._get_ts_value(comment, 2)
                        fm.ref_user_id = self._get_ts_value(comment, 9)
                        if fm.ref_user_id == "":
                            fm.ref_user_id = None
                        fm.content = self._get_ts_value(comment, 5)
                        try:
                            fm.timestamp = self._get_ts_value(comment, 6)
                        except Exception as e:
                            pass
                        feed.comment_count += 1
        if feed.comment_count == 0:
            feed.comment_id = 0

    @staticmethod
    def _get_ts_value(ts, key):
        if ts is not None and key in ts:
            ret = ts[key]
            if type(ret) == tuple and len(ret) > 1:
                return ret[1]
            else:
                return ret
        return None


class tencent_struct:
    __cp__ = {
        1: ("", "I"),
        2: ("", "I"),
    }

    __cw__ = {
        1: ("", "s"),
        2: ("", "s"),
    }
    __cv__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "s"),
    }
    __ar__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "s"),
    }
    __aqt__ = {
        1: ("宽", "f"),
        2: ("高", "f"),
        3: ("", "f"),
    }
    __aqr__ = {
        1: ("", "s"),
        2: ("", "I"),
        3: ("", "s"),
        4: ("原图", "s"),
        5: ("", "I"),
        6: ("缩略图", "s"),
        7: ("", "I"),
        8: ("", "I"),
        9: ("", "s"),
        10: ("", __aqt__),
        11: ("", "s"),
        12: ("", "I"),
        13: ("", "I"),
        14: ("", "I"),
        15: ("", "s"),
        16: ("", "I"),
        17: ("", "s"),
        18: ("", "s"),
        19: ("", "s"),
        20: ("", "s"),
        21: ("", "I"),
        22: ("", "s"),
        23: ("", "s"),
        25: ("", "I"),
        26: ("", "L"),
        27: ("", "s"),
        28: ("", "s"),
        29: ("", "I"),
        30: ("", "s"),
        31: ("", "s"),
        32: ("", "I"),
        33: ("", "s"),
        34: ("", "s"),
        35: ("", "b"),
    }
    __amq__ = {  # location
        1: ("longitude 经度", "f"),
        2: ("latitude 纬度", "f"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", "s"),
        6: ("", "s"),
        7: ("", "I"),
        8: ("", "s"),
        9: ("", "I"),
        10: ("", "I"),
        11: ("", "I"),
        12: ("", "f"),
        13: ("", "P"),
        14: ("", "I"),
        15: ("", "s"),
        16: ("", "s"),
    }

    __cr__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", "s"),
        6: ("", "I"),
    }
    global __fuck1__
    global __fuck__
    __fuck1__ = {
        1: ("", "I"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "I"),
    }
    __fuck__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", "s"),
        6: ("", "I"),
        7: ("", "I"),
        8: ("", __fuck1__),
    }
    __od__ = {
        1: ("", "s"),
        2: ("", "I"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", __aqr__),
        6: ("", "I"),
        7: ("", "s"),
        9: ("", __fuck__),
    }

    __as__ = {
        1: ("", "I"),
        2: ("", "s"),
        3: ("", "I"),
        4: ("", "s"),
        5: ("", "s"),
        6: ("", "s"),
        7: ("", __ar__),
        8: ("", "s"),
        9: ("", __cp__),
        10: ("", __cw__),
        11: ("", __cv__),
        12: ("", __cv__),
    }
    __bih__ = {
        1: ("", "s"),
        2: ("", "s"),
    }
    __bsl__ = {
        1: ("", "s"),
        2: ("", "s"),
    }
    __bzu__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", "s"),
        6: ("", "s"),
        7: ("", "s"),
        8: ("", "s"),
    }
    __bjs__ = {  # wechat sns feed
        1: ("朋友圈id", "s"),
        2: ("sender_id", "s"),
        3: ("", "I"),
        4: ("timestamp 时间戳", "I"),
        5: ("", "s"),
        6: ("位置信息", __amq__),
        7: ("", __cr__),
        8: ("多媒体信息", __od__),
        9: ("", "s"),
        10: ("", "s"),
        11: ("", "s"),
        12: ("", "I"),
        13: ("", "I"),
        14: ("", "s"),
        15: ("", __as__),
        16: ("", "I"),
        17: ("", __bih__),
        18: ("", "s"),
        19: ("", "s"),
        20: ("", __bsl__),
        21: ("", "I"),
        22: ("", __bzu__),
    }

    __bae__ = {
        1: ("", "s"),
    }
    __ew__ = {
        1: ("", "I"),
        2: ("", __bae__),
    }
    __bft__ = {
        1: ("", "L"),
    }
    __bjn__ = {
        1: ("", __ew__),
    }
    __auu__ = {
        1: ("", "I"),
        2: ("", "I"),
        3: ("", "s"),
    }
    __bfj__ = {
        1: ("", "s"),
        2: ("", "I"),
        3: ("", "s"),
        4: ("", "s"),
        5: ("", "I"),
        6: ("", "I"),
    }
    __bfn__ = {
        1: ("", "s"),
        2: ("", "s"),
        3: ("", "I"),
        4: ("", "I"),
        5: ("", "s"),
        6: ("", "I"),
        7: ("", "I"),
        8: ("", "I"),
        9: ("", "s"),
        10: ("", "I"),
        11: ("", "L"),
        12: ("", "L"),
        13: ("", "I"),
        14: ("", "I"),
    }
    __bad__ = {
        1: ("", "I"),
        2: ("", "P"),
    }
    __bfy__ = {
        1: ("", "L"),
        2: ("", "s"),
        3: ("", "s"),
        4: ("", "I"),
        5: ("", __bad__),
        6: ("", "I"),
        7: ("", "I"),
        8: ("", "I"),
        9: ("", __bfn__),
        10: ("", "I"),
        11: ("", "I"),
        12: ("", __bfn__),
        13: ("", "I"),
        14: ("", "I"),
        15: ("", __bfn__),
        16: ("", "I"),
        17: ("", "I"),
        18: ("", "I"),
        19: ("", __bft__),
        20: ("", "I"),
        21: ("", "s"),
        22: ("", "L"),
        23: ("", "I"),
        24: ("", __bae__),
        25: ("", "I"),
        26: ("", "I"),
        27: ("", __bae__),
        28: ("", __bad__),
        29: ("", __bjn__),
        30: ("", __auu__),
        31: ("", __bfj__),
    }

    def __readString(self):
        try:
            length = self.__readUleb()
            res = self.__data[self.__off : self.__off + length]
            self.__add(length)
        except:
            raise
        return res.decode("utf-8")

    def __readUleb(self):
        try:
            i = self.__data[self.__off]
            self.__add()
            if i & 0x80:
                j = self.__data[self.__off]
                i = i & 0x7F
                i = i | (j << 7)
                self.__add()
                if i & 0x4000:
                    j = self.__data[self.__off]
                    i = i & 0x3FFF
                    i = i | (j << 14)
                    self.__add()
                    if i & 0x200000:
                        j = self.__data[self.__off]
                        i = i & 0x1FFFFF
                        i = i | (j << 21)
                        self.__add()
                        if i & 0x10000000:
                            j = self.__data[self.__off]
                            i = i & 0xFFFFFFF
                            i = i | (j << 28)
                            self.__add()
            return i
        except:
            raise

    def __readFloat(self):
        try:
            f = struct.unpack("f", self.__data[self.__off : self.__off + 4])
            self.__add(4)
            return f[0]
        except:
            raise

    def __readData(self):
        try:
            length = self.__readUleb()
            data = self.__data[self.__off : self.__off + length]
            self.__add(length)
            return data
        except:
            raise

    def __readChar(self):
        c = None
        try:
            c = self.__data[self.__off]
            self.__add()
        except:
            raise
        return c

    def __readBool(self):
        try:
            return self.__readUleb() != 0
        except:
            raise

    def __readUlong(self):
        i = 0
        j = 0
        l = 0
        while True:
            assert i < 64
            try:
                j = self.__readChar()
            except:
                raise
            l = l | (j & 0x7F) << i
            if (j & 0x80) == 0:
                return l
            i = i + 7

    def __readSSleb(self):
        res = self.__readUleb()
        return res

    def __readSSlong(self):
        res = self.__readUlong()
        return res

    __contenttype__ = {
        "s": __readString,
        "i": __readSSleb,
        "I": __readUleb,
        "f": __readFloat,
        "P": __readData,
        "l": __readSSlong,
        "L": __readUlong,
        "b": __readBool,
    }

    def __init__(self, data=None, off=0):
        self.__data = data
        self.__off = off
        if self.__data:
            self.__size = len(self.__data)
        else:
            self.__size = 0

    def __add(self, value=1):
        self.__off += value
        if self.__off > self.__size:
            raise "偏移值超出数据大小"

    def __setVals__(self, data, off):
        if data:
            self.__data = data
        if self.__data:
            self.__size = len(self.__data)
        self.__off = off

    def getSnsAttrBuf(self, data=None, off=0):
        self.__setVals__(data, off)
        try:
            return self.readStruct("__bfy__")
        except:
            raise

    def getSnsContent(self, data=None, off=0):
        self.__setVals__(data, off)
        return self.readStruct("__bjs__")

    def __readUleb(self):
        i = self.__data[self.__off]
        self.__add()
        if i & 0x80:
            j = self.__data[self.__off]
            i = i & 0x7F
            i = i | (j << 7)
            self.__add()
            if i & 0x4000:
                j = self.__data[self.__off]
                i = i & 0x3FFF
                i = i | (j << 14)
                self.__add()
                if i & 0x200000:
                    j = self.__data[self.__off]
                    i = i & 0x1FFFFF
                    i = i | (j << 21)
                    self.__add()
                    if i & 0x10000000:
                        j = self.__data[self.__off]
                        i = i & 0xFFFFFFF
                        i = i | (j << 28)
                        self.__add()
        return i

    def readStruct(self, struct_type):
        current_dict = None
        if isinstance(struct_type, str):
            current_dict = getattr(self, struct_type)
        else:
            current_dict = struct_type
        res = {}
        try:
            while self.__off < self.__size:
                key = self.__readUleb()
                key = key >> 3
                if key == 0:
                    break
                op = None
                fieldName = ""
                if key in current_dict:
                    op = current_dict[key][1]
                    fieldName = current_dict[key][0]
                else:
                    break
                if isinstance(op, dict):
                    if not key in res:
                        res[key] = []
                    current_struct = self.__readData()
                    recursion = tencent_struct(current_struct)
                    res[key].append((fieldName, recursion.readStruct(op)))
                elif op != "":
                    res[key] = (fieldName, self.__contenttype__[op](self))
                else:
                    break
        except:
            raise
        return res


class Column(object):
    def __init__(self):
        self.source = ""
        self.deleted = 0
        self.repeated = 0

    def get_values(self):
        return self.source, self.deleted, self.repeated


LOCATION_TYPE_GPS = 1  # GPS坐标
LOCATION_TYPE_GPS_MC = 2  # GPS米制坐标
LOCATION_TYPE_GOOGLE = 3  # GCJ02坐标
LOCATION_TYPE_GOOGLE_MC = 4  # GCJ02米制坐标
LOCATION_TYPE_BAIDU = 5  # 百度经纬度坐标
LOCATION_TYPE_BAIDU_MC = 6  # 百度米制坐标
LOCATION_TYPE_MAPBAR = 7  # mapbar地图坐标
LOCATION_TYPE_MAP51 = 8  # 51地图坐标


g_feed_like_id = 1
g_feed_comment_id = 1

contact_map = json.load(
    open(".\\result\\database\\contact.json", "r", encoding="utf-8")
)


class Feed(Column):
    def __init__(self):
        global g_feed_comment_id, g_feed_like_id
        super(Feed, self).__init__()
        self.sns_id = None  # 朋友圈ID[TEXT]
        self.account_id = None  # 账号ID[TEXT]
        self.account_name = None  # 账号昵称[TEXT]
        self.sender_id = None  # 发布者ID[TEXT]
        self.sender_remark = None  # 发布者昵称[TEXT]
        self.type = None  # 朋友圈类型[INT]
        self.content = None  # 文本[TEXT]
        self.image_path = []  # 图片地址[List]
        self.custom_image_path = []  # 本地图片地址[List]
        self.video_path = []  # 视频地址[List]
        self.custom_video_path = []  # 本地视频地址[List]
        self.timestamp = None  # 发布时间[INT]
        self.link_url = None  # 链接地址[TEXT]
        self.link_title = None  # 链接标题[TEXT]
        self.link_content = None  # 链接内容[TEXT]
        self.link_image = None  # 链接图片[TEXT]
        self.custom_link_image = None  # 本地链接图片[TEXT]
        self.link_from = None  # 链接来源[TEXT]
        self.like_id = g_feed_like_id  # 赞ID[INT]
        g_feed_like_id += 1
        self.like_count = 0  # 赞数量[INT]
        self.comment_id = g_feed_comment_id  # 评论ID[INT]
        g_feed_comment_id += 1
        self.comment_count = 0  # 评论数量[INT]
        self.location_latitude = 0  # 地址纬度[REAL]
        self.location_longitude = 0  # 地址经度[REAL]
        self.location_elevation = 0  # 地址海拔[REAL]
        self.location_address = None  # 地址名称[TEXT]
        self.location_type = LOCATION_TYPE_GPS  # 地址类型[INT]，LOCATION_TYPE

        self.likes = []
        self.comments = []

    def get_values(self):
        return (
            self.account_id,
            self.sender_id,
            self.content,
            self.image_path,
            self.video_path,
            self.timestamp,
            self.link_url,
            self.link_title,
            self.link_content,
            self.link_image,
            self.link_from,
            self.like_id,
            self.like_count,
            self.comment_id,
            self.comment_count,
            self.location_latitude,
            self.location_longitude,
            self.location_elevation,
            self.location_address,
            self.location_type,
        ) + super(Feed, self).get_values()

    def create_like(self):
        like = FeedLike()
        like.like_id = self.like_id
        like.deleted = self.deleted
        like.source = self.source
        self.likes.append(like)
        return like

    def create_comment(self):
        comment = FeedComment()
        comment.comment_id = self.comment_id
        comment.deleted = self.deleted
        comment.source = self.source
        self.comments.append(comment)
        return comment

    def process_remark(self):
        self.account_remark = (
            contact_map[self.account_id]["conRemark"]
            or contact_map[self.account_id]["nickname"]
        )
        self.sender_remark = (
            contact_map[self.sender_id]["conRemark"]
            or contact_map[self.sender_id]["nickname"]
        )
        for like in self.likes:
            like.sender_remark = (
                contact_map[like.sender_id]["conRemark"]
                or contact_map[like.sender_id]["nickname"]
            )
        for comment in self.comments:
            comment.sender_remark = (
                contact_map[comment.sender_id]["conRemark"]
                or contact_map[comment.sender_id]["nickname"]
            )


class FeedLike(Column):
    def __init__(self):
        super(FeedLike, self).__init__()
        self.like_id = None  # 赞ID[INT]
        self.sender_id = None  # 发布者ID[TEXT]
        self.sender_remark = None  # 发布者昵称[TEXT]
        self.timestamp = None  # 发布时间[INT]

    def get_values(self):
        return (
            self.like_id,
            self.sender_id,
            self.sender_remark,
            self.timestamp,
        ) + super(FeedLike, self).get_values()


class FeedComment(Column):
    def __init__(self):
        super(FeedComment, self).__init__()
        self.comment_id = None  # 评论ID[INT]
        self.sender_id = None  # 发布者ID[TEXT]
        self.sender_remark = None  # 发布者昵称[TEXT]
        self.ref_user_id = None  # 回复用户ID[TEXT]
        self.ref_user_name = None  # 回复用户昵称[TEXT]
        self.content = None  # 评论内容[TEXT]
        self.timestamp = None  # 发布时间[INT]

    def get_values(self):
        return (
            self.comment_id,
            self.sender_id,
            self.sender_remark,
            self.ref_user_id,
            self.ref_user_name,
            self.content,
            self.timestamp,
        ) + super(FeedComment, self).get_values()


class SnsParse:
    def __init__(self) -> None:
        pass

    def _parse_wc_db(self, path="SnsMicroMsg.db"):
        conn = sqlite3.connect(path)
        c = conn.cursor()
        readTable = c.execute(
            "SELECT type, userName, content, attrBuf from SnsInfo where userName not like 'v3_%@stranger'"
        )
        snsList = []
        for ttype, username, content, attr in readTable:
            feed = self._parse_wc_db_with_value(ttype, username, content, attr)
            snsList.append(feed)
        conn.close()
        snsList.sort(key=lambda x: x.timestamp, reverse=True)
        return snsList

    def _parse_wc_db_with_value(self, ttype, username, content_blob, attr_blob):
        content = None
        attr = None
        content = tencent_struct().getSnsContent(content_blob)
        attr = tencent_struct().getSnsAttrBuf(attr_blob)
        if content is None:
            return
        sns = SnsParser(content, attr)
        if username != sns.get_username():
            return

        moment_type = ttype

        feed = Feed()
        feed.type = ttype
        global Account
        feed.account_id = Account
        feed.sender_id = username
        feed.sns_id = sns.get_sns_id()
        feed.content = sns.get_content_text()
        feed.timestamp = sns.get_timestamp()

        if moment_type == MOMENT_TYPE_IMAGE:
            medias = sns.get_content_medias()
            feed.image_path = [str(m) for m in medias]
        elif moment_type == MOMENT_TYPE_VIDEO:
            feed.video_path, feed.image_path = sns.get_type_video()
        elif moment_type == MOMENT_TYPE_SHARED:
            medias = sns.get_content_medias()
            if medias is not None:
                feed.link_image = medias[0]
            feed.link_url, feed.link_title, feed.link_content = sns.get_url_info()
        elif moment_type == MOMENT_TYPE_MUSIC:
            (
                feed.link_from,
                feed.link_title,
                feed.link_content,
                feed.link_url,
                feed.link_image,
                feed.video_path,
            ) = sns.get_music_image()
            feed.video_path = [feed.video_path]
        elif moment_type == MOMENT_TYPE_COVER:
            feed.image_path = sns.get_content_medias()
        elif moment_type == MOMENT_TYPE_VIDEOSHARE:
            (
                feed.link_content,
                feed.link_url,
                feed.link_from,
                feed.link_image,
            ) = sns.get_video_share()
        elif moment_type == MOMENT_TYPE_OAVIDEO:
            (
                feed.link_from,
                feed.link_content,
                feed.link_url,
                feed.link_image,
            ) = sns.get_oa_video_cover()
        elif moment_type == MOMENT_TYPE_APPLET:
            feed.link_content, feed.link_image, feed.link_url = sns.get_applet()

        sns.get_location(feed)
        sns.get_likes(feed)
        sns.get_comments(feed)

        feed.process_remark()

        return feed


class ImageDownload:
    def __init__(self) -> None:
        pass

    def downloadImage(self, imageUrl: str | None):
        if imageUrl is None or imageUrl == "":
            return None
        print(imageUrl)
        md5 = hashlib.md5()
        md5.update(imageUrl.encode("utf-8"))
        md5_hash = md5.hexdigest()
        image_root = "./result/images"
        custom_path = os.path.join(image_root, md5_hash + ".jpg")
        if os.path.exists(custom_path):
            custom_path = "./image/" + os.path.basename(custom_path)
            print(custom_path)
            return custom_path
        res = requests.get(imageUrl)
        while res.status_code != 200:
            time.sleep(2)
            print("下载重试中")
            res = requests.get(imageUrl)
        custom_name = md5_hash + self.imageExt(res.content[0])
        custom_path = os.path.join(image_root, custom_name)
        with open(custom_path, "wb") as f:
            f.write(res.content)
        custom_path = "./image/" + os.path.basename(custom_path)
        print(custom_path)
        return custom_path

    def downloadImages(self, snss: SnsParse):
        os.makedirs(".\\result\\images", exist_ok=True)
        for sns in snss:
            if sns.sender_id != sns.account_id:
                continue
            sns.custom_image_path = []
            for image in sns.image_path:
                sns.custom_image_path.append(self.downloadImage(image))

            sns.custom_link_image = self.downloadImage(sns.link_image)

def to_json(snsList: list):
    jsonList = []
    for feed in snsList:
        jsonList.append({
            "sns_id": feed.sns_id,
            "account_id": feed.account_id,
            "account_remark": feed.account_remark,
            "sender_id": feed.sender_id,
            "sender_remark": feed.sender_remark,
            "timestamp": feed.timestamp,
            "type": feed.type,
            "content": feed.content,
            "comment_count": feed.comment_count,
            "comment_id": feed.comment_id,
            "comments": [
                {
                    "comment_id": com.comment_id,
                    "sender_id": com.sender_id,
                    "sender_remark": com.sender_remark,
                    "ref_user_id": com.ref_user_id,
                    "ref_user_name": com.ref_user_name,
                    "content": com.content,
                    "timestamp": com.timestamp,
                }
                for com in feed.comments
            ],
            "image_path": feed.image_path,
            "custom_image_path": feed.custom_image_path,
            "like_count": feed.like_count,
            "like_id": feed.like_id,
            "likes": [
                {
                    "like_id": lik.like_id,
                    "sender_id": lik.sender_id,
                    "sender_remark": lik.sender_remark,
                    "timestamp": lik.timestamp,
                }
                for lik in feed.likes
            ],
            "link_content": feed.link_content,
            "link_from": feed.link_from,
            "link_image": feed.link_image,
            "custom_link_image": feed.custom_link_image,
            "link_title": feed.link_title,
            "link_url": feed.link_url,
            "location_address": feed.location_address,
            "location_elevation": feed.location_elevation,
            "location_latitude": feed.location_latitude,
            "location_longitude": feed.location_longitude,
            "location_type": feed.location_type,
            "source": feed.source,
            "repeated": feed.repeated,
            "video_path": feed.video_path,
            "custom_video_path": feed.custom_video_path,
        })
    return jsonList


if __name__ == "__main__":
    # os.system('''adb shell "su -c 'cp /data/data/com.tencent.mm/MicroMsg/867cc0443b3e8056c45b5e70aaa36197/SnsMicroMsg.db /sdcard/文件/SnsMicroMsg.db'" && adb pull /sdcard/文件/SnsMicroMsg.db SnsMicroMsg.db''')
    db = SnsParse()
    xiao = 0
    Account = ["wxid_05rvkbftizq822", "wxid_8cm21ui550e729"][xiao]
    snsList = db._parse_wc_db(["SnsMicroMsg.db", "SnsMicroMsg(1).db"][xiao])
    ImageDownload().downloadImages(snsList)
    jsonList = to_json(snsList)
    json.dump(
        jsonList,
        open(
            ["result\\database\\info.json", "result\\database\\info(1).json"][xiao],
            "w",
            encoding="utf-8",
        ),
        indent=4,
        ensure_ascii=False,
    )
