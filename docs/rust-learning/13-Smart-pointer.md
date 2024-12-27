---
title: 13. 智能指针
sidebar_position: 13
authors: zhihe
tags: [rust]
---

# 智能指针
* 指针: 一个变量在内存中包含的是一个地址(指向其他数据)
* Rust 中最常见的指针就是"引用"
* 引用
    * 使用 `&`
    * 借用它指向的值
    * 没有其它开销
    * 最常见的指针类型

## 智能指针
* 智能指针是这样一些数据结构:
    * 行为和指针相似
    * 有额外的元数据和功能

### 引用计数(Reference Counting) 智能指针类型
* 通过记录所有者的数量, 使一份数据被多个所有者同时持有
* 并在没有任何所有者时自动清理数据

### 引用和智能指针的其他不同
* 引用:         只借用数据
* 智能指针:     很多时候都拥有它所指向的数据

### 智能指针的例子
* `String` 和 `Vec<T>`
* 都拥有一片内存区域, 且允许用户对其操作
* 还拥有元数据(例如容量等)
* 提供额外的功能或保障(String 保障其数据是合法的 UTF-8 编码)

### 智能指针的实现
* 智能指针通常使用struct实现, 并且实现了: 
    * `Deref` 和 `Drop` trait
* Deref trait: 允许智能指针struct 实例像引用一样被使用
* Drop trait: 允许我们自定义当智能指针实例离开作用域时运行的代码

## 本章内容
* 介绍标准库中常见的智能指针
    * `Box<T>`: 在heap内存上分配值
    * `Rc<T>`: 启用多重所有权的引用计数类型
    * `Ref<T>` 和 `RefMut<T>`: 通过 `RefCell<T>` 访问: 在运行时而不是在编译时强制借用规则的类型

* 此外:
    * 内部可变模式(Interior mutability pattern): 不可变类型暴露出可修改其内部值的API
    * 引用循环(Reference cycles): 它们如何泄漏内存, 以及如何防止其发生

## 使用 `Box<T>` 来指向heap上的数据
### `Box<T>`
* `Box<T>` 是最简单的智能指针: 
    * 允许你在heap上存储数据(而不是stack)
    * stack 上是指向heap上数据的指针
    * 没有性能开销
    * 没有其它额外功能

    * 实现了 `Deref` trait 和 `Drop` trait

### `Box<T>` 的常用场景
* 在编译时, 其类型的大小无法确定。但使用该类型时, 上下文却需要知道它确切大小
* 当你有大量数据, 想移交所有权, 但需要确保在操作时数据不会被复制
* 使用某个值时, 你只关心它是否实现了特定的trait, 而不关心它的具体类型

### `Box<T>` 在heap上存储数据
```rust
fn main() {
    let b = Box::new(5);
    println!("b = {}",b);
}

```
当离开作用域后,存在stack上的指针和heap上的数据都会被清理  

### 使用Box赋能递归类型
* 在编译时, Rust 需要知道一个类型所占的空间大小
* 而递归类型的大小无法在编译的时候被确定  

<img src={require('./images/image-1.png').default} alt="Recursing" width="300" />  

* Rust 无法确定一个递归类型的大小
* 但是Box 类型的大小确定
* 在递归类型中使用Box, 就可以解决上述问题
* 函数式语言中的Cons List

### 关于Cons List
* Cons List 是来自Lisp语言的一种数据结构
* Cons List 里的每个成员由两个元素组成
    * 当前项的值
    * 下一个元素

* Cons List 里的最后一个元素只包含一个Nil 值, 没有下一个元素
    * Nil 表示终止标记
    * Null 表示无效或者缺失的值

### Cons List 并不是Rust的常用集合
* Rust 中的`Vec<T>` 是更常用的集合类型
* 构建一个Cons List
```rust
use crate::List::{Cons, Nil};

fn main() {
    let list = Cons(1, Cons(2, Cons(3, Nil)));

}
enum List{
    Cons (i32, List),
    Nil,
}
```
报错: `` recursive type `List` has infinite size``




