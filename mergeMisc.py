import shutil
import os
import sqlite3


def merge_databases(source_paths, target_path):
    # 创建目标数据库连接
    target_conn = sqlite3.connect(target_path)
    target_cursor = target_conn.cursor()
    try:
        # 开始事务
        target_conn.execute("BEGIN;")
        for i, source_path in enumerate(source_paths):
            if not os.path.exists(source_path):
                continue
            db = sqlite3.connect(source_path)
            db.text_factory = str
            cursor = db.cursor()
            sql = """
                SELECT usrName,createTime,smallHeadBuf,m_headImgMD5
                FROM ContactHeadImg1;
            """
            cursor.execute(sql)
            result = cursor.fetchall()
            # 附加源数据库
            for usrName, createTime, smallHeadBuf, m_headImgMD5 in result:
                try:
                    target_cursor.execute(
                        "INSERT INTO ContactHeadImg1"
                        "(usrName,createTime,smallHeadBuf,m_headImgMD5)"
                        "VALUES(?,?,?,?);",
                        (usrName, createTime, smallHeadBuf, m_headImgMD5)
                    )
                except sqlite3.IntegrityError:
                    pass
            cursor.close()
            db.close()
        # 提交事务
        target_conn.execute("COMMIT;")

    except Exception as e:
        # 发生异常时回滚事务
        target_conn.execute("ROLLBACK;")
        raise e

    finally:
        # 关闭目标数据库连接
        target_conn.close()


if __name__ == "__main__":
    source_databases = ["Misc(0).db", "Misc(1).db"]
    target_database = "Misc.db"
    shutil.copy("Misc(0).db", target_database)
    merge_databases(source_databases, target_database)