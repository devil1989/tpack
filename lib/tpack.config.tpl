var tpack = require("tpack");

// 设置源文件夹。
tpack.srcPath = "";

// 设置目标文件夹。
tpack.destPath = "_dest";

// 设置全局忽略的路径。
tpack.loadIgnoreFile(".gitignore");
tpack.ignore(".*", "_*", "$*", "*~", "tpack*");

// 所有任务都需要先执行以下预编译的规则。
tpack.src("*.scss", "*.sass").pipe(require("tpack-sass")).dest("$1.css");
tpack.src("*.less").pipe(require("tpack-less")).pipe(require("tpack-autoprefixer")).dest("$1.css");
tpack.src("*.es", "*.es6", "*.jsx").pipe(require("tpack-babel")).dest("$1.js");
tpack.src("*.coffee").pipe(require("tpack-coffee-script")).dest("$1.js");

// 生成任务。
tpack.task('build', function (options) {
	
    // 压缩 CSS 和 JS。
    tpack.src("*.css").pipe(require('tpack-clean-css'));
    tpack.src("*.js").pipe(require('tpack-uglify-js'));

    // 开始根据之前定制的所有规则开始生成操作。
    tpack.build(options);

});