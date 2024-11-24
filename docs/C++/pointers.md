---
slug: pointers-1
title: '3. Compound Types: References and Pointers'
sidebar_position: 3
authors: zhihe
tags: [cpp]
---
# Compound Types: References and Pointers

## 1. Value categories (lvalues and rvalues)
The **value category** of an expression (or subexpression) indicates whether an expression resolves to a value, a function, or an object of some kind.
- Prior to C++11, there were only two possible value categories: `lvalue` and `rvalue`.
- In C++11, three additional value categories (`glvalue`, `prvalue`, and `xvalue`) were added to support a new feature called `move semantics`.

### Lvalue and rvalue expressions
An lvalue is an expression that evaluates to an identifiable object or function (or bit-field).

Entities with identities can be accessed via an identifier, reference, or pointer, and typically have a lifetime longer than a single expression or statement.
```cpp
int main()
{
    int x { 5 };
    int y { x }; // x is an lvalue expression

    return 0;
}
```
lvalues come in two subtypes: a **modifiable lvalue** is an lvalue whose value can be modified. A **non-modifiable lvalue** is an lvalue whose value can’t be modified (because the lvalue is const or constexpr).
```cpp
int main()
{
    int x{};
    const double d{};

    int y { x }; // x is a modifiable lvalue expression
    const double e { d }; // d is a non-modifiable lvalue expression

    return 0;
}
```
An rvalue is an expression that is not an lvalue. Rvalue expressions evaluate to a value. Commonly seen rvalues include literals (except C-style string literals, which are lvalues) and the return value of functions and operators that return by value. Rvalues aren’t **identifiable** (meaning they have to be used immediately), and only exist within the scope of the expression in which they are used.
```cpp
int return5()
{
    return 5;
}

int main()
{
    int x{ 5 }; // 5 is an rvalue expression
    const double d{ 1.2 }; // 1.2 is an rvalue expression

    int y { x }; // x is a modifiable lvalue expression
    const double e { d }; // d is a non-modifiable lvalue expression
    int z { return5() }; // return5() is an rvalue expression (since the result is returned by value)

    int w { x + 1 }; // x + 1 is an rvalue expression
    int q { static_cast<int>(d) }; // the result of static casting d to an int is an rvalue expression

    return 0;
}
```
why `return5()`, `x + 1`, and `static_cast<int>(d)` are rvalues: the answer is because these expressions produce temporary values that are not identifiable objects.

A method to determine whether an expression is  **lvalue** or **rvalue**:
```cpp
#include <iostream>
#include <string>

// T& is an lvalue reference, so this overload will be preferred for lvalues    
template <typename T>
constexpr bool is_lvalue(T&)
{
    return true;
}

// T&& is an rvalue reference, so this overload will be preferred for rvalues
template <typename T>
constexpr bool is_lvalue(T&&)
{
    return false;
}

// A helper macro (#expr prints whatever is passed in for expr as text)
#define PRINTVCAT(expr) { std::cout << #expr << " is an " << (is_lvalue(expr) ? "lvalue\n" : "rvalue\n"); }

int getint() { return 5; }

int main()
{
    PRINTVCAT(5);
    PRINTVCAT(getint());
    int x { 5 };
    PRINTVCAT(x);
    PRINTVCAT(std::string {"Hello"});
    PRINTVCAT("Hello");
}
```

### Lvalue to rvalue conversion
Let’s take a look at this example again:
```cpp
int main()
{
    int x { 5 };
    int y { x }; // x is an lvalue expression

    return 0;
}
```
If `x` is an lvalue expression that evaluates to variable `x`, then how does `y` end up with value `5`?

The answer is that lvalue expressions will implicitly convert to rvalue expressions in contexts where an rvalue is expected but an lvalue is provided.

**Key insight**: 
- Lvalue expressions are those that evaluate to functions or identifiable objects (including variables) that persist beyond the end of the expression.
- Rvalue expressions are those that evaluate to values, including literals and temporary objects that do not persist beyond the end of the expression.

## 2. Lvalue references
In C++, a **reference** is an alias for an existing object. Once a reference has been defined, any operation on the reference is applied to the object being referenced. This means we can use a reference to read or modify the object being referenced.

