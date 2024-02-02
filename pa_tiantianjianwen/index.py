import os
import random
import uuid
from datetime import datetime
import requests
from minio import Minio
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.edge.service import Service
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from bs4 import BeautifulSoup
from io import BytesIO
from PIL import Image
import time


class Config:
    HEADERS = {
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Cache-Control': 'no-cache',
        'Cookie': 'timezone=8; captcha_1594568272=6b489e1e6a1b2ddde35c23a63ecea7e6',
        'Pragma': 'no-cache',
        'Referer': '',
        'Sec-Ch-Ua': '"Not A;Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    MINIO_CONFIG = {
        "url": "192.168.124.40:9000",
        "access_key": "qrCX3RbPTSoryHikrxeI",
        "secret_key": "dfe4EJ5h5ca7mppvqL7l1gmuEcFbRLFO72200fbC",
        "secure": False,
        "bucket_name": "blog-service-oss"
    }
    URL = "https://tititxt.com/"
    TEMP_IMG_DIR = "./temp_img"
    SQL_FILE = "./result.sql"
    CHANNEL_IDS = [
        "383622c55f1643ab977aef886a7bc53e",
        "3bcda03dcf4ca0e36c3cc96eaa4cf6f8",
        "4ed7f0d8b621c8ccf9e11eca9991d6dc",
        "7f482ebbbc64fd66760475f5814a2fa8",
        "897f7890249777c2ecdf89e25ce9ff4c",
        "c2ea7c56020eb65b0f4dfc2a867d97e7",
        "db0bbb22ae11a11c352110e2cf31ce41",
        "e8d1470f8c33b86d8dae444090e81be4",
        "eb8324a810531dc904815d120988e6de",
        "f446f1333e362f3cd156f1443cb407eb"
    ]
    AUTHOR_IDS = [
        "5ba1a83e33cf47d182b98ac1fe1beac8",
        "d4f4cc7f6e6a41da8177c91a1a4ddc10",
        "eefefb0cde054f69bf032042594ccac8",
        "efede100a30c4cea9a84680c075950d1",
    ]
    CATEGORY_ID = '4489552b7aa14017bd287470c59db93c'


minio_client = Minio(
    Config.MINIO_CONFIG['url'],
    access_key=Config.MINIO_CONFIG['access_key'],
    secret_key=Config.MINIO_CONFIG['secret_key'],
    secure=Config.MINIO_CONFIG['secure'],
)


class Utils:
    @staticmethod
    def ensure_dir(directory):
        if not os.path.exists(directory):
            os.mkdir(directory)

    @staticmethod
    def upload_to_minio(client, uuid_str, extension, content_type):
        file_path = os.path.join(Config.TEMP_IMG_DIR, f"{uuid_str}{extension}")
        client.fput_object(
            Config.MINIO_CONFIG['bucket_name'],
            f"{datetime.today().strftime('%Y%m%d')}/{uuid_str}{extension}",
            file_path,
            content_type=content_type,
        )

    @staticmethod
    def get_random_element(elements):
        return elements[random.randint(0, len(elements) - 1)]

    @staticmethod
    def get_img_extension(response):
        content_type = response.headers.get('content-type', '').lower()
        image_data = BytesIO(response.content)
        img = Image.open(image_data)
        img_format = img.format
        extension = ''
        if img_format == 'JPEG':
            extension = '.jpg'
        elif img_format == 'GIF':
            extension = '.gif'
        elif img_format == 'PNG':
            extension = '.png'
        elif img_format == 'BMP':
            extension = '.bmp'
        elif content_type == 'image/webp':
            extension = '.webp'
        return extension

    @staticmethod
    def generate_sql(self, post):
        return f"""INSERT INTO `nodejs-service`.`sm_board_post_list` (`id`, `title`, `content`, `status`, `poster`, `createTime`, `updateTime`, `view`, `comment`, `authorId`, `directoryId`, `channelId`, `postType`, `srcTopicId`, `haveImg`, `postTags`, `pinned`, `recommended`, `featured`, `hot`, `original`, `paid`, `free`, `carousel`, `political`, `privated`, `publiced`, `shelveTimeStart`, `shelveTimeEnd`) VALUES ('{post['id']}', '{post['title']}', '{post['content']}', '{post['status']}', '{post['poster']}', {post['createTime']}, {post['updateTime']}, {post['view']}, {post['comment']}, '{post['authorId']}', '{post['directoryId']}', '{post['channelId']}', '{post['postType']}', '{post['srcTopicId']}', {post['haveImg']}, '{post['postTags']}', '{post['pinned']}', '{post['recommended']}', '{post['featured']}', '{post['hot']}', '{post['original']}', '{post['paid']}', '{post['free']}', '{post['carousel']}', '{post['political']}', '{post['privated']}', '{post['publiced']}', {post['shelveTimeStart']}, {post['shelveTimeEnd']});"""

    @staticmethod
    def write_to_file(self, file_path, content):
        mode = "a" if os.path.exists(file_path) else "w"
        with open(file_path, mode, encoding="utf-8") as f:
            f.write(content)

    @staticmethod
    def process_images(soup):
        images = soup.find_all('img')
        for img in images:
            img_url = img['src']
            img['alt'] = ''
            img['title'] = ''
            response = requests.get(img_url, headers=Config.HEADERS, allow_redirects=True)
            uuid_str = str(uuid.uuid4()).replace("-", "")
            extension = Utils.get_img_extension(response)
            print('img状态：' + str(response.status_code), 'img类型：' + extension)
            Utils.ensure_dir(Config.TEMP_IMG_DIR)
            file_path = os.path.join(Config.TEMP_IMG_DIR, f"{uuid_str}{extension}")
            with open(file_path, 'wb') as f:
                f.write(response.content)
                Utils.upload_to_minio(minio_client, uuid_str, extension, 'image/jpeg')
                new_src = f"/{Config.MINIO_CONFIG['bucket_name']}/{datetime.today().strftime('%Y%m%d')}/{uuid_str}{extension}"
                img['src'] = new_src
        return images[0]['src'] if images else ''

    @staticmethod
    def scroll_to_bottom(self):
        """滚动到页面底部。"""
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)  # 等待页面加载可能的新内容


