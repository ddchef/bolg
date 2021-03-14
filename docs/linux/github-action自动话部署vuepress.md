---
title: 自动化部署vuepress
---
## 背景
自从博客换成了`vuepress`，每次写完文章都要 `commit`、`merge`、`build`，build完之后，登录ssh，上传dist文件；非常的麻烦，而且这写基本操作都是固定，所以我就想起了github的Actions，他可以通过配置workflows来达到自动化编译和上传文件功能，这样我只要commit之后就不用操作了，过几分钟，博客就自动更新了，这才是代码改变生活嘛。
## 分支规范
分支我计划分为`dev`和`master`分支，和我们平时开发的分支管理模式保持一致；`dev`表示草稿箱，`master`表示发布分支，这样平时没有写完的东西提交了，也不会发布出去，等写完了，直接merge到`master`就直接发布了。仪式感满满！
## 前期准备
因为我是发布到我自己的服务器的，所以需要准备`ssh`登录的私钥；
### 创建key
登入服务器后，先进入`~/.ssh/`文件夹(如果没有，就创建一个)，在这个文件夹执行
```bash
ssh-keygen -t rsa -f mykey
```
然后一直回车，到最后，可以在当前文件下看到 `mykey`，`mykey.pub`这两个文件了，然后执行下面命令
```bash
cat mykey.pub >> authorized_keys
```
`mykey.pub`是公钥，`mykey`是私钥，我们需要拿私钥去登录我们的服务器，__所以私钥需要保管好__

接下来执行
```bash
cat mykey
```
会返回下面类似格式的文本，__全部复制__
```bash
-----BEGIN RSA PRIVATE KEY-----
...............
...............
-----END RSA PRIVATE KEY-----
```
### 配置仓库的`secrets`
地址：`Settings>Secrets`，然后点击右上角的`New repository secret`，就可以输入`Name`和`Value`。现在我们来列一下，需要创建的`repository secret`。 

1. __SERVER_SSH_KEY__: 我们之前创建的私钥`mykey`(不带.pub)
2. __REMOTE_HOST__: 服务器地址
3. __REMOTE_USER__: ssh登录的用户名，例如`root`
4. __REMOTE_TARGET__: 上传文件要放的地址(绝对路径)，例如`/usr/www/html/blog`

## 创建workflows脚本
在当前项目文件夹下创建`.github/workflows/deploy.yml`文件，然后写入下面内容
```yaml
name: publish # Action名称

on:
  push:
    branches:
      - master # 监听分支master的push事件，触发下面的jobs

jobs:
  building: # job名称
    runs-on: ubuntu-latest # 运行环境，Ubuntu的最后一个版本
    steps: # 执行步骤
    - name: Checkout # 步骤名称
      uses: actions/checkout@master # 切换分支到master

    - name: Setup Node.js environment
      uses: actions/setup-node@v2 # 添加nodejs环境
      with:
        node-version: '14' # 设置node版本为14的稳定版，不是 node version = 14

    - name: Build
      run: npm install && npm run build # 运行install和build，这个应该很熟悉

    - name: Deploy
      uses: easingthemes/ssh-deploy@v2.1.5 # 使用别人发布的action进行登录和上传文件
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
        ARGS: "-rltgoDzvO --delete"
        # 注意，这里只会上传dist文件下的文件
        SOURCE: "dist/" # vuepress编译完后的文件路径，从项目的根路径开始
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: ${{ secrets.REMOTE_TARGET }}
```
## 写在最后
在使用`actions/setup-node@v2`和`easingthemes/ssh-deploy@v2.1.5`这两个action可能会有疑惑，我把他们的说明地址贴下，有问题可以直接点击去查看

[actions/setup-node@v2](https://github.com/marketplace/actions/setup-node-js-environment)


[easingthemes/ssh-deploy@v2.1.5](https://github.com/marketplace/actions/ssh-deploy)