+++
date = 2024-12-24T10:33:15+09:00
lastmod = ""
draft = false

title = "On Rotations - Introduction"
summary = ""

isCJKLanguage = true

tags = ["mathematics",]
categories = ["on rotations"]

+++

##### 배경

우리는 3차원에 살고있다. 따라서 공간에 대해 기술하는 것은 마찬가지로 3차원에서 이루어진다. 공간에 대해 다루는 모든 필드는 이 3차원에 대한 기술을 필수로 깔게 되는데, 일반적으로 이를 **rigid transformation(강체 변환)** 이라고 한다. 3차원에서 자세를 기술하는건 3차원의 변환을 기술하는 것과 같으며, 로보틱스, 영상기하학, 그래픽스 등 다양한 필드에서 필수적으로 사용된다.

그런데 아쉽게도 회전에 대한 깊은 이해를 제공하는 글이 참 드물다. Euler angle, 로드리게스 공식, quaternion등에 대한 단적인 article은 많지만 총체적인 이해를 제공하는 글들은 드문 것 같다. 이런 기초적인 내용에서 이어지는 Bivector와 quaternion의 연결, axis-angle에서 screw theory까지의 연결이나, 혹은 Lie Group과 Lie Algebra와 이어지는 manifold등에 대해 총체적으로 하나의 흐름 안에서 기술해둔 글을 적어도 나는 찾지 못했다. 따라서 대부분(나 포함) 이런 회전군에 대해 입문하면 $\mathrm{SO3}$ (*Rotation Matrix를 말한다.*)부터 시작해서 장님 코끼리 더듬듯이 조금씩 습득할 수 밖에 없지않나 싶다.

##### 난이도

그런데 회전은 어렵다. 적어도 어떠한 흐름을 가져가지 못한다면 이해하기 어렵다는게 내 생각이다. 여러가지 이유가 있겠지만, 우선 인간은 지표면에 갇혀 2차원에서 이동하기 때문이다. 뇌는 이미 이동에 대해 그릴때 2차원 밖에 그릴수 없게 되어있다. 당장 네비게이션이 아래쪽을 향하고 있을땐 순간적으로 왼쪽 오른쪽 마저 헷갈리는데, 심지어 회전만 3축이면 얼마나 어려울까.

회전을 더 어렵게 만드는 것은 비선형이며, 동시에 인간이 최초로 발견한 비가환(noncommutative) 대수 구조라는 점이다. 결과적으로 수학적 표현도 복잡하고, 연산은 더더욱 복잡하다. 당장 linear interpolation조차 불편해진다.

##### 구조

이 글에선 우선 rigid rotation에만 집중해볼 예정이며, spinor와 같은 내가 잘 알지 못하는 회전까진 다루지 않을 예정이다. Keyword는 다음과 같다.

- $\mathrm{SO3 / SE3} $
- Euler Angle
- Axis-angle
- Quaternion, bivector, rotor
- Screw theory & Dual quaternion
- Lie Group / Lie Algebra
- Manifold & Optimization