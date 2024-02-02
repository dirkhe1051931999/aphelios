# coding: utf-8
"""
"""
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient


class Spider(object):
    def __init__(self, src_from=None, dest=None, DealTime=None):
        # MongoDB信息
        self.client = MongoClient(host="localhost", port=27017)
        # 库名
        self.db = self.client['spider']
        # 表名
        self.collection = self.db['feiji_piao']
        self.options = Options()
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(executable_path="/usr/local/bin/chromedriver")
        self.driver.implicitly_wait(10)
        self.verificationErrors = []
        self.accept_next_alert = True
        self.url = """
        https://flight.qunar.com/site/oneway_list.htm?searchDepartureAirport={}&searchArrivalAirport={}&searchDepartureTime={}
        """
        self.src_from = src_from
        self.dest = dest
        self.DealTime = DealTime

    def get_content_with_web(self):
        # 根据传入的参数,打开去哪儿网的页面, 获取网页源代码
        # 如果起飞地、目的地、出发时间三者任一为空,则报错不执行
        if self.src_from and self.dest and self.DealTime:
            url = self.url.format(self.src_from, self.dest, self.DealTime)
            try:
                self.driver.get(url)
                # 获取网页的源代码, 这样才能拿到所有的包括航班在内的信息
                content = self.driver.page_source
                return content
            except:
                return None
        else:
            print("需要同时指定 出发地、目的地、出发时间")
            return None

    def get_content_with_read_file(self):
        # 做测试用函数
        with open("1.html", "r", encoding="utf-8") as f:
            content = f.readlines()
        content = "".join(content)
        return content

    def get_single_page(self, content):
        # 获取航班信息,并且将信息存入MongoDB
        # 传入包含航班信息的网页代码
        soup = BeautifulSoup(content, 'lxml')
        # 这是定位到包含航班信息的div层, select返回一个list数据
        all_div_dingceng = soup.select("div['class=\"mb-10\"'] div['class=\"m-airfly-lst\"'] div['class=\"b-airfly\"']")
        for i in all_div_dingceng:
            # 公司名称
            name1 = i.select("div['class=\"air\"'] span")[0].text
            company_name = re.sub("\n|\s", "", name1)
            # 航班名称
            name2 = i.find("div", attrs={'class': "num"}).text
            hangban_name = re.sub("\n|\s", "", name2)

            # 起飞时间
            time1 = i.select("div['class=\"sep-lf\"'] h2")[0].text
            start_time = re.sub("\n|\s", "", time1)
            # 飞行时间
            range = i.select("div['class=\"range\"']")[0].text
            range_time = re.sub("\n|\s", "", range)
            # 航班结束时间
            time2 = i.select("div['class=\"sep-rt\"'] h2")[0].text
            stop_time = re.sub("\n|\s", "", time2)

            # 没搞明白网页的数字显示原理, 显示的数字跟实际的数字不一致, 这个是获取价格
            try:
                price = i.select("em['class=\"rel\"'] b['style=\"width:48px;left:-48px\"']")[0].text
                price = re.sub("\n|\s", "", price)
            except:
                price = i.find("em", attrs={'class': "rel"}).find("b").text
                price = re.sub("\n|\s", "", price)
            # 折扣信息
            zhekou = i.find("div", attrs={"class": "vim"}).text
            zhekou = re.sub("\n|\s", "", zhekou)

            # 组装为一个dict,然后插入MongoDB
            data = {"CompanyName": company_name, "HangBan": hangban_name, "StartTime": start_time,
                    "Range": range_time, "StopTime": stop_time, "Price": price, "Account": zhekou,
                    }
            print(data)
            try:
                self.collection.insert(data)
            except:
                print(data)
                pass
                # break

    def clear_cookie(self, delete_all=False):
        # 操作cookie示例
        if delete_all:
            self.driver.delete_all_cookies()
        else:
            try:
                self.driver.delete_cookie("QN277")
            except:
                pass

    def main(self):
        # 主函数,引用上面的函数,得到网页文本内容,然后用 get_single_page 来处理
        content = self.get_content_with_web()
        # content = self.get_content_with_read_file()
        self.get_single_page(content)


if __name__ == "__main__":
    # 起飞
    city_list = ["北京", "天津", "沈阳", "长春", "哈尔滨", "上海", "南京", "武汉", "广州", "重庆", "成都", "西安", "石家庄", "唐山", "太原", "包头", "大连",
                 "鞍山", "抚顺", "吉林", "齐齐哈尔", "徐州", "杭州", "福州", "南昌", "济南", "青岛", "淄博", "郑州", "长沙", "贵阳", "昆明", "兰州",
                 "乌鲁木齐", "邯郸", "保定", "张家口", "大同", "呼和浩特", "本溪", "丹东", "锦州", "阜新", "辽阳", "鸡西", "鹤岗", "大庆", "伊春", "佳木斯",
                 "牡丹江", "无锡", "常州", "苏州", "宁波", "合肥", "淮南", "淮北", "厦门", "枣庄", "烟台", "潍坊", "泰安", "临沂", "开封", "洛阳", "平顶山",
                 "安阳", "新乡", "焦作", "黄石", "襄樊", "荆州", "株洲", "湘潭", "衡阳", "深圳", "汕头", "湛江", "南宁", "柳州", "西宁"]
    for i in city_list:
        src_from = i
        # 目的地
        dest = "北京"
        # 出发时间
        deal_time = "2024-01-10"
        a = Spider(src_from=src_from, dest=dest, DealTime=deal_time)
        a.main()