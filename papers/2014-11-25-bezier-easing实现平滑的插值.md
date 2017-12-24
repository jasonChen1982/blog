---
title: bezier-easing实现平滑的插值
date: 2014-11-25
status: finished
author: jason82
---

我们都知道，`CSS3`里面的插值函数用的是`bezier`曲线。如同前面所说的，贝塞尔曲线是一个可递归的、特殊的样条曲线。这次我们来聊聊如何利用贝塞尔曲线来做插值操作（平滑插值动画）。了解`CSS3`的都很清楚，我们在`transition`和`animation`中都有用到贝塞尔的插值功能，比如我想让一个物体先加速再减速的往右运动，那么这个过程应该如何实现呢？

在谈`bezier`曲线如何实现动画的加减速变换之前我们先来探讨一下动画是什么，程序上一般有几种方式来处理动画过程。

首先动画最简单的定义就是物体的一连贯的动作我们就可以称作为动画，例如汽车的移动，风扇的转动，窗帘的摇摆。在现实世界中这些动作从广义上来讲它们是时间上连续的，也就是说它是在时间轴上的一个函数。但是从物理的角度上来看待这些动画的话它们可以描述成基于速度的连续累积。因此在程序实现的动画中我们也经常使用这两种方式来实现动画：`基于时间` 和 `基于物理量`(速度、加速度、摩擦等)。

基于物理量很好理解，物理里面的一大领域就是来研究物体运动的，比如一个物体的自由落体我们知道就有两个物理量`当前速度`和`加速度` (忽略加速度因受到空气阻力影响而产生的变化)。如果是在程序里面模拟物体的自由落体那就是主要关注这两个物理变量，比如下面代码：

```javascript
var ball = { y: 0 };
var speed = 1;
var acceleration = 0.1;

setInterval(function() {
  speed += acceleration;
  ball.y += speed;
}, 1000/30);
```

这样就实现了一个最简单的基于物理量的动画。

除了基于物理量的方式来处理动画，还有基于时间的方式，这也是我们这次主要想讲的方式。之前讲了从广义上来讲基于时间的运动其实可以看成是物体位置属性在时间轴上的一个函数。比如我们期望物体在1s内沿X轴从0移动到20的位置，这个过程可以用函数`Xt = Fn(t，duration, start, end)`(t的区间为[0, duration])来表示。如果是匀速的话那么`Fn`的实现方式就是:

```javascript
function Fn(t, duration, start, end) {
  var progress = t / duration; // progress 随着 t 的变化而匀速变化
  return start + (end - start) * progress;
}
```

但是如果是加速的话就可以是:

```javascript
function Fn(t, duration, start, end) {
  var progress = Math.pow(t / duration, 2); // progress 随着 t 的变化而加速变化
  return start + (end - start) * progress * progress;
}
```

其实这里的原理很简单，`progress`是一个[0, 1]之间的数值，那么我们对他进行一个平方操作就会得到一个开始平缓然后逐渐陡峭的曲线。

> 红色为`y=x`函数的曲线，蓝色为`y = x^2`函数的曲线，绿色为`y=x^3`函数的曲线

