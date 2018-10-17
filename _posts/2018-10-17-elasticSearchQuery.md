---
layout:     post
title:      "回顾ElasticSearch的使用(持续更新...)"
subtitle:   ""
date:       2018-10-16 18:43:00
author:     "wantu"
header-img: "img/post-bg-universe.jpg"
catalog: true
tags:
    - ElasticSearch
    - 搜索
    - 数据分析
---
## 前言
### es背景故事
&ensp;&#8195;多年前，一个叫做Shay Banon的刚结婚不久的失业开发者，由于妻子要去伦敦学习厨师，他便跟着也去了。
在他找工作的过程中，为了给妻子构建一个食谱的搜索引擎，他开始构建一个早期版本的Lucene。
直接基于Lucene工作会比较困难，所以Shay开始抽象Lucene代码以便Java程序员可以在应用中添加搜索功能。他发布了他的第一个开源项目，叫做“Compass”。
后来Shay找到一份工作，这份工作处在高性能和内存数据网格的分布式环境中，因此高性能的、实时的、分布式的搜索引擎也是理所当然需要的。
然后他决定重写Compass库使其成为一个独立的服务叫做Elasticsearch。<br>
&ensp;&#8195;第一个公开版本出现在2010年2月，在那之后Elasticsearch已经成为Github上最受欢迎的项目之一，代码贡献者超过300人。
一家主营Elasticsearch的公司就此成立，他们一边提供商业支持一边开发新功能，不过Elasticsearch将永远开源且对所有人可用。<br>
&nbsp;&#8195;Shay的妻子依旧等待着她的食谱搜索……
### 基础知识：
1、es本质上是一个分布式文档(document)数据库，允许多台机器协同工作，每台机器可以运行多个es实例。单个es实例称之为节点。一组节点构成一个集群。<br>
2、index:type = 1:n type:document = 1:n 但是6.x版本只允许每个index包含一个Type。<br>
3、因为单节点（硬件限制）不可能存储太大的数据量，es提供了将index（一组document的集合）划分为分片的功能。分片数据只是整个index数据的一部分。<br>
4、index 分片 复制分片关系：index划分为多个分片每个分片占整个数据的1/n，index一旦复制就会有复制分片。<br>
主分片的数量只能在创建的时候指定后期不能修改，复制分片的数量是支持后期修改的<br>
5、默认情况下es会为每一个index分配5个主分片和一个副本（5个复制分片）。同一份shard是不会在一个节点中保存的(容灾、提高查询性能考量)。<br>

## 正文

## 后记
### 相关问题
#### 为啥主分片的数量后期无法修改？

#### 脑裂问题
