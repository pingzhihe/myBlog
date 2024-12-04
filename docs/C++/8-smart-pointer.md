---
slug: smart-pointer
title: 8. Smart pointer
sidebar_position: 8
authors: zhihe
tags: [cpp]
---
# Move Semantics and Smart Pointers

## 1. Introduction to smart pointers and move semantics
In dynamic allocation, the pointer may not be deleted if the function exits early. This can happen via an early return:
```cpp
#include <iostream>

void someFunction()
{
    Resource* ptr = new Resource();

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        return; // the function returns early, and ptr won’t be deleted!

    // do stuff with ptr here

    delete ptr;
}
```
or via a thrown exception:
```cpp
#include <iostream>

void someFunction()
{
    Resource* ptr = new Resource();

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        throw 0; // the function returns early, and ptr won’t be deleted!

    // do stuff with ptr here

    delete ptr;
}
```
One of the best things about classes is that they contain destructors that automatically get executed when an object of the class goes out of scope. A **Smart pointer** is a composition class that is designed to manage dynamically allocated memory and ensure that memory gets deleted when the smart pointer object goes out of scope. 