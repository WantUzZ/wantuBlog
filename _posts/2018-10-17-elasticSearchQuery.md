---
layout:     post
title:      "回顾ElasticSearch的使用(0115更新)"
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
#### 写在最前面
&ensp;&#8195;[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)<br>
&ensp;&#8195;[中文文档翻译](https://scsundefined.gitbooks.io/elasticsearch-reference-cn/content/)<br>
&ensp;&#8195;**es更新速度很快，最好的学习方法就是跟着官方文档走！！！**
#### es背景故事
&ensp;&#8195;多年前，一个叫做Shay Banon的刚结婚不久的失业开发者，由于妻子要去伦敦学习厨师，他便跟着也去了。
在他找工作的过程中，为了给妻子构建一个食谱的搜索引擎，他开始构建一个早期版本的Lucene。
直接基于Lucene工作会比较困难，所以Shay开始抽象Lucene代码以便Java程序员可以在应用中添加搜索功能。他发布了他的第一个开源项目，叫做“Compass”。
后来Shay找到一份工作，这份工作处在高性能和内存数据网格的分布式环境中，因此高性能的、实时的、分布式的搜索引擎也是理所当然需要的。
然后他决定重写Compass库使其成为一个独立的服务叫做Elasticsearch。<br>
&ensp;&#8195;第一个公开版本出现在2010年2月，在那之后Elasticsearch已经成为Github上最受欢迎的项目之一，代码贡献者超过300人。
一家主营Elasticsearch的公司就此成立，他们一边提供商业支持一边开发新功能，不过Elasticsearch将永远开源且对所有人可用。<br>
&nbsp;&#8195;Shay的妻子依旧等待着她的食谱搜索……
#### 基础知识：
1、es本质上是一个分布式文档(document)数据库，允许多台机器协同工作，每台机器可以运行多个es实例。单个es实例称之为节点。一组节点构成一个集群。<br>
2、索引(index)就是一批有着相似文档特征的文档的集合,集群对索引的个数没有限制。<br>
3、类型(type)在一个索引中，我们可以定义一个或者多个类型，类型是索引的一个逻辑分割。<br>
4、文档(document)是被索引的数据信息的一个基本单元。<br>
5、index:type = 1:n type:document = 1:n 但是6.x版本只允许每个index包含一个Type。<br>
6、因为单节点（硬件限制）不可能存储太大的数据量，es提供了将index（一组document的集合）划分为分片的功能。分片数据只是整个index数据的一部分，每个分片在自身内部都是一个有着完整功能并且独立的“索引”，可以被托管到集群中的任意一个节点中,而一个分片(shard)又包含多个segments，而每一个segment是一个倒排索引，每针对一个shard的查询操作都将被归于对该shard中的segment的查询。<br>
7、index 分片 复制分片关系：index划分为多个分片每个分片占整个数据的1/n，index一旦复制就会有复制分片。<br>
主分片的数量只能在创建的时候指定后期不能修改，复制分片的数量是支持后期修改的<br>
8、默认情况下es会为每一个index分配5个主分片和一个副本（5个复制分片）,但是最好是根据实际数据量手动进行设置。同一份shard是不会在一个节点中保存的(容灾、提高查询性能考量)。<br>
9、NRT近实时。从我们对一个文档进行创建索引开始到这个文档变得可以被搜索之间可能有一个潜在的传输延迟时间（默认是1秒）。<br>

## tips
#### 结构化查询or结构化过滤？
&nbsp;&#8195;最近负责的项目开始的时候并不觉得这两者有何不同，所以在项目的开始阶段无论需求是啥，一律采用结构化
查询方式去进行相关的数据的检索。但是后来回顾的时候发现这样的行为是不符合规范的。两者的侧重点不一样查询语句做全
文搜索或者其他需要进行相关性评分的时候是可以的因为_score会给一个评分，可以通过这个评分筛出最符合要求的数据
但是如果只是检索范围数据或者是满足部分条件的数据我们更应该去使用结构化过滤查询语句。（完全的使用过滤也是行不通，不指定范围的话默默认使用match_all）<br>
值得注意的是过滤查询语句执行之后返回的结果汇总是包含一个_score，但是这个分值是由match_all产生的，所有文档的得分都是1。
> 请尽可能多的去使用过滤器，尽可能多的去使用过滤查询语句。

