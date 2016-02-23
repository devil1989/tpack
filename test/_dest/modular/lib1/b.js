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
__tpack__.define("a.js", function(exports, module, require){
module.exports = function () {
    alert("a");
};
});

__tpack__.define("b.js", function(exports, module, require){
var a = require("a.js");
module.exports = function () {
    a();
    alert("b");
};
});

__tpack__.require("b.js");