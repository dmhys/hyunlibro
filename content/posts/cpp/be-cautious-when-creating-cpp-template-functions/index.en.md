+++
date = 2023-01-16T12:49:00+09:00
draft = false

title = "Be cautious when creating c++ template functions"
summary = "When creating C++ template functions, the type-specified version must always be declared before the template version."

tags = ["template meta programming"]
categories = ["c++"]
+++

When creating C++ template functions, the type-specified version must always be declared before the template version. Which means,

```cpp
#include <vector>
#include <iostream>
using namespace std;
template<typename T>
void foo(const std::vector<T> & data)
{
    cout<<"foo template"<<endl;
    std::vector<int> data2(data.begin(),data.end());
    foo(data2);
}
void foo(const std::vector<int> & data)
{
    cout<<"foo int"<<endl;
}
int main()
{
    std::vector dvec{0.0,1.0};
    foo(dvec);
    return 0;
}
```

Declaring and using it this way (calling foo<double> results in the same outcome) produces the following result:

```bash
...
foo template
foo template
foo template
foo template
foo template
foo template
Segmentation fault (core dumped)
```

This occurs because there is no function declared before the template for the compiler to find the type-specified version. Since templates inherently contain their own implementation, declarations of other functions must come first. By simply changing the order, the following code will execute correctly.

```cpp
#include <vector>
#include <iostream>
using namespace std;
void foo(const std::vector<int> & data)
{
    cout<<"foo int"<<endl;
}
template<typename T>
void foo(const std::vector<T> & data)
{
    cout<<"foo template"<<endl;
    std::vector<int> data2(data.begin(),data.end());
    foo(data2);
}

int main()
{
    std::vector dvec{0.0,1.0};
    foo(dvec);
    return 0;
}
```

###### Result

```cpp
foo template
foo int
```