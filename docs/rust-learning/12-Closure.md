---
title: 12. 闭包
sidebar_position: 12
authors: zhihe
tags: [rust]
---

# 闭包(closure)
*  闭包: 可以捕获所在环境的匿名函数
* 闭包: 
    * 是匿名函数
    * 保存为变量, 作为参数
    * 可在一个地方创建闭包, 然后在另外一个上下文调用闭包来完成运算
    * 可从其定义的作用域捕获

## 生成自定义运动计划的程序
* 算法的逻辑并不是重点, 重点是算法的计算过程需要几秒钟时间
* 目标: 不让用户发生不必要等待
    * 仅在必要时调用该算法
    * 只调用一次

## 闭包的类型推断
* 闭包不要求标注参数和返回值类型
* 闭包通常很短小, 只在狭小的上下文中工作, 编译器通常能推断出类型
* 可以手动添加类型标注

## 函数和闭包的定义语法
`fn add_one_v1(x: u32) -> u32 { x + 1 }`
`let add_one_v2 = |x: u32| -> u32 { x + 1 };`
`let add_one_v3 = |x|   { x + 1 };`
`let add_one_v4 = |x|     x + 1 ;`

```rust
let example_closure = |x| x;
let s = example_closure(String::from("hello"));
```
* 注意: 闭包的定义最终只会为参数/返回值推断出唯一具体的类型

## 运动程序的另一种解决方案
* 创建一个struct, 它持有闭包及其调用结果
* 闭包只会被调用一次

### 如何让struct 持有闭包
* struct 的定义需要知道所有字段的类型
    * 需要指明闭包的类型

* 每个闭包实例都有自己唯一的匿名类型, 即使两个闭包签名完全一样。
* 所以需要用: 泛型和Trait Bound (第十章)

## Fn Trait
* Fn traits 由标准库提供
* 所有的闭包都至少实现了以下trait之一
    * Fn
    * FnMut
    * FnOnce  

例子, 利用缓存器 Cacher：
```rust
use std::thread;
use std::time::Duration;

struct Cacher<T>
    where T: Fn(u32) -> u32
{
    calculation: T,
    value: Option<u32>,
}

impl <T> Cacher<T>
    where T: Fn(u32) -> u32
{
    fn new(calculation: T) -> Cacher<T>{
        Cacher {
            calculation,
            value: None,
        }
    }
    fn value(&mut self, arg: u32) -> u32{
        match self.value {
            Some(v) => v,
            None => {
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            }
        }
    }
}

fn main() {
    let simulated_user_specified_value = 10;
    let simulated_random_number = 7;
    generate_workout(
        simulated_user_specified_value,
        simulated_random_number
    );
}


fn generate_workout(intensity: u32, random_number: u32) {
    let mut expensive_closure = Cacher::new(|num| {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    });
    if intensity < 25{
        println!("Today, do {} pushups!", expensive_closure.value(intensity));
        println!("Next, do {} situps!", expensive_closure.value(intensity));
    }
    else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        }
        else {
            println!(
                "Today, run for {} minutes!",
                expensive_closure.value(intensity)
            );
        }
    }
}

```


```rust
#[cfg(test)]
mod tests {

    #[test]
    fn call_with_different_values(){
        let mut c = super::Cacher::new(|a| a);
        let v1 = c.value(1);
        let v2 = c.value(2);
        assert_eq!(v2, 2);
    }
}
```
`test result: FAILED`

### 使用缓存器Cacher的限制
* Cacher实例假定针对不同参数arg, value 方法总会得到相同的值
* 可以用HashMap 代替单个值
    * key: arg 参数
    * value: 闭包调用的结果

* 只能接受一个`u32`类型的参数和`u32`类型的返回值
    * 可以用泛型和trait bound 来改进


## 闭包可以捕获其环境
* 闭包可以访问它的作用域内的变量, 而普通参数不行
```rust
fn main() {
    let x = 4;

    // let equal_to_x = |z| z == x;
    fn equal_to_x(z: i32) -> bool { z == x }
    
    let y = 4;

    assert!(equal_to_x(y));
}
```
这边会报错: `can't capture dynamic environment in a fn item`
在Rust中，普通函数不能捕获外部作用域中的变量。这与闭包(closures)的行为不同，闭包可以捕获它们所在作用域中的变量。   
* 捕获环境会产生内存开销  

## 闭包从所在环境捕获值的方式
* 与函数获得参数的三种方式一样:
    1. 获得所有权: `FnOnce` 闭包不能多次获取并消耗同一个变量(只能调用一次)
    2. 可变借用: `FnMut` 闭包可以多次获取可变借用
    3. 不可变借用: `Fn` 闭包可以多次获取不可变借用

* 创建闭包时, 通过闭包对环境值的使用, Rust 推断出具体使用哪个trait:
    * 所有闭包都实现了`FnOnce`
    * 没有移动捕获变量的实现了`FnMut`
    * 无需可访问捕获变量的闭包也实现了`Fn`  

## move 关键字
* 在参数列表前使用move关键字, 可以强制闭包取得它所使用的环境值的所有权
    * 当将闭包传递给新线程以移动数据使其归新线程所有时, 此技术最为有用
```rust
fn main() {
    let x  = vec![1,2,3];
    let equal_to_x = move |z| z == x;

    println!("can't use x here: {:?}", x);
    let y = vec![1,2,3];
    
    assert!(equal_to_x(y));
}
```
这里捕获的x的所有权就被移动到了闭包中, 所以x在闭包外就不能再使用了  
报错: `value borrowed here after move`  

