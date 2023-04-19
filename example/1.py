import requests
import json
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 发送 GET 请求
response = requests.get('https://wap.newsmth.net/wap/api/section/all')

# 解析 JSON 数据
data = json.loads(response.text)

data2 = data['data']['sections']


result = {}
board_sheet = []
sql0 = []
sql1 = []
sql2 = []
# 获取每个 section 的 id 并发送请求获取 title
for section in data2:
    id = section['id']
    name = section['name']
    description = section['description']
    cover = ''
    board_sheet.append({
        "id": id,
        "name": name,
        "cover": cover,
        "description": description
    })
    sql0.append(
        f"INSERT INTO sm_board_sheet (id, name, cover, description) VALUES ('{id}', '{name}', '{cover}' ,'{description}');")
    response = requests.get(
        f'https://wap.newsmth.net/wap/api/section/subs?t=1681357951117&id={id}')
    data = json.loads(response.text)
    result[id] = []
    for item in data['data']['boards']:
        result[id].append({
            "id": item.get('id'),
            "title": item.get('title'),
            "type": item.get('type'),
            "name": item.get('name'),
            "groupId": item.get('groupId'),
        })
for section in board_sheet:
    for key, value in result.items():
        for item in value:
            if section['id'] == key:
                if (item["groupId"] == ""):
                    sql1.append(
                        f"INSERT INTO sm_board_directory (id, name, subName, type, parent_id) VALUES ('{item['id']}', '{item['title']}', '{item['name']}', {item['type']}, '{section['id']}');")
                if (item["groupId"] != ""):
                    sql2.append(
                        f"INSERT INTO sm_board_child_directory (id, name, subName, type, parent_id) VALUES ('{item['id']}' ,'{item['title']}', '{item['name']}', {item['type']}, '{item['groupId']}');")


# print(''.join(sql2))
# print(''.join(sql0))
