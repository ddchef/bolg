---
title: Vue History 模式下nginx配置
---
在配置vue的生产环境时，发现`http://xxx.xx/`是OK的，但是页面点击过后到`http://xxx.xx/zh/component`路径，再刷新，页面就直接404了

## 原因
先看下**nginx**配置:
```nginx
location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
}
```
因为是静态资源配置，所以`/zh/component`会被解析静态资源地址为`/usr/share/nginx/html/zh/component/index.html`,我们的index.html是放在了*html*文件夹里面，所以并没有 zh/component/index.html 这个资源。
## 解决
先放解决配置:
```nginx
location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files       $uri $uri/ /index.html;
}
```
其它配置基本不变，只要加上**第4行**的配置就行了。
## 原理
如果我访问的路径是 **http://xxx.xx/zh/component** ，第4行的意思是，先检查 **/usr/share/nginx/html/zh/component** 有没有该资源，再检查 **/usr/share/nginx/html/zh/component/index.html** ，还是没有的话就返回 **/usr/share/nginx/html/index.html**