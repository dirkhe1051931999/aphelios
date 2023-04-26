import os
import json
import time
import shutil
import sys
import io
from datetime import datetime
from minio import Minio
import uuid
import mimetypes


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


data_dir = "./data"
sql_dir = "./sql"
url = "192.168.200.130:9000"
bucket_name = "blog-service-oss"
client = Minio(
    url,
    access_key="fd9C9kmZ6da67rsf",
    secret_key="AYhWs3r2uPz91lqxVnnIqOAZh0DJX5h5",
    secure=False,
)
today = datetime.today().strftime("%Y%m%d")
allData = []
allImgs = []
allSql = []
data = {}
for root, dirs, files in os.walk(data_dir):
    for file in files:
        if file.endswith(".json"):
            with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                data = json.load(f)
                data["img_path"] = []
                parent_dir = os.path.dirname(os.path.join(root, file))
                for img_file in os.listdir(parent_dir):
                    if img_file.endswith(".jpg") or img_file.endswith(".png"):
                        content_type, _ = mimetypes.guess_type(img_file)
                        data["img_path"].append(
                            {
                                "path": os.path.join(parent_dir, img_file),
                                "content_type": content_type,
                            }
                        )
                allData.append(data)

for d in allData:
    title = d["title"].replace("'", "\\'")
    d["img_dom"] = []
    for img in d["img_path"]:
        uuid_str = str(uuid.uuid4()).replace("-", "")
        extension = os.path.splitext(img.get("path"))[1]
        result = client.fput_object(
            "blog-service-oss",
            f"{today}/{uuid_str}{extension}",
            img.get("path"),
            content_type=img.get("content_type"),
        )
        d["img_dom"].append(
            f"<p><img src='http://{url}/{bucket_name}/{today}/{uuid_str}{extension}' alt='' data-src='http://{url}/{bucket_name}/{today}/{uuid_str}{extension}' /></p>"
        )
    content = d["content"].replace("'", "\\'") + "".join(d["img_dom"])
    content = content.replace('"', '\\"')
    poster = ""
    author_id = "5ba1a83e33cf47d182b98ac1fe1beac8"
    category_id = d["categoryId"]
    channel_id = d["channelId"]
    createTime = d["createTime"]
    updateTime = d["updateTime"]
    post_type = 1
    sql = f'INSERT INTO `nodejs-service`.`sm_board_post_list` (`title`, `content`, `status`, `poster`, `createTime`, `updateTime`, `view`, `comment`, `authorId`, `commentId`, `categoryId`, `channelId`, `codeCount`, `postType`) VALUES ("{title}", "{content}", "OFFLINE", "{poster}", {createTime}, {updateTime}, 0, 0, "{author_id}", NULL, "{category_id}", "{channel_id}", 0, {post_type});'
    allSql.append(sql)


if os.path.exists(sql_dir):
    shutil.rmtree(sql_dir)
os.makedirs(sql_dir)

with open(os.path.join(sql_dir, "post_sql.sql"), "w", encoding="utf-8") as f:
    f.write("".join(allSql))
