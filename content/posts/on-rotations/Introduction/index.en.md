+++
date = 2024-12-24T10:33:15+09:00
lastmod = ""
draft = false

title = "Introduction"
summary = ""

isCJKLanguage = false

tags = ["mathematics",]
categories = ["on rotations"]

+++

##### Background

We live in a three-dimensional world. Therefore, describing space inherently occurs within three dimensions. Every field that deals with spatial concepts necessarily builds upon this three-dimensional description, which is generally referred to as a **rigid transformation.** Describing an object's pose in three dimensions is equivalent to describing its spatial transformation, and this is essential in various fields such as robotics, computer vision, and graphics.

However, it is unfortunate that there are very few writings that provide a deep understanding of rotations. While there are numerous articles that focus on specific topics like Euler angles, Rodrigues' formula, and quaternions, comprehensive works that offer an integrated understanding are rare. I have not found any writings that cohesively cover the connections between bivectors and quaternions, the transition from axis-angle to screw theory, or the links from Lie Groups, Lie Algebras to manifolds within a single, unified framework. As a result, most people (including myself) who begin studying rotation groups have no choice but to gradually acquire knowledge about $\mathrm{SO3}$ (referring to Rotation Matrices) step by step, much like a blind person feeling an elephant with their hands.

##### Difficulty    

However, understanding rotations is challenging. At least in my opinion, without a coherent framework, it is difficult to grasp.There are several reasons for this, but primarily, humans are confined to moving in a two-dimensional plane on the Earth's surface. Our brains are already limited to visualizing movement in two dimensions. We cannot handle enven the simplest scenarios. For instance, when a car navigation system points downward, it can momentarily confuse left and right, and imagine how much more complicated it becomes when dealing with three rotational axes.

What makes rotations even more difficult is that they are nonlinear and simultaneously involve the noncommutative algebra structure, which was one of the first noncommutative algebras discovered by humans. As a result, the mathematical representations are complex, and the computations become even more intricate. Even something as seemingly simple as linear interpolation becomes cumbersome.

##### Key Concepts

In this article, I plan to focus solely on rigid rotations and will not delve into rotations involving spinors, which I am not yet familiar with. The keywords are as follows:

- $\mathrm{SO3 / SE3} $
- Euler Angle
- Axis-angle
- Quaternion, bivector, rotor
- Screw theory & Dual quaternion
- Lie Group / Lie Algebra
- Manifold & Optimization