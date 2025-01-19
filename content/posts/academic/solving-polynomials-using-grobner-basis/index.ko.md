+++
date = 2025-01-19T17:00:50+09:00
lastmod = ""
draft = false

title = "다항식 해법을 위한 그뢰브너 기저"
summary = ""

isCJKLanguage = true

tags = ["algebraic geometry", "gröbner basis", "mathematics", "symbolic progamming",]
categories = ["academic"]

references = [
    {title = "Using Algebraic Geometry", authors = "D. A. Cox, J.Little, D. O'Shea", doi = "10.1007/b138611"},
    {title = "Lecture Notes - Analytic Symbolic Computation", link = "https://homepages.math.uic.edu/~jan/mcs563s14/"},
    {title = "Gröbner Basis (Buchberger's Algorithm) 視覺化", link = "https://youtu.be/XvblHJQvhQg"},
]

+++

대수기하학(algebraic geometry)은 기하적인 물체를 대수적으로 정의하여(대수다양체), 대수적 방법론 위에서 기하의 성질에 대해 탐험하는 학문이다. 일반적으로 어떤 현상에 대한 모델링을 하다보면 결국 미분 방정식, 혹은 방정식으로 나타낼 수 밖에 없다. 일반적으론 공대 분야에선 미분 방정식으로 모델링 할 일이 많지만, 다항식 형태로 모델링하게 되면 대수기하학의 영역으로 넘어오게 된다. Inverse kinematics문제가 당장 대표적인 예시라고 할 수 있고, 내가 대수기하학 쪽에 발을 살짝이라도 들이게 된 동기인 영상기하학도 그 예시가 된다. 그 외에 암호학 쪽도 다항식을 다룰 일이 상대적으로 많다는 것 같고, CAD같은 것도 자유곡면을 모델링 한다면 결국 대수적으로 풀어야 한다.

하지만 정말 소수의 공돌이가 아닌 이상, 군/환/체와 같은 대수학 개념과 친숙하진 않을 것이다. 나 또한 그랬다. 결국 논문에서 "이런 방법을 썼다" 라고 한 두줄로 요약되어있었는데, 대체 이게 왜 이렇게 풀어지는지 도저히 이해가 안가서 고민을 상당히 많이 했다. 특히 이 때는 키워드도 몰랐던 상황이라, 참 막막했고 있는 지식으로는 도저히 이해가 안 갔다. 

이 포스트는 수학적 언어에 별로 익숙하지 않은 공돌이 입장에서, 철저히 도구적인 관점으로 이쁜 수학적 정의와 엄밀함을 희생시키고 쓴 글이다. 여기엔 키워드와 흐름, 일부 정의만 담았다. 그나마 이런 글이라도 인터넷에서 찾았으면 시간이 많이 절약되었을 것이라는 생각으로 작성해본다. References의 훌륭한 책, *Using Algebraic Geometry*에선 행공간을 사용하는데, 선형 대수학과 친숙한 관점에선 좀 불편하여 전반적으로 행렬을 전치해서 열공간을 사용하였다. 논지전개에 큰 문제는 당연히 없지만, 원문을 살펴볼 것이라면 주의하기 바란다.

논지전개에 필수적이지 않은 내용은 그냥 작성을 하지 않았는데, 우선은 추가 키워드 몇몇개를 같이 적어두긴 했다.

## Basic defenitions

여기선 우선 기본적인 개념을 설명하고 가자. 환,체에 대해선 생략하자. 앞으로도 두루뭉실하게 뭉갤 것이다.

### Ideal

$f(x) = 0$ 인 시스템이 있다고 하자. 여기서 $f$는 다음 다항식의 집합이다.

$$
f=(f_1,f_2,\cdots,f_n)
$$

여기서 이 함수를 generator로 삼아, 어떤 선형 결합으로 또 다른 다항식을 생성 가능하다. 이 식의 집합이 바로 **ideal**이다. $\langle \cdot \rangle$ 로 어떠한 다항식의 집합이 생성하는 Ideal을 표현한다 해보자. 

