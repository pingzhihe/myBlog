---
slug: basic
title: 1. Basics of C++
sidebar_position: 1
authors: zhihe
tags: [cpp]
---
# Basics of C++


Every time we start to learn a new language, it's a good idea to start with a simple **"Hello, World!"!**

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
In C++, we use the `#include` directive to include libraries or header files into our program. 

```cpp
#include <iostream>
```
The entry point of a C++ program is the `main` function. Every C++ program must have a `main` function.
```cpp
int main() {
    // Your code starts here!
    return 0;
}
```
The *input/output* library `iostream` is a part of the C++ Standard Library and is used to perform input and output operations.

One of the most useful is `std::cout`, which is used to output data to the console.
`std::endl` is used to insert a newline character and flush the stream.
```cpp
#include <iostream> //for std::cout

int main() {
    std::cout << "Hello, World!" << std::endl; // print Hello world! to console
    return 0;
}
```
The **insertion operator** (`<<`) can be used multiple times in a single statement to concatenate (link together) multiple pieces of output.
```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hello" << " world!";
    return 0;
}
```
The program will output `Hello world!` to the console.

### `std::endl` vs `\n`
Using `std::endl` is often inefficient, as it actually does two jobs: it outputs a newline (moving the cursor to the next line of the console), and it flushes the buffer (which is slow). 

To output a newline without flushing the output buffer, we use `\n` instead.

### `std::cin`
`std::cin` is another predefined variable in the iostream library. Whereas `std::cout` prints data to the console (using the insertion operator `<<` to provide the data), `std::cin` (which stands for “character input”) **reads input from keyboard**. We typically use the extraction operator `>>` to put the input data in a variable.
```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter a number: "; // ask user for a number

    int x{};       // define variable x to hold user input (and value-initialize it)
    std::cin >> x; // get number from keyboard and store it in variable x

    std::cout << "You entered " << x << '\n';
    return 0;
}
```

## Initialization
### Different forms of initialization:
```cpp
int a;         // default-initialization (no initializer)

// Traditional initialization forms:
int b = 5;     // copy-initialization (initial value after equals sign)
int c ( 6 );   // direct-initialization (initial value in parenthesis)

// Modern initialization forms (preferred):
int d { 7 };   // direct-list-initialization (initial value in braces)
int e {};      // value-initialization (empty braces)
```
The modern way to initialize objects in C++ is to use a form of initialization that makes use of curly braces. This is called list-initialization (or uniform initialization or brace initialization).
```cpp
int width { 5 }; // direct-list-initialization of initial value 5 into variable width (preferred)
```

### Instantiation
The term **instantation** is a fancy word that means a variable has been **created (allocated)** and **initialized (this includes default initialization)** . An instantiated object is sometimes called an instance. Most often, this term is applied to class type objects, but it is occasionally applied to objects of other types as well.

### Unused initialized variables warnings

```cpp
int main()
{
    int x { 5 }; // variable x defined

    // but not used anywhere

    return 0;
}
```
This will result in a warning, as the variable `x` is defined but not used.

### The `[[maybe_unused]]` attribute **(c++17)**
```cpp
#include <iostream>

int main()
{
    [[maybe_unused]] double pi { 3.14159 };  // Don't complain if pi is unused
    [[maybe_unused]] double gravity { 9.8 }; // Don't complain if gravity is unused
    [[maybe_unused]] double phi { 1.61803 }; // Don't complain if phi is unused

    std::cout << pi << '\n';
    std::cout << phi << '\n';

    // The compiler will no longer warn about gravity not being used

    return 0;
}
```