* Rust 无法计算出存储一个List 所需的空间大小
* 不是直接存储数据, 而是存储指向数据的指针, 例如 `Box<T>`


### 使用`Box<T>` 来获得确定大小的递归类型
* `Box<T>` 是一个指针, Rust 知道它需要多少空间, 因为:
    * 存储的是一个地址, 指针的大小不会基于它所指向的数据的大小而改变

<img src={require('./images/image-2.png').default} alt="Box<T>" width="250" />  

* `Box<T>`:
    * 只提供了"间接"存储和heap内存分配的功能
    * 没有其它额外功能
    * 没有性能开销
    * 适用于需要"间接"存储的场景, 例如Cons List
    * 实现了 `Deref` trait 和 `Drop` trait  


```rust
use crate::List::{Cons, Nil};

fn main() {
    let list = Cons(1,
        Box::new(Cons(2, 
            Box:: new(Cons(3,
                Box:: new(Nil))))));
}

enum List{
    Cons (i32, Box<List>),
    Nil,
}
```

## Deref Trait
* 实现了 `Deref` trait 使我们可以自定义解引用运算符 `*`的行为
* 通过实现 `Deref`, 智能指针可像常规引用一样来处理

### 解引用运算符
* 常规引用是一种指针
```rust
fn main() {
    let x = 5;
    let y = &x;

    assert_eq!(5,x);
    assert_eq!(5,*y);
}
```
这里的y就相当于是一个指针, `*y` 就是取y这个指针指向的值  
如果去掉`*` 我们: ` assert_eq!(5,*y);` 就会报错`` no implementation for `{integer} == &{integer}` ``  

### 把`Box<T>`  当作引用
* `Box<T>` 可以代替上例中的引用
```rust

fn main() {
    let x = 5;
    let y = Box::new(x);

    assert_eq!(5,x);
    assert_eq!(5,*y);
}

```

### 定义自己的智能指针
* `Box<T>` 被定义成拥有一个元素的tuple struct
* (例子) `MyBox<T>`
```rust
struct MyBox<T>(T);

impl<T> MyBox<T>{
    fn new(x:T) -> MyBox<T>{
        MyBox(x)
    }
}

fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5,x);
    assert_eq!(5,*y);
}
```
但是这里会报错因为没有实现 `Deref` trait  

### 实现 `Deref` trait 
* 标准库中的 `Deref` trait 要求我们实现一个 `deref` 方法
    * 该方法借用 `self` 
    * 返回一个指向内部数据的引用
```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T>{
    fn new(x:T) -> MyBox<T>{
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T>{
    type Target = T;

    fn deref(&self) ->&T{
        &self.0
    }
}


fn main() {
    let x = 5;
    let y = MyBox::new(x);

    assert_eq!(5,x);
    assert_eq!(5,*y);
}

```
### 函数方法的隐式解引用转化(Deref coercion)
* 隐式解引用转化(Deref coercion) 是为函数和方法提供的一种便捷特性
* 假设T实现了 `Deref` trait:
    * Deref Coercion  可以把T的引用转化为T经过Deref操作后生成的引用

* 当把某类型的引用传递给函数或者方法时, 但它的类型与定义的参数类型不匹配: 
    * Deref Coercion 就会自动发生
    * 编译器会对deref进行一系列调用, 来把它转化为所需的参数类型
        * 在编译时完成, 没有额外的性能开销
```rust
use std::ops::Deref;

fn hello(name : &str){
    println!("hello,{}", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    // &m & MyBox<String>
    // deref &String
    // deref &str
    hello(&m);
    // equals to 
    hello(&(*m)[..]);
    
}


struct MyBox<T>(T);

impl<T> MyBox<T>{
    fn new(x:T) -> MyBox<T>{
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T>{
    type Target = T;

    fn deref(&self) ->&T{
        &self.0
    }
}

```