An **lvalue reference** (commonly just called a “reference” since prior to C++11 there was only one type of reference) acts as an alias for an existing lvalue (such as a variable).

Just like the type of an object determines what kind of value it can hold, the type of a reference determines what type of object it can reference. Lvalue reference types can be identified by use of a single ampersand (&) in the type specifier:
```cpp
// regular types
int        // a normal int type (not an reference)
int&       // an lvalue reference to an int object
double&    // an lvalue reference to a double object
const int& // an lvalue reference to a const int object
```

### Lvalue reference variables
One of the things we can do with an lvalue reference type is create an lvalue reference variable. An **lvalue reference variable** is a variable that acts as a reference to an lvalue (usually another variable).

To create an lvalue reference variable, we simply define a variable with an lvalue reference type:
```cpp
#include <iostream>

int main()
{
    int x { 5 };    // x is a normal integer variable
    int& ref { x }; // ref is an lvalue reference variable that can now be used as an alias for variable x

    std::cout << x << '\n';  // print the value of x (5)
    std::cout << ref << '\n'; // print the value of x via ref (5)

    return 0;
}
```
In the above example, the type `int&` defines `ref` as an lvalue reference to an int, which we then initialize with lvalue expression `x`. Thereafter, `ref` and `x` can be used synonymously. This program thus prints:
```
5
5
```
*When defining a reference, place the ampersand next to the type (not the reference variable’s name).*

### Modifying values through a non-const lvalue reference
In the above example, we showed that we can use a reference to read the value of the object being referenced. We can also use a non-const reference to modify the value of the object being referenced:
```cpp
#include <iostream>

int main()
{
    int x { 5 }; // normal integer variable
    int& ref { x }; // ref is now an alias for variable x

    std::cout << x << ref << '\n'; // print 55

    x = 6; // x now has value 6

    std::cout << x << ref << '\n'; // prints 66

    ref = 7; // the object being referenced (x) now has value 7

    std::cout << x << ref << '\n'; // prints 77

    return 0;
}
```

### Rederence initialization
Much like constants, all references must be initialized. References are initialized using a form of initialization called **reference initialization**.
```cpp
int main()
{
    int& invalidRef;   // error: references must be initialized

    int x { 5 };
    int& ref { x }; // okay: reference to int is bound to int variable

    return 0;
}
```

- A reference will (usually) only bind to an object matching its referenced type
- References can’t be reseated (changed to refer to another object)
- Reference variables follow the same scoping and duration rules that normal variables

### References and referents have independent lifetimes
With one exception (that we’ll cover next lesson), the lifetime of a reference and the lifetime of its referent are independent. In other words, both of the following are true:
- A reference can be destroyed before the object it is referencing.
- The object being referenced can be destroyed before the reference.

```cpp
#include <iostream>

int main()
{
    int x { 5 };

    {
        int& ref { x };   // ref is a reference to x
        std::cout << ref << '\n'; // prints value of ref (5)
    } // ref is destroyed here -- x is unaware of this

    std::cout << x << '\n'; // prints value of x (5)

    return 0;
} // x destroyed here
```
The above prints:
```
5
5
```
When `ref` dies, variable `x` carries on as normal, blissfully unaware that a reference to it has been destroyed.

### Dangling references
When an object being reference is destoryed before a reference to it, the reference is left referencing an object that no longer exists. Such a reference is called a **dangling reference**.

### References aren't objects
References are not objects in C++. A reference is not required to exist or occupy storage. If possible, the compiler will optimize references away by replacing all occurrences of a reference with the referent. However, this isn’t always possible, and in such cases, references may require storage.

## 3. Pass by lvalue reference
Why create an alias to a variable when you can just use the variable itself?

`pass by value`: where an argument passed to a function is **copied** into the function’s parameter:
```cpp
#include <iostream>

void printValue(int y)
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    int x { 2 };

    printValue(x); // x is passed by value (copied) into parameter y (inexpensive)

    return 0;
}
```
In the above program, when `printValue(x)` is called, the value of `x` (2) is copied into parameter `y`. Then, at the end of the function, object `y` is destroyed.

This means that when we called the function, we made a copy of our argument’s value, only to use it briefly and then destroy it! Fortunately, because fundamental types are cheap to copy, this isn’t a problem.

