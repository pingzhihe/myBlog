---
title: 14. 无畏并发
sidebar_position: 14
authors: zhihe
tags: [rust]
---

## 并发
* Concurrent: 程序的不同部分之间独立的执行
* Parallel: 程序的不同部分之间同时执行

* Rust 无畏并发: 允许你编写没有细微Bug的代码, 并在不引入新bug的情况下易于重构

* 注意: 本章的内容泛指concurrent和parallel

## 使用线程来同时运行代码
### 进程与线程
* 在大部分OS里, 代码运行在进程(process)中, OS 同时管理多个进程
* 在你的程序里, 各部分可以分别同时运行, 运行这些独立部分的就是线程(thread)

* 多线程运行: 
    * 提升性能表现
    * 增加复杂性, 无法保障各线程的执行顺序

### 多线程可导致的问题
* 竞争状态, 线程以不一致的顺序访问数据或资源
* 死锁, 两个线程彼此等待对方使用完其所拥有的资源, 线程无法继续
* 只在某些情况下发生的bug, 很难可靠地复制现象和修复

### 实现线程的方式
* 通过调用OS的API来创建线程1:1模型
    * 需要比较小的运行时
* 语言自己实现的线程(绿色线程)M:N模型
    * 需要更大的运行时

* Rust: 需要权衡运行时的支持
* Rust 标准库仅提供1:1模型的线程    

### 通过spawn创建新线程
* 使用thread::spawn函数来创建新线程
    * 参数: 一个闭包(在新线程中运行的代码)
```rust
use std::thread;
use std::time::Duration;


fn main() {
    thread::spawn(||{
        for i in 1..10{
            println!("hi number {} from the spawned thread!",i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    for i in 1..5{
        println!("hi number {} from the main thread", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```
### 通过join Handle来等待所有线程完成
* thread::spawn 函数的返回值是 JoinHandle
* JoinHandle 持有值的所有权
    * 调用其join方法, 可以等待对应的其它线程的完成
* join方法: 调用handle 的join 方法会阻止当前运行的线程的执行,直到handle 所表示的这些线程的终结

### 使用move闭包
* move 闭包通常和thread::spawn一起使用, 它允许你使用其它线程的数据
* 在创建线程的时候, 把值的所有权从一个线程转移到另一个线程
```rust
use std::thread;
fn main() {
    let v = vec![1,2,3];
    let handle = thread::spawn(move ||  {
        println!("Here's a vector {:?}", v);
    });

    handle.join().unwrap();

}

```

## 使用消息传递来在线程间转移数据
### 消息传递
* 一种很流行且能保证安全并发的技术就说: 消息传递
    * 线程(或Actor)通过彼此发送消息(数据)来进行通信

* Go 语言的名言: 不要用共享内存来通信, 用通信来共享内存

* Rust: Channel (标准库提供)

### Channel 
* Channel 包含: 发送端,接收端
* 调用发送端的方法, 发送数据
* 接收端会检查和接收到达的数据
* 如果发送端, 接受端中任意一端被丢弃了, 那么Channel就关闭了
 
### 创建新的Channel
* 使用`mpsc::channel`函数创建一个新的channel
    * mpsc表示multiple producer, single consumer(多个生产者, 一个消费者)
    * 返回一个tuple(元组): 里面分别是发送端和接收端
```rust
use std::sync::mpsc;
use std::thread;

fn main(){
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
    let received = rx.recv().unwrap();

    println!("Got:{}", received);
    
}
```

### 接收端的方法
*   
    * 一旦有值收到, 就返回`Result<T, E>` 
    * 当发送端关闭时, 返回一个错误值

* try_recv 方法: 不会阻止线程, 直接返回一个`Result<T, E>`
    * Ok 值包含可用的信息
    * 否则, 返回一个错误值

* 通常会使用循环调用来检查try_recv的结果

### Channel 和所有权转移
* 所有权在消息传递中非常重要: 能帮你编写安全, 并发的代码
```rust
use std::sync::mpsc;
use std::thread;

fn main(){
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
        println!("val is {}", val);
    });
    let received = rx.recv().unwrap();

    println!("Got:{}", received);
    
}
```
println!("val is {}", val); 会报错: `value borrowed here after move`  