### 解引用与可变性
* 可使用`DerefMut` trait 来重载可变引用的*运算符
    * 当`T: Deref<Target=U>` 允许&T转换为&U
    * 当`T: DerefMut<Target=U>` 允许&mut T转换为&mut U
    * 当`T: Deref<Target=U>` 允许&mut T转换为&U


## `Drop` trait
* 实现了 `Drop` trait 可以让我们自定义当一个值离开作用域时发生的动作
    * 例如: 文件, 网络资源释放等
    * 任何类型都可以实现 `Drop` trait

* `Drop` trait 只要求你实现 `drop` 方法
    * 参数: 对self的可变引用

* `Drop` trait 在预导入模块里(Prelude)

```rust
struct CustomSmartPointer{
    data: String,
}

impl Drop for CustomSmartPointer{
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data`{}`!",self.data);
    }
}

fn main(){
    let c = CustomSmartPointer{data:String::from("my stuff")};
    let d = CustomSmartPointer{data:String::from("other stuff")};
    println!("CustomSmartPointer created")
}
```

### 使用std::mem::drop 来提前drop值
* 很难直接禁用自动的drop功能, 也没必要
    * Drop trait 的目的主要是进行自动地释放处理逻辑
* Rust 不允许手动调用Drop trait 的drop方法
* 但是可以调用标准库的 `std::mem::drop` 函数来提前释放值
```rust
fn main(){
    let c = CustomSmartPointer{data:String::from("my stuff")};
    drop(c);
    let d = CustomSmartPointer{data:String::from("other stuff")};
    println!("CustomSmartPointer created")
}
```

## `Rc<T>` 引用计数智能指针
* 有时, 一个值会有多个所有者

<img src={require('./images/image-3.png').default} alt="multi-owner" width="250"/>


* 为了支持多重所有权: `Rc<T>` 
    * reference counting (引用计数)
    * 可以追踪所有到值的引用
    * 0个引用, 该值可以被清理

### `Rc<T>` 的使用场景
* 需要在heap上分配数据, 这些数据被程序的多个部分读取(只读), 但在编译时无法确定哪个部分最后使用完这些数据
* `Rc<T>` 只能用于单线程场景

### `Rc<T>` 的例子
* `Rc<T>` 不在预导入模块(preludez) 中
* Rc::clone(&a)函数: 会增加引用计数
* Rc::strong_count(&a)函数: 获得强引用计数
    * Rc::weak_count(&a)函数: 获得弱引用计数

* 两个List共享另一个List的所有权

<img src={require('./images/image-4.png').default} alt="multi-owner" width="250"/>

```rust
enum List{
    Cons(i32, Rc<List>),
    Nil
}

use crate::List::{Cons, Nil};
use std::rc::Rc;

fn main(){
    let a = Rc::new(Cons(5,Rc::new(Cons(10,Rc::new(Nil)))));
    
    let b = Cons(3, Rc::clone(&a));
    let c = Cons(4, Rc::clone(&a));
}
```
### Rc::clone vs clone() 方法
* Rc::clone(): 增加引用, 不会执行数据的深拷贝操作
* 类型的clone() 方法: 很多会执行数据的深拷贝操作

### `Rc<T>`
* `Rc<T>` 通过不可变引用, 使你可以在程序的不同部分之间共享只读数据

## `RefCell<T>` 和内部可变性(Interior mutability)
* 内部可变性是Rust的设计模式之一
* 它允许你在只持有不可变引用的情况下对数据进行修改
    * 数据结构中使用了unsafe代码来绕过Rust正常的可变性和借用规则

### `RefCell<T>` 
* 与 `Rc<T>` 不同, `RefCell<T>` 类型代表了其持有数据的唯一所有权

#### 复习借用规则：
* 在任何给定的时间里, 你要么只能拥有一个可变引用, 要么只能任意数量的不可变引用  
* 引用总司有效的

### `RefCell<T>` 与`Box<T>` 的区别
* `Box<T>`
    * 编译阶段强制代码遵守借用规则
    * 否则出现错误
* `RefCell<T>`
    * 只会在运行时检查借用规则
    * 否则触发panic

