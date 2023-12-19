import json
import os
import sqlite3


def parseDatabase(key="fdddf7e"):
    messageSrcDB = "EnMicroMsg.db"
    fileSrcDB = "WxFileIndex.db"
    sqlcipherExe = "tool\\sqlcipher-shell32.exe"
    if not os.path.exists(".\\result\\database\\Msg.db"):
        param = f"\nPRAGMA key = '{key}';\nPRAGMA cipher_migrate;\nATTACH DATABASE './result/database/Msg.db' AS Msg KEY '';\nSELECT sqlcipher_export('Msg');\nDETACH DATABASE Msg;"
        with open("./log/config.txt", "w", encoding="utf-8") as f:
            f.write(param)
        os.system(f"{sqlcipherExe} {messageSrcDB} < ./log/config.txt")
    if not os.path.exists(".\\result\\database\\File.db"):
        param = f"\nPRAGMA key = '{key}';\nPRAGMA cipher_migrate;\nATTACH DATABASE './result/database/File.db' AS File KEY '';\nSELECT sqlcipher_export('File');\nDETACH DATABASE File;"
        with open("./log/config.txt", "w", encoding="utf-8") as f:
            f.write(param)
        os.system(f"{sqlcipherExe} {fileSrcDB} < ./log/config.txt")


def processContact():
    conn = sqlite3.connect(".\\result\\database\\Msg.db")
    c = conn.cursor()
    c.execute("select username, alias, conRemark, nickname, type from rcontact")
    res = c.fetchall()
    contact = {}
    for username, alias, conRemark, nickname, Type in res:
        contact[username] = {}
        contact[username]["alias"] = alias
        contact[username]["conRemark"] = conRemark
        contact[username]["nickname"] = nickname
        contact[username]["Type"] = Type
    json.dump(
        contact,
        open("result\\database\\contact.json", "w", encoding="utf-8"),
        ensure_ascii=False,
        indent=4,
    )


def myWXID():
    conn = sqlite3.connect(".\\result\\database\\Msg.db")
    c = conn.cursor()
    c.execute("select * from userinfo where id=2")
    return c.fetchone()[2]


def getSomeoneMessage(wxid):
    conn = sqlite3.connect(".\\result\\database\\Msg.db")
    c = conn.cursor()
    c.execute(f"select * from message where talker = '{wxid}' order by createTime desc")
    return c.fetchall()


def parseSomeoneMessage(wxid):
    message = getSomeoneMessage(wxid)
    Type = {
        "1": "文字",
        "3": "图片",
        "43": "视频",
        "47": "表情包",
        "268445456": "撤回的消息",
        "34": "语音",
        "419430449": "转账",
        "50": "语音电话",
        "10000": "系统消息",
        "822083633": "回复消息",
        "922746929": "拍一拍",
        "1090519089": "文件",
        "436207665": "发红包",
        "49": "小程序、链接、合并转发聊天记录",
        "570425393": "邀请进群通知",
        "48": "位置信息",
        "64": "语音通话发起结束的系统通知",
        "1048625": "动图表情包",
        "805306417": "接龙",
        "754974769": "视频号",
        "973078577": "直播",
        "16777265": "文本形式的分享",
        "1107296305": "群公告",
        "1040187441": "音乐分享",
        "503316529": "群收款",
        "42": "名片",
        "587202609": "邀请游戏",
        "1077936177": "微信电话铃声",
        "1409286193": "微信音乐",
        "-1879048186": "发起位置共享",
        "469762097": "拜年红包",
        "486539313": "分享公众号视频",
    }
    uselessType = {
        "-1879048185": "微信运动排行榜",
        "285212721": "公众号推送",
        "318767153": "系统推送消息",
        "-1879048183": "微信运动点赞",
        "10002": "公众号权限使用通知",
    }
    for tp in Type:
        pass


if __name__ == "__main__":
    # os.system('''adb shell "su -c 'cp /data/data/com.tencent.mm/MicroMsg/867cc0443b3e8056c45b5e70aaa36197/EnMicroMsg.db /sdcard/文件/EnMicroMsg.db'" && adb pull /sdcard/文件/EnMicroMsg.db EnMicroMsg.db''')
    parseDatabase()
    processContact()