$$
I = \langle f \rangle = \langle f_1,f_2,\cdots,f_n \rangle
$$

또, $[x]$ 가 $x$로 표현 가능한 다항식이라고 해보자. (e.g $(x^3+4x) \in [x]$)

$$
I=\lbrace \sum_{i=1}^n {  h_i f_i \ \big|\ h_i \in k[x] } \rbrace
$$

예를 들어보자.

시스템 $f(x,y)$ 에 대해,

$$
f(x,y)=\begin{cases}
f_1 = x \newline
f_2 = x^2 \newline
f_3 = xy \newline
f_4 = y^2
\end{cases}
$$

여기서 ideal $I=\langle f \rangle$ 에 다음 항은 포함된다.

$$
2x,\  x^3y,\  40x^{22}y^{21}+13xy
$$

다음 항은 포함되지 않는다.

$$
y, 4
$$

추가 키워드 : left ideal, right ideal, ring

### Membership problem

$f$로 생성한 ideal $I$가 있다 하자. 이 때, 새로운 $p$는 ideal 의 member인가? $f$로 생성한 $p$가 ideal의 멤버임은 당연하다. 하지만, $p$가 $f$로 나누어지지 않을 때도 그런가? 이를 Membership problem이라고 한다. 이 문제는 자명하지 않다. 

예시를 들어보자.

$$
f(x,y)=\begin{cases}
f_1 = xy + x \newline
f_2 = xy + x + y + 1
\end{cases}
$$

이 때, 다항식 $p=y+1$은 이 $f$로 만들 수 있는 ideal에 속한다. $f_2-f_1$ 이기 때문에 어떤 종류의 선형 결합으로 나타낼 수 있기 때문이다. 여기선 당연해 보이지만, 식이 많아지고 복잡해지다보면 어려워진다. 이 Membership 판별은 다음과 같이 표현 가능하다.

$$
\mathrm{p} = p \text{ mod } I
$$

여기서 $\mathrm{p}=0$ 일 때, $p \in I$ 라고 표현 가능하다. 여기서 나머지 연산에 대해선 이후에 다시 살펴보자. 이런 연산으로 인해, ideal로 인한 몫환(quotient ring)이 정의되며, 나머지는 normal form (Maple - `Normalf`)이라고 부른다.

### Monomial Ordering

앞으로 알고리즘들은 Leading term을 정의해야하기 때문에, 각 항을 어떤 순서로 두는지에 따라 결과가 달라진다. 이에 따라 monomial(단항식)을 정해진 방법에 의해 정의할 필요가 생기며, 일반적으로 많이 쓰이는 방식은 다음 방식이 있다. $x,y,z$ 3차까지의 식을 나열해보자. 각 단항 성분에 대해서도 순서를 정의해야하는데, 여기선 $x \gt y \gt z$ 순서로 정의하자.

- Lexicographic A.k.a. `Lex` : \
  정렬하는 항의 차수를 기준으로 한다. \
  $x^3,x^2y,x^2z,x^2,xy^2,xyz,xy,xz^2,xz,x,y^3,y^2z,y^2,yz^2,yz,y,z^3,z^2,z,1$ 
- Degree Lexicographic A.k.a. `Graded Lexicographic`, `grlex`, `deglex` :  \
  전체항의 차수를 우선하고, 그 다음 각항의 차수를 기준으로한다. \
  $x^3,x^2y,x^2z,xy^2,xyz,xz^2,y^3,y^2z,yz^2,z^3,x^2,xy,xz,y^2,yz,z^2,x,y,z,1$
- Degree Reverse Lexicographic A.k.a Graded Reverse Lexicographic, grevlex, degrevlex : \
  전체항의 차수를 우선하고, 그 다음 마지막 항의 차수가 낮을수록 우선한다. \
  $x^3,x^2y,xy^2,y^3,x^2z, xyz, y^2z,xz^2, yz^2,z^3,x^2,xy,y^2,xz,yz,z^2,x,y,z,1$

개인적으론 grlex와 grevlex가 (grevlex가 이중 부정이라) 살짝 헷갈렸다. 구체적인 예시로는 다음이 있다.

