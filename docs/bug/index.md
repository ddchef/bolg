---
title: iframe无法传递cookie问题
---
## 问题
工作中，需要嵌套友商的页面进入自己的项目中，但是遇到一个非常奇怪的问题，iframe里面的页面登录成功了还是无法请求数据，报无权限问题。
## 原因
经过各种搜索和排查，最终发现是chrome最新版本(80后)会默认设置cookie的SameSite默认值为Lax，就导致了跨域不发送cookie的情况。
## 初步解决
打开`chrome://flags `，搜索**SameSite**，设置为**disabled**。这样就能解决本地问题了，但是我们的系统是面向客户的，不可能说让客户去做修改。所以只能继续查找解决方案
## 解决方案
既然这个问题是跨域导致的，那么解决掉跨域问题不就可以了吗？
假如需求为**A项目**地址为a.com，**B项目**地址为b.com，现在在B项目中要嵌套A项目的页面。
那么只要把**A项目**地址改为b.com:8080就行了，因为cookie只和域名IP有关，和端口无关。
## 解决方法
首先不可能让友商把服务部署到我们的服务器上，所以只能通过nginx的代理功能解决这个问题。那么nginx怎么配置了？
```nginx
server {
    listen       8080;
    server_name  localhost;
    location / {
        proxy_pass http://a.com/;
    }
}
```
这样iframe的地址只要改为b.com:8080就行了，这样都是同一个域名，不会出现cookie丢失的问题了