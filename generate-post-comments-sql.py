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
from bs4 import BeautifulSoup


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


data_dir = "./20.json"
sql_dir = "./sql"
allData = []
allSql = []

with open(data_dir, "r", encoding="utf-8") as f:
    data = json.load(f)
    comments = data.get("data").get("articles")
    curPostId = "dc5460f93cf868790e830f1215c0f612"
    del comments[0]
    for comment in comments:
        allData.append(
            {
                "id": comment.get("id"),
                "replyId": None
                if comment.get("replyId") == curPostId or comment.get("replyId") is None
                else comment.get("replyId"),
                "content": BeautifulSoup(comment.get("body"), "html.parser").get_text().split("【")[0],
            }
        )

print(allData)
# with open(os.path.join(sql_dir, "post_sql.sql"), "w", encoding="utf-8") as f:
#     f.write("".join(allSql))