- `grlex` : $x^2z^2 \gt xy^2z$ (x 차수가 높은 항이 우선한다.)
- `grevlex` : $xy^2z \gt x^2z^2$ (z 차수가 낮은 항이 우선한다.)

여기서 어떤 다항식의 특정 ordering을 기준으로 가장 앞에 있는 항을 Leading term이라고 하며, $\mathrm{LT}(\cdot)$ 등으로 표현 가능하다.

### S-polynomial

식으로 보면 조금 귀찮다. 그냥 두 식을 이용해 서로의 leading term을 제거하고 난 뒤의 다항식을 말한다. 아래 정의를 스킵하고, 밑의 예시만 보면된다.

정의를 하자면, 계수를 제외한 Leading term을 Leading Monomial $\mathrm{LM}(\cdot)$, 그리고 최소공배수를 $\mathrm{LCM}(\cdot)$이라고 정의하면 S-polynomial $S(\cdot, \cdot)$는 두 polynomial $p,q$에 대해

$$
S(p,q)= 
{{\mathrm{LCM}(\mathrm{LM}(p),\mathrm{LM}(q))}\over{\mathrm{LT}(p)}}\cdot p - {{\mathrm{LCM}(\mathrm{LM}(p),\mathrm{LM}(q))}\over{\mathrm{LT}(q)}}\cdot q
$$

가 된다. 

예시로는 그냥 다음 과정을 보여줄 수 있다.

$$
p=xy+x+1, q=x+y^2-1
$$

1. Lexicographic order $x \gt y$

$$
\begin{align*}
S(p,q)
& = (xy+x+1)-y(x+y^2-1) \newline
& = xy+x+1-xy-y^3+y \newline
& = x - y^3 + y +1
\end{align*}
$$

2. Degree Lexicographic order  $x \gt y$

$$
\begin{align*}
S(p,q)
& = y(xy+x+1)-x(y^2+x-1) \newline
& = xy^2+xy+y - xy^2 - x^2 + x\newline
& = -x^2 + xy + x + y
\end{align*}
$$

예시를 통해 대략적인 계산과정과 함께, monomial ordering이 s-polynomial에 끼치는 영향까지 보였다.

### Buchberger's algorithm

부흐베르거의 알고리즘은 그뢰브너 기저를 구하는 알고리즘이다. (그뢰브너 기저는 부흐베르거가 만들었으며, 부흐베르거의 박사 과정 지도교수 그뢰브너의 이름을 땄다고 한다.) 그뢰브너 기저의 정의에 대해서는 조금 있다 살펴보자. 오히려 방법부터 보고 정의를 보는게 마음이 편하다. 우선은 어떤 아이디얼에 대한 기저임을 말해둔다.

부흐베르거의 방법은 다음과 같다.

> Input : $f = \lbrace f_1,f_2,\cdots , f_n\rbrace$, $I = \langle f \rangle$
> 
> Output : Gröbner basis $g = \lbrace g_1,g_2,\cdots , g_n\rbrace$

1. $f := g$
2. $g$안에 있는 각 다항식 pair $p,q$ 에 대해 S-polynomial $S$ 생성
3. $r = S \text{ mod }g$
4. $r=0$ 이라면 아무것도 하지 않는다. \
   $r\neq 0$ 이라면 $g$에 추가한다. 
5. 2~4를 반복한다.

