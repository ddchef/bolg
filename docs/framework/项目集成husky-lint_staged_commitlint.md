---
title: 工程中集成 husky、lint-staged、commitlint
---
> 最近在创建一个 webpack5+vue3+typescript+tsx 的一个vue工程，打算用来重构 [vue-code-diff](https://github.com/ddchef/vue-code-diff)
## 起因
打算在代码提交时，进行 commit 信息格式以及提交内容的代码格式校验，防止出现代码风格和 commit 信息不统一问题，也为后期创建 change-logs 做准备。
## 添加依赖
```shell
yarn add husky lint-staged @commitlint/cli @commitlint/config-angular -D
```
- husky: 提供githook，例如，我们输入完 `git commit -m 'xxxx'` 后，就会触发 `commit-msg`钩子，就可以对 xxxx 内容进行我们规定的格式校验了。
- @commitlint/cli: 上面我们提到对 xxxx 进行格式校验用的就是这个组件。
- @commitlint/config-angular: 这个是 angular 的校验风格，我直接使用了这个。如果想自定义的话可以用 `@commitlint/config-conventional` 组件。
- lint-staged: 主要作用是只校验我们提交(`git add .`)的文件代码格式，而不是去校验所有的文件的格式，可以提高校验效率，不然项目大了之后，校验下数据格式估计就是5~6分钟了。
## 实战
> 先说一个坑，husky 在升级到6.0.0之后，改动极大。我最开始安装，配置完之后完全无法触发 git 的 hook 。最后去查看[官方文档](https://typicode.github.io/husky)，才发现现在网上的 husky 配置都是比较旧的，完全不能使用。

接下来我们一步步操作。
### Enable Git hooks
> 这个 install 不是组件安装，而是相当于注册 husky-hook 到 git 上面。
```shell
npx husky install
npm set-script prepare "husky install"
# 上面那行执行完之后会在 package 添加 "prepare": "husky install"，目前不知道干啥用的。
```
运行完上面的命令，工程下面会出现一个 `.husky` 文件夹，里面就是 hook shell，可以查看 .git/config 文件，发现多了下面高亮的第8行。
```yml {8}
[core]
	bare = false
	repositoryformatversion = 0
	filemode = true
	ignorecase = true
	precomposeunicode = true
	logallrefupdates = true
	hooksPath = .husky
[remote "origin"]
	url = https://github.com/xxxxx.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
[branch "v2.0.0"]
	remote = origin
	merge = refs/heads/v2.0.0
```
### 创建 hook
```
npx husky add .husky/pre-commit "npm test"
```
后面的 `npm test` 是钩子触发的时候，会运行的命令。
现在可以在工程下面的 `.husky` 文件架内多了一个 `pre-commit` 文件，内容为
```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test
```
现在是不是对新版的 `husky` 使用有了相关的了解了。
接下来我们把 lint-staged、commitlint 加上
## commitlint
工程目录下创建 `commitlint.config.js`
```js
module.exports = {
  extends: [
    "@commitlint/config-angular"
  ]
};
```
运行命令
```shell
npx husky add .husky/commit-msg "npm test"
```
修改创建的 `commit-msg` 文件内容为
```shell{4}
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```
关于之前的 `HUSKY_GIT_PARAMS` 已经用 `$1` `$2`代替了。具体可以点击 [HUSKY_GIT_PARAMS](https://typicode.github.io/husky/#/?id=husky_git_params-ie-commitlint-) 查看

## lint-staged
在工程目录下创建 `.lintstagedrc.json` 文件
```json
{
  "src/**/*.{js,json,vue,ts,tsx}": [
    "eslint --fix"
  ]
}
```
还记得我们最开始实验室创建的 `pre-commit` 文件吗？直接修改他，删掉 `npm test`
```shell{4}
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install lint-staged
```

## 结束
看到这里，你的工程已经添加了对应的 git hook，如果还有问题，可以删除 `.git/hooks/` 下面的 `pre-commit` 和 `commit-msg` 文件再试试。
新版的 husky 改动还是很大的，把之前钩子从 .git/hooks 移出来，专门放在了一个文件夹内，所以导致了旧项目升级了 husky ，钩子就不起作用了。