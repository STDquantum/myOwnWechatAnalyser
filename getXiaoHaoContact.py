import sqlite3
import json

if __name__ == "__main__":
    conn = sqlite3.connect("MicroMsg.db")
    c = conn.cursor()
    c.execute("select UserName, alias, Remark, nickname, type from contact")
    res = c.fetchall()
    contact = json.load(open("result\\database\\contact.json", "r", encoding="utf-8"))
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