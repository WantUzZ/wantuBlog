---
layout:     post
title:      "book review"
subtitle:   ""
date:       2019-03-09 09:57:00
author:     "wantu"
header-img: "img/post-bg-rwd.jpg"
catalog: true
tags:
    - 书
    - 回顾基础
---
## 开这个的原因
&nbsp;&#8195;温故而知新。内容控制在原先读过的技术书目上。

#### JS高级程序设计
变量：<br>
5中基本类型：Null、Undefined、String、Number、Boolean。注意是类型（首字母大写）<br>
其中注意：typeof操作符 对 null的结果：[typeof null ==object] [typeof 函数== function] [typeof NaN ==> NaN]<br>

对变量进行声明原则是不需要进行初始化的，因为该变量会自动的被赋予undefined。但是显式的初始化仍然是明智的。
因为它有助于我们辨别一个变量到底是没初始化还是没有声明。<br>

```javascript
//比如a是一个没有声明的变量
//那么typeof a ==>undefined
//如果a是有声明的而且也进行了显式的初始化
let a = 0
typeof a === 'number' //true
```
逻辑上讲：null值表示空对象指针。这也是typeof null == object的原因。
如果一个变量将来打算用来保存对象的，那么务必将其初始化为null。

**Boolean** <br>
5个false的情况：null,undefined,"",0,false

**Number** <br>
浮点数值进行计算精度丢失问题。0.1+0.2==>0.300000000000001<br>
.1（有效，等同0.1）<br>
较大较小值可以使用科学计数法进行表示。1.22e5 === 122000<br>

数值范围：Number.MIN_VALUE~Number.MAX_VALUE 大多数浏览器的具体范围是：5e-324~1.797e308.超过范围数值将变成Infinity和-Infinity。可使用isFinite()函数判断数值是否在范围内。false为不在范围内。
一旦为数值变成无穷值那么将不在参与下一次的计算。<br>
NaN（Not a Number）非数值。用来表示本来要返回数值的操作数未返回数值的情况。任何数/0 ==>NaN<br>
2个特点：任何涉及NaN的操作都将返回NaN.其次NaN跟任何数值都不相等，包括NaN自己。<br>

3个数值转换函数：Number(),parseInt(),parseFloat().<br>
注意：Number(undefined) === NaN Number('') ===0,Number(null)===0，或者转换字符串不满足数值格式转换结果也是NaN。<br>
如果是转换的是一个对象，则调用对象的valueOf方法,然后依照规则进行转换，如果转换的结果是NaN，则调用toString()方法。然后再依照那个规则进行转换。不建议使用Number()进行字符串的转换。[先是调用valueOf()不假但是toString()好像有问题]<br>
使用parseInt()。转换规则：1、忽略前面的空格2、第一个字符，第一个字符不是数字返回NaN.如果是继续查找直至全部字符查找完毕或者遇到非数字字符，返回刚刚检索过的数字字符，并以数值的形式返回。<br>
parseInt('') ==>NaN parseInt('123.4') ==> 123<br>
如果第一个字符是数字字符，parseInt()也能识别出各种整数的格式。（8进制【es5之后丧失】、16进制数）<br>
parseInt(010) ==> 10 (es5之后parseInt方法不在具有解析8进制数的能力，前导0会无效) parseInt(0x1) ==> 16(16进制数)
困惑为了消除parseInt()函数上的困惑，该函数提供了第二个参数：转换时使用的基数(多少进制)。<br>
parseFloat()函数跟parseInt()函数类似。2点区别：1、parseFloat会始终忽略前导0。2、解析遇到第一个小数点有效遇到第二个小数点无效<br>

**String:**<br>
字符串不可变。要改变某个字符串就得删除原先得字符串。<br>
转换为字符串：1、toString()方法。null和undefined没有此方法。<br>
数值的toString()可以传递一个基数，用以转换成不同格式。null和undefined没有toString()方法，强项调用该方法会返回这两个值的字面量。<br>

**操作符**<br>
比较操作符：<br>
数值和数值 比大小<br>
数值和 数值型字符比较，将数值型字符转为数值 再比较两者的大小<br>
数值型字符和 数值型字符比较，比较字符编码大小。“23” < "5" 因为：2-->字符编码为50 3-->字符编码为51<br>
字符和字符 比较 也是比较字符编码大小<br>
NaN和任何操作数比较都返回false<br>

相等操操作符：<br>
== 和 !=  两个操作符都会强制转换操作数，然后比较他们的相等性。<br>
如果操作数中有一个是布尔类型，那么将其转为数值，true转为1false转为0，而后进行比较<br>
如果有一个操作数是对象，另外一个不是那么调用这个对象的valueOf方法得到基本的数值类型再根据之前的比较规则进行比较。<br>
null和undefined是相等的<br>
如果有一个操作数是NaN那么相等操作符都将返回false.<br>
两个对象是一个对象相等操作符才返回true<br>
===全相等和!==不全等，不会对操作数进行转换其余同相等和不等<br>

逗号操作符：<br>
用于声明：一条语句可以执行多个声明。let a = 3,b = 2,c = 4;<br>
用于赋值：let a = (1,2,3,4,5);a === 5。因为5是最后一项。此用法不常见。<br>
