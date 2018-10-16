---
layout:     post
title:      "Hello world"
subtitle:   " \"Hello World, Hello Blog\""
date:       2018-10-10 18:43:00
author:     "wantu"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - jekyll+github page
---

> “10000km”


## 前言

want 的 Blog 就这么开通了。

[跳过废话，直接看技术实现 ](#build) 
这个博客网站是基于Jekyll+GitHub Pages搭建而成的。
主要是为了记录自己的生活、工作、学习的事情。之前一直使用为之笔记进行总结。
加法要做减法也要做，笔记中的一些有趣的知识希望在博客中进行分享。

<p id = "build"></p>
---

## 正文

接下来说说搭建这个博客的步骤。（OSX）  
```
1、安装ruby环境
    brew install ruby

2、安装一些其他的软件
    gem install jekyll

    gem install bundler

    gem install jekyll-paginate

    gem install jekyll-gist

3、从GitHub找一个模板项目并进行启动
    git clone https://github.com/Huxpro/huxpro.github.io.git
    检出来之后启动cd到项目目录中
    jekyll server

4、调整项目布局（个人行为）

5、购买域名，并将域名解析到自己的userName.github.io上

6、github page同样也要绑定到自己购买的域名上

```


优点：

* **Markdown** 带来的优雅写作体验
* 非常熟悉的 Git workflow ，**Git Commit 即 Blog Post**
* 利用 GitHub Pages 的域名和免费无限空间，不用自己折腾主机
	* 如果需要自定义域名，也只需要简单改改 DNS 加个 CNAME 就好了 
* Jekyll 的自定制非常容易，基本就是个模版引擎



## 后记

具体搭建过程请参照[教程](https://my.oschina.net/u/1027043/blog/1794382) 


