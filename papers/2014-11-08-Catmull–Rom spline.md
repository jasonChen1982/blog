---
title: Catmull–Rom spline
date: 2014-11-08
status: finished
author: jason82
---

在数学的数值分析这一领域中，样条是一种由多项式分段定义的特殊函数。

样条曲线在图形学中也经常被用到，我们在处理离散数据间插值的时候往往需要用到样条函数来平滑链接已知的一组控制点。非常常见的插值应用就是`beizer curve`在动画中的应用了，除此之外还有非常非常多的不同类型不同适用场景的样条曲线。下面我们将来介绍一些比较常见的样条曲线：

样条曲线可以在某种程度上分为两大类，一类是生成的曲线通过控制点、另一类则是生成的曲线不通过控制点。

##### 通过控制点的

* [catmull-rom spline](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline) catmull-rom样条
* [Hermite spline](https://en.wikipedia.org/wiki/Cubic_Hermite_spline) 三次厄尔密样条曲线
* [lagrange spline](http://www.math.ucla.edu/~baker/149.1.02w/handouts/x_lagrange.pdf) 拉格朗日样条曲线
* …...

#####  不通过控制点的

* [beizer spline](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) 贝塞尔样条曲线
* [B spline](https://en.wikipedia.org/wiki/B-spline) B样条
* [NURBS](https://en.wikipedia.org/wiki/Non-uniform_rational_B-spline) 非均匀有理B样条
* …...

今天我们要讲的就是`catmull-rom`曲线，由于其能够经过控制点的这一特性，所以经常被用在平滑路径生成上。样条曲线是指从给定的一组控制点而得到一条曲线，曲线的大致形状由这些点予以控制。

> 样条曲线一般可分为插值样条和逼近样条两种，插值样条通常用于数字化绘图或动画的设计，逼近样条一般用来构造物体的表面。[reference](http://www.cnblogs.com/WhyEngine/p/4020390.html)

以下则是`catmull-rom`样条的公式

![catmull-rom](https://wikimedia.org/api/rest_v1/media/math/render/svg/c67f2482bc328d3c50769b8d860b9488c936af63)

