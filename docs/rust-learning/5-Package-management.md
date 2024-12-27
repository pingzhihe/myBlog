---
title: 5. Rust的代码组织
sidebar_position: 5
authors: zhihe
tags: [rust]
---

# Rust 的代码组织
* 代码组织主要包括：
    * 哪些细节可以暴露， 哪些细节是私有的
    * 作用域内哪些名称有效

* 模块系统:
    * Package(包): Cargo 的特性, 让你构建, 测试, 共享crate
    * Crate (单元包): 一个模块树, 它可以产生一个library或可执行文件
    * Module (模块) 和 use: 让你控制作用域和路径的私有性
    * Path (路径): 一个命名项的方式, 例如: struct, function, module  
    
## Package 和 Crate
* Crate 的类型:
    * binary: 一个可执行文件
    * library: 一个库
* Crate Root: 
    * 是源代码文件
    * Rust 编译器从这里开始, 组成你的Crate 的根moudle
* 一个Package:
    * 包含一个 Cargo.toml 文件, 它描述了如何构建这些 Crates
    * 只能包含0-1个library crate
    * 可以包含任意数量的 binary crate
    * 但必须至少包含一个crate (无论是library还是binary)

### Cargo 惯例:
* src/main.rs :
    * 是 binary crate 的 crate root
    * crate 名与package名相同

* src/lib.rs:
    * package 包含一个library crate
    * library crate 的 crate root
    * crate 名与package名相同

* Cargo 把crate root 文件交给rustc 来构建library 或binary

* 一个Package 可以有多个 binary crate:
    * 文件放在src/bin 目录下
    * 每个文件是单独的binary crate

### Crate 的作用
* 将相关功能组合到一个作用域内, 便于在项目之间共享
    * 防止冲突
* 例如 rand crate,  访问它的功能需要通过它的名字: rand

### 定义moudle 来控制作用域和实用性
* Moudle
    * 在一个crate内, 将代码进行分组
    * 增加可读性, 易于复用
    * 控制项目(item) 的私有性。 public/private
* 建立module:
    * mod 关键字
    * 可嵌套
    * 可包含其他项(struct, enum, 常量, trait, 函数等)的定义
    * 默认是私有的 可加`pub`关键字使其公有  
在src/lib.rs 中定义一个模块:

```rust
mod front_of_house {
    // path: src/lib.rs
    // 子moudle
    mod hosting {
    fn add_to_waitlist() {}
    }
    // 子moudle
    mod serving {
    fn take_order() {}
    fn serve_order() {}
    fn take_payment() {}
    }
}
```
结构:  

<img src={require('./images/struct-1.png')} alt="mod-struct" width="400" />

* src/main.rs 和 src/lib.rs 叫做crate roots:
    * 这两个文件(任意一个)的内容形成了名为crate的模块, 位于整个模块树的根部

## 路径 (Path)
* 为了在rust的模块中找到某个条目,需要使用路径
* 路径的两种形式:
    * 绝对路径: 从crate root 开始, 使用crate名或者字面值`crate`
    * 相对路径: 从当前模块开始, 使用`self`, `super` 或当前模块的标识符
* 路径至少由一个标识符组成,标识符之间使用`::`
* 例如: `crate::front_of_house::hosting::add_to_waitlist`

### 私有边界(private boundary)
* 模块不仅可以组织代码, 还可以定义私有边界
* 如果把函数或者struct 等设为私有,可以将它放到某个模块中, 这样其他模块就不能访问它了
* Rust 中所有的条目(函数,方法,struct,enum,module) 默认都是私有的
* 父级模块不能访问子模块的私有条目
* 子模块可以访问父模块的私有条目
* 使用`pub`关键字可以使条目变为公有
```rust
mod front_of_house {

    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

### super 关键字:
* super: 用来访问父级模块路径中的内容, 类似文件系统中的`..`
```rust
fn serve_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::serve_order();
    }

    fn cook_order() {}
}
```
### pub struct
* pub struct: 使结构体公有
    * struct 是公共的
    * struct 内字段是默认私有的

* struct 的字段需要单独设置pub 来变成公有

### pub enum
* pub enum:
    * enum 是公共的
    * enum 的变体也都是公共的

## use 关键字
* 可以使用use 关键字将路径引入作用域内
    * 仍遵循私有性规则
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

```
* use 也可以使用相对路径
```rust
use front_of_house::hosting;
```
我们一般引入的是函数的父级模块, 这样就可以知道调用的函数是属于哪个模块的

* struct, enum, 其他:  指定完整路径(指定到本身)
```rust
use std::collections::HashMap;
fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);

}
```
同名的struct或者enum, 指定到父级
```rust
use std::fmt;
use std::io;

fn f1() -> fmt::Result {}
fn f2() -> io::Result {}

fn main {}
```
### as 关键字
* as 关键字可以为引入的路径设置本地的别名
```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn f1() -> Result {}
fn f2() -> IoResult {}

fn main {}
```

### 使用pub use 重新导出名称
* 使用use 将路径(名称)导入作用域后, 该名称在次作用域是私有的
```rust
pub use front_of_house::hosting;
```
在外部使用hosting function  
* pub use: 重导出
    * 将条目引入作用域
    * 该条目可以被外部代码引入到它们的作用域

### 使用外部包
1. 在Cargo.toml 中添加依赖的包(package)
    * https://crates.io/ 上查找包
2. use 将特定条目引入作用域
    * 例如: use rand::Rng

* 标准库std 也被当作一个外部包
    * 不需要修改Cargo.toml来使用它
    * 只需要use 将特定条目引入作用域

### 使用嵌套路径消除大量的use
* 如果要使用一个包或者模块中的多个条目
*  可以使用嵌套路径在同一行内将上述条目引入:
    * `路径相同的部分::{路径不同的部分}`

```rust
use std::{cmp::Ordering, io};
```
* 也可以使用self, super
```rust
use std::io::{self, Write};
```

### 通配符*
* 使用*可以把路径中所有的公共条目引入作用域
* 注意: 谨慎使用
* 应用场景:
    * 测试: 把所有被测试的代码引入到tests模块
    * 有时候被用于预导入(prelude)模块

## 将模块拆分为不同的文件

### 将模块内容移动到其他文件
* 模块定义时, 如果模块名后边是`;`, 而不是代码块:
    * Rust 会从与模块同名的文件中加载模块内容
    * 模块树的结构不会发生变化
    * 例如: `mod front_of_house;`
* 随着模块逐渐增大, 可以将模块内容移动到其他文件中
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
```
这边如果是`mod front_of_house;` 会从front_of_house.rs 文件中加载模块内容  
`lib.rs`:  
```rust
mod front_of_house;
pub use crate:: front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting :: add_to_waitlist();
    hosting :: add_to_waitlist();
    hosting :: add_to_waitlist();
}
```
`front_of_house.rs`:
```rust
pub mod hosting {
    pub fn add_to_waitlist() {}
}
```