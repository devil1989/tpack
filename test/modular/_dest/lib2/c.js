var __tpack__ = __tpack__ || {
    modules: { __proto__: null },
    define: function(moduleName, factory) {
		var url = __tpack__.resolve(moduleName);
        return __tpack__.modules[url] = {
			url: url,
            factory: factory,
            exports: {},
			require: function(moduleName, callback){
				__tpack__.require(moduleName, callback, url);
			}
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
                    module.factory.call(module.exports, module.exports, module, module.require, moduleName);
                }
                return module.exports;
            }
            moduleName = [moduleName];
        }
        
    },
    
    resolve: (function() {
        var src = document.getElementsByTagName("script");
        src = src[src.length - 1].src;
        return function(url, baseUrl) {
            if (/(\/|^)\//.test(url)) {
                return url;
            }
            var a = document.createElement("a");
            a.href = (baseUrl || src) + "/../" + url;
            return a.href;
        };
    })()
};
__tpack__.define("c.js", function(exports, module, require){
exports.func = function() {
    alert("c");
};
});

__tpack__.require("c.js");