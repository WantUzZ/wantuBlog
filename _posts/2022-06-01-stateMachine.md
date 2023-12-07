---
layout: post
title: "有限状态机"
subtitle: ""
date: 2022-06-01 20:00:00
author: "wantu"
header-img: "img/post-bg-rwd.jpg"
catalog: true
tags:
  - 状态机
---

# 背景

接手的需求是一个状态多，流程流转复杂。如果按照传统的编程思路，可能需要使用 if-else 来实现，但是这样的实现方式不利于扩展，而且不利于维护。
有限状态机在解决这种场景是比较合适的。网上的轮子很多，但是大多数都是 Java 的实现，因为整体的思想不难，所以考虑自己进行实现。

![需求状态流转](/img/2023_blog_img/状态机_01.jpg)

# 状态机

## 状态机的定义

状态机是一种控制流的结构，它包含一组状态，每个状态都有一组动作，当状态机处于某个状态时，会执行对应的动作。

## 有限状态机的特点

- 状态机的状态是有限的，且状态之间是有依赖关系的。
- 状态机的状态是独立的，不受其他状态的影响。

## 状态机的基本概念

第一个是 State ，状态。一个状态机至少要包含两个状态。例如 门有 open 和 closed 两个状态。<br>
第二个是 Event ，事件。事件就是执行某个操作的触发条件或者口令。对于自动门，“按下开门按钮”就是一个事件。<br>
第三个是 Action ，动作。事件发生以后要执行动作。例如事件是“按开门按钮”，动作是“开门”。编程的时候，一个 Action 一般就对应一个函数。<br>
第四个是 Transition ，变换。也就是从一个状态变化为另一个状态。例如“开门过程”就是一个变换。

# 设计实现

## 核心表结构设计

```sql
create table t_state_machine
(
    id           int auto_increment
        primary key,
    project_name varchar(255) default ''  not null comment '项目描述',
    name         varchar(255)             not null comment '状态过渡触发方法名',
    `desc`       varchar(255)             null comment '需求触发动作',
    `from`       varchar(255) default '0' not null,
    from_desc    varchar(255)             null,
    `to`         int(2)                   not null,
    to_desc      varchar(255)             null,
    wx_obj       varchar(2048)            null comment '推送微信配置'
);

```

## 核心代码实现

### 状态机类

```typescript
class DemandStateMachine {
    async initTransition(event: string, demand?: Demand) {
        // 在这进行转换的状态流转校验
        ...
    }

    async Action1(params: any) {
        await this.initTransition('EventName', demand)
        // Action 触发的后置业务逻辑
        ...
        //一连串后续操作收口到事物中进行处理
    }
    ...
}

```

### 接口文件

```typescript
// 1. 注入状态机实例对象
// 2. 参数校验
await this.checkPermission(params);
// 3. 调用实例方法
await this.demandStateMachine.Action1(params);
```
