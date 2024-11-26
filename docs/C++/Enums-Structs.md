---
slug: enums-structs
title: 5. Enums and Structs
sidebar_position: 5
authors: zhihe
tags: [cpp]
---
# Enums and Structs

We can define a new name for an existing type.
```cpp
#include <iostream>

using Length = int; // define a type alias with identifier 'length'

int main()
{
    Length x { 5 }; // we can use 'length' here since we defined it above
    std::cout << x << '\n';

    return 0;
}
```

C++ can allow us to crearte entirely new, custom types for use in our programs! Such types are often called **user-defined types** or **programmer-defined types**.
C++ has two different categories of compound types that can be used to create program-defined types:
- Enumerate types (including unscoped and scoped enumerations)
- Class types (including structs, classes and unions)

### Define program-defined types
Just like type aliases, program-defined types must be defined before they can be used. The defination for a program-defined type is called a **type-defination**.

Example:
```cpp
// Define a program-defined type named Fraction so the compiler understands what a Fraction is
// (we'll explain what a struct is and how to use them later in this chapter)
// This only defines what a Fraction type looks like, it doesn't create one
struct Fraction
{
	int numerator {};
	int denominator {};
};

// Now we can make use of our Fraction type
int main()
{
	Fraction f { 3, 4 }; // this actually instantiates a Fraction object named f

	return 0;
}
```
In this example, we're using the `struct` keyword to define a new program-defined type named `Fraction`(in the global scope, can be used in anywhere in rest of this file).

## Naming program-defined types
By convention, program-defined types are named starting with a captial letter and don't use a suffifx(e.g. `Fraction`, not `fraction`, `fraction_t`, or `Fraction_t`), and then an optional initializer. Because C++ is case-sensitive, there is no naming conflict here!

### Using program-defined types throuthout a multi-file program

:::tip

**Best practice**:
- A program-defined type used in only one code file should be defined in that code file as close to the first point of use as possible.
- A program-defined type used in multiple code files should be defined in a *header file* with the same name as the program-defined type and then `#included` into each code file as needed.

:::

Example:
`Fraction.h`
```cpp
#ifndef FRACTION_H
#define FRACTION_H

// Define a new type named Fraction
// This only defines what a Fraction looks like, it doesn't create one
// Note that this is a full definition, not a forward declaration
struct Fraction
{
	int numerator {};
	int denominator {};
};

#endif
```
`Fraction.cpp`
```cpp
#include "Fraction.h" // include our Fraction definition in this code file

// Now we can make use of our Fraction type
int main()
{
	Fraction f{ 3, 4 }; // this actually creates a Fraction object named f

	return 0;
}
```

## Enumerations
An **enumeration** is a compound data type whose values are restricted to a set of named symbolic constants (called **enumerators**).

Unscoped enumerations are defined via the `enum` keyword.
```cpp
// Define a new unscoped enumeration named Color
enum Color
{
    // Here are the enumerators
    // These symbolic constants define all the possible values this type can hold
    // Each enumerator is separated by a comma, not a semicolon
    red,
    green,
    blue, // trailing comma optional but recommended
}; // the enum definition must end with a semicolon

int main()
{
    // Define a few variables of enumerated type Color
    Color apple { red };   // my apple is red
    Color shirt { green }; // my shirt is green
    Color cup { blue };    // my cup is blue

    Color socks { white }; // error: white is not an enumerator of Color
    Color hat { 2 };       // error: 2 is not an enumerator of Color

    return 0;
}
```

### Scoped enumerations
Scoped enumerations won't convert to integers implicitly, and the enumerators *only* placed into the scope region of the enumeration.
```cpp
#include <iostream>
int main()
{
    enum class Color // "enum class" defines this as a scoped enumeration rather than an unscoped enumeration
    {
        red, // red is considered part of Color's scope region
        blue,
    };

    enum class Fruit
    {
        banana, // banana is considered part of Fruit's scope region
        apple,
    };

    Color color { Color::red }; // note: red is not directly accessible, we have to use Color::red
    Fruit fruit { Fruit::banana }; // note: banana is not directly accessible, we have to use Fruit::banana

    if (color == fruit) // compile error: the compiler doesn't know how to compare different types Color and Fruit
        std::cout << "color and fruit are equal\n";
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```
### Scoped enmuneration define their own scope regions
```cpp
#include <iostream>

int main()
{
    enum class Color // "enum class" defines this as a scoped enum rather than an unscoped enum
    {
        red, // red is considered part of Color's scope region
        blue,
    };

    std::cout << red << '\n';        // compile error: red not defined in this scope region
    std::cout << Color::red << '\n'; // compile error: std::cout doesn't know how to print this (will not implicitly convert to int)

    Color color { Color::blue }; // okay

    return 0;
}
```
:::tip
**Best practice**:
Favor scoped enumerations over unscoped enumerations unless there’s a compelling reason to do otherwise.
:::