### 发送多个值, 看到接收者在等待
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main(){
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread")
        ];
        for val in vals{
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx{
        println!("Got: {}", received);
    }   
}
```

### 通过克隆创建多个发送者
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main(){
    let (tx, rx) = mpsc::channel();
    let tx1 = mpsc::Sender::clone(&tx);

    thread::spawn(move || {
        let vals = vec![
            String::from("1:hi"),
            String::from("1:from"),
            String::from("1:the"),
            String::from("1:thread")
        ];
        for val in vals{
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    thread::spawn(move||{
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread")
        ];
        for val in vals{
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx{
        println!("Got: {}", received);
    }
   
}
```

## 共享状态的并发
* Go 语言的名言: 不要用共享内存来通信, 用通信来共享内存
* Rust 支持通过共享状态来实现并发
* Channel 类似单所有权: 一旦将值的所有权转移至Channel, 就无法使用它了

* 共享内存并发类似多所有权, 多个线程可以同时访问同一块内存

### 使用Mutex来每次只允许一格线程来访问数据
* Mutex是mutual exclusion(互斥锁)的简写

* 在同一时刻, Mutex只允许一个线程来访问某些数据
* 想要访问数据
    * 线程必须首先获取互斥锁
        * lock 数据结构是mutex的一部分, 它能跟踪谁对数据拥有独占访问权
    * mutex 通常被描述为: 通过锁定系统来保护它所持有的数据

### Mutex的两条规则
* 在使用数据之前, 必须尝试获得锁(lock)
* 使用完mutex所保护的数据, 必须对数据进行解锁, 以便其它线程可以获取锁

### `Mutex<T>`的API
* 通过Mutex::new(数据)来创建`Mutex<T>`
    * `Mutex<T>` 是一个智能指针

* 访问数据前,通过lock方法来获取锁
    * 会阻塞当前线程
    * lock可能会失败
    * 返回的是 MutexGuard (智能指针, 实现了Deref和Drop)

```rust
use std::sync::Mutex;

fn main(){
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }
    println!("m = {:?}",m);
    
}
```
### 多线程共享`Mutex<T>`

### 使用`Arc<T>`来在多个线程间共享所有权
* `Arc<T>`是atomically reference counted(原子引用计数)的缩写
* `Arc<T>` 和 `Rc<T>` 类似, 它可以用于并发场景
* 为什么所有的基础类型都不是原子的, 为什么标准库不默认使用`Arc<T>`?
    * 需要牺牲性能作为代价

* `Arc<T>` 和 `Rc<T>` 的API是相同的
```rust
use std::sync::{Mutex, Arc};
use std::thread;
fn main(){
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..10{
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move ||{
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }   
    for handle in handles{
        handle.join().unwrap();
    }   
    println!("Result:{}", *counter.lock().unwrap());
    
}
```

### `RefCell<T>/Rc<T>` vs `Mutex<T>/Arc<T>`
* `Mutex<T>` 提供了内部可变性, 和Cell家族一样
* 我们使用`RefCell<T>` 来改变`Rc<T>`里面的内容
* 我们使用`Mutex<T>` 来改变`Arc<T>`里面的内容
* 注意: `Mutex<T>`有死锁风险

## 使用Sync和Send trait的可扩展并发
### Send 和 Sync trait
* Rust 语言的并发特性较少, 目前讲的并发新特性都来自标准库(而不是语言本身)
* 无需局限于标准库的并发, 可以自己实现并发
* 但在Rust语言中有两个并发的概念:
    * std::marker::Sync 和 std::marker::Send 这两个trait

### Send：允许线程间转移所有权
* 实现Send trait 的类型可在线程间转移所有权
* Rust中几乎所有的类型都实现了Send
    * 但`Rc<T>`没有实现Send, 它只用于单线程场景
* 任何完全由Send类型组成的类型也被标记为Send
* 除了原始指针之外, 几乎所有的基础类型都是Send

### Sync: 允许从多线程访问
* 实现Sync的线程可以安全地被多个线程引用
* 也就是说: 如果T是Sync, 那么 &T 就是Send
    * 引用可以被安全的送往另一个线程
* 基础类型都是Sync
* 完全由Sync类型组成的类型也是Sync
    * 但, `Rc<T>` 不是Sync的
    * `RefCell<T>` 和 `Cell<T>` 家族也不是Sync的
    * 而, `Mutex<T>` 是Sync的

### 手动来实现Send和Sync是不安全的
* 记住上面的话即可