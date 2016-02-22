// 载入 tpack 包。
var tpack = require("../lib/index.js");
tpack.destPath = "_dest";

// 设置全局忽略的路径。
tpack.loadIgnoreFile(".gitignore");
tpack.ignore(".*", "_*", "$*", "*~");

function compile() {
    tpack.src("*.scss", "*.sass").pipe(require("tpack-node-sass")).dest("$1.css");
    tpack.src("*.less").pipe(require("tpack-less")).pipe(require("tpack-autoprefixer")).dest("$1.css");
    tpack.src("*.es", "*.es6", "*.jsx").pipe(require("tpack-babel")).dest("$1.js");
    tpack.src("*.coffee").pipe(require("tpack-coffee-script")).dest("$1.js");
    tpack.src("*.md", "*.markdown").pipe(require("tpack-node-markdown")).dest("$1.html");
    
    tpack.src("*.html", "*.htm", "*.js", "*.css").pipe(require("tpack-assets").js, {
        
        // require 未包含扩展名时，尝试自动追加的扩展名。
        extensions: ['.json', '.jsx', '.es', '.es6', '.coffee', '.js', '.scss', '.less', '.css'],
        
        // require 全局搜索路径。如果未指定则不启用全局搜索功能，所有路径均为相对路径。
        paths: ["libs"],
        
        // 将包含以下扩展名的文件自动导出到外部文件，而非放入当前文件。
        exports: {
            // 导出 JS 中依赖的 CSS 文件到同名 CSS 文件。
            'css': '../styles/$1.css',
            // 导出 JS 中依赖的 CSS文件到同名 
            'resources': '../images/',
        },
        
        // 自动排除以下文件。
        exclude: ["assets/common.js"]
    });

}

function test() {
    
    // 直接生成文件。
    tpack.src().pipe(function (file, options, builder) {
        return "此项目是从 " + builder.srcPath + " 生成的，不要修改！生成时间：" + new Date()
    }).dest("NOTE.txt");
    
    // 合并特定文件。
    tpack.src("full-test.html").pipe(require('tpack-concat')).dest("full-test-2.html");
    
    tpack.src("*.html", "*.htm", "*.js", "*.css").pipe(require("tpack-assets"), {
        paths: ["libs"],
        extensions: ['.json', '.jsx', '.es', '.es6', '.coffee', '.js', '.scss', '.less', '.css'],
	//n    odejs: true
   // resolveUrl: tpack.cmd === "server" ? false : true
    });

//if (tpack.cmd === "build") {
//	// 资源文件夹下的文件统一使用 md5 命名。并重命名到 cdn_upload 目录。
//	tpack.src(/^((scripts|styles|images|fonts|resources)\/([^\/]*\/)*[^\.]*?)\.(.*)$/i).dest("cdn_upload/$1_<md5_6>.$4");
//	tpack.addCdnUrl("cdn_upload", "http://cdn.com/assets");
//}

}

tpack.task("build", function () {
    compile();
    
    // 压缩 CSS 和 JS。
    tpack.src("*.css").pipe(require('tpack-clean-css'));
    tpack.src("*.js").pipe(require('tpack-uglify-js'));
    
    tpack.build();
});

tpack.task("watch", function () {
    compile();
    tpack.watch();
});

tpack.task("server", function () {
    compile();
    tpack.startServer({
        proxy: "http://localhost:5389/aaa"
    });
});
