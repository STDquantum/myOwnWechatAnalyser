import os 

db = "WxFileIndex.db"
db1 = "EnMicroMsg.db"
db2 = "FTS5IndexMicroMsg_encrypt.db"

key = "fdddf7e"
cmd = './tool/sqlcipher-shell32.exe'
param = f"""
PRAGMA key = '{key}';
PRAGMA cipher_migrate;
ATTACH DATABASE './FTS5IndexMicroMsg.db' AS Msg KEY '';
SELECT sqlcipher_export('Msg');
DETACH DATABASE Msg;
    """
with open('.\\log\\config.txt', 'w') as f:
    f.write(param)
p = os.system(f"{os.path.abspath('.')}{cmd} {db2} < ./log/config.txt")