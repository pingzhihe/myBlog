---
title: 7. 错误处理
sidebar_position: 7
authors: zhihe
tags: [rust]
---
# 错误处理
## Rust 错误处理概述
* Rust 的可靠性: 错误处理
    * 大部分情况下: 在编译时提示错误, 并处理
* 错误的分类:
    * 可恢复错误: 例如: 打开文件失败, 可恢复的错误
    * 不可恢复错误(bug): 例如: 索引越界
* Rust 没有类似异常的机制
    * 可恢复错误: `Result<T, E>`
    * 不可恢复错误: `panic!`

## 不可恢复的错误与 panic！
* 当`panic!` 宏执行:
    * 你的程序会打印出一个错误信息, 
    * 展开(unwind), 清理调用栈(Stack)
    * 退出程序

## 为应对 panic, 展开或中止(abort)调用栈
* 默认情况下, 当panic 发生:
    * 程序展开调用栈(工作量大)
        * Rust 沿着栈往回走
        * 依次清理每个函数的数据
    * 或立即中止调用栈:
        * 不清理数据, 直接退出程序
        * 内存由OS 处理

* 想让二进制文件更小, 把设置从展开改为中止
    * Cargo.toml: 
        * `[profile.release]`
        * `panic = 'abort'`

## panic! 的回溯(backtrace)
* panic! 可能出现在: 
    * 我们写的代码中
    * 我们所依赖的代码中

* 可调用panic! 的函数回溯信息来定位引起问题的代码
* 通过设置环境变量: `RUST_BACKTRACE`可以打印出回溯信息 
    * linux: `export RUST_BACKTRACE=1 && cargo run` 
    * windows: `set RUST_BACKTRACE=1 && cargo run`
    * mac: `RUST_BACKTRACE=1 cargo run`
* 为了获取带有调试信息的回溯, 必须启用调试符号（不带 --release）编译程序

## `Result<T, E>` 与处理 可恢复错误(recoverable error)
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
T: 操作成功情况下, OK 变体返回的数据类型  
E: 操作失败情况下, Err 变体返回的错误类型

## 处理 Result

### 匹配不同的错误
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f{
        Ok(file) => file,
        Err(error) => match error.kind(){
            ErrorKind::NotFound => match File::create("hello.txt"){
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => panic!("Problem opening the file: {:?}", other_error),
        },
    };
}
```

* 上面例子中使用了很多match...
* match 很有用, 但是也很冗长
* 闭包(closure)。`Result<T,E>` 有很多方法:
    * 他们接收闭包作为参数
    * 使用match 实现
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = File:: open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}
```
这样写更简洁

## unwrap
* unwrap: match 表达式的一个快捷方法:
    * 如果Result 的值是Ok, unwrap 会返回Ok 中的值
```rust
let f = File ::open("hello.txt");
let f = match f {
    Ok(file) => file,
    Err(error) => {
        panic!("Problem opening the file: {:?}", error)
    }
};
```
和
```rust
let f = File ::open("hello.txt").unwrap();
```
是一样的

## expect 
* expect: 与unwrap 类似, 但是可以指定错误信息
```rust
let f = File ::open("hello.txt").expect("Failed to open hello.txt");
```

## 传播错误
* 在函数中传播错误
* 将错误返回给调用者
```rust
use std::fs::File;
use std::io;
use std::io::Read;


fn read_username_from_file() -> Result<String, io::Error> {
    let f = File::open("hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut s= String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(e) => Err(e),
    }
}

fn main() {
    let result = read_username_from_file();
    println!("{:?}", result);

}
```

## ? 运算符
* ? 运算符: 传播错误的一种快捷方式
```rust
fn read_username_from_file() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s= String::new();

    f.read_to_string(&mut s)?;
    Ok(s)

}
```
这里的`fn read_username_from_file()`实现了和上文一样的功能，但是更简洁 (好甜的语法糖orz)
* 如果Result是OK: OK中的值就是表达式的结果, 然后继续执行程序
* 如果Result是Err: Err中的值将作为整个函数的返回值, 就好像使用了return 关键字一样

## ? 与from函数
* `Trait std::convert::From`:
    * 用于错误之间的类型转换  

* 被? 所引用的错误, 会隐式地被from 函数处理

* 当? 调用from 函数时
    * 它所接受的错误类型会被转化为当前函数返回类型所定义的错误类型

* 用于: 针对不同错误类型, 返回同一种错误类型
    * 只要每个错误类型实现了转换为返回类型所定义的错误类型的from 函数

## ?运算符的链式调用
```rust
fn read_username_from_file() -> Result<String, io::Error> {
    let mut s= String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```
这三行的效果和上文一样, 但是更简洁

## ? 运算符只能用于返回Result的函数
```rust
use std::fs::File;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let f = File::open("hello.txt")?;
    Ok(())
}

```
这样就可以在main 函数中使用? 运算符了  
* `Box<dyn Error>` 意味着函数会返回实现了Error trait 的类型, 但是不需要指定具体将会返回的值的类型
    * 简单理解: 任何可能的错误类型

## 什么时候该用 panic!
* 在定义一个可能失败的函数的时候, 优先考虑返回Result
* 否则就是panic!

## 编写实例, 原型代码, 测试
* 可以使用panic!
    * 演示某些概念: unwrap
    * 原型代码: unwrap, expect (我们还不知道后续该怎么处理错误)
    * 测试: unwrap, expect 

## 有时你比编译器掌握更多信息
* 你可以知道Result 就是OK: unwrap
```rust
use std::net::IpAddr;
fn main(){
    let home: IpAddr = "170.0.0.1".parse().unwrap();
}
```

## 错误处理的指导性建议
* 当代码最终可能处于损坏状态的时候, 最好使用panic！
* 损坏状态(Bad state): 某些假设, 保证, 约定或不可变性被打破
    * 例如非法的值, 矛盾的值或者空缺的值被传入代码
    * 以及下列的一条: 
        * 这种损坏并不是预期能够偶尔发生的事情。
        * 在此之后,你的代码中没有一个好的方法来将这些信息(处于损坏状态)进行编码。

## 场景建议
* 调用你的代码, 传入无意义的值: panic!
* 调用外部不可控代码, 返回非法状态, 你无法修复: panic!
* 如果失败是可预期的: Result
* 当你的代码对值进行操作, 首先应该验证这些值: panic!

