# TPack 介绍
TPack 是一个使用 NodeJS 开发的项目构建工具。
对于前端项目，它可以实现代码预编译、打包、压缩等功能。

## 下载安装

1. 安装 NodeJS 和 npm。具体请参考 [NodeJS 官网](https://nodejs.org)
2. 使用 npm 下载 TPack:

    > npm install -g tpack

3. 下载 TPack 常用插件：       
     
    > npm install -g tpack-assets tpack-autoprefixer tpack-babel tpack-clean-css tpack-coffee-script tpack-concat tpack-less tpack-requirejs tpack-node-sass tpack-uglify-js tpack-node-markdown
 
## 首次使用

### 1. 在项目根目录新建 `tpack.config.js` 文件：

    var tpack = require("tpack");
    
    // 定义 .txt 文件的处理方式。
    tpack.src("*.txt")
        .pipe(function(file, options, builder){  
            file.content += "哈哈";
        })
        .dest("$1.out");
		
	tpack.run();
    
### 2. 发布项目

	> node tpack.config.js build
	
如果您已全局安装 tpack，也可以直接使用：

    > tpack build

执行后 TPack 会复制项目里所有文件到 _dest，其中所有 txt 文件末尾都会追加上“哈哈”两个字。

### 3. 实时编译(增量发布)

执行以下命令即可监听所有 *.txt 文件并在文件更新后重新生成。

    > tpack watch

### 4. Web 服务器

TPack 自带 Web 服务器：

    > tpack server -port 8080

在浏览器打开 http://localhost:8080/a.txt, 会发现文件内容已经被处理过了。

## 5. `tpack.config.js` 模板

    var tpack = require("tpack");

    // 设置文件夹。
    tpack.srcPath = "";
    tpack.destPath = "_dest";

    // 设置全局忽略的路径。
    tpack.loadIgnoreFile(".gitignore");
    tpack.ignore(".*", "_*", "$*", "*~", "tpack*");

    // 所有任务都需要先执行以下预编译的规则。
    tpack.src("*.scss", "*.sass").pipe(require("tpack-sass")).dest("$1.css");
    tpack.src("*.less").pipe(require("tpack-less")).pipe(require("tpack-autoprefixer")).dest("$1.css");
    tpack.src("*.es", "*.es6", "*.jsx").pipe(require("tpack-babel")).dest("$1.js");
    tpack.src("*.coffee").pipe(require("tpack-coffee-script")).dest("$1.js");
    
    // 为 HTML 追加时间戳、内联，为 JS 打包 require 。
    tpack.src("*").pipe(require("tpack-assets"), {
        resolveUrl: tpack.cmd !== "server"
    });

    // 压缩 CSS 和 JS。
    if(tpack.cmd === "build") {
        tpack.src("*.css").pipe(require('tpack-clean-css'));
        tpack.src("*.js").pipe(require('tpack-uglify-js'));
    }

	tpack.run();
    
## 比较

### TPack 和 Gulp/Grunt 的区别

TPack 的发布策略和 Gulp/Grunt 不同，具有以下优势：

1. TPack 能跟踪文件变化。比如 html 引用了 a.css，当 a.css 被重命名为 a_20050801.css 时，html 文件会自动更新。
2. 只需写一遍配置，即可同时用于发布、监听、服务器。`tpack.config.js` 不会随着项目变大而导致难以维护。
3. 只需全局安装一遍，不需要本地安装。

### TPack 和 Webpack 的区别

TPack 通过插件 `tpack-assets`，提供了和 Webpack 类似的模块化方案。

1. 配置更直观。 Webpack 需要指定每个目标文件怎么生成过来。 TPack 则需要指定每个源如何生成。 
2. 除了 watch，TPack 还支持更稳定的服务器方式。
Webpack 要求 html 引用生成好的 js 文件，TPack 则建议 html 引用源文件，比如 html 直接引用 less。
这样可以确保每次 html 引用的都是生成好的最新版。
3. 除了 require，TPack 支持简单的 #include。
4. Webpack 需要配置文件，配置会随着项目变大导致难以维护。TPack 则不需要，打包配置和其它配置是共享的。

## 项目实战

### 1. HTML 内联

通过 TPack 的插件 `tpack-assets`，可以轻松实现 HTML 内联语法，用法如下：

    <!-- #include virtual="header.inc" -->

更多说明和用法见 [HTML处理](https://github.com/tpack/tpack-assets/wiki/html)

### 2. JS 模块化

通过 TPack 的插件 `tpack-assets`，可以实现 CommonJs 模块化方案。
通过 TPack 的插件 `tpack-requirejs`，可以实现 AMD 模块化方案。
用法如下：

    require("./a.js");

打包后：代码会变成：

    var __tpack__ = __tpack__ || { ... };

    __tpack__.define("a.js", function(require, exports, module){ ... });

    __tpack__.define("b.js", function(require, exports, module){ 
        require("./a.js");
    });

    __tpack__.require("b.js");

更多说明和用法见 [Js 模块化](https://github.com/tpack/tpack-assets/wiki/js)

### 3. 代码压缩和时间戳

如果您有一个现成的 PHP 等项目，只需要压缩代码、加时间戳等功能，可以使用 `tpack-web` 插件。

只需两个命令，快速发布您的前端项目：

    > npm install -g tpack-web              # 安装 TPack-web
    > tpack-web -out ../build/

发布完成后，项目中所有文件都会拷贝到 ../build/，并作了以下处理：

1. 检查 css/js/html 等语法错误。
2. 预编译 less/sass、ee6/jsx、coffee-script 等自定义语法。
3. 打包 AMD/CMD(require) 代码和 #include 指令。
4. 生成 css 雪碧图。
5. 压缩 css/js 文件。
6. 为 css/js 引用路径追加 MD5 以避免缓存。

更多说明和用法见 [TPack-Web 主页](https://github.com/tpack/tpack-web)

## 文档

要查看入门教程、API 文档、插件开发指南，请进入：[文档页面](文档)

## 支持我们

- 欢迎通过[推送请求](https://help.github.com/articles/using-pull-requests)帮助我们改进产品质量。
- 如果您有任何项目需求和建议，欢迎[发送反馈](https://github.com/tpack/tpack/issues/new)。
