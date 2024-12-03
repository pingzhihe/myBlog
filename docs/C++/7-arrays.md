---
slug: arrays
title: 7. Arrays
sidebar_position: 7
authors: zhihe
tags: [cpp]
---
# Introduction to containers and arrays
An array is a container data type that stores a sequence of values contiguously (meaning each element is placed in an adjacent memory location, with no gaps). Arrays allow fast, direct access to any element. They are conceptually simple and easy to use, making them the first choice when we need to create and work with a set of related values.

## 1. Introduction to std::vector and list constructors

### Introduction to `std::vector`
`std::vector` is one of the container classes in the C++ standard library that implements an array. `std::vector` is defined in the `<vector>` header as a class template, with a templete type parameter that defines the type of the elements. Thus, `std::vector<int>` declares a `std::vector` whose elements are of type `int`.

```cpp
#include <vector>

int main()
{
	// Value initialization (uses default constructor)
	std::vector<int> empty{}; // vector containing 0 int elements

	return 0;
}
```

### Initialization a `std::vector` with a list of values
Since the goal of a container is to manage a set of related values, most often we will want to initialize our container with those values. We can do this by using list initialization with the specific initialization values we want.
```cpp
#include <vector>

int main()
{
	// List construction (uses list constructor)
	std::vector<int> primes{ 2, 3, 5, 7 };          // vector containing 4 int elements with values 2, 3, 5, and 7
	std::vector vowels { 'a', 'e', 'i', 'o', 'u' }; // vector containing 5 char elements with values 'a', 'e', 'i', 'o', and 'u'.  Uses CTAD (C++17) to deduce element type char (preferred).

	return 0;
}
```

### Accessing array elements using the subscript operator (operator[])
```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector primes { 2, 3, 5, 7, 11 }; // hold the first 5 prime numbers (as int)

    std::cout << "The first prime number is: " << primes[0] << '\n';
    std::cout << "The second prime number is: " << primes[1] << '\n';
    std::cout << "The sum of the first 5 primes is: " << primes[0] + primes[1] + primes[2] + primes[3] + primes[4] << '\n';

    return 0;
}
```

### Subscript out of bounds
`operator[]` does not do any kind of **bound checking**, meaning it does not check to see whether the index is within the bounds of 0 to N-1 (inclusive). Passing an invaild index to `operator[]` will result in undefined behavior.

### Arrays are continuous in memory
One of the defining characteristics of arrays is that the elements are stored contiguously in memory. This means that the elements are placed in adjacent memory locations, with no gaps between them. This property allows for efficient access to the elements, as we can calculate the memory location of any element by adding its index to the memory location of the first element.

```cpp
#include <vector>
#include <iostream>

int main(){
    std::vector primes {2,3,5,7,11};
    std::cout << "An integer has " << sizeof(int) << " bytes\n";
    std::cout << &primes[0] << '\n';
    std::cout << &primes[1] << '\n';
    std::cout << &primes[2] << '\n';
}
```
Outputs:
```
An integer has 4 bytes
0x55dbb3d13eb0
0x55dbb3d13eb4
0x55dbb3d13eb8
```

### Constructing a `std::vector` of a specific length
```cpp
std::vector<int> data( 10 ); // vector containing 10 int elements, value-initialized to 0
```

### Getting the length of a `std::vector` using the `size()` member function or `std::size()`
We can ask a container class object for its length using the `size()` member function (which returns the length as unsigned `size_type`).
```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector prime { 2, 3, 5, 7, 11 };
    std::cout << "length: " << prime.size() << '\n'; // returns length as type `size_type` (alias for `std::size_t`)
    return 0;
}
```
This prints:
```
length: 5
```
Unlike `std::string` and `std::string_view`, which have both a `length()` and a `size()` member function,
`std::vector` only has a `size()`. 

In C++17, we can also use the `std::size` non-member function (which for container classes just calls the `size()` member function)
```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector prime { 2, 3, 5, 7, 11 };
    std::cout << "length: " << std::size(prime); // C++17, returns length as type `size_type` (alias for `std::size_t`)

    return 0;
}
```
:::note
Because `std::size()` can also be used on non-decayed C-style arrays, 
this method is sometimes favored over the using the `size()` member function
(particularly when writing function templates that can accept either a container class or non-decayed C-style array argument). 
:::

### Accessing array elements using `operator[]` does no bounding checking
```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector prime{ 2, 3, 5, 7, 11 };

    std::cout << prime[3];  // print the value of element with index 3 (7)
    std::cout << prime[9]; // invalid index (undefined behavior)

    return 0;
}
```

### Accessing array elements using the `at()` member function does runtime bounds checking
```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector prime{ 2, 3, 5, 7, 11 };

    std::cout << prime.at(3); // print the value of element with index 3
    std::cout << prime.at(9); // invalid index (throws exception)

    return 0;
}
```

## 2.Passing/Returning `std::vector` to functions
```cpp
#include <iostream>
#include <vector>

void passByRef(const std::vector<int>& arr) // we must explicitly specify <int> here
{
    std::cout << arr[0] << '\n';
}

int main()
{
    std::vector primes{ 2, 3, 5, 7, 11 };
    passByRef(primes);

    return 0;
}
```

### Passing `std::vector` of different element types
We can create a function template that uses the same template parameter declaration:

```cpp
#include <iostream>
#include <vector>

template <typename T>
void passByRef(const std::vector<T>& arr)
{
    std::cout << arr[0] << '\n';
}

int main()
{
    std::vector primes{ 2, 3, 5, 7, 11 };
    passByRef(primes); // ok: compiler will instantiate passByRef(const std::vector<int>&)

    std::vector dbl{ 1.1, 2.2, 3.3 };
    passByRef(dbl);    // ok: compiler will instantiate passByRef(const std::vector<double>&)

    return 0;
}
```

### Passing a `std::vector` using a generic template or abbreviated function template
We can also create a function template that will accept any type of object:
```cpp
#include <iostream>
#include <vector>

template <typename T>
void passByRef(const T& arr) // will accept any type of object that has an overloaded operator[]
{
    std::cout << arr[0] << '\n';
}

int main()
{
    std::vector primes{ 2, 3, 5, 7, 11 };
    passByRef(primes); // ok: compiler will instantiate passByRef(const std::vector<int>&)

    std::vector dbl{ 1.1, 2.2, 3.3 };
    passByRef(dbl);    // ok: compiler will instantiate passByRef(const std::vector<double>&)

    return 0;
}
```
In C++20, we can use an abbreviated function template (via an `auto` parameter) to do the same thing:
```cpp
#include <iostream>
#include <vector>

void passByRef(const auto& arr) // abbreviated function template
{
    std::cout << arr[0] << '\n';
}

int main()
{
    std::vector primes{ 2, 3, 5, 7, 11 };
    passByRef(primes); // ok: compiler will instantiate passByRef(const std::vector<int>&)

    std::vector dbl{ 1.1, 2.2, 3.3 };
    passByRef(dbl);    // ok: compiler will instantiate passByRef(const std::vector<double>&)

    return 0;
}
```