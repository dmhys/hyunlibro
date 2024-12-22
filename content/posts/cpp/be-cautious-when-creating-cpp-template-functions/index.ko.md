+++
date = 2023-01-16T12:49:00+09:00
draft = false

title = "C++ template 함수 만들 때 주의점 ( 무한루프 )"
summary = "C++ Template 함수를 만들 땐 언제나 type specified version이 template version위에 선언되어야 한다."

isCJKLanguage = true

tags = ["template meta programming"]
categories = ["c++"]

+++

C++ Template 함수를 만들 땐 언제나 type specified version이 template version위에 선언되어야 한다. 즉,

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

이렇게 선언하고 사용하면(`foo<double>`로 호출해도 같다.) 다음 결과가 나온다.

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

이는 템플릿보다 먼저 선언된 함수가 없어서 템플릿이 type specified 버전을 찾아가지 못하는 현상이다. template은 그 자체로 구현부를 가지기 때문에, 다른 함수들의 선언이 먼저 되어야한다. 간단한 순서 변경으로 다음 코드가 돌게된다.

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

###### 결과

```cpp
foo template
foo int
```