![y=x^2](https://jasonchen1982.github.io/blog/source/math/y=x^2.png)

如果仔细看你会发现这就是一个插值的过程，利用该曲线在`start`和`end`两个位置之间进行插值，插值的比例根据不同的函数曲线来进行平滑的调整。插值的进度一般使用`X轴`作为输入（可视为时间进度），`Y轴`作为输出值（也就是这个时刻实际使用的插值比例）。

用来调整插值比例的曲线有很多种，除了刚才说的`y = x^2`或者`y=sqrt(x)`这些曲线，还有一些其他的数学曲线。例如运用的最为广泛的`cubic-bezier`曲线来实现同样的插值效果，并且插值效果更丰富。

再开始之前我们先来看看`cubic-bezier`曲线长什么样：

![y=x^2](https://jasonchen1982.github.io/blog/source/math/cubic-bezier.png)

是不是发现和前面的曲线类似，同样我们以`X轴`作为输入，`Y轴`作为输出的话就能通过在限定的区域内变换控制点从而得到各种形式的插值曲线了。但是由上次讲到的`bezier curve`中我们知道`bezier curve`公式的输入量是进度`t`，然后得到曲线在该处的坐标点`(x, y)`，但是我们这里是希望用`x`作为输入量，然后得到的`y`作为输出量来进行实际的插值。也就是说我们现在的需求是已知`x`想求出`cubic-bezier`曲线上所对应的`y`。

我们先来看看`cubic-bezier`曲线的公式。前面说了`bezier`曲线的公式是可递归的公式，我们可以根据之前的公式列出`cubic-bezier`曲线的公式。

![bezier](https://jasonchen1982.github.io/blog/source/math/bezier.svg)

这只是普通的`cubic-bezier`曲线的公式，但是我们这里用到的`cubic-bezier`是起始点为`(0, 0)`和结束点为`(1, 1)`的特殊`cubic-bezier`曲线，这样我们就能对公式进行进一步的简化。

```javascript
B(t) = (1-3*P2+3*P1) * t^3 + (3*P2 - 6*P2) * t^2 + (3*P1) * t 
```

我们知道这里的`t`的含义是一个`[0, 1]`之间的插值进度，但是我们现在的需求是需要通过`X`的值来算出`Y`的值。这样我们就能够通过`cubic-bezier`曲线在这种情况下的`Y`的特性来进行非常丰富的曲线插值了。但是我们可以看到想要求解这个方程并不容易，因此我们可以使用数值研究中常用的方法来求解近似之。

> 高于两阶的一元多次方程目前还都没有求根公式，并且在我们这个公式中曲线是平滑连续的，并且公式的解的值域在[0, 1]之间，可以说我们只要能保证我们猜测的解和实际解在可接受范围内，那么这个方法就是有效的。

如上公式中我们知道的已知量是`P1`、`P2`、`B(t)`的值，需要求解此时的`t`。基于上面的公式我们可以列出这样的程序。

```javascript
// t^3 的系数
function A(P1, P2) {
  return 1.0 - 3.0 * P2 + 3.0 * P1;
}

// t^2 的系数
function B(P1, P2) {
  return 3.0 * P2 - 6.0 * P1;
}

// t 的系数
function C(P1) {
  return 3.0 * P1;
}

// 公式 B(t) = (1-3*P2+3*P1) * t^3 + (3*P2 - 6*P2) * t^2 + (3*P1) * t 的函数形式
function calcBezier(t, P1, P2) {
  return ((A(P1, P2) * t + B(P1, P2)) * t + C(P1)) * t;
}

// 公式 B(t) = (1-3*P2+3*P1) * t^3 + (3*P2 - 6*P2) * t^2 + (3*P1) * t 的导数
function getSlope(t, P1, P2) {
  return 3.0 * A(P1, P2) * t * t + 2.0 * B(P1, P2) * t + C(P1);
}
```

为了增加猜测值的效率，我们可以将整个曲线按照`t`分成`N`段，在猜测前先预判断解在哪个区间。

```javascript
var segement = 10;
var sampleStep = [];
for (var i = 0; i <= segement; ++i) {
  sampleStep[i] = calcBezier(
    i / segement,
    P1,
    P2
  );
}
```

得到`sampleStep`后我们就可以大概的判断解的区间范围，并且顺带在区间内做一次线性插值。

```javascript
function preGuessT(X) {
  var t = 0;
  for (var i = 0; i < segement; i++) {
    var step = sampleStep[i];
    if (x < step) {
      var segStep = 1 / segement;
      var base = i * segStep; // 区间的下边界
      var aBit = segStep * (x - step) / (sampleStep[i+1] - sampleStep[i]); // 多出来的部分进行插值
      t = base + aBit; // 区间的下边界 ＋ 插值
    }
  }
}
```

这样一来得到的解和实际解之间的误差一般能小于`0.01`，接下来我们再利用一些方法逼近一下就能得到误差更小的解了。

这里我们要介绍的就是`牛顿拉弗森迭代法`，该方法是一个结合连续平滑曲线的斜率来逼近拟合方程解的方法。不过这里不会进行详细讲解，有兴趣的可以查看这里[Newton](https://en.wikipedia.org/wiki/Newton%27s_method)。但是要注意的是，我们这里使用的是该方法的一个变形，原理相似。

> `牛顿拉弗森迭代法`的主要思想就是通过猜测一个解，然后利用曲线在该猜测解处的切线与`解轴`的交点得到下一个猜测解，如果我们能够保证猜测解就在实际解的附近并且此处区域曲线二阶导可导且不变号，该方程经过多次迭代计算之后一定收敛与实际解。从此可以看出`牛顿拉弗森迭代法`的使用还是有一些限制的。

虽然`牛顿拉弗森迭代法`的使用有一些限制，但是我们可以在能确保快速收敛的区间使用`牛顿拉弗森迭代法`，其他特俗区间使用普适的方法。毕竟`cubic-bezier`大部分情况满足`牛顿拉弗森迭代法`收敛的情况。

`牛顿拉弗森迭代法`的迭代公式：

```javascript
X1 = X0 - F(X0)/F`(X0);
```

我们进行变形得：

```jade
N(t) = B(t) - X0;

// 代入迭代公式
t1 = t0 - N(t)/N`(t)

t1 = t0 - (B(t) - X0) / B`(t)
```

代码实现如下：

```javascript
function newtonRaphsonIterate(X0, guessT, mX1, mX2) {
  for (let i = 0; i < 4; ++i) {
    let currentSlope = getSlope(guessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return guessT;
    }
    let currentX = calcBezier(guessT, mX1, mX2) - X0;
    guessT -= currentX / currentSlope;
  }
  return guessT;
}
```

当不符合收敛条件或者不能确保收敛条件时使用普通的方法，例如二分法逼近实际解。

```javascript
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (
    Math.abs(currentX) > 0.00000001
    &&
    ++i < 10
  );
  return currentT;
}
```

最终我们利用这些方法就可以通过`js`实现插值，这个方法在我的[jcc2d](https://github.com/jasonChen1982/jcc2d)引擎里面也有用到[JC.Tween.Base](https://jasonchen1982.github.io/jcc2d/examples/#demo_animation_bezier)





