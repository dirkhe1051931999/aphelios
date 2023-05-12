# Project Overview

This is a full-stack integrated service project with multiple server-side and client-side to provide a one-stop service solution. The goal is to build a cross-platform application, from server-side to various types of clients.

## Full-stack integrated services

- Server-side: used to handle business logic and provide interfaces for clients to call.
- Backend management system: used to manage the data on the server side, including user information, order information, etc.
- Web page: used to display the information and functions of the service, which can be accessed through the browser.
- H5 page: used to display the information and functions of the service on the mobile terminal, which can be accessed through the browser.
- Mobile App: Used to display the information and functions of the service on mobile devices to provide a better user experience.
- Windows Client: Used to display the information and functions of the service on desktop devices, providing a better user experience and operational experience.
- Generate data: The collected data will be organized and converted into SQL file format. Some images or resources will be stored in OSS (Object Storage Service).

## Branching

- Server branch->service, technologies used koa, docker, redis, minio, mysql
- backend management branch->management, technology stack is quasar
- web page branch->web, technology stack vue (server-side rendering)
- h5 page branch->h5, the technology stack is vant
- app page branch->app, technology stack is flutter
- windows client branch->desktop, technology stack is electron
- Capture data branch->generate, technology stack is python

## installation environment

```
## Install docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
# Remove all terminated containers
docker container prune
# Create mysql5.7
docker run -d -p 3309:3306 -v mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql --restart always mysql:5.7
# Create MySQL8.0.23
docker volume create mysql8
docker run -d -p 3310:3306 -v mysql8:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql8 --restart always mysql:8.0.23
# Create redis
docker run -d --name redis -p 6380:6379 --restart always redis:latest
# Create nginx
docker run -d --name nginx -p 80:80 --restart always nginx:latest
# Install git
yum install git
git config --global user.name "dirkhe1051931999"
git config --global user.email "hejiandirk@163.com"
git config --list
# Install nodejs 16
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash
sudo yum -y install nodejs
# install cpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker -compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
# Create a new minio oss object store
vi docker-compose.yml
------------------------------------------
version: '3.7'
services.
minio.
image: minio/minio
ports: - '9000:9000' - '9001:9001'
volumes: - '. /minio/data1:/data1' - '. /minio/data2:/data2'
command: 'server --console-address ":9001" http://minio/data{1.. .2}'
environment: - MINIO_ROOT_USER=admin - MINIO_ROOT_PASSWORD=12345678
healthcheck.
test: - CMD - curl - '-f' - 'http://localhost:9000/minio/health/live'
interval: 30s
timeout: 20s
retries: 3
------------------------------------------
# Run and end compose
docker-compose up -d
docker-compose down
# View started containers
docker ps
```
