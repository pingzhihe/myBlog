---
title: 4. ENUM 枚举
sidebar_position: 4
authors: zhihe
tags: [rust]
---
# ENUM 枚举
```rust
enum ipAddKind {
    V4,
    V6,
}
```
定义枚举的值:
```rust
let four = ipAddKind::V4;
let six = ipAddKind::V6;
```

### 把数据附加到枚举的变体中去
```rust
struct IpAddr {
    kind: ipAddKind,
    address: String,
}

```
创建实例:
```rust
let home = IpAddr {
    kind: ipAddKind::V4,
    address: String::from("127.0.0.1"),
};
```
我们可以这样化简上面的写法：
```rust
enum ipAddKind {
    V4(u8, u8, u8, u8),
    V6(String),
}
```
这样就不需要额外使用struct
实例化:
```rust
let home = ipAddKind::V4(127,0,0,1);
let loopback = ipAddKind::V6(String::from("::1"));
```
### 为枚举添加方法,用impl关键字：
```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32)
    
}
impl Message {
    fn call(&self) {} 
}
```
调用:
```rust
let q = Message::Quit;
let m = Message::Move { x: 1, y: 2 };
let w = Message::Write(String::from("hello"));
let c = Message::ChangeColor(1, 2, 3);

m.call();
```
## Option 枚举和其在标准库中的使用
描述了某个值可能存在（某种类型）或者不存在的情况  
**Rust 没有 Null**
Null的问题在于:当你尝试像使用非空值那样去使用null值时，会出现错误。
Null的概念还是有用的: 因为某种原因而变为无效或缺失的值。这个概念在Rust中被编码为一个叫做`Option<T>`的枚举。
```Rust
enum Option<T> {
    Some(T),
    None,
}
```
## 强大的match控制流运算符
允许一个值与一系列的模式相比较并根据匹配执行相应代码
模式可以是字面值、变量、通配符、分解结构体、分解枚举、或者范围
```Rust
enum coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
    
}
fn value_in_cents(coin: coin) -> u8 {
    match coin {
        coin::Penny => {
            println!("Lucky penny!");
            1
        },
        coin::Nickel => 5,
        coin::Dime => 10,
        coin::Quarter => 25,
    }
}
```
### Match 匹配必须穷举所有可能性
_ 通配符: 替代其余没列出的值 (_要放在最后面)
```rust
let v = 0u8;
match v{
    0 => println!("zero"),
    1 => println!("one"),
    _ => println!("other"),
}
```

### if let
处理只关心一个分支的值，而忽略其他分支的情况
```rust
let v = Some(0u8);
```
这里
```rust
match v{
    Some(1) => println!("one"),
    _ => (),
}
```
和
```rust
if let Some(1) = v {
    println!("one");
}
```
是一样的