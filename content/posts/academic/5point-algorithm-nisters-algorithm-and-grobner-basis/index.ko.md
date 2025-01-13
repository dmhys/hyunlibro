+++
date = 2025-01-12T17:21:23+09:00
lastmod = ""
draft = true

title = "5-point algorithm(2) - Nistér's algorithm과 그뢰브너 기저"
summary = ""

isCJKLanguage = true

tags = ["5point algorithm", "essential matrix", "Gröbner basis", "mathematics", "multiple view geometry",]
categories = ["academic"]

+++

## Formulation of 5-point algorithm

### Making coefficient matrix

우선 Nistér의 방법 뿐만이 아니라, 5-point algorithm을 풀려면 기본적으로 필요한 부분까지 유도해보자. 이 뒤에 $x,y,z$ 등을 쓸일이 있어서, 대응되는 point를 $q$로 표현하겠다.

$$
q'^\mathsf{T} E q = 0
$$

$$
q'=\begin{bmatrix} q_1' \newline q_2' \newline q_3' \end{bmatrix} ,
q=\begin{bmatrix} q_1 \newline q_2 \newline q_3 \end{bmatrix}, 
E=\begin{bmatrix}
e_{11} & e_{12} & e_{13} \newline
e_{21} & e_{22} & e_{23} \newline
e_{31} & e_{32} & e_{33}
\end{bmatrix}
$$

일반적으로 CV쪽에서 말하는 DLT알고리즘을 위해 벡터화 가능하다.

$$
\begin{align*}
\tilde q &= \begin{bmatrix}
q_1q_1' & q_2q_1' & q_3q_1' & 
q_1q_2' & q_2q_2' & q_3q_2' & 
q_1q_3' & q_2q_3' & q_3q_3'
\end{bmatrix}^\mathsf{T}
\newline
\tilde E &= \begin{bmatrix}
e_{11} & e_{12} & e_{13} & 
e_{21} & e_{22} & e_{23} & 
e_{31} & e_{32} & e_{33}
\end{bmatrix}^\mathsf{T}
\end{align*}
$$

5개의 point쌍은 각각 하나의 $\tilde q$ 가 되며, 벡터를 stacking하면 다음 결과를 얻게 된다.

$$
M=\begin{bmatrix}
― & q_1 & ― \newline
― & q_2 & ― \newline
― & q_3 & ― \newline
― & q_4 & ― \newline
― & q_5 & ―
\end{bmatrix}_{5\times 9}
$$

$$
M_{5\times 9} \tilde E_{9\times 1} = 0_{5 \times 1}
$$

여기서 계수 행렬 $M$은 당연히 rank가 5이며, 남는 right singular vector 4개의 span이 right nullspace가 된다. 이 벡터를 각 $\tilde X, \tilde Y, \tilde Z, \tilde W$라고 부르자. 그러면 다음 관계가 완성된다.

$$
\tilde E = x \tilde X + y \tilde Y + z \tilde Z + w \tilde W
$$

다만 scale factor로 인해서 $w=1$ 로 두어도 무방하다. 

### Handling polynomials

이 영공간에서 앞서 살펴본 Essential matrix 의 필요 충분조건,

$$
EE^ \mathsf{T} E - {1\over 2} \mathrm{trace}(E E ^ \mathsf{T}) E = 0
$$

를 만족하는 Essential Matrix를 찾아가는 것이 우리의 일이다. 위의 벡터화된 form을 다시 $E$로 되돌리자.

$$
E = x X + y Y + z Z + W
$$

이렇게 표현하면 point쌍의 계수 행렬 분해로 얻어진 $X,Y,Z,W$의 span 중, essential matrix의 필요 충분 조건 구속을 이용하여 $x, y, z$ 의 해를 찾는것, 이것이 5-point 문제라고 볼 수 있다.

위의 식들로 E=0을 전개하자면 아래와 같아진다.

