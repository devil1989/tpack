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
