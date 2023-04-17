# aphelios

init

```
# 删除所有终止状态的容器
docker container prune
# 创建mysql5.7
docker run -d -p 3309:3306 -v mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql --restart always mysql:5.7
# 创建MySQL8.0.23
docker volume create mysql8
docker run -d -p 3310:3306 -v mysql8:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql8 --restart always mysql:8.0.23

# 创建redis
docker run -d --name redis -p 6380:6379 --restart always redis:latest
# 创建nginx
docker run -d --name nginx -p 80:80 --restart always nginx:latest
# 安装git
yum install git
git config --global user.name "dirkhe1051931999"
git config --global user.email "hejiandirk@163.com"
git config --list
# 安装nodejs 16
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash
sudo yum -y install nodejs
# 安装cpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 查看启动的容器
docker ps
```
