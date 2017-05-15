---
title: 用react-native开发原生应用 (iuwei)
date: 2017-01-02
status: doing
author: https://github.com/woshi82
---



## 前言

大家都知道，前端领域的技术栈更新的飞快，也有很多能够开发原生应用的框架，比如说：

react-native 、weex、ionic、cordova(phone gap)、intelXDK。

在一年前用ionic开发过一个`周报系统`, 主要功能是能够在手机端进行周报日报的一个编辑、查看。ionic这个框架综合了cordova和angular，当时进行开发的时候主要应用了原生的webview API，将写的前端页面嵌入到应用中。当时的开发完还是挺开心的，但是就是在运行速度上有一些慢。

这段时间用react-native开发了一些demo和一个应用，并且上线在各个应用市场、appstore。发现react-native开发的手机性能确实很顺畅。这很好的说明封装一些原生的API给开发者去调用的思路是可行的，时效性上也比IOS、android两个端的开发人员分别开发要好。

这篇文章主要是通过写的一个react-native demo [iuwei][iuwei],分享如何用react-native开发原生应用。当然也有已经上线的产品 赛狗运营端 （TODO: 添加链接）



## 文件结构

我们先大概看一下整个项目的目录结构

![文件结构][文件结构]



## 事例演示

iuwei 目前只有 登录功能、个人中心、退出功能，具体可以直接看uiwei [READEME][iuwei]。虽然功能很简单，但是我们我们的目标是通过优雅的代码，可以由浅入深的去编写一个react-native应用。

## 构建react-native应用的技术栈

![技术栈][技术栈]



###  React-native

基于react语法的构建手机应用的框架。它封装了常用的手机端原生接口、组件, 能够实现写一套代码兼容IOS、Android 两个平台 。

既然react-native是基于react语法的，那其实我们开发一个应用中就会用到很多react，也必然要先了解一下什么是react。

### React

 react 是facebook推出的一个经典MVVM框架，用于快速构建用户界面。

![react][react]

* component、view：在应用中react为每一个状态数据提供简单的视图，当数据变化时，它能够高效的更新并渲染相应的组件。因此，react是一个数据驱动的框架。
* jsx：组件的渲染都依赖于虚拟DOM，它是使用 XML 语法编写 Javascript 的一种语法糖。在react中通过在虚拟DOM中对数据进行一些预处理来减少对真实DOM操作，以此来提升性能。
* 组件化： 你会发现react它和传统模式不同的是声明式的渲染和至上而下的数据流，因此编写react应用大多数都是围绕着组件在进行的。组件化编码是react很重要的部分，一个优秀的组件不仅可以使逻辑思维更加清晰、代码复用率更高、代码更加模块化，而且也有利于后期的维护。针对这个方面，react社区中也提出了很多组件化的思维，可以参考：
  * HOC， higher order component，高阶组件

  * pure render component， 纯渲染组件

  * render logic， 渲染逻辑复用组件

  * Utility Methods，共用方法复用

  * Context， 上下文环境  

    ​


在react-native中的一个react组件大概长什么样子：

```javascript
// LoginLayout.js
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	PixelRatio,
} from 'react-native';
import Header from '../../common/Header';
export default class LoginLayout extends Component {
  loginHandler = () => {}
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>iuwei.</Text>
        <TextInput
            style={styles.input}
            placeholder="用户名"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => {this.password.focus();}}
        />
        <TextInput
            style={styles.input}
            ref={(r) => {this.password = r;}}
            placeholder="密码"
            enablesReturnKeyAutomatically  //未输入时键盘的确定按钮不能点
            returnKeyType="done"
            blurOnSubmit   // 点击键盘的确定 收起键盘
            onSubmitEditing={() => {this.loginHandler(); }}
        />
        <TouchableOpacity style={styles.btn} onPress={this.loginHandler}>
          <Text style={styles.btnText}>登录</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forget}>忘记密码?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 100,
  },
  ...
});
```

这段代码最后呈现的样子就是iuwei的登录界面。你会发现,这段代码非常好理解。分为3个部分，

* 依赖的引用：在这里需要注意的是引入了，react-native封装的原生组件，比如说View是原生视图，有些类似于html的div。想大概了解react-native封装了哪些原生组件，可以看[文档][react-native官网文档] 或 [中文文档][react-native中文网文档]
* react component 渲染函数中的jsx：编写jsx有些类似于html的布局，更类似于vue 组件的编写。里面包括了一些数据绑定。
* 样式表： 这里和css不同的是，react-native 将样式封装成了js函数。这种做法也是为了让前端适应css的编码。当然它最后还是会编译成原生识别的样式。



由于react是一个数据驱动的框架，所以在在延伸后面的内容前，必须补充两个react中经常用到的进行数据处理的语法。