class WebScraper:
    def __init__(self):
        edge_options = Options()
        # edge_options.add_argument("--headless")
        service = Service(EdgeChromiumDriverManager().install())
        self.run_count = 0
        self.post = {
            "id": '',
            "title": '',
            "content": '',
            "status": "PUBLISHED",
            "poster": '',
            "createTime": 0,
            "updateTime": 0,
            "view": 0,
            "comment": 0,
            "authorId": '',
            "directoryId": '',
            "channelId": '',
            "postType": "1",
            "srcTopicId": '',
            "haveImg": 0,
            "postTags": '',
            "pinned": "0",
            "recommended": "0",
            "featured": "0",
            "hot": "0",
            "original": "0",
            "paid": "0",
            "free": "1",
            "carousel": "0",
            "political": "0",
            "privated": "0",
            "publiced": "1",
            "shelveTimeStart": int(time.time()) * 1000,
            "shelveTimeEnd": (int(time.time()) + 31536000) * 1000,
        }
        self.driver = webdriver.Edge(service=service, options=edge_options)

    def fetch_article(self, xpath, date_path, view_path):
        self.driver.get(Config.URL)
        time.sleep(3)
        title_element = self.driver.find_element(By.XPATH, xpath)
        title = title_element.text
        detail_link = title_element.get_attribute('href')
        Config.HEADERS['Referer'] = detail_link
        date_element = self.driver.find_element(By.XPATH, date_path)
        date = date_element.text
        view_element = self.driver.find_element(By.XPATH, view_path)
        view = view_element.text
        id = str(uuid.uuid4()).replace("-", "")
        self.post['id'] = id
        self.post['srcTopicId'] = id
        self.post['title'] = title
        self.post['createTime'] = int(time.mktime(time.strptime(date, "%Y-%m-%d"))) * 1000
        self.post['view'] = int(view)
        self.post['authorId'] = Utils.get_random_element(Config.AUTHOR_IDS)
        self.post['channelId'] = Utils.get_random_element(Config.CHANNEL_IDS)
        self.post['directoryId'] = Config.CATEGORY_ID
        self.post['updateTime'] = int(time.time()) * 1000

        self.fetch_article_details(detail_link)

    def fetch_all_articles(self):
        self.driver.get(Config.URL)
        time.sleep(3)
        crawled_titles = set()  # 用于跟踪已经爬取的帖子标题
        continue_crawling = True
        processed_posts = 0

        while continue_crawling:
            all_articles_xpath = '//*[@id="sticky"]/div[1]/div/div[1]'

            article_elements = self.driver.find_elements(By.XPATH, all_articles_xpath)
            if not article_elements:
                print("No articles found.")
                break
            posts = article_elements[0].find_elements(By.XPATH, ".//div[contains(@class, 'post item')]")
            for i in range(processed_posts, len(posts)):

                article_elements = self.driver.find_elements(By.XPATH, all_articles_xpath)
                posts = article_elements[0].find_elements(By.XPATH, ".//div[contains(@class, 'post item')]")
                post = posts[i]

                title_element = post.find_element(By.XPATH, ".//h2/a")
                title = title_element.text
                if title in crawled_titles:  # 如果帖子已处理，则跳过
                    continue
                crawled_titles.add(title)
                # ...提取帖子信息，处理帖子详情，生成SQL并写入文件...
                detail_link = title_element.get_attribute('href')
                date_element = post.find_element(By.XPATH, ".//div[contains(@class, 'info')]/span[contains(@class, 'date')]")
                date = date_element.text
                # 如果date不是今天的日期，停止循环
                if date != datetime.today().strftime("%Y-%m-%d"):
                    print("Date is not today's date. Stopping the loop.")
                    continue_crawling = False
                    break
                view_element = post.find_element(By.XPATH, ".//div[contains(@class, 'info')]/span[contains(@class, 'view')]")
                view = view_element.text
                id = str(uuid.uuid4()).replace("-", "")
                self.post.update({
                    "id": id,
                    "srcTopicId": id,
                    "title": title,
                    "createTime": int(time.mktime(time.strptime(date, "%Y-%m-%d"))) * 1000,
                    "view": int(view),
                    "authorId": Utils.get_random_element(Config.AUTHOR_IDS),
                    "channelId": Utils.get_random_element(Config.CHANNEL_IDS),
                    "directoryId": Config.CATEGORY_ID,
                    "updateTime": int(time.time()) * 1000,
                })

                Config.HEADERS['Referer'] = detail_link

                # 调用fetch_article_details方法获取详细信息
                self.fetch_article_details(detail_link)

                # 生成SQL语句
                sql = Utils.generate_sql(Utils, self.post)

                # 写入文件
                Utils.write_to_file(Utils, Config.SQL_FILE, sql)

                print(f"Processed {len(crawled_titles)} articles" + 'run_count:' + str(self.run_count))
                processed_posts += 1

            if self.run_count % 10 == 0:
                self.run_count = 0
                print("Scrolling to bottom")
                try:
                    next_page_button_xpath = '//*[@id="sticky"]/div[1]/div/div[2]'
                    Utils.scroll_to_bottom(self)
                    next_page_button = self.driver.find_element(By.XPATH, next_page_button_xpath)
                    ActionChains(self.driver).move_to_element(next_page_button).click(next_page_button).perform()
                    print("Navigating to next page")
                    time.sleep(3)

                except NoSuchElementException:
                    continue_crawling = False  # 没有下一页按钮，停止循环
            else:
                self.run_count += 1

    def fetch_article_details(self, url):

        # 在新标签页中打开帖子详情
        self.driver.execute_script(f"window.open('{url}');")
        time.sleep(3)
        original_window = self.driver.current_window_handle
        all_windows = self.driver.window_handles
        new_window = all_windows[-1]
        self.driver.switch_to.window(new_window)

        content_element = self.driver.find_element(By.XPATH, '//*[@id="iddahe_com_style_div"]')  # 示例XPath
        tag_list = []
        try:
            tag_element = self.driver.find_element(By.XPATH, '//*[@id="sticky"]/div[1]/div/div[1]/div[1]/div[3]')
            tags = tag_element.find_elements(By.TAG_NAME, 'a')
            for tag in tags:
                tag_list.append(tag.text)
        except NoSuchElementException:
            print("Tag element not found")
        content_html = self.driver.execute_script(
            "return document.getElementById('iddahe_com_style_div').innerHTML;"
        )
        soup = BeautifulSoup(content_html, 'html.parser')
        for div in soup.find_all('div', {'class': 'google-auto-placed ap_container'}):
            div.decompose()
        self.post['postTags'] = str(tag_list).replace("'", '\\"')
        self.post['poster'] = Utils.process_images(soup)
        inner_html = ''
        if len(soup.contents) == 1:
            content = soup.find(id='iddahe_com_style_div')
            inner_html = ''.join(str(child) for child in content.contents)
        else:
            inner_html = str(soup)
        self.post['content'] = inner_html.replace("'", '\\"')
        self.driver.close()
        self.driver.switch_to.window(original_window)


def main():
    scraper = WebScraper()
    # path = '//*[@id="sticky"]/div[1]/div/div[1]/div[1]/h2/a'
    # date_path = '//*[@id="sticky"]/div[1]/div/div[1]/div[1]/div[1]/span[1]'
    # view_path = '//*[@id="sticky"]/div[1]/div/div[1]/div[1]/div[1]/span[2]'
    # scraper.fetch_article(path, date_path, view_path)
    # sql = Utils.generate_sql(Utils, scraper.post)
    # Utils.write_to_file(Utils, Config.SQL_FILE, sql)
    scraper.fetch_all_articles()
    scraper.driver.quit()


if __name__ == "__main__":
    main()
