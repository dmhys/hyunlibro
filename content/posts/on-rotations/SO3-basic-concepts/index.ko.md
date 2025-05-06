+++
date = 2024-12-24T17:33:15+09:00
lastmod = 2025-03-21T14:11:41+09:00
draft = false

title = "SO3(1) - Basic concepts"
summary = ""

isCJKLanguage = true

tags = ["mathematics", "rotation", "SO3",]
categories = ["on rotations"]

+++

## Toy Example

2D Toy example로 2차원에서 돌아다니는 로봇의 위치에 대해 기술해본다고 하자. 여기서의 기술은 $pos_x,$ $pos_y,$ $\theta$ 3자유도로 이루어질 수 있다. 이제 이 로봇의 좌표에서 바라본 물체의 위치를 $x_{local} ,$ $y_{local}$ 로 표현하면 **로봇의 pose를 감안한** 위치가 된다. (첨자를 많이 쓰기 싫어서 $x$, $y$ 등으로 표현하였다.) 이 로봇이 바라본 위치를 로봇의 pose를 나타낸 글로벌 좌표계에서 본다고 하면,

$$
x_{global} = \cos \theta \ x_{local} - \sin \theta \ y_{local} + pos_x
\newline
y_{global} = \sin \theta \ x_{local} - \cos \theta \ y_{local} + pos_y
$$

익숙한 사람은 행렬 연산으로 나타내야한다고 생각을 했을 수 있다. 맞다. 이를 다음과 같이 행렬로 나타내면 훨씬 보기 편해진다.

$$
\begin{bmatrix} \ x_{global} \ \newline y_{global} \end{bmatrix} = 
\begin{bmatrix} \cos \theta & -\sin \theta \newline  \sin \theta & \cos \theta \end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \end{bmatrix} +
\begin{bmatrix} \ pos_x \ \newline pos_y \end{bmatrix}
$$

$x$, $y$ 를 $p$ 등으로 묶으면 다음과 같이 표현 가능하다.

$$
p_{global} = R_\theta p_{local} + pos
$$

&nbsp;

여기서 Rotation term과 translation term을 각각 $R$, $t$ 로 표현하면,

$$
\begin{align*}
\begin{bmatrix} \ x_{global} \ \newline y_{global} \newline 1 \end{bmatrix}
& = \begin{bmatrix} \cos \theta & -\sin \theta & pos_x \newline  \sin \theta & \cos \theta & pos_y \newline 0 & 0 & 1\end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \newline  1\end{bmatrix}
\newline
\newline
& =\begin{bmatrix} R_{2 \times 2} & t_{2 \times 1} \newline 0 & 1 \end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \newline  1\end{bmatrix}
\end{align*}
$$

위와 같이 어떠한 계에서 기술한 로봇의 위치는, 로봇에서 그 계로의 변환 행렬로 나타낼 수 있다. 결국 어떤 pose가 나타내는 바는 **local to global** 변환과 동일하다.

##### 3차원으로 확장

당연히 여기에 차원을 하나 추가하면 3차원이 된다.

$$
\begin{bmatrix} \ x_{global} \ \newline y_{global} \newline z_{global} \newline 1\end{bmatrix} = 
\begin{bmatrix} R_{3 \times 3} & t_{3 \times 1} \newline 0 & 1 \end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \newline z_{local} \newline  1\end{bmatrix}
$$

여기서 $R$ 은 회전을 나타내는 3차원 $3\times 3$ 행렬이고, $t$ 는 위치를 나타내는 벡터($3 \times 1$) 가 된다. 

## 회전과 특수직교군

자, 이제 이 회전을 나타내기 위한 조건을 상정해보자.

- 회전은 물체의 크기를 바꿀 수 없다.
- 회전은 각 축들 사이의 각도를 유지한다.(공간을 꼬지 않는다.)
- 회전을 한 번 하고, 다시 **반대 방향**으로 회전하면 동일해진다.

여기서 사실 중요한 두 개의 조건은 물체의 크기를 바꿀 수 없다는 점과 각도를 유지한다는 점이다. 즉, **어떠한 변환을 했을 때 크기가 바뀌지 않으며 공간의 꼬임이 없어야한다.** 이를 조금 수학적으로 표현해보자면, 어떤 변환이 모든 벡터 간의 내적을 보존한다 라고 생각해 볼 수 있다. 

$$
(R\mathrm v)\cdot(R \mathrm w) = \mathrm v \cdot \mathrm w
$$

즉,

$$
(R\mathrm v)^T (R \mathrm w) = \mathrm v ^T R^T R \mathrm w = \mathrm v^T \mathrm w
$$

