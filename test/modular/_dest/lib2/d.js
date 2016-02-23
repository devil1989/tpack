var __tpack__ = __tpack__ || {
    modules: { __proto__: null },
    define: function(moduleName, factory) {
		var url = __tpack__.resolve(moduleName);
        return __tpack__.modules[url] = {
            factory: factory,
            exports: {}
        };
    },
    require: function(moduleName, callback, baseUrl) {
        if (typeof moduleName === 'string') {
            if (!callback) {
                var module = __tpack__.modules[__tpack__.resolve(moduleName, baseUrl)];
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
            var url = __tpack__.resolve(moduleName[i], baseUrl);
            var onload = (function(url, i) {
                return function() {
                    exports[i] = __tpack__.require(url);
                    callback && --count <= 0 && callback.apply(null, exports);
                    delete __tpack__.prevUrl;
                }
            })(url, i);
            
            if (__tpack__.modules[url]) {
                onload();
            } else {
                __tpack__.prevUrl = url;
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
            a.href = (__tpack__.prevUrl || src) + "/../" + url;
            return a.href;
        };
    })()
};
__tpack__.define("c.js", function(exports, module, require){
exports.func = function() {
    alert("c");
};
});

__tpack__.define("d.js", function(exports, module, require){
var c = require("c.js");debugger;
require("../lib1/b.js", function(b) {
    b();
    c.func();
});
});

__tpack__.require("d.js");