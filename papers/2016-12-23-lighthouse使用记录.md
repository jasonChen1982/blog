---
title: lighthouse使用记录
date: 2016-12-22
---

## lighthouse

`lighthouse`是一个前端项目的检查审计工具，目前它可以分析一些谷歌开发者工具所能提供的部分信息，最后在分析结果上给出可行的优化方案。是一个值得期待的工具，说不定越往后发展，我们可以基于`lighthouse`和`chrome`提供的`debugging protocol`来开发一些自己的网页性能分析工具呢，想想都是很赞的事。

#### 颜色对比度

谷歌非常重视产品的无障碍性，一次在`lighthouse`里面集成了界面前景层和背景层之间的颜色对比度的检查，避免出现因为对比度低而看不清文字内容的情况。当然这个功能还有一个`chrome`的插件也提供，名字叫`ChromeLens`，大家感兴趣可以装来玩玩。

这个功能具体的分析和评估是由一个第三方模块实现的`axe-core`，这个模块是一个web UI的自动化测试引擎。具体可访问[axe core](https://github.com/dequelabs/axe-core)

#### 为PWA设置`start_url`

作为一个渐进式网络应用（PWA），应该在`manifest.json`有一个`start_url`属性。如果你的缓存缺少与 `start_url` 的精确值匹配的资源，这会生成一个不准确的结果，即使在实际场景中由于服务工作线程将请求重定向到缓存中的另一个资源从而能够成功解析请求。并不能直接代表什么。

#### 检查窗口是否是配

如果`window.innerWidth === window.outerWidth`则表示通过该标准。

#### 关键请求链

关键请求链这个概念源自关键渲染路径 (CRP) 优化策略。 CRP 通过确定优先加载的资源以及加载顺序，允许浏览器尽可能快地加载页面。关键渲染路径中的资源加载性能直接影响到页面的首次有效绘制的这个指标，直接关系到用户看到页面界面的时间。

该项审查会列出每个关键路径资源的加载时间，让开发者自己判断每个资源的加载性能。对于键渲染路径的优化方案一般都是

* 剥离非首屏渲染所要资源
* 异步加载阻塞渲染（render-blocking）的`js`
* 视情况合并和内联资源

关于浏览器资源加载的策略可以查看该信息[资源优先级](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)

#### Estimated Input Latency

用户在与应用交互是页面产生的延迟是最容易导致用户质疑应用的可用性和性能的指标。所以我们需要对该项进行评估得出一些优化指标，这里可以参考[render performance](https://developers.google.com/web/fundamentals/performance/rendering/)来优化你的应用。

#### First Meaningful Paint

首次有效绘制直接代表了页面呈现界面给用户的时间，针对这一点可以参考[优化关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)来做优化。

#### API suggestion

使用`performance`代替`console.time()`，使用的好处是该借口已经与开发者工具进行结合，能够在`timeline`录制的过程中显示出来。

更多[User Timing API](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/)可以点击这里了解。

#### 页面资源的规划

`css`资源如果加载缓慢会严重影响页面的首次渲染时间，所以我们应该尽量让首屏的样式资源尽快加载甚至内联更多信息请查看[阻塞渲染的 CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css) 。

`<script>` 标记，其具有以下特征：

- 位于文档的 `<head>` 中。
- 没有 `defer` 属性。
- 没有 `async` 属性。

`<link rel="stylesheet">` 标记，其具有以下特征：

- 没有 `disabled` 属性。如果具有此属性，则浏览器不会下载样式表。
- 没有与用户的设备匹配的 `media` 属性。

`<link rel="import">` 标记，其具有以下特征：：

- 没有 `async` 属性。

#### 不使用 document.write()

对于网速较慢（如 2G、3G 或较慢的 WLAN）的用户，外部脚本通过 `document.write()` 动态注入会使主要页面内容的显示延迟数十秒。

注意并不是所有的`document.write()`都是阻塞渲染的，所以想了解详情，请参阅[干预 `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write) 了解更多信息。

#### Mutation Events

以下突变事件会损害性能，在 DOM 事件规范中已弃用：

- `DOMAttrModified`
- `DOMAttributeNameChanged`
- `DOMCharacterDataModified`
- `DOMElementNameChanged`
- `DOMNodeInserted`
- `DOMNodeInsertedIntoDocument`
- `DOMNodeRemoved`
- `DOMNodeRemovedFromDocument`
- `DOMSubtreeModified`

Lighthouse 报告它在您的代码中发现的每个突变事件侦听器。 将每个突变事件替换为 `MutationObserver`。请参阅 MDN 上的 [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) 以获取更多帮助。

#### 不使用旧版 CSS Flexbox

Lighthouse 列出了它在页面样式表中找到的 `display: box` 的每个实例。 将每个实例替换为新语法，`display: flex`。

如果样式表当前在使用 `display: box`，则它可能在使用其他已弃用的 Flexbox 属性。 简言之，以 `box` 开头的每个属性（如 `box-flex`）已弃用并且应予以替换。 请参阅 [CSS Flexbox 2009/2011 规范语法属性对应关系](https://wiki.csswg.org/spec/flexbox-2009-2011-spec-property-mapping)以准确了解旧版属性与新版属性的对应关系。

#### Time to Interactive

可交互时间指的是布局已趋于稳定、关键的网络字体可见且主要线程足以处理用户输入的时间点。

请注意，此指标还处于早期阶段，可能随时发变化。