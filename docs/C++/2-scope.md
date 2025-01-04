---
slug: scope
title: 2. Scope, Duration, and Linkage
sidebar_position: 2
authors: zhihe
tags: [cpp]
---
# Scope, Duration, and Linkage

##  Scope
A **compound statement** (also called a **block**, or **block statement**) is a group of zero or more statements that is treated by the compiler as if it were a single statement.

blocks can be nested inside other blocks:
```cpp
int add(int x, int y)
{ // block
    return x + y;
} // end block

int main()
{ // outer block

    // multiple statements
    int value {};

    { // inner/nested block
        add(3, 4);
    } // end inner/nested block

    return 0;

} // end outer block
```

**Best Practise**
Keep the nesting level of your functions to 3 or less. If your function has a need for more nested levels, consider refactoring your function into sub-functions.

## User-defined namespaces and the scope resolution operator

main.cpp
```cpp
#include <iostream>

int doSomething(int x, int y); // forward declaration for doSomething

int main()
{
    std::cout << doSomething(4, 3) << '\n'; // which doSomething will we get?
    return 0;
}
```

foo.cpp
```cpp
// This doSomething() adds the value of its parameters
int doSomething(int x, int y)
{
    return x + y;
}
```

goo.cpp
```cpp
// This doSomething() subtracts the value of its parameters
int doSomething(int x, int y)
{
    return x - y;
}
```
If this project contains both `foo.cpp` and `goo.cpp`, which causes a naming collision. As a result, the linker will issue an error:\
``multiple definition of `doSomething(int, int)'; /tmp/ccJz9L9E.o:foo.cpp:(.text+0x0): first defined here``

One way to resolve this would be to rename one of the functions, so the names no longer collide. But this would also require changing the names of all the function calls, which can be a pain, and is subject to error. A better way to avoid collisions is to put your functions into your own namespaces. For this reason the standard library was moved into the `std` namespace.

### Defining your own namespaces
C++ allows us to define our own namespaces via the namespace keyword. Namespaces that you create in your own programs are casually called **user-defined namespaces** (though it would be more accurate to call them **program-defined namespaces**).

- It is convention to name program-defined types starting with a *capital* letter. Using the same convention for program-defined namespaces is consistent (especially when using a qualified name such as `Foo::x`, where `Foo` could be a namespace or a class type).

- It helps prevent naming collisions with other system-provided or library-provided lower-cased names.  

### Accessing a namespace with the scope resolution operator (`::`)

The best way to tell the compiler to look in a particular namespace for an identifier is to use the **scope resolution operator**(`::`). The scope resolution operator tells the compiler that the identifier specified by the right-hand operand should be looked for in the scope of the left-hand operand.

```cpp
#include <iostream>

namespace Foo // define a namespace named Foo
{
    // This doSomething() belongs to namespace Foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}

namespace Goo // define a namespace named Goo
{
    // This doSomething() belongs to namespace Goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}

int main()
{
    std::cout << Foo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace Foo
    std::cout << Goo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace Goo
    return 0;
}
```

Result:

```
7
1
```

### Using the scope resolution operator with no name prefix
The scope resolution operator can also be used in front of an identifier without providing a namespace name (e.g. `::doSomething`). In such a case, the identifier (e.g. `doSomething`) is looked for in the global namespace.

If an identifier inside a namespace is used and **no scope resolution** is provided, the compiler will first try to find a matching declaration in that same namespace. If no matching identifier is found, the compiler will then check each containing namespace in sequence to see if a match is found, with the global namespace being checked **last**.

```cpp
#include <iostream>

void print() // this print() lives in the global namespace
{
	std::cout << " there\n";
}

namespace Foo
{
	void print() // this print() lives in the Foo namespace
	{
		std::cout << "Hello";
	}

	void printHelloThere()
	{
		print();   // calls print() in Foo namespace
		::print(); // calls print() in global namespace
	}
}

int main()
{
	Foo::printHelloThere();

	return 0;
}
```

### Forward declaration of content in namespaces

add.h
```cpp
#ifndef ADD_H
#define ADD_H

namespace BasicMath
{
    // function add() is part of namespace BasicMath
    int add(int x, int y);
}

#endif
```

add.cpp
```cpp
#include "add.h"

namespace BasicMath
{
    // define the function add() inside namespace BasicMath
    int add(int x, int y)
    {
        return x + y;
    }
}
```
main.cpp
```cpp
#include "add.h" // for BasicMath::add()

#include <iostream>

int main()
{
    std::cout << BasicMath::add(4, 3) << '\n';

    return 0;
}
```

### Multiple namespace blocks are allowed
circle.h:
```cpp
#ifndef CIRCLE_H
#define CIRCLE_H

namespace BasicMath
{
    constexpr double pi{ 3.14 };
}

#endif
```
growth.h:
```cpp
#ifndef GROWTH_H
#define GROWTH_H

namespace BasicMath
{
    // the constant e is also part of namespace BasicMath
    constexpr double e{ 2.7 };
}

#endif
```
main.cpp:
```cpp
#include "circle.h" // for BasicMath::pi
#include "growth.h" // for BasicMath::e

#include <iostream>

int main()
{
    std::cout << BasicMath::pi << '\n';
    std::cout << BasicMath::e << '\n';

    return 0;
}
```
This works exactly as you would expect:
```
3.14
2.7
```

The standard library makes extensive use of this feature, as each standard library header file contains its declarations inside a ``namespace std`` block contained within that header file. Otherwise the entire standard library would have to be defined in a single header file!

### Nested namespaces
Namespaces can be nested inside other namespaces. For example:
```cpp
#include <iostream>

namespace Foo
{
    namespace Goo // Goo is a namespace inside the Foo namespace
    {
        int add(int x, int y)
        {
            return x + y;
        }
    }
}

int main()
{
    std::cout << Foo::Goo::add(1, 2) << '\n';
    return 0;
}
```
Note that because namespace `Goo` is inside of namespace `Foo`, we access `add` as `Foo::Goo::add`.

Since C++17, nested namespaces can also be declared this way:
```cpp
#include <iostream>

namespace Foo::Goo // Goo is a namespace inside the Foo namespace (C++17 style)
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    std::cout << Foo::Goo::add(1, 2) << '\n';
    return 0;
}
```
### Namespace aliases
Because typing the qualified name of a variable or function inside a nested namespace can be painful, C++ allows you to create namespace aliases, which allow us to temporarily shorten a long sequence of namespaces into something shorter:

```cpp
#include <iostream>

namespace Foo::Goo
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    namespace Active = Foo::Goo; // active now refers to Foo::Goo

