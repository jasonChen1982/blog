---
title: bezier-curve和高阶bezier
date: 2014-11-21
status: finished
author: jason82
---

上次我们讲到了一个`Catmull–Rom`的样条曲线，并且利用`Catmull–Rom`样条函数的算法我们可以实现让一个物体沿着指定的路径平滑移动，并且插值出来的路基会通过控制点，这一特性也经常被用来实现类似自动路径规划的功能上。

这次我们来聊聊最长见也最常挂在嘴边的样条曲线`bezier-curve`，`bezier-curve`的使用非常广泛，例如我们前端经常接触到的`transition-timing-function`里面的`ease`、`ease-in`、`ease-out`等等这些都是基于`bezier-curve`的特定实现。

`bezier-curve`的一般公式是

![formula-bezier](https://wikimedia.org/api/rest_v1/media/math/render/svg/3e330568539637d3c302301b2a8b5a06a9ec5cad)

从公式可以看出，该公式具有可递归性（程序员最爱这种可递归的公式啦）。于是我们只需要了解其低阶的运算法则就可以实现任意高阶的`bezier-curve`运算啦。

比如我们可以把最低阶的`bezier-curve`作为基础公式，然后在这基础上进行递归。

```javascript
var t = 0.1; // 设t为当前的插值的进度
var rt = 1 - t;
var pv = rT * rT * p0 + 2 * t * rT * p1 + t * t * p2;
```

这样我们就可以通过函数递归来实现高阶的`bezier`曲线了

```javascript
function getPoint(points, t) {
  var a = points;
  var len = a.length;
  var rT = 1 - t;
  var l = a.slice(0, len - 1);
  var r = a.slice(1);
  var oP = new Point();
  if (len > 3) {
    var oL = getPoint(l, t);
    var oR = getPoint(r, t);
    oP.x = rT * oL.x + t * oR.x;
    oP.y = rT * oL.y + t * oR.y;
    return oP;
  } else {
    oP.x = rT * rT * a[0].x
      + 2 * t * rT * a[1].x
          + t * t * a[2].x;
    oP.y = rT * rT * a[0].y
      + 2 * t * rT * a[1].y
          + t * t * a[2].y;
    return oP;
  }
}
```

实现了N阶(n > 3)`bezier-curve`之后我们就可以在这基础上实现多种多样的效果，例如下面：

![CatmullRom-motion](https://jasonchen1982.github.io/blog/source/images/bezier-cuver.gif)

点击查看 [cubic-bezier](https://jasonchen1982.github.io/jcc2d/examples/#demo_animation_bezier)