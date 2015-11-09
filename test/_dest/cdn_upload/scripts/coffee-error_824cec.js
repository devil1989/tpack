
                var __tpack__ = __tpack__ || {
	modules: { __proto__: null },
	define: function (moduleName, factory) {
		return __tpack__.modules[moduleName] = {
			factory: factory,
			exports: {}
		};
	},
	require: function (moduleName, callback) {
		var module = __tpack__.modules[moduleName];
		if (!module) {
			throw new Error("Can not find module: " + moduleName);
		}
		if (!module.loaded) {
			module.loaded = true;
			module.factory.call(module.exports, module.exports, module, __tpack__.require, moduleName);
		}
		return module.exports;
	}
};

__tpack__.define("scripts/coffee-error.coffee", function(exports, module, require){
/*

	Coffee Compilation Error: 
		unexpected identifier
		At {2)

*/

# 这里放 page2 页面本身的 js
a = 1
if a > 1
    a = 2 a # a is error
});

                module.exports = __tpack__.require("scripts/coffee-error.coffee");
            