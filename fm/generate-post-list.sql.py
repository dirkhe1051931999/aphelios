import asyncio
import os
import json
import time
import shutil
import sys
import io
from datetime import datetime
import aiohttp
from minio import Minio
import uuid
import mimetypes
from bs4 import BeautifulSoup
import urllib.request


from urllib.parse import unquote


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

data_dir = "./fm/data/头条"
temp_img_dir = "./fm/temp_img"
sql_dir = "./sql"
url = "192.168.200.134:9000"
bucket_name = "blog-service-oss"
client = Minio(
    url,
    access_key="9RSB8iL0VQ0J7PGs",
    secret_key="5UhXn4p4Ff6HBZzhw6mKqpeG2UMVWibr",
    secure=False,
)
today = datetime.today().strftime("%Y%m%d")
allData = []
haveContentAllData = []
allSql = []

for root, dirs, files in os.walk(data_dir):
    for file in files:
        if file.endswith(".json"):
            with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                data = json.load(f)
                for news_list in data.get("news_list"):
                    news = {
                        "word": data.get("hot_words").get("word"),
                        "word_id": data.get("hot_words").get("id"),
                        "ralate": False,
                    }
                    news_list.update(news)
                    allData.append(news_list)
                # for relate_news_list in data.get("relate_news_list"):
                #     news = {
                #         "word": data.get("hot_words").get("word"),
                #         "word_id": data.get("hot_words").get("id"),
                #         "ralate": True,
                #     }
                #     relate_news_list.update(news)
                #     allData.append(relate_news_list)

def upload_to_minio(uuid_str,extension,content_type):
    client.fput_object(
        bucket_name,
        f"{today}/{uuid_str}{extension}",
        os.path.join(temp_img_dir, uuid_str+''+extension),
        content_type= content_type,
    )
def ensure_dir(directory):
    if not os.path.exists(directory):
        os.mkdir(directory)

def download_file(url, filename):
    try:
        urllib.request.urlretrieve(url, filename)
    except Exception as e:
        print(f"Unexpected error: {str(e)}, url: {url}")
        return False
    return True

def process_img(img, temp_img_dir, bucket_name, today, url):
    src = img.get('src')
    if src.startswith("http"):
        uuid_str = str(uuid.uuid4()).replace("-", "")
        extension = '.jpg'
        ensure_dir(temp_img_dir)
        file_path = os.path.join(temp_img_dir, f"{uuid_str}{extension}")
        if not download_file(src, file_path):
            return None
        upload_to_minio(uuid_str,extension,'image/jpeg')
        new_src = f"http://{url}/{bucket_name}/{today}/{uuid_str}{extension}"
        return new_src
    return None
async def get_post_detail(
    session,
    post,
):
    url = "https://api-v6.thecover.cn/wap/getDetail?vno=3.5.0&"
    data = aiohttp.FormData()
    data.add_field(
        "data",
        json.dumps(
            {
                "news_id": None,
                "eid": unquote(post.get("eid")),
                "diversion_id": "",
                "expireTimestampSign": "",
            }
        ),
    )
    async with session.post(url, data=data) as response:
        result = await response.json()
        post["content"] = result.get("data").get("content")
    haveContentAllData.append(post)

def generate_sql(allList):
    for d in allList:
        title = d["news_title"].replace("'", "\\'")
        content = d["content"].replace("\"", '').replace(">/strip/quality/95/ignore-error/1|imageslim", "")
        soup = BeautifulSoup(content, 'html.parser')
        for img in soup.find_all('img'):
            p = soup.new_tag('p')
            new_src = process_img(img, temp_img_dir, bucket_name, today, url)
            if new_src is not None:
                content = content.replace(img.get('src'), new_src)
            img.wrap(p)
        uuid_str = str(uuid.uuid4()).replace("-", "")
        extension = os.path.splitext(d['img_url'])[1]
        if not (os.path.exists(temp_img_dir)):
            os.mkdir(temp_img_dir )
        try:
            urllib.request.urlretrieve(d['img_url'],os.path.join(temp_img_dir,f"{uuid_str}{extension}"))
        except Exception as e:
            print(f"Unexpected error: {str(e)},url:{d['img_url']}")
            continue
        upload_to_minio(uuid_str,extension,mimetypes.guess_type(d['img_url'])[0])
        poster = f"http://{url}/{bucket_name}/{today}/{uuid_str}{extension}"
        author_id = "5ba1a83e33cf47d182b98ac1fe1beac8"
        category_id = "a2ddd7f4ef4546cdbd5d05660caddec7" # 封面头条
        channel_id = "383622c55f1643ab977aef886a7bc53e" #  封面热点
        createTime = d["happen_time"]
        updateTime = d["happen_time"]
        src_topic_id = d["news_id"]
        haveImg =  0
        post_type = 1
        sql = f'INSERT INTO `nodejs-service`.`sm_board_post_list` (`title`, `content`, `status`, `poster`, `createTime`, `updateTime`, `view`, `comment`, `authorId`, `commentId`, `categoryId`, `channelId`, `codeCount`, `postType`, `srcTopicId`, `haveImg`) VALUES ("{title}", "{content}", "OFFLINE", "{poster}", {createTime}, {updateTime}, 0, 0, "{author_id}", NULL, "{category_id}", "{channel_id}", 0, {post_type}, "{src_topic_id}", {haveImg});'
        allSql.append(sql)
    if not os.path.isdir(sql_dir):
        os.makedirs(sql_dir)
    file_path = os.path.join(sql_dir, "fm_post.sql")
    if os.path.exists(file_path):
        os.remove(file_path)
    with open(os.path.join(sql_dir, "fm_post.sql"), "w", encoding="utf-8") as f:
        f.write("".join(allSql))
    if os.path.exists(temp_img_dir):
        shutil.rmtree(temp_img_dir)
    


async def main():
    print(f"{data_dir}-start")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for post in allData:
            task = asyncio.ensure_future(get_post_detail(session, post))
            print(f"eid【 {post.get('eid')} 】is done")
            tasks.append(task)
        await asyncio.gather(*tasks)
        generate_sql(haveContentAllData)


asyncio.run(main())
