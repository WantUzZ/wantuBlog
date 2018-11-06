---
layout:     post
title:      "搭建基于Swagger的接口文档系统"
subtitle:   ""
date:       2018-11-05
author:     "wantu"
header-img: "img/sea20181105.jpg"
catalog: true
tags:
    - Swagger
    - 文档管理
---
## 前言
&nbsp;&#8195;程序员恐怕很多都是不想写文档的，但是一旦接手他人的项目又是第一时间说：文档呢？这确实是一个很常见的现象。其本质反应的就是书写文档比较耗时，技术人员不想做这种“无用功”与接手他人的项目，技术人员又不想看别人的代码，想通过阅读相关的文档加快上手速度之间的矛盾。<br>
&nbsp;&#8195;个人观点：好的规范一定要尽早养成。个人在刚刚参加工作的时候一开始的做法是在service层上写好接口注释，在注释中将相关的接口的功能、请求参数、响应进行描述。到后来采用Rap进行文档管理，Rap管理的好处就是简单、快速。相关的参数像填表一样的填好，比较简单无脑。但是Rap存在很多不足之处：比如说多人同时编辑存在互斥现象，单一文档同一时间只允许一个用户编辑，亦或是接口不支持在线的请求测试（可能自己不知道）等。而且Rap服务器（私服部署情况除外）是外部的，相关的安全性可能不是很靠得住。个人也没有搭建过公司自用的rap。所以相关的复杂度不是很清楚。但是今天，我想向你推荐的这个东西确实对于搭建一个自用的文档管理系统是很方便、高效的。<br>
&nbsp;&#8195;它就是Swagger。

## 正文
#### what?
&nbsp;&#8195;维基百科:Swagger是一个开源软件框架，由大型工具生态系统支持，可帮助开发人员设计，构建，记录和使用RESTful Web服务。 虽然大多数用户通过Swagger UI工具识别Swagger，但Swagger工具集包括对自动化文档，代码生成和测试用例生成的支持。<br>
&nbsp;&#8195;其有三大工具：swagger-ui、swagger-editor、swagger-codegen。swagger-ui是用来显示API文档的，并且它还支持编辑和在线的请求测试。
swagger-editor是一个在线的文档编辑文件工具，有助于整个框架中其他工具的使用，左边编辑右边显示。swagger-codegen,可以根据swagger.json或者swagger.yml文件生成指定的计算机语言指定框架的代码。 

