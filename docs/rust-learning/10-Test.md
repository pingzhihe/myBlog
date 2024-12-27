---
title: 10. 测试
sidebar_position: 10
authors: zhihe
tags: [rust]
---

# 编写自动化测试
##  编写和运行测试
### 测试(函数)
* 测试: 
    * 函数
    * 验证非测试代码的功能是否和预期一致

* 测试函数体(通常)执行的3个操作
    * 准备数据/状态
    * 运行被测试的代码
    * 断言(Assert)结果

### 解剖测试函数
* 测试函数需要使用test属性(attribute)进行标注
    * Attribute 就是一段Rust代码的元数据
    * 在函数上加上`#[test]`, 可以把一个函数变成测试函数

### 运行测试
* 使用 `cargo test` 命令运行所有的测试函数
    * Rust 会构建一个 Test Runner 可执行文件
    * Test Runner 会运行所有测试函数并报告结果是否成功

* 当使用cargo 创建library项目的时候, 会生成一个test module, 里面有一个test 函数
    * 你可以添加任意数量的test module 或函数  

`lib.rs`里:   
```rust
#[cfg(test)]
mod tests{
    #[test]
    fn exploration(){
        assert_eq!(2 + 2, 4);
    }
}
```

### 测试失败
* 测试函数panic 就表示失败
* 每个函数都运行在一个新线程
* 当主线程看到某个测试现场挂了, 那个测试标记为失败了
```rust
#[cfg(test)]
mod tests{
    #[test]
    fn exploration(){
        assert_eq!(2 + 2, 4);
    }
    #[test]
    fn another(){
        panic!("Make this test fail");
    }
}
```
## 断言(Assert)
### 使用assert! 宏检查测试结果
* assert! 宏, 来在标准库, 用来确定某个状态是否为true
    * true, 测试通过
    * false, 测试失败, 并调用panic

###  使用assert_eq! 和 assert_ne! 测试相等性
* 都来自标准库
* 判断两个参数是否相等或不等
* 实际上,  它们就是 == 和 != 操作符
* 当断言失败时, 会打印出参数的值
    * 使用debug格式打印参数
    * 要求参数实现了PartialEq 和 Debug trait (所有基本类型和标准库里打大部分类型都实现了)

```rust
pub fn add_two(a: i32) -> i32{
    a + 2
}
#[cfg(test)]
mod tests{
    #[test]
    fn it_adds_two(){
        assert_eq!(4, super::add_two(2));
    }

}
```

### 添加自定义的信息
* 可以向assert!, assert_eq!, assert_ne! 添加可选的自定义信息
    * 这些自定义信息和失败消息都会被打印出来
    * assert!: 第1参数必填, 自定义参数为第2个参数
    * assert_eq!, assert_ne!: 第1,2参数必填, 自定义参数为第3个参数
    * 自定义参数会被传递给format! 宏, 可以使用{} 占位符
```rust
pub fn greeting(name: &str) -> String {
    format!("Hello !")
}

#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    fn greeting_contains_name(){
        let result = greeting("Carol");
        assert!(result.contains("Carol"),
        "Greeting did not contain name, value was `{}`", result);
    }

}
```
## 使用should_panic 检查恐慌
### 验证错误处理的情况
* 测试除了代码的返回值是否正确, 还需验证代码是否如期的处理了发生错误的情况
* 可验证代码在特定情况下是否发生了panic
* should_panic 属性(attribute):
    * 函数panic: 测试通过
    * 函数没有panic: 测试失败


```rust
pub fn greeting(name: &str) -> String {
    format!("Hello !")
}

pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100{
            panic!("Guess value must be between 1 and 100, got {}.", value);
        }
        Guess {value}
    }
}
#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    #[should_panic]
    fn greater_than_100(){
        Guess::new(200);
    }
}
```
因为Guess::new(200) 会panic, 所以测试通过  

### 让should_panic 的测试更精确
* 为should_panic 添加可选的expected 参数:
    * 将检查失败信息中是否包含所指定的文字

```rust

pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be great or equal to 1 got {}.",
            value
            )
        } else if value > 100 {
            panic!("Guess value must be less than or equal to 100 got {}.",
            value
            )
        }
        Guess {value}
    }
}
#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    #[should_panic(expected = "Guess value must be less than or equal to 100")]
    fn greater_than_100(){
        Guess::new(200);
    }
}
```
## 使用Result`<T, E>` 的测试
### 在测试的时候使用Result`<T, E>`
* 无需panic, 可以使用Result`<T, E>` 作为返回类型编写测试
    * 返回Ok: 测试通过
    * 返回Err: 测试失败
```rust



pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be great or equal to 1 got {}.",
            value
            )
        } else if value > 100 {
            panic!("Guess value must be less than or equal to 100 got {}.",
            value
            )
        }
        Guess {value}
    }
}
#[cfg(test)]
mod tests{
    #[test]
    fn if_works() -> Result<(), String>{
        if 2+3 == 4{
            Ok(())
        } else{
            Err(String::from("two plus two does not equal to four")
            )    
        }
    }
}
```
* 注意: 不要使用`Result<T,E>`编写的测试上标注#[should_panic]

## 控制测试运行
### 控制测试如何运行
* 改变`cargo test` 命令的行为
    * 并行运行
    * 所有测试
    * 捕获(不显示)所有输出, 使读取与测试相关结果的输出更容易
