---
slug: appendix-1
title: Appendix-1

authors: zhihe
tags: [cpp] 
---
# Appendix 1

# `std::vector` 库的方法

| 方法 | 调用语法 | 返回类型 | 功能 | 示例代码 |
| --- | --- | --- | --- | --- |
| push_back | vec.push_back(value) | void | 向 vector 的末尾添加一个元素 | vec.push_back(10); |
| pop_back | vec.pop_back() | void | 移除 vector 的最后一个元素 | vec.pop_back(); |
| back | vec.back() | T&（引用类型） | 返回 vector 中最后一个元素的引用，可读可写 | int x = vec.back(); |
| size | vec.size() | std::size_t | 返回 vector 的当前大小（元素个数） | std::size_t s = vec.size(); |

# `std::string` 库的方法

| 方法 | 调用语法 | 返回类型 | 功能 | 示例代码 |
| --- | --- | --- | --- | --- |
| stoi | std::stoi(str) | int | 将字符串转换为整数 | int x = std::stoi("42"); |
