/*

	Uglify Js Error: 
		Unexpected token: punc (()
		At {2)

*/

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
__tpack__.define("../../../node-libs-browser/node_modules/process/browser.js", function(exports, module, require){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

});

__tpack__.define("common.js", function(exports, module, require){
var process = __tpack__.require("process");
/*

	Uglify Js Error: 
		Unexpected token: punc (()
		At {2)

*/

(this, function () {
    
    /* 105 */
    /*!*************************************************************************!*\
      !*** E:/work/Flight.Mobile.Hybrid/libs/~/react/lib/LinkedValueUtils.js ***!
      \*************************************************************************/
    /***/ function (module, exports, __webpack_require__) {

        /* WEBPACK VAR INJECTION */(function (process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule LinkedValueUtils
	 * @typechecks static-only
	 */

            var hasReadOnlyValue = {
                'button': true,
                'checkbox': true,
                'image': true,
                'hidden': true,
                'radio': true,
                'reset': true,
                'submit': true
            };

            function _assertSingleLink(inputProps) {
                !(inputProps.checkedLink == null || inputProps.valueLink == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a valueLink. If you want to use ' + 'checkedLink, you probably don\'t want to use valueLink and vice versa.') : invariant(false) : undefined;
            }
            function _assertValueLink(inputProps) {
                _assertSingleLink(inputProps);
                !(inputProps.value == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a valueLink and a value or onChange event. If you want ' + 'to use value or onChange, you probably don\'t want to use valueLink.') : invariant(false) : undefined;
            }

            function _assertCheckedLink(inputProps) {
                _assertSingleLink(inputProps);
                !(inputProps.checked == null && inputProps.onChange == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot provide a checkedLink and a checked property or onChange event. ' + 'If you want to use checked or onChange, you probably don\'t want to ' + 'use checkedLink') : invariant(false) : undefined;
            }

            module.exports = LinkedValueUtils;
            /* WEBPACK VAR INJECTION */
        }.call(exports, __webpack_require__(/*! (webpack)/~/node-libs-browser/~/process/browser.js */ 4)))

        /***/
    },
    /* 106 */
    /*!***********************************************************************!*\
      !*** E:/work/Flight.Mobile.Hybrid/libs/~/react/lib/ReactPropTypes.js ***!
      \***********************************************************************/
    /***/ function (module, exports, __webpack_require__) {

        /**
         *   var Props = require('ReactPropTypes');
         */


    /******/])
});
;
//# sourceMappingURL=common.js.map
});

__tpack__.require("scripts/common.js");