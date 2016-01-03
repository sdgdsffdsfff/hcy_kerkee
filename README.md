# kerkee H5框架 #

## 框架包含如下内容：##
>1. 使用 atrtemplate 模板引擎
>1. 使用 requirejs amd模块加载器
>1. 使用 bridgeLib 实现客户端与H5的初始化与通信
>1. 使用 gulp 构建系统
>1. 展示了页面切分和逻辑模块划分清清晰，适用团队分工合作
>1. 支持两种应用场景 1、作为独立的H5站点在浏览器中运行，2、作为hybrid app中的H5部分在客户端中运行
>1. URD协议做页面跳转
>1. 后期会逐步引入页面路由技术，页面转换的有限状态机应用等。

## 目录说明 ##

~~~
├── html -------------------------------- kerkee的开发目录
│   ├── attach -------------------------- kerkee用于注入的js脚本目录，放置客户端需要注入的功能脚本(供客户端使用)
│   │   └── js
│   │       └── bridgeLib.js
│   ├── bridgeLib.js -------------------- kerkee使用的js基础库，包含H5和native的连接通信初始化，接口调用模块等(与attach/js/bridgeLib.js相同)
│   ├── manifest ------------------------ 项目模块配置信息,包含依赖客户端版本,当前模块版本等,便于升级使用
│   ├── build --------------------------- 前端项目构建配置模块，基于r.js，具体配置信息查看build.js
│   │   ├── build.js
│   │   ├── r.js
│   │   ├── run.js
│   │   └── run.sh
│   ├── crossplatform ------------------- 跨平台-浏览器端实现模块
│   │   ├── base ------------------------ 基础模块，开发者不需要改动，相当于驱动引擎
│   │   │   ├── global.js --------------- 全局数据通信模块
│   │   │   └── injectionPage.js -------- 注入框(即页面)模块(即加载injectionPage目录中的模块文件)
│   │   │   └── registerModule.js ------- 加载接口模块，用于动态加载页面中的接口(即加载interface目录中的模块文件)
│   │   ├── injectionPage --------------- 页面注入模块，用于存放向特定页面中注入“框”的模块
│   │   ├── interface ------------------- 存放接口模块，对应客户端的接口实现
│   │   └── static ---------------------- 存放injectionPage模块注入页面中的静态文件
│   ├── css ----------------------------- 前端项目开发中需要用到的css模块，可以拆分成初始化css，页面css和组件css，工程中支持用require.css动态加载
│   │   ├── channel.css
│   │   ├── normalize.css
│   │   └── plugin.css
│   ├── images -------------------------- 前端项目开发中需要用到的图片资源
│   │   └── loading.gif
│   ├── modules
│   │   ├── test  ----------------------- 模块包名，如test等。放置模块的js、html、less等文件
│   │   │   ├── test.js ----------------- 模块配置，index.html对应的script引入的入口文件，通常用于配置加载器所需要的资源路径和初始化方法（使用r.js压缩合并后，modules里对应的模块包里的资源会合并到这个里面）
│   │   │   ├── testDo.js --------------- 模块功能初始化入口，需要包含一个和模块名+Do方法的模块，作为初始化方法模块（类似java里的main方法）
│   │   │   └── test.html --------------- 前端项目开发中需要的模块主入口页面
│   │   ├── clientApi ------------------- 通用函数库&接口库
│   │   │   ├── testApi.js -------------- 例子相关接口模块
│   │   │   └── util.js------------------ 工具库函数
│   └── vendor  ------------------------- kerkee需要调用的lib库根目录
│       ├── api ------------------------- kerkee提供的api和设备调用功能（设备信息，网络通信，原生UI等）
│       │   ├── device
│       │   │   └── platform.js
│       │   ├── nativeUI
│       │   │   └── widget.js
│       │   └── util
│       ├── core ------------------------ kerkee的js模块加载器
│       │   └── SHFLoader.js
│       ├── lib ------------------------- 第三方库js库
│       │   ├── jquery.lazyload.js
│       │   ├── template.js
│       │   ├── underscore.js
│       │   └── zepto.min.js
│       └── plugin ---------------------- requriejs加载器插件
│           ├── almond.js
│           ├── css-builder.js
│           ├── domReady.js
│           ├── normalize.js
│           ├── require.css.js
│           └── require.text.js
├── gulpfile.js ------------------------- gulp构建工具配置文件
├── gulp.sh ----------------------------- gulp构建命令调用脚本，可以调用特定的构建命令
├── package.json ------------------------ gulp构建工具需要加载的资源依赖包
├── README.md  -------------------------- 模块使用说明的markdown
├── target  ----------------------------- 构建输出目录
└── test  ------------------------------- 单元测试用例目录
~~~

