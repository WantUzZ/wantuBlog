---
layout:     post
title:      "回顾搭建一个基于express的web项目遇到的问题"
subtitle:   ""
date:       2018-10-23 19:43:00
author:     "wantu"
header-img: "img/shan.jpg"
catalog: true
tags:
    - Node.js
    - Express
---
## 前言
&nbsp;&#8195;基于express框架搭建一个项目的壳子是一直想去做但是没有去做的一件事。之前在店达做的多的是模块的编码，也没有自己去搭建过项目。但是毕竟写的代码多了对整个框架也比较熟悉而且本人有定期整理的习惯，所以说express框架还是比较了解的。<br>
&nbsp;&#8195;光说express框架我觉得不是很好，如果有一个横向的对比，可能对理解express框架有更多的帮助。基于暂时除了Node.Js本人之前的学习方向一直是J2EE方向。所以我决定用J2EE很流行的SSM框架与Express框架进行对比。（当然现在Spring Boot和 Spring Cloud很火）

## 正文
#### 背景知识
**什么是Express框架？如何用？为什么要用它？3W：who how why**<br>
&nbsp;&#8195;什么是express框架?在其主页中写到express是一种保持低层度规模的灵活Node.js Web应用程序框架，为Web和移动应用程序提供一组强大的功能。<br>
&nbsp;&#8195;如何使用？我觉得官方文档肯定是写的比我详细的，我也不做搬运工了，君自取。<br>
[入门教程传送门](https://expressjs.com/zh-cn/starter/installing.html) <br>
[一个基于Express搭建的空壳](https://github.com/WantUzZ/wantProject.git) <br>
![教程位置](/img/expressKnow1.jpg)
&nbsp;&#8195;为什么要用?我觉得这个问题可以拆分为两个问题？第一为什么要用Node.js？第二为什么选择Express框架？针对第一个问题，我所知道的原因有以下几点：
* 采用事件驱动，异步编程，为网络服务而设计。
* 非阻塞模式的IO处理
* JavaScript对JSON的功能支持
* 轻量，开发速度快
同样Node.js也有许多缺点：<br>
* 单进程、单线程，只支持单核CPU,不能充分使用多核CPU服务器。目前Node.js也提供多种方式支持多进程。
语言好比一种剑术，江湖剑派各有所长。Node.js非常适合IO密集型的系统。

#### 目录结构说明
&nbsp;&#8195;如何你很认真的跟着之前的官网的教程上来做，你肯定知道了通过Express应用程序生成器来快速创建应用程序框架。生成的应用程序具有以下目录结构。
![目录结构](/img/expressKnow2.jpg)
但是我还是选择自己手动去创建这个目录结构。存粹为了脑子多点关于这个结构的记忆吧。其实也不必过多的关注这个目录结构，只要多进行练习，这个目录结构会很轻松的浮现在我们的脑海。<br>
**app.js**<br>
&nbsp;&#8195;app.js是整个框架非常重要的一个文件。它是一个请求的入口，框架的相关设置也是在这个文件（诸如：渲染引擎设置、session设置、错误处理等）。
```javascript
//处理静态的requests请求
app.use(express.static(path.join(__dirname, 'public')));
//设置view路径和模版
app.set('views',path.join(__dirname,'views'));
//设置渲染引擎 ejs/jade
app.set('view engine is ejs','ejs');
//-- app.set('view engine is jade','jade') 


//app.use配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(cookieParser());

//session相关设置
app.use(session({
  store: new redisStore(config.session_redis),//使用redis存储session，相关redis配置见session_redis
  secret:'wantProject', //用来对session id相关的cookie进行签名
  resave:false, //是否每次都重新保存会话，建议false
  saveUninitialized:false,//是否自动保存为初始化的会话，建议false
  cookie:{
    maxAge:7*24*3600*1000 //有效期单位毫秒
  }
```
**routers**<br>
&nbsp;&#8195;这是文件夹是项目的路由文件夹。其中包含了view路由和api路由的相关设置。<br>
一个完整的请求流程：
1. 用户发送一个请求某个界面的view请求
2. view路由处理相关请求并渲染views目录下的相关的界面
3. 在相关界面中用户发送相关数据求
4. api路由处理请求并通过service层进行相关业务需求的数据组装并响应请求
5. 前端接收响应数据并进行相关数据的渲染

**package.json**<br>
&nbsp;&#8195;这是文件指明了项目的启动命令、项目的作者、项目的名称等一系列信息，但是最为重要的是，在这个文件中支持我们对相关依赖的控制。

**config.js**<br>
&nbsp;&#8195;config.js是框架的配置文件。在这我们可以灵活的配置各个环境的设置。
```javascript
// 环境配置
let development = {
  system_port:8018,
  session_redis:{
    host:'127.0.0.1',
    db:4,
    port:6379,
    ttl:7*24*3600
  }
};

let test = {
};
let experience = {
};
let production = {
};
module.exports = {
  development,test,experience,production
}
```
**logs**<br>
&nbsp;&#8195;日志相关文件目录：app.log、error.log、http.log。<br>
**public**<br>
&nbsp;&#8195;一些样式、脚本、第三方插件的存放目录。<br>

#### 对比SSM

## 小结