### Some objects are expensive to copy
Most of the types provided by the standard library (such as `std::string`) are `class types`. Class types are usually expensive to copy. Whenever possible, we want to avoid making unnecessary copies of objects that are expensive to copy, especially when we will destroy those copies almost immediately.
```cpp
#include <iostream>
#include <string>

void printValue(std::string y)
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    std::string x { "Hello, world!" }; // x is a std::string

    printValue(x); // x is passed by value (copied) into parameter y (expensive)

    return 0;
}
```
This prints:
```
Hello, world!
```

While this program behaves like we expect, it’s also inefficient. Identically to the prior example, when `printValue()` is called, argument `x` is copied into `printValue()` parameter `y`. However, in this example, the argument is a `std::string` instead of an `int`, and `std::string` is a class type that is expensive to copy. And this expensive copy is made every time `printValue()` is called!

We can do better.

### Pass by reference
One way to avoid making an expensive copy of an argument when calling a function is to use `pass by reference` instead of `pass by value`. When using `pass by reference`, we declare a function parameter as a reference type (or const reference type) rather than as a normal type. When the function is called, each reference parameter is bound to the appropriate argument. Because the reference acts as an alias for the argument, no copy of the argument is made.
```cpp
#include <iostream>
#include <string>

void printValue(std::string& y) // type changed to std::string&
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    std::string x { "Hello, world!" };

    printValue(x); // x is now passed by reference into reference parameter y (inexpensive)

    return 0;
}
```
This program is identical to the prior one, except the type of parameter `y` has been changed from `std::string` to `std::string&` (an lvalue reference). Now, when `printValue(x)` is called, lvalue reference parameter `y` is bound to argument `x`. **Binding a reference is always inexpensive**, and no copy of `x` needs to be made. Because a reference acts as an alias for the object being referenced, when `printValue()` uses reference `y`, it’s accessing the actual argument `x` (rather than a copy of `x`).

### Pass by reference allows us to change the value of an argument
When an object is passed by value, the function parameter receives a copy of the argument. This means that any changes to the value of the parameter are made to the copy of the argument, not the argument itself:
```cpp
#include <iostream>

void addOne(int y) // y is a copy of x
{
    ++y; // this modifies the copy of x, not the actual object x
}

int main()
{
    int x { 5 };

    std::cout << "value = " << x << '\n';

    addOne(x);

    std::cout << "value = " << x << '\n'; // x has not been modified

    return 0;
}
```
In the above program, because value parameter y is a copy of x, when we increment y, this only affects y. This program outputs:
```
value = 5
value = 5
```

However, since a reference acts identically to the object being referenced, when using pass by reference, any changes made to the reference parameter *will* affect the argument:
```cpp
#include <iostream>

void addOne(int& y) // y is bound to the actual object x
{
    ++y; // this modifies the actual object x
}

int main()
{
    int x { 5 };

    std::cout << "value = " << x << '\n';

    addOne(x);

    std::cout << "value = " << x << '\n'; // x has been modified

    return 0;
}
```
This program outputs:
```
value = 5
value = 6
```

### Pass by const lvalue reference
Unlike a reference to non-const (which can only bind to modifiable lvalues), a reference to const can bind to modifiable lvalues, non-modifiable lvalues, and rvalues. Therefore, if we make a reference parameter const, then it will be able to bind to any type of argument:
```cpp
#include <iostream>

void printRef(const int& y) // y is a const reference
{
    std::cout << y << '\n';
}

int main()
{
    int x { 5 };
    printRef(x);   // ok: x is a modifiable lvalue, y binds to x

    const int z { 5 };
    printRef(z);   // ok: z is a non-modifiable lvalue, y binds to z

    printRef(5);   // ok: 5 is rvalue literal, y binds to temporary int object

    return 0;
}
```
Passing by const reference offers the same primary benefit as pass by reference (avoiding making a copy of the argument), while also guaranteeing that the function can not change the value being referenced.

For example, the following is disallowed, because `ref` is const:
```cpp
void addOne(const int& ref)
{
    ++ref; // not allowed: ref is const
}
```

**Best practice**

Favor passing by const reference over passing by non-const reference unless you have a specific reason to do otherwise (e.g. the function needs to change the value of an argument).