**性能相关:** 
 &nbsp;&#8195;使用过滤语句得到的是一个结果集--简单的documen列表，快速匹配运算并存入内存是十分方便的， 每个文档仅需要1个字节。这些缓存的过滤结果集与后续请求的结合使用是非常高效的。查询语句不仅要查找相匹配的document还得计算每个document的相关性，所以一般查询语句的性能要低于过滤语句的，并且查询语句的结果也是不可缓存的。但是，由于倒排索引的缘故，一个只匹配少量文档的简单查询语句在百万级文档中的查询效率会与一条经过缓存 的过滤语句旗鼓相当，甚至略占上风。但是一般情况下，一条经过缓存的过滤查询要远胜一条查询语句的执行效率。
**标准语法:** 
```javascript
GET /_search
{
  "query": { 
    "bool": { 
      "must": [
        { "match": { "title":   "Search"        }}, 
        { "match": { "content": "Elasticsearch" }}  
      ],
      "filter": [ 
        { "term":  { "status": "published" }}, 
        { "range": { "publish_date": { "gte": "2015-01-01" }}} 
      ]
    }
  }
}
```
#### 关于must、should、must_not组合关系的一些说明

must:取多个条件筛出的数据集的交集。被查询的文档一定要被包含。<br>
should:取出多个条件的数据集的并集。被查询的文档不一定要被包含，有的话文档的相关性会加分。<br>
must_not:查询文档一定不能被包含。<br>

一些常见的组合：<br>
  must和should:首先会筛选出所有满足must条件的文档集，如果文档集中存在满足should的文档那么加分，不存在满足should的文档还是会返回全部满足must条件的文档集。<br>
  filter和其他(must/should/must_not)：第一步还是会晒出满足过滤条件的文档集。继而在匹配满足其他条件的文档集。如果没有满足其他条件的文档集(should)就返回全部满足过滤条件的文档集,(must)就不返回任何文档<br>
  打个比方：一个dsl过滤得到全部都是江西的男性。dsl查询中must是年龄大于200的人员姓名。很明显没有满足条件的人，那么将没有返回。但是如果是dsl查询中should是年龄大于200的人员姓名，那么将返回全部的江西的男性。<br>


#### 过滤器性能优化
从上面的分析来看，过滤的性能大体上是好于查询的，但是过滤也有好坏。一般来说在bool条件中过滤器的顺序对性能有很大的影响。从MySQL查询优化中我们知道尽早的缩小结果集是一个非常有效的提高查询性能的方法，
同理在es中更详细的过滤条件应该被更早的去执行以便更早的排除更多的文档。<br>
**控制缓存**<br>
缓存的过滤器非常快，所以它们需要被放在不能缓存的过滤器之前执行。

#### NRT！refresh、flush操作。
之前负责一个数据转换模块的编码工作，在业务逻辑理的非常清楚之后，数据转换的结果还是不尽如人意。<br>
业务大致：O-->A-->B<br>
数据源是O,每处理一个O的元数据会将相关的数据录入到ES中A的index,同时会发送一个消息给B系统。B从A录入到ES的index检索数据，经过一系列操作之后将产生的数据录入到ES中B的index。<br>
在B录入数据的过程中发现同样一个dsl不同时间查询的数据量是不一样的。<br>
原因是：<br>
搜索系统的Index一般都是NRT（Near Real Time），近实时的，比如Elasticsearch中，Index的实时性是由refresh控制的，默认是1s，最快可到100ms，那么也就意味着Index doc成功后，需要等待一秒钟后才可以被搜索到。<br>
什么是refresh？<br>
先将index-buffer中文档解析完成的segment写入到filesystem cache之中，这样避免了比较损耗性能io操作，又可以使document可以被搜索。这个从index-buffer中取数据到filesystem cache中的过程叫作refresh。<br>
index-buffer:缓存新数据的地方。当其满了或者refresh/flush interval到了，就会以segment file的形式写入到filesystem cache并最终写入到磁盘。默认是 10%heap size。<br>
[REFRESH-API](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-indices-refresh) <br>
```
POST /twitter/_refresh  指定刷新Twitter
POST /kimchy,elasticsearch/_refresh 刷新多个
POST /_refresh 全部刷新
```
flush:<br>
如果数据在filesystem cache之中是很有可能因为意外的故障导致丢失。此时需要一种机制，可以将对es的操作记录下来，来确保当出现故障的时候，保留在filesystem的数据不会丢失，并在重启的时候恢复过来。es为每一个shard提供来translog来记录这些操作。<br>
当向es发送创建document索引请求的时候，document数据先会进入到index buffer，与此同时会被记录到translog中，当发生refresh时（数据从index buffer流到filesystem cache的过程）translog中的操作记录不会消失，而是当数据从filesystem cache中被写入到磁盘之后才会被translog中清空。而filesystem cache写入到磁盘的过程就是flush。
![cql优化后](/img/es-refresh.png)

