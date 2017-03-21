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

   ## 

#### 构建react-native应用的技术栈

主要运用 `react-naitve` 构建原生应用，它封装了常用的手机端原生接口、组件, js 语法基于 `React` 。

 `React` 是 脸书 经典的MVVM框架，用于快速构建用户界面。在应用中为每一个状态数据提供简单的视图，当数据变化时，它能够高效的更新并渲染相应的组件。

视图和数据是应用开发中两个很重要的组成部分，其中数据处理的方式影响了整个应用性能， 因此在 `iuwei`中 借助 `redux`  （对比flux），一个高效处理数据逻辑并更新的框架，进行 **前端数据库**的构建 , 处理数据逻辑。

`redux-persist` 能够持久化数据的 redux 中间件，在应用中通过 **数据本地存储** ,进行数据持久话。

`redux-thunk` `redux-promise` 是  的中间件，相比于vuex..

前面说到的 redux是可以结合许多前端界面库一起应用在项目中。 其中在react中，官方推崇 `react-redux`  对 redux进行相互绑定。它运用 react 高阶组件的思维，将redux快速注入到项目中。

`sagas`  是一种长事物模型，系统内管理side-effects的途径,  系统中需要协程多个action和side-effects。可以理解成与系统交互的永久线程，就是做了以下三项工作：对中的acion dispach事件做出反应 、dispach新的actions、在没有action被dispath的情况下能够运用内部机制进行自我苏醒

在`redux-sagas`中,saga是一个个的generator函数，能够无限次运行在系统中，当action被dispath 的时候，它能够唤起相应的操作。在项目中主要是结合数据请求进行数据的异步操作。除此之外，他也可以做所有与state相关的异步操作，这样保持视图和action creator 是纯函数

## 

#### 搭建开发环境

## 

#### 文件结构

```
iuwei/                      	# project name
|-- android/                    # android源文件及配置
    |-- build.gradle        	# app编译配置
    |-- app/     
        |-- build.gradle        # 项目编译配置
        |-- build/ 
            |-- outputs         # 打包编译输出文件
        |-- src/ 				# android 原生代码
            |-- java         	# java包
            |-- res         	# app icon、name
            |-- AndroidManifest.xml         # android 清单
    ···
|-- ios/                        # ios源文件及配置
    |-- iuwei/     
        |-- AppDelegate.m       # m 头文件 @private
        |-- AppDelegate.h       # h 头文件 @protected
        |-- Info.plist          # app配置项
        |-- Images.xcassets          # app icon、launchImage
    ···
    ···更多配置项打开xcode进行可视化配置
    
|-- js/                         # 前端js 文件
  |-- actions/                	# redux action
      |-- index               	# action 入口文件
      ···
  |-- reducers/               	# redux reducers
      |-- index               	# reducer 入口文件
      ···
  |-- store/                  	# redux store
      |-- configureStore.js   	# store 配置文件
      ···                     	# 中间件
  |-- sagas/                 	# sagas
  |-- services/                 # 请求接口
  |-- utils/                 	# 通用工具函数
  |-- common/                 	# 通用组件文件
  |-- modules/                  # 模块组件
  |-- setup.js                	# redux注入文件
  |-- App.js            		# 组件主入口
  |-- AppNavigator.js      		# 导航
|-- update.json                 # 热更新配置文件
|-- index.android.js            # android入口文件
|-- index.ios.js                # ios入口文件
|-- package.json                # 管理项⽬的依赖
|-- .babelrc               		# babel编译配置
|-- .editorconfig               # ediforconfig 代码书写配置
|-- .eslintrc                   # eslint 代码规范性检查配置
|-- .gitignore                  # git 仓库文件忽略配置
```

## 

#### 构建项目框架的思路

react的是一个以数据驱动的框架，官方为了不让组件过于复杂，推出了在一个小组件中将HTML、css 写在一个js文件中，但是在复杂逻辑当中，组件会显得杂乱，父子组件的交互也不利于后期的维护，所以最初的想法是一定要用一个框架专门来管理数据，这样，每个组件文件会显得纯净一些。所以选择了官方推出的redux。

当然在引入redux的时候，又遇到另外一个问题，怎样处理异步请求？在做react-native 的最初版demo的时候，通过redux中的middleware（有很多柯里化的编码思维）, 写了一个通用的请求中间件，当然官方也有一些中间件可以实现dispath 函数，实现promise等等，这写中间件完全可以满足普通的开发需求。

但是当要真正做一个项目应用的时候会发现很多问题。就只是说异步请求数据方面，占了很大的一部分，接口很多，而且用户的很多操作都需要进行数据请求：一个交互需要要进行多个数据请求，这些请求需要是并发，或同步进行，有时需要在请求回来的数据中，在进行state的数据操作，接着可能要继续进行请求。第一反应当然是要优化middleware request.js ,但是要实现着么多种功能需求，一般的参数封装显然是不符合正常的编码思维的。

于是找到了一款优秀的处理异步的框架 redux-sagas.它可以实现上述异步请求数据的需求，之后再把所有的接口请求提取出来，从而实现了代码功能块的分离。

#### redux数据流。



#### react的组件化思维

1. 介绍react的组件化思路。以基于redux-form写的表单验证功能为实例 。

#### 构建原生应用

1. 以登录登出演示实际的应用场景。