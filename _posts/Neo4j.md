```
开始做处理消息:000000000000200672201709180950107146661118643620330429290
开始做处理消息:210283600000209325201711300859397146661118626040315912700
开始做处理消息:210283460000209402201712201005597146661110000000000000000
```

```
neo4j:
create:
	create (n:xxx{att:value}) 
	(n:xxx{att1:value1})前面的n是用于捕获结果。
merge:
	megre (n:xxx{att:value}) Merge好似if-else语句，基本逻辑是先检测merge后面的条件，看看有没有匹配的返回值，如果有则执行on merge分支，如果没有则走on create。
set(更新):
	match (n:xxx{att:value}) set n.att = newValue return n
除了create 和 delete 以外其他语句都必须要以return结尾
delete:
	不建议使用match (n) delete n （强保护机制，必要要先删除关系再删除节点）
	而是使用：match (n) detach delete n (弱保护机制)
	remove:专门删除属性、标签
		match (n:xxx{att:value}) remove n.att return n
match(查询)...where:
	在match之前可以进行定位用以加快查询速度。这个在之前添加节点优化的时候就是这样做的。
	常见聚合操作：count、distinct、max、min...
	
```

模式与模式匹配

```
节点模式：
	使用括号进行描述，但是额外不使用
标签模式：
	增加标签限定，多哥标签起到交集作用
关系模式
	match (a:A)-[b:relations]->(c:C) return a,b,c
	首先会搜寻两个标签节点，再去这些节点中寻找符合relations关系。
	双向就不要剪头:match (a:A)-[b:relations]-(c:C) return a,b,c
属性模式

	属性匹配使用的是花括号和键值对，其间使用逗号分隔。
where：
	where不能单独使用，只能用在match、optionalmatch、start、with的后面，用以进一步过滤模式的数据。
	where从句中使用模式：
		1、对于一个集合，如果是空集，那么代表false，非空代表true。可以使用in关键字来进一步限定。(这种做法不在数据量大的时候会导致查询速度非常慢，在match之前进行定位)。=～ 不等于。点号和[]是相等，但是用法讲究。对于[]，其间必须是常量。
		2、使用exists()函数进行属性校验。
			match (x)
            where exists(x.age)
            return x.name
        3、字符串匹配：starts with、ends with、contains
            match (x)
            where x.name starts with "B"
            return x.name
    其他从句：
        
		
		
	
```

