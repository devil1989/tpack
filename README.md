# TPack 介绍
TPack 是一个使用 NodeJS 开发的项目构建工具。
对于前端项目，它可以实现代码预编译、打包、压缩等功能。

## 下载安装

1. 安装 NodeJS 和 npm。具体请参考 [NodeJS 官网](https://nodejs.org)
2. 使用 npm 下载 TPack:

    > npm install -g tpack
    > tpack -v                  # 验证 tpack 是否正确安装
  
## 首次使用

### 1. 在项目根目录新建 `tpack.config.js` 文件：              

    var tpack = require("tpack");

    // 定义 .txt 文件的处理方式。
    tpack.src("*.txt")
        .pipe(function(file, options, builder){  
            file.content = file.content.replace(/\s/g, "");
        })
        .dest("$1.out");
    
    // 定义生成任务。
    tpack.task("hello", function(options){
        tpack.build(options);
    });

### 2. 执行命令调用：

    > cd <项目根目录>
    > tpack hello

### 3. 对示例的解释

示例中，创建了一个名为 `hello` 的任务，然后通过命令行调用。

任务的内容为：遍历项目中所有 .txt 文件，删除其内容的空格然后保存为同名的 .out 文件。

## 实时编译(增量发布)

添加如下代码：

    tpack.task("watch", function(options){
        tpack.watch(options);
    });
    
然后通过命令行调用：
    
    > tpack watch

即可监听所有 *.txt 文件并在文件更新后重新生成。

## Web 服务器

TPack 自带 Web 服务器，通过这个服务器，可以在请求时自动生成。

    tpack.task("server", function(){
        tpack.startServer(8080);
    });

然后通过命令行调用：
    
    > tpack server

在浏览器打开 http://localhost:8080/a.txt，会发现文件内容已经被处理过了。

## TPack 和 Gulp/Grunt 的区别

TPack 更注重跟踪文件的变化。比如 a.less 被更新为 a.css 的时候，html 中引用了
a.less 的地址会被自动更新。通过此策略，TPack 拥有以下优势：

- 只在文件处理完成后才真正保存，减少硬盘读写时间，加快生成效率。
- 只需定义每个文件处理的方案，复杂的文件依赖关系就让 TPack 来处理吧。
- 无论是最终发布，还是开发时自动生成，都能共享配置。

除此以外，TPack 还作了以下细节优化：

- 只需全局安装一遍，不需要本地安装。
- 除了 Gulp 提供的 Watch 功能，还提供了更稳定、更快的 Web 服务器方案。
- 集成了插件常用功能，使插件开发起来更为简单易懂。
- TPack 推崇文件自描述，几乎不需要配置文件。避免项目变大配置难维护的问题。
- 考虑多数前端项目需求，提供了已集成常用插件的一键安装程序包：TPack-Web

## TPack-Web

TPack-Web 插件封装了前端项目的常用功能。只需三个命令，即可快速发布您的前端项目。

    > npm install -g tpack-web              # 安装 TPack-web
    > cd <要发布的项目根目录>
    > tpack-web -out ../build/

发布完成后，项目中所有文件都会拷贝到 ../build/，并作了以下处理：

1. 检查 Css/Js/Html 等语法错误。
2. 预编译 Less/Sass、Ee6/Jsx、CoffeeScript 等自定义语法。
3. 打包 AMD/CMD(require) 代码和 #include 指令。
4. 生成 Css 雪碧图。
5. 压缩 Css/Js 文件。
6. 为 Css/Js 引用路径追加时间戳以避免缓存。

除此之外，TPack-Web 还提供了：实时编译、模块自动加载、上传到 CDN、AJAX 接口模拟、占位图等功能。
具体请参考 [TPack-Web 主页](https://github.com/tpack/tpack-web)

## 文档

要查看入门教程、API 文档、插件开发指南，请进入：[文档页面](文档)

## 支持我们

- 欢迎通过[推送请求](https://help.github.com/articles/using-pull-requests)帮助我们改进产品质量。
- 如果您有任何项目需求和建议，欢迎[发送反馈](https://github.com/tpack/tpack/issues/new)。
