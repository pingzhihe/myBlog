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


## 2. Public and private members and access specifiers
### The members of a struct are public by default
**Public members** are members of a calss type that do not have any restrictions on how they can be accessed. Public members can be accessed by anyone(as long as they are in the scope).

By default, all members of a struct are public members.

```cpp
// Member function version
#include <iostream>

struct Date
{
    int year {};
    int month {};
    int day {};

    void print() // defines a member function named print
    {
        std::cout << year << '/' << month << '/' << day;
    }
};

int main()
{
    Date today { 2020, 10, 14 }; // aggregate initialize our struct

    today.day = 16; // member variables accessed using member selection operator (.)
    today.print();  // member functions also accessed using member selection operator (.)

    return 0;
}
```

### The members of a class are private by default
**Private members** are members of a class type that can be only accessed by other members of the same class.
```cpp
#include <iostream>

class Date // now a class instead of a struct
{
    // class members are private by default, can only be accessed by other members
    int m_year {};     // private by default
    int m_month {};    // private by default
    int m_day {};      // private by default

    void print() const // private by default
    {
        // private members can be accessed in member functions
        std::cout << m_year << '/' << m_month << '/' << m_day;
    }
};

int main()
{
    Date today { 2020, 10, 14 }; // compile error: can no longer use aggregate initialization

    // private members can not be accessed by the public
    today.m_day = 16; // compile error: the m_day member is private
    today.print();    // compile error: the print() member function is private

    return 0;
}
```

:::tip
**Best practice**

Classes should generally make member variables private (or protected), and member functions public.

Structs should generally avoid using access specifiers (all members will default to public).
:::

