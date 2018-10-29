---
layout:     post
title:      "数据可视化--Echarts"
subtitle:   ""
date:       2018-10-29 18:43:00
author:     "wantu"
header-img: "img/thisNext.jpg"
catalog: true
tags:
    - 数据可视化
    - Echarts
---

## 前言
&nbsp;&#8195;Echarts是我真正意义上接触最早的一种数据可视化工具。它是由百度开源出来的，是一个纯 Javascript 的图表库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器，底层依赖另一个也是该团队自主研发的轻量级的 Canvas 类库 ZRender，提供直观，生动，可交互，可高度个性化定制的数据可视化图表，它对许多图表提供了封装好的组件。用户可以很轻松的使用它们。但是正是由于它封装程度比较高，所以很多个性化的设置是很难做到的。如果你想要有一些自己的封装，那么请尝试使用D3.js，D3的API比较底层，学习成本比较高，望君留意。
[ECharts](http://echarts.baidu.com/) <br>
[D3js](https://d3js.org/) <br>

## 正文
**我要怎么开始呢？**
因为是国人开发的所以开发文档必须有中文格式的。这点对于英文差的小伙伴那是大大的好啊（本人英文很不好）。Echarts在其官网提供了大量的实例。新手可以通过实例很快的上手。那么[传送门](http://echarts.baidu.com/examples/) <br>

#### 使用
**引入相关的js文件**
```javascript
 <script src="/lib/echarts/echarts.min.js"></script>
```
**在前端页面上预留一个div用以展示相关的图表**
```javascript
<div id="chart" style="height: 400px;width: 100%;padding: 5px;"></div>
```
**初始化**
```
 var c1 = echarts.init(document.getElementById('chart1'));
 var c1_option;
```
**获取数据来源并设置option**
这一步数据获取是通过ajax来获取的。原则上后段要进行相关的数据的组装工作。前端拿到相关的series属性值直接放上去就能使用。
```javascript
//这是一个较全的例子
var month_legend = ['上年同期','上期数据','当期数据'];
$.ajax({
                url: "/xxxx",
                type: "post",
                data: {
                    //请求参数
                },
                success: function (data) {
                    //初始化echarts
                    var c1 = echarts.init(document.getElementById('chart1'));
                    var c1_option;

                    if (data.tag == 'success') {
                        //渲染Echarts
                        function draw_echar1(data) {
                          //图表的设置
                            c1_option = {
                                color: ['#4EA1AC', '#2A4556',  '#D2312C'],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross',
                                        crossStyle: {
                                            color: '#3398DB'
                                        }
                                    }
                                },
                                legend: {
                                  //echart的顶部标识 数组
                                    data: month_legend
                                },
                                //y轴树值设置为单位万
                                yAxis: [
                                    {
                                        type: 'value',
                                        min:0,
                                        axisLabel: {
                                            formatter: function (value) {
                                                return Math.round(value/10000)+'万';
                                            }
                                        }
                                    }
                                ],
                                xAxis: {
                                    type: 'category',
                                    axisPointer: {
                                        type: 'shadow'
                                    },
                                    data: ['全平台','自营汇总']
                                },
                                series: //放上后端组装好的数据
                            };
                            //渲染Echarts
                            c1.setOption(c1_option);
                        }}}});
```
后段数据格式
```javascript
[
    {
        name: '上年同期',
        type: 'bar',
        barGap:0,
        data: [12, 23
        ]

    },
    {
        name: '上期数据',
        type: 'bar',
        data: [23, 34

        ]

    },
    {
        name: '当期数据',
        type: 'bar',
        data: [34, 45
        ]
    }
]
```
**渲染Echarts**
```javascript
draw_echar1(data)
```

## 小结
option中的设置就是对图表的一些属性的设置。请多关注option。对这echats的实例多多练习几次你就会很快掌握它。
我个人觉得一些图标的数据组装过程还是比较复杂的。因为前端一般会让后端把series组装好。多看多练。如果条形图，饼图，柱状图都联系过了感觉很轻松。那么请尝试实现这个图表,可以考虑把x,y轴进行转一下。
所有的数据要写活来哦。
[demo](http://echarts.baidu.com/examples/editor.html?c=bar-y-category-stack) <br>