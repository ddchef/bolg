---
title: webpack-dev-server热更新失效
---
## 问题
在框架升级webpack5的时候，运行 development 模式，启动服务后，编辑内容无法热更新(HMR)，非常的疑惑，在升级之前都是正常的。
## 原因(应该是webpack5的一个bug)
通过一系列的排查以及问题检索，最终锁定问题在 package.json里的 `browserslist`(也有可能是目录下面的`.browserslistrc`文件)。

这个配置主要作用就是提供目标浏览器的兼容性参靠，引导css添加兼容前缀，js的polyfill降级目标，达到兼容浏览器的目的。

## 解决方案

在webpack的`development`配置内添加 `target: 'web'`,如下：
```javascript{4}
module.exports = {
  model: 'development',
  ...
  target: 'web'
  ...
}
```
## browserslist语法学习
|例子|说明|
|---|---|
|>1%|全球超过1%的人使用的浏览器|
|>10% in US |某个国家的浏览器使用率超过10%(中国是CN)|
|last 2 versions |所有浏览器兼容最后两个版本|
|Firefox > 20| Firefox版本高于20|
|ie 6-8| IE版本兼容6-8|
|since 2015| 兼容自2015年以来的浏览器版本|
|last 2 years| 近两年发布的浏览器版本|
|not ie <= 8| 不在兼容 IE8 以下的IE|
|unreleased versions|Alpha和Beta版本|
|unreleased Chrome versions|Chrome的Alpha和Beta版本|