## Structs, members and member selection
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe {};

    joe.age = 32;  // use member selection operator (.) to select the age member of variable joe

    std::cout << joe.age << '\n'; // print joe's age

    return 0;
}
```

More like normal variables, data members are not initialized by default. Consider the following example:
```cpp
#include <iostream>

struct Employee
{
    int id; // note: no initializer here
    int age;
    double wage;
};

int main()
{
    Employee joe; // note: no initializer here either
    std::cout << joe.id << '\n';

    return 0;
}
```
We will get a undefined behavior as the value of `joe.id` is not initialized.


### aggregate data type
an **aggregate data type** is any type that can contain multiple data members. Some types. Some types of aggregates allow members to have different types (e.g. structs), while others require that all members must be of a single type (e.g. arrays).

### Aggregate initialization of a struct
A struct have multiple members, When we define an object with a struct type, we need some way to initialize multiple members at initialization time.

There are 2 primary forms of aggregate initialization:
**copy-list initialization** and **list initialization**, list initialization is preferred.
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee frank = { 1, 32, 60000.0 }; // copy-list initialization using braced list
    Employee joe { 2, 28, 45000.0 };     // list initialization using braced list (preferred)

    return 0;
}
```

### Overloading `operator<<` to print a struct
```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

std::ostream& operator<<(std::ostream& out, const Employee& e)
{
    out << e.id << ' ' << e.age << ' ' << e.wage;
    return out;
}

int main()
{
    Employee joe { 2, 28 }; // joe.wage will be value-initialized to 0.0
    std::cout << joe << '\n';

    return 0;
}
```
This prints:
```
2 28 0
```
### Const structs
Variables of a struct type can be const (or constexpr), and just like all const variables, they must be initialized.

```cpp
struct Rectangle
{
    double length {};
    double width {};
};

int main()
{
    const Rectangle unit { 1.0, 1.0 };
    const Rectangle zero { }; // value-initialize all members

    return 0;
}
```
### Designated initializers `C++20`
```cpp
struct Foo
{
    int a {};
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // f.a = 1, f.c = 3

    return 0;
}
```
If update this struct definition to add a new member that is not the last member:
```cpp
struct Foo
{
    int a {};
    int b {}; // just added
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // now, f.a = 1, f.b = 3, f.c = 0

    return 0;
}
```
:::warning
All initialization values have shifted, and worse, the compiler may not detect this as an error!
:::

To help avoid this, `C++20` adds a new way to initialize struct members called **designated initializers**. Designated initializers allow you to explicitly define which initialization values map to which members. The members can be initialized using list or copy initialization, and must be initialized in the same order in which they are declared in the struct, otherwise a warning or error will result. Members not designated an initializer will be value initialized.
```cpp
struct Foo
{
    int a{ };
    int b{ };
    int c{ };
};

int main()
{
    Foo f1{ .a{ 1 }, .c{ 3 } }; // ok: f1.a = 1, f1.b = 0 (value initialized), f1.c = 3
    Foo f2{ .a = 1, .c = 3 };   // ok: f2.a = 1, f2.b = 0 (value initialized), f2.c = 3
    Foo f3{ .b{ 2 }, .a{ 1 } }; // error: initialization order does not match order of declaration in struct

    return 0;
}
```
:::tip
**Best practice**:

When adding a new member to an aggregate, it’s safest to add it to the bottom of the definition list so the initializers for other members don’t shift.
:::

### Assignment with an initializer list

As shown in the prior context, we can assign values to members of structs individually:
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };

    joe.age  = 33;      // Joe had a birthday
    joe.wage = 66000.0; // and got a raise

    return 0;
}
```
We can also assign values to structs using an initializer list (which does memberwise assignment):
```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };
    joe = { joe.id, 33, 66000.0 }; // Joe had a birthday and got a raise

    return 0;
}
```