#### 索引别名的实用性
&nbsp;&#8195;最近分析系统的数据源和采集系统数据源数据结构不一致问题牵出了这个问题。周知索引一旦建立就不能修改其mapping，但是如果需求方确实要进行相关的mapping修改那怎么办？只得重建索引然后再把数据进行导入。这个过程很可能造成服务的中断。别名就能大大缓解这个问题。<br>
索引别名相当于一个指针，只不过这个指针可以指向一个或多个索引。

**相关语法（局部）：**
```javascript
//新增索引别名
POST /_aliases
{
    "actions" : [
        { "add" : { "index" : "test1", "alias" : "alias1" } }
    ]
}
或者是：PUT /{index}/_alias/{name}

//移除索引别名
POST /_aliases
{
    "actions" : [
        { "remove" : { "index" : "test1", "alias" : "alias1" } }
    ]
}
//重命名索引别名，此操作是原子操作。
POST /_aliases
{
    "actions" : [
        { "remove" : { "index" : "test1", "alias" : "alias1" } },
        { "add" : { "index" : "test2", "alias" : "alias1" } }
    ]
}

```
#### from+size的不足和深分页的解决方法
&nbsp;&#8195;es进行后端分页常用的方法是使用from+size的那种方式进行，一旦页数比较大，那么由于分布式搜索的缘故会导致CPU和内存的大量消耗。<br>
**分布式搜索解析**<br>
*第一阶段：查询阶段（解决取谁这个问题)*<br>
* 客户端发送搜索请求给某个节点A（协调节点），该节点创建一个from+size的空优先级队列。
* 节点A转发这个搜索请求到索引中的每个分片的原本或副本，每个分片在本地执行这个查询并且会将结果保存到一个大小为from+size的有*序本地优先级队列中。
* 每个分片返回document的ID和它的优先级队列的所有document的排序值给协调节点A,节点A会把这些值合并到自己的优先级队列里产生全局排序结果。<br>

*第二阶段：取回阶段（解决取的是谁这个问题)*<br>
* 协调节点会根据全局排序结果辨别出哪个document需要取回，并且向相关的分片发送GET请求。
* 每个分片加载document并且根据需要丰富它们（丰富：补全一些必要的信息），然后将document返回给协调节点。
* 一旦所有的document都被取回，协调节点会将返回结果返回给客户端。

根据上面的对分布式搜索的认知我们知道使用from+size的这种方式进行分页操作，每个分片都要构造一个from+size长度的优先级队列，而协调节点则要对  分片数量*（from+size） 个document进行排序找size个document。这就是消耗CPU和内存的原因了。而且在实际工作中会出现from+size查询10000以后数据为空的情况（在网上还发现部分出现报错提示）。

**解决**<br>
1、通过修改index.max_result_window的值来继续使用from+size。但是对内存的占用很大。不推荐。
2、使用scroll API做深度分页。
3、使用search_after API。

**scroll做深度分页**<br>
直接上DSL
```javascript
(通过API调用search方法)：
{
	"index": "chat",
	"from": 0,
	"size": "1",
	"scroll": "5m",//5分钟之后失效
	"body": {
		"query": {},
		"sort": {
			"time": "desc"
		}
	}
}
(elasticsearch-head中使用)
GET: /index/_search?scroll = 10m
{
    "query": { "match_all": {}},
    "sort" : ["_doc"], 
    "size":  1000
}
```
scroll分页请求头必须携带一个scroll属性，表示scroll的失效时间。第一次请求之后会除了数据还有一个scroll_id返回回来，接下来的请求我们只需要将scroll和scroll_id作为请求参数就可以不停的获取下一批数据。scrollId在失效时间内是存在的，但是es维护它是需要额外的开销的，好习惯：每次查询结束进行手动的清除scrollId.<br>
```
DELETE /_search/scroll
{
    "scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAD4WYm9laVYtZndUQlNsdDcwakFMNjU1QQ=="
}
```
js:[API](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-scroll)<br>
```javascript
client.clearScroll([params, [callback]])//Params中的scrollId属性的值可以是：String, String[], Boolean
```


