
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

__tpack__.define("scripts/jsx-error.jsx", function(exports, module, require){
/*

	Babel Compilation Error: 
		SyntaxError: Unexpected token 
		At {2)

*/


import A;
});

                module.exports = __tpack__.require("scripts/jsx-error.jsx");
            