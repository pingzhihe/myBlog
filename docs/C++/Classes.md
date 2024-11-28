---
slug: classes
title: 6. Classes
sidebar_position: 6
authors: zhihe
tags: [cpp]
---
# Introduction to Classes

## 1. Defining a class
```cpp
#include <iostream>

class Date       // we changed struct to class
{
public:          // and added this line, which is called an access specifier
    int m_day{}; // and added "m_" prefixes to each of the member names
    int m_month{};
    int m_year{};
};

void printDate(const Date& date)
{
    std::cout << date.m_day << '/' << date.m_month << '/' << date.m_year;
}

int main()
{
    Date date{ 4, 10, 21 };
    printDate(date);

    return 0;
}
```

In programming, we represent properties with variables, and actions with functions. It sure would be nice if there were some way to define our properties and actions together, as a single package. (Intuitaion of Class design)

## 2. Member functions
Functions that belong to a class type are called **member functions**.

