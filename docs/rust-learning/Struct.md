---
title: 3. Struct
sidebar_position: 3
authors: zhihe
tags: [rust]
---
# Struct
```rust
struct User{
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

```
一旦struct的实例是可变的，那么实例中所有的字段都是可变的  
struct 可以作为函数的返回值

### Struct 可以作为函数的返回值
```rust
fn build_user(email: String, username: String) -> User{
    User{
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
```
### Struct更新语法
```rust
let user_2 = User{
    username: String::from("Darton"),
    email: String::from("example@com"),
    ..user_1
};
```
## Tuple Struct
可以定义一个元组结构体
* 想给tuple起名，让他不同于其他tuple，但又不需要给每个元素起名
```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```
* black 和 origin 是不同的类型，因为他们的元素不同。