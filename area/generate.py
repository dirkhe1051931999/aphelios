import json
import os
import shutil
from pypinyin import lazy_pinyin

dir_path = './area/data/'
# 检查目录是否存在
if os.path.exists(dir_path):
    # 如果目录存在，则删除它
    shutil.rmtree(dir_path)
# 创建新的目录
os.makedirs(dir_path)


# 读取总的json文件
with open('./area/pcas-code.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
province_list = []
# 循环每个省份
for province in data:
    
    pinyin_name = ''
    # 使用lazy_pinyin函数转换中文为拼音
    if province['name'] == '陕西省':
      pinyin_name = 'shannxisheng'
    else:
      pinyin_name = ''.join(lazy_pinyin(province['name']))
    filename = './area/data/' + pinyin_name + '.json'
    province_list.append({
        'name': province['name'],
        'pinyin': pinyin_name,
        'code': province['code']
    })
    # 将省份数据写入到对应的文件
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(province, f, ensure_ascii=False)
# 将省份列表写入到文件
with open('./area/data/province.json', 'w', encoding='utf-8') as f:
    json.dump(province_list, f, ensure_ascii=False)