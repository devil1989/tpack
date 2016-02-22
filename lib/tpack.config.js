var tpack = require("tpack");
tpack.destPath = "_dest";                               // 打包到此文件夹。
tpack.loadIgnoreFile(".gitignore");                     // 载入忽略文件。
tpack.ignore(".*", "_*", "$*", "*~", "node_modules");   // 默认忽略包。

function loadPlugin(name) {
    try {
        return require(name);
    } catch (e) {
        return function (file) {
            file.addError("无法生成此文件，模块“" + name + "”未安装。请执行“npm install " + name + " -g”安装此模块。");
        };
    }
}

function compile() {
    tpack.src("*.scss", "*.sass").pipe(loadPlugin("tpack-node-sass")).dest("$1.css");
    tpack.src("*.less").pipe(loadPlugin("tpack-less")).pipe(loadPlugin("tpack-autoprefixer")).dest("$1.css");
    tpack.src("*.coffee").pipe(loadPlugin("tpack-coffee-script")).dest("$1.js");
    tpack.src("*.es", "*.es6", "*.jsx").pipe(loadPlugin("tpack-babel")).dest("$1.js");
    tpack.src("*.html", "*.htm", "*.js", "*.css").pipe(require("tpack-assets"));
}

tpack.task("build", function () {
    compile();
    tpack.src("*.css").pipe(require('tpack-clean-css'));
    tpack.src("*.js").pipe(require('tpack-uglify-js'));
});

tpack.task("watch", function () {
    compile();
});

tpack.task("server", function () {
    compile();
});
