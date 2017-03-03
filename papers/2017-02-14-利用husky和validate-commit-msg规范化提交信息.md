---
title: 利用husky和validate-commit-msg规范化提交信息
date: 2017-02-14
---
## 为什么要规范化commit-msg

在以往，我们敲完代码的要做的第一件事就是提交变更的代码。提交代码的描述内容也是千奇百怪，各式各样。如果是团队协作开发的话，满足你自己喜好的提交信息就会给队友们造成困扰，搞到最后貌似自由自己看的懂。  

这样一来代码的提交信息的格式规范就显得很必要了，现在一般用的比较多的提交信息校验都是采用`husky`和`validate-commit-msg`来共同完成的。下面简单介绍两者以及一些细节。  

`husky`模块在安装和卸载的时候会分别运行该模块内放置的`install`钩子和`uninstall`钩子，配置如下：  

> ./package.json  

``` javascript
  "scripts": {
    "test": "mocha",
    "install": "node ./bin/install.js",
    "uninstall": "node ./bin/uninstall.js"
  },
```
查看源码发现`husky`在`install`的时候往项目的`.git/hooks`目录内写入一些脚本，这些脚本在你触发相应的`git`操作的时候会被`git`工具执行。大致的原理就是在这些脚本里面运行相应的`npm run xxx`命令，`husky`为我们注册的命令如下：  

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

`husky`会把这些命令注册到项目的`.git/hooks`下，注册过去的脚本一般包含了运行`npm`相应的`script`命令，例如注册到`.git/hooks`下的`commit-msg`脚本会在该脚本内运行`npm run commitmsg`（对的会去掉中划线`-`）。这样我们就可以在项目上放置各种检查校验任务了。  
接下来validate-commit-msg该出场了，validate-commit-msg的作用就是获取到`.git/COMMIT_EDITMSG`的内容，也就是你最近一次提交的信息。然后进行相应的格式化校验，如果校验通过则执行
```javascript
process.exit(0);
```
否则执行
```javascript
process.exit(1);
```
拒绝这次提交