예시를 살펴보자. 이 예시에서는 lexical ordering을 사용하겠다. 예시에 사용된 다항식 자체는 [여기에서](https://youtu.be/q4L_f7BMOOM) 가져왔다. 시각화가 비교적 깔끔하고, 소거 자체도 적당히 여러번에 걸쳐 일어나서 가져왔다.

$$
f_1 = x^2+y^3-1 \newline
f_2 = xy-x+y^2
$$

step1.

$$
g=\lbrace g_1,g_2\rbrace:=\lbrace f_1,f_2\rbrace
$$

step2.

$$
\begin{align*}
S_{12}
&= yg_1 - xg_2 \newline
&= x^2y+y^4-y - x^2y - x^2 + x^2 - xy^3 \newline
&= x^2 - xy^2 + y^4 -y
\end{align*}
$$

step3.

$$
\begin{align*}
S_{12}
& = x^2 - xy^2 + y^4 -y \newline
& = g_1 - (y+1)g_2 + (-x+y^4+y^2-y+1) \newline
\end{align*}
$$

여기서 나머지는 $(-x+y^4+y^2-y+1)$ 이며, 0이 아니다. 따라서 새로운 기저로 편입시킨다.

$$
S_{12} \text{ mod }g = (-x+y^4+y^2-y+1) \ne 0 \newline
g_3 := -x+y^4+y^2-y+1  \newline
g = \lbrace g_1,g_2,g_3\rbrace
$$

다시 step2로 돌아간다.

$$
\begin{align*}
S_{13}
&= g_1 + xg_3 \newline
&= x^2 + y^3 -1 - x^2 + xy^4 +xy^2 - xy+x\newline
&= xy^4 + xy^2 - xy + x + y^3 -1
\end{align*}
$$

step3.

$$
\begin{align*}
S_{13}
& = xy^4 + xy^2 - xy + x + y^3 -1 \newline
& = (y^3+y^2+2y+1)g_2 - 2g_3 + (-y^5+y^4-y^3+y^2-2y+1) \newline
\end{align*}
$$

따라서 이번에도 마찬가지로, 

$$
S_{13} \text{ mod }g = (-y^5+y^4-y^3+y^2-2y+1) \ne 0 \newline
g_4 := -y^5+y^4-y^3+y^2-2y+1  \newline
g = \lbrace g_1,g_2,g_3,g_4\rbrace
$$

다시 step2로 돌아간다.

$$
\begin{align*}
S_{23}
&= g_2 + yg_3 \newline
&= xy-x+y^2 - xy+y^5+y^3-y^2+y\newline
&= -x + y^5 + y^3 + y
\end{align*}
$$

step3.

$$
\begin{align*}
S_{23}
& = -x + y^5 + y^3 + y \newline
& = g_3 - g_4 \newline
\end{align*}
$$

이번엔 깔끔하게 나누어지므로, 새로운 기저가 생기지 않았다. $S_{14},S_{24},S_{34}$ 등에 대해선 생략한다. 너무 길어지는데, 그들끼린 기저가 생기지 않는다는 점만 적어둔다.  결론적으로 이 ideal $I$에 대한 그뢰브너 기저는 다음과 같다. Monic polynomial(Leading term의 계수가 1)로 표현한다. 큰 차이는 없다.

$$
g=\begin{cases}
g_1 = x^2+y^3-1 \newline
g_2 = xy-x+y^2 \newline
g_3 = x-y^4-y^2+y-1 \newline
g_4 = y^5-y^4+y^3-y^2+2y-1
\end{cases}
$$

이제 대략적인 배경에 대한 정의가 끝난거같다.

다음 유튜브 영상이 이해에 도움을 주기를 바라며 첨부해본다.

{{< youtube XvblHJQvhQg >}}

추가 키워드 : Dickson's lemma, Hilbert Basis Theorem

## Gröbner basis

### Definition

그뢰브너 기저의 정의는 다음과 같다. (쳐낼 부분은 쳐냈는데, 이걸 정의라고 해도 되는 것일까 의문은 든다.)

> $g = \lbrace g_1,\cdots,g_n\rbrace$ 에 대해,
> $\langle LT (I) \rangle = \langle LT(g_1),\cdots, LT(g_n)\rangle$
> 
> $LT(I)$ 는 Ideal의 모든 다항식의 leading term들의 집합이며, 
> 
> $LT(g_n)$ 은 $g_n$의 leading term을 의미한다.

결국 그뢰브너 기저가 있으면 어떤 ideal을 전부 표현 가능하며, 위의 부흐베르거 알고리즘 예시에서 봤듯이 어떤 leading term이 있어야 ideal을 잘 표현 할 수 있을지에 대한 설명이기도 하다.

다만 여기서 맨 처음에 할당한 $f$ 또한 최적의 그뢰브너 기저는 아니다. 일반적으로 서로가 서로에 의해서 나눠지지 않아야하는데, 그런 과정을 거치지 않았기 때문이다. 그뢰브너 기저의 필요와 성질에 의해서 더 알아보기 위해 다음 두가지 컨셉을 더 소개한다.

- Minimal Gröbner basis : Gröbner 기저의 모든 성분이 서로를 나눌 수 없다.
- Reduced Gröbner basis : Minimal에 더해, 모든 polynomial이 monic이다.

이런 관점에서, 아까 예시에 대한 reduced Gröbner basis는 다음과 같다.

$$
g=\begin{cases}
g_1 = x-y^4-y^2+y-1 \newline
g_2 = y^5-y^4+y^3-y^2+2y-1 \newline
\end{cases}
$$

결국은 서로가 서로에게 독립인 성분으로, 어떤 ideal에 대해 완벽히 정의하며, 그 ideal의 특징을 드러낸다고 볼 수 있다.

추가 키워드 : F4, F5, FGLM

### Basic solving

원래 $f$의 polynomial은 다음과 같았다.

{{< d3 >}}
  const width = canvas.clientHeight;
  const height = canvas.clientHeight;
  const margin = 40;
  
  // draw axis
  const x = d3.scaleLinear()
    .domain([-3, 3])
    .range([margin, width - margin]);
  
  const y = d3.scaleLinear()
    .domain([-3, 3])
    .range([height - margin, margin]);
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);
  
  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${y(0)})`)
    .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
    .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.1)
        .attr("y1", -(height/2-margin+5))
        .attr("y2", +(height/2-margin+5)));
  
  svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${x(0)}, 0)`)
    .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
    .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.1)
        .attr("x1", -(height/2-margin+5))
        .attr("x2", +(height/2-margin+5)));

  // draw poly1
  const dataPoly1 = d3.range(-3.05, 3.05, 0.01).map(x => ({
    x: x,
    y: Math.cbrt(-x*x+1)
  }));

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  svg.append("path")
    .datum(dataPoly1)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // draw poly2
    const dataPoly2 = d3.range(-3.05, 0.81, 0.01).map(y => ({
    x: -(y*y)/(y-1),
    y: y
  }));

  svg.append("path")
    .datum(dataPoly2)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line);

  const legend = svg.append("g")
  .attr("transform", `translate(${margin+20}, ${margin+20})`);

  legend.append("rect")
  .attr("x",0)
  .attr("y",-5)
  .attr("width",125)
  .attr("height",45)
  .attr("rx", 2)
  .attr("ry", 2)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("fill-opacity", 0.7)
  .attr("fill", "white");

  legend.append("line")
  .attr("x1", 10)
  .attr("y1", 10)
  .attr("x2", 30)
  .attr("y2", 10)
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2);

  legend.append("text")
    .attr("x", 40)
    .attr("y", 10)
    .attr("dominant-baseline", "middle")
    .text("x²+y³-1 = 0");

  legend.append("line")
  .attr("x1", 10)
  .attr("y1", 30)
  .attr("x2", 30)
  .attr("y2", 30)
  .attr("stroke", "red")
  .attr("stroke-width", 2);