### 借用规则在不同阶段检查的比较
* 编译阶段:
    * 尽早暴露问题
    * 没有任何运行时开销
    * 对大多数场景是最佳选择
    * 是Rust的默认行为

* 运行时:
    * 问题暴露延后, 甚至到生产环境
    * 因借用计数产生些许性能损失
    * 实现某些特定的内存安全场景(不可变环境中修改自身数据)

### `RefCell<T>` 
* 与 `Rc<T>` 类似, 只能用于单线程场景

### 选择 `Box<T>` `Rc<T>` `RefCell<T>`的依据

<img src={require('./images/image-5.png').default} alt="comparison" width="500"/>

### 内部可变性: 可变的借用一个不可变的值
```rust
pub trait Messenger{
    fn send(&self, msg: &str);
}

pub struct LimitTracker<'a, T: 'a + Messenger>{
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl <'a, T> LimitTracker<'a, T>
where
    T: Messenger,
{
    pub fn new (messenger: &T, max: usize) -> LimitTracker<T>{
        LimitTracker {
            messenger,
            value: 0,
            max,
        }
    }

    pub fn set_value(&mut self, value: usize){
        self.value = value;

        let percentage_of_max = self.value as f64 / self.max as f64;
        if percentage_of_max >= 1.0{
            self.messenger.send("Error: you are over your quota!");
        } else if percentage_of_max >= 0.9{
            self.messenger
                .send("Uegent warning: you've used up over 90% of your quota!");
        } else if percentage_of_max >= 0.75{
            self.messenger
                .send("Warning: You've used up over 75% of your quota!");
        }
    }
}

#[cfg(test)]
mod tests{
    use super::*;
    use std::cell::RefCell;
    struct MockMessenger {
        sent_messages: RefCell<Vec<String>>,
    }
    impl MockMessenger{
        fn new() -> MockMessenger{
            MockMessenger{
                sent_messages: RefCell::new(vec![]),
            }
        }
    }
    impl Messenger for MockMessenger{
        fn send(&self, message: &str){
            self.sent_messages.borrow_mut().push(String::from(message));
        }
    }
    #[test]
    fn it_sends_an_over_75_percent_warning_message(){
        let mock_messenger = MockMessenger::new();
        let mut limit_tracker = LimitTracker::new(&mock_messenger, 100);

        limit_tracker.set_value(80);
        assert_eq!(mock_messenger.sent_messages.borrow().len(),1);
    }
}
```
### 使用`RefCell<T>` 在运行时记录借用信息
* 两个方法(安全接口):
    * borrow方法: 
        * 返回智能指针`Ref<T>`, 它实现了`Deref` trait
    * borrow_mut方法: 
        * 返回智能指针`RefMut<T>`, 它实现了`Deref` trait

* `RefCell<T>` 会记录当前存在多少个活跃的`Ref<T>` 和 `RefMut<T>` 智能指针
    * 每次调用borrow: 不可变借用计数加一
    * 任何一个`Ref<T>`的值离开作用域被释放时, 不可变借用计数减一
    * 每次调用borrow_mut: 可变借用计数加一
    * 任何一个`RefMut<T>`的值离开作用域被释放时, 可变借用计数减一

* Rust以此技术来维护借用检查规则:
    * 任何一个给定时间里, 只允许拥有有多个不可变借用或一个可变借用


### 使用 `Rc<T>` 和 `RefCell<T>` 来实现一个拥有多重所有权的可变数据
```rust
#[derive(Debug)]
enum List{
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil
}

use crate::List::{Cons, Nil};
use std::{rc::Rc, cell::RefCell};

fn main(){
    let value = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let b = Cons(Rc::new(RefCell::new(6)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(10)), Rc::clone(&a));

    *value.borrow_mut() += 10;

    println!("a after = {:?}",a);
    println!("b after = {:?}",b);
    println!("c after = {:?}",c);

}
```

### 其它可实现内部可变性的类型
* `Cell<T>`: 通过复制来访问数据
* `Mutex<T>`: 用于实现跨线程情形下的内部可变性模式
