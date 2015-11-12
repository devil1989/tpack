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

__tpack__.define("scripts/blog.js", function(exports, module, require){
"use strict";

/* 这里放全部详情页的公共代码 */
if(a>2){}


});

__tpack__.define("scripts/jsx.jsx", function(exports, module, require){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _blogJs = require("scripts/blog.js");

var _blogJs2 = _interopRequireDefault(_blogJs);
});

__tpack__.require("scripts/jsx.jsx");