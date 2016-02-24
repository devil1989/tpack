# TPack
TPack 是一个使用 NodeJS 开发的基于规则的项目构建工具。
它可以为前端项目提供代码打包、压缩、优化等功能。

## 下载安装

1. 安装 NodeJS 和 npm。具体请参考 [NodeJS 官网](https://nodejs.org)
2. 使用 npm 下载 TPack:

    > npm install tpack -g

3. 下载 TPack 常用插件：       
     
    > npm install -g tpack-uglify-js tpack-clean-css tpack-autoprefixer tpack-modular tpack-concat tpack-babel tpack-coffee-script tpack-less tpack-node-markdown

## 首次使用

### 1. 在项目根目录新建 `tpack.config.js` 文件：

    var tpack = require("tpack");
    
    // 定义 .txt 文件的处理方式。
    tpack.src("*.txt")
        .pipe(function(file, options, builder){  
            file.content += "哈哈";
        })
        .dest("$1.out");

> 提示：可以使用 `tpack init` 命令自动生成 `tpack.config.js`。
    
### 2. 发布项目

	> tpack build
	
执行后 TPack 会复制项目里所有文件到 _dest，其中所有 txt 文件末尾都会追加上“哈哈”两个字。

### 3. 实时编译(增量发布)

执行以下命令即可监听所有 *.txt 文件并在文件更新后重新生成。

    > tpack watch

### 4. Web 服务器

TPack 自带 Web 服务器：

    > tpack server -port 8080

在浏览器打开 http://localhost:8080/a.txt, 会发现文件内容已经被处理过了。

### 5. 任务

TPack 可以定义多个任务，并根据需求执行不同的任务。在 `tpack.config.js` 中使用如下代码可以定义一个任务。

    tpack.task("hello", function(options){
        console.log(options.name);
    });

然后执行以下命令调用任务：

    > tpack hello -name world

在控制台将会到输出了 `world`。

> 提示：当直接执行 `tpack` 时，相当于执行了名为 `default` 的任务。

## `tpack.config.js` 模板

    var tpack = require("tpack");
    tpack.destPath = "_dest";
    tpack.server = "http://localhost:8088";
    tpack.loadIgnoreFile(".gitignore");
    tpack.ignore(".*", "_*", "$*", "*~", "node_modules");

    function compile(options) {
        tpack.src("*.scss", "*.sass").pipe(tpack.plugin("tpack-node-sass")).dest("$1.css");
        tpack.src("*.less").pipe(tpack.plugin("tpack-less")).dest("$1.css");
        tpack.src("*.css").pipe(tpack.plugin("tpack-autoprefixer"));

        tpack.src("*.coffee").pipe(tpack.plugin("tpack-coffee-script")).dest("$1.js");
        tpack.src("*.es", "*.es6", "*.jsx").pipe(tpack.plugin("tpack-babel")).dest("$1.js");

        tpack.src("*.md", "*.markdown").pipe(tpack.plugin("tpack-node-markdown")).dest("$1.html");
        tpack.src("*.html", "*.htm", "*.inc", "*.js", "*.css").pipe(tpack.plugin("tpack-modular"));
    }

    tpack.task("build", function (options) {
        compile(options);
        tpack.src("*.css").pipe(tpack.plugin('tpack-clean-css'));
        tpack.src("*.js").pipe(tpack.plugin('tpack-uglify-js'));
    });

    tpack.task("watch", function (options) {
        compile(options);
    });

    tpack.task("server", function (options) {
        compile(options);
    });

> tpack 内置了配置模板，如果您只想压缩 JS/CSS 代码，无需其它操作，直接调用 `tpack` 即可。

## 优势

- 配置简单
- 打包效率高
- 只需全局安装一遍，随时使用。
- 接口丰富，可以轻松地和其它工具集成。

### 和 Grunt 比较

TPack 可以比 Grunt 更方便灵活地描述打包需求。

### 和 Gulp 比较

Gulp 基于流发布，将源文件看成流然后一一处理。Tpack 则基于规则进行发布，源文件会根据定义的规则依次处理。此策略可以让 TPack 拥有以下 Gulp 很难实现的功能：

1. TPack 能跟踪文件变化。比如 html 引用了 a.css，当 a.css 被重命名为 a_20050801.css 时，html 内的引用也会自动更新。
2. 无论是实现发布、监听还是开发服务器，都共享同一系列规则。`tpack.config.js` 不会随着项目变大而导致难以维护。
3. 每个文件独立生成，可以事实查看进度。

### 和 Webpack 比较

TPack 通过插件 `tpack-modular`，可以实现和 Webpack 类似的模块化功能。

1. 都能实现 CommonJs 的模块化方案，并提供模块自动重加载（Hot Loader）功能吧；都能打包 NodeJs 模块。
2. `tpack-modular` 不提供 AMD 模块的支持，打包出的文件更清晰易读和通用。
3. 您也可以选择使用 `tpack-webpack` 来实现模块化方案。

## 模块化功能

要使用模块化功能，必须在配置文件中添加：

    tpack.src("*").pipe(require("tpack-modular"));

### 1. HTML 模板

在 HTML 中可以内联外部文件：

    <!-- #include virtual="header.inc" -->

更多说明和用法见 [HTML处理](https://github.com/tpack/tpack-modular/wiki/html)

### 2. JS 模块化

#### 同步加载

1. 定义文件 a.js

    module.exports = function(){
        alert("a");
    };

2. 定义文件 b.js

    var a = require("./a.js");
    a();

3. 打包后，b.js 会变成：

    var __tpack__ = __tpack__ || { ... };

    __tpack__.define("a.js", function(require, exports, module){ 
        module.exports = function(){
            alert("a");
        };
    });

    __tpack__.define("b.js", function(require, exports, module){ 
        var a = require("./a.js");
        a();
    });

    __tpack__.require("b.js");

#### 异步加载

4. 定义文件 d.js

    require("./c.js", function(c){
        alert(c);
    });

c.js 不会被打包进来，执行时会动态加载。

更多说明和用法见 [Js 模块化](https://github.com/tpack/tpack-modular/wiki/js)

### 3. 时间戳

默认地，所有地址引用都会追加 md5 值：

    <script src="a.js"></script>

发布后：

    <script src="a.js?_=2e24a3"></script>

更多说明和用法见 [时间戳](https://github.com/tpack/tpack-modular/wiki/url)

### 3. 内联文件

    <script src="a.js?__inline"></script>

发布后：

    <script>
        /* a.js 的源码 */
    </script>

## 文档

要查看入门教程、API 文档、插件开发指南，请进入：[文档页面](文档)

## 支持我们

- 欢迎通过[推送请求](https://help.github.com/articles/using-pull-requests)帮助我们改进产品质量。
- 如果您有任何项目需求和建议，欢迎[发送反馈](https://github.com/tpack/tpack/issues/new)。