## 项目构建 ##

### 构建客户端使用的项目 ###

gulp build（该命令构建的项目用于客户端使用）

或下面三个命令分别执行，但以下三个命令不会进行dek加密，所以不推荐使用

step 1. sh gulp.sh rjs (进行amd模块合并)
step 2. sh gulp.sh rmin (进行html模板标签替换)
step 3. sh gulp.sh zip  (进行打包并加上时间戳)

### 构建可独立运行的H5项目 ###

由于这套框架是跨平台的，既可以运行在制定的客户端作为hybrid app中的H5部分，也可以独立运行在浏览器中作为一个wep站，所以针对运行环境不同，为了保证在不同环境下拥有最佳的性能，构建方式也有所不同，执行下面的命令，构建独立的H5项目，构建后的输出目录为 html/target/ 

gulp build --web (该命令构建的项目为可独立运行的H5项目，项目根目录为target目录)

## 框架整体思路 ##

![kerkee H5框架的整体思路](http://7xlolm.com1.z0.glb.clouddn.com/201512311H5%E8%B7%A8%E5%B9%B3%E5%8F%B0%E6%80%9D%E8%B7%AF%E4%B8%8Ehybrid%E6%80%9D%E8%B7%AF%E5%AF%B9%E6%AF%94%E5%9B%BE.png)

## 不同平台业务逻辑代码区别对比 ##

由于kerkee H5框架可以运行在两种环境（客户端、浏览器），由于底层实现机制已经项目构建上的区别等原因，业务逻辑层面的代码会略有不同，如下图：

![kerkee H5不同环境业务逻辑代码对比](http://7xlolm.com1.z0.glb.clouddn.com/201512312%E6%96%B0%E8%80%81%E6%A1%86%E6%9E%B6%E5%9F%BA%E6%9C%AC%E4%BB%A3%E7%A0%81%E5%AF%B9%E6%AF%94%E4%B8%8E%E6%80%BB%E7%BB%93.png)

通过上图我们可以看出，两种环境下得代码区别并不大，并且右侧的代码是在左侧的代码基础上增加了一些代码，所以可以理解为右侧兼容左侧且不影响左侧，所以开发只需编写一套代码做到两端统一，在业务逻辑开发过程中，统一使用右侧代码

## 只需增加两个文件，就可以使运行在客户端环境的代码顺利的运行在浏览器中 ##

![只需增加两个文件，就可以使运行在客户端环境的代码顺利的运行在浏览器中](http://7xlolm.com1.z0.glb.clouddn.com/201512313H5%E8%B7%A8%E5%B9%B3%E5%8F%B0%E5%BC%80%E5%8F%91%E9%A1%B5%E9%9D%A2%E6%A8%A1%E5%9D%97%E6%96%87%E4%BB%B6.png)

## H5开发方式 ##

一个大前提：kerkee H5框架业务逻辑代码在两种环境(浏览器、客户端)是完全一致的。

基于上面的大前提，当团队进行项目开发时，H5人员可以在本地浏览器环境使用跨平台的方式开发浏览器环境的代码，在浏览器环境调试通过后即可通知客户端人员使用H5 Admin 构建平台下载所需的包。
