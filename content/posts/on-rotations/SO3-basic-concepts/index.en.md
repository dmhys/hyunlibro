+++
date = 2024-12-24T17:33:15+09:00
lastmod = 2025-01-07T00:33:41+09:00
draft = false

title = "SO3(1) - Basic concepts"
summary = ""

isCJKLanguage = false

tags = ["mathematics", "rotation", "SO3",]
categories = ["on rotations"]

+++

## Toy Example

Let's consider a 2D toy example. Suppose we are going to describe a robot moving in two dimensions. The description here can consist of three degrees of freedom: $pos_x,$ $pos_y,$ and $\theta$.  Then, if we express the position of an object as seen from the robot's coordinate system as $x_{local} ,$ $y_{local} ,$ it represents the **position from the robot's perspective**.  (I expressed them as $x$, $y$, etc., to avoid using too many subscripts.) If we view the position seen by the robot from the global coordinate system representing the robot's pose,

$$
x_{global} = \cos \theta \\ x_{local} - \sin \theta \\ y_{local} + pos_x
\newline
y_{global} = \sin \theta \\ x_{local} - \cos \theta \\ y_{local} + pos_y
$$

Someone familiar with this might think that it should be expressed using matrix operations. That's correct. Representing it with matrices as follows makes it much easier to visualize.

$$
\begin{bmatrix} \ x_{global} \ \newline y_{global} \end{bmatrix} = 
\begin{bmatrix} \cos \theta & -\sin \theta \newline  \sin \theta & \cos \theta \end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \end{bmatrix} +
\begin{bmatrix} \ pos_x \ \newline pos_y \end{bmatrix}
$$

If we group $x$ and  $y$ as $p$, it can be expressed as follows.

$$
p_{global} = R_\theta p_{local} + pos
$$

&nbsp;

Here, if we represent the rotation term and translation term as $R$ and $t$ respectively,

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

As shown above, the position of the robot described in specific system can be represented by the transformation matrix from the robot to that system. Ultimately, a **pose** is equivalent to the **local to global transformation**.

##### Extend to three dimension

Obviously, if we add one dimension here, it becomes three-dimensional.

$$
\begin{bmatrix} \ x_{global} \ \newline y_{global} \newline z_{global} \newline 1\end{bmatrix} = 
\begin{bmatrix} R_{3 \times 3} & t_{3 \times 1} \newline 0 & 1 \end{bmatrix}
\begin{bmatrix} \ x_{local} \ \newline y_{local} \newline z_{local} \newline  1\end{bmatrix}
$$

Here, $R$ is a 3D $3\times 3$ matrix representing rotation, and $t$ is a vector ($3 \times 1$) representing position.

## Rotation and special orthogonal group

Now, let's assume the conditions to represent this rotation.

- Rotation cannot change the size of the object.
- Rotation preserves the angles between the axes. (It does not skew space.)
- If you rotate once and then rotate in the **opposite direction**, it remains unchanged.

Here, the two important conditions are one, that the size of the object cannot be changed and the ohter, that the angles are preserved. That is, **when a transformation is applied, the size should remain unchanged, and there should be no twisting of space.** If we express this a bit mathematically, we can think that a transformation preserves the inner product between all vectors.

$$
(R\mathrm v)\cdot(R \mathrm w) = \mathrm v \cdot \mathrm w
$$

So that,

$$
(R\mathrm v)^T (R \mathrm w) = \mathrm v ^T R^T R \mathrm w = \mathrm v^T \mathrm w
$$

Now the following conclusion is derived.

$$
R^T R = I
$$

However, in this case, the determinant of $R$ has two options. Firstly, the transpose does not change the determinant, and since the determinant on the right side is 1, ultimately the determinant of $R$ has no option other than $\pm 1$. If the determinant is negative, it is called orientation reversing, and it can be said to have chirality that turns a right-handed coordinate system into a left-handed coordinate system. A *real matrix* that satisfies the condition $R^T R = I$ is called an orthogonal matrix, and among these, matrices with determinant 1 that preserve orientation are called special orthogonal matrices.

In other words, all rotation matrices are special orthogonal matrices, the transpose represents the inverse rotation, and they have the property $R^T = R^{-1}$. The group formed by these special orthogonal matrices is called the special orthogonal group, and it is expressed as follows.

$$
\mathrm {SO}(n)
$$

## Parameterization

But think about it. Linear algebra, which we are familiar with, was developed later than rotations in three dimensions. Going back to the initial toy example, we did not define $R$ from the beginning. We started by defining position and rotation. However, unlike in two dimensions, we live in three dimensions. To explain rotations in three dimensions, unlike in two dimensions, one rotation angle $\theta$ is no longer sufficient.

How should we write the equations then? Since rotation is no longer linear, problems arise. In the case of translation, moving in the $x$ direction and then moving in the $y$ direction is the same as moving in the $y$ direction and then moving in the $x$ direction. However, rotating about the x-axis and then the y-axis yields a different result than rotating about the y-axis and then the x-axis. Therefore, the result varies depending on the order in which the numbers are applied. But don't we have three axes to rotate about? (In fact, the rotation axis is somewhat of an illusion. In two dimensions, there is rotation, but there is no such thing as a rotation axis. Because there can't be third axis. We'll look into that later.) First, let's define rotations about the three axes.

$$
R_x(\theta) = \begin{bmatrix}
1 & 0 & 0 \newline
0 & \cos\theta & -\sin\theta \newline
0 & \sin\theta & \cos\theta
\end{bmatrix}
$$

By doing this, the x-axis remains the same while the y and z components change. Similarly, the remaining two can be defined.

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

Here, because the y direction is different, $\theta$ becomes the opposite direction. (Think about the right-hand rule from the perspective of each axis.) I have an intuition that it is to compensate for some kind of twisting, but I do not know the exact keyword and cannot find it. Someone please explain it to me. (It's because of the order in which each axis is defined. However, the keyword 'twist' that is in my head does not get resolved.)

Returning to the original track, then we can define the following rotation.

$$
R = R_x(\phi) R_y(\theta) R_z(\psi)
$$

We have defined it with three numbers like this. If you change it back to a formula, it can be defined without a matrix. It can be generally defined to some extent, and now in the next part, we will look at other basic parameterizations again.