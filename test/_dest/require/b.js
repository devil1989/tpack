var __tpack__ = __tpack__ || {
    modules: { __proto__: null },
    define: function(moduleName, factory) {
        return __tpack__.modules[__tpack__.resolve(moduleName)] = {
            factory: factory,
            exports: {}
        };
    },
    require: function(moduleName, callback) {
        if (typeof moduleName === 'string') {
            if (!callback) {
                var module = __tpack__.modules[__tpack__.resolve(moduleName)];
                if (!module) {
                    throw new Error("Cannot find module '" + moduleName + "'");
                }
                if (!module.loaded) {
                    module.loaded = true;
                    module.factory.call(module.exports, module.exports, module, __tpack__.require, moduleName);
                }
                return module.exports;
            }
            moduleName = [moduleName];
        }
        /*<asyncRequire>*/
        var exports = [];
        var count = moduleName.length;
        for (var i = 0; i < moduleName.length; i++) {
            var url = __tpack__.resolve(moduleName[i]);
            var onload = (function(url, i) {
                return function() {
                    exports[i] = __tpack__.require(url);
                    callback && --count <= 0 && callback.apply(null, exports);
                }
            })(url, i);
            
            if (__tpack__.modules[url]) {
                onload();
            } else {
                var script = document.createElement('script');
                script.src = url;
                script.onload = onload;
                var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                head.insertBefore(script, head.firstChild);
            }
        }
        /*</asyncRequire>*/
    },
    
    resolve: (function() {
        var src = document.getElementsByTagName("script");
        src = src[src.length - 1].src;
        return function(url) {
            if (/(\/|^)\//.test(url)) {
                return url;
            }
            var a = document.createElement("a");
            a.href = src + "/../" + url;
            return a.href;
        };
    })()
};
__tpack__.define("a.js", function(exports, module, require){
module.exports = function () {
    alert("a");
};
});

__tpack__.define("b.js", function(exports, module, require){
require("a.js")();
alert("b");
require("c.js", function(c) {
    c();
});
});

__tpack__.require("b.js");