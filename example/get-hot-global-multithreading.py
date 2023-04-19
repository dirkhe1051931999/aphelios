import concurrent.futures
import requests
import json
import os
import shutil
import time
from bs4 import BeautifulSoup

articleList = []
detailList = []
resultDir = "./result"
rangeNum = 5
resultDir = "./result"
if os.path.exists(resultDir):
    shutil.rmtree(resultDir)
os.makedirs(resultDir)

def fetch_topic_details(topic):
    url = "https://wap.newsmth.net/wap/api/topic/" + topic.get("id") + "/detail"
    response = requests.get(url,)
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
    folderName = topic.get("subject")
    folderPath = os.path.join(resultDir, folderName)
    os.makedirs(folderPath, exist_ok=True)
    with open(os.path.join(folderPath, "data.json"), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=4)
    # 保存图片
    if attachments:
        for attachment in attachments:
            name = attachment.get("name")
            url = attachment.get("ks3Url")
            response = requests.get(url,)
            with open(os.path.join(folderPath, name), "wb") as f:
                f.write(response.content)
    if content:
        soup = BeautifulSoup(content, "html.parser")
        text = soup.get_text()
        with open(
            os.path.join(folderPath, "content.txt"), "w", encoding="utf-8"
        ) as f:
            f.write(text)

def fetch_topics(page):
    timestamp = int(time.time() * 1000)
    url = f"https://wap.newsmth.net/wap/api/hot/global?t={timestamp}&page={page}"
    response = requests.get(url,)
    data = response.json()
    topics = data.get("data").get("topics")
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for topic in topics:
            executor.submit(fetch_topic_details, topic)

...

if __name__ == "__main__":
    for page in range(1, rangeNum):
        fetch_topics(page)