legend.append("text")
  .attr("x", 40)
  .attr("y", 30)
  .attr("dominant-baseline", "middle")
  .text("-xy+x-y² = 0");

  canvas.append(svg.node());
{{</ d3 >}}

그러나 우리가 그뢰브너 기저를 구하며, 다음 두 개의 식으로 바뀌게 되었다.

{{< d3 >}}
  const width = canvas.clientHeight;
  const height = canvas.clientHeight;
  const margin = 40;
  
  // draw axis
  const x = d3.scaleLinear()
    .domain([-3, 3])
    .range([margin, width - margin]);
  
  const y = d3.scaleLinear()
    .domain([-3, 3])
    .range([height - margin, margin]);
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);
  
  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${y(0)})`)
    .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
    .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.1)
        .attr("y1", -(height/2-margin+5))
        .attr("y2", +(height/2-margin+5)));
  
  svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${x(0)}, 0)`)
    .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
    .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.1)
        .attr("x1", -(height/2-margin+5))
        .attr("x2", +(height/2-margin+5)));

  // draw poly1
  const dataPoly1 = d3.range(-3.05, 3.05, 0.01).map(x => ({
    x: x,
    y: 0.597497
  }));

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  svg.append("path")
    .datum(dataPoly1)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
  
  // draw poly2
    const dataPoly2 = d3.range(-0.85, 1.19, 0.01).map(y => ({
    x: y*y*y*y + y*y -y + 1,
    y: y
  }));

  svg.append("path")
    .datum(dataPoly2)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line);

  const legend = svg.append("g")
  .attr("transform", `translate(${margin+20}, ${margin+20})`);

  legend.append("rect")
  .attr("x",0)
  .attr("y",-5)
  .attr("width",180)
  .attr("height",45)
  .attr("rx", 2)
  .attr("ry", 2)
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("fill-opacity", 0.7)
  .attr("fill", "white");

  legend.append("line")
  .attr("x1", 10)
  .attr("y1", 10)
  .attr("x2", 30)
  .attr("y2", 10)
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2);

  legend.append("text")
    .attr("x", 40)
    .attr("y", 10)
    .attr("dominant-baseline", "middle")
    .text("y⁵-y⁴+y³-y²+2y-1 = 0");

  legend.append("line")
  .attr("x1", 10)
  .attr("y1", 30)
  .attr("x2", 30)
  .attr("y2", 30)
  .attr("stroke", "red")
  .attr("stroke-width", 2);

