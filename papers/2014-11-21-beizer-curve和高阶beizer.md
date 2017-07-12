---
title: beizer-curve和高阶beizer
date: 2014-11-21
status: finished
author: jason82
---

上次我们讲到了一个`Catmull–Rom`的样条曲线，这次来聊聊我们最长见也最常挂在嘴边的样条曲线`beizer-curve`。

`beizer-curve`的一般公式是

![formula-beizer](https://wikimedia.org/api/rest_v1/media/math/render/svg/3e330568539637d3c302301b2a8b5a06a9ec5cad)

从公式可以看出，该公式具有可递归性。于是我们只需要了解其低阶的运算法则就可以了。

比如我们可以把最低阶的`beizer-curve`作为基础公式，然后在这基础上进行递归。

```javascript
// t为插值的进度
var rt = 1 - t;
var pv = rT * rT * p0 + 2 * t * rT * p1 + t * t * p2;
```

这样我们就可以通过函数递归来实现高阶的`beizer`曲线了

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

实现了N阶(n > 3)`beizer-curve`之后我们就可以在这基础上实现多种多样的效果，例如下面：

[motion-path](https://jasonchen1982.github.io/jcc2d/examples/demo_animation_motion/index.html)