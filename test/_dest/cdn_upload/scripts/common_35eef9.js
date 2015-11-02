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

__tpack__.define("scripts/common.js", function(exports, module, require){
/* 这里放全站的公共代码，如 jQuery */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libsSrcPartBB = require('undefined');

var _libsSrcPartBB2 = _interopRequireDefault(_libsSrcPartBB);
});

__tpack__.require("scripts/common.js");