#### 搭建过程
1、新建一个项目，执行 npm init初始化package.json。<br>
2、运行npm install swagger -g --save-dev安装Swagger包。<br>
3、在项目的根目录下新建一个api/swagger/swagger.yaml。并将一下部分复制进来。<br>
```yaml
swagger: "2.0"
info:
 version: "1.0.0"
 title: "xxx后台API"
 description: "接口文档说明以及测试"
 contact:
   name: "want"
   email: "beursuperman@163.com" 
host: "localhost:5500"
schemes:
 - "http"
consumes:
 - "application/json"
produces:
 - "application/json"
paths:
  /api/v1/queryAllGroupMemberChatRecordByChatroomId:
    post:
      summary: 查询群组所有节点之间的聊天记录.
      consumes:
        - application/json
      parameters:
        - in: body
          name: param
          description: 请求体对象
          required: true
          schema:
            $ref: "#/definitions/queryAllGroupMemberChatRecordByChatroomIdReq"
      responses:
        200:
          description: A responsed object      
definitions:
  queryAllGroupMemberChatRecordByChatroomIdReq:
    type: object
    required:
      - scroll
      - chatRoomId
      - size
      - sort
      - index
    properties:
      scroll:
        type: string
        example: '5m'
      size: 
        type: integer
        example: 20
      sort: 
        type: string
        example: 'desc'
      chatRoomId:
        type: string
        example: '8477243337@chatroom'
      index:
        type: string
        example: 'chat'
```
4、运行Swagger project edit，此时会自动打开一个swagger编辑窗口，读取的内容就是上一步中的yaml文件<br>
5、尝试修改编辑窗口的内容，此时右侧会及时修改更新，而且api/swagger/swagger.yaml也会跟着自动更新<br>
6、下载Swagger-ui，拷贝dist文件夹中的代码到根目录下新建的public文件夹<br>
7、创建一个express项目，在根目录下新建index.js。代码如下：
```javascript
//先执行一下npm install
var express = require('express');
var app = express(); 
var opn = require('opn'); 

app.listen(3000, function () { 
  opn('http://localhost:3000/api-doc');
  console.log('App listening on port 3000!');
});

app.use('/api-doc', express.static('public'));
```
8、运行node index.js会启用swagger-ui功能，自动打开api展示页面，但是页面是默认的官网上的东西；<br>
9、将api/swagger文件夹下的/swagger.yaml文件复制到public文件夹下，打开public/index.html，在脚本中修改url为'./swagger.yaml',刷新浏览器，即可看到我们的内容<br>
10、如何将swagger-editor文件的变化实时反馈到swagger-ui上，运行npm install gulp -g --save-dev安装gulp包，在根目录下新建gulpfile.js，代码如下(记得先安装好依赖)：<br>
```javascript
var gulp = require('gulp');
var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');

// 建立api/swagger的swagger.yaml到public下的swagger.yaml联系
gulp.task('swagger', function(){
    var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './api/swagger/swagger.yaml'))); 
    fs.writeFile(path.join(__dirname, './public/swagger.yaml'), JSON.stringify(doc,null,' '));
});

// 实时更新
gulp.task('default', function(){
    gulp.watch('./api/swagger/swagger.yaml',['swagger']);
})
```
11、再看下package.json中的内容：
```json
{
  "name": "doc-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "swg": "swagger project edit",
    "gulp": "gulp"
  },
  "author": "want",
  "license": "ISC",
  "devDependencies": {
    "express": "^4.15.2",
    "swagger": "0.7.5",
    "gulp": "3.9.1",
    "js-yaml": "3.8.3",
    "opn": "5.0.0"
  },
  "dependencies": {
    "cors": "^2.8.5"
  }
}
```
12、新增readme.md添加使用说明：
```
> 须知
* npm start 启动项目并跳转接口展示页面 
* swagger project edit 接口文档在线编辑
* npm run gulp 开始同步编辑 （项目一开始就要执行的命令,因为要实时监控api/swagger/swagger.yaml的编辑变动）
```
#### 效果图
**API编就页面**
![编辑页面](/img/swagger-editor.jpg)
**API展示页面**
![展示页面](/img/swagger-ui.jpg)
**API在线测试页面**
![测试页面](/img/swagger-test.jpg)
**API在线测试响应**
![测试页面](/img/swagger-result.jpg)

#### 期间遇到的问题：
1、跨域问题。这个问题发生在swagger-ui中进行接口测试的时候。出现这个问题,谷歌并询问了宝哥,确认是跨域导致的，所以设置相关的跨域访问进行解决。但是通过查看Network发现又一个OPTION请求每次404？<br>
![报错](/img/cors.jpg)
预检(OPTION)请求产生的大概率原因：<br>
1. Get、Head、Post方法以外的请求方法
2. 如果是POST请求,Content-Type取这三个值以外的值：
* application/x-www-form-urlencoded
* multipart/form-data
* text/plain
那么很明显，consumes的值为application/json肯定是要发送预检请求(OPTION)的。那么如何处理。我暂时的做法是在项目中放掉OPTION请求，一旦预检请求没有响应那么后续的请求是不会发送的。
```
app.use (req, res, next)->
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  if req.method == 'OPTIONS'
    res.send(200)
  else 
    next()
```

2、yaml语法
注意我这书写的格式OAS2的格式。别把OAS3的格式就往上写。相关的语法书写参考官方文档。
[官方文档](https://swagger.io/docs/specification/describing-request-body/) 


搭建参考：[必至](https://zhuanlan.zhihu.com/p/26741562) 