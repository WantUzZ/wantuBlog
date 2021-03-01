---
layout: post
title: "环境搭建"
subtitle: ""
date: 2020-12-03 12:12:00
author: "wantu"
header-img: "img/post-bg-rwd.jpg"
catalog: true
tags:
  - Linux
  - Docker
  - pm2
---

2021年年初接到一个搭建新测试环境的活。

## 要求
1. 服务器OS得为CentOS
2. 大部分的中间件跑到Docker
3. 原先数据迁移到新的测试服务器
4. 拉起原先的服务

## 具体实施

### 安装CentOS
1. 下载软件用以制作启动盘
	1.1 下载UltralIso 用来制作启动盘。 教程 - https://jingyan.baidu.com/article/d621e8da4aae592865913f0e.html
	1.2 下载之后直接试用 下载地址：https://pan.baidu.com/s/1vi9__14DsWH-F0KfaC2bdw#list/path=%2F（已保存到本人的百度云盘/软件/软碟通）
2. 制作启动盘
	2.1 选择X86版本。CentOSQL8 因为是做服务器所以minimal即可。（centos8.2没有找到镜像，我是直接到这个地方找的vault.centos.org）
	2.2【重要】 用管理员身份打开UltralIso，否则在写入硬盘映像的时候无法读取到U盘。
	2.3 接下来参考博文：https://blog.csdn.net/lianshaohua/article/details/88381039
	一定要注意下面标红色的部分！！！我在制作启动盘的时候将LABEL信息设置为CentOSQ-8，这个一定要记住。
  2.4 把LABEL的信息修改成小于11位的长度
  2.5 插入U盘
  2.6 点击顶部菜单中的**启动** 选择 **写入硬盘映像**
  2.7 硬盘驱动器选择你的U盘，写入方式usb+hdd+
  2.8 点击写入
3. 安装
  3.1、把U盘插在电脑上（最好是后面的USB口，有些电脑的前置USB口不支持U盘启动）
  3.2、进入电脑的BIOS界面（网上百度，win10是按住shift关机 然后启动电脑的时候按住f2）
  3.3、BIOS设置启动 参考博文：https://blog.csdn.net/weixin_42625184/article/details/105219865
  本人安装的时候在制作启动盘的时候将LABEL设置为CentOSQL-8,进入安装选择界面的时候我们选择最上面的直接安装选项，按e键进行编辑，然后将光标移动到第三行，将相关内容进行删减，使其与LABEL对上。
4. 手动分区：
	阿里云建议：https://developer.aliyun.com/article/539989
	总共1800G容量
      /boot 	500M
      /usr 	15G
      /var	5G
      /home	1600G
      / 	 	50G
      /tmp 	5G
      swap 	32G

  【后采用】后面又进行了一次安装，认为不需要分太多的分区，只要/ /boot /boot/efi swap
  其中swap分区跟内存有关一般设置为内存的一半，但是如果服务器内存过大也可以少设置一点

cat /proc/version  //查看系统版本和内核版本
### 联网&设置静态IP

联网的话：
1. 找一根网线（简单）
2. 设置Wi-Fi

设置静态IP：
  CentOS中的网络配置：
   CentOS中网卡配置文件通常是在/etc/sysconfig/network-scripts/路径下，文件名称一般是“ifcfg-设备名称”形式，例如设备名称是eth0，那么文件名称就是“ifcfg-eth0”(0是数字“零”)。设备名称可以通过ifconfig命令查看。可以通过命令 vi /etc/sysconfig/network-scripts/ifcfg-eth0 编辑。
  具体:
  ```
  TYPE="Ethernet"
  BOOTPROTO="none"
  DEFROUTE="yes"
  IPV4_FAILURE_FATAL="no"
  IPV6INIT="yes"
  IPV6_AUTOCONF="yes"
  IPV6_DEFROUTE="yes"
  IPV6_FAILURE_FATAL="no"
  IPV6_ADDR_GEN_MODE="stable-privacy"
  NAME="enp3s0"
  UUID="xxxx-8f3a-42dc-90f6-3f80020d4f6b"
  DEVICE="enp3s0"
  ONBOOT="yes"
  IPADDR=xxx.xx.xx.xx
  GATEWAY=xxx.xx.xx.1
  DNS1=8.8.8.8
  DNS2=114.114.114.114
  NETMASK=255.255.255.0
  PREFIX=24
  ```
  配置完之后记得重启一下网络服务。


### 数据迁移

redis:通过主从复制完成。
redis-cli -h 172.19.89.14 // 登陆某一台redis
slaveof 172.19.88.60 20001 // 将自己设置为某个Redis实例的从库

// 查看当前redis的 slave-read-only 配置
redis-cli -h 172.19.89.14 -p 6379 -a pwd123 config  get slave-read-only // 有密码
redis-cli -h 172.19.89.149 -p 6379 config get slave-read-only // 无密码

// 检查旧redis链接情况
redis-cli -h 172.19.88.60 -p 20001 client list  |awk -F'addr=' '{print$2}' | awk '{print$1}'|awk -F':' '{print$1}'|sort |uniq -c|sort -nr

// 查看当前Redis实例的角色，判断连接是否断开
redis-cli -h 172.19.89.149 -p 6379 info |grep role

mongodb: mongodump&mongorestore
1.将所有数据库导出到指定目录
mongodump -h 172.19.88.50 -o /home/want/mongodb
2.mongorestore还原数据库
mongorestore -r -h 172.19.89.149 --drop /home/want/mongodb
mongoresotre 支持-h可选项，所以不需要用scp将相关文件传输到对应的服务器上。

mysql: mysqldump
// 将全部的数据库导成为一个sql文件
1. mysqldump -h 172.19.88.50 -u root -p --all-databases > /usr/local/sqlfile.sql // 本地文件路径随意

2. 登陆到指定MySQL实例上
mysql -h xxx.xx.xxx.xx -u -username -p

3. 将sql文件恢复到指定MySQL数据库实例中
source /usr/local/sqlfile.sql


### Docker下载以及相关容器的部署
1. 安装Docker。略～
2. 安装docker-compose。略～
2. 启动容器。通过docker-compose进行启动(创建网络，docker-compose.yml书写等，具体略～)

### 安装Nginx&配置Nginx
安装Nginx
1.sudo yum install nginx 

启用Nginx
sudo systemctl enable nginx 
sudo systemctl start nginx 

验证服务是否运行
sudo systemctl status nginx

调整防火墙
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

测试能否正常访问
在另一台电脑的地址栏中输入：http://xxx.xx.xx.xx

Nginx配置:
~
## 后记
### 参考
  1. https://www.jianshu.com/p/52e3a005fc42
  2. mongo: https://www.jianshu.com/p/667fd4fd6ff7
  3. redis: https://juejin.cn/post/6844904127093440520
  4. mysql: https://blog.csdn.net/zhangzhongzhong/article/details/54949191
