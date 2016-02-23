var tpack = require("tpack");
tpack.destPath = "_dest";
tpack.loadIgnoreFile(".gitignore");
tpack.ignore(".*", "_*", "$*", "*~", "node_modules");

function compile(options) {
    tpack.src("*.scss", "*.sass").pipe(tpack.plugin("tpack-node-sass")).dest("$1.css");
    tpack.src("*.less").pipe(tpack.plugin("tpack-less")).pipe(tpack.plugin("tpack-autoprefixer")).dest("$1.css");
    tpack.src("*.coffee").pipe(tpack.plugin("tpack-coffee-script")).dest("$1.js");
    tpack.src("*.es", "*.es6", "*.jsx").pipe(tpack.plugin("tpack-babel")).dest("$1.js");
    tpack.src("*.html", "*.htm", "*.js", "*.css").pipe(require("tpack-modular"));
}

tpack.task("build", function (options) {
    compile(options);
    tpack.src("*.css").pipe(require('tpack-clean-css'));
    tpack.src("*.js").pipe(require('tpack-uglify-js'));
});

tpack.task("watch", function (options) {
    compile(options);
});

tpack.task("server", function (options) {
    compile(options);
    tpack.startServer({
        url: "http://*:8080"
    });
});
