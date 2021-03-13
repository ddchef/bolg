---
title: Docker化部署Ghost
sidebarDepth: 3
---

> 详细介绍Ghost+MySQL+Nginx部署方案，以及config.production.json的配置
> 以下所有步骤都建立在服务器已经部署docker环境
## 部署MySQL
### 获取镜像

```bash
docker pull mysql
```
### 建立配置文件存放目录
```bash
mkdir -p /usr/local/www/mysql/db
```
```bash
mkdir -p /usr/local/www/mysql/conf.d
```
### 启动镜像(`password`替换为你的MySQL root账号的密码)
```bash
docker run -dit --name mysql -p 3306:3306 -v /usr/local/www/mysql/db:/var/lib/mysql -v /usr/local/www/mysql/conf.d:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=password mysql
```
### 用sql工具连接上远程数据库执行以下`sql语句`
> 不执行以下sql，直接ghost连接会报`ER_NOT_SUPPORTED_AUTH_MODE`错误，主要是因为node的mysql模块不支持MySQL8的`caching_sha2_password`加密方式
```mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
mysql> FLUSH PRIVILEGES;
mysql> quit
```
## 部署Ghost
### 获取Ghost镜像
>使用**ghost:alpine**tag，体积小
```bash
docker pull ghost:alpine
```
### 创建文件夹
```bash
mkdir -p /usr/local/www/ghost/content
```
### 添加配置文件**config.production.json**
>路径`/usr/local/www/ghost/config.production.json`
```json
{
  "url": "http://www.xxx.com",//这个是网站的访问地址，页面上很多点击跳转的地址
  "server": {//这个配置很重要！很多教程都没提到，是服务器监听地址和端口
    "port": 2368,
    "host": "0.0.0.0"
  },
  "database": {// 数据库配置
    "client": "mysql",//指定数据库类型
    "connection": {
      "host": "mysql",//数据库地址，之后创建容器时，link过来的mysql
      "user": "ghost",//数据库用户
      "password": "passwordForGhost",//数据库密码
      "database": "ghost",
      "charset": "utf8"
    }
  },
  "mail": {// 邮箱配置
    "transport": "SMTP",
    "from":"神奇的厨房<xxx@xxx.me>",// 这个一定要加，不然会报错
    "options": {
      "host":"smtp.qiye.aliyun.com",
      "port": 465,
      "secureConnection": true,// 是否启动ssl连接
      "auth": {
        "user": "xxx@xxx.me",
        "pass": "password"
      }
    }
  },
  "logging": {
    "transports": [
      "file",
      "stdout"
    ]
  },
  "process": "systemd",
  "paths": {
    "contentPath": "/var/lib/ghost/content"
  }
}
```
### 创建Ghost容器
>`link mysql:mysql`主要是在ghost容器中添加了一个dns，把mysql解析为`mysql`容器的IP
```bash
docker run -d --name ghost \
  -v /usr/local/www/ghost/config.production.json:/var/lib/ghost/config.production.json \
  -v /usr/local/www/ghost/content:/var/lib/ghost/content -p 2368:2368 \
  --link mysql:mysql ghost:alpine
```
**到此为止你已经可以通过http://ip:2368进行访问了**
## Nginx配置
### 获取镜像
```bash
docker pull nginx
```
### 创建文件夹
```bash
mkdir -p /usr/local/www/nginx/html
```
```bash
mkdir -p /usr/local/www/nginx/logs
```
### 简单的启动容器
```bash
docker run --name nginx -d nginx
```
### copy容器中的配置文件到宿主机
```bash
docker cp nginx:/etc/nginx/conf.d/default.conf /usr/local/www/nginx/conf.d
```
### 强制删除之前创建的容器
```bash
docker rm -f nginx
```
### 查看ghost容器ip信息
```bash
[宿主机]# docker exec -it ghost bash
[容器]# cat /etc/hosts
```
**看非mysql那条**
### 配置conf.d下的default.conf
```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #charset koi8-r;
    access_log  /var/log/nginx/host.access.log;

    location / {
        proxy_pass       http://172.17.0.1:2368;
    }
}
```
### 创建nginx容器
```bash
docker run -dit --name nginx -p 80:80 \
 -v /usr/local/www/nginx/html:/usr/share/nginx/html \
 -v /usr/local/www/nginx/conf.d:/etc/nginx/conf.d \
 -v /usr/local/www/nginx/logs:/var/log/nginx nginx
```
现在你可以通过你ip直接访问了，也可以配置域名，直接进行访问