legend.append("text")
  .attr("x", 40)
  .attr("y", 30)
  .attr("dominant-baseline", "middle")
  .text("x-y⁴-y²+y-1 = 0");

  canvas.append(svg.node());
{{</ d3 >}}

그뢰브너 기저는 우리가 어떤 ideal에 대해 complexity가 훨씬 내려간 방식으로 구조를 볼 수 있게 해준다. 위 식에서 y를 구하는 것은 단변수 함수이기 때문에 몇몇 수치적 방법을 사용하면 아주 용이하며, 이 상황에서 x를 구하는 것은 trivial하다.

Monomial order가 결국 leading term을 정의하기 때문에, 이를 elimination order라고 볼 수 있다. 일반적으론 ordering을 따라 가장 뒤쪽에 있는 term을 기준으로 단변수 다항식이 생기게 된다. 다만 어떤 ideal이 그 변수에 대한 단변수 다항식을 포함하지 않을 때도 있다. 그럴 때 다른 elimination order를 사용하면 있을 수도 있으며, 만일 없다면 다른 방식도 사용할 수 있다. 그 중 하나는 다른 소거 순서를 사용하는 것이며, 그 외의 방법에 대해선 생략한다.

### Quotient ring & Normal form

다항식환 $k[x]$에 대해, 나눗셈 연산과 Ideal $I$ 를 이용하면 몫환(Quotient Ring)을 얻을 수 있다. 여기서 몫환의 krull dimension이 해가 놓일 수 있는 차원이 되며, 이 krull차원이 0차원이어야 유한한 해가 생긴다. 이에 대해선 생략한다. 


몫환은 다음과 같이 표현한다.

$$
k[x]/I
$$

몫환은 다항식환 $k[x]$의 원소들을 특정 Ideal로 나눔으로 인해 다시 환 구조를 이루기 때문에 생기며, 이때 다항식 $f$에 대해 잉여류(coset)가 다음으로 정의된다.

$$
[f] = f+I
$$

Coset은 다음과 같은 중요한 특성을 갖는다.

$$
[f]=[g] \iff f-g \in I
$$

결국 어떤 Ideal로 인한 나머지와 coset은 1대1 대응 관계를 갖는다. 살짝 구체적인 예시를 살펴보자.(이 예시는 deglex reduced Gröbner basis로 주어졌다.)

