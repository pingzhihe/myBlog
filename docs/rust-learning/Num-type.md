---
title: 1. Rust 基本数据类型
sidebar_position: 1
authors: zhihe
tags: [rust]
---
## Rust 基本数据类型
Rust 是静态类型语言，编译器在编译时就必须知道所有变量的类型。
* Rust 默认是不可变的，使用mut关键字可以声明可变变量。
```rust
let x = 5;
x = 6; //error
let mut x = 5;
x = 6; //ok
```
## Shadowing
可以用相同的名字声明新的变量，此时新的变量会覆盖之前的变量，这种情况叫做变量的shadowing。
```rust
let x = 5;
let x = x + 1;
```
使用let声明的同名新变量，它的类型可以与之前的变量不同。
```rust
let spaces = "   ";
let spaces = spaces.len();
```
## Data Types
rust 是静态类型语言，编译器在编译时就必须知道所有变量的类型。

```rust
let guess: u32 = "42".parse().expect("Not a number!");
```
## Expression and Argument
表达式返回一个值，语句不返回值。
这里大括号里面的就是一个表达式，它返回一个值。
```rust
    let y = {
        let x = 3;
        x + 1 //expression
    };
```
这里的就是statement，它返回空tuple。
```rust
    let y = {
        let x = 3;
        x + 1; //statement
    };
```
## 流控制
if else 是表达式，所以可以用在let语句的右边。
```rust
    let number = if condition { 5 } else { 6 };
```
if else 一般语法：
```rust
    let number = 3;
    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
```
loop 关键字告诉Rust反复执行一块代码，直到你喊停
loop 是一个无限循环，可以用break跳出循环。
```rust
    let mut counter = 0;
    let result = loop{
        counter +=1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is {}", result);
```
### 另外一种循环是每次执行循环体前都判断一次条件
while 循环为这种模式而生
```rust
    let mut number = 3;
    
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    println!("LIFT OFF!!!");
```

遍历集合使用for循环更简洁紧凑，它可以针对集合中的每个元素来执行一些代码
```rust
    let a = [10, 20, 30, 40, 50];
    for element in a.iter() {
        println!("the value is: {}", element);
    }
```
Range: 指定一个开始数字和一个结束数字，Range可以生成他们之间的数组（不含结束）
```rust
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("LIFT OFF!!!");
```