여기서 다음 결론이 도출된다.

$$
R^T R = I
$$

다만 여기서 $R$ 의 determinant엔 두 가지의 선택지가 있다. 우선 transpose가 determinant를 바꾸지 않으며, 우변의 determinant가 1이기 때문에 결국  $R$ 의 determinant 의 경우 $\pm 1$ 외엔 선택지가 없다. 여기서 determinant가 음수일 경우엔 orientation reversing 이라 부르며, 오른손 좌표계를 왼손좌표계로 만드는 카이랄성(chirality)을 가지고 있다고 표현가능하다. 이 $R^T R = I$ 조건을 가진 실수 행렬을 **직교 행렬*orthogonal matrix***이라 부르며, 이 중 orientation을 보존하는 determinant가 1인 행렬을 **특수 직교행렬*special orthogonal matrix***이라 부른다.

즉, 모든 회전 행렬은 특수 직교행렬이며, transpose가 역방향 회전을 뜻하며, $R^T = R^{-1}$ 인 성질을 갖는다. 그리고 이 특수 직교행렬로 이루어진 그룹을 **특수직교군*special orthogonal group***이라고 부르며, 이를 다음과 같이 표현한다.

$$
\mathrm {SO}(n)
$$

## Parameterization

그러나 생각해보자. 우리에게 익숙한 **선형 대수학은 3차원의 회전보다 늦게 개발되었다.** 맨 처음 toy example로 돌아가보자면, 우리가 어디 처음부터 $R$을 정의하고 시작했던가. position과 rotation에 대해 정의하고 시작했다. 그런데, 2차원과 다르게 우리는 3차원 위에 살고 있다. 3차원에서 회전에 대해 설명하려면 2차원과는 다르게 더 이상 $\theta$ 하나만으로는 부족하다.

그런데 이러면 수식을 어떻게 작성해야하는가? 회전은 더이상 선형적이지 않기 때문에 문제가 생긴다. 이동의 경우 $x$이동 후 $y$이동과, $y$이동 후 $x$이동은 결과가 같다. **그렇지만 $x$축 회전 후 $y$축 회전과, $y$축 회전 후 $x$축 회전은 결과가 다르다.** 따라서 숫자를 어떤 순서로 적용시키는 지에 따라서 결과가 다르다. 그런데 우리는 회전할 축이 세 개가 있지 않은가? (사실 회전축은 일종의 착각이기도 하다. 2차원에선 회전이 있지만 회전축은 2차원상에 존재할 수 없지않은가? 이에 대해선 나중에 살펴보자.) 우선 각 축 세 개에 대한 회전을 각각 정의해보자.

$$
R_x(\theta) = \begin{bmatrix}
1 & 0 & 0 \newline
0 & \cos\theta & -\sin\theta \newline
0 & \sin\theta & \cos\theta
\end{bmatrix}
$$

이렇게 하면, x축은 그대로 있는 채 y와 z성분들이 변하게 된다. 마찬가지로 마저 둘을 정의 가능하다.

$$
R_y(\theta) = \begin{bmatrix}
\cos\theta & 0 & \sin\theta \newline
0 & 1 & 0 \newline
-\sin\theta & 0 & \cos\theta
\end{bmatrix},
R_z(\theta) = \begin{bmatrix}
\cos\theta & -\sin\theta & 0 \newline
\sin\theta & \cos\theta & 0 \newline
0 & 0 & 1
\end{bmatrix}
$$

여기서 y는 방향이 다르기 때문에 $\theta$가 반대방향이 된다. (각 축의 입장에서 오른손 법칙으로 생각해보자.) 일종의 어떤 꼬임으로 인한 것을 보상해주기 위한 것이라는 직관이 드는데, 이에 대해 정확한 키워드를 몰라 찾지 못하고 있다. 누군가 부디 설명해주면 좋겠다. (각 축의 기술 순서로 인해서 그런 것이긴 하다. 다만 머리속에 있는 이 꼬임이라는 키워드가 해소되지가 않는다.)

원래 트랙으로 돌아와서, 그러면 우리는 다음으로 회전을 정의 가능하다.

$$
R = R_x(\phi) R_y(\theta) R_z(\psi)
$$

이렇게 세 개의 숫자로 정의하였다. 다시 수식으로 바꾼다면 행렬 없이 정의가 될 것이다. 이렇게 일반적으로 어느정도 정의할 수 있고, 이제 다음 편에서 다른 기본적인 parameterization들에 대해서 다시 살펴보도록 하자.