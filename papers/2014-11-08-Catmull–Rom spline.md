---
title: Catmull–Rom spline
date: 2014-11-08
status: finished
author: jason82
---

在数学的数值分析这一领域中，样条是一种由多项式分段定义的特殊函数。

样条曲线在图形学中也经常被用到，我们在处理离散数据间插值的时候往往需要用到样条函数来平滑链接已知的一组控制点。非常常见的插值应用就是`bezier curve`在动画中的应用了，除此之外还有非常非常多的不同类型不同适用场景的样条曲线。下面我们将来介绍一些比较常见的样条曲线：

样条曲线可以在某种程度上分为两大类，一类是生成的曲线通过控制点、另一类则是生成的曲线不通过控制点。

##### 通过控制点的

* [catmull-rom spline](https://www.cs.cmu.edu/~462/projects/assn2/assn2/catmullRom.pdf) catmull-rom样条
* [Hermite spline](https://en.wikipedia.org/wiki/Cubic_Hermite_spline) 三次厄尔密样条曲线
* [lagrange spline](http://www.math.ucla.edu/~baker/149.1.02w/handouts/x_lagrange.pdf) 拉格朗日样条曲线
* …...

#####  不通过控制点的

* [bezier spline](https://en.wikipedia.org/wiki/B%C3%A9zier_curve) 贝塞尔样条曲线
* [B spline](https://en.wikipedia.org/wiki/B-spline) B样条
* [NURBS](https://en.wikipedia.org/wiki/Non-uniform_rational_B-spline) 非均匀有理B样条
* …...

今天我们要讲的就是`catmull-rom`曲线，由于其能够经过控制点的这一特性，所以经常被用在平滑路径生成上。样条曲线是指从给定的一组控制点而得到一条曲线，曲线的大致形状由这些点予以控制。

> 样条曲线一般可分为插值样条和逼近样条两种，插值样条通常用于数字化绘图或动画的设计，逼近样条一般用来构造物体的表面。[reference](http://www.cnblogs.com/WhyEngine/p/4020390.html)

我们本次讨论的只是`catmull-rom`众多变形实现中的一种，公式如下:

```javascript
var tension = 0.5;
var v0 = (p2 - p0) * tension;
var v1 = (p3 - p1) * tension;
var t2 = t * t;
var t3 = t * t2;
P(t) = (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
```

我们可以为该公式创建一个函数

```javascript
function CatmullRom(p0, p1, p2, p3, t, tension) {
  var v0 = (p2 - p0) * tension;
  var v1 = (p3 - p1) * tension;
  var t2 = t * t;
  var t3 = t * t2;
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
}
```

后续我们就只需要将数据往该公式里面套就好了。

```javascript
function getPoint(v, k) {
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);

    if (v[0] === v[m]) {
        if (k < 0) {
            i = Math.floor(f = m * (1 + k));
        }
        return CatmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
    } else {
        if (k < 0) {
            return v[0] - (CatmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
        }
        if (k > 1) {
            return v[m] - (CatmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
        }
        return CatmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
    }
}
```

这样我们就可以愉快的使用`getPoint`方法来获取坐标点的各个分量的`CatmullRom`插值了。

```javascript
var points = [
  { x: 0, y: 0 },
  { x: 100, y: -20 },
  { x: 30, y: 20 },
  { x: 90, y: 60 },
  { x: -50, y: 0 },
];

var point = {
  x: getPoint([ points[0].x, points[1].x, points[2].x, points[3].x, points[4].x, ], 0.5, 0.5),
  y: getPoint([ points[0].y, points[1].y, points[2].y, points[3].y, points[4].y, ], 0.5, 0.5),
};
```

这样我们就得到了`points`的在`0.5`处的插值结果。