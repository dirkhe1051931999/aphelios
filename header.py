import json
from urllib.parse import quote
import random

indentity = [
    {
        "birthday": "1980-01-01",
        "friendCount": 1,
        "gender": 1,
        "avatarUrl": "https://file.mysmth.net/file/66885a911ee88d9a28392ff35f1d062e",
        "level": 5,
        "suicide": False,
        "isFans": False,
        "mobile": "15829050465",
        "articleCount": 0,
        "fansCount": 0,
        "avatar": "file/66885a911ee88d9a28392ff35f1d062e",
        "levelTitle": "乔木",
        "type": 0,
        "nick": "hejian",
        "score": 11,
        "loginTime": 1663639353000,
        "createTime": 1614823588000,
        "isBlack": False,
        "name": "hejian",
        "id": "401ec7ec99e01dd5eee8951e358b3574",
        "k3sUrl": "http://ks3-cn-beijing.ksyun.com/avatar/66885a911ee88d9a28392ff35f1d062e",
        "title": "用户",
    },
]
cookie_dict = {
    "kbs-key": "qg8zCERBiR7pMtyGgUymTolC7I7teXZz36poYst0dDIXh2QWsZxAXmetsf3upAVh",
    "kbs-info": "WHXbTRABVnWqYlQRaMiSU3pTI5ZZk9H8H5Tq313CJFY=",
    "set_identity": random.choice(indentity),
}

kbs_key_encode_str = quote(cookie_dict.get("kbs-key"), safe='{}:"').replace('"', "")  # type: ignore
kbs_info_encode_str = quote(cookie_dict.get("kbs-info"), safe='{}:"').replace('"', "")  # type: ignore
kbs_identity_encode_str = quote(
    json.dumps(cookie_dict.get("set_identity")), safe="{}:/"
)
# 可选的 sec-ch-ua 值
sec_ch_ua_list = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36",
    # ... 添加更多可选值
]

# 随机选择多个 sec-ch-ua 值，生成一个假的头部
sec_ch_ua_values = random.sample(sec_ch_ua_list, 3)
sec_ch_ua_header = ", ".join(f'"{value}"' for value in sec_ch_ua_values)
headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "zh-CN,zh;q=0.9,ar;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": sec_ch_ua_header,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": f"kbs-key={kbs_key_encode_str}; kbs-info={kbs_info_encode_str}; set_identity={kbs_identity_encode_str}",
}