## 最佳实践
* 当指定Fn trait bound之一时, 首先使用Fn, 基于闭包体里的情况, 如果需要FnOnce 或 FnMut, 编译器会再告诉你。

# 迭代器

## 什么是迭代器
* 迭代器模式: 对一系列项执行某些任务
* 迭代器负责:
    * 遍历每一个项
    * 确定序列(遍历)何时完成

* Rust 的迭代器:
    * 惰性的: 除非调用消费迭代器的方法, 否则迭代器本身不会有任何效果

## Iterator trait 和 next 方法

### Iterator trait
* 所有迭代器都实现了Iterator trait
* Iterator trait 定义于标准库, 定义大致如下:
```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // 此处省略了方法的默认实现
}
```
* `type Item` 和 `Self::Item` 定义了与该trait关联的类型
    * 实现Iterator trait 需要你定义一个Item 类型, 它用于next 方法的返回类型 (迭代器的返回类型)。

### Itertor trait
* Iterator trait 仅要求实现一个方法: next
* next:
    * 每次返回迭代器中的一项
    * 返回的结果返回在Some里
    * 迭代结束时返回None
* 可直接在迭代器上调用next 方法
```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_demonstration() {
        let v1 = vec![1, 2, 3];

        let mut v1_iter = v1.iter();

        assert_eq!(v1_iter.next(), Some(&1));
        assert_eq!(v1_iter.next(), Some(&2));
        assert_eq!(v1_iter.next(), Some(&3));
        assert_eq!(v1_iter.next(), None);
    }
}
```
### 几个迭代方法
* iter 方法: 在不可变引用上创建迭代器
* into_iter 方法: 创建的迭代器会获得所有权
* iter_mut 方法: 迭代可变引用

## 消耗/产生迭代器
### 消耗迭代器的方法
* 在标准库中, iterator trait 有一些带默认实现的方法
* 其中有一些方法会调用next 方法
    * 实现Iterator trait 时必须实现next方法的原因之一

* 调用next 方法叫做消耗迭代器(Consume the Iterator)
    * 因为调用它们会把迭代器耗尽

* 例如: sum 方法(就会耗尽迭代器)    
```rust
#[cfg(test)]
mod tests {
    #[test]fn iterator_sum() {
        let v1 = vec![1, 2, 3];

        let v1_iter = v1.iter();

        let total: i32 = v1_iter.sum();

        assert_eq!(total, 6);
    }
}

```
### 产生其它迭代器的方法
* 定义在Iterator trait 的另外一些方法叫做"迭代器适配器"
    * 把迭代器变成不同类型的迭代器
* 可以通过链式调用使用多个迭代器适配器来执行复杂的操作, 这种调用可读性较高。
* 例如: map
    * 接受一个闭包, 闭包作用于每个元素
    * 产生一个新的迭代器
```rust
#[cfg(test)]
mod tests {
    #[test]
    fn iterator_sum(){
        let v1 = vec![1, 2, 3];

        let v2:Vec<_> = v1.iter().map(|x| x + 1).collect();

        assert!(v2 == vec![2, 3, 4])
    }
}
```

## 使用闭包捕获环境 + 迭代器
* filter 方法:
    * 接受一个闭包
    * 这个闭包在遍历迭代器的每个元素的时候, 返回bool类型
    * 如果闭包返回true, 则当前元素包含在filter产生的新迭代器中
    * 如果闭包返回false, 则当前元素不包含在filter产生的新迭代器中
```rust
#[derive(PartialEq, Debug)]
struct Shoe{
    size: u32,
    style: String,
}

fn shoes_in_my_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe>{
    shoes.into_iter().filter(|s| s.size == shoe_size).collect()
}

#[test]
fn filters_by_size(){
    let shoes = vec![
        Shoe{size: 10, style: String::from("sneaker")},
        Shoe{size: 13, style: String::from("sandal")},
        Shoe{size: 10, style: String::from("boot")},
    ];

    let in_my_size = shoes_in_my_size(shoes, 10);

    assert_eq!(
        in_my_size,
        vec![
            Shoe{size: 10, style: String::from("sneaker")},
            Shoe{size: 10, style: String::from("boot")},
        ]
    );
}
```
## 创建自定义的迭代器
### 使用Iterator trait 创建自定义迭代器
* 实现next 方法
```rust
struct Counter{
    count: u32,
}

impl Counter{
    fn new() -> Counter{
        Counter{count: 0}
    }
}

impl Iterator for Counter{
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item>{
        if self.count < 5{
            self.count += 1;
            Some(self.count)
        }else{
            None
        }
    }
}

#[test]
fn calling_next_directly(){
    let mut counter = Counter::new();

    assert_eq!(counter.next(), Some(1));
    assert_eq!(counter.next(), Some(2));
    assert_eq!(counter.next(), Some(3));
    assert_eq!(counter.next(), Some(4));
    assert_eq!(counter.next(), Some(5));
    assert_eq!(counter.next(), None);
}

#[test]
fn using_other_iterator_trait_methods(){
    let sum: u32 = Counter::new()
        .zip(Counter::new().skip(1))
        .map(|(a,b)| a*b)
        .filter(|x| x%3 == 0)
        .sum();
    assert_eq!(18, sum);
}
```
## 性能比较: 循环 vs 迭代器
* 迭代器的性能不会比手写的循环差
### 零开销抽象 Zero-Cost Abstractions
* 使用抽象的时候不会引入额外运行时开销