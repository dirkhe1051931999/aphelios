import os
import json
import shutil
import uuid
import requests
from bs4 import BeautifulSoup
from multiprocessing.dummy import Pool as ThreadPool
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

allSql = []


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
                    "userId": "8872cbcdc16748ed9728203dbb0b2764",
                    "topicId": topicId,
                }
            )
    return allData


def main():
    data_dir = "./data"
    url_template = "https://wap.newsmth.net/wap/api/topic/loadArticlesByMode/{uuid}/1/{page}/20?t=1683875940722"
    allData = []

    allTopicId = get_topic_ids(data_dir)
    urls = [
        url_template.format(uuid=uuid, page=page)
        for uuid in allTopicId
        for page in range(1, 6)
    ]

    with requests.Session() as session:
        with ThreadPool(4) as pool:  # adjust this number based on your own situation
            responses = pool.map(fetch_url, ((url, session) for url in urls))

    for topicId, response in zip(allTopicId, responses):
        if response is not None:
            allData.extend(get_comments(response, topicId))
    for i in allData:
        replyId = i.get("replyId")
        if replyId is None:
            replyId = "NULL"
        else:
            replyId = f'"{replyId}"'
        allSql.append(
            f'INSERT INTO sm_board_comment (id, replyId, content, postTime, userId, postId) VALUES ("{i.get("id")}", {replyId}, "{i.get("content")}" , {i.get("postTime")}, "{i.get("userId")}", "{i.get("topicId")}");'
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


    