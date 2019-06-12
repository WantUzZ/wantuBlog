---
layout:     post
title:      "Echarts"
subtitle:   ""
date:       2018-10-29 18:43:00
author:     "wantu"
header-img: "img/charts.jpg"
catalog: true
tags:
    - Echarts
---

## 前言
&nbsp;&#8195;Echarts是我真正意义上接触最早的一种数据可视化工具。它是由百度开源出来的，是一个纯 Javascript 的图表库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器，底层依赖另一个也是该团队自主研发的轻量级的 Canvas 类库 ZRender，提供直观，生动，可交互，可高度个性化定制的数据可视化图表，它对许多图表提供了封装好的组件。用户可以很轻松的使用它们。但是正是由于它封装程度比较高，所以很多个性化的设置是很难做到的。如果你想要有一些自己的封装，那么请尝试使用D3.js，D3的API比较底层，学习成本比较高，望君留意。
[ECharts](http://echarts.baidu.com/) <br>
[D3js](https://d3js.org/) <br>

## 正文
#### 我要怎么开始呢？
因为是国人开发的所以开发文档必须有中文格式的。这点对于英文差的小伙伴那是大大的好啊（本人英文很不好）。Echarts在其官网提供了大量的实例。新手可以通过实例很快的上手。那么[传送门](http://echarts.baidu.com/examples/) <br>

#### 使用
**样例展示**
![查询执行路径图](/img/echartsShow.jpg)
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
                //单个柱状图中间字体的设置
                var seriesLabel = {
                        normal: {
                            show: true,
                            textBorderColor: '#33',
                            textBorderWidth: 2
                        }
                    }
                //图表的设置
                c1_option = {
                        title: {
                            text: '天气统计'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: ['北京', '上海', '深圳']
                        },
                        grid: {
                            left: 100
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: '天数',
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        xAxis: {
                            type: 'category',
                            inverse: true,
                            data: ['晴天', '多云', '下雨']
                        },
                        //一般来说series属性直接拿后台组装的数据前端不负责数据的组装
                        series: [
                            {
                                name: '北京',
                                type: 'bar',
                                data: [165, 170, 30],
                                label: seriesLabel
                            },
                            {
                                name: '上海',
                                type: 'bar',
                                label: seriesLabel,
                                data: [150, 105, 110]
                            },
                            {
                                name: '深圳',
                                type: 'bar',
                                label: seriesLabel,
                                data: [220, 82, 63]
                            }
                        ]
                };
                //渲染Echarts
                c1.setOption(c1_option);
}}}});
```
后端数据格式
```javascript
[
    {
        name: '北京',
        type: 'bar',
        data: [165, 170, 30],
        label: seriesLabel
    },
    {
        name: '上海',
        type: 'bar',
        label: seriesLabel,
        data: [150, 105, 110]
    },
    {
        name: '深圳',
        type: 'bar',
        label: seriesLabel,
        data: [220, 82, 63]
    }
]
```
**渲染Echarts**
```javascript
draw_echar1(data)
```

## 小结
1、echarts封装的很不错，所以很多设置可能只是一个属性的设置，请多在官方实例中进行尝试修改，并记住常用的属性设置。<br>
#### 常用属性
*后续继续补充*
```
一些常用的属性设置：
xAxis//x轴设置
yAxis//y轴设置 
    type:类型
    min:最小值
    axisLabel:对y轴的单位进行设置 (例子中将单位元设置为单位为万元)
        eg:formatter: function (value) {
                        return Math.round(value/10000)+'万';
                    }
toolbox//工具设置其中支持将展示的图表保存成图片
title//图表标题
legend//图表头部索引
series//展示设置
    type//图表类型 常见pie饼图bar柱状图
    lable//图内显示设置
    data//实际数据
```
2、option中的设置就是对图表的一些属性的设置。请多关注option。<br>
对这echats的实例多多练习几次你就会很快掌握它。<br>
我个人觉得一些图标的数据组装过程还是比较复杂的。因为前端一般会让后端把series组装好。多看多练。如果条形图，饼图，柱状图都联系过了感觉很轻松。那么请尝试实现这个图表,可以考虑把x,y轴进行转一下。
所有的数据要写活来哦。<br>
[demo](http://echarts.baidu.com/examples/editor.html?c=bar-y-category-stack) <br>