import requests
import json
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


url = 'https://wap.newsmth.net/wap/api/topic/763dd17ccd049bc4ebb0806f685660e2/detail'
response = requests.get(url)

data = response.json()
topic = data.get('data').get('topic')
boardId = topic.get('boardId')
title = topic.get('subject')
account = topic.get('article').get('account')
content = topic.get('article').get('body')
obj = {
    "boardId": boardId,
    "title": title,
    "account": account,
    "content": content
}
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(obj, f, ensure_ascii=False, indent=4)