* state: 用于存储react应用中的变量，例如：当我们点击按钮需要改变一个按钮的状态时，可以先定义 `this.state.btn = false`, 然后通过 `this.setState({btn: true})`进行赋值。

* props: 父子间传递数据，有些类似于html的attribute。如上例`<TextInput placeholder="用户名"/>`，placeholder就是一个prop, 在组件中可以通过`this.props.placeholder` 获取到字符串。

  ​

更多react语法可以参考这里 [react文档][react文档]。

我们可以再补充一下项目的目录结构了：



![文件结构-react组件][文件结构-react组件]



到此为止，你是否会感觉对于一个有一些前端基础的人，编写一个react-native的组件特别简单，因此，编写一个应用也是手到擒来。确实，可以尝试编写一个应用了。

但是在实践中你会发现，一个应用不仅仅是由简单的页面构成的，其中它还包括各个页面的逻辑交互，组件中存在多状态传递。组件之间需要数据的共享。比如说应用中需要用到的用户数据，不仅仅是登录、注册、修改密码、个人中心等页面需要用到，对于主功能区块：新闻列表、用户操作等很多页面都需要用用户数据，如果把用户数据零散地分布在各个组件中肯定不是我们想要的，更是不优雅的，很不利于后期维护。

所以我们来考虑把一些公用数据、逻辑复杂、数据量大的数据抽离组件，用一个工具专门来管理，这样每个组件只需要去负责读、取数据，这样岂不是优雅很多，也有利于后期的维护，保持了组件的纯净性。

### Redux

redux是facebook官方推荐的，专门用于数据管理的工具。初步地，可以将它分为3个模块。

#### 3个模块

![redux-flow][redux-flow]

依据最开始的react组件事例，

在用户界面中，我们点击登录按钮就会调用`loginHandler()`函数方法。此时在函数中我们可以直接调用redux的dispatch函数，dispatch一个action。

* action：就是一个简单的JSON对象，其中定义了一个键值，type： action的名称，payload：需要传递的负载参数。在这里直接调用 `dispatch({type: 'login', username: this.username._lastNativeText, password: this.password._lastNativeText})`, 之后会经过reducer。
* reducer：是一个函数，返回处理之后的state数据。它接收两个参数： prevState ,前一个state状态数据；currentAtion,当前被dispatch的action。在这里必然会接收到username、password，然后进过简单的数据逻辑处理，返回一个最终处理之后的state。
* store: state 树，当它监听到它的state改变了，就会及时更新到组件中，并反映到用户界面。

就是一个这样的数据流，我们它时如何在代码中体现的：

```javascript
<!-- js/store/index.js-->
/** 创建store树 */
import { createStore } from 'redux';
import reducer from '../reducers/index.js';
store = createStore(reducer)

<!--js/Setup.js (根组件)-->
/** 将store注入在根组件 */
import store from './store/index';
<View store={store}></View>

<!--js/module/login.js-->
/** 在loginHandler函数中调用*/
store.dispatch(loginReduxAc({
    username: this.username._lastNativeText
    password: this.password._lastNativeText
}));

<!--js/action/index.js-->
/** loginReduxAc是一个action creator 构造器，它返回的就是一个action对象*/
export const loginReduxAc = data => action(LOGIN, { ...data });

<!--js/action/types.js-->
/** action creator function */
export const action = (type, payload = {}) => {
    return { type, ...payload };
};

<!-- js/reducers/index.js -->
const login = (state = {islogin: false, info: {}}, action) => {
    if (action.type === LOGIN){
      	... 这里处理一些简单的逻辑
        return {
            isLogin: true,
            info: {
                username: action.username,
            }
        }                  
    }
    return state;
}
export default combineReducers({
    login,
    ...
});

// 你会发现store树的数据结构就是 定义的reducer的数据结构
store = {
    login: {login: false, .....}
}
```

提一个问题： 什么是pure function?

> pure function：纯函数。一般函数是无状态的, 就像react的render函数一样, 用户输入什么调用的时候就应该输出什么，并且不会影程序的其它部分，这就是我们说的纯净的函数，redux中的reducer就是纯函数，里面只是处理一些简单的逻辑。
>
> side-effects：实际上很多函数会影响代码的其它部分，改变全局变量；影响程序的状态，比如说一些异步操作，这些影响就叫做副作用。



#### middleware

中间件，是接收请求到响应的过程，本质是hack。熟悉node express的同学并不会陌生。在redux中也存在middleware，并且发挥着很大的作用。

先来了解一下它的本质：

```javascript
function m1(store){
    const next = store.dispatch;
    store.dispatch = function(action) {
        console.log('m1 begin');
        next(action);
        console.log('m1 end');
    }
}
function m2(store){
    const next = store.dispatch;
    store.dispatch = function(action) {
        console.log('m2 begin');
        next(action);
        console.log('m2 end');
    }
}
m2(store);
m1(store);
store.dispatch({type: 'EE'});

结果：
m1 begin > m2 begin > m2 end > m1 end
```

