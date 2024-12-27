---
title: 8. 泛型， Trait
sidebar_position: 8
authors: zhihe
tags: [rust]
---
# 泛型， Trait
## 提取函数消除重复
```rust
fn largest(list: &[i32]) -> i32 {
    let mut largest = list[0];
    for &number in list {
        if number > largest {
            largest = number;
        }
    }
    largest
}
fn main() {
    let num_list = vec![34, 50, 25, 100, 65];
    let result = largest(&num_list);

    println!("The largest number is {}", result);
}
```
当你写 `for number in list` 时，`number` 实际上是每个元素的引用，因为 `list`是一个切片引用。在这种情况下，`number` 的类型是 `&i32`。  
当你写 `for &number in list` 时，你实际上是在使用模式匹配来解引用每个元素，使得 `number` 直接获得了元素的值，而不是它们的引用。在这种情况下，`number` 的类型是  `i32`。  
`&i32` = &`i32`

* 泛型: 提高代码的复用能力
    * 处理重复代码的问题
* 泛型是具体类型或其他属性的抽象代替:
    * 你编写的代码不是最终代码, 而是一个模板, 里面有一些"占位符"
    * 编译器在编译的时将占位符替代为具体的类型。
* 例如: `fn largest<T>(list: &[T]) -> T {}`
    * T 是一个占位符, 代表任何类型
* 该函数可以接受任何类型的 slice, 并返回同样类型的值
* 类型参数: 
    * 很短, 通常一个字母
    * CamalCase
    * T: Type的缩写

## 函数定义中使用泛型
* 泛型函数
    * 参数类型
* 返回值类型  
会在后面详细解释
## Struct中定义中使用泛型
```rust
struct Point<T, U> {
    x: T,
    y: U,
}
fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1, y: 4.0 };
    println!("integer.x = {}, integer.y = {}", integer.x, integer.y);
    println!("float.x = {}, float.y = {}", float.x, float.y);
}
```
T 和 U 代表了Point里x和y可以是不同的类型

## 枚举定义中使用泛型
* 可以让枚举的变体持有泛型数据类型
    * 例如 `Option<T>`,`Result<T, E>`
```rust
enum Option<T> {
    Some(T),
    None,
}
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
## 方法定义中使用泛型
* 为struct和enum定义方法的时候, 可以在定义中使用泛型
```rust
struct Point<T> {
    x: T,
    y: T,
}
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
```
* 注意:
    * 把 T 放在impl关键字后, 表示在类型T上实现的方法
        * 例如: `impl<T> Point<T> {}`
    * 只针对具体类型实现方法(其余类型没实现方法):
        * 例如: `impl Point<f32> {}` (这里impl后没有`<T>`)

## 泛型代码的性能
* 使用泛型的代码和使用具体类型的代码运行速度是一样的
* Rust通过在编译时进行泛型代码的单态化(monomorphization)来保证效率
    * 单态化: 将泛型代码转换为特定代码的过程

# Trait
* Trait 告诉Rust 编译器:
    * 某些类型具有哪些并且可以与其它类型共享的功能
* 可以通过 trait 以一种抽象的方式定义共享的行为
* Trait bounds(约束): 泛型类型参数指定为是实现了特定行为的类型

## 定义一个Trait
* Trait 的定义: 把方法签名放在一起, 来定义实现某种目的的所必需的一组行为
    * 关键词: trait
    * 只有方法签名, 没有具体实现
    * trait 可以有多个方法: 每个方法签名占一行,以; 结尾
    * 实现该trait的类型必须提供具体的方法实现
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}
```
## 在类型上实现trait
* 与为类型实现方法类似
* syntax： `impl Trait for Type {}`
* 在impl 的块内, 需要对trait方法签名提供具体的实现  

lib.rs:
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline,self.author,self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet:bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```
main.rs:
```rust
use _generics::Summary;
use _generics::Tweet;

fn main() {
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply:false,
        retweet:false,
    };
    println!("1 new tweet: {}", tweet.summarize());
} 
```
会输出: `1 new tweet: horse_ebooks: of course, as you probably already know, people`

## 实现Trait的约束
* 可以在某个类型上实现某个trait的前提条件是:
    * 这个类型或这个trait是在本地的crate里定义的
* 无法为外部类型来实现外部的trait
    * 例如: 无法为`Vec<T>`实现`Display trait`
        * 因为`Vec<T>`和`Display trait`都是在标准库中定义的
    * 这个限制是程序属性的一部分(也就是一致性)
    * 具体说是孤儿规则(orphan rule): 之所以这样命名是因为父类型不存在
    * 此规则确保其他人的代码不会破坏你的代码, 反之亦然
    * 如果没有这个规则, 两个crate可以分别对相同类型实现相同的trait, 且Rust不知道该使用哪个实现

## 默认实现
默认实现的方法可以调用同一个trait中的其他方法


## trait作为参数
* 语法: `impl Trait`
```rust
pub fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```
* Trait bound 语法: `Trait + Trait` 课用于更复杂的情况
```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```
* 语法糖: `impl Trait` 等价于 `impl<T> Trait for T {}`
* 使用+指定多个trait bound
* trait bound 使用where子句
    * 在方法签名后指定where子句
```rust
pub fn notify<T: Summary + Display, U: Clone + Debug>(a: T, b: U)-> String {
    format!("Breaking news! {}", a.summarize())
}
```
等用于:
```rust
pub fn notify2<T, U>(a: T, b: U)-> String 
where T: Summary + Display,
        U: Clone + Debug,
{
    format!("Breaking news! {}", a.summarize())

}
```
## 实现Trait作为返回类型
* 语法: `-> impl Trait`
```rust
pub fn notify3(s: &str) -> impl Summary{
    NewsArticle{
        headline: String::from("Rust is the best language"),
        content: String::from(format!("{}", s)),
        author: String::from("The Rust Team"),
        location: String::from("Everywhere"),
    }
}
```
* 限制: 一个函数只能返回一个具体类型
    * 不能返回`NewsArticle`和`Tweet`

## 使用trait bound 的例子
修复以下代码：
```rust
fn largest<T>(list: &[T]) -> T{
    let mut largest = list[0];
    for &item in list.iter(){
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];
    let result = largest(&number_list);
    println!("The largest number is {}", result);
}
```
* 问题: 无法编译
    * 因为`>`不能用于所有类型
* 解决: 使用trait bound
    * T必须实现`PartialOrd` trait
    * T必须实现`Copy` trait
```rust
fn largest<T>(list: &[T]) -> T
where T: PartialOrd + Copy
{
    let mut largest = list[0];
    for &item in list.iter(){
        if item > largest { // std::cmp::PartialOrd
            largest = item;
        }
    }
    largest
}
```
## 使用trait bound 有条件的实现方法
* 在使用泛型类型参数的impl块上使用trait bound, 我们可以有条件的只为那些实现了特定trait的类型实现方法
```rust
struct Pair<T> {
    x: T,
    y: T,
}

impl <T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self {x, y}
    }
}

impl <T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x)
        } else {
            println!("The largest member is y = {}", self.y)
        }
    }
}
```


