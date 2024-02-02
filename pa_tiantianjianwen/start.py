import requests
from bs4 import BeautifulSoup

url = "https://tititxt.com/"

# 发送HTTP请求
response = requests.get(url)

# 检查请求是否成功
if response.status_code == 200:
    # 解析HTML内容
    soup = BeautifulSoup(response.text, 'html.parser')

    # 以下代码需要根据实际网页结构进行调整
    articles = soup.find_all('div', class_='post')  # 假设每篇文章都在一个带有特定类的div中

    for article in articles:
        title = article.find('h2').get_text().strip()  # 假设标题用<h2>标签包裹
        time = article.find('span', class_='date').get_text().strip()  # 假设时间在特定类的div中
        views = article.find('span', class_='view').get_text().strip()  # 假设浏览数在特定类的div中

        print("标题:", title)
        print("时间:", time)
        print("浏览数:", views)
        print("---")
else:
    print("网页请求失败，状态码：", response.status_code)