### When to use pass by value vs pass by (const) reference
For most C++ beginners, the choice of whether to use pass by value or pass by (const) reference isn’t very obvious. Fortunately, there’s a straightforward rule of thumb that will serve you well in the majority cases.
- Fundamental types and enumerated types are cheap to copy, so they are typically passed by value.
- Class types can be expensive to copy (sometimes significantly so), so they are typically passed by const reference.

## 4.   Introduction to pointers
```cpp
char x {}; // chars use 1 byte of memory
```
Simplifying a bit, when the code generated for this definition is executed, a piece of memory from RAM will be assigned to this object. For the sake of example, let’s say that the variable x is assigned memory address `140`. Whenever we use variable `x` in an expression or statement, the program will go to memory address 140 to access the value stored there.

### The address-of operator (&)
Although the memory addresses used by variables aren’t exposed to us by default, we do have access to this information. The address-of operator (&) returns the memory address of its operand. This is pretty straightforward:
```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n';  // print the value of variable x
    std::cout << &x << '\n'; // print the memory address of variable x

    return 0;
}
```
In author's machine, the above program printed:
```
5
0x7ffca25cc314
```
In the above example, we use the address-of operator (&) to retrieve the address assigned to variable x and print that address to the console. Memory addresses are typically printed as hexadecimal values.

For objects that use more than one byte of memory, address-of will return the memory address of the **first byte** used by the object.

The & symbol tends to cause confusion because it has different meanings depending on context:
- When following a type name, & denotes an lvalue reference: `int& ref`.
- When used in a unary context in an expression, & is the address-of operator: `std::cout << &x`.
- When used in a binary context in an expression, & is the Bitwise AND operator: `std::cout << x & y`.

### The dereference operator (*)
The most useful thing we can do with an address is access the value stored at that address. The dereference operator (*) (also occasionally called the indirection operator) returns the value at a given memory address as an lvalue:
```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n';  // print the value of variable x
    std::cout << &x << '\n'; // print the memory address of variable x

    std::cout << *(&x) << '\n'; // print the value at the memory address of variable x (parentheses not required, but make it easier to read)

    return 0;
}
``` 
Output:
```
5
0x7ffeee769914
5
```

The address-of operator (&) and dereference operator (*) work as opposites: address-of gets the address of an object, and dereference gets the object at an address.

### Pointers
**A pointer** is an object that holds a memory address (typically of another variable) as its value. This allows us to store the address of some other object to use later.

In modern C++, the pointers we are talking about here are sometimes called “raw pointers” or “dumb pointers”, to help differentiate them from “smart pointers” that were introduced into the language more recently.

Much like reference types are declared using an ampersand (&) character, pointer types are declared using an asterisk (*):

```cpp
int;  // a normal int
int&; // an lvalue reference to an int value

int*; // a pointer to an int value (holds the address of an integer value)
```
To create a pointer variable, we simply define a variable with a pointer type:
```cpp
int main()
{
    int x { 5 };    // normal variable
    int& ref { x }; // a reference to an integer (bound to x)

    int* ptr;       // a pointer to an integer

    return 0;
}
```
Like normal variables, pointers are not initialized by default. A pointer that has not been initialized is sometimes called a **wild pointer**. Wild pointers contain a garbage address, and dereferencing a wild pointer will result in undefined behavior. Because of this, you should always initialize your pointers to a known value.
```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int& ref { x };  // get a reference to x
    int* ptr { &x }; // get a pointer to x

    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (5)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (5)

    ref = 6; // use the reference to change the value of x
    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (6)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (6)

    *ptr = 7; // use the pointer to change the value of x
    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (7)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (7)

    return 0;
}
```
Outputs:
```
555
666
777
```

### The address-of operator returns a pointer
```cpp
#include <iostream>
#include <typeinfo>

int main()
{
	int x{ 4 };
	std::cout << typeid(&x).name() << '\n'; // print the type of &x

	return 0;
}
```
Output (gcc/clang):
```
Pi
```

### Conclusion
Pointers are variables that hold a memory address. They can be dereferenced using the dereference operator (*) to retrieve the value at the address they are holding. Dereferencing a wild or dangling (or null) pointer will result in undefined behavior and will probably crash your application.

Pointers are both more flexible than references and more dangerous. We’ll continue to explore this in the upcoming lessons.