$$
g=\begin{cases}
g_1 = x^2+xy+y^2-2x-3y \newline
g_2 = xy^2-x \newline
g_3 = y^3-y
\end{cases}
$$

여기서, $LT(g) = \lbrace x^2,xy^2,y^3 \rbrace$ 이다. 이 ideal에는 monomial $xy,y^2,x,y,1$ 이 없는 상태이다. 이 monomial들을 standard monomial이라고 하자. 그러면 이 standard monomial로, 각 잉여류를 유일하게 대표하는 다항식을 정의 가능하다. 이를 정규형(Normal form)이라고 부른다.

즉, 몫환을 벡터 공간의 관점으로 봤을 때, 그 공간은 정규형들로 이루어져있으며, 정규형의 기저가 되는 monomial basis가 존재하게 된다. 예를 들어 위 예시의 그뢰브너 기저와 그로 인한 몫환에서, **$x^2$이라는 항은 $-xy-y^2+2x+3y$라는 Normal form으로 대표된다.** 이는 어떤 다항식에서도 마찬가지다. 모든 다항식은 ideal로 인해 하나의 coset으로 전사 가능하다.또, $I+(-xy-y^2+2x+3y)$ 로 표현될 수 있는 모든 다항식이 전부 같은 coset이 된다.

### Action Matrix

자, 이제 standard monomial에 대해 action matrix를 정의할 수 있다. Action matrix는 어떤 행렬을 곱했을 때 어떤 항을 곱한것과 같은 역할을 해줄 수 있는 행렬이다.

예시로 보자면 다음과 같다.

$$
x
\begin{bmatrix}
xy \newline
y^2 \newline
x \newline
y \newline
1
\end{bmatrix}=M_x \begin{bmatrix}
xy \newline
y^2 \newline
x \newline
y \newline
1
\end{bmatrix}
$$

직접 구해보자.

$$
\begin{align*}
x\cdot xy &= yg_1-g_2-g_3+(2xy+3y^2-x-y)=2xy+3y^2-x-y \newline
x\cdot y^2 &= g_2+x = x \newline
x\cdot x &= g_1 - (xy+y^2-2x-3y) = -xy - y^2 +2x + 3y \newline
x\cdot y &= xy\newline
x\cdot 1 &= x
\end{align*}
$$

따라서 $M_x$는 다음과 같이 표현 가능하다.

$$
M_x = 
\begin{bmatrix}
2 & 3 & -1 & -1 & 0 \newline
0 & 0 & 1 & 0 & 0 \newline
-1 & -1 & 2 & 3 & 0 \newline
1 & 0 & 0 & 0 & 0 \newline
0 & 0 & 1 & 0 & 0
\end{bmatrix}
$$

여기서 우리는, 다음 한 가지 중요한 직관을 발휘할 수 있다.

> Action matrix $M_x$로 곱하는 것과 $x$로 곱하는것에 차이가 없다면, x는 eigenvalue이다.

결과적으로, **어떤 action matrix를 만들고 나면, 이 action matrix의 eigenvalue는 그 action matrix가 대표하는 수식의 해가 된다.** 

여기까지 오래걸렸다. 전체 그림을 다시 한 번 그려보자.

> 어떤 다항식의 집합이 있을 때, 우리는 그 다항식으로 하여금 생성되는 Ideal을 그뢰브너 기저를 사용함으로써 잘 표현할 수 있다. 이때, 이 ideal의 몫환을 그뢰브너 기저의 leading term에 포함되지 않는 standard monomial들로 이루어진 Normal form으로 대표하여 표현할 수 있다. 이 Normal form의 구조와, 그로 인해 생성된 action matrix를 이용하면 이 다항식의 관계에 대해 표현할 수 있고, 이로 말미암아 해를 구할 방법을 얻게 되었다.

위 예시 action matrix에서 실수 eigenvalue는 $0,-1,2$ 가 된다. $y$를 구하는 것은 trivial한데, 각각 $0,1,1$ 이 된다는 것을 볼 수 있다. 직접 대입해보면 전부 0이 나온다. (사실 $y^3-y$가 있어서 이미 trivial하긴 했다.)
