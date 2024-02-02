import os
import json
import shutil
import uuid
import requests
from bs4 import BeautifulSoup
from multiprocessing.dummy import Pool as ThreadPool
import sys
import io
import random


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

allSql = []
userId = ["39f7637ff64a499287b2d7efc5c0cc8a", "92b4543d43964e038c19c9737e30d9c9", "c2ab38dd81e148ec9f02760ceaada40b"]


def get_topic_ids(data_dir):
    allTopicId = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".json"):
                with open(os.path.join(root, file), "r", encoding="utf-8") as json_file:
                    data = json.load(json_file)
                    if "topicId" in data:
                        allTopicId.append(data["topicId"])
    return allTopicId

def fetch_url(args):
    url, session = args
    try:
        response = session.get(url)
        return response.json()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def find_top_id(item, list):
    if item['replyId'] is None:
        item['topId'] = None
    else:
        for i in list:
            if i['id2'] == item['replyId']:
                if i['replyId'] is None:
                    item['topId'] = i['id2']
                else:
                    item['topId'] = find_top_id(i, list)
                break
            else:
                item['topId'] = None
    return item['topId']

def get_comments(data, topicId):
    allData = []
    comments = data.get("data", {}).get("articles", [])
    if comments:
        first = comments.pop(0)
        curPostId = first.get("id")
        for comment in comments:
            allData.append(
                {
                    "id": str(uuid.uuid4()).replace("-", "").lower(),
                    "id2": comment.get("id"),
                    "topId": None,
                    "replyId": None
                    if comment.get("replyId") == curPostId
                    or comment.get("replyId") is None
                    else comment.get("replyId"),
                    "content": BeautifulSoup(comment.get("body"), "html.parser")
                    .get_text()
                    .replace("'", "\\'")
                    .replace('"', '\\"')
                    .replace("\n", "")
                    .split("【")[0],
                    "postTime": comment.get("postTime"),
                    "userId": random.choice(userId),
                    "topicId": topicId,
                }
            )
    return allData


def main():
    data_dir = "./data"
    url_template = "https://wap.newsmth.net/wap/api/topic/loadArticlesByMode/{uuid}/1/{page}/1000?t=1683875940722"
    allData = []

    allTopicId = get_topic_ids(data_dir)
    urls = [
        url_template.format(uuid=uuid, page=page)
        for uuid in allTopicId
        for page in range(1, 2)
    ]

    with requests.Session() as session:
        with ThreadPool(4) as pool:  # adjust this number based on your own situation
            responses = pool.map(fetch_url, ((url, session) for url in urls))

    for topicId, response in zip(allTopicId, responses): # type: ignore
        if response is not None:
            allData.extend(get_comments(response, topicId))
    # 获取topId
    for item in allData:
        item['topId'] = find_top_id(item, allData)    
    # 如果replyId在allData中不存在，则将replyId置为NULL
    for item in allData:
        if item['replyId'] is not None:
            for i in allData:
                if i['id2'] == item['replyId']:
                    break
            else:
                item['replyId'] = None
    # print(json.dumps(allData, indent=4, ensure_ascii=False))
    for i in allData:
        replyId = i.get("replyId")
        if replyId is None:
            replyId = "NULL"
        else:
            replyId = f'"{replyId}"'
        allSql.append(
            f'INSERT INTO sm_board_comment (id,id2,topId, replyId, content, postTime, userId, postId) VALUES ("{i.get("id")}","{i.get("id2")}", "{i.get("topId")}", {replyId}, "{i.get("content")}" , {i.get("postTime")}, "{i.get("userId")}", "{i.get("topicId")}");'
        )
    sql_dir = "./sql"
    if not os.path.isdir(sql_dir):
        os.makedirs(sql_dir)

    file_path = os.path.join(sql_dir, "comments.sql")
    if os.path.exists(file_path):
        os.remove(file_path)

    with open(os.path.join(sql_dir, "comments.sql"), "w", encoding="utf-8") as f:
        f.write("".join(allSql))


if __name__ == "__main__":
    main()


    