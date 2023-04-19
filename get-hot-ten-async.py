import random
import aiohttp
import aiohttp_socks
import asyncio
import json
import os
import shutil
import time
from bs4 import BeautifulSoup
from header import headers
from proxy import proxies

articleList = []
detailList = []
resultDir = "./data/十大"
channelUrl = "https://wap.newsmth.net/wap/api/hot/ten"
channelId = "f446f1333e362f3cd156f1443cb407eb"
rangeNum = 2
if os.path.exists(resultDir):
    shutil.rmtree(resultDir)
os.makedirs(resultDir)


async def get_page(session, page, proxies):
    timestamp = int(time.time() * 1000)
    proxy = random.choice(proxies) if proxies else None
    url = f"{channelUrl}?t={timestamp}&page={page}"
    async with session.get(
        url,
    ) as response:
        data = await response.json()
        topics = data.get("data").get("topics")
        for i in topics:
            articleList.append(
                {
                    "id": i.get("id"),
                    "boardId": i.get("boardId"),
                    "title": i.get("subject"),
                }
            )


async def fetch_article(session, article, folderPath, proxies):
    url = f"https://wap.newsmth.net/wap/api/topic/{article['id']}/detail"
    proxy = random.choice(proxies) if proxies else None
    async with session.get(
        url,
    ) as response:
        data = await response.json()
        topic = data.get("data").get("topic")
        categoryId = topic.get("boardId")
        title = topic.get("subject")
        account = topic.get("article").get("account")
        content = topic.get("article").get("body")
        attachments = topic.get("article").get("attachments")
        postTime = topic.get("article").get("postTime")
        updateTime = topic.get("article").get("postTime")
        obj = {
            "categoryId": categoryId,  # 分类id
            "channelId": channelId,  # 频道id
            "title": title,  # 标题
            "account": account,  # 发帖人
            "content": content,  # 内容
            "attachments": attachments,  # 附件
            "createTime": postTime,  # 创建时间
            "updateTime": updateTime,  # 更新时间
        }
        with open(os.path.join(folderPath, "data.json"), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=4)
        if attachments:
            for attachment in attachments:
                name = attachment.get("name")
                url = attachment.get("ks3Url")
                async with session.get(
                    url,
                ) as response:
                    data = await response.read()
                    with open(os.path.join(folderPath, name), "wb") as f:
                        f.write(data)
        if content:
            soup = BeautifulSoup(content, "html.parser")
            text = soup.get_text()
            with open(
                os.path.join(folderPath, "content.txt"), "w", encoding="utf-8"
            ) as f:
                f.write(text)


async def main():
    print(f"{resultDir}-start")
    proxy = 'socks5://31.217.221.74:8192'
    connector = aiohttp_socks.ProxyConnector.from_url(proxy)
    async with aiohttp.ClientSession(
        headers=headers, connector=connector, trust_env=True
    ) as session:
        tasks = []
        for page in range(1, rangeNum):
            task = asyncio.ensure_future(get_page(session, page, proxies))
            print(f"page {page} is done")
            tasks.append(task)
        await asyncio.gather(*tasks)
        tasks = []
        for article in articleList:
            folderName = article.get("title")
            folderPath = os.path.join(resultDir, folderName)
            os.makedirs(folderPath, exist_ok=True)
            task = asyncio.ensure_future(
                fetch_article(session, article, folderPath, proxies)
            )
            tasks.append(task)
        await asyncio.gather(*tasks)


asyncio.run(main())