打印的结果，是传统子例程的堆栈方式： 先进后出。

**在redux中的middleware本质就是对store.dispatch的重写。**

在实际中我们并不想像上面一样对中间件一个一个分散的注入，所以对上面的代码进行一个改进：

```javascript
function n1(store){
    return function(next){
        return function(action) {
            console.log('n1 begin');
            next(action);
            console.log('n1 end');
        };
    };
}
function n2(store){
    return function(next){
        return function(action) {
            console.log('n2 begin');
            next(action);
            console.log('n2 end');
        };
    };
}
function applyMiddlewareSimilar(store, ...middlewares) {
    middlewares = middlewares.slice();
    middlewares.reverse();

    let dispatch = store.dispatch;
    // 在每一个 middleware 中变换 dispatch 方法。
    middlewares.forEach(middleware =>
            dispatch = middleware(store)(dispatch)
    );
    return Object.assign({}, store, { dispatch })
}
applyMiddlewareSimilar(store, n1, n2)
store.dispatch({type: 'EE'});
```



!!! 未完 待续……





















## react-native 的优势和弊端

### 弊端

1. 现在开发的应用都是一些展示性的应用，类似于`知乎`之类的，一些复杂的需要调取很多原生接口的应用比如说`兔子骑行`还没有实践过。

2. 布局的兼容性，特别是android端机型不同、分辨率不同有：

   lineHeight 基准点不一样可能经常要借助 includeFontPadding: false ， textAlignVertical: 'top',或者直接不用这个属性。

3. 对原生的API支持还有限，IOS和android上用的属性或API可能会不同：onkeypress、letterspace,如果一定要用，需要修改源码，并编译。有一些原生功能也可以查找第三方插件：camera、 

4. 动画是卡顿的，有些机型表现不一样，需要深入的优化。

5. 还是需要掌握一些原生的东西：打包、打包配置、写一些自定义的原生功能。

### 优势

1. 有JS的功底就可以写APP，而且可以兼容IOS、Android,很是酷炫。
2. 具有React的优势，数据驱动，高度组件化，很好的管理应用数据，性能好。
3. 生态圈够大，维护者很多，编写应用中遇到的问题，大多都可以到github、stackoverflow上找到解决方案，连一些原生的东西都很多。





视图和数据是应用开发中两个很重要的组成部分，其中数据处理的方式影响了整个应用性能， 因此在 `iuwei`中 借助 `redux`  （对比flux），一个高效处理数据逻辑并更新的框架，进行 **前端数据库**的构建 , 处理数据逻辑。

`redux-persist` 能够持久化数据的 redux 中间件，在应用中通过 **数据本地存储** ,进行数据持久话。

`redux-thunk` `redux-promise` 是  的中间件，相比于vuex..

前面说到的 redux是可以结合许多前端界面库一起应用在项目中。 其中在react中，官方推崇 `react-redux`  对 redux进行相互绑定。它运用 react 高阶组件的思维，将redux快速注入到项目中。

`sagas`  是一种长事物模型，系统内管理side-effects的途径,  系统中需要协程多个action和side-effects。可以理解成与系统交互的永久线程，就是做了以下三项工作：对中的acion dispach事件做出反应 、dispach新的actions、在没有action被dispath的情况下能够运用内部机制进行自我苏醒

在`redux-sagas`中,saga是一个个的generator函数，能够无限次运行在系统中，当action被dispath 的时候，它能够唤起相应的操作。在项目中主要是结合数据请求进行数据的异步操作。除此之外，他也可以做所有与state相关的异步操作，这样保持视图和action creator 是纯函数

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
        |-- AppDelegate.m       # m 文件 @private
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


[技术栈]: https://jasonchen1982.github.io/blog/source/react-native/tech.png	"技术栈"
[react]: https://jasonchen1982.github.io/blog/source/react-native/react.png	"react"
[redux-flow]: https://jasonchen1982.github.io/blog/source/react-native/redux-flow.png	"redux-flow"
[iuwei]: https://github.com/woshi82/iuwei	"jiuwei"
[文件结构]: https://jasonchen1982.github.io/blog/source/react-native/folder1.png	"文件结构"
[文件结构-react组件]: https://jasonchen1982.github.io/blog/source/react-native/folder2.png	"文件结构-react组件"
[react-native官网文档]: http://facebook.github.io/react-native/docs/getting-started.html	"react-native官网文档"
[中文文档]: http://reactnative.cn/docs/0.44/getting-started.html	"中文文档"
[react文档]: https://facebook.github.io/react/docs/hello-world.html	"react文档"

