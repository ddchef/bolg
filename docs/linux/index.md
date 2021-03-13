---
title: Docker常用命令
---
## 通用命令
- 强制删除容器
```bash
docker rm -f 容器名
```
- 进入容器内部
```bash
docker exec -it 容器名 bash
```
- 从容器中拷贝文件
```bash
docker cp nginx:/etc/nginx/conf.d/default.conf /usr/local/www/nginx/conf.d
```
- 从宿主机拷贝文件到容器中
```bash
docker cp /usr/local/www/nginx/conf.d nginx:/etc/nginx/conf.d/default.conf 
```
- 自动重启容器
```bash
docker run -d --restart=always nginx
```
## nginx
- 启动nginx
```bash
docker run --name nginx -p 80:80 -d nginx
```
- 挂载硬盘
```bash
docker run -dit --name nginx -p 80:80 -v /usr/local/www/nginx/html:/usr/share/nginx/html -v /usr/local/www/nginx/conf.d:/etc/nginx/conf.d nginx
```
## MySQL
- 启动MySQL
```bash
docker run -dit --name mysql -e MYSQL_ROOT_PASSWORD=password mysql
```
- 加载配置项
```bash
docker run -dit --name mysql -p 3306:3306 -v /usr/local/www/mysql/db:/var/lib/mysql -v /usr/local/www/mysql/conf.d:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=password mysql
```
## Ghost
```bash
docker run -d --name ghost -v /usr/local/www/ghost/config.production.json:/var/lib/ghost/config.production.json -v /usr/local/www/ghost/content:/var/lib/ghost/content -p 2368:2368 --link mysql:mysql ghost:alpine
```
