---
title: 9. 生命周期
sidebar_position: 9
authors: zhihe
tags: [rust]
---
# life time:生命周期
* Rust 的每一个引用都有自己的生命周期
* 生命周期: 引用保持有效的作用域
* 大部分时候生命周期是隐含并可以推断的，正如大部分时候类型也是可以推断的一样
* 当引用的生命周期可能以不同的方式相互关联时: 手动标注生命周期

## 生命周期-避免悬垂引用(dangling reference)
* 悬垂引用: 指向了其数据被释放的内存
```rust
fn main() {
    {
        let r;
        {
            let x = 5;
            r = &x;
        }
        println!("r: {}", r);
    }
}
```
输出报错: `` `x` does not live long enough ``

## 借用检查器
* Rust 编译器有一个 借用检查器(borrow checker) 来比较作用域来确保所有的借用都是有效的
图示:
```rust
fn main() {
    {
        let r;                //----------+-- 'a
                              //          |
        {                     //          |
        let x = 5;            // -+-- 'b  |
            r = &x;           //  |       |
        }                     // -+       |
                              //          |
        println!("r: {}", r); //----------+
    }

}

```
这样就可以通过编译了
```rust
fn main() {
    let x = 5;
    let r = &x;
    println!("r: {}", r);
}
```
## 函数中的泛型生命周期
```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}

fn longest (x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
报错: `` expected named lifetime parameter ``
纠正:
```rust
fn longest<'a> (x: &'a str, y: &'a str) -> &'a str  {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
## 生命周期标注
* 生命周期标注并不改变任何引用的生命周期的长短
* 当指定了泛型生命周期, 函数可以接受带有任何生命周期的引用。
* 生命周期标注: 描述了多个引用生命周期相互的关系, 而不影响其生命周期

### 生命周期标注-语法
* 生命周期参数名:
    * 以撇号(')开头
    * 通常小写且非常短, 如: 'a

* 生命周期标注的位置:
    * 在引用的 & 之后
    * 使用空格将标注和引用类型分开

### 生命周期标注-例子
* &i32        // 引用
* &'a i32     // 带有显式生命周期的引用
* &'a mut i32 // 带有显式生命周期的可变引用

* 单个生命周期标注没有意义

### 函数签名中的生命周期标注
* 泛型生命周期参数声明在: 函数名和参数列表之间的尖括号`<>`中
    * `fn longest<'a> (x: &'a str, y: &'a str) -> &'a str  {`
    * 当我们把具体的引用传入longest 函数时, 被用来替代'a 的具体生命周期是 x 的作用域与 y 的作用域相重叠的那一部分。而且返回值的生命周期也是 `` `a ``。
    
## 深入了解生命周期
* 指定生命周期参数的方式依赖于函数所作的事情
* 从函数返回引用时，返回类型的生命周期参数需要与一个参数的生命周期参数相匹配
* 如果返回的引用 没有 指向任何一个参数, 那么唯一的可能就是它指向一个函数内部创建的值。
    * 这就是悬垂引用的情况: 该值在函数结束时走出了作用域
```rust
fn longest<'a> (x: &'a str, y: &'a str) -> &'a str  {
    let result = String::from("really long string");
    result.as_str();             
}
```
报错: `` `result` does not live long enough ``
* 修正: 返回 String 而不是 &str
```rust
fn longest<'a> (x: &'a str, y: &'a str) ->String{
    let result = String::from("really long string");
    result            
}
```
这样就相当于把所有权转移给了调用者。



## Struct 中的生命周期
* Struct 里可以包括:
    * 自持有的类型
    * 引用: 需要在每个引用上添加生命周期标注
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.')
        .next()
        .expect("Could not find a '.'");

    let i = ImportantExcerpt {
         part: first_sentence 
        };
    println!("{}", i.part);

}

```


## 生命周期的省略
* 我们知道:
    * 每一个引用都有其生命周期
    * 需要为函数中的每一个引用都标注生命周期
* 在 Rust 引用分析中所编入的模式被称为 生命周期省略规则(lifetime elision rules)
    * 这些规则无需在大部分情况下手动标注生命周期
* 生命周期省略规则并不提供完整的推断:
    * 如果应用规则后, 引用的生命周期仍然模糊不清 -> 编译器报错
    * 解决办法: 显式标注生命周期

## 输入输出生命周期
* 生命周期在:
    * 函数/方法的参数: 输入生命周期
    * 函数/方法的返回值: 输出生命周期

### 生命周期省略的三个规则
* 编译器使用三个规则在没有显式标注生命周期的情况下， 来确定引用的生命周期：
    * 第一条规则适用于输入生命周期，后两条规则适用于输出生命周期。
    * 如果编译器检查完这三条规则后仍然存在没有计算出生命周期的引用，编译器将会停止并生成错误。
    * 这些规则适用于 fn 定义，以及 impl 块。

* 规则1: 每一个是引用的参数都有它自己的生命周期参数
* 规则2: 如果只有一个输入生命周期参数，那么该生命周期参数被赋予所有输出生命周期参数
* 规则3: 如果方法有多个输入生命周期参数并且其中一个参数是 &self 或 &mut self，说明是个对象的方法(method), 那么所有输出生命周期参数被赋予 self 的生命周期

## 生命周期省略的三个规则-例子
* 假设我们是编译器
* `fn first_word(s: &str) -> &str {`
* `fn first_word<'a>(s: &'a str) -> &str {`
* `fn first_word<'a>(s: &'a str) -> &'a str {`  
这里编译器可以成功推断出生命周期,因为只有一个输入生命周期参数,所以规则2适用,输出生命周期参数被赋予输入生命周期参数


* `fn longest(x: &str, y: &str) -> &str {`
* `fn longest<'a,'b>(x: &'a str, y: &'b str) -> &str {`   
两个参数都有自己的生命周期,第二条规则不适用,没有`&self`参数,第三条规则不适用。无法计算出返回值的生命周期, 编译器报错。


## 方法定义中的生命周期标注
* 在struct 上使用生命周期实现方法,语法和泛型参数的语法一样
* 在哪声明和使用生命周期参数, 依赖于:
    * 生命周期参数是否和字段,方法的参数或返回值有关

* struct 字段的生命周期名:
    * 在`impl`后声明
    * 在`struct`名后使用
    * 这些生命周期是struct类型的一部分

* `impl` 块内的方法签名中：
    * 引用必须绑定于struct字段引用的生命周期, 或者引用是独立的也可以
    * 生命周期省略规则经常使得方法中的生命周期标注不是必须的

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl <'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    //  根据第三个规则, 这里的返回值的生命周期被赋予了self的生命周期
    // announcement 和返回值的生命周期都可以省略
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.')
        .next()
        .expect("Could not find a '.'");

    let i = ImportantExcerpt {
         part: first_sentence 
        };
    println!("{}", i.part);

}

```

## 静态生命周期
* `'static` 是一个特殊的生命周期, 代表整个程序的运行时间
* 所有的字符串字面值都拥有 ` 'static` 生命周期
    * `let s: &'static str = "I have a static lifetime.";`

* 为引用指定`'static` 生命周期前要三思:
    * 是否需要引用在程序整个生命周期内都存活。


## 泛型类型参数, trait bound 和生命周期
```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(
    x: &'a str, y: &'a str, ann: T,) -> &'a str
    where T: Display
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("abcd");
    let string2 = String::from("xyz");
    let result = longest_with_an_announcement(
        string1.as_str(), string2.as_str(), "Today is someone's birthday!");
    println!("The longest string is {}", result);
}
```