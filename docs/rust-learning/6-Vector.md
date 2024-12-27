---
title: 6. Vector
sidebar_position: 6
authors: zhihe
tags: [rust]
---
# Vector
## 使用Vector储存多个值
* `Vec<T>`,叫做vector
    * 由标准库提供
    * 可以储存多个值
    * 所有值的类型相同
    * 值在内存中连续存放

## 创建一个vector
```rust
let  v: Vec<i32> = Vec::new();
```
* 使用初始值创建Vec`<T>`,使用`vec!`宏
```rust
let v = vec![1, 2, 3, 4, 5];
```
* 更新vector
```rust
let mut v = Vec::new();
v.push(1);
v.push(2);
v.push(3);
```
* 与其他类型一样，当vector离开作用域时，vector和其所有元素都被丢弃

* Vector 根据index查找元素
```rust
let v = vec![1, 2, 3, 4, 5];
let third = &v[2];
println!("The third element is {}", third);

match v.get(2){
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}
```
第一种在索引不存在时会引发panic，第二种会返回None
```rust
match v.get(100){
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}
```
返回：`There is no third element.`

## 所有权和借用规则
* 不能在同一作用域中同时存在可变和不可变引用
这里编译器就会报错：
```rust
let v = vec![1, 2, 3, 4, 5];
let first = &v[0];
v.push(6);
// error: cannot borrow `v` as mutable because it is also borrowed as immutable
println!("The first element is: {}", first);
```

## 遍历vector
```rust
let v = vec![1, 2, 3, 4, 5];
for i in &v {
    println!("{}", i);
}
```

```rust
let mut v = vec![1, 2, 3, 4, 5];
for i in &mut v {
    *i += 50;
}
for i in &v {
    println!("{}", i);
}

```
## 使用枚举储存多种类型
* Enum 的变体可以附加不同类型的数据
* Enum 的定义在同一个enum下
```rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

fn main() {
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Float(10.12),
        SpreadsheetCell::Text(String::from("Hello")),
    ];

}
```
# String
String 的数据结构复杂
* Rust 的核心语言层面，只有一个字符串类型:字符串切片`str`或 `&str`
* 字符串切片: 对储存在其他地方, UTF-8编码的字符串的引用
    * 字符串字面值: 储存在二进制文件中, 也就是字符串切片

* String 类型:
    * 来自标准库, 可增长, 可变, 有所有权, UTF-8编码
## 创建一个新的字符串
* 很多`Vec<T>`的操作都可用于`String`
* String::new() 创建一个空的字符串

*  使用`to_string()`方法,  可用于实现了`Display` trait的类型, 包括字符串字面值
```rust
let data = "initial contents";
let s = data.to_string(); // convert string literal to String
let s1 = "initial contents".to_string(); // same as above
```
* 使用`String::from()`方法, 从字面值创建String
```rust
let s = String::from("hello");
```
## 更新字符串
* 使用`push_str()`方法, 将字符串切片附加到String
```rust
let mut s = String::from("foo");
s.push_str("bar");
println!("{}", s);
```
* 使用`push()`方法, 将单个字符附加到String
```rust
let mut s = String::from("hello");
s.push(';'); // push a char
println!("{}", s);
```
* 使用`+`运算符或拼接字符串
    * 使用了类似这个签名的方法:`fn add(self, s: &str) -> String{...}`
    * `+`运算符会取得其第一个参数的所有权, 并且使第一个字符串不可用
    * 标准库中的`add`使用了泛型
    * 只能把`&str`拼接到String上
    * 解引用强制转换`&String`为`&str`
```rust
let s1 = String::from("hello");
let s2 = String::from("world");
let s3 = s1 + &s2; // note s1 has been moved here and can no longer be used
println!("s3 = {}", s3);
println!("s2 = {}", s2);
// println!("s1 = {}", s1); // error: value borrowed here after move
```
```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
let s3 = s1 + "-" + &s2 + "-" + &s3;
println!("{}", s3);
```
输出`tic-tac-toe`
* 使用`format!`宏拼接字符串
```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");


let s = format!("{}-{}-{}", s1, s2, s3);
println!("{}", s);
```
同样输出`tic-tac-toe`
这个方法不会获得原来`s1`, `s2`, `s3`的所有权,这三个依旧可以使用

## 索引字符串
* Rust 不允许使用索引获取String中的字符
```rust
let s1 = String::from("hello");
let h = s1[0]; // Error: the type `std::string::String` cannot be indexed by `{integer}`
```