$$
(xX+yY+zZ+W)
\cdot
(xX^ \mathsf{T}+yY^ \mathsf{T}+zZ^ \mathsf{T}+W^ \mathsf{T})
\cdot
(xX+yY+zZ+W)
\newline
-{1\over 2} \mathrm{trace} (
(xX+yY+zZ+W)
\cdot
(xX^ \mathsf{T}+yY^ \mathsf{T}+zZ^ \mathsf{T}+W^ \mathsf{T})
)
\cdot
\newline
(xX+yY+zZ+W) = 0
$$

이 식은 사람이 직접 전개하긴 어려운데, 아래와 같은 모습이 되기 때문이다.

$$
z_{11} y_{22} w_{33} - z_{11} w_{23} y_{32} + z_{11} w_{22} y_{33} -
z_{11} y_{23} w_{32} + w_{11} y_{22} z_{33} + w_{11} z_{22} y_{33} - \newline
w_{11} y_{23} z_{32} - w_{11} z_{23} y_{32} - y_{11} w_{23} z_{32} +
y_{11} z_{22} w_{33} - y_{11} z_{23} w_{32} + y_{11} w_{22} z_{33} + \newline
y_{31} z_{12} w_{23} + y_{31} w_{12} z_{23} - y_{31} z_{22} w_{13} -
y_{31} w_{22} z_{13} + z_{31} y_{12} w_{23} + z_{31} w_{12} y_{23} - \newline
z_{31} y_{22} w_{13} - z_{31} w_{22} y_{13} + w_{31} y_{12} z_{23} +
w_{31} z_{12} y_{23} - w_{31} y_{22} z_{13} - w_{31} z_{22} y_{13} + \newline
z_{21} y_{32} w_{13} - z_{21} y_{12} w_{33} - z_{21} w_{12} y_{33} +
w_{21} y_{32} z_{13} + w_{21} z_{32} y_{13} - w_{21} y_{12} z_{33} - \newline
w_{21} z_{12} y_{33} - y_{21} w_{12} z_{33} - y_{21} z_{12} w_{33} +
y_{21} w_{32} z_{13} + y_{21} z_{32} w_{13} + z_{21} w_{32} y_{13}
$$

블로그 글이 식 전개만으로 2000줄이 되기를 원하지 않으며, 애초에 사람이 직접 전개하기도 상당히 무리가 있기에 생략한다. 이 3개항의 3차식의 결과적인 모노미얼 기저를 Graded Lexical order로 나열해보자. (paper에서는 다른 ordering을 사용한다.)

$$
x^3, x^2y, x^2z, xy^2, xyz, xz^2,
y^3,y^2z,yz^2,z^3,
x^2,xy,xz,
y^2,yz,z^2,
x,y,z,1
$$

따라서 위 20개의 항으로 이루어진 9개의 수식이 나오며, $ 9 \times 20 $ 행렬을 만들 수 있다. 아까 대략적으로라도 전개한 위의 수식은 그런 행렬 성분중 하나였다. $ 9 \times 20 $ 행렬은 나중에 바뀌기도 하는데, 우선 여기서는 맨 처음의 Nistér's algorithm부터 살펴보자.

## Nistér's algorithm

Nistér's algorithm은 세 가지 변종이 있다. $9\times20$ 행렬을 사용하는 2003년 버전, $10\times20$ 행렬을 사용하는 2004년 버전, 그리고 상당히 손으로 푼 앞 두가지 방법과 달리, 추후 Gröbner basis를 사용하여 general하게 된 마지막 버전이 있다.

### 2003 version

우선 2003년 버전에선, 다음과 같은 monomial ordering으로 matrix를 생성한다.

$$
x^3, y^3, x^2y, xy^2, x^2z, x^2, y^2z, y^2, xyz, xy, xz^2, xz, x, yz^2, yz, y, z^3, z^2, z, 1.
$$

이 계수 행렬을 $A$라고 하자. 여기서 Gauss-Jordan elimination을 통해, 다음 sparsity pattern이 된다. 여기서 두 행은 마저 eliminate하지 않아도 된다.

그리고 다음 