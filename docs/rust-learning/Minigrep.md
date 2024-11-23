---
title: 11. Minigrep
sidebar_position: 11
authors: zhihe
tags: [rust]
---

## Minigrep
[Souece code 源码](https://github.com/pingzhihe/Hello-Cargo/tree/master/minigrep)

minigrep 是一个简单的命令行程序, 它从文件中搜索包含指定字符串的行, 并打印出包含该字符串的行

## 二进制程序关注点分离的指导性原则
* 将程序拆分为main.rs和lib.rs, 将业务逻辑放入lib.rs
* 当命令行解析逻辑较少时, 将它放入main.rs也行
* 当命令行解析逻辑变复杂时, 需要将它从main.rs提取到lib.rs

## 经过上述拆分, 留在main的功能有:
* 使用参数值调用命令行解析逻辑
* 进行其他配置
* 调用lib.rs中的run函数
* 处理run函数可能出现的错误

## 测试驱动开发 TDD(Test-Driven Development)
* 编写一个会失败的测试, 运行该测试, 确保它是按照预期的原因失败
* 编写或修改刚好足够的代码, 使得新测试通过
* 重构刚刚添加或修改的代码, 确保测试会始终通过
* 返回步骤1, 继续

## 标准输出vs标准错误
* 标准输出: stdout
    * println!
* 标准错误: stderr
    * eprintln!