* String 是对`Vec<u8>`的封装

### 字节、标量值和字形簇
* Rust 有三种看待字符串的形式:
    * 字节
    * 标量值
    * 字形簇 (最接近人类理解的字符概念)

### 切割String
* 可以使用[] 和一个范围来创建一个字符串切片
    * 必须谨慎使用
    * 如果切割时跨越了字符边界, 会panic

# HashMap
* 键值对的形式储存数据，一个键(Key)对应一个值(Value)
* Hash 函数: 决定了键和值如何储存到内存中
* 适用场景: 通过K(任何类型)来寻找数据，而不是通过索引

## 创建一个HashMap
```rust
let mut scores= HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
```
* HashMap 数据储存在heap上
* 所有的key必须是相同类型，所有的value也必须是相同类型
## 另外一种创建HashMap的方法
* 在元素类型为Tuple的Vector上使用collect方法, 可以组建一个HashMap：
    * 要求Tuple 有两个值: 一个作为key, 一个作为value
    * collect 方法可以将数据收集到不同的数据结构中
        * 返回值需要显式声明类型
    
```rust
let teams = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];
let scores: HashMap<_, _> = 
    teams.iter().zip(initial_scores.iter()).collect();
```

## HashMap 和所有权
* 对于实现了Copy trait的类型，其值会被复制到HashMap中
* 对于拥有所有权在的值(例如String)，值会被移动，所有权会转移给HashMap
```rust
let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(field_name, field_value);

//println!("{}:{}", field_name, field_value);// error!  ownership moved to map   
```

* 如果将值的引用插入HashMap，值本身不会被移动到HashMap中
```rust
let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(&field_name, &field_value);

println!("{}:{}", field_name, field_value);
```
* 在HashMap有效时，其引用的key和value值也必须有效

## 访问HashMap中的值
* 使用get方法，传入key，返回一个`Option<&V>`
```rust
let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score = scores.get(&team_name); // returns Option<&V>

match score{
    Some(s) => println!("{}: {}", team_name, s),
    None => println!("{}: {}", team_name, "No score"),
};
```
* 遍历HashMap
```rust
let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);


for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```
## 更新HashMap
* HashMap 大小可变
* 每个K只能对应一个V
* 更新HashMap 中的数据:
    * K 已存在, 对应一个V：
        * 替换现有的V
        * 保留现有的V, 忽略新的V
        * 合并现有的V和新的V
    * K 不存在, 插入新的K和V

### 替换现有的V
* 如果向HashMap插入一对KV, 然后再插入同样的K, 但是不同的V, 那么原来的V会被替换
```rust
let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 50);

println!("{:?}", scores);

```
输出`{"Blue": 50}`
### 只在K没有对应任何值的情况下V时插入
* entry方法: 检查指定的K是否有对应的V
    * 参数为K
    * 返回enum Entry: 代表值是否存在
* Entry的or_insert()方法:
    * 返回：
        * 如果K存在, 返回对应的V的可变引用
        * 如果K不存在, 插入参数作为新的V, 返回新的V的可变引用
        
```rust
let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);

// scores.entry(String::from("Yellow")).or_insert(50);
let e= scores.entry(String::from("Yellow"));
println!("{:?}", e);
e.or_insert(50);
scores.entry(String::from("Blue")).or_insert(50); //不会覆盖原有的值

println!("{:?}", scores);

```
输出`{"Blue": 10, "Yellow": 50}`

### 基于现有V来更新V
```rust
let text =  "hello world wonderful world";

let mut map = HashMap::new();

for word in text.split_whitespace() {
    // or_insert 方法事实上会返回这个键的值的一个可变引用（&mut V）
    // 这里我们将这个可变引用储存在 count 变量中
    let count = map.entry(word).or_insert(0); //返回的是一个可变引用
    *count += 1;
}

println!("{:?}", map);
```
输出`{"world": 2, "hello": 1, "wonderful": 1}`

### Hash 函数
* 默认情况下， HashMap使用加密强大的Hash函数， 可以抵抗拒绝服务攻击(DoS)
    * 不是可用的最快的Hash算法
    * 但具有良好的安全性
* 可以指定不同的hasher来切换到不同的Hash算法
    * hasher 是一个实现了BuildHasher trait的类型
    * 例如: FnvBuilder