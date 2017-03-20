---
title: 用react-native搭建原生应用 (iuwei)
date: 2017-01-02
author: https://github.com/woshi82
---

#### react-native 的优势和弊端

##### 弊端

1. 布局的兼容性，特别是android端机型不同、分辨率不同有：

   lineHeight 基准点不一样可能经常要借助 includeFontPadding: false ， textAlignVertical: 'top',或者直接不用这个属性。

2. 对原生的API支持还有限，IOS和android上用的属性或API可能会不同：onkeypress、letterspace,如果一定要用，需要修改源码，并编译。有一些原生功能也可以查找第三方插件：camera、 

3. 动画是卡顿的，有些机型表现不一样，需要深入的优化。

4. 还是需要掌握一些原生的东西：打包、打包配置、写一些自定义的原生功能。

##### 优势

1. 有JS的功底就可以写APP，而且可以兼容IOS、Android,很是酷炫。
2. 具有React的优势，数据驱动，高度组件化，很好的管理应用数据，性能好。
3. 生态圈够大，维护者很多，编写应用中遇到的问题，大多都可以到github、stackoverflow上找到解决方案，连一些原生的东西都很多。

#### 构建react-native应用的技术栈

主要运用 `react-naitve` 构建原生应用，它封装了常用的手机端原生接口、组件, js 语法基于 `React` 。

 `React` 是 脸书 经典的MVVM框架，用于快速构建用户界面。在应用中为每一个状态数据提供简单的视图，当数据变化时，它能够高效的更新并渲染相应的组件。

视图和数据是应用开发中两个很重要的组成部分，其中数据处理的方式影响了整个应用性能， 因此在 `iuwei`中 借助 `redux`  （对比flux），一个高效处理数据逻辑并更新的框架，进行 **前端数据库**的构建 , 处理数据逻辑。

`redux-persist` 能够持久化数据的 redux 中间件，在应用中通过 **数据本地存储** ,进行数据持久话。

`redux-thunk` `redux-promise` 是  的中间件，相比于vuex..

前面说到的 redux是可以结合许多前端界面库一起应用在项目中。 其中在react中，官方推崇 `react-redux`  对 redux进行相互绑定。它运用 react 高阶组件的思维，将redux快速注入到项目中。

sagas 是处理   整个应用开发中，处理异步数据是一个通用的功能，

`redux-sagas` 是将sagas 快速注入redux 中。

#### 搭建开发环境

#### 文件结构

#### 构建项目框架的思路

#### redux数据流。

#### react的组件化思维

1. 介绍react的组件化思路。以基于redux-form写的表单验证功能为实例 。

#### 构建原生应用

1. 以登录登出演示实际的应用场景。