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

1. 删除认证/申请-》移除 sm_board_company_verify_info where authorId==authorId，移除 sm_board_author 的 companyVerifyInfoId，设置 sm_board_author 为 2
2. 删除用户-> 如果是普通用户，直接删除，如果是企业，如果提交认证了走取消认证申请流程，没有提交认证，只删除 sm_board_author
3. 审核页面，如果审核通过，sm_board_author 的 status 改为 4，sm_board_company_verify_info status 改为 1
4. 审核页面，如果审核未通过，sm_board_author 的 status 改为 5，sm_board_company_verify_info status 改为 2
5. 角色那边加一个审核员权限
