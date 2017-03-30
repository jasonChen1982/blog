---
title: 利用husky和validate-commit-msg规范化提交信息
date: 2017-02-14
status: finished
---
#### 为什么要规范化commit-msg

在以往，当我们美美的敲完一段代码要做的第一件事那就是提交代码。但是发现提交本次代码的描述内容也是千奇百怪，各式各样。如果是团队协作开发的话，难免会有一些表述不清楚的提交信息，也许这些信息会给队友们造成巨大的困扰，最后发现连自己都看不懂了，那就尴尬啦。

所以我们有必要从规范上遏制住那些没有意义的提交信息，采用一个规范的清晰的提交信息规范就显得很必要了。现在业界一般用的比较多的提交信息校验都是采用`husky`和`validate-commit-msg`这两个模块来共同完成的。下面简单介绍两者的使用以及一些细节。  

`husky`模块是一个用来在项目的`.git/hooks`目录下注册各种git操作的前后钩子的这么一个模块，这些钩子其实就是一些shell脚本，可以在里面运行一些命令，例如在钩子里面运行`npm run xxx`这样子。

当我们使用`npm i -D husky`来安装 `husky`模块的时候， `husky`模块在安装的时候会默认触发运行该模块内放置的`install`命令，找到 `husky`模块的`package.json`会发现如下配置：  

> ./husky/package.json  

``` javascript
  "scripts": {
    "test": "mocha",
    "install": "node ./bin/install.js",
    "uninstall": "node ./bin/uninstall.js"
  },
```
查看源码发现`husky`在`install`的时候会往项目的`.git/hooks`目录内写入一些脚本，这些脚本在你之后触发的相应`git`操作的时候会被`git`工具执行。大致的原理就是在这些脚本里面运行相应的`npm run xxx`命令，`husky`为我们注册的命令如下：  

> ./husky/src/hooks.json  

``` javascript
[
  "applypatch-msg",
  "pre-applypatch",
  "post-applypatch",
  "pre-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "pre-receive",
  "update",
  "post-receive",
  "post-update",
  "push-to-checkout",
  "pre-auto-gc",
  "post-rewrite"
]
```

实际上`husky`会把这些命令注册到项目的`.git/hooks`目录下，注册过去的脚本一般包含了运行`npm`的`script`相应命令，例如注册到`.git/hooks`下的`commit-msg`脚本包含了运行`npm run commitmsg`，除此之外还有很多其它动作的脚本，例如：`post-checkout` 、`pre-commit`等等上面提到的那些。

这样一来我们就只需要在自己的项目的`package.json`文件内注册好相应的`scripts`就好了。

```js
  "scripts": {
    "commitmsg": "validate-commit-msg"
  },
```

嗯～

接下来`validate-commit-msg`该出场了，`validate-commit-msg`的作用就是获取到git工具的`.git/COMMIT_EDITMSG`的内容，也就是你最近一次提交信息。然后进行相应的格式化校验，如果校验通过则执行

```javascript
process.exit(0);
```
否则拒绝这次提交执行
```javascript
process.exit(1);
```


##### 当然除了`husky`模块外，`pre-commit`模块也可以注册`.git/hooks`，同样可以配合`validate-commit-msg`来完成校验，具体就不介绍了。