    std::cout << Active::add(1, 2) << '\n'; // This is really Foo::Goo::add()

    return 0;
} // The Active alias ends here
```

## Variables

### Local variables
- Local variables have **block scope**, which means they are in scope from their point of definition to the end of the block they are defined within.
-  function parameters can be considered to be part of the scope of the **function body block**.
- Variable names must be unique within a given scope, otherwise any reference to the name will be ambiguous.

```cpp
void someFunction(int x)
{
    int x{}; // compilation failure due to name collision with function parameter
}

int main()
{
    return 0;
}
```

### Global variables
By convention, global variables are declared at the top of a file, below the includes, in the global namespace. \
Here is an example:
```cpp
#include <iostream>

namespace Foo // Foo is defined in the global scope
{
    int g_x {}; // g_x is now inside the Foo namespace, but is still a global variable
}

void doSomething()
{
    // global variables can be seen and used everywhere in the file
    Foo::g_x = 3;
    std::cout << Foo::g_x << '\n';
}

int main()
{
    doSomething();
    std::cout << Foo::g_x << '\n';

    // global variables can be seen and used everywhere in the file
    Foo::g_x = 5;
    std::cout << Foo::g_x << '\n';

    return 0;
}
```
**Best Practice**
- Prefer defining global variables inside a namespace rather than in the global namespace.
- Consider using a “g” or “g_” prefix when naming global variables (especially those defined in the global namespace), to help differentiate them from local variables and function parameters.


Each block defines its own scope region. So what happens when we have a variable inside a nested block that has the same name as a variable in an outer block? When this happens, the nested variable “hides” the outer variable in areas where they are both in scope. This is called **name hiding** or **shadowing**.

Avoid variable shadowing!!!

### Internal and external linkage
Global variables with internal linkage are sometimes called internal variables.

To make a non-constant global variable internal, we use the `static` keyword.

```cpp
#include <iostream>

static int g_x{}; // non-constant globals have external linkage by default, but can be given internal linkage via the static keyword

const int g_y{ 1 }; // const globals have internal linkage by default
constexpr int g_z{ 2 }; // constexpr globals have internal linkage by default

int main()
{
    std::cout << g_x << ' ' << g_y << ' ' << g_z << '\n';
    return 0;
}
```
**Functions have external linkage by default**
In order to call a function defined in another file, you must place a `forward declaration` for the function in any other files wishing to use the function. 

- Global variables with external linkage are sometimes called **external variables**. To make a global variable external (and thus accessible by other files), we can use the `extern` keyword to do so
- To actually use an external global variable that has been defined in another file, you also must place a `forward declaration` for the global variable in any other files wishing to use the variable. For variables, creating a forward declaration is also done via the `extern` keyword (with no initialization value).

a.cpp:
```cpp
// global variable definitions
int g_x { 2 }; // non-constant globals have external linkage by default
extern const int g_y { 3 }; // this extern gives g_y external linkage
```
main.cpp:
```cpp
#include <iostream>

extern int g_x; // this extern is a forward declaration of a variable named g_x that is defined somewhere else
extern const int g_y; // this extern is a forward declaration of a const variable named g_y that is defined somewhere else

int main()
{
    std::cout << g_x << ' ' << g_y << '\n'; // prints 2 3

    return 0;
}
```

Although constexpr variables can be given external linkage via the `extern` keyword, they can not be forward declared as constexpr. This is because the compiler needs to know the value of the constexpr variable (at compile time). If that value is defined in some other file, the compiler has no visibility on what value was defined in that other file.

However, you can forward declare a constexpr variable as const, which the compiler will treat as a runtime const. This isn’t particularly useful.

**Quick Summary**
```cpp
// Forward declarations:
extern int g_y;                // forward declaration for non-constant global variable
extern const int g_y;          // forward declaration for const global variable
extern constexpr int g_y;      // not allowed: constexpr variables can't be forward declared

// External global variable definitions:
int g_x;                       // defines non-initialized external global variable (zero initialized by default)
extern const int g_x{ 1 };     // defines initialized const external global variable
extern constexpr int g_x{ 2 }; // defines initialized constexpr external global variable
```

### (non-const) global variables are evil
By far the biggest reason non-const global variables are dangerous is because their values can be changed by any function that is called, and there is no easy way for the programmer to know that this will happen.
