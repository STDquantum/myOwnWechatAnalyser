import json

if __name__ == "__main__":
    with open("template.html", "r", encoding="utf-8") as f:
        htmlhead, htmlend = f.read().split("/* 分割线 */")
    