import os
import json
import time
import shutil
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


data_dir = "./data"
sql_dir = "./sql"
allData = []
allSql = []
for root, dirs, files in os.walk(data_dir):
    for dir in dirs:
        json_file = os.path.join(root, dir, "data.json")
        if os.path.isfile(json_file):
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                # 对 data 做一些处理，比如输出到控制台
                allData.append(data)
for d in allData:
    title = d["title"].replace("'", "\\'")
    content = d["content"].replace("'", "\\'")
    poster = (
        "http://192.168.200.129:3000/cdn/post/20230419/3860f9d0450b3df0e9d4ba000.png"
    )
    author_id = "5ba1a83e33cf47d182b98ac1fe1beac8"
    category_id = d["categoryId"]
    channel_id = d["channelId"]
    createTime = d["createTime"]
    updateTime = d["updateTime"]
    post_type = 1

    sql = f"INSERT INTO `nodejs-service`.`sm_board_post_list` (`title`, `content`, `status`, `poster`, `createTime`, `updateTime`, `view`, `comment`, `authorId`, `commentId`, `categoryId`, `channelId`, `codeCount`, `postType`) VALUES ('{title}', '{content}', 'OFFLINE', '{poster}', {createTime}, {updateTime}, 0, 0, '{author_id}', NULL, '{category_id}', '{channel_id}', 0, {post_type});"

    allSql.append(sql)


if os.path.exists(sql_dir):
    shutil.rmtree(sql_dir)
os.makedirs(sql_dir)

with open(os.path.join(sql_dir, "post_sql.sql"), "w", encoding="utf-8") as f:
    f.write("".join(allSql))
