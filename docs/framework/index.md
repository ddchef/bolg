---
title: 前端微服务架构实战
sidebarDepth: 3
---
## 缘起
在产品迭代过程中，由于客户定制需求多，部署到客户现场的定制内容也多；之后的主线版本升级时，客户现场的定制版本就无法升级，导致了研发团队要维护多个主线版本。常年的定制积累，最后发现研发人员人力完全不够，而且主线新开的功能也不能用于客户现场，最后慢慢的迷失在用户的需求定制当中。  


今年年初，在通过一段时间的探索过后，决定用微服务的模式解决定制需求的问题。这样主版本和定制版本就完全分离了，以后主版本升级不会影响到定制版本，也就不会因为维护多主线版本而导致人力分散，客户也可以及时使用我们最新版本的功能。

## 技术选型
目前市面上比较成熟的微服务框架的话主要是阿里的`乾坤`和`single-spa`，乾坤是基于single-spa封装了扩展了功能，但是我们的业务场景不太符合。我们没有沙盒隔离和样式隔离的需求，因为我们都同一个工程分出去的代码，在样式和底层业务逻辑都是一致的，而且，经过三到四年的沉淀，基本很稳定。所以选用了single-spa作为我们的微服务框架。

## 实战
先说明下拆分后的架构，然后解释下原因，最后展示重点代码

### 页面拆分和资源路径

目前拆分好的架构是以`layout`为入口，`custom`为定制，`main`为主版本。在页面上的拆解图如下

![alt 界面示意图](/界面示意图.jpg)

**黄色底色**部分表示`layout`，**红色框内**依据不同的路由渲染不同的内容(custom or main)

静态资源加载如下图

![alt 资源架构图](/asset-dir.jpg)

### 主应用配置

对应在`layout`中的代码是
```js
// main.js
import { registerApplication, start } from 'single-spa';
import { loadApp } from './micro';

const apps = [
  {
    // 定制版本
    name: 'custom',
    // 子应用加载函数，是一个promise
    app: loadApp(`//${window.location.host}/`, 'custom'),
    // 当路由满足条件时（返回true），激活（挂载）子应用
    activeWhen: (location) => location.pathname.startsWith('/home/custom'),
    // 传递给子应用的对象
    customProps: {},
  },
  {
    // 主线版本
    name: 'main',
    // 子应用加载函数，是一个promise
    app: loadApp(`//${window.location.host}/`, 'main'),
    // 当路由满足条件时（返回true），激活（挂载）子应用
    activeWhen: (location) => location.pathname.startsWith('/home/main'),
    // 传递给子应用的对象
    customProps: {},
  },
];
apps.forEach((item) => {
  registerApplication(item); // 注册微服务
});
start();// 启动服务
```
```js {23}
// micro.js
// 远程加载子应用
function createScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    // 获取到js脚本后插入到document里面进行加载和执行。执行完后，window对象会挂载一个 globalVar 对象，也就是vue对象
  });
}

// 记载函数，返回一个 promise
export function loadApp(url, globalVar) {
  // 支持远程加载子应用
  return async () => {
    // 注意这个全局变量，后面custom会有对应的使用
    window.__INJECTED_PUBLIC_PATH_BY_AILPHA__ = `${url}${globalVar}/`;
    await createScript(`${url + globalVar}/static/js/${globalVar}.main.js`);
    // 这里的return很重要，需要从这个全局对象中拿到子应用暴露出来的生命周期函数
    return window[globalVar];
  };
}
```
还需要修改Router的 `base`为**home**，`mode`为**history**模式
```js{2,3}
new Router({
  base: 'home',// 如果项目部署时是根路径就没有必要设置，我的项目部署在/home/路径下面
  mode: 'history',
  routes: []
})
```
### 子应用配置
在`custom`中的重点代码
```js {3,4}
// main.js
import singleSpaVue from 'single-spa-vue';
import App from "./App";
import CustomApp from './custom-app';

if (window.__INJECTED_PUBLIC_PATH_BY_AILPHA__) {
  // 修改webpack运行时的基础公共路径
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_AILPHA__;
}

const isMicro = process.env.NODE_MODE === 'micro' && window.__INJECTED_PUBLIC_PATH_BY_AILPHA__;
let vueLifecycles = null;

const GetAppOptions = (component, el = '#app') => ({
  el,
  store,
  router,
  mounted() {
    if (!isMicro) {
      start();
    }
  },
  render: (h) => h(component),
});

if (isMicro) {
  vueLifecycles = singleSpaVue({
    Vue,
    appOptions: GetAppOptions(CustomApp, '#microApp'), //注意 CustomApp 和 App 的不同
  });
} else {
  new Vue(GetAppOptions(App));
}

// 暴露微服务的生命周期
export function bootstrap(props) {
  if (isMicro) {
    return vueLifecycles.bootstrap(() => { });
  }
}
export function mount(props) {
  if (isMicro) {
    return vueLifecycles.mount(() => { });
  }
}

export function unmount(props) {
  if (isMicro) {
    return vueLifecycles.unmount(() => { });
  }
}
```
第三和第四行分别是用于平时开发和发布**App的入口**，看下`App.vue`和`custom-app.vue`中的主要代码
```vue
<!-- App.vue 开发时使用 -->
<template>
  <layout> <!-- 页头和菜单 -->
    <router-view/>
  <layout>
</template>
```
```vue
<!-- custom-app.vue 打包时使用 -->
<template><!-- 没有页头和菜单 -->
    <router-view/>
</template>
```
其中webpack涉及的改造如下
```js
export default {
  output: {
    ...
    library: 'custom', // 运行时暴露全局变量为 custom,对应 layout 的 micro.js中23行
    libraryTarget: 'umd'// 修改打包输出为 umd 模式
  },
}
```
:::danger
**最最最重要的一个修改，如果想在开发模式下进行微服务调试，子应用一定一定要关闭 webpack 的热更新**

`inline:false`
:::

## 总结
微服务听着比较高大上，一套跟着上面配置下来，基本就理解原理了。

> 基本上就是通过匹配不同的路由加载不同的js文件，然后`document.getElementById('microApp')`获取到dom后，把vue实例挂载到这个dom元素下，后面的渲染过程基本和原项目运行一致。

主要需要注意的地方只有全局变量污染和样式污染。

接下我会写一篇完全从零开始，用vue-cli初始化的项目微服务改造过程。