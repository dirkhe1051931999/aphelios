import requests
import json
import sys
import io
import os
import shutil
import time
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

proxies = {
    "http": "45.12.31.127:80"
    # "http": "103.127.1.130:80",
    # "http": "103.197.251.202:80",
    # "http": "103.149.146.252:80",
    # "http": "103.77.60.14:80",
    # "http": "103.117.192.14:80",
}
articleList = []
detailList = []
resultDir = "./result"
rangeNum = 2
if os.path.exists(resultDir):
    shutil.rmtree(resultDir)
os.makedirs(resultDir)
for page in range(1, rangeNum):
    timestamp = int(time.time() * 1000)
    url = f"https://wap.newsmth.net/wap/api/hot/global?t={timestamp}&page={page}"
    print(proxies)
    response = requests.get(url, proxies=proxies)
    data = response.json()
    topics = data.get("data").get("topics")
    for i in topics:
        articleList.append(
            {
                "id": i.get("id"),
                "boardId": i.get("boardId"),
                "title": i.get("subject"),
            }
        )
    for i in articleList:
        url = "https://wap.newsmth.net/wap/api/topic/" + i.get("id") + "/detail"
        response = requests.get(url, proxies=proxies)
        data = response.json()
        topic = data.get("data").get("topic")
        boardId = topic.get("boardId")
        title = topic.get("subject")
        account = topic.get("article").get("account")
        content = topic.get("article").get("body")
        attachments = topic.get("article").get("attachments")
        obj = {
            "boardId": boardId,
            "title": title,
            "account": account,
            "content": content,
            "attachments": attachments,
        }
        # 创建文件夹并保存数据
        folderName = i.get("title")
        folderPath = os.path.join(resultDir, folderName)
        os.makedirs(folderPath, exist_ok=True)
        with open(os.path.join(folderPath, "data.json"), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=4)
        # 保存图片
        if attachments:
            for attachment in attachments:
                name = attachment.get("name")
                url = attachment.get("ks3Url")
                response = requests.get(url, proxies=proxies)
                with open(os.path.join(folderPath, name), "wb") as f:
                    f.write(response.content)
        if content:
            soup = BeautifulSoup(content, "html.parser")
            text = soup.get_text()
            with open(
                os.path.join(folderPath, "content.txt"), "w", encoding="utf-8"
            ) as f:
                f.write(text)