**code(xxx.iced)**<br>
```javascript
// 刚开始的一次scroll查询
  searchRBN: (query, cb)->
    dsl = _.cloneDeep DSL.COMMUNICATION_RECORD_BETWEEN_NODES
    dsl.index = query.index
    if query.sort and query.sort is 'asc'
      dsl.body.sort[0].time = 'asc'

    dsl.scroll = query.scroll if query.scroll
    dsl.body.query.bool.should[0].bool.must[0].term.source = query.source
    dsl.body.query.bool.should[0].bool.must[1].term.target = query.target
    dsl.body.query.bool.should[1].bool.must[0].term.source = query.target
    dsl.body.query.bool.should[1].bool.must[1].term.target = query.source

    console.info JSON.stringify dsl
    allHits = []    
    esClient.search(dsl)
      .then((response)-> 
        response.hits.hits.forEach((hit) -> allHits.push(hit))
        objArr = buildRBNSData allHits
        return objArr
      )
      .then((result, err)->
        cb err, result
      )
  //查询下一页接口     
  searchRBNScrollData:(query,callback) ->
    sq = {scroll_id: query.scrollId, scroll: query.scroll} 
    esClient.scroll(sq).then((response) -> 
      callback null,buildRBNSData response.hits.hits
    ).catch((error) -> 
      callback error
    )
  //组装数据
  buildRBNSData = (dataArr)->
    objArr = []
    for item in dataArr
      obj = {}
      obj.id = item._id
      obj.source = item._source.source
      obj.target = item._source.target
      obj.type = item._source.type
      obj.time = item._source.time
      obj.content = item._source.content
      objArr.push obj
    return objArr 
```
**scroll API的不足**<br>
&nbsp;&#8195;虽然es官方文档中也建议我们使用scroll API进行高效的深度滚动，但是使用scroll context的花费是很高的，建议不要将其用在用户实时请求上。那么实时请求的处理可以交给search_after。

**search_after API做深度分页**<br>
&nbsp;&#8195;search_after参数通过提供实时的游标来解决这个问题。它的策略是使用上一页的结果来帮助检索下一页。值得注意的是：分页的前提是对数据集进行排序，涉及排序需要将文档中的某一个字段作为排序依据。那个字段必须是能够标识某一个文档的，否则具有相同值的文档的顺序将无法确定。建议使用字段_id因为它是每一个文档的唯一值。search_after是实时的，它始终针对最新版本的搜索器进行解析。它也不是解决自由跳转的方案。因为是实时的所以排序顺序可能会在索引更新或者删除的时候发生变化。<br>
先模拟查询一次：
```javascript
GET twitter/_search
{
    "size": 10,
    "query": {
        "match" : {
            "title" : "elasticsearch"
        }
    },
    "sort": [
        {"date": "asc"},
        {"_id": "desc"}
    ]
}
```
模拟获取下一页数据：
```javascript
GET twitter/_search
{
    "size": 10,
    "query": {
        "match" : {
            "title" : "elasticsearch"
        }
    },
    "search_after": [1463538857, "654323"],
    "sort": [
        {"date": "asc"},
        {"_id": "desc"}
    ]
}
//search_afetr就是根据你的sort排序规则，填写上一次获取的最后一个数据的值，我们第一次查的是按照date、_id排序，所以填写上次获取的最后一个数据的date和_id即可。
```


## 问题
#### 为啥主分片的数量后期无法修改？
es通过以下公式计算文档对应的分片：
```
shard = hash(routing) % number_of_primary_shards
//routing 默认是文档的id
//number_of_primary_shards 主分片的数量
```
从这个公式可以看出如果主分片数量发生改变很有可能造成文档对应的分片找不到的情况。
#### 脑裂问题
