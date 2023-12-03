import os 

db = "WxFileIndex.db"
db1 = "EnMicroMsg.db"

key = "fdddf7e"
cmd = './sqlcipher-3.0.1/bin/sqlcipher-shell32.exe'
param = f"""
PRAGMA key = '{key}';
PRAGMA cipher_migrate;
ATTACH DATABASE './app/DataBase/Msg.db' AS Msg KEY '';
SELECT sqlcipher_export('Msg');
DETACH DATABASE Msg;
    """
with open('./app/data/config.txt', 'w') as f:
    f.write(param)
p = os.system(f"{os.path.abspath('.')}{cmd} {db1} < ./app/data/config.txt")