* 命令行参数:
    * 针对cargo test 的参数: 紧跟在`cargo test` 后面
    * 针对测试可执行程序的参数: 紧跟在`--` 后面
* `cargo test --help` 查看所有参数
* `cargo test -- --help` 查看测试可用在`--`之后的参数

### 并行运行测试
* 运行多个测试: 默认使用多个线程并行运行
    * 运行快
* 确保测试之间: 
    * 不会互相依赖
    * 不依赖于某个共享状态(如环境变量, 文件系统, 数据库)

### --test-threads 参数
* 传递给二进制文件
* 不想以并行方式运行测试, 或者想对线程数进行颗粒度控制
* 可以使用`--test-threads` 参数, 后面跟线程数量
    * `cargo test -- --test-threads=1` 一次只运行一个测试
    * `cargo test -- --test-threads=8` 一次运行8个测试

### 显示函数输出
* 默认, 如测试通过, Rust的test 库会捕获所有打印到标准输出的内容
* 例如, 如果被测试代码中用到了println!: 
    * 如果测试通过: 不会在终端看到println! 打印的内容
    * 如果测试失败: 会在终端看到println! 打印的内容和失败信息
```rust
fn prints_and_return_10(a: i32) -> i32{
    
    println!("I got the value {}",a);
    10
}

#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    fn this_test_will_pass(){
        let value = prints_and_return_10(4);
        assert_eq!(10, value);
    }
    #[test]
    fn this_test_will_fall(){
        let value = prints_and_return_10(8);
        assert_eq!(5, value);
    }
}
```
## 按名称运行测试的子集
* 选择运行的测试: 将测试的名称(一个或多个)作为cargo test 的参数

```rust
fn add_two(a: i32) -> i32{
    a + 2
}

#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    fn add_two_and_two(){
        assert_eq!(4, add_two(2));
    }
    #[test]
    fn add_three_and_two(){
        assert_eq!(5, add_two(3));
    }
    #[test]
    fn one_hundred(){
        assert_eq!(102, add_two(100));
    }
}
```
* 运行单个测试: `cargo test one_hundred`  

* 运行多个测试: 指定测试名的一部分(模块名也可以)
    * `cargo test two` 会运行两个测试: add_two_and_two, add_three_and_two

## 忽略测试

* ignore 属性(attribute)
`#[ignore]`
* 运行被忽略的测试: `cargo test -- --ignored`


## 测试的组织
### 测试的分类
* Rust 对测试的分类:
    * 单元测试(unit tests)
    * 集成测试(integration tests)

* 单元测试:
    * 小, 专注
    * 一次对一个模块进行隔离的测试
    * 可测试private 接口

* 集成测试:
    * 在库外部. 和其他外部代码一起使用
    * 只能访问public 接口

### 单元测试
#### `#[cfg(test)]`标注
* tests 模块上的`#[cfg(test)]` 标注
    * 只有在运行`cargo test` 时才编译和运行代码
    * `cargo build` 则不会
* 集成测试在不同的目录,  它不需要`#[cfg(test)]` 标注
* cfg: configuration(配置)
    * 告诉Rust 下面的条目只有在指定的配置选项下才被包含
    * 配置选项test: 有rust 提供, 用来编译和运行测试
        * 只有cargo test 才会编译代码, 包括某块中的helper函数和`#[test]` 标注的函数

#### 测试私有函数
* Rust 运行测试私有函数
```rust
pub fn add_two(a:i32)->i32{
    a+2
}
fn internal_adder(a:i32,b:i32)->i32{
    a+b
}

#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    fn internal(){
        assert_eq!(4,internal_adder(2,2));
    }


}
```
这里用`use super::*;`导入父模块的所有内容,internal 测试函数可以调用internal_adder这个私有函数  

### 集成测试
* 在Rust里, 集成测试完全位于被测试库的外部
* 目的: 是测试被测试库的多个部分是否可以一起正常工作
* 集成测试的覆盖率很重要

#### test 目录
* 创建集成测试: tests 目录
* tests 目录下的每个测试文件都是单独一个crate
    * 需要将被测试库导入

* 无需`#[cfg(test)]` 标注, tests 目录被特殊对待
    * 只有运行`cargo test` 时才会编译和运行tests 目录下的代码
    
在tests 目录下创建一个文件, 例如`tests/integration_test.rs`:  
```rust
use write_and_test;

#[test]
fn it_adds_two() {
    assert_eq!(4, write_and_test::add_two(2));
}
```
#### 运行指定的集成测试
* 运行一个特定的集成测试: cargo test 函数名
* 运行某个测试文件内的所有测试: cargo test --test 文件名
* 运行所有集成测试: cargo test --test integration_test
    * `cargo test --test integration_tests`

#### 集成测试中的子模块
* tests 目录下每个文件被编译成单独的crate
    * 这些文件不共享行为(与src下的文件规则不同)

#### 针对binary crate的集成测试
* 如果项目是binary crate, 只含有src/main.rs, 没有src/lib.rs
    * 无法在tests目录下创建集成测试
    * 无法把main 函数导入作用域

* 只有binary crate 才能暴露给其他crate用
* binary crate 意味着独立运行
