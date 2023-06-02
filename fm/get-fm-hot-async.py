import aiohttp
import asyncio
import json
import os
import shutil
import time
from bs4 import BeautifulSoup
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

hotWordsList = []
detailList = []
resultDir = "./fm/data/头条"
channelUrl = "https://api-v6.thecover.cn/wap/getHotWordList"
channelId = ""
rangeNum = 5
if os.path.exists(resultDir):
    shutil.rmtree(resultDir)
os.makedirs(resultDir)


async def get_page(session):
    async with session.post(
        channelUrl,
    ) as response:
        data = await response.json()
        hotWords = data.get("data").get("hotWords")
        for i in hotWords:
            hotWordsList.append(
                {"id": i.get("id"), "title": i.get("word"), "hot": [], "related": []}
            )


async def fetch_article(session, hot, folderPath):
    url = "https://api-v6.thecover.cn/wap/getHotWordContent"
    data = aiohttp.FormData()
    data.add_field(
        "data",
        json.dumps(
            {
                "hotWordId": str(hot.get("id")),
                "pageSize": 10,
                "lastNewsId": 0,
                "reqType": 0,
            }
        ),
    )
    async with session.post(url, data=data) as response:
        result = await response.json()
        hot_words = result.get("data").get("hot_words")
        news_list = result.get("data").get("news_list")
        relate_news_list = result.get("data").get("relate_news_list")
        obj = {
            "hot_words": hot_words,
            "news_list": news_list,
            "relate_news_list": relate_news_list,
        }
        with open(os.path.join(folderPath, "data.json"), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=4)


async def main():
    print(f"{resultDir}-start")
    async with aiohttp.ClientSession() as session:
        tasks = []
        task = asyncio.ensure_future(get_page(session))
        tasks.append(task)
        await asyncio.gather(*tasks)
        tasks = []
        for hot in hotWordsList:
            id = hot.get("id")
            folderPath = os.path.join(resultDir, str(id))
            os.makedirs(folderPath, exist_ok=True)
            task = asyncio.ensure_future(fetch_article(session, hot, folderPath))
            tasks.append(task)
        await asyncio.gather(*tasks)


asyncio.run(main())
