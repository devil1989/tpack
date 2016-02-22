/*

	Uglify Js Error: 
		Unexpected token: punc ())
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

__tpack__.define("../../../node-libs-browser/node_modules/path-browserify/index.js", function(exports, module, require){
var process = __tpack__.require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

});

__tpack__.define("../../../node-libs-browser/node_modules/base64-js/lib/b64.js", function(exports, module, require){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

});

__tpack__.define("../../../node-libs-browser/node_modules/ieee754/index.js", function(exports, module, require){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

});

__tpack__.define("../../../node-libs-browser/node_modules/is-array/index.js", function(exports, module, require){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

});

__tpack__.define("../../../node-libs-browser/node_modules/buffer/index.js", function(exports, module, require){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

var base64 = require("../../node-libs-browser/node_modules/base64-js/lib/b64.js")
var ieee754 = require("../../node-libs-browser/node_modules/ieee754/index.js")
var isArray = require("../../node-libs-browser/node_modules/is-array/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

});

__tpack__.define("../../../node-libs-browser/node_modules/util/support/isBuffer.js", function(exports, module, require){
module.exports = function isBuffer(arg) {
  return arg instanceof Buffer;
}

});

__tpack__.define("../../../node-libs-browser/node_modules/util/util.js", function(exports, module, require){
var process = __tpack__.require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require("../../node-libs-browser/node_modules/util/support/isBuffer.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require("../../node-libs-browser/node_modules/inherits/inherits.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

});

__tpack__.define("../../../tutils/io.js", function(exports, module, require){
/**
 * @fileOverview Extended exports Utilities for node.js
 * @author xuld@vip.qq.com
 * @license MIT license
 */

var FS = require("fs");
var Path = require("path");
var Util = require("util");

function copyFile(srcFile, destFile) {
    var BUF_LENGTH = 128 * 1024,
		buff = new Buffer(BUF_LENGTH),
		fdr = FS.openSync(srcFile, 'r'),
		fdw = FS.openSync(destFile, 'w'),
		bytesRead = 1,
		pos = 0;
    while (bytesRead > 0) {
        bytesRead = FS.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        FS.writeSync(fdw, buff, 0, bytesRead);
        pos += bytesRead;
    }
    FS.closeSync(fdr);
    return FS.closeSync(fdw);
}

function copyDir(sourceDir, newDirLocation) {

    /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
    var checkDir = FS.statSync(sourceDir);
    try {
        FS.mkdirSync(newDirLocation, checkDir.mode);
    } catch (e) {
        //if the directory already exists, that's okay
        if (e.code !== 'EEXIST') throw e;
    }

    var files = FS.readdirSync(sourceDir);

    for (var i = 0; i < files.length; i++) {
        var currFile = FS.lstatSync(sourceDir + "/" + files[i]);

        if (currFile.isDirectory()) {
            /*  recursion this thing right on back. */
            copyDir(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
        } else if (currFile.isSymbolicLink()) {
            var symlinkFull = FS.readlinkSync(sourceDir + "/" + files[i]);
            FS.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
        } else {
            /*  At this point, we've hit a file actually worth copying... so copy it on over. */
            copyFile(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
        }
    }
}

function createDir(p, mode) {
    p = Path.resolve(p);

    try {
        FS.mkdirSync(p, mode);
    } catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                createDir(Path.dirname(p), mode);
                createDir(p, mode);
                break;

            case 'EEXIST':
                var stat;
                try {
                    stat = FS.statSync(p);
                } catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
            default:
                throw err0
                break;
        }
    }

};

function walkDir(path, basePath, walker) {
    var rr = FS.readdirSync(path);

    path = path + Path.sep;
    for (var i = 0; i < rr.length; i++) {
        var newPath = path + rr[i];
        var s = FS.statSync(newPath);

        if (s.isFile()) {
            walker(basePath + rr[i], false);
        } else if (s.isDirectory()) {
            var dirPath = basePath + rr[i] + '/';
            if (walker(dirPath, true) !== false) {
                walkDir(newPath, dirPath, walker);
            }
        }
    }
}

function cleanDir(path) {
    var rr = FS.readdirSync(path);

    path = path + Path.sep;
    for (var i = 0; i < rr.length; i++) {
        var newPath = path + rr[i];
        var s = FS.statSync(newPath);

        if (s.isFile()) {
            FS.unlinkSync(newPath);
        } else if (s.isDirectory()) {
            cleanDir(newPath);
            FS.rmdirSync(newPath);
        }
    }
}

/**
 * 测试指定的路径是否存在。
 */
exports.exists = FS.existsSync;

/**
 * 测试指定的路径是否是文件。
 */
exports.existsFile = function (path) {
    return FS.existsSync(path) && FS.statSync(path).isFile();
};

/**
 * 测试指定的路径是否是文件夹。
 */
exports.existsDir = function (path) {
    return FS.existsSync(path) && FS.statSync(path).isDirectory();
};

/**
 * 确保指定文件所在文件夹存在。
 */
exports.ensureDir = function (path) {
    path = Path.dirname(path);
    if (!exports.exists(path))
        return createDir(path);
};

/**
 * 复制文件。
 */
exports.copyFile = function (srcFile, destFile, overwrite) {
    if (!exports.exists(srcFile))
        return false;

    if (exports.exists(destFile)) {
        if (overwrite === false) {
            return false;
        } else {
            FS.unlinkSync(destFile);
        }
    } else {
        exports.ensureDir(destFile);
    }

    copyFile(srcFile, destFile);
    return true;
};

/**
 * 复制文件夹。
 */
exports.copyDir = function (src, dest) {
    if (!exports.exists(src))
        return false;

    copyDir(src, dest);
};

/**
 * 创建文件夹。
 */
exports.createDir = createDir;

/**
 * 读取文件。
 */
exports.readFile = function (path, encoding) {
    if (exports.exists(path)) {
        encoding = encoding || "utf-8";
        var c = FS.readFileSync(path, encoding);
        if (/^utf\-?8/.test(encoding)) {
            c = c.replace(/^\uFEFF/, '');
        }
        return c;
    }
    return '';
};

/**
 * 写入文件。
 */
exports.writeFile = function (path, content, encoding) {
    exports.ensureDir(path);

    FS.writeFileSync(path, content, encoding || "utf-8");
};

/**
 * 打开文件流以读取。
 */
exports.openRead = function (path, optexportsns) {
    return FS.createReadStream(path, optexportsns);
};

/**
 * 打开文件流以写入。
 */
exports.openWrite = function (path, optexportsns) {
    exports.ensureDir(path);
    return FS.createWriteStream(path, optexportsns);
};

/**
 * 删除文件。
 */
exports.deleteFile = function (path) {
    if (exports.exists(path))
        FS.unlinkSync(path);
};

/**
 * 清空文件夹。
 */
exports.cleanDir = function (path) {
    if (exports.exists(path)) {
        cleanDir(path);
    }
};

/**
 * 删除文件夹。
 */
exports.deleteDir = function (path) {
    if (exports.exists(path)) {
        cleanDir(path);
        FS.rmdirSync(path);
    }
};

/**
 * 读取文件夹。
 */
exports.readDir = function (path) {
    return exports.exists(path) ? FS.readdirSync(path) : [];
};

/**
 * 遍历文件夹。
 */
exports.walkDir = function (path, walker, basePath) {
    if (exports.exists(path)) {
        walkDir(path, basePath || "", walker);
    }
};

/**
 * 获取所有子文件。
 */
exports.getFiles = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        if (!isDir) r.push(path);
    });
    return r;
};

/**
 * 获取所有子文件夹。
 */
exports.getDirs = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        if (isDir) r.push(path);
    });
    return r;
};

/**
 * 获取所有子文件和文件夹。
 */
exports.getDirAndFiles = function (path) {
    var r = [];
    exports.walkDir(path, function (path, isDir) {
        r.push(path);
    });
    return r;
};

});

__tpack__.define("../../../tutils/lang.js", function(exports, module, require){
Object.assign||(Object.assign=function(e,t){"object"==typeof console&&console.assert(null!=e,"Object.assign(target: 不能为空, source)");for(var n in t)e[n]=t[n];return e}),Object.clone=function(e){if(e&&"object"==typeof e)if(e instanceof Array){for(var t=[],n=0;n<e.length;n++)t[n]=Object.clone(e[n]);e=t}else if(e instanceof Date)e=new Date(+e);else if(e instanceof RegExp)e=new RegExp(e);else{var t={};for(var n in e)t[n]=Object.clone(e[n]);e=t}return e},String.format=function(e){"object"==typeof console&&console.assert(!e||"string"==typeof e,"String.format(format: 必须是字符串)");var t=arguments;return e?e.replace(/\{\{|\{(\w+)\}|\}\}/g,function(e,n){return n?(e=+n+1)?t[e]:t[1][n]:e[0]}):""},RegExp.parseWildCard=function(e){return"object"==typeof console&&console.assert("string"==typeof e,"RegExp.parseWildCard(str: 必须是字符串)"),new RegExp("(^|/)"+e.replace(/([-.+^${}()|[\]\/\\])/g,"\\$1").replace(/\*/g,"(.*)").replace(/\?/g,"([^/])")+"(/|$)","i")},Date.prototype.format=function(e){"object"==typeof console&&console.assert(!e||"string"==typeof e,"date.format([format: 必须是字符串])");var t=this,n=Date._formators;return n||(Date._formators=n={y:function(e,t){return e=e.getFullYear(),0>e?"BC"+-e:3>t?e%100:e},M:function(e){return e.getMonth()+1},d:function(e){return e.getDate()},H:function(e){return e.getHours()},m:function(e){return e.getMinutes()},s:function(e){return e.getSeconds()},e:function(e,t){return(1===t?"":2===t?"周":"星期")+[2===t?"日":"天","一","二","三","四","五","六"][e.getDay()]}}),(e||"yyyy/MM/dd HH:mm:ss").replace(/(\w)\1*/g,function(e,r){if(r in n){for(r=String(n[r](t,e.length));r.length<e.length;)r="0"+r;e=r}return e})};
});

__tpack__.define("../../../aspserver/configs.json", function(exports, module, require){
module.exports = {
    "port": 80,
    "physicalPath": "../",
    "virtualPaths": {

    },
    "modules": {
        "urlRewrite": "./modules/urlrewrite.js"
    },
    "defaultPages": { 
        "index.htm": true,
		"index.html": true
    },
    "handlers": {
        "directory": "./handlers/directoryhandler.js",
        "error": "./handlers/errorhandler.js",
        ".njs": "./handlers/njshandler.js",
        "*": "./handlers/staticfilehandler.js"
    },
    "urlRewrites": {

    },
    "mimeTypes": {
        ".html": "text/html",
		".htm": "text/html",
		".css": "text/css",
		".less": "text/css",
		".js": "text/javascript",
		".txt": "text/plain",
		".xml": "text/xml",
		".bmp": "image/bmp",
		".png": "image/png",
		".jpg": "image/jpg",
		".jpeg": "image/jpeg",
		".gif": "image/gif",
		".ico": "image/icon",
		".woff": "application/x-font-woff",
        ".svg": "image/svg+xml",
        ".swf": "application/x-shockwave-flash",

        ".tpl" : "text/html",
        ".jsx" : "text/javascript",
        ".php" : "text/html",
        ".asp" : "text/html",
        ".jsp" : "text/jsp",
        ".txt" : "text/plain",
        ".json" : "application/json",
        ".text" : "text/plain",
        ".md" : "text/plain",
        ".xhtml" : "text/html",
        ".conf" : "text/plain",
        ".po" : "text/plain",
        ".coffee" : "text/javascript",
        ".sass" : "text/css",
        ".scss" : "text/css",
        ".styl" : "text/css",
        ".manifest" : "text/cache-manifest",
        ".svg" : "image/svg+xml",
        ".tif" : "image/tiff",
        ".tiff" : "image/tiff",
        ".wbmp" : "image/vnd.wap.wbmp",
        ".webp" : "image/webp",
        ".png" : "image/png",
        ".bmp" : "image/bmp",
        ".fax" : "image/fax",
        ".gif" : "image/gif",
        ".ico" : "image/x-icon",
        ".jfif" : "image/jpeg",
        ".jpg" : "image/jpeg",
        ".jpe" : "image/jpeg",
        ".jpeg" : "image/jpeg",
        ".eot" : "application/vnd.ms-fontobject",
        ".woff" : "application/font-woff",
        ".woff2" : "application/font-woff",
        ".ttf" : "application/octet-stream",
        ".cur" : "application/octet-stream",
        
        ".config" : null,
		".mdb": null,
		".db": null
    }
};
});

__tpack__.define("../../../node-libs-browser/node_modules/events/events.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

});

__tpack__.define("../../../chokidar/node_modules/async-each/index.js", function(exports, module, require){
// async-each MIT license (by Paul Miller from http://paulmillr.com).
(function(globals) {
  'use strict';
  var each = function(items, next, callback) {
    if (!Array.isArray(items)) throw new TypeError('each() expects array as first argument');
    if (typeof next !== 'function') throw new TypeError('each() expects function as second argument');
    if (typeof callback !== 'function') callback = Function.prototype; // no-op

    if (items.length === 0) return callback(undefined, items);

    var transformed = new Array(items.length);
    var count = 0;
    var returned = false;

    items.forEach(function(item, index) {
      next(item, function(error, transformedItem) {
        if (returned) return;
        if (error) {
          returned = true;
          return callback(error);
        }
        transformed[index] = transformedItem;
        count += 1;
        if (count === items.length) return callback(undefined, transformed);
      });
    });
  };

  if (typeof define !== 'undefined' && define.amd) {
    define([], function() {
      return each;
    }); // RequireJS
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = each; // CommonJS
  } else {
    globals.asyncEach = each; // <script>
  }
})(this);

});

__tpack__.define("../../../chokidar/node_modules/arrify/index.js", function(exports, module, require){
'use strict';
module.exports = function (val) {
	if (val == null) {
		return [];
	}

	return Array.isArray(val) ? val : [val];
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/arr-diff/node_modules/array-slice/index.js", function(exports, module, require){
/*!
 * array-slice <https://github.com/jonschlinkert/array-slice>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function slice(arr, start, end) {
  var len = arr.length >>> 0;
  var range = [];

  start = idx(arr, start);
  end = idx(arr, end, len);

  while (start < end) {
    range.push(arr[start++]);
  }
  return range;
};


function idx(arr, pos, end) {
  var len = arr.length >>> 0;

  if (pos == null) {
    pos = end || 0;
  } else if (pos < 0) {
    pos = Math.max(len + pos, 0);
  } else {
    pos = Math.min(pos, len);
  }

  return pos;
}
});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/arr-diff/index.js", function(exports, module, require){
/*!
 * arr-diff <https://github.com/jonschlinkert/arr-diff>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var slice = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/arr-diff/node_modules/array-slice/index.js");

/**
 * Expose `diff`
 */

module.exports = diff;

/**
 * Return the difference between the first array and
 * additional arrays.
 *
 * ```js
 * var diff = require('{%= name %}');
 *
 * var a = ['a', 'b', 'c', 'd'];
 * var b = ['b', 'c'];
 *
 * console.log(diff(a, b))
 * //=> ['a', 'd']
 * ```
 *
 * @param  {Array} `a`
 * @param  {Array} `b`
 * @return {Array}
 * @api public
 */

function diff(a, b, c) {
  var len = a.length;
  var arr = [];
  var rest;

  if (!b) {
    return a;
  }

  if (!c) {
    rest = b;
  } else {
    rest = [].concat.apply([], slice(arguments, 1));
  }

  while (len--) {
    if (rest.indexOf(a[len]) === -1) {
      arr.unshift(a[len]);
    }
  }
  return arr;
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/kind-of/index.js", function(exports, module, require){
var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function kindOf(val) {
  if (val === undefined) {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val !== 'object') {
    return typeof val;
  }
  if (Array.isArray(val)) {
    return 'array';
  }

  var type = toString.call(val);

  if (val instanceof RegExp || type === '[object RegExp]') {
    return 'regexp';
  }
  if (val instanceof Date || type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Function]') {
    return 'function';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(val)) {
    return 'buffer';
  }
  return type.slice(8, -1).toLowerCase();
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/isobject/index.js", function(exports, module, require){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/for-own/node_modules/for-in/index.js", function(exports, module, require){
/*!
 * for-in <https://github.com/jonschlinkert/for-in>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function forIn(o, fn, thisArg) {
  for (var key in o) {
    if (fn.call(thisArg, o[key], key, o) === false) {
      break;
    }
  }
};
});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/for-own/index.js", function(exports, module, require){
/*!
 * for-own <https://github.com/jonschlinkert/for-own>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var forIn = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/for-own/node_modules/for-in/index.js");
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function forOwn(o, fn, thisArg) {
  forIn(o, function (val, key) {
    if (hasOwn.call(o, key)) {
      return fn.call(thisArg, o[key], key, o);
    }
  });
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/index.js", function(exports, module, require){
/*!
 * object.omit <https://github.com/jonschlinkert/object.omit>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/isobject/index.js");
var forOwn = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/node_modules/for-own/index.js");

module.exports = function omit(obj, keys) {
  if (!isObject(obj)) return {};
  if (!keys) return obj;

  keys = Array.isArray(keys) ? keys : [keys];
  var res = {};

  forOwn(obj, function (value, key) {
    if (keys.indexOf(key) === -1) {
      res[key] = value;
    }
  });
  return res;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/array-unique/index.js", function(exports, module, require){
/*!
 * array-unique <https://github.com/jonschlinkert/array-unique>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('array-unique expects an array.');
  }

  var len = arr.length;
  var i = -1;

  while (i++ < len) {
    var j = i + 1;

    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1);
      }
    }
  }
  return arr;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/node_modules/is-primitive/index.js", function(exports, module, require){
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/7
module.exports = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/node_modules/is-equal-shallow/index.js", function(exports, module, require){
/*!
 * is-equal-shallow <https://github.com/jonschlinkert/is-equal-shallow>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isPrimitive = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/node_modules/is-primitive/index.js");

module.exports = function isEqual(a, b) {
  if (!a && !b) { return true; }
  if (!a && b || a && !b) { return false; }

  var numKeysA = 0, numKeysB = 0, key;
  for (key in b) {
    numKeysB++;
    if (!isPrimitive(b[key]) || !a.hasOwnProperty(key) || (a[key] !== b[key])) {
      return false;
    }
  }
  for (key in a) {
    numKeysA++;
  }
  return numKeysA === numKeysB;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/index.js", function(exports, module, require){
/*!
 * regex-cache <https://github.com/jonschlinkert/regex-cache>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var isPrimitive = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/node_modules/is-primitive/index.js");
var equal = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/node_modules/is-equal-shallow/index.js");

/**
 * Expose `regexCache`
 */

module.exports = regexCache;

/**
 * Memoize the results of a call to the new RegExp constructor.
 *
 * @param  {Function} fn [description]
 * @param  {String} str [description]
 * @param  {Options} options [description]
 * @param  {Boolean} nocompare [description]
 * @return {RegExp}
 */

function regexCache(fn, str, opts) {
  var key = '_default_', regex, cached;

  if (!str && !opts) {
    if (typeof fn !== 'function') {
      return fn;
    }
    return basic[key] || (basic[key] = fn());
  }

  var isString = typeof str === 'string';
  if (isString) {
    if (!opts) {
      return basic[str] || (basic[str] = fn(str));
    }
    key = str;
  } else {
    opts = str;
  }

  cached = cache[key];
  if (cached && equal(cached.opts, opts)) {
    return cached.regex;
  }

  memo(key, opts, (regex = fn(str, opts)));
  return regex;
}

function memo(key, opts, regex) {
  cache[key] = {regex: regex, opts: opts};
}

/**
 * Expose `cache`
 */

var cache = module.exports.cache = {};
var basic = module.exports.basic = {};

});

__tpack__.define("../../../chokidar/node_modules/is-extglob/index.js", function(exports, module, require){
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  return typeof str === 'string'
    && /[@?!+*]\(/.test(str);
};

});

__tpack__.define("../../../chokidar/node_modules/is-glob/index.js", function(exports, module, require){
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isExtglob = require("../../chokidar/node_modules/is-extglob/index.js");

module.exports = function isGlob(str) {
  return typeof str === 'string'
    && (/[*!?{}(|)[\]]/.test(str)
     || isExtglob(str));
};
});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/filename-regex/index.js", function(exports, module, require){
/*!
 * filename-regex <https://github.com/regexps/filename-regex>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert
 * Licensed under the MIT license.
 */

module.exports = function filenameRegex() {
  return /([^\\\/]+)$/;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/utils.js", function(exports, module, require){
var process = __tpack__.require("process");
'use strict';

var path = require("path");
var fileRe = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/filename-regex/index.js");
var win32 = process && process.platform === 'win32';

/**
 * Expose `utils`
 */

var utils = module.exports;


utils.filename = function filename(fp) {
  var seg = fp.match(fileRe());
  return seg && seg[0];
};

utils.isPath = function isPath(pattern, opts) {
  return function (fp) {
    return utils.unixify(fp, opts) === pattern;
  };
};

utils.hasPath = function hasPath(pattern, opts) {
  return function (fp) {
    return utils.unixify(fp, opts).indexOf(pattern) !== -1;
  };
};

utils.matchPath = function matchPath(pattern, opts) {
  var fn = (opts && opts.contains)
    ? utils.hasPath(pattern, opts)
    : utils.isPath(pattern, opts);
  return fn;
};

utils.hasFilename = function hasFilename(re) {
  return function (fp) {
    var name = utils.filename(fp);
    return name && re.test(name);
  };
};

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

utils.arrayify = function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

utils.unixify = function unixify(fp, opts) {
  if (opts && opts.unixify === false) return fp;
  if (opts && opts.unixify === true || win32 || path.sep === '\\') {
    return fp.split('\\').join('/');
  }
  if (opts && opts.unescape === true) {
    return fp ? fp.toString().replace(/\\(\w)/g, '$1') : '';
  }
  return fp;
};

/**
 * Escape/unescape utils
 */

utils.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

utils.unescapeGlob = function unescapeGlob(fp) {
  return fp.replace(/[\\"']/g, '');
};

utils.escapeRe = function escapeRe(str) {
  return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/isobject/index.js", function(exports, module, require){
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/is-number/index.js", function(exports, module, require){
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isNumber(n) {
  return (!!(+n) && !Array.isArray(n)) && isFinite(n)
    || n === '0'
    || n === 0;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/randomatic/index.js", function(exports, module, require){
/*!
 * randomatic <https://github.com/jonschlinkert/randomatic>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License (MIT)
 *
 * Many changes have been made, but this was originally
 * inspired by <http://stackoverflow.com/a/10727155/1267639>
 */

'use strict';

var isNumber = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/is-number/index.js");
var typeOf = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/kind-of/index.js");

/**
 * Expose `randomatic`
 */

module.exports = randomatic;

/**
 * Available mask characters
 */

var type = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  special: '~!@#$%^&()_+-={}[];\',.'
};

type.all = type.lower + type.upper + type.number;

/**
 * Generate random character sequences of a specified `length`,
 * based on the given `pattern`.
 *
 * @param {String} `pattern` The pattern to use for generating the random string.
 * @param {String} `length` The length of the string to generate.
 * @param {String} `options`
 * @return {String}
 * @api public
 */

function randomatic(pattern, length, options) {
  if (typeof pattern === 'undefined') {
    throw new Error('randomatic expects a string or number.');
  }

  var custom = false;
  if (arguments.length === 1) {
    if (typeof pattern === 'string') {
      length = pattern.length;

    } else if (isNumber(pattern)) {
      options = {}; length = pattern; pattern = '*';
    }
  }

  if(typeOf(length) === 'object' && length.hasOwnProperty('chars')) {
    options = length;
    pattern = options.chars;
    length = pattern.length;
    custom = true;
  }

  var opts = options || {};
  var mask = '';
  var res = '';

  // Characters to be used
  if (pattern.indexOf('?') !== -1) mask += opts.chars;
  if (pattern.indexOf('a') !== -1) mask += type.lower;
  if (pattern.indexOf('A') !== -1) mask += type.upper;
  if (pattern.indexOf('0') !== -1) mask += type.number;
  if (pattern.indexOf('!') !== -1) mask += type.special;
  if (pattern.indexOf('*') !== -1) mask += type.all;
  if (custom) mask += pattern;

  while (length--) {
    res += mask.charAt(parseInt(Math.random() * mask.length));
  }

  return res;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/repeat-string/index.js", function(exports, module, require){
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Expose `repeat`
 */

module.exports = repeat;

/**
 * Repeat the given `string` the specified `number`
 * of times.
 *
 * **Example:**
 *
 * ```js
 * var repeat = require('repeat-string');
 * repeat('A', 5);
 * //=> AAAAA
 * ```
 *
 * @param {String} `string` The string to repeat
 * @param {Number} `number` The number of times to repeat the string
 * @return {String} Repeated string
 * @api public
 */

function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('repeat-string expects a string.');
  }

  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  }

  while (max > res.length && num > 0) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    if (!num) break;
    str += str;
  }

  return res.substr(0, max);
}

/**
 * Results cache
 */

var res = '';
var cache;

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/repeat-element/index.js", function(exports, module, require){
/*!
 * repeat-element <https://github.com/jonschlinkert/repeat-element>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function repeat(ele, num) {
  var arr = new Array(num);

  for (var i = 0; i < num; i++) {
    arr[i] = ele;
  }

  return arr;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/index.js", function(exports, module, require){
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/isobject/index.js");
var isNumber = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/is-number/index.js");
var randomize = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/randomatic/index.js");
var repeatStr = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/node_modules/repeat-string/index.js");
var repeat = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/repeat-element/index.js");

/**
 * Expose `fillRange`
 */

module.exports = fillRange;

/**
 * Return a range of numbers or letters.
 *
 * @param  {String} `a` Start of the range
 * @param  {String} `b` End of the range
 * @param  {String} `step` Increment or decrement to use.
 * @param  {Function} `fn` Custom function to modify each element in the range.
 * @return {Array}
 */

function fillRange(a, b, step, options, fn) {
  if (a == null || b == null) {
    throw new Error('fill-range expects the first and second args to be strings.');
  }

  if (typeof step === 'function') {
    fn = step; options = {}; step = null;
  }

  if (typeof options === 'function') {
    fn = options; options = {};
  }

  if (isObject(step)) {
    options = step; step = '';
  }

  var expand, regex = false, sep = '';
  var opts = options || {};

  if (typeof opts.silent === 'undefined') {
    opts.silent = true;
  }

  step = step || opts.step;

  // store a ref to unmodified arg
  var origA = a, origB = b;

  b = (b.toString() === '-0') ? 0 : b;

  if (opts.optimize || opts.makeRe) {
    step = step ? (step += '~') : step;
    expand = true;
    regex = true;
    sep = '~';
  }

  // handle special step characters
  if (typeof step === 'string') {
    var match = stepRe().exec(step);

    if (match) {
      var i = match.index;
      var m = match[0];

      // repeat string
      if (m === '+') {
        return repeat(a, b);

      // randomize a, `b` times
      } else if (m === '?') {
        return [randomize(a, b)];

      // expand right, no regex reduction
      } else if (m === '>') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;

      // expand to an array, or if valid create a reduced
      // string for a regex logic `or`
      } else if (m === '|') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep = m;

      // expand to an array, or if valid create a reduced
      // string for a regex range
      } else if (m === '~') {
        step = step.substr(0, i) + step.substr(i + 1);
        expand = true;
        regex = true;
        sep = m;
      }
    } else if (!isNumber(step)) {
      if (!opts.silent) {
        throw new TypeError('fill-range: invalid step.');
      }
      return null;
    }
  }

  if (/[.&*()[\]^%$#@!]/.test(a) || /[.&*()[\]^%$#@!]/.test(b)) {
    if (!opts.silent) {
      throw new RangeError('fill-range: invalid range arguments.');
    }
    return null;
  }

  // has neither a letter nor number, or has both letters and numbers
  // this needs to be after the step logic
  if (!noAlphaNum(a) || !noAlphaNum(b) || hasBoth(a) || hasBoth(b)) {
    if (!opts.silent) {
      throw new RangeError('fill-range: invalid range arguments.');
    }
    return null;
  }

  // validate arguments
  var isNumA = isNumber(zeros(a));
  var isNumB = isNumber(zeros(b));

  if ((!isNumA && isNumB) || (isNumA && !isNumB)) {
    if (!opts.silent) {
      throw new TypeError('fill-range: first range argument is incompatible with second.');
    }
    return null;
  }

  // by this point both are the same, so we
  // can use A to check going forward.
  var isNum = isNumA;
  var num = formatStep(step);

  // is the range alphabetical? or numeric?
  if (isNum) {
    // if numeric, coerce to an integer
    a = +a; b = +b;
  } else {
    // otherwise, get the charCode to expand alpha ranges
    a = a.charCodeAt(0);
    b = b.charCodeAt(0);
  }

  // is the pattern descending?
  var isDescending = a > b;

  // don't create a character class if the args are < 0
  if (a < 0 || b < 0) {
    expand = false;
    regex = false;
  }

  // detect padding
  var padding = isPadded(origA, origB);
  var res, pad, arr = [];
  var ii = 0;

  // character classes, ranges and logical `or`
  if (regex) {
    if (shouldExpand(a, b, num, isNum, padding, opts)) {
      // make sure the correct separator is used
      if (sep === '|' || sep === '~') {
        sep = detectSeparator(a, b, num, isNum, isDescending);
      }
      return wrap([origA, origB], sep, opts);
    }
  }

  while (isDescending ? (a >= b) : (a <= b)) {
    if (padding && isNum) {
      pad = padding(a);
    }

    // custom function
    if (typeof fn === 'function') {
      res = fn(a, isNum, pad, ii++);

    // letters
    } else if (!isNum) {
      if (regex && isInvalidChar(a)) {
        res = null;
      } else {
        res = String.fromCharCode(a);
      }

    // numbers
    } else {
      res = formatPadding(a, pad);
    }

    // add result to the array, filtering any nulled values
    if (res !== null) arr.push(res);

    // increment or decrement
    if (isDescending) {
      a -= num;
    } else {
      a += num;
    }
  }

  // now that the array is expanded, we need to handle regex
  // character classes, ranges or logical `or` that wasn't
  // already handled before the loop
  if ((regex || expand) && !opts.noexpand) {
    // make sure the correct separator is used
    if (sep === '|' || sep === '~') {
      sep = detectSeparator(a, b, num, isNum, isDescending);
    }
    if (arr.length === 1 || a < 0 || b < 0) { return arr; }
    return wrap(arr, sep, opts);
  }

  return arr;
}

/**
 * Wrap the string with the correct regex
 * syntax.
 */

function wrap(arr, sep, opts) {
  if (sep === '~') { sep = '-'; }
  var str = arr.join(sep);
  var pre = opts && opts.regexPrefix;

  // regex logical `or`
  if (sep === '|') {
    str = pre ? pre + str : str;
    str = '(' + str + ')';
  }

  // regex character class
  if (sep === '-') {
    str = (pre && pre === '^')
      ? pre + str
      : str;
    str = '[' + str + ']';
  }
  return [str];
}

/**
 * Check for invalid characters
 */

function isCharClass(a, b, step, isNum, isDescending) {
  if (isDescending) { return false; }
  if (isNum) { return a <= 9 && b <= 9; }
  if (a < b) { return step === 1; }
  return false;
}

/**
 * Detect the correct separator to use
 */

function shouldExpand(a, b, num, isNum, padding, opts) {
  if (isNum && (a > 9 || b > 9)) { return false; }
  return !padding && num === 1 && a < b;
}

/**
 * Detect the correct separator to use
 */

function detectSeparator(a, b, step, isNum, isDescending) {
  var isChar = isCharClass(a, b, step, isNum, isDescending);
  if (!isChar) {
    return '|';
  }
  return '~';
}

/**
 * Correctly format the step based on type
 */

function formatStep(step) {
  return Math.abs(step >> 0) || 1;
}

/**
 * Format padding, taking leading `-` into account
 */

function formatPadding(ch, pad) {
  var res = pad ? pad + ch : ch;
  if (pad && ch.toString().charAt(0) === '-') {
    res = '-' + pad + ch.toString().substr(1);
  }
  return res.toString();
}

/**
 * Check for invalid characters
 */

function isInvalidChar(str) {
  var ch = toStr(str);
  return ch === '\\'
    || ch === '['
    || ch === ']'
    || ch === '^'
    || ch === '('
    || ch === ')'
    || ch === '`';
}

/**
 * Convert to a string from a charCode
 */

function toStr(ch) {
  return String.fromCharCode(ch);
}


/**
 * Step regex
 */

function stepRe() {
  return /\?|>|\||\+|\~/g;
}

/**
 * Return true if `val` has either a letter
 * or a number
 */

function noAlphaNum(val) {
  return /[a-z0-9]/i.test(val);
}

/**
 * Return true if `val` has both a letter and
 * a number (invalid)
 */

function hasBoth(val) {
  return /[a-z][0-9]|[0-9][a-z]/i.test(val);
}

/**
 * Normalize zeros for checks
 */

function zeros(val) {
  if (/^-*0+$/.test(val.toString())) {
    return '0';
  }
  return val;
}

/**
 * Return true if `val` has leading zeros,
 * or a similar valid pattern.
 */

function hasZeros(val) {
  return /[^.]\.|^-*0+[0-9]/.test(val);
}

/**
 * If the string is padded, returns a curried function with
 * the a cached padding string, or `false` if no padding.
 *
 * @param  {*} `origA` String or number.
 * @return {String|Boolean}
 */

function isPadded(origA, origB) {
  if (hasZeros(origA) || hasZeros(origB)) {
    var alen = length(origA);
    var blen = length(origB);

    var len = alen >= blen
      ? alen
      : blen;

    return function (a) {
      return repeatStr('0', len - length(a));
    };
  }
  return false;
}

/**
 * Get the string length of `val`
 */

function length(val) {
  return val.toString().length;
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/index.js", function(exports, module, require){
/*!
 * expand-range <https://github.com/jonschlinkert/expand-range>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fill = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/node_modules/fill-range/index.js");

module.exports = function expandRange(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expand-range expects a string.');
  }

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (typeof options === 'boolean') {
    options = {};
    options.makeRe = true;
  }

  // create arguments to pass to fill-range
  var opts = options || {};
  var args = str.split('..');
  var len = args.length;
  if (len > 3) { return str; }

  // if only one argument, it can't expand so return it
  if (len === 1) { return args; }

  // if `true`, tell fill-range to regexify the string
  if (typeof fn === 'boolean' && fn === true) {
    opts.makeRe = true;
  }

  args.push(opts);
  return fill.apply(fill, args.concat(fn));
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/preserve/index.js", function(exports, module, require){
/*!
 * preserve <https://github.com/jonschlinkert/preserve>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Replace tokens in `str` with a temporary, heuristic placeholder.
 *
 * ```js
 * tokens.before('{a\\,b}');
 * //=> '{__ID1__}'
 * ```
 *
 * @param  {String} `str`
 * @return {String} String with placeholders.
 * @api public
 */

exports.before = function before(str, re) {
  return str.replace(re, function (match) {
    var id = randomize();
    cache[id] = match;
    return '__ID' + id + '__';
  });
};

/**
 * Replace placeholders in `str` with original tokens.
 *
 * ```js
 * tokens.after('{__ID1__}');
 * //=> '{a\\,b}'
 * ```
 *
 * @param  {String} `str` String with placeholders
 * @return {String} `str` String with original tokens.
 * @api public
 */

exports.after = function after(str) {
  return str.replace(/__ID(.{5})__/g, function (_, id) {
    return cache[id];
  });
};

function randomize() {
  return Math.random().toString().slice(2, 7);
}

var cache = {};
});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/index.js", function(exports, module, require){
/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var expand = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/expand-range/index.js");
var repeat = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/repeat-element/index.js");
var tokens = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/node_modules/preserve/index.js");
var cache = {};

/**
 * Expose `braces`
 */

module.exports = function (str, options) {
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }
  return braces(str, options);
};

/**
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @param  {Object} `options`
 * @return {Array}
 */

function braces(str, arr, options) {
  if (str === '') {
    return [];
  }

  if (!Array.isArray(arr)) {
    options = arr;
    arr = [];
  }

  var opts = options || {};
  arr = arr || [];

  if (typeof opts.nodupes === 'undefined') {
    opts.nodupes = true;
  }

  var fn = opts.fn;
  var es6;

  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  if (!(patternRe instanceof RegExp)) {
    patternRe = patternRegex();
  }

  var matches = str.match(patternRe) || [];
  var m = matches[0];

  switch(m) {
    case '\\,':
      return escapeCommas(str, arr, opts);
    case '\\.':
      return escapeDots(str, arr, opts);
    case '\/.':
      return escapePaths(str, arr, opts);
    case ' ':
      return splitWhitespace(str);
    case '{,}':
      return exponential(str, opts, braces);
    case '{}':
      return emptyBraces(str, arr, opts);
    case '\\{':
    case '\\}':
      return escapeBraces(str, arr, opts);
    case '${':
      if (!/\{[^{]+\{/.test(str)) {
        return arr.concat(str);
      } else {
        es6 = true;
        str = tokens.before(str, es6Regex());
      }
  }

  if (!(braceRe instanceof RegExp)) {
    braceRe = braceRegex();
  }

  var match = braceRe.exec(str);
  if (match == null) {
    return [str];
  }

  var outter = match[1];
  var inner = match[2];
  if (inner === '') { return [str]; }

  var segs, segsLength;

  if (inner.indexOf('..') !== -1) {
    segs = expand(inner, opts, fn) || inner.split(',');
    segsLength = segs.length;

  } else if (inner[0] === '"' || inner[0] === '\'') {
    return arr.concat(str.split(/['"]/).join(''));

  } else {
    segs = inner.split(',');
    if (opts.makeRe) {
      return braces(str.replace(outter, wrap(segs, '|')), opts);
    }

    segsLength = segs.length;
    if (segsLength === 1 && opts.bash) {
      segs[0] = wrap(segs[0], '\\');
    }
  }

  var len = segs.length;
  var i = 0, val;

  while (len--) {
    var path = segs[i++];
    var bash = false;

    if (/(\.[^.\/])/.test(path)) {
      if (segsLength > 1) {
        return segs;
      } else {
        return [str];
      }
    }

    val = splice(str, outter, path);

    if (/\{[^{}]+?\}/.test(val)) {
      arr = braces(val, arr, opts);
    } else if (val !== '') {
      if (opts.nodupes && arr.indexOf(val) !== -1) { continue; }
      arr.push(es6 ? tokens.after(val) : val);
    }
  }

  if (opts.strict) { return filter(arr, filterEmpty); }
  return arr;
}

/**
 * Expand exponential ranges
 *
 *   `a{,}{,}` => ['a', 'a', 'a', 'a']
 */

function exponential(str, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = null;
  }

  var opts = options || {};
  var esc = '__ESC_EXP__';
  var exp = 0;
  var res;

  var parts = str.split('{,}');
  if (opts.nodupes) {
    return fn(parts.join(''), opts);
  }

  exp = parts.length - 1;
  res = fn(parts.join(esc), opts);
  var len = res.length;
  var arr = [];
  var i = 0;

  while (len--) {
    var ele = res[i++];
    var idx = ele.indexOf(esc);

    if (idx === -1) {
      arr.push(ele);

    } else {
      ele = ele.split('__ESC_EXP__').join('');
      if (!!ele && opts.nodupes !== false) {
        arr.push(ele);

      } else {
        var num = Math.pow(2, exp);
        arr.push.apply(arr, repeat(ele, num));
      }
    }
  }
  return arr;
}

/**
 * Wrap a value with parens, brackets or braces,
 * based on the given character/separator.
 *
 * @param  {String|Array} `val`
 * @param  {String} `ch`
 * @return {String}
 */

function wrap(val, ch) {
  if (ch === '|') {
    return '(' + val.join(ch) + ')';
  }
  if (ch === ',') {
    return '{' + val.join(ch) + '}';
  }
  if (ch === '-') {
    return '[' + val.join(ch) + ']';
  }
  if (ch === '\\') {
    return '\\{' + val + '\\}';
  }
}

/**
 * Handle empty braces: `{}`
 */

function emptyBraces(str, arr, opts) {
  return braces(str.split('{}').join('\\{\\}'), arr, opts);
}

/**
 * Filter out empty-ish values
 */

function filterEmpty(ele) {
  return !!ele && ele !== '\\';
}

/**
 * Handle patterns with whitespace
 */

function splitWhitespace(str) {
  var segs = str.split(' ');
  var len = segs.length;
  var res = [];
  var i = 0;

  while (len--) {
    res.push.apply(res, braces(segs[i++]));
  }
  return res;
}

/**
 * Handle escaped braces: `\\{foo,bar}`
 */

function escapeBraces(str, arr, opts) {
  if (!/\{[^{]+\{/.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\{').join('__LT_BRACE__');
    str = str.split('\\}').join('__RT_BRACE__');
    return map(braces(str, arr, opts), function (ele) {
      ele = ele.split('__LT_BRACE__').join('{');
      return ele.split('__RT_BRACE__').join('}');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapeDots(str, arr, opts) {
  if (!/[^\\]\..+\\\./.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\.').join('__ESC_DOT__');
    return map(braces(str, arr, opts), function (ele) {
      return ele.split('__ESC_DOT__').join('.');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapePaths(str, arr, opts) {
  str = str.split('\/.').join('__ESC_PATH__');
  return map(braces(str, arr, opts), function (ele) {
    return ele.split('__ESC_PATH__').join('\/.');
  });
}

/**
 * Handle escaped commas: `{a\\,b}`
 */

function escapeCommas(str, arr, opts) {
  if (!/\w,/.test(str)) {
    return arr.concat(str.split('\\').join(''));
  } else {
    str = str.split('\\,').join('__ESC_COMMA__');
    return map(braces(str, arr, opts), function (ele) {
      return ele.split('__ESC_COMMA__').join(',');
    });
  }
}

/**
 * Regex for common patterns
 */

function patternRegex() {
  return /\$\{|[ \t]|{}|{,}|\\,|\/\.|\\\.|\\{|\\}/;
}

/**
 * Braces regex.
 */

function braceRegex() {
  return /.*(\\?\{([^}]+)\})/;
}

/**
 * es6 delimiter regex.
 */

function es6Regex() {
  return /\$\{([^}]+)\}/;
}

var braceRe;
var patternRe;

/**
 * Faster alternative to `String.replace()` when the
 * index of the token to be replaces can't be supplied
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  return str.substr(0, i) + replacement
    + str.substr(i + token.length);
}

/**
 * Fast array map
 */

function map(arr, fn) {
  if (arr == null) {
    return [];
  }

  var len = arr.length;
  var res = new Array(len);
  var i = -1;

  while (++i < len) {
    res[i] = fn(arr[i], i, arr);
  }

  return res;
}

/**
 * Fast array filter
 */

function filter(arr, cb) {
  if (arr == null) return [];
  if (typeof cb !== 'function') {
    throw new TypeError('braces: filter expects a callback function.');
  }

  var len = arr.length;
  var res = arr.slice();
  var i = 0;

  while (len--) {
    if (!cb(arr[len], i++)) {
      res.splice(len, 1);
    }
  }
  return res;
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/expand-brackets/node_modules/is-posix-bracket/index.js", function(exports, module, require){
/*!
 * is-posix-bracket <https://github.com/jonschlinkert/is-posix-bracket>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isPosixBracket(str) {
  return typeof str === 'string' && /\[([:.=+])(?:[^\[\]]|)+\1\]/.test(str);
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/expand-brackets/index.js", function(exports, module, require){
/*!
 * expand-brackets <https://github.com/jonschlinkert/expand-brackets>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var isPosixBracket = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/expand-brackets/node_modules/is-posix-bracket/index.js");

/**
 * POSIX character classes
 */

var POSIX = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E',
  punct: '!"#$%&\'()\\*+,-./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word:  'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9',
};

/**
 * Expose `brackets`
 */

module.exports = brackets;

function brackets(str) {
  if (!isPosixBracket(str)) {
    return str;
  }

  var negated = false;
  if (str.indexOf('[^') !== -1) {
    negated = true;
    str = str.split('[^').join('[');
  }
  if (str.indexOf('[!') !== -1) {
    negated = true;
    str = str.split('[!').join('[');
  }

  var a = str.split('[');
  var b = str.split(']');
  var imbalanced = a.length !== b.length;

  var parts = str.split(/(?::\]\[:|\[?\[:|:\]\]?)/);
  var len = parts.length, i = 0;
  var end = '', beg = '';
  var res = [];

  // start at the end (innermost) first
  while (len--) {
    var inner = parts[i++];
    if (inner === '^[!' || inner === '[!') {
      inner = '';
      negated = true;
    }

    var prefix = negated ? '^' : '';
    var ch = POSIX[inner];

    if (ch) {
      res.push('[' + prefix + ch + ']');
    } else if (inner) {
      if (/^\[?\w-\w\]?$/.test(inner)) {
        if (i === parts.length) {
          res.push('[' + prefix + inner);
        } else if (i === 1) {
          res.push(prefix + inner + ']');
        } else {
          res.push(prefix + inner);
        }
      } else {
        if (i === 1) {
          beg += inner;
        } else if (i === parts.length) {
          end += inner;
        } else {
          res.push('[' + prefix + inner + ']');
        }
      }
    }
  }

  var result = res.join('|');
  var rlen = res.length || 1;
  if (rlen > 1) {
    result = '(?:' + result + ')';
    rlen = 1;
  }
  if (beg) {
    rlen++;
    if (beg.charAt(0) === '[') {
      if (imbalanced) {
        beg = '\\[' + beg.slice(1);
      } else {
        beg += ']';
      }
    }
    result = beg + result;
  }
  if (end) {
    rlen++;
    if (end.slice(-1) === ']') {
      if (imbalanced) {
        end = end.slice(0, end.length - 1) + '\\]';
      } else {
        end = '[' + end;
      }
    }
    result += end;
  }

  if (rlen > 1) {
    result = result.split('][').join(']|[');
    if (result.indexOf('|') !== -1 && !/\(\?/.test(result)) {
      result = '(?:' + result + ')';
    }
  }

  result = result.replace(/\[+=|=\]+/g, '\\b');
  return result;
}

brackets.makeRe = function (pattern) {
  try {
    return new RegExp(brackets(pattern));
  } catch (err) {}
};

brackets.isMatch = function (str, pattern) {
  try {
    return brackets.makeRe(pattern).test(str);
  } catch (err) {
    return false;
  }
};

brackets.match = function (arr, pattern) {
  var len = arr.length, i = 0;
  var res = arr.slice();

  var re = brackets.makeRe(pattern);
  while (i < len) {
    var ele = arr[i++];
    if (!re.test(ele)) {
      continue;
    }
    res.splice(i, 1);
  }
  return res;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/extglob/node_modules/is-extglob/index.js", function(exports, module, require){
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  return typeof str === 'string'
    && /[@?!+*]\(/.test(str);
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/extglob/index.js", function(exports, module, require){
/*!
 * extglob <https://github.com/jonschlinkert/extglob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Module dependencies
 */

var isExtglob = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/extglob/node_modules/is-extglob/index.js");
var re, cache = {};

/**
 * Expose `extglob`
 */

module.exports = extglob;

/**
 * Convert the given extglob `string` to a regex-compatible
 * string.
 *
 * ```js
 * var extglob = require('extglob');
 * extglob('!(a?(b))');
 * //=> '(?!a(?:b)?)[^/]*?'
 * ```
 *
 * @param {String} `str` The string to convert.
 * @param {Object} `options`
 *   @option {Boolean} [options] `esc` If `false` special characters will not be escaped. Defaults to `true`.
 *   @option {Boolean} [options] `regex` If `true` a regular expression is returned instead of a string.
 * @return {String}
 * @api public
 */


function extglob(str, opts) {
  opts = opts || {};
  var o = {}, i = 0;

  // fix common character reversals
  // '*!(.js)' => '*.!(js)'
  str = str.replace(/!\(([^\w*()])/g, '$1!(');

  // support file extension negation
  str = str.replace(/([*\/])\.!\([*]\)/g, function (m, ch) {
    if (ch === '/') {
      return escape('\\/[^.]+');
    }
    return escape('[^.]+');
  });

  // create a unique key for caching by
  // combining the string and options
  var key = str
    + String(!!opts.regex)
    + String(!!opts.contains)
    + String(!!opts.escape);

  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  if (!(re instanceof RegExp)) {
    re = regex();
  }

  opts.negate = false;
  var m;

  while (m = re.exec(str)) {
    var prefix = m[1];
    var inner = m[3];
    if (prefix === '!') {
      opts.negate = true;
    }

    var id = '__EXTGLOB_' + (i++) + '__';
    // use the prefix of the _last_ (outtermost) pattern
    o[id] = wrap(inner, prefix, opts.escape);
    str = str.split(m[0]).join(id);
  }

  var keys = Object.keys(o);
  var len = keys.length;

  // we have to loop again to allow us to convert
  // patterns in reverse order (starting with the
  // innermost/last pattern first)
  while (len--) {
    var prop = keys[len];
    str = str.split(prop).join(o[prop]);
  }

  var result = opts.regex
    ? toRegex(str, opts.contains, opts.negate)
    : str;

  result = result.split('.').join('\\.');

  // cache the result and return it
  return (cache[key] = result);
}

/**
 * Convert `string` to a regex string.
 *
 * @param  {String} `str`
 * @param  {String} `prefix` Character that determines how to wrap the string.
 * @param  {Boolean} `esc` If `false` special characters will not be escaped. Defaults to `true`.
 * @return {String}
 */

function wrap(inner, prefix, esc) {
  if (esc) inner = escape(inner);

  switch (prefix) {
    case '!':
      return '(?!' + inner + ')[^/]' + (esc ? '%%%~' : '*?');
    case '@':
      return '(?:' + inner + ')';
    case '+':
      return '(?:' + inner + ')+';
    case '*':
      return '(?:' + inner + ')' + (esc ? '%%' : '*')
    case '?':
      return '(?:' + inner + '|)';
    default:
      return inner;
  }
}

function escape(str) {
  str = str.split('*').join('[^/]%%%~');
  str = str.split('.').join('\\.');
  return str;
}

/**
 * extglob regex.
 */

function regex() {
  return /(\\?[@?!+*$]\\?)(\(([^()]*?)\))/;
}

/**
 * Negation regex
 */

function negate(str) {
  return '(?!^' + str + ').*$';
}

/**
 * Create the regex to do the matching. If
 * the leading character in the `pattern` is `!`
 * a negation regex is returned.
 *
 * @param {String} `pattern`
 * @param {Boolean} `contains` Allow loose matching.
 * @param {Boolean} `isNegated` True if the pattern is a negation pattern.
 */

function toRegex(pattern, contains, isNegated) {
  var prefix = contains ? '^' : '';
  var after = contains ? '$' : '';
  pattern = ('(?:' + pattern + ')' + after);
  if (isNegated) {
    pattern = prefix + negate(pattern);
  }
  return new RegExp(prefix + pattern);
}

});

__tpack__.define("../../../chokidar/node_modules/glob-parent/index.js", function(exports, module, require){
'use strict';

var path = require("path");
var isglob = require("../../chokidar/node_modules/is-glob/index.js");

module.exports = function globParent(str) {
	str += 'a'; // preserves full path in case of trailing path separator
	do {str = path.dirname(str)} while (isglob(str));
	return str;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/glob-base/index.js", function(exports, module, require){
/*!
 * glob-base <https://github.com/jonschlinkert/glob-base>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require("path");
var parent = require("../../chokidar/node_modules/glob-parent/index.js");

module.exports = function globBase(pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob-base expects a string.');
  }

  var res = {};
  res.base = parent(pattern);
  res.isGlob = res.base !== pattern;

  if (res.base !== '.') {
    res.glob = pattern.substr(res.base.length);
    if (res.glob.charAt(0) === '/') {
      res.glob = res.glob.substr(1);
    }
  } else {
    res.glob = pattern;
  }

  if (!res.isGlob) {
    res.base = dirname(pattern);
    res.glob = res.base !== '.'
      ? pattern.substr(res.base.length)
      : pattern;
  }

  if (res.glob.substr(0, 2) === './') {
    res.glob = res.glob.substr(2);
  }
  if (res.glob.charAt(0) === '/') {
    res.glob = res.glob.substr(1);
  }
  return res;
};

function dirname(glob) {
  if (glob.slice(-1) === '/') return glob;
  return path.dirname(glob);
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/is-extglob/index.js", function(exports, module, require){
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  return typeof str === 'string'
    && /[@?!+*]\(/.test(str);
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/is-dotfile/index.js", function(exports, module, require){
/*!
 * is-dotfile <https://github.com/regexps/is-dotfile>
 *
 * Copyright (c) 2015 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

module.exports = function(str) {
  if (str.charCodeAt(0) === 46 /* . */ && str.indexOf('/', 1) === -1) {
    return true;
  }

  var last = str.lastIndexOf('/');
  return last !== -1 ? str.charCodeAt(last + 1) === 46  /* . */ : false;
};

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/index.js", function(exports, module, require){
/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isGlob = require("../../chokidar/node_modules/is-glob/index.js");
var findBase = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/glob-base/index.js");
var extglob = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/is-extglob/index.js");
var dotfile = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/node_modules/is-dotfile/index.js");

/**
 * Expose `cache`
 */

var cache = module.exports.cache = {};

/**
 * Parse a glob pattern into tokens.
 *
 * When no paths or '**' are in the glob, we use a
 * different strategy for parsing the filename, since
 * file names can contain braces and other difficult
 * patterns. such as:
 *
 *  - `*.{a,b}`
 *  - `(**|*.js)`
 */

module.exports = function parseGlob(glob) {
  if (cache.hasOwnProperty(glob)) {
    return cache[glob];
  }

  var tok = {};
  tok.orig = glob;
  tok.is = {};

  // unescape dots and slashes in braces/brackets
  glob = escape(glob);

  var parsed = findBase(glob);
  tok.is.glob = parsed.isGlob;

  tok.glob = parsed.glob;
  tok.base = parsed.base;
  var segs = /([^\/]*)$/.exec(glob);

  tok.path = {};
  tok.path.dirname = '';
  tok.path.basename = segs[1] || '';
  tok.path.dirname = glob.split(tok.path.basename).join('') || '';
  var basename = (tok.path.basename || '').split('.') || '';
  tok.path.filename = basename[0] || '';
  tok.path.extname = basename.slice(1).join('.') || '';
  tok.path.ext = '';

  if (isGlob(tok.path.dirname) && !tok.path.basename) {
    if (!/\/$/.test(tok.glob)) {
      tok.path.basename = tok.glob;
    }
    tok.path.dirname = tok.base;
  }

  if (glob.indexOf('/') === -1 && !tok.is.globstar) {
    tok.path.dirname = '';
    tok.path.basename = tok.orig;
  }

  var dot = tok.path.basename.indexOf('.');
  if (dot !== -1) {
    tok.path.filename = tok.path.basename.slice(0, dot);
    tok.path.extname = tok.path.basename.slice(dot);
  }

  if (tok.path.extname.charAt(0) === '.') {
    var exts = tok.path.extname.split('.');
    tok.path.ext = exts[exts.length - 1];
  }

  // unescape dots and slashes in braces/brackets
  tok.glob = unescape(tok.glob);
  tok.path.dirname = unescape(tok.path.dirname);
  tok.path.basename = unescape(tok.path.basename);
  tok.path.filename = unescape(tok.path.filename);
  tok.path.extname = unescape(tok.path.extname);

  // Booleans
  var is = (glob && tok.is.glob);
  tok.is.negated  = glob && glob.charAt(0) === '!';
  tok.is.extglob  = glob && extglob(glob);
  tok.is.braces   = has(is, glob, '{');
  tok.is.brackets = has(is, glob, '[:');
  tok.is.globstar = has(is, glob, '**');
  tok.is.dotfile  = dotfile(tok.path.basename) || dotfile(tok.path.filename);
  tok.is.dotdir   = dotdir(tok.path.dirname);
  return (cache[glob] = tok);
}

/**
 * Returns true if the glob matches dot-directories.
 *
 * @param  {Object} `tok` The tokens object
 * @param  {Object} `path` The path object
 * @return {Object}
 */

function dotdir(base) {
  if (base.indexOf('/.') !== -1) {
    return true;
  }
  if (base.charAt(0) === '.' && base.charAt(1) !== '/') {
    return true;
  }
  return false;
}

/**
 * Returns true if the pattern has the given `ch`aracter(s)
 *
 * @param  {Object} `glob` The glob pattern.
 * @param  {Object} `ch` The character to test for
 * @return {Object}
 */

function has(is, glob, ch) {
  return is && glob.indexOf(ch) !== -1;
}

/**
 * Escape/unescape utils
 */

function escape(str) {
  var re = /\{([^{}]*?)}|\(([^()]*?)\)|\[([^\[\]]*?)\]/g;
  return str.replace(re, function (outter, braces, parens, brackets) {
    var inner = braces || parens || brackets;
    if (!inner) { return outter; }
    return outter.split(inner).join(esc(inner));
  });
}

function esc(str) {
  str = str.split('/').join('__SLASH__');
  str = str.split('.').join('__DOT__');
  return str;
}

function unescape(str) {
  str = str.split('__SLASH__').join('/');
  str = str.split('__DOT__').join('.');
  return str;
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/chars.js", function(exports, module, require){
'use strict';

var reverse = function(object, prepender) {
  return Object.keys(object).reduce(function(reversed, key) {
    var newKey = prepender ? prepender + key : key; // Optionally prepend a string to key.
    reversed[object[key]] = newKey; // Swap key and value.
    return reversed; // Return the result.
  }, {});
};

var chars = {};

/**
 * Regex for common characters
 */

chars.escapeRegex = {
  '?': /\?/g,
  '@': /\@/g,
  '!': /\!/g,
  '+': /\+/g,
  '*': /\*/g,
  '(': /\(/g,
  ')': /\)/g,
  '[': /\[/g,
  ']': /\]/g,
};

/**
 * Escape characters
 */

chars.ESC = {
  '?': '__UNESC_QMRK__',
  '@': '__UNESC_AMPE__',
  '!': '__UNESC_EXCL__',
  '+': '__UNESC_PLUS__',
  '*': '__UNESC_STAR__',
  ',': '__UNESC_COMMA__',
  '(': '__UNESC_LTPAREN__',
  ')': '__UNESC_RTPAREN__',
  '[': '__UNESC_LTBRACK__',
  ']': '__UNESC_RTBRACK__',
};

/**
 * Unescape characters
 */

chars.UNESC = reverse(chars.ESC, '\\');

chars.ESC_TEMP = {
  '?': '__TEMP_QMRK__',
  '@': '__TEMP_AMPE__',
  '!': '__TEMP_EXCL__',
  '*': '__TEMP_STAR__',
  '+': '__TEMP_PLUS__',
  ',': '__TEMP_COMMA__',
  '(': '__TEMP_LTPAREN__',
  ')': '__TEMP_RTPAREN__',
  '[': '__TEMP_LTBRACK__',
  ']': '__TEMP_RTBRACK__',
};

chars.TEMP = reverse(chars.ESC_TEMP);

module.exports = chars;

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/glob.js", function(exports, module, require){
'use strict';

var braces = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/index.js");
var brackets = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/expand-brackets/index.js");
var extglob = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/extglob/index.js");
var parse = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/parse-glob/index.js");
var chars = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/chars.js");

/**
 * Expose `Glob`
 */

module.exports = Glob;

function Glob(pattern, options) {
  this.options = options || {};
  this.pattern = pattern;
  this.history = [];
  this.tokens = {};
  this.init(pattern);
}

/**
 * Initialize defaults
 */

Glob.prototype.init = function(pattern) {
  this.orig = pattern;
  this.negated = this.isNegated();
  this.options.track = this.options.track || false;
  this.options.makeRe = true;
};

/**
 * Push a change into `glob.history`. Useful
 * for debugging.
 */

Glob.prototype.track = function(msg) {
  if (this.options.track) {
    this.history.push({msg: msg, pattern: this.pattern});
  }
};

/**
 * Return true if the glob pattern has the given
 * `ch`aracter.
 *
 * @param  {String} `pattern`
 * @param  {String} `ch`
 * @return {Boolean}
 */

Glob.prototype.has = function(pattern, ch) {
  if (ch instanceof RegExp) {
    return ch.test(pattern);
  }
  return pattern.indexOf(ch) !== -1;
};

/**
 * Return true if `glob.pattern` was negated
 * with `!`. Also removes the `!` from the pattern.
 *
 * @return {Boolean}
 */

Glob.prototype.isNegated = function() {
  if (this.tokens.isNegated) return true;
  if (this.pattern.charCodeAt(0) === 33 /* '!' */) {
    this.pattern = this.pattern.slice(1);
    return true;
  }
  return false;
};

/**
 * Expand braces in the given glob pattern.
 *
 * We only need to use the [braces] lib when
 * patterns are nested.
 */

Glob.prototype.braces = function() {
  if (this.options.nobraces !== true && this.options.nobrace !== true) {
    // naive/fast check for imbalanced characters
    var a = this.pattern.match(/[\{\(\[]/g);
    var b = this.pattern.match(/[\}\)\]]/g);

    // if imbalanced, don't optimize the pattern
    if (a && b && (a.length !== b.length)) {
      this.options.makeRe = false;
    }

    // expand brace patterns and join the resulting array
    var expanded = braces(this.pattern, this.options);
    this.pattern = expanded.join('|');
  }
};

/**
 * Expand bracket expressions in `glob.pattern`
 */

Glob.prototype.brackets = function() {
  if (this.options.nobrackets !== true) {
    this.pattern = brackets(this.pattern);
  }
};

/**
 * Expand bracket expressions in `glob.pattern`
 */

Glob.prototype.extglob = function() {
  if (this.options.noextglob !== true) {
    this.pattern = extglob(this.pattern, {escape: true});
  }
};

/**
 * Parse the given glob `pattern` or `glob.pattern`
 */

Glob.prototype.parse = function(pattern) {
  this.tokens = parse(pattern || this.pattern, true);
  return this.tokens;
};

/**
 * Replace `a` with `b`. Also tracks the change before and
 * after each replacement. This is disabled by default, but
 * can be enabled by setting `options.track` to true.
 *
 * Also, when the pattern is a string, `.split()` is used,
 * because it's much faster than replace.
 *
 * @param  {RegExp|String} `a`
 * @param  {String} `b`
 * @param  {Boolean} `escape` When `true`, escapes `*` and `?` in the replacement.
 * @return {String}
 */

Glob.prototype._replace = function(a, b, escape) {
  this.track('before (find): "' + a + '" (replace with): "' + b + '"');
  if (escape) b = esc(b);
  if (a && b && typeof a === 'string') {
    this.pattern = this.pattern.split(a).join(b);
  } else if (a instanceof RegExp) {
    this.pattern = this.pattern.replace(a, b);
  }
  this.track('after');
};

/**
 * Escape special characters in the given string.
 *
 * @param  {String} `str` Glob pattern
 * @return {String}
 */

Glob.prototype.escape = function(str) {
  this.track('before escape: ');
  var re = /["\\](['"]?[^"'\\]['"]?)/g;

  this.pattern = str.replace(re, function($0, $1) {
    var o = chars.ESC;
    var ch = o && o[$1];
    if (ch) {
      return ch;
    }
    if (/[a-z]/i.test($0)) {
      return $0.split('\\').join('');
    }
    return $0;
  });

  this.track('after escape: ');
};

/**
 * Unescape special characters in the given string.
 *
 * @param  {String} `str`
 * @return {String}
 */

Glob.prototype.unescape = function(str) {
  var re = /__([A-Z]+)_([A-Z]+)__/g;
  this.pattern = str.replace(re, function($0, $1) {
    return chars[$1][$0];
  });
  this.pattern = unesc(this.pattern);
};

/**
 * Escape/unescape utils
 */

function esc(str) {
  str = str.split('?').join('%~');
  str = str.split('*').join('%%');
  return str;
}

function unesc(str) {
  str = str.split('%~').join('?');
  str = str.split('%%').join('*');
  return str;
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/expand.js", function(exports, module, require){
/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/utils.js");
var Glob = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/glob.js");

/**
 * Expose `expand`
 */

module.exports = expand;

/**
 * Expand a glob pattern to resolve braces and
 * similar patterns before converting to regex.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

function expand(pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('micromatch.expand(): argument should be a string.');
  }

  var glob = new Glob(pattern, options || {});
  var opts = glob.options;

  if (typeof opts.braces !== 'boolean' && typeof opts.nobraces !== 'boolean') {
    opts.braces = true;
  }

  // return early if glob pattern matches special patterns
  if (specialCase(pattern) && opts.safemode) {
    return new RegExp(utils.escapeRe(pattern), 'g');
  }

  if (glob.pattern === '.*') {
    return {
      pattern: '\\.' + star,
      tokens: tok,
      options: opts
    };
  }

  if (glob.pattern === '.') {
    return {
      pattern: '\\.',
      tokens: tok,
      options: opts
    };
  }

  if (glob.pattern === '*') {
    return {
      pattern: oneStar(opts.dot),
      tokens: tok,
      options: opts
    };
  }

  // parse the glob pattern into tokens
  glob.parse();
  var tok = glob.tokens;
  tok.is.negated = opts.negated;

  // dotfile handling
  if ((opts.dotfiles === true || tok.is.dotfile) && opts.dot !== false) {
    opts.dotfiles = true;
    opts.dot = true;
  }

  if ((opts.dotdirs === true || tok.is.dotdir) && opts.dot !== false) {
    opts.dotdirs = true;
    opts.dot = true;
  }

  // check for braces with a dotfile pattern
  if (/[{,]\./.test(glob.pattern)) {
    opts.makeRe = false;
    opts.dot = true;
  }

  if (opts.nonegate !== true) {
    opts.negated = glob.negated;
  }

  // if the leading character is a dot or a slash, escape it
  if (glob.pattern.charAt(0) === '.' && glob.pattern.charAt(1) !== '/') {
    glob.pattern = '\\' + glob.pattern;
  }

  /**
   * Extended globs
   */

  // expand brackets, e.g `[[:alpha:]]`
  glob.track('before brackets');
  if (tok.is.brackets) {
    glob.brackets();
  }
  glob.track('after brackets');

  // expand braces, e.g `{1..5}`
  glob.track('before braces');
  if (tok.is.braces) {
    glob.braces();
  }
  glob.track('after braces');

  // expand extglobs, e.g `foo/!(a|b)`
  glob.track('before extglob');
  if (tok.is.extglob) {
    glob.extglob();
  }
  glob.track('after extglob');

  // special patterns
  glob._replace('[!', '[^');
  glob._replace('(?', '(%~');
  glob._replace('[]', '\\[\\]');
  glob._replace('/[', '/' + (opts.dot ? dotfiles : nodot) + '[', true);
  glob._replace('/?', '/' + (opts.dot ? dotfiles : nodot) + '[^/]', true);
  glob._replace('/.', '/(?=.)\\.', true);

  // windows drives
  glob._replace(/^(\w):([\\\/]+?)/gi, '(?=.)$1:$2', true);

  // negate slashes in exclusion ranges
  if (glob.pattern.indexOf('[^') !== -1) {
    glob.pattern = negateSlash(glob.pattern);
  }

  if (opts.globstar !== false && glob.pattern === '**') {
     glob.pattern = globstar(opts.dot);

  } else {
    // '/*/*/*' => '(?:/*){3}'
    glob._replace(/(\/\*)+/g, function (match) {
      var len = match.length / 2;
      if (len === 1) { return match; }
      return '(?:\\/*){' + len + '}';
    });

    glob.pattern = balance(glob.pattern, '[', ']');
    glob.escape(glob.pattern);

    // if the pattern has `**`
    if (tok.is.globstar) {
      glob.pattern = collapse(glob.pattern, '/**');
      glob.pattern = collapse(glob.pattern, '**/');
      glob._replace(/\*{2,}/g, '**');

      // 'foo/*'
      glob._replace(/(\w+)\*(?!\/)/g, '$1[^/]*?', true);
      glob._replace(/\*\*\/\*(\w)/g, globstar(opts.dot) + '\\/' + (opts.dot ? dotfiles : nodot) + '[^/]*?$1', true);

      if (opts.dot !== true) {
        glob._replace(/\*\*\/(.)/g, '(?:**\\/|)$1');
      }

      // 'foo/**' or '{**,*}', but not 'foo**'
      if (tok.path.dirname !== '' || /,\*\*|\*\*,/.test(glob.orig)) {
        glob._replace('**', globstar(opts.dot), true);
      }
    }

    // ends with /*
    glob._replace(/\/\*$/, '\\/' + oneStar(opts.dot), true);
    // ends with *, no slashes
    glob._replace(/(?!\/)\*$/, star, true);
    // has 'n*.' (partial wildcard w/ file extension)
    glob._replace(/([^\/]+)\*/, '$1' + oneStar(true), true);
    // has '*'
    glob._replace('*', oneStar(opts.dot), true);
    glob._replace('?.', '?\\.', true);
    glob._replace('?:', '?:', true);

    glob._replace(/\?+/g, function (match) {
      var len = match.length;
      if (len === 1) {
        return qmark;
      }
      return qmark + '{' + len + '}';
    });

    // escape '.abc' => '\\.abc'
    glob._replace(/\.([*\w]+)/g, '\\.$1');
    // fix '[^\\\\/]'
    glob._replace(/\[\^[\\\/]+\]/g, qmark);
    // '///' => '\/'
    glob._replace(/\/+/g, '\\/');
    // '\\\\\\' => '\\'
    glob._replace(/\\{2,}/g, '\\');
  }

  // unescape previously escaped patterns
  glob.unescape(glob.pattern);
  glob._replace('__UNESC_STAR__', '*');

  // escape dots that follow qmarks
  glob._replace('?.', '?\\.');

  // remove unnecessary slashes in character classes
  glob._replace('[^\\/]', qmark);

  if (glob.pattern.length > 1) {
    if (glob.pattern.indexOf('\\/') === 0 && glob.pattern.indexOf('\\/' + nodot) !== 0) {
      glob.pattern = '\\/' + nodot + glob.pattern.slice(2);
    } else if (/^[\[?*]/.test(glob.pattern)) {
      // only prepend the string if we don't want to match dotfiles
      glob.pattern = (opts.dot ? dotfiles : nodot) + glob.pattern;
    }
  }

  return glob;
}

/**
 * Special cases. This is somewhat of a placeholder
 * for more advanced logic.
 */

function specialCase(glob) {
  if (glob === '\\') {
    return true;
  }
  return false;
}

/**
 * Collapse repeated character sequences.
 *
 * ```js
 * collapse('a/../../../b', '../');
 * //=> 'a/../b'
 * ```
 *
 * @param  {String} `str`
 * @param  {String} `ch` Character sequence to collapse
 * @return {String}
 */

function collapse(str, ch) {
  var res = str.split(ch);
  var isFirst = res[0] === '';
  var isLast = res[res.length - 1] === '';
  res = res.filter(Boolean);
  if (isFirst) res.unshift('');
  if (isLast) res.push('');
  return res.join(ch);
}

/**
 * Negate slashes in exclusion ranges, per glob spec:
 *
 * ```js
 * negateSlash('[^foo]');
 * //=> '[^\\/foo]'
 * ```
 *
 * @param  {String} `str` glob pattern
 * @return {String}
 */

function negateSlash(str) {
  return str.replace(/\[\^([^\]]*?)\]/g, function (match, inner) {
    if (inner.indexOf('/') === -1) {
      inner = '\\/' + inner;
    }
    return '[^' + inner + ']';
  });
}

/**
 * Escape imbalanced braces/bracket. This is a very
 * basic, naive implementation that only does enough
 * to serve the purpose.
 */

function balance(str, a, b) {
  var aarr = str.split(a);
  var alen = aarr.join('').length;
  var blen = str.split(b).join('').length;

  if (alen !== blen) {
    str = aarr.join('\\' + a);
    return str.split(b).join('\\' + b);
  }
  return str;
}

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
 */

var qmark       = '[^/]';
var star        = qmark + '*?';
var nodot       = '(?!\\.)(?=.)';
var dotfileGlob = '(?:\\/|^)\\.{1,2}($|\\/)';
var dotfiles    = '(?!' + dotfileGlob + ')(?=.)';
var twoStarDot  = '(?:(?!' + dotfileGlob + ').)*?';

/**
 * Create a regex for `*`.
 *
 * If `dot` is true, or the pattern does not begin with
 * a leading star, then return the simpler regex.
 */

function oneStar(dotfile) {
  return dotfile ? '(?!' + dotfileGlob + ')(?=.)' + star : (nodot + star);
}

function globstar(dotfile) {
  if (dotfile) { return twoStarDot; }
  return '(?:(?!(?:\\/|^)\\.).)*?';
}

});

__tpack__.define("../../../chokidar/node_modules/anymatch/node_modules/micromatch/index.js", function(exports, module, require){
/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var diff = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/arr-diff/index.js");
var typeOf = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/kind-of/index.js");
var omit = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/object.omit/index.js");
var unique = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/array-unique/index.js");
var cache = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/regex-cache/index.js");
var isGlob = require("../../chokidar/node_modules/is-glob/index.js");
var expand = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/expand.js");
var utils = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/lib/utils.js");

/**
 * The main function. Pass an array of filepaths,
 * and a string or array of glob patterns
 *
 * @param  {Array|String} `files`
 * @param  {Array|String} `patterns`
 * @param  {Object} `opts`
 * @return {Array} Array of matches
 */

function micromatch(files, patterns, opts) {
  if (!files || !patterns) return [];
  opts = opts || {};

  if (typeof opts.cache === 'undefined') {
    opts.cache = true;
  }

  if (!Array.isArray(patterns)) {
    return match(files, patterns, opts);
  }

  var len = patterns.length, i = 0;
  var omit = [], keep = [];

  while (len--) {
    var glob = patterns[i++];
    if (glob.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, match(files, glob.slice(1), opts));
    } else {
      keep.push.apply(keep, match(files, glob, opts));
    }
  }
  return diff(keep, omit);
}

/**
 * Pass an array of files and a glob pattern as a string.
 *
 * This function is called by the main `micromatch` function
 * If you only need to pass a single pattern you might get
 * very minor speed improvements using this function.
 *
 * @param  {Array} `files`
 * @param  {Array} `pattern`
 * @param  {Object} `options`
 * @return {Array}
 */

function match(files, pattern, opts) {
  if (typeOf(files) !== 'string' && !Array.isArray(files)) {
    throw new Error(msg('match', 'files', 'a string or array'));
  }

  files = utils.arrayify(files);
  opts = opts || {};

  var negate = opts.negate || false;
  var orig = pattern;

  if (typeof pattern === 'string' && opts.nonegate !== true) {
    negate = pattern.charAt(0) === '!';
    if (negate) {
      pattern = pattern.slice(1);
    }
  }

  var _isMatch = matcher(pattern, opts);
  var len = files.length, i = 0;
  var res = [];

  while (i < len) {
    var file = files[i++];
    var fp = utils.unixify(file, opts);

    if (!_isMatch(fp)) { continue; }
    res.push(fp);
  }

  if (res.length === 0) {
    if (opts.failglob === true) {
      throw new Error('micromatch.match() found no matches for: "' + orig + '".');
    }

    if (opts.nonull || opts.nullglob) {
      res.push(utils.unescapeGlob(orig));
    }
  }

  // if `negate` was defined, diff negated files
  if (negate) { res = diff(files, res); }

  // if `ignore` was defined, diff ignored filed
  if (opts.ignore && opts.ignore.length) {
    pattern = opts.ignore;
    opts = omit(opts, ['ignore']);
    res = diff(res, micromatch(res, pattern, opts));
  }

  if (opts.nodupes) {
    return unique(res);
  }
  return res;
}

/**
 * Returns a function that takes a glob pattern or array of glob patterns
 * to be used with `Array#filter()`. (Internally this function generates
 * the matching function using the [matcher] method).
 *
 * ```js
 * var fn = mm.filter('[a-c]');
 * ['a', 'b', 'c', 'd', 'e'].filter(fn);
 * //=> ['a', 'b', 'c']
 * ```
 *
 * @param  {String|Array} `patterns` Can be a glob or array of globs.
 * @param  {Options} `opts` Options to pass to the [matcher] method.
 * @return {Function} Filter function to be passed to `Array#filter()`.
 */

function filter(patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('filter', 'patterns', 'a string or array'));
  }

  patterns = utils.arrayify(patterns);
  return function (fp) {
    if (fp == null) return [];
    var len = patterns.length, i = 0;
    var res = true;

    fp = utils.unixify(fp, opts);
    while (i < len) {
      var fn = matcher(patterns[i++], opts);
      if (!fn(fp)) {
        res = false;
        break;
      }
    }
    return res;
  };
}

/**
 * Returns true if the filepath contains the given
 * pattern. Can also return a function for matching.
 *
 * ```js
 * isMatch('foo.md', '*.md', {});
 * //=> true
 *
 * isMatch('*.md', {})('foo.md')
 * //=> true
 * ```
 *
 * @param  {String} `fp`
 * @param  {String} `pattern`
 * @param  {Object} `opts`
 * @return {Boolean}
 */

function isMatch(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('isMatch', 'filepath', 'a string'));
  }

  fp = utils.unixify(fp, opts);
  if (typeOf(pattern) === 'object') {
    return matcher(fp, pattern);
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Returns true if the filepath matches the
 * given pattern.
 */

function contains(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('contains', 'pattern', 'a string'));
  }

  opts = opts || {};
  opts.contains = (pattern !== '');
  fp = utils.unixify(fp, opts);

  if (opts.contains && !isGlob(pattern)) {
    return fp.indexOf(pattern) !== -1;
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Returns true if a file path matches any of the
 * given patterns.
 *
 * @param  {String} `fp` The filepath to test.
 * @param  {String|Array} `patterns` Glob patterns to use.
 * @param  {Object} `opts` Options to pass to the `matcher()` function.
 * @return {String}
 */

function any(fp, patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('any', 'patterns', 'a string or array'));
  }

  patterns = utils.arrayify(patterns);
  var len = patterns.length;

  fp = utils.unixify(fp, opts);
  while (len--) {
    var isMatch = matcher(patterns[len], opts);
    if (isMatch(fp)) {
      return true;
    }
  }
  return false;
}

/**
 * Filter the keys of an object with the given `glob` pattern
 * and `options`
 *
 * @param  {Object} `object`
 * @param  {Pattern} `object`
 * @return {Array}
 */

function matchKeys(obj, glob, options) {
  if (typeOf(obj) !== 'object') {
    throw new TypeError(msg('matchKeys', 'first argument', 'an object'));
  }

  var fn = matcher(glob, options);
  var res = {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && fn(key)) {
      res[key] = obj[key];
    }
  }
  return res;
}

/**
 * Return a function for matching based on the
 * given `pattern` and `options`.
 *
 * @param  {String} `pattern`
 * @param  {Object} `options`
 * @return {Function}
 */

function matcher(pattern, opts) {
  // pattern is a function
  if (typeof pattern === 'function') {
    return pattern;
  }
  // pattern is a regex
  if (pattern instanceof RegExp) {
    return function(fp) {
      return pattern.test(fp);
    };
  }

  // strings, all the way down...
  pattern = utils.unixify(pattern, opts);

  // pattern is a non-glob string
  if (!isGlob(pattern)) {
    return utils.matchPath(pattern, opts);
  }
  // pattern is a glob string
  var re = makeRe(pattern, opts);

  // `matchBase` is defined
  if (opts && opts.matchBase) {
    return utils.hasFilename(re, opts);
  }
  // `matchBase` is not defined
  return function(fp) {
    fp = utils.unixify(fp, opts);
    return re.test(fp);
  };
}

/**
 * Create and cache a regular expression for matching
 * file paths.
 *
 * If the leading character in the `glob` is `!`, a negation
 * regex is returned.
 *
 * @param  {String} `glob`
 * @param  {Object} `options`
 * @return {RegExp}
 */

function toRegex(glob, options) {
  if (typeOf(glob) !== 'string') {
    throw new Error(msg('toRegex', 'glob', 'a string'));
  }

  // clone options to prevent  mutating the original object
  var opts = Object.create(options || {});
  var flags = opts.flags || '';
  if (opts.nocase && flags.indexOf('i') === -1) {
    flags += 'i';
  }

  var parsed = expand(glob, opts);

  // pass in tokens to avoid parsing more than once
  opts.negated = opts.negated || parsed.negated;
  opts.negate = opts.negated;
  glob = wrapGlob(parsed.pattern, opts);
  var re;

  try {
    re = new RegExp(glob, flags);
    return re;
  } catch (err) {
    var msg = 'micromatch invalid regex: (' + re + ')';
    if (opts.strict) throw new SyntaxError(msg + err);
  }
  return /$^/;
}

/**
 * Create the regex to do the matching. If the leading
 * character in the `glob` is `!` a negation regex is returned.
 *
 * @param {String} `glob`
 * @param {Boolean} `negate`
 */

function wrapGlob(glob, opts) {
  var prefix = (opts && !opts.contains) ? '^' : '';
  var after = (opts && !opts.contains) ? '$' : '';
  glob = ('(?:' + glob + ')' + after);
  if (opts && opts.negate) {
    return prefix + ('(?!^' + glob + ').*$');
  }
  return prefix + glob;
}

/**
 * Wrap `toRegex` to memoize the generated regex
 * the string and options don't change
 */

function makeRe(glob, opts) {
  return cache(toRegex, glob, opts);
}

/**
 * Make error messages consistent. Follows this format:
 *
 * ```js
 * msg(methodName, argNumber, nativeType);
 * // example:
 * msg('matchKeys', 'first', 'an object');
 * ```
 *
 * @param  {String} `method`
 * @param  {String} `num`
 * @param  {String} `type`
 * @return {String}
 */

function msg(method, what, type) {
  return 'micromatch.' + method + '(): ' + what + ' should be ' + type + '.';
}

/**
 * Public methods
 */

micromatch.any       = any;
micromatch.braces    = micromatch.braceExpand = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/node_modules/braces/index.js");
micromatch.contains  = contains;
micromatch.expand    = expand;
micromatch.filter    = filter;
micromatch.isMatch   = isMatch;
micromatch.makeRe    = makeRe;
micromatch.match     = match;
micromatch.matcher   = matcher;
micromatch.matchKeys = matchKeys;

/**
 * Expose `micromatch`
 */

module.exports = micromatch;

});

__tpack__.define("../../../chokidar/node_modules/anymatch/index.js", function(exports, module, require){
'use strict';

var arrify = require("../../chokidar/node_modules/arrify/index.js");
var micromatch = require("../../chokidar/node_modules/anymatch/node_modules/micromatch/index.js");
var path = require("path");

var anymatch = function(criteria, value, returnIndex, startIndex, endIndex) {
  criteria = arrify(criteria);
  value = arrify(value);
  if (arguments.length === 1) {
    return anymatch.bind(null, criteria.map(function(criterion) {
      return typeof criterion === 'string' && criterion[0] !== '!' ?
        micromatch.matcher(criterion) : criterion;
    }));
  }
  startIndex = startIndex || 0;
  var string = value[0];
  var altString;
  var matched = false;
  var matchIndex = -1;
  function testCriteria (criterion, index) {
    var result;
    switch (toString.call(criterion)) {
    case '[object String]':
      result = string === criterion || altString && altString === criterion;
      result = result || micromatch.isMatch(string, criterion);
      break;
    case '[object RegExp]':
      result = criterion.test(string) || altString && criterion.test(altString);
      break;
    case '[object Function]':
      result = criterion.apply(null, value);
      break;
    default:
      result = false;
    }
    if (result) {
      matchIndex = index + startIndex;
    }
    return result;
  }
  var crit = criteria;
  var negGlobs = crit.reduce(function(arr, criterion, index) {
    if (typeof criterion === 'string' && criterion[0] === '!') {
      if (crit === criteria) {
        // make a copy before modifying
        crit = crit.slice();
      }
      crit[index] = null;
      arr.push(criterion.substr(1));
    }
    return arr;
  }, []);
  if (!negGlobs.length || !micromatch.any(string, negGlobs)) {
    if (path.sep === '\\' && typeof string === 'string') {
      altString = string.split('\\').join('/');
      altString = altString === string ? null : altString;
    }
    matched = crit.slice(startIndex, endIndex).some(testCriteria);
  }
  return returnIndex === true ? matchIndex : matched;
};

module.exports = anymatch;

});

__tpack__.define("../../../chokidar/node_modules/path-is-absolute/index.js", function(exports, module, require){
var process = __tpack__.require("process");
'use strict';

function posix(path) {
	return path.charAt(0) === '/';
};

function win32(path) {
	// https://github.com/joyent/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = !!device && device.charAt(1) !== ':';

	// UNC paths are always absolute
	return !!result[2] || isUnc;
};

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;

});

__tpack__.define("../../../chokidar/node_modules/lodash.isarguments/index.js", function(exports, module, require){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

});

__tpack__.define("../../../chokidar/node_modules/lodash.isarray/index.js", function(exports, module, require){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

});

__tpack__.define("../../../chokidar/node_modules/lodash._baseflatten/index.js", function(exports, module, require){
/**
 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require("../../chokidar/node_modules/lodash.isarguments/index.js"),
    isArray = require("../../chokidar/node_modules/lodash.isarray/index.js");

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;

});

__tpack__.define("../../../chokidar/node_modules/lodash._isiterateecall/index.js", function(exports, module, require){
/**
 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isIterateeCall;

});

__tpack__.define("../../../chokidar/node_modules/lodash.flatten/index.js", function(exports, module, require){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require("../../chokidar/node_modules/lodash._baseflatten/index.js"),
    isIterateeCall = require("../../chokidar/node_modules/lodash._isiterateecall/index.js");

/**
 * Flattens a nested array. If `isDeep` is `true` the array is recursively
 * flattened, otherwise it is only flattened a single level.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, 3, [4]]]);
 * // => [1, 2, 3, [4]]
 *
 * // using `isDeep`
 * _.flatten([1, [2, 3, [4]]], true);
 * // => [1, 2, 3, 4]
 */
function flatten(array, isDeep, guard) {
  var length = array ? array.length : 0;
  if (guard && isIterateeCall(array, isDeep, guard)) {
    isDeep = false;
  }
  return length ? baseFlatten(array, isDeep) : [];
}

module.exports = flatten;

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/graceful-fs/fs.js", function(exports, module, require){
'use strict'

var fs = require("fs")

module.exports = clone(fs)

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}

});

__tpack__.define("../../../node-libs-browser/node_modules/constants-browserify/constants.json", function(exports, module, require){
module.exports = {
  "O_RDONLY": 0,
  "O_WRONLY": 1,
  "O_RDWR": 2,
  "S_IFMT": 61440,
  "S_IFREG": 32768,
  "S_IFDIR": 16384,
  "S_IFCHR": 8192,
  "S_IFBLK": 24576,
  "S_IFIFO": 4096,
  "S_IFLNK": 40960,
  "S_IFSOCK": 49152,
  "O_CREAT": 512,
  "O_EXCL": 2048,
  "O_NOCTTY": 131072,
  "O_TRUNC": 1024,
  "O_APPEND": 8,
  "O_DIRECTORY": 1048576,
  "O_NOFOLLOW": 256,
  "O_SYNC": 128,
  "O_SYMLINK": 2097152,
  "S_IRWXU": 448,
  "S_IRUSR": 256,
  "S_IWUSR": 128,
  "S_IXUSR": 64,
  "S_IRWXG": 56,
  "S_IRGRP": 32,
  "S_IWGRP": 16,
  "S_IXGRP": 8,
  "S_IRWXO": 7,
  "S_IROTH": 4,
  "S_IWOTH": 2,
  "S_IXOTH": 1,
  "E2BIG": 7,
  "EACCES": 13,
  "EADDRINUSE": 48,
  "EADDRNOTAVAIL": 49,
  "EAFNOSUPPORT": 47,
  "EAGAIN": 35,
  "EALREADY": 37,
  "EBADF": 9,
  "EBADMSG": 94,
  "EBUSY": 16,
  "ECANCELED": 89,
  "ECHILD": 10,
  "ECONNABORTED": 53,
  "ECONNREFUSED": 61,
  "ECONNRESET": 54,
  "EDEADLK": 11,
  "EDESTADDRREQ": 39,
  "EDOM": 33,
  "EDQUOT": 69,
  "EEXIST": 17,
  "EFAULT": 14,
  "EFBIG": 27,
  "EHOSTUNREACH": 65,
  "EIDRM": 90,
  "EILSEQ": 92,
  "EINPROGRESS": 36,
  "EINTR": 4,
  "EINVAL": 22,
  "EIO": 5,
  "EISCONN": 56,
  "EISDIR": 21,
  "ELOOP": 62,
  "EMFILE": 24,
  "EMLINK": 31,
  "EMSGSIZE": 40,
  "EMULTIHOP": 95,
  "ENAMETOOLONG": 63,
  "ENETDOWN": 50,
  "ENETRESET": 52,
  "ENETUNREACH": 51,
  "ENFILE": 23,
  "ENOBUFS": 55,
  "ENODATA": 96,
  "ENODEV": 19,
  "ENOENT": 2,
  "ENOEXEC": 8,
  "ENOLCK": 77,
  "ENOLINK": 97,
  "ENOMEM": 12,
  "ENOMSG": 91,
  "ENOPROTOOPT": 42,
  "ENOSPC": 28,
  "ENOSR": 98,
  "ENOSTR": 99,
  "ENOSYS": 78,
  "ENOTCONN": 57,
  "ENOTDIR": 20,
  "ENOTEMPTY": 66,
  "ENOTSOCK": 38,
  "ENOTSUP": 45,
  "ENOTTY": 25,
  "ENXIO": 6,
  "EOPNOTSUPP": 102,
  "EOVERFLOW": 84,
  "EPERM": 1,
  "EPIPE": 32,
  "EPROTO": 100,
  "EPROTONOSUPPORT": 43,
  "EPROTOTYPE": 41,
  "ERANGE": 34,
  "EROFS": 30,
  "ESPIPE": 29,
  "ESRCH": 3,
  "ESTALE": 70,
  "ETIME": 101,
  "ETIMEDOUT": 60,
  "ETXTBSY": 26,
  "EWOULDBLOCK": 35,
  "EXDEV": 18,
  "SIGHUP": 1,
  "SIGINT": 2,
  "SIGQUIT": 3,
  "SIGILL": 4,
  "SIGTRAP": 5,
  "SIGABRT": 6,
  "SIGIOT": 6,
  "SIGBUS": 10,
  "SIGFPE": 8,
  "SIGKILL": 9,
  "SIGUSR1": 30,
  "SIGSEGV": 11,
  "SIGUSR2": 31,
  "SIGPIPE": 13,
  "SIGALRM": 14,
  "SIGTERM": 15,
  "SIGCHLD": 20,
  "SIGCONT": 19,
  "SIGSTOP": 17,
  "SIGTSTP": 18,
  "SIGTTIN": 21,
  "SIGTTOU": 22,
  "SIGURG": 16,
  "SIGXCPU": 24,
  "SIGXFSZ": 25,
  "SIGVTALRM": 26,
  "SIGPROF": 27,
  "SIGWINCH": 28,
  "SIGIO": 23,
  "SIGSYS": 12,
  "SSL_OP_ALL": 2147486719,
  "SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION": 262144,
  "SSL_OP_CIPHER_SERVER_PREFERENCE": 4194304,
  "SSL_OP_CISCO_ANYCONNECT": 32768,
  "SSL_OP_COOKIE_EXCHANGE": 8192,
  "SSL_OP_CRYPTOPRO_TLSEXT_BUG": 2147483648,
  "SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS": 2048,
  "SSL_OP_EPHEMERAL_RSA": 2097152,
  "SSL_OP_LEGACY_SERVER_CONNECT": 4,
  "SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER": 32,
  "SSL_OP_MICROSOFT_SESS_ID_BUG": 1,
  "SSL_OP_MSIE_SSLV2_RSA_PADDING": 64,
  "SSL_OP_NETSCAPE_CA_DN_BUG": 536870912,
  "SSL_OP_NETSCAPE_CHALLENGE_BUG": 2,
  "SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG": 1073741824,
  "SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG": 8,
  "SSL_OP_NO_COMPRESSION": 131072,
  "SSL_OP_NO_QUERY_MTU": 4096,
  "SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION": 65536,
  "SSL_OP_NO_SSLv2": 16777216,
  "SSL_OP_NO_SSLv3": 33554432,
  "SSL_OP_NO_TICKET": 16384,
  "SSL_OP_NO_TLSv1": 67108864,
  "SSL_OP_NO_TLSv1_1": 268435456,
  "SSL_OP_NO_TLSv1_2": 134217728,
  "SSL_OP_PKCS1_CHECK_1": 0,
  "SSL_OP_PKCS1_CHECK_2": 0,
  "SSL_OP_SINGLE_DH_USE": 1048576,
  "SSL_OP_SINGLE_ECDH_USE": 524288,
  "SSL_OP_SSLEAY_080_CLIENT_DH_BUG": 128,
  "SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG": 16,
  "SSL_OP_TLS_BLOCK_PADDING_BUG": 512,
  "SSL_OP_TLS_D5_BUG": 256,
  "SSL_OP_TLS_ROLLBACK_BUG": 8388608,
  "NPN_ENABLED": 1
}
;
});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/graceful-fs/polyfills.js", function(exports, module, require){
var process = __tpack__.require("process");
var fs = require("../../chokidar/node_modules/readdirp/node_modules/graceful-fs/fs.js")
var constants = require("constants")

var origCwd = process.cwd
var cwd = null
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chownFix(fs.chmod)
  fs.fchmod = chownFix(fs.fchmod)
  fs.lchmod = chownFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chownFix(fs.chmodSync)
  fs.fchmodSync = chownFix(fs.fchmodSync)
  fs.lchmodSync = chownFix(fs.lchmodSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 1 second.
  if (process.platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 1000) {
          return fs$rename(from, to, CB)
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)
}

function patchLchmod (fs) {
  fs.lchmod = function (path, mode, callback) {
    callback = callback || noop
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var threw = true
    var ret
    try {
      ret = fs.fchmodSync(fd, mode)
      threw = false
    } finally {
      if (threw) {
        try {
          fs.closeSync(fd)
        } catch (er) {}
      } else {
        fs.closeSync(fd)
      }
    }
    return ret
  }
}

function patchLutimes (fs) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        cb = cb || noop
        if (er) return cb(er)
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            return cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
      var ret
      var threw = true
      try {
        ret = fs.futimesSync(fd, at, mt)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}

function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er, res) {
      if (chownErOk(er)) er = null
      cb(er, res)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}

// ENOSYS means that the fs doesn't support the op. Just ignore
// that, because it doesn't matter.
//
// if there's no getuid, or if getuid() is something other
// than 0, and the error is EINVAL or EPERM, then just ignore
// it.
//
// This specific case is a silent failure in cp, install, tar,
// and most other unix tools that manage permissions.
//
// When running as root, or if other types of errors are
// encountered, then it's strict.
function chownErOk (er) {
  if (!er)
    return true

  if (er.code === "ENOSYS")
    return true

  var nonroot = !process.getuid || process.getuid() !== 0
  if (nonroot) {
    if (er.code === "EINVAL" || er.code === "EPERM")
      return true
  }

  return false
}

});

__tpack__.define("../../../node-libs-browser/node_modules/inherits/inherits.js", function(exports, module, require){
module.exports = require("util").inherits

});

__tpack__.define("../../../node-libs-browser/node_modules/stream-browserify/index.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require("events").EventEmitter;
var inherits = require("../../node-libs-browser/node_modules/inherits/inherits.js");

inherits(Stream, EE);
Stream.Readable = require("../../node-libs-browser/node_modules/readable-stream/readable.js");
Stream.Writable = require("../../node-libs-browser/node_modules/readable-stream/writable.js");
Stream.Duplex = require("../../node-libs-browser/node_modules/readable-stream/duplex.js");
Stream.Transform = require("../../node-libs-browser/node_modules/readable-stream/transform.js");
Stream.PassThrough = require("../../node-libs-browser/node_modules/readable-stream/passthrough.js");

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/graceful-fs/legacy-streams.js", function(exports, module, require){
var process = __tpack__.require("process");
var Stream = require("stream").Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}

});

__tpack__.define("../../../node-libs-browser/node_modules/assert/assert.js", function(exports, module, require){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require("../../node-libs-browser/node_modules/util/util.js");

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/graceful-fs/graceful-fs.js", function(exports, module, require){
var process = __tpack__.require("process");
var fs = require("fs")
var polyfills = require("../../chokidar/node_modules/readdirp/node_modules/graceful-fs/polyfills.js")
var legacy = require("../../chokidar/node_modules/readdirp/node_modules/graceful-fs/legacy-streams.js")
var queue = []

var util = require("util")

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    require("assert").equal(queue.length, 0)
  })
}

module.exports = patch(require("../../chokidar/node_modules/readdirp/node_modules/graceful-fs/fs.js"))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  module.exports = patch(fs)
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
fs.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

fs.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, cb) {
    return go$readdir(path, cb)

    function go$readdir () {
      return fs$readdir(path, function (err, files) {
        if (files && files.sort)
          files.sort();  // Backwards compatibility with graceful-fs.

        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readdir, [path, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }


  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
  ReadStream.prototype.open = ReadStream$open

  var fs$WriteStream = fs.WriteStream
  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
  WriteStream.prototype.open = WriteStream$open

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/minimatch/node_modules/lru-cache/lib/lru-cache.js", function(exports, module, require){
;(function () { // closure for web browsers

if (typeof module === 'object' && module.exports) {
  module.exports = LRUCache
} else {
  // just set the global for non-node platforms.
  this.LRUCache = LRUCache
}

function hOP (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function naiveLength () { return 1 }

function LRUCache (options) {
  if (!(this instanceof LRUCache))
    return new LRUCache(options)

  if (typeof options === 'number')
    options = { max: options }

  if (!options)
    options = {}

  this._max = options.max
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!this._max || !(typeof this._max === "number") || this._max <= 0 )
    this._max = Infinity

  this._lengthCalculator = options.length || naiveLength
  if (typeof this._lengthCalculator !== "function")
    this._lengthCalculator = naiveLength

  this._allowStale = options.stale || false
  this._maxAge = options.maxAge || null
  this._dispose = options.dispose
  this.reset()
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, "max",
  { set : function (mL) {
      if (!mL || !(typeof mL === "number") || mL <= 0 ) mL = Infinity
      this._max = mL
      if (this._length > this._max) trim(this)
    }
  , get : function () { return this._max }
  , enumerable : true
  })

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, "lengthCalculator",
  { set : function (lC) {
      if (typeof lC !== "function") {
        this._lengthCalculator = naiveLength
        this._length = this._itemCount
        for (var key in this._cache) {
          this._cache[key].length = 1
        }
      } else {
        this._lengthCalculator = lC
        this._length = 0
        for (var key in this._cache) {
          this._cache[key].length = this._lengthCalculator(this._cache[key].value)
          this._length += this._cache[key].length
        }
      }

      if (this._length > this._max) trim(this)
    }
  , get : function () { return this._lengthCalculator }
  , enumerable : true
  })

Object.defineProperty(LRUCache.prototype, "length",
  { get : function () { return this._length }
  , enumerable : true
  })


Object.defineProperty(LRUCache.prototype, "itemCount",
  { get : function () { return this._itemCount }
  , enumerable : true
  })

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  var i = 0
  var itemCount = this._itemCount

  for (var k = this._mru - 1; k >= 0 && i < itemCount; k--) if (this._lruList[k]) {
    i++
    var hit = this._lruList[k]
    if (isStale(this, hit)) {
      del(this, hit)
      if (!this._allowStale) hit = undefined
    }
    if (hit) {
      fn.call(thisp, hit.value, hit.key, this)
    }
  }
}

LRUCache.prototype.keys = function () {
  var keys = new Array(this._itemCount)
  var i = 0
  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
    var hit = this._lruList[k]
    keys[i++] = hit.key
  }
  return keys
}

LRUCache.prototype.values = function () {
  var values = new Array(this._itemCount)
  var i = 0
  for (var k = this._mru - 1; k >= 0 && i < this._itemCount; k--) if (this._lruList[k]) {
    var hit = this._lruList[k]
    values[i++] = hit.value
  }
  return values
}

LRUCache.prototype.reset = function () {
  if (this._dispose && this._cache) {
    for (var k in this._cache) {
      this._dispose(k, this._cache[k].value)
    }
  }

  this._cache = Object.create(null) // hash of items by key
  this._lruList = Object.create(null) // list of items in order of use recency
  this._mru = 0 // most recently used
  this._lru = 0 // least recently used
  this._length = 0 // number of items in the list
  this._itemCount = 0
}

// Provided for debugging/dev purposes only. No promises whatsoever that
// this API stays stable.
LRUCache.prototype.dump = function () {
  return this._cache
}

LRUCache.prototype.dumpLru = function () {
  return this._lruList
}

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this._maxAge
  var now = maxAge ? Date.now() : 0

  if (hOP(this._cache, key)) {
    // dispose of the old one before overwriting
    if (this._dispose)
      this._dispose(key, this._cache[key].value)

    this._cache[key].now = now
    this._cache[key].maxAge = maxAge
    this._cache[key].value = value
    this.get(key)
    return true
  }

  var len = this._lengthCalculator(value)
  var hit = new Entry(key, value, this._mru++, len, now, maxAge)

  // oversized objects fall out of cache automatically.
  if (hit.length > this._max) {
    if (this._dispose) this._dispose(key, value)
    return false
  }

  this._length += hit.length
  this._lruList[hit.lu] = this._cache[key] = hit
  this._itemCount ++

  if (this._length > this._max)
    trim(this)

  return true
}

LRUCache.prototype.has = function (key) {
  if (!hOP(this._cache, key)) return false
  var hit = this._cache[key]
  if (isStale(this, hit)) {
    return false
  }
  return true
}

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
}

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
}

LRUCache.prototype.pop = function () {
  var hit = this._lruList[this._lru]
  del(this, hit)
  return hit || null
}

LRUCache.prototype.del = function (key) {
  del(this, this._cache[key])
}

function get (self, key, doUse) {
  var hit = self._cache[key]
  if (hit) {
    if (isStale(self, hit)) {
      del(self, hit)
      if (!self._allowStale) hit = undefined
    } else {
      if (doUse) use(self, hit)
    }
    if (hit) hit = hit.value
  }
  return hit
}

function isStale(self, hit) {
  if (!hit || (!hit.maxAge && !self._maxAge)) return false
  var stale = false;
  var diff = Date.now() - hit.now
  if (hit.maxAge) {
    stale = diff > hit.maxAge
  } else {
    stale = self._maxAge && (diff > self._maxAge)
  }
  return stale;
}

function use (self, hit) {
  shiftLU(self, hit)
  hit.lu = self._mru ++
  self._lruList[hit.lu] = hit
}

function trim (self) {
  while (self._lru < self._mru && self._length > self._max)
    del(self, self._lruList[self._lru])
}

function shiftLU (self, hit) {
  delete self._lruList[ hit.lu ]
  while (self._lru < self._mru && !self._lruList[self._lru]) self._lru ++
}

function del (self, hit) {
  if (hit) {
    if (self._dispose) self._dispose(hit.key, hit.value)
    self._length -= hit.length
    self._itemCount --
    delete self._cache[ hit.key ]
    shiftLU(self, hit)
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, lu, length, now, maxAge) {
  this.key = key
  this.value = value
  this.lu = lu
  this.length = length
  this.now = now
  if (maxAge) this.maxAge = maxAge
}

})()

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/minimatch/node_modules/sigmund/sigmund.js", function(exports, module, require){
module.exports = sigmund
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/minimatch/minimatch.js", function(exports, module, require){
var process = __tpack__.require("process");
;(function (require, exports, module, platform) {

if (module) module.exports = minimatch
else exports.minimatch = minimatch

if (!require) {
  require = function (id) {
    switch (id) {
      case "sigmund": return function sigmund (obj) {
        return JSON.stringify(obj)
      }
      case "path": return { basename: function (f) {
        f = f.split(/[\/\\]/)
        var e = f.pop()
        if (!e) e = f.pop()
        return e
      }}
      case "lru-cache": return function LRUCache () {
        // not quite an LRU, but still space-limited.
        var cache = {}
        var cnt = 0
        this.set = function (k, v) {
          cnt ++
          if (cnt >= 100) cache = {}
          cache[k] = v
        }
        this.get = function (k) { return cache[k] }
      }
    }
  }
}

minimatch.Minimatch = Minimatch

var LRU = require("../../chokidar/node_modules/readdirp/node_modules/minimatch/node_modules/lru-cache/lib/lru-cache.js")
  , cache = minimatch.cache = new LRU({max: 100})
  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
  , sigmund = require("../../chokidar/node_modules/readdirp/node_modules/minimatch/node_modules/sigmund/sigmund.js")

var path = require("path")
  // any single thing other than /
  // don't need to escape / when using new RegExp()
  , qmark = "[^/]"

  // * => any number of characters
  , star = qmark + "*?"

  // ** when dots are allowed.  Anything goes, except .. and .
  // not (^ or / followed by one or two dots followed by $ or /),
  // followed by anything, any number of times.
  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

  // not a ^ or / followed by a dot,
  // followed by anything, any number of times.
  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

  // characters that need to be escaped in RegExp.
  , reSpecials = charSet("().*{}+?[]^$\\!")

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split("").reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}


function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === "") return p === ""

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options, cache)
  }

  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    pattern = pattern.split("\\").join("/")
  }

  // lru storage.
  // these things aren't particularly big, but walking down the string
  // and turning it into a regexp can get pretty costly.
  var cacheKey = pattern + "\n" + sigmund(options)
  var cached = minimatch.cache.get(cacheKey)
  if (cached) return cached
  minimatch.cache.set(cacheKey, this)

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function() {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return -1 === s.indexOf(false)
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
    , negate = false
    , options = this.options
    , negateOffset = 0

  if (options.nonegate) return

  for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
    negate = !negate
    negateOffset ++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return new Minimatch(pattern, options).braceExpand()
}

Minimatch.prototype.braceExpand = braceExpand
function braceExpand (pattern, options) {
  options = options || this.options
  pattern = typeof pattern === "undefined"
    ? this.pattern : pattern

  if (typeof pattern === "undefined") {
    throw new Error("undefined pattern")
  }

  if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  var escaping = false

  // examples and comments refer to this crazy pattern:
  // a{b,c{d,e},{f,g}h}x{y,z}
  // expected:
  // abxy
  // abxz
  // acdxy
  // acdxz
  // acexy
  // acexz
  // afhxy
  // afhxz
  // aghxy
  // aghxz

  // everything before the first \{ is just a prefix.
  // So, we pluck that off, and work with the rest,
  // and then prepend it to everything we find.
  if (pattern.charAt(0) !== "{") {
    this.debug(pattern)
    var prefix = null
    for (var i = 0, l = pattern.length; i < l; i ++) {
      var c = pattern.charAt(i)
      this.debug(i, c)
      if (c === "\\") {
        escaping = !escaping
      } else if (c === "{" && !escaping) {
        prefix = pattern.substr(0, i)
        break
      }
    }

    // actually no sets, all { were escaped.
    if (prefix === null) {
      this.debug("no sets")
      return [pattern]
    }

   var tail = braceExpand.call(this, pattern.substr(i), options)
    return tail.map(function (t) {
      return prefix + t
    })
  }

  // now we have something like:
  // {b,c{d,e},{f,g}h}x{y,z}
  // walk through the set, expanding each part, until
  // the set ends.  then, we'll expand the suffix.
  // If the set only has a single member, then'll put the {} back

  // first, handle numeric sets, since they're easier
  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
  if (numset) {
    this.debug("numset", numset[1], numset[2])
    var suf = braceExpand.call(this, pattern.substr(numset[0].length), options)
      , start = +numset[1]
      , end = +numset[2]
      , inc = start > end ? -1 : 1
      , set = []
    for (var i = start; i != (end + inc); i += inc) {
      // append all the suffixes
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        set.push(i + suf[ii])
      }
    }
    return set
  }

  // ok, walk through the set
  // We hope, somewhat optimistically, that there
  // will be a } at the end.
  // If the closing brace isn't found, then the pattern is
  // interpreted as braceExpand("\\" + pattern) so that
  // the leading \{ will be interpreted literally.
  var i = 1 // skip the \{
    , depth = 1
    , set = []
    , member = ""
    , sawEnd = false
    , escaping = false

  function addMember () {
    set.push(member)
    member = ""
  }

  this.debug("Entering for")
  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
    var c = pattern.charAt(i)
    this.debug("", i, c)

    if (escaping) {
      escaping = false
      member += "\\" + c
    } else {
      switch (c) {
        case "\\":
          escaping = true
          continue

        case "{":
          depth ++
          member += "{"
          continue

        case "}":
          depth --
          // if this closes the actual set, then we're done
          if (depth === 0) {
            addMember()
            // pluck off the close-brace
            i ++
            break FOR
          } else {
            member += c
            continue
          }

        case ",":
          if (depth === 1) {
            addMember()
          } else {
            member += c
          }
          continue

        default:
          member += c
          continue
      } // switch
    } // else
  } // for

  // now we've either finished the set, and the suffix is
  // pattern.substr(i), or we have *not* closed the set,
  // and need to escape the leading brace
  if (depth !== 0) {
    this.debug("didn't close", pattern)
    return braceExpand.call(this, "\\" + pattern, options)
  }

  // x{y,z} -> ["xy", "xz"]
  this.debug("set", set)
  this.debug("suffix", pattern.substr(i))
  var suf = braceExpand.call(this, pattern.substr(i), options)
  // ["b", "c{d,e}","{f,g}h"] ->
  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
  var addBraces = set.length === 1
  this.debug("set pre-expanded", set)
  set = set.map(function (p) {
    return braceExpand.call(this, p, options)
  }, this)
  this.debug("set expanded", set)


  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
  //   ["b", "cd", "ce", "fh", "gh"]
  set = set.reduce(function (l, r) {
    return l.concat(r)
  })

  if (addBraces) {
    set = set.map(function (s) {
      return "{" + s + "}"
    })
  }

  // now attach the suffixes.
  var ret = []
  for (var i = 0, l = set.length; i < l; i ++) {
    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
      ret.push(set[i] + suf[ii])
    }
  }
  return ret
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === "**") return GLOBSTAR
  if (pattern === "") return ""

  var re = ""
    , hasMagic = !!options.nocase
    , escaping = false
    // ? => one single character
    , patternListStack = []
    , plType
    , stateChar
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    , patternStart = pattern.charAt(0) === "." ? "" // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
      : "(?!\\.)"
    , self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += star
          hasMagic = true
          break
        case "?":
          re += qmark
          hasMagic = true
          break
        default:
          re += "\\"+stateChar
          break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    this.debug("%s\t%s %s %j", pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += "\\" + c
      escaping = false
      continue
    }

    SWITCH: switch (c) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case "\\":
        clearStateChar()
        escaping = true
        continue

      // the various stateChar values
      // for the "extglob" stuff.
      case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === "!" && i === classStart + 1) c = "^"
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
        continue

      case "(":
        if (inClass) {
          re += "("
          continue
        }

        if (!stateChar) {
          re += "\\("
          continue
        }

        plType = stateChar
        patternListStack.push({ type: plType
                              , start: i - 1
                              , reStart: re.length })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === "!" ? "(?:(?!" : "(?:"
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
        continue

      case ")":
        if (inClass || !patternListStack.length) {
          re += "\\)"
          continue
        }

        clearStateChar()
        hasMagic = true
        re += ")"
        plType = patternListStack.pop().type
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        switch (plType) {
          case "!":
            re += "[^/]*?)"
            break
          case "?":
          case "+":
          case "*": re += plType
          case "@": break // the default anyway
        }
        continue

      case "|":
        if (inClass || !patternListStack.length || escaping) {
          re += "\\|"
          escaping = false
          continue
        }

        clearStateChar()
        re += "|"
        continue

      // these are mostly the same in regexp and glob
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += "\\" + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += "\\" + c
          escaping = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch
  } // for


  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = pattern.substr(classStart + 1)
      , sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + "\\[" + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  var pl
  while (pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + 3)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = "\\"
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + "|"
    })

    this.debug("tail=%j\n   %s", tail, tail)
    var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
          : "\\" + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart)
       + t + "\\("
       + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += "\\\\"
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case ".":
    case "[":
    case "(": addPatternStart = true
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== "" && hasMagic) re = "(?=.)" + re

  if (addPatternStart) re = patternStart + re

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [ re, hasMagic ]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? "i" : ""
    , regExp = new RegExp("^" + re + "$", flags)

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) return this.regexp = false
  var options = this.options

  var twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    , flags = options.nocase ? "i" : ""

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
           : (typeof p === "string") ? regExpEscape(p)
           : p._src
    }).join("\\\/")
  }).join("|")

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^(?:" + re + ")$"

  // can match anything, as long as it's not this.
  if (this.negate) re = "^(?!" + re + ").*$"

  try {
    return this.regexp = new RegExp(re, flags)
  } catch (ex) {
    return this.regexp = false
  }
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug("match", f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ""

  if (f === "/" && partial) return true

  var options = this.options

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    f = f.split("\\").join("/")
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, "split", f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, "set", set)

  var splitFile = path.basename(f.join("/")).split("/")

  for (var i = 0, l = set.length; i < l; i ++) {
    var pattern = set[i], file = f
    if (options.matchBase && pattern.length === 1) {
      file = splitFile
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug("matchOne",
              { "this": this
              , file: file
              , pattern: pattern })

  this.debug("matchOne", file.length, pattern.length)

  for ( var fi = 0
          , pi = 0
          , fl = file.length
          , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

    this.debug("matchOne loop")
    var p = pattern[pi]
      , f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
        , pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for ( ; fi < fl; fi ++) {
          if (file[fi] === "." || file[fi] === ".." ||
              (!options.dot && file[fi].charAt(0) === ".")) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      WHILE: while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while',
                    file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
            this.debug("dot detected!", file, fr, pattern, pr)
            break WHILE
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr ++
        }
      }
      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then 
      if (partial) {
        // ran out of file
        this.debug("\n>>> no match, partial?", file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === "string") {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug("string match", p, f, hit)
    } else {
      hit = f.match(p)
      this.debug("pattern match", p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error("wtf?")
}


// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, "$1")
}


function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

})( typeof require === "function" ? require : null,
    this,
    typeof module === "object" ? module : null,
    typeof process === "object" ? process.platform : "win32"
  )

});

__tpack__.define("../../../node-libs-browser/node_modules/timers-browserify/main.js", function(exports, module, require){
var nextTick = require("../../node-libs-browser/node_modules/process/browser.js").nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/isarray/index.js", function(exports, module, require){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js", function(exports, module, require){
module.exports = require("util").inherits

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/string_decoder/index.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require("buffer").Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_readable.js", function(exports, module, require){
var process = __tpack__.require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/isarray/index.js");
/*</replacement>*/


/*<replacement>*/
var Buffer = require("buffer").Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require("events").EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require("stream");

/*<replacement>*/
var util = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js");
util.inherits = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js");
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/string_decoder/index.js").StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/string_decoder/index.js").StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_writable.js", function(exports, module, require){
var process = __tpack__.require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require("buffer").Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js");
util.inherits = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js");
/*</replacement>*/

var Stream = require("stream");

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_duplex.js");

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_duplex.js", function(exports, module, require){
var process = __tpack__.require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js");
util.inherits = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js");
/*</replacement>*/

var Readable = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_readable.js");
var Writable = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_writable.js");

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_transform.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_duplex.js");

/*<replacement>*/
var util = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js");
util.inherits = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js");
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_passthrough.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_transform.js");

/*<replacement>*/
var util = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/core-util-is/lib/util.js");
util.inherits = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/node_modules/inherits/inherits.js");
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

});

__tpack__.define("../../../chokidar/node_modules/readdirp/node_modules/readable-stream/readable.js", function(exports, module, require){
var Stream = require("stream"); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_readable.js");
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_writable.js");
exports.Duplex = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_duplex.js");
exports.Transform = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_transform.js");
exports.PassThrough = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/lib/_stream_passthrough.js");

});

__tpack__.define("../../../chokidar/node_modules/readdirp/stream-api.js", function(exports, module, require){
'use strict';

var si = typeof setImmediate !== 'undefined' ? setImmediate : function (fn) { setTimeout(fn, 0) };

var stream = require("../../chokidar/node_modules/readdirp/node_modules/readable-stream/readable.js");
var util = require("util");

var Readable = stream.Readable;

module.exports = ReaddirpReadable;

util.inherits(ReaddirpReadable, Readable);

function ReaddirpReadable (opts) {
  if (!(this instanceof ReaddirpReadable)) return new ReaddirpReadable(opts);

  opts = opts || {};
  
  opts.objectMode = true;
  Readable.call(this, opts);

  // backpressure not implemented at this point
  this.highWaterMark = Infinity;

  this._destroyed = false;
  this._paused = false;
  this._warnings = [];
  this._errors = [];

  this._pauseResumeErrors();
}

var proto = ReaddirpReadable.prototype;

proto._pauseResumeErrors = function () {
  var self = this;
  self.on('pause', function () { self._paused = true });
  self.on('resume', function () {
    if (self._destroyed) return;
    self._paused = false;

    self._warnings.forEach(function (err) { self.emit('warn', err) });
    self._warnings.length = 0;

    self._errors.forEach(function (err) { self.emit('error', err) });
    self._errors.length = 0;
  })
}

// called for each entry
proto._processEntry = function (entry) {
  if (this._destroyed) return;
  this.push(entry);
}

proto._read = function () { }

proto.destroy = function () {
  // when stream is destroyed it will emit nothing further, not even errors or warnings
  this.push(null);
  this.readable = false;
  this._destroyed = true;
  this.emit('close');
}

proto._done = function () {
  this.push(null);
}

// we emit errors and warnings async since we may handle errors like invalid args
// within the initial event loop before any event listeners subscribed
proto._handleError = function (err) {
  var self = this;
  si(function () { 
    if (self._paused) return self._warnings.push(err);
    if (!self._destroyed) self.emit('warn', err);
  });
}

proto._handleFatalError = function (err) {
  var self = this;
  si(function () { 
    if (self._paused) return self._errors.push(err);
    if (!self._destroyed) self.emit('error', err);
  });
}

function createStreamAPI () {
  var stream = new ReaddirpReadable();

  return { 
      stream           :  stream
    , processEntry     :  stream._processEntry.bind(stream)
    , done             :  stream._done.bind(stream)
    , handleError      :  stream._handleError.bind(stream)
    , handleFatalError :  stream._handleFatalError.bind(stream)
  };
}

module.exports = createStreamAPI;

});

__tpack__.define("../../../chokidar/node_modules/readdirp/readdirp.js", function(exports, module, require){
'use strict';

var fs        =  require("../../chokidar/node_modules/readdirp/node_modules/graceful-fs/graceful-fs.js")
  , path      =  require("path")
  , minimatch =  require("../../chokidar/node_modules/readdirp/node_modules/minimatch/minimatch.js")
  , toString  =  Object.prototype.toString
  ;

// Standard helpers
function isFunction (obj) {
  return toString.call(obj) === '[object Function]';
}

function isString (obj) {
  return toString.call(obj) === '[object String]';
}

function isRegExp (obj) {
  return toString.call(obj) === '[object RegExp]';
}

function isUndefined (obj) {
  return obj === void 0;
}

/** 
 * Main function which ends up calling readdirRec and reads all files and directories in given root recursively.
 * @param { Object }   opts     Options to specify root (start directory), filters and recursion depth
 * @param { function } callback1  When callback2 is given calls back for each processed file - function (fileInfo) { ... },
 *                                when callback2 is not given, it behaves like explained in callback2
 * @param { function } callback2  Calls back once all files have been processed with an array of errors and file infos
 *                                function (err, fileInfos) { ... }
 */
function readdir(opts, callback1, callback2) {
  var stream
    , handleError
    , handleFatalError
    , pending = 0
    , errors = []
    , readdirResult = {
        directories: []
      , files: []
    }
    , fileProcessed
    , allProcessed
    , realRoot
    , aborted = false
    ;

  // If no callbacks were given we will use a streaming interface
  if (isUndefined(callback1)) {
    var api          =  require("../../chokidar/node_modules/readdirp/stream-api.js")();
    stream           =  api.stream;
    callback1        =  api.processEntry;
    callback2        =  api.done;
    handleError      =  api.handleError;
    handleFatalError =  api.handleFatalError;

    stream.on('close', function () { aborted = true; });
  } else {
    handleError      =  function (err) { errors.push(err); };
    handleFatalError =  function (err) {
      handleError(err);
      allProcessed(errors, null);
    };
  }

  if (isUndefined(opts)){
    handleFatalError(new Error (
      'Need to pass at least one argument: opts! \n' +
      'https://github.com/thlorenz/readdirp#options'
      )
    );
    return stream;
  }

  opts.root            =  opts.root            || '.';
  opts.fileFilter      =  opts.fileFilter      || function() { return true; };
  opts.directoryFilter =  opts.directoryFilter || function() { return true; };
  opts.depth           =  typeof opts.depth === 'undefined' ? 999999999 : opts.depth;
  opts.entryType       =  opts.entryType       || 'files';

  var statfn = opts.lstat === true ? fs.lstat.bind(fs) : fs.stat.bind(fs);

  if (isUndefined(callback2)) {
    fileProcessed = function() { };
    allProcessed = callback1;
  } else {
    fileProcessed = callback1;
    allProcessed = callback2;
  }

  function normalizeFilter (filter) {

    if (isUndefined(filter)) return undefined;

    function isNegated (filters) {

      function negated(f) { 
        return f.indexOf('!') === 0; 
      }

      var some = filters.some(negated);
      if (!some) {
        return false;
      } else {
        if (filters.every(negated)) {
          return true;
        } else {
          // if we detect illegal filters, bail out immediately
          throw new Error(
            'Cannot mix negated with non negated glob filters: ' + filters + '\n' +
            'https://github.com/thlorenz/readdirp#filters'
          );
        }
      }
    }

    // Turn all filters into a function
    if (isFunction(filter)) {

      return filter;

    } else if (isString(filter)) {

      return function (entryInfo) {
        return minimatch(entryInfo.name, filter.trim());
      };

    } else if (filter && Array.isArray(filter)) {

      if (filter) filter = filter.map(function (f) {
        return f.trim();
      });

      return isNegated(filter) ?
        // use AND to concat multiple negated filters
        function (entryInfo) {
          return filter.every(function (f) {
            return minimatch(entryInfo.name, f);
          });
        }
        :
        // use OR to concat multiple inclusive filters
        function (entryInfo) {
          return filter.some(function (f) {
            return minimatch(entryInfo.name, f);
          });
        };
    }
  }

  function processDir(currentDir, entries, callProcessed) {
    if (aborted) return;
    var total = entries.length
      , processed = 0
      , entryInfos = []
      ;

    fs.realpath(currentDir, function(err, realCurrentDir) {
      if (aborted) return;
      if (err) {
        handleError(err);
        callProcessed(entryInfos);
        return;
      }

      var relDir = path.relative(realRoot, realCurrentDir);

      if (entries.length === 0) {
        callProcessed([]);
      } else {
        entries.forEach(function (entry) { 

          var fullPath = path.join(realCurrentDir, entry)
            , relPath  = path.join(relDir, entry);

          statfn(fullPath, function (err, stat) {
            if (err) {
              handleError(err);
            } else {
              entryInfos.push({
                  name          :  entry
                , path          :  relPath   // relative to root
                , fullPath      :  fullPath

                , parentDir     :  relDir    // relative to root
                , fullParentDir :  realCurrentDir

                , stat          :  stat
              });
            }
            processed++;
            if (processed === total) callProcessed(entryInfos);
          });
        });
      }
    });
  }

  function readdirRec(currentDir, depth, callCurrentDirProcessed) {
    if (aborted) return;

    fs.readdir(currentDir, function (err, entries) {
      if (err) {
        handleError(err);
        callCurrentDirProcessed();
        return;
      }

      processDir(currentDir, entries, function(entryInfos) {

        var subdirs = entryInfos
          .filter(function (ei) { return ei.stat.isDirectory() && opts.directoryFilter(ei); });

        subdirs.forEach(function (di) {
          if(opts.entryType === 'directories' || opts.entryType === 'both' || opts.entryType === 'all') {
            fileProcessed(di);
          }
          readdirResult.directories.push(di); 
        });

        entryInfos
          .filter(function(ei) {
            var isCorrectType = opts.entryType === 'all' ?
              !ei.stat.isDirectory() : ei.stat.isFile() || ei.stat.isSymbolicLink();
            return isCorrectType && opts.fileFilter(ei);
          })
          .forEach(function (fi) {
            if(opts.entryType === 'files' || opts.entryType === 'both' || opts.entryType === 'all') {
              fileProcessed(fi);
            }
            readdirResult.files.push(fi); 
          });

        var pendingSubdirs = subdirs.length;

        // Be done if no more subfolders exist or we reached the maximum desired depth
        if(pendingSubdirs === 0 || depth === opts.depth) {
          callCurrentDirProcessed();
        } else {
          // recurse into subdirs, keeping track of which ones are done 
          // and call back once all are processed
          subdirs.forEach(function (subdir) {
            readdirRec(subdir.fullPath, depth + 1, function () {
              pendingSubdirs = pendingSubdirs - 1;
              if(pendingSubdirs === 0) { 
                callCurrentDirProcessed();
              }
            });
          });
        }
      });
    });
  }

  // Validate and normalize filters
  try {
    opts.fileFilter = normalizeFilter(opts.fileFilter);
    opts.directoryFilter = normalizeFilter(opts.directoryFilter);
  } catch (err) {
    // if we detect illegal filters, bail out immediately
    handleFatalError(err);
    return stream;
  }

  // If filters were valid get on with the show
  fs.realpath(opts.root, function(err, res) {
    if (err) {
      handleFatalError(err);
      return stream;
    }

    realRoot = res;
    readdirRec(opts.root, 0, function () { 
      // All errors are collected into the errors array
      if (errors.length > 0) {
        allProcessed(errors, readdirResult); 
      } else {
        allProcessed(null, readdirResult);
      }
    });
  });

  return stream;
}

module.exports = readdir;

});

__tpack__.define("../../../chokidar/node_modules/is-binary-path/node_modules/binary-extensions/binary-extensions.json", function(exports, module, require){
module.exports = [
	"3ds",
	"3g2",
	"3gp",
	"7z",
	"a",
	"aac",
	"adp",
	"ai",
	"aif",
	"apk",
	"ar",
	"asf",
	"au",
	"avi",
	"bak",
	"bin",
	"bk",
	"bmp",
	"btif",
	"bz2",
	"cab",
	"caf",
	"cgm",
	"cmx",
	"cpio",
	"cr2",
	"dat",
	"deb",
	"djvu",
	"dll",
	"dmg",
	"dng",
	"doc",
	"docx",
	"dra",
	"DS_Store",
	"dsk",
	"dts",
	"dtshd",
	"dvb",
	"dwg",
	"dxf",
	"ecelp4800",
	"ecelp7470",
	"ecelp9600",
	"egg",
	"eol",
	"eot",
	"epub",
	"exe",
	"f4v",
	"fbs",
	"fh",
	"fla",
	"flac",
	"fli",
	"flv",
	"fpx",
	"fst",
	"fvt",
	"g3",
	"gif",
	"gz",
	"h261",
	"h263",
	"h264",
	"ico",
	"ief",
	"img",
	"ipa",
	"iso",
	"jar",
	"jpeg",
	"jpg",
	"jpgv",
	"jpm",
	"jxr",
	"ktx",
	"lvp",
	"lz",
	"lzma",
	"lzo",
	"m3u",
	"m4a",
	"m4v",
	"mar",
	"mdi",
	"mid",
	"mj2",
	"mka",
	"mkv",
	"mmr",
	"mng",
	"mov",
	"movie",
	"mp3",
	"mp4",
	"mp4a",
	"mpeg",
	"mpg",
	"mpga",
	"mxu",
	"nef",
	"npx",
	"o",
	"oga",
	"ogg",
	"ogv",
	"otf",
	"pbm",
	"pcx",
	"pdf",
	"pea",
	"pgm",
	"pic",
	"png",
	"pnm",
	"ppm",
	"psd",
	"pya",
	"pyc",
	"pyo",
	"pyv",
	"qt",
	"rar",
	"ras",
	"raw",
	"rgb",
	"rip",
	"rlc",
	"rz",
	"s3m",
	"s7z",
	"scpt",
	"sgi",
	"shar",
	"sil",
	"smv",
	"so",
	"sub",
	"swf",
	"tar",
	"tbz2",
	"tga",
	"tgz",
	"tif",
	"tiff",
	"tlz",
	"ts",
	"ttf",
	"uvh",
	"uvi",
	"uvm",
	"uvp",
	"uvs",
	"uvu",
	"viv",
	"vob",
	"war",
	"wav",
	"wax",
	"wbmp",
	"wdp",
	"weba",
	"webm",
	"webp",
	"whl",
	"wm",
	"wma",
	"wmv",
	"wmx",
	"woff",
	"woff2",
	"wvx",
	"xbm",
	"xif",
	"xm",
	"xpi",
	"xpm",
	"xwd",
	"xz",
	"z",
	"zip",
	"zipx"
]
;
});

__tpack__.define("../../../chokidar/node_modules/is-binary-path/index.js", function(exports, module, require){
'use strict';
var path = require("path");
var binaryExtensions = require("../../chokidar/node_modules/is-binary-path/node_modules/binary-extensions/binary-extensions.json");
var exts = Object.create(null);

binaryExtensions.forEach(function (el) {
	exts[el] = true;
});

module.exports = function (filepath) {
	return path.extname(filepath).slice(1).toLowerCase() in exts;
};

});

__tpack__.define("../../../chokidar/lib/nodefs-handler.js", function(exports, module, require){
var process = __tpack__.require("process");
'use strict';

var fs = require("fs");
var sysPath = require("path");
var readdirp = require("../../chokidar/node_modules/readdirp/readdirp.js");
var isBinaryPath = require("../../chokidar/node_modules/is-binary-path/index.js");

// fs.watch helpers

// object to hold per-process fs.watch instances
// (may be shared across chokidar FSWatcher instances)
var FsWatchInstances = Object.create(null);

// Private function: Instantiates the fs.watch interface

// * path       - string, path to be watched
// * options    - object, options to be passed to fs.watch
// * listener   - function, main event handler
// * errHandler - function, handler which emits info about errors
// * emitRaw    - function, handler which emits raw event data

// Returns new fsevents instance
function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
  var handleEvent = function(rawEvent, evPath) {
    listener(path);
    emitRaw(rawEvent, evPath, {watchedPath: path});

    // emit based on events occuring for files from a directory's watcher in
    // case the file's watcher misses it (and rely on throttling to de-dupe)
    if (evPath && path !== evPath) {
      fsWatchBroadcast(
        sysPath.resolve(path, evPath), 'listeners', sysPath.join(path, evPath)
      );
    }
  };
  try {
    return fs.watch(path, options, handleEvent);
  } catch (error) {
    errHandler(error);
  }
}

// Private function: Helper for passing fs.watch event data to a
// collection of listeners

// * fullPath   - string, absolute path bound to the fs.watch instance
// * type       - string, listener type
// * val[1..3]  - arguments to be passed to listeners

// Returns nothing
function fsWatchBroadcast(fullPath, type, val1, val2, val3) {
  if (!FsWatchInstances[fullPath]) return;
  FsWatchInstances[fullPath][type].forEach(function(listener) {
    listener(val1, val2, val3);
  });
}

// Private function: Instantiates the fs.watch interface or binds listeners
// to an existing one covering the same file system entry

// * path       - string, path to be watched
// * fullPath   - string, absolute path
// * options    - object, options to be passed to fs.watch
// * handlers   - object, container for event listener functions

// Returns close function
function setFsWatchListener(path, fullPath, options, handlers) {
  var listener = handlers.listener;
  var errHandler = handlers.errHandler;
  var rawEmitter = handlers.rawEmitter;
  var container = FsWatchInstances[fullPath];
  var watcher;
  if (!options.persistent) {
    watcher = createFsWatchInstance(
      path, options, listener, errHandler, rawEmitter
    );
    return watcher.close.bind(watcher);
  }
  if (!container) {
    watcher = createFsWatchInstance(
      path,
      options,
      fsWatchBroadcast.bind(null, fullPath, 'listeners'),
      errHandler, // no need to use broadcast here
      fsWatchBroadcast.bind(null, fullPath, 'rawEmitters')
    );
    if (!watcher) return;
    var broadcastErr = fsWatchBroadcast.bind(null, fullPath, 'errHandlers');
    watcher.on('error', function(error) {
      // Workaround for https://github.com/joyent/node/issues/4337
      if (process.platform === 'win32' && error.code === 'EPERM') {
        fs.open(path, 'r', function(err, fd) {
          if (fd) fs.close(fd);
          if (!err) broadcastErr(error);
        });
      } else {
        broadcastErr(error);
      }
    });
    container = FsWatchInstances[fullPath] = {
      listeners: [listener],
      errHandlers: [errHandler],
      rawEmitters: [rawEmitter],
      watcher: watcher
    };
  } else {
    container.listeners.push(listener);
    container.errHandlers.push(errHandler);
    container.rawEmitters.push(rawEmitter);
  }
  var listenerIndex = container.listeners.length - 1;

  // removes this instance's listeners and closes the underlying fs.watch
  // instance if there are no more listeners left
  return function close() {
    delete container.listeners[listenerIndex];
    delete container.errHandlers[listenerIndex];
    delete container.rawEmitters[listenerIndex];
    if (!Object.keys(container.listeners).length) {
      container.watcher.close();
      delete FsWatchInstances[fullPath];
    }
  };
}

// fs.watchFile helpers

// object to hold per-process fs.watchFile instances
// (may be shared across chokidar FSWatcher instances)
var FsWatchFileInstances = Object.create(null);

// Private function: Instantiates the fs.watchFile interface or binds listeners
// to an existing one covering the same file system entry

// * path       - string, path to be watched
// * fullPath   - string, absolute path
// * options    - object, options to be passed to fs.watchFile
// * handlers   - object, container for event listener functions

// Returns close function
function setFsWatchFileListener(path, fullPath, options, handlers) {
  var listener = handlers.listener;
  var rawEmitter = handlers.rawEmitter;
  var container = FsWatchFileInstances[fullPath];
  var listeners = [];
  var rawEmitters = [];
  if (
    container && (
      container.options.persistent < options.persistent ||
      container.options.interval > options.interval
    )
  ) {
    // "Upgrade" the watcher to persistence or a quicker interval.
    // This creates some unlikely edge case issues if the user mixes
    // settings in a very weird way, but solving for those cases
    // doesn't seem worthwhile for the added complexity.
    listeners = container.listeners;
    rawEmitters = container.rawEmitters;
    fs.unwatchFile(fullPath);
    container = false;
  }
  if (!container) {
    listeners.push(listener);
    rawEmitters.push(rawEmitter);
    container = FsWatchFileInstances[fullPath] = {
      listeners: listeners,
      rawEmitters: rawEmitters,
      options: options,
      watcher: fs.watchFile(fullPath, options, function(curr, prev) {
        container.rawEmitters.forEach(function(rawEmitter) {
          rawEmitter('change', fullPath, {curr: curr, prev: prev});
        });
        var currmtime = curr.mtime.getTime();
        if (curr.size !== prev.size || currmtime > prev.mtime.getTime() || currmtime === 0) {
          container.listeners.forEach(function(listener) {
            listener(path, curr);
          });
        }
      })
    };
  } else {
    container.listeners.push(listener);
    container.rawEmitters.push(rawEmitter);
  }
  var listenerIndex = container.listeners.length - 1;

  // removes this instance's listeners and closes the underlying fs.watchFile
  // instance if there are no more listeners left
  return function close() {
    delete container.listeners[listenerIndex];
    delete container.rawEmitters[listenerIndex];
    if (!Object.keys(container.listeners).length) {
      fs.unwatchFile(fullPath);
      delete FsWatchFileInstances[fullPath];
    }
  }
}

// fake constructor for attaching nodefs-specific prototype methods that
// will be copied to FSWatcher's prototype
function NodeFsHandler() {}

// Private method: Watch file for changes with fs.watchFile or fs.watch.

// * path     - string, path to file or directory.
// * listener - function, to be executed on fs change.

// Returns close function for the watcher instance
NodeFsHandler.prototype._watchWithNodeFs =
function(path, listener) {
  var directory = sysPath.dirname(path);
  var basename = sysPath.basename(path);
  var parent = this._getWatchedDir(directory);
  parent.add(basename);
  var absolutePath = sysPath.resolve(path);
  var options = {persistent: this.options.persistent};
  if (!listener) listener = Function.prototype; // empty function

  var closer;
  if (this.options.usePolling) {
    options.interval = this.enableBinaryInterval && isBinaryPath(basename) ?
      this.options.binaryInterval : this.options.interval;
    closer = setFsWatchFileListener(path, absolutePath, options, {
      listener: listener,
      rawEmitter: this.emit.bind(this, 'raw')
    });
  } else {
    closer = setFsWatchListener(path, absolutePath, options, {
      listener: listener,
      errHandler: this._handleError.bind(this),
      rawEmitter: this.emit.bind(this, 'raw')
    });
  }
  return closer;
};

// Private method: Watch a file and emit add event if warranted

// * file       - string, the file's path
// * stats      - object, result of fs.stat
// * initialAdd - boolean, was the file added at watch instantiation?
// * callback   - function, called when done processing as a newly seen file

// Returns close function for the watcher instance
NodeFsHandler.prototype._handleFile =
function(file, stats, initialAdd, callback) {
  var dirname = sysPath.dirname(file);
  var basename = sysPath.basename(file);
  var parent = this._getWatchedDir(dirname);

  // if the file is already being watched, do nothing
  if (parent.has(basename)) return callback();

  // kick off the watcher
  var closer = this._watchWithNodeFs(file, function(path, newStats) {
    if (!this._throttle('watch', file, 5)) return;
    if (!newStats || newStats && newStats.mtime.getTime() === 0) {
      fs.stat(file, function(error, newStats) {
        // Fix issues where mtime is null but file is still present
        if (error) {
          this._remove(dirname, basename);
        } else {
          this._emit('change', file, newStats);
        }
      }.bind(this));
    // add is about to be emitted if file not already tracked in parent
    } else if (parent.has(basename)) {
      this._emit('change', file, newStats);
    }
  }.bind(this));

  // emit an add event if we're supposed to
  if (!(initialAdd && this.options.ignoreInitial)) {
    if (!this._throttle('add', file, 0)) return;
    this._emit('add', file, stats);
  }

  if (callback) callback();
  return closer;
};

// Private method: Handle symlinks encountered while reading a dir

// * entry      - object, entry object returned by readdirp
// * directory  - string, path of the directory being read
// * path       - string, path of this item
// * item       - string, basename of this item

// Returns true if no more processing is needed for this entry.
NodeFsHandler.prototype._handleSymlink =
function(entry, directory, path, item) {
  var full = entry.fullPath;
  var dir = this._getWatchedDir(directory);

  if (!this.options.followSymlinks) {
    // watch symlink directly (don't follow) and detect changes
    this._readyCount++;
    fs.realpath(path, function(error, linkPath) {
      if (dir.has(item)) {
        if (this._symlinkPaths[full] !== linkPath) {
          this._symlinkPaths[full] = linkPath;
          this._emit('change', path, entry.stat);
        }
      } else {
        dir.add(item);
        this._symlinkPaths[full] = linkPath;
        this._emit('add', path, entry.stat);
      }
      this._emitReady();
    }.bind(this));
    return true;
  }

  // don't follow the same symlink more than once
  if (this._symlinkPaths[full]) return true;
  else this._symlinkPaths[full] = true;
}

// Private method: Read directory to add / remove files from `@watched` list
// and re-read it on change.

// * dir        - string, fs path.
// * stats      - object, result of fs.stat
// * initialAdd - boolean, was the file added at watch instantiation?
// * depth      - int, depth relative to user-supplied path
// * target     - string, child path actually targeted for watch
// * wh         - object, common watch helpers for this path
// * callback   - function, called when dir scan is complete

// Returns close function for the watcher instance
NodeFsHandler.prototype._handleDir =
function(dir, stats, initialAdd, depth, target, wh, callback) {
  if (!(initialAdd && this.options.ignoreInitial) && !target && !wh.hasGlob) {
    this._emit('addDir', dir, stats);
  }

  // ensure dir is tracked
  this._getWatchedDir(sysPath.dirname(dir)).add(sysPath.basename(dir));
  this._getWatchedDir(dir);

  var read = function(directory, initialAdd, done) {
    // Normalize the directory name on Windows
    directory = sysPath.join(directory, '');

    if (!wh.hasGlob) {
      var throttler = this._throttle('readdir', directory, 1000);
      if (!throttler) return;
    }

    var previous = this._getWatchedDir(wh.path);
    var current = [];

    readdirp({
      root: directory,
      entryType: 'all',
      fileFilter: wh.filterPath,
      directoryFilter: wh.filterDir,
      depth: 0,
      lstat: true
    }).on('data', function(entry) {
      var item = entry.path;
      var path = sysPath.join(directory, item);
      current.push(item);

      if (entry.stat.isSymbolicLink() &&
        this._handleSymlink(entry, directory, path, item)) return;

      // Files that present in current directory snapshot
      // but absent in previous are added to watch list and
      // emit `add` event.
      if (item === target || !target && !previous.has(item)) {
        this._readyCount++;

        // ensure relativeness of path is preserved in case of watcher reuse
        path = sysPath.join(dir, sysPath.relative(dir, path));

        this._addToNodeFs(path, initialAdd, wh, depth + 1);
      }
    }.bind(this)).on('end', function() {
      if (throttler) throttler.clear();
      if (done) done();

      // Files that absent in current directory snapshot
      // but present in previous emit `remove` event
      // and are removed from @watched[directory].
      previous.children().filter(function(item) {
        return item !== directory &&
          current.indexOf(item) === -1 &&
          // in case of intersecting globs;
          // a path may have been filtered out of this readdir, but
          // shouldn't be removed because it matches a different glob
          (!wh.hasGlob || wh.filterPath({
            fullPath: sysPath.resolve(directory, item)
          }));
      }).forEach(function(item) {
        this._remove(directory, item);
      }, this);
    }.bind(this)).on('error', this._handleError.bind(this));
  }.bind(this);

  if (this.options.depth == null || depth <= this.options.depth) {
    if (!target) read(dir, initialAdd, callback);
    var closer = this._watchWithNodeFs(dir, function(dirPath, stats) {
      // if current directory is removed, do nothing
      if (stats && stats.mtime.getTime() === 0) return;

      read(dirPath, false);
    });
  } else {
    callback();
  }
  return closer;
};

// Private method: Handle added file, directory, or glob pattern.
// Delegates call to _handleFile / _handleDir after checks.

// * path       - string, path to file or directory.
// * initialAdd - boolean, was the file added at watch instantiation?
// * depth      - int, depth relative to user-supplied path
// * target     - string, child path actually targeted for watch
// * callback   - function, indicates whether the path was found or not

// Returns nothing
NodeFsHandler.prototype._addToNodeFs =
function(path, initialAdd, priorWh, depth, target, callback) {
  if (!callback) callback = Function.prototype;
  var ready = this._emitReady;
  if (this._isIgnored(path) || this.closed) {
    ready();
    return callback(null, false);
  }

  var wh = this._getWatchHelpers(path, depth);
  if (!wh.hasGlob && priorWh) {
    wh.hasGlob = priorWh.hasGlob;
    wh.filterPath = priorWh.filterPath;
    wh.filterDir = priorWh.filterDir;
  }

  // evaluate what is at the path we're being asked to watch
  fs[wh.statMethod](wh.watchPath, function(error, stats) {
    if (this._handleError(error)) return callback(null, path);
    if (this._isIgnored(wh.watchPath, stats)) {
      ready();
      return callback(null, false);
    }

    var initDir = function(dir, target) {
      return this._handleDir(dir, stats, initialAdd, depth, target, wh, ready);
    }.bind(this);

    var closer;
    if (stats.isDirectory()) {
      closer = initDir(wh.watchPath, target);
    } else if (stats.isSymbolicLink()) {
      var parent = sysPath.dirname(wh.watchPath);
      this._getWatchedDir(parent).add(wh.watchPath);
      this._emit('add', wh.watchPath, stats);
      closer = initDir(parent, path);

      // preserve this symlink's target path
      fs.realpath(path, function(error, targetPath) {
        this._symlinkPaths[sysPath.resolve(path)] = targetPath;
        ready();
      }.bind(this));
    } else {
      closer = this._handleFile(wh.watchPath, stats, initialAdd, ready);
    }

    if (closer) this._closers[path] = closer;
    callback(null, false);
  }.bind(this));
};

module.exports = NodeFsHandler;

});

__tpack__.define("../../../chokidar/lib/fsevents-handler.js", function(exports, module, require){
'use strict';

var fs = require("fs");
var sysPath = require("path");
var readdirp = require("../../chokidar/node_modules/readdirp/readdirp.js");
var fsevents;
try { fsevents = require("fsevents"); } catch (error) {}

// fsevents instance helper functions

// object to hold per-process fsevents instances
// (may be shared across chokidar FSWatcher instances)
var FSEventsWatchers = Object.create(null);

// Private function: Instantiates the fsevents interface

// * path       - string, path to be watched
// * callback   - function, called when fsevents is bound and ready

// Returns new fsevents instance
function createFSEventsInstance(path, callback) {
  return (new fsevents(path)).on('fsevent', callback).start();
}

// Private function: Instantiates the fsevents interface or binds listeners
// to an existing one covering the same file tree

// * path       - string, path to be watched
// * realPath   - string, real path (in case of symlinks)
// * listener   - function, called when fsevents emits events
// * rawEmitter - function, passes data to listeners of the 'raw' event

// Returns close function
function setFSEventsListener(path, realPath, listener, rawEmitter) {
  var watchPath = sysPath.extname(path) ? sysPath.dirname(path) : path;
  var watchContainer;

  var resolvedPath = sysPath.resolve(path);
  var hasSymlink = resolvedPath !== realPath;
  function filteredListener(fullPath, flags, info) {
    if (hasSymlink) fullPath = fullPath.replace(realPath, resolvedPath);
    if (
      fullPath === resolvedPath ||
      !fullPath.indexOf(resolvedPath + sysPath.sep)
    ) listener(fullPath, flags, info);
  }

  // check if there is already a watcher on a parent path
  // modifies `watchPath` to the parent path when it finds a match
  function watchedParent() {
    return Object.keys(FSEventsWatchers).some(function(watchedPath) {
      // condition is met when indexOf returns 0
      if (!realPath.indexOf(sysPath.resolve(watchedPath) + sysPath.sep)) {
        watchPath = watchedPath;
        return true;
      }
    });
  }

  if (watchPath in FSEventsWatchers || watchedParent()) {
    watchContainer = FSEventsWatchers[watchPath];
    watchContainer.listeners.push(filteredListener);
  } else {
    watchContainer = FSEventsWatchers[watchPath] = {
      listeners: [filteredListener],
      rawEmitters: [rawEmitter],
      watcher: createFSEventsInstance(watchPath, function(fullPath, flags) {
        var info = fsevents.getInfo(fullPath, flags);
        watchContainer.listeners.forEach(function(listener) {
          listener(fullPath, flags, info);
        });
        watchContainer.rawEmitters.forEach(function(emitter) {
          emitter(info.event, fullPath, info);
        });
      })
    };
  }
  var listenerIndex = watchContainer.listeners.length - 1;

  // removes this instance's listeners and closes the underlying fsevents
  // instance if there are no more listeners left
  return function close() {
    delete watchContainer.listeners[listenerIndex];
    delete watchContainer.rawEmitters[listenerIndex];
    if (!Object.keys(watchContainer.listeners).length) {
      watchContainer.watcher.stop();
      delete FSEventsWatchers[watchPath];
    }
  }
}

// returns boolean indicating whether fsevents can be used
function canUse() {
  return fsevents && Object.keys(FSEventsWatchers).length < 128;
}

// determines subdirectory traversal levels from root to path
function depth(path, root) {
  var i = 0;
  while (!path.indexOf(root) && (path = sysPath.dirname(path)) !== root) i++;
  return i;
}

// fake constructor for attaching fsevents-specific prototype methods that
// will be copied to FSWatcher's prototype
function FsEventsHandler() {}

// Private method: Handle symlinks encountered during directory scan

// * wathPath   - string, file/dir path to be watched with fsevents
// * realPath   - string, real path (in case of symlinks)
// * transform  - function, path transformer
// * globFilter - function, path filter in case a glob pattern was provided

// Returns close function for the watcher instance
FsEventsHandler.prototype._watchWithFsEvents =
function(watchPath, realPath, transform, globFilter) {
  if (this._isIgnored(watchPath)) return;
  var watchCallback = function(fullPath, flags, info) {
    if (
      this.options.depth !== undefined &&
      depth(fullPath, realPath) > this.options.depth
    ) return;
    var path = transform(sysPath.join(
      watchPath, sysPath.relative(watchPath, fullPath)
    ));
    if (globFilter && !globFilter(path)) return;
    // ensure directories are tracked
    var parent = sysPath.dirname(path);
    var item = sysPath.basename(path);
    var watchedDir = this._getWatchedDir(
      info.type === 'directory' ? path : parent
    );
    var checkIgnored = function(stats) {
      if (this._isIgnored(path, stats)) {
        this._ignoredPaths[path] = true;
        if (stats && stats.isDirectory()) {
          this._ignoredPaths[path + '/**/*'] = true;
        }
        return true;
      } else {
        delete this._ignoredPaths[path];
        delete this._ignoredPaths[path + '/**/*'];
      }
    }.bind(this);

    var handleEvent = function(event) {
      if (checkIgnored()) return;

      if (event === 'unlink') {
        // suppress unlink events on never before seen files
        if (info.type === 'directory' || watchedDir.has(item)) {
          this._remove(parent, item);
        }
      } else {
        if (event === 'add') {
          // track new directories
          if (info.type === 'directory') this._getWatchedDir(path);

          if (info.type === 'symlink' && this.options.followSymlinks) {
            // push symlinks back to the top of the stack to get handled
            var curDepth = this.options.depth === undefined ?
              undefined : depth(fullPath, realPath) + 1;
            return this._addToFsEvents(path, false, true, curDepth);
          } else {
            // track new paths
            // (other than symlinks being followed, which will be tracked soon)
            this._getWatchedDir(parent).add(item);
          }
        }
        var eventName = info.type === 'directory' ? event + 'Dir' : event;
        this._emit(eventName, path);
      }
    }.bind(this);

    function addOrChange() {
      handleEvent(watchedDir.has(item) ? 'change' : 'add');
    }
    function checkFd() {
      fs.open(path, 'r', function(error, fd) {
        if (fd) fs.close(fd);
        error && error.code !== 'EACCES' ?
          handleEvent('unlink') : addOrChange();
      });
    }
    // correct for wrong events emitted
    var wrongEventFlags = [
      69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912
    ];
    if (wrongEventFlags.indexOf(flags) !== -1 || info.event === 'unknown') {
      if (typeof this.options.ignored === 'function') {
        fs.stat(path, function(error, stats) {
          if (checkIgnored(stats)) return;
          stats ? addOrChange() : handleEvent('unlink');
        });
      } else {
        checkFd();
      }
    } else {
      switch (info.event) {
      case 'created':
      case 'modified':
        return addOrChange();
      case 'deleted':
      case 'moved':
        return checkFd();
      }
    }
  }.bind(this);

  var closer = setFSEventsListener(
    watchPath,
    realPath,
    watchCallback,
    this.emit.bind(this, 'raw')
  );

  this._emitReady();
  return closer;
};

// Private method: Handle symlinks encountered during directory scan

// * linkPath   - string, path to symlink
// * fullPath   - string, absolute path to the symlink
// * transform  - function, pre-existing path transformer
// * curDepth   - int, level of subdirectories traversed to where symlink is

// Returns nothing
FsEventsHandler.prototype._fsEventsSymlink =
function(linkPath, fullPath, transform, curDepth) {
  // don't follow the same symlink more than once
  if (this._symlinkPaths[fullPath]) return;
  else this._symlinkPaths[fullPath] = true;

  this._readyCount++;

  fs.realpath(linkPath, function(error, linkTarget) {
    if (this._handleError(error) || this._isIgnored(linkTarget)) {
      return this._emitReady();
    }

    this._readyCount++;

    // add the linkTarget for watching with a wrapper for transform
    // that causes emitted paths to incorporate the link's path
    this._addToFsEvents(linkTarget || linkPath, function(path) {
      var dotSlash = '.' + sysPath.sep;
      var aliasedPath = linkPath;
      if (linkTarget && linkTarget !== dotSlash) {
        aliasedPath = path.replace(linkTarget, linkPath);
      } else if (path !== dotSlash) {
        aliasedPath = sysPath.join(linkPath, path);
      }
      return transform(aliasedPath);
    }, false, curDepth);
  }.bind(this));
};

// Private method: Handle added path with fsevents

// * path       - string, file/directory path or glob pattern
// * transform  - function, converts working path to what the user expects
// * forceAdd   - boolean, ensure add is emitted
// * priorDepth - int, level of subdirectories already traversed

// Returns nothing
FsEventsHandler.prototype._addToFsEvents =
function(path, transform, forceAdd, priorDepth) {

  // applies transform if provided, otherwise returns same value
  var processPath = typeof transform === 'function' ?
    transform : function(val) { return val; };

  var emitAdd = function(newPath, stats) {
    var pp = processPath(newPath);
    var isDir = stats.isDirectory();
    var dirObj = this._getWatchedDir(sysPath.dirname(pp));
    var base = sysPath.basename(pp);

    // ensure empty dirs get tracked
    if (isDir) this._getWatchedDir(pp);

    if (dirObj.has(base)) return;
    dirObj.add(base);

    if (!this.options.ignoreInitial || forceAdd === true) {
      this._emit(isDir ? 'addDir' : 'add', pp, stats);
    }
  }.bind(this);

  var wh = this._getWatchHelpers(path);

  // evaluate what is at the path we're being asked to watch
  fs[wh.statMethod](wh.watchPath, function(error, stats) {
    if (this._handleError(error) || this._isIgnored(wh.watchPath, stats)) {
      this._emitReady();
      return this._emitReady();
    }

    if (stats.isDirectory()) {
      // emit addDir unless this is a glob parent
      if (!wh.globFilter) emitAdd(processPath(path), stats);

      // don't recurse further if it would exceed depth setting
      if (priorDepth && priorDepth > this.options.depth) return;

      // scan the contents of the dir
      readdirp({
        root: wh.watchPath,
        entryType: 'all',
        fileFilter: wh.filterPath,
        directoryFilter: wh.filterDir,
        lstat: true,
        depth: this.options.depth - (priorDepth || 0)
      }).on('data', function(entry) {
        // need to check filterPath on dirs b/c filterDir is less restrictive
        if (entry.stat.isDirectory() && !wh.filterPath(entry)) return;

        var joinedPath = sysPath.join(wh.watchPath, entry.path);
        var fullPath = entry.fullPath;

        if (wh.followSymlinks && entry.stat.isSymbolicLink()) {
          // preserve the current depth here since it can't be derived from
          // real paths past the symlink
          var curDepth = this.options.depth === undefined ?
            undefined : depth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;

          this._fsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
        } else {
          emitAdd(joinedPath, entry.stat);
        }
      }.bind(this)).on('end', this._emitReady);
    } else {
      emitAdd(wh.watchPath, stats);
      this._emitReady();
    }
  }.bind(this));

  if (this.options.persistent) {
    var initWatch = function(error, realPath) {
      var closer = this._watchWithFsEvents(
        wh.watchPath,
        sysPath.resolve(realPath || wh.watchPath),
        processPath,
        wh.globFilter
      );
      if (closer) this._closers[path] = closer;
    }.bind(this);

    if (typeof transform === 'function') {
      // realpath has already been resolved
      initWatch();
    } else {
      fs.realpath(wh.watchPath, initWatch);
    }
  }
};

module.exports = FsEventsHandler;
module.exports.canUse = canUse;

});

__tpack__.define("../../../chokidar/index.js", function(exports, module, require){
var process = __tpack__.require("process");
'use strict';
var EventEmitter = require("events").EventEmitter;
var fs = require("fs");
var sysPath = require("path");
var each = require("../../chokidar/node_modules/async-each/index.js");
var anymatch = require("../../chokidar/node_modules/anymatch/index.js");
var globparent = require("../../chokidar/node_modules/glob-parent/index.js");
var isglob = require("../../chokidar/node_modules/is-glob/index.js");
var arrify = require("../../chokidar/node_modules/arrify/index.js");
var isAbsolute = require("../../chokidar/node_modules/path-is-absolute/index.js");
var flatten = require("../../chokidar/node_modules/lodash.flatten/index.js");

var NodeFsHandler = require("../../chokidar/lib/nodefs-handler.js");
var FsEventsHandler = require("../../chokidar/lib/fsevents-handler.js");

// Public: Main class.
// Watches files & directories for changes.
//
// * _opts - object, chokidar options hash
//
// Emitted events:
// `add`, `addDir`, `change`, `unlink`, `unlinkDir`, `all`, `error`
//
// Examples
//
//  var watcher = new FSWatcher()
//    .add(directories)
//    .on('add', function(path) {console.log('File', path, 'was added');})
//    .on('change', function(path) {console.log('File', path, 'was changed');})
//    .on('unlink', function(path) {console.log('File', path, 'was removed');})
//    .on('all', function(event, path) {console.log(path, ' emitted ', event);})
//
function FSWatcher(_opts) {
  var opts = {};
  // in case _opts that is passed in is a frozen object
  if (_opts) for (var opt in _opts) opts[opt] = _opts[opt];
  this._watched = Object.create(null);
  this._closers = Object.create(null);
  this._ignoredPaths = Object.create(null);
  Object.defineProperty(this, '_globIgnored', {
    get: function() { return Object.keys(this._ignoredPaths); }
  });
  this.closed = false;
  this._throttled = Object.create(null);
  this._symlinkPaths = Object.create(null);

  function undef(key) {
    return opts[key] === undefined;
  }

  // Set up default options.
  if (undef('persistent')) opts.persistent = true;
  if (undef('ignoreInitial')) opts.ignoreInitial = false;
  if (undef('ignorePermissionErrors')) opts.ignorePermissionErrors = false;
  if (undef('interval')) opts.interval = 100;
  if (undef('binaryInterval')) opts.binaryInterval = 300;
  this.enableBinaryInterval = opts.binaryInterval !== opts.interval;

  // Enable fsevents on OS X when polling isn't explicitly enabled.
  if (undef('useFsEvents')) opts.useFsEvents = !opts.usePolling;

  // If we can't use fsevents, ensure the options reflect it's disabled.
  if (!FsEventsHandler.canUse()) opts.useFsEvents = false;

  // Use polling on Mac if not using fsevents.
  // Other platforms use non-polling fs.watch.
  if (undef('usePolling') && !opts.useFsEvents) {
    opts.usePolling = process.platform === 'darwin';
  }

  // Editor atomic write normalization enabled by default with fs.watch
  if (undef('atomic')) opts.atomic = !opts.usePolling && !opts.useFsEvents;
  if (opts.atomic) this._pendingUnlinks = Object.create(null);

  if (undef('followSymlinks')) opts.followSymlinks = true;

  if (undef('awaitWriteFinish')) opts.awaitWriteFinish = false;
  if (opts.awaitWriteFinish === true) opts.awaitWriteFinish = {};
  var awf = opts.awaitWriteFinish;
  if (awf) {
    if (!awf.stabilityThreshold) awf.stabilityThreshold = 2000;
    if (!awf.pollInterval) awf.pollInterval = 100;

    this._pendingWrites = Object.create(null);
  }

  this._isntIgnored = function(path, stat) {
    return !this._isIgnored(path, stat);
  }.bind(this);

  var readyCalls = 0;
  this._emitReady = function() {
    if (++readyCalls >= this._readyCount) {
      this._emitReady = Function.prototype;
      // use process.nextTick to allow time for listener to be bound
      process.nextTick(this.emit.bind(this, 'ready'));
    }
  }.bind(this);

  this.options = opts;

  // You’re frozen when your heart’s not open.
  Object.freeze(opts);
}

FSWatcher.prototype = Object.create(EventEmitter.prototype);

// Common helpers
// --------------

// Private method: Normalize and emit events
//
// * event     - string, type of event
// * path      - string, file or directory path
// * val[1..3] - arguments to be passed with event
//
// Returns the error if defined, otherwise the value of the
// FSWatcher instance's `closed` flag
FSWatcher.prototype._emit = function(event, path, val1, val2, val3) {
  if (this.options.cwd) path = sysPath.relative(this.options.cwd, path);
  var args = [event, path];
  if (val3 !== undefined) args.push(val1, val2, val3);
  else if (val2 !== undefined) args.push(val1, val2);
  else if (val1 !== undefined) args.push(val1);

  var awf = this.options.awaitWriteFinish;
  if (awf && this._pendingWrites[path]) return this;

  if (this.options.atomic) {
    if (event === 'unlink') {
      this._pendingUnlinks[path] = args;
      setTimeout(function() {
        Object.keys(this._pendingUnlinks).forEach(function(path) {
          this.emit.apply(this, this._pendingUnlinks[path]);
          this.emit.apply(this, ['all'].concat(this._pendingUnlinks[path]));
          delete this._pendingUnlinks[path];
        }.bind(this));
      }.bind(this), 100);
      return this;
    } else if (event === 'add' && this._pendingUnlinks[path]) {
      event = args[0] = 'change';
      delete this._pendingUnlinks[path];
    }
  }

  if (event === 'change') {
    if (!this._throttle('change', path, 50)) return this;
  }

  var emitEvent = function() {
    this.emit.apply(this, args);
    if (event !== 'error') this.emit.apply(this, ['all'].concat(args));
  }.bind(this);

  if (awf && event === 'add') {
    this._awaitWriteFinish(path, awf.stabilityThreshold, function(err, stats) {
      if (err) {
        event = args[0] = 'error';
        args[1] = err;
        emitEvent();
      } else if (stats) {
        // if stats doesn't exist the file must have been deleted
        args.push(stats);
        emitEvent();
      }
    });
  } else if (
    this.options.alwaysStat && val1 === undefined &&
    (event === 'add' || event === 'addDir' || event === 'change')
  ) {
    fs.stat(path, function(error, stats) {
      // Suppress event when fs.stat fails, to avoid sending undefined 'stat'
      if (error || !stats) return;

      args.push(stats);
      emitEvent();
    });
  } else {
    emitEvent();
  }

  return this;
};

// Private method: Common handler for errors
//
// * error  - object, Error instance
//
// Returns the error if defined, otherwise the value of the
// FSWatcher instance's `closed` flag
FSWatcher.prototype._handleError = function(error) {
  var code = error && error.code;
  var ipe = this.options.ignorePermissionErrors;
  if (error &&
    code !== 'ENOENT' &&
    code !== 'ENOTDIR' &&
    (!ipe || (code !== 'EPERM' && code !== 'EACCES'))
  ) this.emit('error', error);
  return error || this.closed;
};

// Private method: Helper utility for throttling
//
// * action  - string, type of action being throttled
// * path    - string, path being acted upon
// * timeout - int, duration of time to suppress duplicate actions
//
// Returns throttle tracking object or false if action should be suppressed
FSWatcher.prototype._throttle = function(action, path, timeout) {
  if (!(action in this._throttled)) {
    this._throttled[action] = Object.create(null);
  }
  var throttled = this._throttled[action];
  if (path in throttled) return false;
  function clear() {
    delete throttled[path];
    clearTimeout(timeoutObject);
  }
  var timeoutObject = setTimeout(clear, timeout);
  throttled[path] = {timeoutObject: timeoutObject, clear: clear};
  return throttled[path];
};

// Private method: Awaits write operation to finish
//
// * path    - string, path being acted upon
// * threshold - int, time in milliseconds a file size must be fixed before
//                    acknowledgeing write operation is finished
// * callback - function, callback to call when write operation is finished
// Polls a newly created file for size variations. When files size does not
// change for 'threshold' milliseconds calls callback.
FSWatcher.prototype._awaitWriteFinish = function(path, threshold, callback) {
  var timeoutHandler;

  (function awaitWriteFinish (prevStat) {
    fs.stat(path, function(err, curStat) {
      if (err) {
        // if the file have been erased, the file entry in _pendingWrites will
        // be deleted in the unlink event.
        if (err.code == 'ENOENT') return;
        return callback(err);
      }

      var now = new Date();
      if (this._pendingWrites[path] === undefined) {
        this._pendingWrites[path] = {
          creationTime: now,
          cancelWait: function() {
            delete this._pendingWrites[path];
            clearTimeout(timeoutHandler);
            return callback();
          }.bind(this)
        }
        return timeoutHandler = setTimeout(
          awaitWriteFinish.bind(this, curStat),
          this.options.awaitWriteFinish.pollInterval
        );
      }

      if (
        curStat.size == prevStat.size &&
        now - this._pendingWrites[path].creationTime > threshold
      ) {
        delete this._pendingWrites[path];
        callback(null, curStat);
      } else {
        return timeoutHandler = setTimeout(
          awaitWriteFinish.bind(this, curStat),
          this.options.awaitWriteFinish.pollInterval
        );
      }
    }.bind(this));
  }.bind(this))();
}

// Private method: Determines whether user has asked to ignore this path
//
// * path  - string, path to file or directory
// * stats - object, result of fs.stat
//
// Returns boolean
FSWatcher.prototype._isIgnored = function(path, stats) {
  if (
    this.options.atomic &&
    /\..*\.(sw[px])$|\~$|\.subl.*\.tmp/.test(path)
  ) return true;

  if (!this._userIgnored) {
    var cwd = this.options.cwd;
    var ignored = this.options.ignored;
    if (cwd && ignored) {
      ignored = arrify(ignored).map(function (path) {
        if (typeof path !== 'string') return path;
        return isAbsolute(path) ? path : sysPath.join(cwd, path);
      });
    }
    this._userIgnored = anymatch(this._globIgnored
      .concat(ignored)
      .concat(arrify(ignored)
        .filter(function(path) {
          return typeof path === 'string' && !isglob(path);
        }).map(function(path) {
          return path + '/**/*';
        })
      )
    );
  }

  return this._userIgnored([path, stats]);
};

// Private method: Provides a set of common helpers and properties relating to
// symlink and glob handling
//
// * path - string, file, directory, or glob pattern being watched
// * depth - int, at any depth > 0, this isn't a glob
//
// Returns object containing helpers for this path
FSWatcher.prototype._getWatchHelpers = function(path, depth) {
  path = path.replace(/^\.[\/\\]/, '');
  var watchPath = depth || !isglob(path) ? path : globparent(path);
  var hasGlob = watchPath !== path;
  var globFilter = hasGlob ? anymatch(path) : false;

  var entryPath = function(entry) {
    return sysPath.join(watchPath, sysPath.relative(watchPath, entry.fullPath));
  }

  var filterPath = function(entry) {
    return (!hasGlob || globFilter(entryPath(entry))) &&
      this._isntIgnored(entryPath(entry), entry.stat) &&
      (this.options.ignorePermissionErrors ||
        this._hasReadPermissions(entry.stat));
  }.bind(this);

  var getDirParts = function(path) {
    if (!hasGlob) return false;
    var parts = sysPath.relative(watchPath, path).split(/[\/\\]/);
    return parts;
  }
  var dirParts = getDirParts(path);
  if (dirParts && dirParts.length > 1) dirParts.pop();

  var filterDir = function(entry) {
    if (hasGlob) {
      var entryParts = getDirParts(entry.fullPath);
      var globstar = false;
      var unmatchedGlob = !dirParts.every(function(part, i) {
        if (part === '**') globstar = true;
        return globstar || !entryParts[i] || anymatch(part, entryParts[i]);
      });
    }
    return !unmatchedGlob && this._isntIgnored(entryPath(entry), entry.stat);
  }.bind(this);

  return {
    followSymlinks: this.options.followSymlinks,
    statMethod: this.options.followSymlinks ? 'stat' : 'lstat',
    path: path,
    watchPath: watchPath,
    entryPath: entryPath,
    hasGlob: hasGlob,
    globFilter: globFilter,
    filterPath: filterPath,
    filterDir: filterDir
  };
}

// Directory helpers
// -----------------

// Private method: Provides directory tracking objects
//
// * directory - string, path of the directory
//
// Returns the directory's tracking object
FSWatcher.prototype._getWatchedDir = function(directory) {
  var dir = sysPath.resolve(directory);
  var watcherRemove = this._remove.bind(this);
  if (!(dir in this._watched)) this._watched[dir] = {
    _items: Object.create(null),
    add: function(item) {this._items[item] = true;},
    remove: function(item) {
      delete this._items[item];
      if (!this.children().length) {
        fs.readdir(dir, function(err) {
          if (err) watcherRemove(sysPath.dirname(dir), sysPath.basename(dir));
        });
      }
    },
    has: function(item) {return item in this._items;},
    children: function() {return Object.keys(this._items);}
  };
  return this._watched[dir];
};

// File helpers
// ------------

// Private method: Check for read permissions
// Based on this answer on SO: http://stackoverflow.com/a/11781404/1358405
//
// * stats - object, result of fs.stat
//
// Returns boolean
FSWatcher.prototype._hasReadPermissions = function(stats) {
  return Boolean(4 & parseInt(((stats && stats.mode) & 0x1ff).toString(8)[0], 10));
};

// Private method: Handles emitting unlink events for
// files and directories, and via recursion, for
// files and directories within directories that are unlinked
//
// * directory - string, directory within which the following item is located
// * item      - string, base path of item/directory
//
// Returns nothing
FSWatcher.prototype._remove = function(directory, item) {
  // if what is being deleted is a directory, get that directory's paths
  // for recursive deleting and cleaning of watched object
  // if it is not a directory, nestedDirectoryChildren will be empty array
  var path = sysPath.join(directory, item);
  var fullPath = sysPath.resolve(path);
  var isDirectory = this._watched[path] || this._watched[fullPath];

  // prevent duplicate handling in case of arriving here nearly simultaneously
  // via multiple paths (such as _handleFile and _handleDir)
  if (!this._throttle('remove', path, 100)) return;

  // if the only watched file is removed, watch for its return
  var watchedDirs = Object.keys(this._watched);
  if (!isDirectory && !this.options.useFsEvents && watchedDirs.length === 1) {
    this.add(directory, item, true);
  }

  // This will create a new entry in the watched object in either case
  // so we got to do the directory check beforehand
  var nestedDirectoryChildren = this._getWatchedDir(path).children();

  // Recursively remove children directories / files.
  nestedDirectoryChildren.forEach(function(nestedItem) {
    this._remove(path, nestedItem);
  }, this);

  // Check if item was on the watched list and remove it
  var parent = this._getWatchedDir(directory);
  var wasTracked = parent.has(item);
  parent.remove(item);

  // If we wait for this file to be fully written, cancel the wait.
  if (this.options.awaitWriteFinish && this._pendingWrites[path]) {
    this._pendingWrites[path].cancelWait();
    return;
  }

  // The Entry will either be a directory that just got removed
  // or a bogus entry to a file, in either case we have to remove it
  delete this._watched[path];
  delete this._watched[fullPath];
  var eventName = isDirectory ? 'unlinkDir' : 'unlink';
  if (wasTracked && !this._isIgnored(path)) this._emit(eventName, path);
};

// Public method: Adds paths to be watched on an existing FSWatcher instance

// * paths     - string or array of strings, file/directory paths and/or globs
// * _origAdd  - private boolean, for handling non-existent paths to be watched
// * _internal - private boolean, indicates a non-user add

// Returns an instance of FSWatcher for chaining.
FSWatcher.prototype.add = function(paths, _origAdd, _internal) {
  var cwd = this.options.cwd;
  this.closed = false;
  paths = flatten(arrify(paths));

  if (!paths.every(isString)) {
    throw new TypeError('Non-string provided as watch path');
  }

  if (cwd) paths = paths.map(function(path) {
    if (isAbsolute(path)) {
      return path;
    } else if (path[0] === '!') {
      return '!' + sysPath.join(cwd, path.substring(1));
    } else {
      return sysPath.join(cwd, path);
    }
  });

  // set aside negated glob strings
  paths = paths.filter(function(path) {
    if (path[0] === '!') this._ignoredPaths[path.substring(1)] = true;
    else {
      // if a path is being added that was previously ignored, stop ignoring it
      delete this._ignoredPaths[path];
      delete this._ignoredPaths[path + '/**/*'];

      // reset the cached userIgnored anymatch fn
      // to make ignoredPaths changes effective
      this._userIgnored = null;

      return true;
    }
  }, this);

  if (this.options.useFsEvents && FsEventsHandler.canUse()) {
    if (!this._readyCount) this._readyCount = paths.length;
    if (this.options.persistent) this._readyCount *= 2;
    paths.forEach(this._addToFsEvents, this);
  } else {
    if (!this._readyCount) this._readyCount = 0;
    this._readyCount += paths.length;
    each(paths, function(path, next) {
      this._addToNodeFs(path, !_internal, 0, 0, _origAdd, function(err, res) {
        if (res) this._emitReady();
        next(err, res);
      }.bind(this));
    }.bind(this), function(error, results) {
      results.forEach(function(item) {
        if (!item) return;
        this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
      }, this);
    }.bind(this));
  }

  return this;
};

// Public method: Close watchers or start ignoring events from specified paths.

// * paths     - string or array of strings, file/directory paths and/or globs

// Returns instance of FSWatcher for chaining.
FSWatcher.prototype.unwatch = function(paths) {
  if (this.closed) return this;
  paths = flatten(arrify(paths));

  paths.forEach(function(path) {
    if (this._closers[path]) {
      this._closers[path]();
      delete this._closers[path];
      this._getWatchedDir(sysPath.dirname(path)).remove(sysPath.basename(path));
    } else {
      //convert to absolute path
      path = sysPath.resolve(path);

      this._ignoredPaths[path] = true;
      if (path in this._watched) {
        this._ignoredPaths[path + '/**/*'] = true;
      }

      // reset the cached userIgnored anymatch fn
      // to make ignoredPaths changes effective
      this._userIgnored = null;
    }
  }, this);

  return this;
};

// Public method: Close watchers and remove all listeners from watched paths.

// Returns instance of FSWatcher for chaining.
FSWatcher.prototype.close = function() {
  if (this.closed) return this;

  this.closed = true;
  Object.keys(this._closers).forEach(function(watchPath) {
    this._closers[watchPath]();
    delete this._closers[watchPath];
  }, this);
  this._watched = Object.create(null);

  this.removeAllListeners();
  return this;
};

// Attach watch handler prototype methods
function importHandler(handler) {
  Object.keys(handler.prototype).forEach(function(method) {
    FSWatcher.prototype[method] = handler.prototype[method];
  });
}
importHandler(NodeFsHandler);
if (FsEventsHandler.canUse()) importHandler(FsEventsHandler);

// little isString util for use in Array.prototype.every
function isString(maybeString) {
  return typeof maybeString === 'string'
}

// Export FSWatcher class
exports.FSWatcher = FSWatcher;

// Public function: Instantiates watcher with paths to be tracked.

// * paths     - string or array of strings, file/directory paths and/or globs
// * options   - object, chokidar options

// Returns an instance of FSWatcher for chaining.
exports.watch = function(paths, options) {
  return new FSWatcher(options).add(paths);
};

});

__tpack__.define("../../../node-libs-browser/node_modules/http-browserify/lib/response.js", function(exports, module, require){
var Stream = require("stream");
var util = require("util");

var Response = module.exports = function (res) {
    this.offset = 0;
    this.readable = true;
};

util.inherits(Response, Stream);

var capable = {
    streaming : true,
    status2 : true
};

function parseHeaders (res) {
    var lines = res.getAllResponseHeaders().split(/\r?\n/);
    var headers = {};
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line === '') continue;
        
        var m = line.match(/^([^:]+):\s*(.*)/);
        if (m) {
            var key = m[1].toLowerCase(), value = m[2];
            
            if (headers[key] !== undefined) {
            
                if (isArray(headers[key])) {
                    headers[key].push(value);
                }
                else {
                    headers[key] = [ headers[key], value ];
                }
            }
            else {
                headers[key] = value;
            }
        }
        else {
            headers[line] = true;
        }
    }
    return headers;
}

Response.prototype.getResponse = function (xhr) {
    var respType = String(xhr.responseType).toLowerCase();
    if (respType === 'blob') return xhr.responseBlob || xhr.response;
    if (respType === 'arraybuffer') return xhr.response;
    return xhr.responseText;
}

Response.prototype.getHeader = function (key) {
    return this.headers[key.toLowerCase()];
};

Response.prototype.handle = function (res) {
    if (res.readyState === 2 && capable.status2) {
        try {
            this.statusCode = res.status;
            this.headers = parseHeaders(res);
        }
        catch (err) {
            capable.status2 = false;
        }
        
        if (capable.status2) {
            this.emit('ready');
        }
    }
    else if (capable.streaming && res.readyState === 3) {
        try {
            if (!this.statusCode) {
                this.statusCode = res.status;
                this.headers = parseHeaders(res);
                this.emit('ready');
            }
        }
        catch (err) {}
        
        try {
            this._emitData(res);
        }
        catch (err) {
            capable.streaming = false;
        }
    }
    else if (res.readyState === 4) {
        if (!this.statusCode) {
            this.statusCode = res.status;
            this.emit('ready');
        }
        this._emitData(res);
        
        if (res.error) {
            this.emit('error', this.getResponse(res));
        }
        else this.emit('end');
        
        this.emit('close');
    }
};

Response.prototype._emitData = function (res) {
    var respBody = this.getResponse(res);
    if (respBody.toString().match(/ArrayBuffer/)) {
        this.emit('data', new Uint8Array(respBody, this.offset));
        this.offset = respBody.byteLength;
        return;
    }
    if (respBody.length > this.offset) {
        this.emit('data', respBody.slice(this.offset));
        this.offset = respBody.length;
    }
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

});

__tpack__.define("../../../node-libs-browser/node_modules/Base64/base64.js", function(exports, module, require){
!function(){function t(t){this.message=t}var e="undefined"!=typeof exports?exports:this,r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.prototype=new Error,t.prototype.name="InvalidCharacterError",e.btoa||(e.btoa=function(e){for(var o,n,a=0,i=r,c="";e.charAt(0|a)||(i="=",a%1);c+=i.charAt(63&o>>8-a%1*8)){if(n=e.charCodeAt(a+=.75),n>255)throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");o=o<<8|n}return c}),e.atob||(e.atob=function(e){if(e=e.replace(/=+$/,""),e.length%4==1)throw new t("'atob' failed: The string to be decoded is not correctly encoded.");for(var o,n,a=0,i=0,c="";n=e.charAt(i++);~n&&(o=a%4?64*o+n:n,a++%4)?c+=String.fromCharCode(255&o>>(-2*a&6)):0)n=r.indexOf(n);return c})}();
});

__tpack__.define("../../../node-libs-browser/node_modules/http-browserify/lib/request.js", function(exports, module, require){
var Stream = require("stream");
var Response = require("../../node-libs-browser/node_modules/http-browserify/lib/response.js");
var Base64 = require("../../node-libs-browser/node_modules/Base64/base64.js");
var inherits = require("../../node-libs-browser/node_modules/inherits/inherits.js");

var Request = module.exports = function (xhr, params) {
    var self = this;
    self.writable = true;
    self.xhr = xhr;
    self.body = [];
    
    self.uri = (params.protocol || 'http:') + '//'
        + params.host
        + (params.port ? ':' + params.port : '')
        + (params.path || '/')
    ;
    
    if (typeof params.withCredentials === 'undefined') {
        params.withCredentials = true;
    }

    try { xhr.withCredentials = params.withCredentials }
    catch (e) {}
    
    if (params.responseType) try { xhr.responseType = params.responseType }
    catch (e) {}
    
    xhr.open(
        params.method || 'GET',
        self.uri,
        true
    );

    xhr.onerror = function(event) {
        self.emit('error', new Error('Network error'));
    };

    self._headers = {};
    
    if (params.headers) {
        var keys = objectKeys(params.headers);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!self.isSafeRequestHeader(key)) continue;
            var value = params.headers[key];
            self.setHeader(key, value);
        }
    }
    
    if (params.auth) {
        //basic auth
        this.setHeader('Authorization', 'Basic ' + Base64.btoa(params.auth));
    }

    var res = new Response;
    res.on('close', function () {
        self.emit('close');
    });
    
    res.on('ready', function () {
        self.emit('response', res);
    });

    res.on('error', function (err) {
        self.emit('error', err);
    });
    
    xhr.onreadystatechange = function () {
        // Fix for IE9 bug
        // SCRIPT575: Could not complete the operation due to error c00c023f
        // It happens when a request is aborted, calling the success callback anyway with readyState === 4
        if (xhr.__aborted) return;
        res.handle(xhr);
    };
};

inherits(Request, Stream);

Request.prototype.setHeader = function (key, value) {
    this._headers[key.toLowerCase()] = value
};

Request.prototype.getHeader = function (key) {
    return this._headers[key.toLowerCase()]
};

Request.prototype.removeHeader = function (key) {
    delete this._headers[key.toLowerCase()]
};

Request.prototype.write = function (s) {
    this.body.push(s);
};

Request.prototype.destroy = function (s) {
    this.xhr.__aborted = true;
    this.xhr.abort();
    this.emit('close');
};

Request.prototype.end = function (s) {
    if (s !== undefined) this.body.push(s);

    var keys = objectKeys(this._headers);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = this._headers[key];
        if (isArray(value)) {
            for (var j = 0; j < value.length; j++) {
                this.xhr.setRequestHeader(key, value[j]);
            }
        }
        else this.xhr.setRequestHeader(key, value)
    }

    if (this.body.length === 0) {
        this.xhr.send('');
    }
    else if (typeof this.body[0] === 'string') {
        this.xhr.send(this.body.join(''));
    }
    else if (isArray(this.body[0])) {
        var body = [];
        for (var i = 0; i < this.body.length; i++) {
            body.push.apply(body, this.body[i]);
        }
        this.xhr.send(body);
    }
    else if (/Array/.test(Object.prototype.toString.call(this.body[0]))) {
        var len = 0;
        for (var i = 0; i < this.body.length; i++) {
            len += this.body[i].length;
        }
        var body = new(this.body[0].constructor)(len);
        var k = 0;
        
        for (var i = 0; i < this.body.length; i++) {
            var b = this.body[i];
            for (var j = 0; j < b.length; j++) {
                body[k++] = b[j];
            }
        }
        this.xhr.send(body);
    }
    else if (isXHR2Compatible(this.body[0])) {
        this.xhr.send(this.body[0]);
    }
    else {
        var body = '';
        for (var i = 0; i < this.body.length; i++) {
            body += this.body[i].toString();
        }
        this.xhr.send(body);
    }
};

// Taken from http://dxr.mozilla.org/mozilla/mozilla-central/content/base/src/nsXMLHttpRequest.cpp.html
Request.unsafeHeaders = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "cookie",
    "cookie2",
    "content-transfer-encoding",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "via"
];

Request.prototype.isSafeRequestHeader = function (headerName) {
    if (!headerName) return false;
    return indexOf(Request.unsafeHeaders, headerName.toLowerCase()) === -1;
};

var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var indexOf = function (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
};

var isXHR2Compatible = function (obj) {
    if (typeof Blob !== 'undefined' && obj instanceof Blob) return true;
    if (typeof ArrayBuffer !== 'undefined' && obj instanceof ArrayBuffer) return true;
    if (typeof FormData !== 'undefined' && obj instanceof FormData) return true;
};

});

__tpack__.define("../../../node-libs-browser/node_modules/punycode/punycode.js", function(exports, module, require){
/*! https://mths.be/punycode v1.3.2 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.3.2',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

});

__tpack__.define("../../../node-libs-browser/node_modules/querystring-es3/decode.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

});

__tpack__.define("../../../node-libs-browser/node_modules/querystring-es3/encode.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

});

__tpack__.define("../../../node-libs-browser/node_modules/querystring-es3/index.js", function(exports, module, require){
'use strict';

exports.decode = exports.parse = require("../../node-libs-browser/node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = require("../../node-libs-browser/node_modules/querystring-es3/encode.js");

});

__tpack__.define("../../../node-libs-browser/node_modules/url/url.js", function(exports, module, require){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require("punycode");

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require("querystring");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

});

__tpack__.define("../../../node-libs-browser/node_modules/http-browserify/index.js", function(exports, module, require){
var http = module.exports;
var EventEmitter = require("events").EventEmitter;
var Request = require("../../node-libs-browser/node_modules/http-browserify/lib/request.js");
var url = require("url")

http.request = function (params, cb) {
    if (typeof params === 'string') {
        params = url.parse(params)
    }
    if (!params) params = {};
    if (!params.host && !params.port) {
        params.port = parseInt(window.location.port, 10);
    }
    if (!params.host && params.hostname) {
        params.host = params.hostname;
    }

    if (!params.protocol) {
        if (params.scheme) {
            params.protocol = params.scheme + ':';
        } else {
            params.protocol = window.location.protocol;
        }
    }

    if (!params.host) {
        params.host = window.location.hostname || window.location.host;
    }
    if (/:/.test(params.host)) {
        if (!params.port) {
            params.port = params.host.split(':')[1];
        }
        params.host = params.host.split(':')[0];
    }
    if (!params.port) params.port = params.protocol == 'https:' ? 443 : 80;
    
    var req = new Request(new xhrHttp, params);
    if (cb) req.on('response', cb);
    return req;
};

http.get = function (params, cb) {
    params.method = 'GET';
    var req = http.request(params, cb);
    req.end();
    return req;
};

http.Agent = function () {};
http.Agent.defaultMaxSockets = 4;

var xhrHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
})();

http.STATUS_CODES = {
    100 : 'Continue',
    101 : 'Switching Protocols',
    102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
    200 : 'OK',
    201 : 'Created',
    202 : 'Accepted',
    203 : 'Non-Authoritative Information',
    204 : 'No Content',
    205 : 'Reset Content',
    206 : 'Partial Content',
    207 : 'Multi-Status',               // RFC 4918
    300 : 'Multiple Choices',
    301 : 'Moved Permanently',
    302 : 'Moved Temporarily',
    303 : 'See Other',
    304 : 'Not Modified',
    305 : 'Use Proxy',
    307 : 'Temporary Redirect',
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Time-out',
    409 : 'Conflict',
    410 : 'Gone',
    411 : 'Length Required',
    412 : 'Precondition Failed',
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Large',
    415 : 'Unsupported Media Type',
    416 : 'Requested Range Not Satisfiable',
    417 : 'Expectation Failed',
    418 : 'I\'m a teapot',              // RFC 2324
    422 : 'Unprocessable Entity',       // RFC 4918
    423 : 'Locked',                     // RFC 4918
    424 : 'Failed Dependency',          // RFC 4918
    425 : 'Unordered Collection',       // RFC 4918
    426 : 'Upgrade Required',           // RFC 2817
    428 : 'Precondition Required',      // RFC 6585
    429 : 'Too Many Requests',          // RFC 6585
    431 : 'Request Header Fields Too Large',// RFC 6585
    500 : 'Internal Server Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Gateway Time-out',
    505 : 'HTTP Version Not Supported',
    506 : 'Variant Also Negotiates',    // RFC 2295
    507 : 'Insufficient Storage',       // RFC 4918
    509 : 'Bandwidth Limit Exceeded',
    510 : 'Not Extended',               // RFC 2774
    511 : 'Network Authentication Required' // RFC 6585
};
});

__tpack__.define("../../../aspserver/lib/httpvaluecollection.js", function(exports, module, require){


var QueryString = require("querystring");

/**
 * 专用于 HTTP 键值存储格式的集合。
 * @class
 */
function HttpValueCollection() { }

HttpValueCollection.prototype.fillFromString = function (s) {
    var data = QueryString.parse(s);
    for (var key in data) {
        this[key] = data[key];
    }
};

HttpValueCollection.prototype.toString = function () {
    return QueryString.stringify(this);
};

module.exports = HttpValueCollection;
});

__tpack__.define("../../../aspserver/lib/httputility.js", function(exports, module, require){


var Url = require("url");
var QueryString = require("querystring");
var HttpValueCollection = require("../../aspserver/lib/httpvaluecollection.js");

/**
 * 提供用于在处理 Web 请求时编码和解码 URL 的方法。 
 * @namespace
 */
var HttpUtility = {

	getDateFromHeader: function(value){
		if(!value)
			return null;
		try{
			return new Date(value);
		} catch(e){
			
		}
	},
	
	getAttributeFromHeader: function(headerValue, attrName){
		if(!headerValue){
			return null;
		}
		
		var re  =new RegExp('\\b\\s*' + attrName + '\s*=\s*(.*?)\s*(;|$)', 'i');
		re = headerValue.match(re);
		return re ? re[1] : null;
	},
	
	/**
	 * 将字符串最小限度地转换为 HTML 编码的字符串。
	 * @param {String} value 要编码的字符串。
	 * @returns {String} 一个已编码的字符串。
	 */
	htmlAttributeEncode: function(value){
		if(!value){
			return '';
		}
		
		return value.replace(/\"/g, "&quot;").replace(/&/g, "&amp;").replace(/</g, "&lt;");
	},
	
	/**
	 * 将对象的字符串表示形式转换为 HTML 编码的字符串，并返回编码的字符串。
	 * @param {String} value 要编码的字符串。
	 * @returns {String} 一个已编码的字符串。
	 */
	htmlEncode: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        };
        
        return function(value) {
            return value ? value.replace(/[&><"]/g, function(match) {
                return entities[match];    
            }) : value;
        };
    })(),
	
	/**
	 * 将已经为 HTTP 传输进行过 HTML 编码的字符串转换为已解码的字符串。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	htmlDecode: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        };
        
        return function(value) {
            return (!value) ? value : value.replace(/&(amp|lt|gt|quot|#[0-9]{1,5})/g, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @returns (String) The resulting URL
     */
    urlAppend : function(url, string) {
        if (string) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },
	
	/**
	 * 使用 UTF8 编码将查询字符串分析成一个 JSON 对象。
	 * @param {String} value 要分析的查询字符串。
	 * @returns {String} 查询参数和值的对象。
	 */
	parseQueryString: function(value){
		value = QueryString.parse(value);
		value.__proto__ = HttpValueCollection.prototype;
		return value;
	},
	
	/**
	 * 将一个 JSON 对象使用 UTF8 编码处理成查询字符串。
	 * @param {String} value 查询参数和值的对象。
	 * @returns {String} 查询字符串。
	 */
	stringifyQueryString: function(value){
		return QueryString.stringify(value);
	},
	
	/**
	 * 将字符串分析成一个 JSON 对象。
	 * @param {String} value 要分析的字符串。
	 * @returns {String} 一个对象。
	 */
	parseJSON: function(value){
		return value === undefined ? value : JSON.parse(value);
	},
	
	/**
	 * 将一个 JSON 对象使用 UTF8 编码处理成字符串。
	 * @param {String} value 一个对象。
	 * @returns {String} 字符串。
	 */
	stringifyJSON: function(value){
		return JSON.stringify(value);
	},
	
	/**
	 * 对字符串进行编码。
	 * @param {String} value 要编码的字符串。
	 * @returns {String} 一个已编码的字符串。
	 */
	javaScriptStringEncode: function(value){
		if(!value){
			return '';
		}
		
		var  metaObject = {
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '\\': '\\\\'
                },
		str = this.replace(/[\x00-\x1f\\]/g, function (chr) {
                            var special = metaObject[chr];
                            return special ? special : '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4)
                        });
        return '"' + str.replace(/"/g, '\\"') + '"';
	},
	
	/**
	 * 对字符串进行编码。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	javaScriptStringDecode: function(value){
		if(!value){
			return '';
		}
		
		return this.replace(/^["']|["']$/g, "").replace(/\\/g,"\\\\").replace(/\"/g,"\\\"").replace(/\'/,"\\'");
	},
	
	/**
	 * 对 URL 字符串进行编码。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	urlEncode: function(value){
		if(!value){
			return null;
		}
		
		try{
			return encodeURIComponent(value);
		}catch(e){
			return value;
		}
		
	},
	
	/**
	 * 将已经为在 URL 中传输而编码的字符串转换为解码的字符串。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	urlDecode: function(value){
		if(!value){
			return null;
		}
		
		try{
			return decodeURIComponent(value);
		}catch(e){
			return value;
		}
		
	},
	
	/**
	 * 对 URL 字符串的路径部分进行编码，以进行从 Web 服务器到客户端的可靠的 HTTP 传输。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	urlPathEncode: function(value){
		if(!value){
			return null;
		}
		
		try{
			return encodeURI(value);
		}catch(e){
			return value;
		}
		
	},
	
	/**
	 * 将已经为在 URL 中传输而编码的路径部分转换为解码的字符串。
	 * @param {String} value 要解码的字符串。
	 * @returns {String} 一个已解码的字符串。
	 */
	urlPathDecode: function(value){
		if(!value){
			return null;
		}
		
		try{
			return decodeURI(value);
		}catch(e){
			return value;
		}
		
	},
	
    /**
     * 调试输出一个对象。
     * @param {} obj 
     * @returns {} 
     */
	trace: function(obj){
		if(typeof obj === 'object'){
			for(var key in obj) {
				switch(typeof obj[key]){
					case 'number':
					case 'string':
					case 'boolean':
					case 'undefined':
						console.log(key, ": ", obj[key]);
						break;
					case 'object':
						if(obj[key] === null) {
							console.log(key, ": null");
							break;
						}
						
						console.log(key, ": " + obj[key].toString());
						break;
					case 'function':
						console.log(key, ": [Function]");
						break;
						
					default:
						console.log(key, ": ", obj[key]);
						break;
				}
			}
			
			return;
		}
		
		console.log(obj);
	}
};

module.exports = HttpUtility;
});

__tpack__.define("../../../aspserver/lib/httpcookie.js", function(exports, module, require){


var Http = require("http");
var Path = require("path");
var Url = require("url");
var HttpUtility = require("../../aspserver/lib/httputility.js");

/**
 * 提供创建和操作各 HTTP Cookie 的类型安全方法。
 * @class
 */
function HttpCookie(name, value, options){
	this.name = name;
	this.value = value;
	for(var key in options){
		this[key] = options[key];
	}
}

HttpCookie.prototype = {
    constructor: HttpCookie,
	/**
	 * 获取或设置将此 Cookie 与其关联的域。默认值为当前域。
	 * @type {String}
	 */
	domain: null,
	
	/**
	 * 获取或设置此 Cookie 的过期日期和时间。
	 * @type {Date}
	 */
	expires: null,
	
	/**
	 * 获取或设置 Cookie 的名称。
	 * @type {String}
	 */
	name: null,
	
	/**
	 * 获取或设置要与当前 Cookie 一起传输的虚拟路径。默认值为当前请求的路径。
	 * @type {String}
	 */
	path: null,
	
	/**
	 * 获取或设置一个值，该值指示是否使用安全套接字层 (SSL)（即仅通过 HTTPS）传输 Cookie。默认为 false。
	 * @type {Boolean}
	 */
	secure: false,
	
	/**
	 * 获取或设置一个值，该值指示是否使用仅在传输时使用此 Cookie。
	 * @type {Boolean}
	 */
	httpOnly: false,
	
	/**
	 * 获取或设置单个 Cookie 值。
	 * @type {String}
	 */
	get value(){
		if(this._value)
			return this._value;
		
		if(this._values) {
			return this._values.toString('&');
		}
			
		return null;
	},
	
	/**
	 * 获取或设置单个 Cookie 值。
	 * @type {String}
	 */
	set value(value){
		this._value = value;
	},
	
	/**
	 * 获取单个 Cookie 对象所包含的键值对的集合。
	 * @type {HttpValueCollection}
	 */
	get values(){
		if(this._values){
			return this._values;
		}
		
		var HttpCookieCollection = require("../../aspserver/lib/httpcookiecollection.js");
		
		var r = new HttpCookieCollection();
		
		this._values = r;
		
		return r;
	},
	
	toString: function(){
		return this.value;
	},
	
	toFullString: function(){
		var value = HttpUtility.urlPathEncode(this.name + '=' + this.value);
		if (this.path ) value += "; Path=" + HttpUtility.urlPathEncode(this.path);
		if (this.expires ) value += "; Expires=" + this.expires.toUTCString();
		if (this.domain ) value += "; Domain=" + HttpUtility.urlPathEncode(this.domain);
		if (this.secure ) value += "; Secure";
		if (this.httpOnly ) value += "; HttpOnly";
		return value;
		
	}
	
};

HttpCookie.parse = function(s){
	s = s.trim();
	var cookie = {__proto__: HttpCookie.prototype};
	var eq = s.indexOf('=');
	if(eq < 0){
		cookie.name = s;
	} else {
		cookie.name = s.substr(0, eq);
		s = s.substr(eq + 1);
		if(s.indexOf('&') < 0){
			cookie.value = HttpUtility.urlPathDecode(s);
		} else {
			s = s.split('&');
			for(var i = 0 ; i < s.length; i++){
				var subcookie = HttpCookie.parse(s[i]);
				cookie.values[subcookie.name] = subcookie;
			}
		}
	}
	return cookie;
};


module.exports = HttpCookie;
});

__tpack__.define("../../../aspserver/lib/httpcookiecollection.js", function(exports, module, require){


var Http = require("http");
var Path = require("path");
var Url = require("url");
var HttpUtility = require("../../aspserver/lib/httputility.js");
var HttpCookie = require("../../aspserver/lib/httpcookie.js");

/**
 * 提供操作 HTTP Cookie 的类型安全方法。
 * @class
 */
function HttpCookieCollection(){
}

HttpCookieCollection.prototype = {
    constructor: HttpCookieCollection,
	/**
	 * 将指定的 Cookie 添加到此 Cookie 集合中。
	 * @param {String/HttpCookie} name 创建的 Cookie 名字。
	 * @param {String} name 创建的 Cookie 值。
	 * @param {Object} options 创建的 Cookie 其它属性。
	 */
	add: function(name, value, options){
		if(!(name instanceof HttpCookie)){
			name = new HttpCookie(name, value, options);
		}
		
		return this[name] = name;
	},
	
	/**
	 * 将指定的 Cookie 添加到此 Cookie 集合中。
	 * @param {String/HttpCookie} name 要从集合中移除的 Cookie 名称。
	 */
	remove: function(name){
		if(name instanceof HttpCookie){
			name = name.name;
		}
		
		delete this[name];
	},
	
	/**
	 * 清除 Cookie 集合中的所有 Cookie。
	 */
	clear: function(){
		for(var key in this){
			if(this.hasOwnProperty(key)){
				delete this[key];
			}
		}
	},
	
	/**
	 * 确定是否存在指定名字的 Cookie 。
	 * @param {String/HttpCookie} name 要检索的 Cookie 名。
	 * @returns {Boolean} 如果存在则返回 true, 否则为 false 。
	 */
	contains: function(name){
		if(name instanceof HttpCookie){
			name = name.name;
		}
		
		return !!this[name];
	},
	
	toString: function(sep){
		var values = [];
		for(var key in this){
			if(this.hasOwnProperty(key)){
				values.push(key + '=' + HttpUtility.urlPathEncode(key.toString()));
			}
		}
		
		return values.join(sep || '; ');
	}
	
};

HttpCookieCollection.parse = function(s){
	var r = new HttpCookieCollection();
	if(s) {
		s = s.split(/\s*;\s*/);
		for(var i = 0; i < s.length; i++){
			var cookie = HttpCookie.parse(s[i]);
			r[cookie.name] = cookie;
		}
		
	}
	return r;
};


module.exports = HttpCookieCollection;
});

__tpack__.define("../../../aspserver/lib/httprequest.js", function(exports, module, require){
var Http = require("http");var Path = require("path");var Url = require("url");var HttpUtility = require("../../aspserver/lib/httputility.js");var HttpCookie = require("../../aspserver/lib/httpcookie.js");var HttpCookieCollection = require("../../aspserver/lib/httpcookiecollection.js");/** * 使服务器能够读取客户端在 Web 请求期间发送的 HTTP 值。 * @class */function HttpRequest(httpWorkerRequest, context){	this._wr = httpWorkerRequest;	this.context = context;}HttpRequest.prototype = {    constructor: HttpRequest,	/**	 * 当前对象关联的 {@link HttpWorkerRequest} 对象。	 * @type HttpWorkerRequest	 * @private	 */	_wr: null,		/**	 * 获取当前对象关联的 {@link HttpContext} 对象。	 * @type HttpContext	 */	context: null,		/**	 * 获取客户端支持的 MIME 接受类型的字符串数组。	 * @returns {String[]} 客户端支持的 MIME 接受类型的字符串数组。	 * @remark 此属性将消费大量性能，应该保存属性返回值以重复使用资源。	 */	get acceptTypes(){		return parseMultivalueHeader(this.getHeader('Accept'));	},		/**	 * 获取客户端支持的字符集的字符串数组。	 * @returns {String[]} 客户端支持的字符集的字符串数组。	 * @remark 此属性将消费大量性能，应该保存属性返回值以重复使用资源。	 */	get acceptCharsets(){		return parseMultivalueHeader(this.getHeader('Accept-Charsets'));	},		// AnonymousID		/**	 * 获取服务器上虚拟应用程序根路径。(末尾不含 /)	 * @returns {String} 当前应用程序的虚拟路径。	 */	get applicationPath(){		return this._wr.getAppPath();	},		// /**	 // * 获取应用程序根的虚拟路径，并通过对应用程序根使用波形符 (~) 表示法（例如，以“~/page.aspx”的形式）使该路径成为相对路径。	 // * @returns {String} 当前请求的应用程序根的虚拟路径。	 // */	// get appRelativeCurrentExecutionFilePath(){		// return '~' + this.currentExecutionFilePath.replace(this._wr.getAppPath(), "");	// },		/**	 * 获取当前请求的客户端安全证书。	 * @returns {HttpClientCertificate} 包含有关客户端安全证书设置的信息的对象。	 */	get clientCertificate(){		return this._wr.getClientCertificate();	},		/**	 * 获取或设置实体主体的字符集。	 * @returns {String} 表示客户端的字符集的编码。	 */	get contentEncoding(){		if(this._contentEncoding)			return this._contentEncoding;			var userAgent = this.userAgent;		if(/^UP/i.test(userAgent)){			var encoding = this.getHeader("x-up-devcap-post-charset");			if(encoding)				return this._contentEncoding = encoding;		}				if(!this._wr.hasEntityBody()){			return null;		}        		var contentType = this.contentType;				if(!contentType){			return null;		}				var attributeFromHeader = HttpUtility.getAttributeFromHeader(contentType, "charset");		if (attributeFromHeader == null) {			return null;		}			return this._contentEncoding = attributeFromHeader;	},		/**	 * 获取或设置实体主体的字符集。	 * @param {String} value 表示客户端的字符集的编码。	 */	set contentEncoding(value){		this._contentEncoding = value;		this._wr.contentEncoding = value;	},		/**	 * 指定客户端发送的内容长度（以字节计）。	 * @returns {Number} 客户端发送的内容的长度（以字节为单位）。	 */	get contentLength(){		return this._wr.getTotalEntityBodyLength();	},		/**	 * 获取或设置传入请求的 MIME 内容类型。	 * @returns {String} 表示传入请求的 MIME 内容类型的字符串，例如，“text/html”。	 */	get contentType(){		return this.getHeader('Content-Type');	},		/**	 * 获取或设置传入请求的 MIME 内容类型。	 * @returns {String} 表示传入请求的 MIME 内容类型的字符串，例如，“text/html”。	 */	set contentType(value){		this.setHeader('Content-Type', value);	},		/**	 * 获取响应 Cookie 集合。	 * @returns {HttpCookieCollection} 响应 Cookie 集合。	 */	get cookies(){		return this._cookies || (this._cookies = HttpCookieCollection.parse(this.getHeader("Cookie")));	},		/**	 * 获取一个 Cookie 字段。	 */	getCookie: function(name){		var cookie = this.cookies[name];		return cookie ? cookie.toString() : undefined;	},		// /**	 // * 获取当前请求的虚拟路径。	 // * @returns {String} 当前请求的虚拟路径。	 // */	// get currentExecutionFilePath(){		// return this._wr.getFilePath();	// },		// /**	 // *获取当前请求的虚拟路径的扩展名。	 // @return {String} 当前请求的虚拟路径的扩展名。	 // */	// get currentExecutionFilePathExtension(){		// return Path.extname(this.currentExecutionFilePath);	// },		/**	 *获取当前请求的虚拟路径的扩展名。	 @return {String} 当前请求的虚拟路径的扩展名。	 */	get filePathExtension(){		return Path.extname(this._wr.getFilePath());	},		/**	 * 获取当前请求的虚拟路径。	 * @returns {String} 当前请求的虚拟路径。	 */	get filePath(){		return this._wr.getFilePath();	},	/**	 * 获取采用多部分 MIME 格式的由客户端上载的文件的集合。	 * @returns {Object} 客户端上载的文件集合。	 */	get files(){			},		// Filter		/**	 * 获取窗体变量集合。	 * @returns {Object} 表示窗体变量集合的 Object。	 */	get form(){				if(!this.hasForm)			return {};				if(this._form)			return this._form;				return this._form = HttpUtility.parseQueryString(this.content.toString(this.contentEncoding || "utf-8"));			},		/**	 * 获取一个字符串，该值指示 Files 是否存在。	 * @returns {Boolean} 表示窗体变量集合的 Object。	 */	get hasFiles(){		return this._wr.hasEntityBody() && /^multipart\/form-data/i.test(this.contentType);	},		/**	 * 获取一个字符串，该值指示 Form 是否存在。	 * @returns {Boolean} 表示窗体变量集合的 Object。	 */	get hasForm(){		return this._wr.hasEntityBody();	},		/**	 * 获取一个字符串，该值指示 Form 是否存在。	 * @returns {Boolean} 表示窗体变量集合的 Object。	 */	get hasQueryString(){		return !!this._wr.getQueryString();	},		/**	 * 获取 HTTP 头集合。	 * @returns {Object} 表示窗体变量集合的 Object。	 */	get headers(){		return this._wr.getAllRequestHeaders();	},		/**	 * 返回指定字段的 HTTP 请求标头。	 * @param {String} name 标头的名称。	 * @returns {String} HTTP 请求标头。	 */	getHeader: function(name){		return this._wr.getRequestHeader(name);	},		/**	 * 获取客户端使用的 HTTP 数据传输方法（如 GET、POST 或 HEAD）。	 * @returns {String} 客户端使用的 HTTP 数据传输方法。	 */	get httpMethod(){		return this._wr.getHttpVerbName();	},		/**	 * 获取客户端使用的 HTTP 版本(如 HTTP/1.1)。	 * @returns {String} 客户端使用的 HTTP 版本。	 */	get httpVersion(){		return this._wr.getHttpVersion();	},		/**	 * 获取或设置从缓存中移除缓存信息的绝对日期和时间。	 * @returns {Date} 该页过期时的日期和时间。	 */	get ifModifiedSince(){		return HttpUtility.getDateFromHeader(this.getHeader("If-Modified-Since"));	},		/**	 * 获取或设置从缓存中移除缓存信息的绝对日期和时间。	 * @returns {Date} 该页过期时的日期和时间。	 */	set ifModifiedSince(value){		this.setHeader("If-Modified-Since", value.toUTCString());	},		/**	 * 获取引发当前请求的原因。	 * @returns {Number} 请求的原因码。 0 - 浏览器访问, 1 - XMLHttpRequest	 */	get reason(){		return this._wr.getRequestReason();	},		// /**	 // * 获取或设置一个值，该对象表示当前标头输出流的编码。	 // * @returns {String} 一个编码，包含与当前标头的字符集有关的信息。	 // */	// get headerEncoding(){		// return this._wr.headerEncoding;	// },		// /**	 // * 获取或设置一个值，该对象表示当前标头输出流的编码。	 // * @returns {String} 一个编码，包含与当前标头的字符集有关的信息。	 // */	// set headerEncoding(value){		// this._wr.headerEncoding = value;	// },		// Output		/**	 * 获取传入的 HTTP 实体主体的内容。	 * @returns {Stream} 请求正文。	 */	get inputStream(){		return this._wr.inputStream;	},		// IsAuthenticated		/**	 * 获取一个值，该值指示该请求是否来自本地计算机。	 * @returns {Boolean} 如果该请求来自本地计算机，则为 true；否则，为 false。	 */	get isLocal(){		var userHostAddress = this.userHostAddress;		if (!userHostAddress) {			return false;		}		return userHostAddress == "127.0.0.1" || userHostAddress == "::1" || userHostAddress == this._wr.getLocalAddress();	},		/**	 * 获取一个值，该值指示 HTTP 连接是否使用安全套接字（即 HTTPS）。	 * @returns {Boolean} 如果连接是 SSL 连接，则为 true；否则为 false。	 */	get isSecureConnection(){		return this._wr.isSecure();	},		/**	 * 获取 QueryString Form ServerVariables 和 Cookies 项的组合集合。	 * @returns 一个 Object 对象。	 */	get params(){		var obj = {};		copy(obj, this.serverVariables);		copy(obj, this.form);		copy(obj, this.queryString);				function copy(dest, src){			for(var key in src){				dest[key] = src[key];			}		}	},		/**	 * 获取当前请求的虚拟路径。	 * @returns {Url} 当前请求的虚拟路径。	 */	get path(){		return this._wr.getFilePath();	},		/**	 * 获取具有 URL 扩展名的资源的附加路径信息。	 * @returns {String} 资源的附加路径信息。	 */	get pathInfo(){		return this._wr.getPathInfo();	},		/**	 * 获取当前正在执行的服务器应用程序的根目录的物理文件系统路径。	 * @returns {String} 当前应用程序的根目录的文件系统路径。	 */	get physicalApplicationPath(){		return this._wr.getAppPathTranslated();	},		/**	 * 获取与请求的 URL 相对应的物理文件系统路径。	 * @returns {String} 当前请求的文件系统路径。	 */	get physicalPath(){		return this._wr.getFilePathTranslated();	},	/**	 * 获取 HTTP 查询字符串变量集合。	 * @returns {Object} 包含由客户端发送的查询字符串变量的集合。	 */	get queryString(){		return this._queryString || (this._queryString = HttpUtility.parseQueryString(this.queryStringText));	},		/**	 * 获取 HTTP 查询字符串变量源字符串 。	 * @returns {String} 包含由客户端发送的查询字符串变量的集合。	 */	get queryStringText(){		return this._wr.getQueryString();	},		/**	 * 获取当前请求的原始 URL。	 * @returns {String} 当前请求的原始 URL。	 */	get rawUrl(){		return this._wr.getRawUrl();	},		/**	 * 获取 Web 服务器变量的集合。	 */	get serverVariables(){		return {};	},		/**	 * 获取当前输入流中的字节数。	 * @param {Number} 输入流中的字节数。	 */	get totalBytes(){		return this._wr.getBytesRead();	},		/**	 * 获取有关当前请求的 URL 的信息。	 * @param {Number} 包含有关当前请求的 URL 的信息的对象。	 */	get url(){		return Url.parse(this.rawUrl, true);	},		/**	 * 获取有关当前请求的 HOST 的信息。	 * @returns {String} 包含有关当前请求的 HOST 的信息。	 */	get host(){		return this.getHeader("Host") || (this.localHostAddress + (this.localHostPort !== 80 ? ":" + this.localHostPort == 80 : ""));	},		/**	 * 获取指向当前请求地址的链接地址。	 * @returns {String} 链接地址。	 */	get href(){		return (this._wr.isSecure() ? "https://" : "http://") + this.host + this.rawUrl;	},		/**	 * 获取当前请求的正文。	 * @returns {Buffer} 请求的正文。	 */	get content(){		return this._wr.getEntityBody();	},		/**	 * 获取有关客户端上次请求的 URL 的信息，该请求链接到当前的 URL。	 * @returns {String} 包含有关当前请求的 URL 的信息的对象。	 */	get urlReferrer(){		return this.getHeader('Referer');	},		/**	 * 获取客户端浏览器的原始用户代理信息。	 * @returns {String} 客户端浏览器的原始用户代理信息。	 */	get userAgent(){		return this.getHeader('User-Agent');	},		/**	 *获取本地客户端的 IP 主机地址。	 * @returns {String} 本地客户端的 IP 地址。	 */	get localHostAddress(){		return this._wr.getLocalAddress();	},		/**	 * 获取本地客户端的端口。	 * @returns {String} 本地客户端的端口。	 */	get localHostPort(){		return this._wr.getLocalPort();	},		/**	 * 获取远程客户端的显示 IP 主机地址。	 * @returns {String} 远程客户端的 IP 地址。	 * @remark 该函数会检测 HTTP 头的代理字段，并优先返回 HTTP 头中的 IP 字段。	 */	get ip(){		return this.getHeader("X-Forwarded-For") || 			this.getHeader("Via") || 			this.userHostAddress;	},		/**	 * 获取远程客户端的 IP 主机地址。	 * @returns 远程客户端的 IP 地址。	 */	get userHostAddress(){		return this._wr.getRemoteAddress();	},		/**	 * 获取远程客户端的端口。	 * @param {Number} 远程客户端的端口。	 */	get userHostPort(){		return this._wr.getRemotePort();	},		/**	 * 获取远程客户端的 DNS 名称。	 * @param {Number} 远程客户端的 DNS 名称。	 */	get userHostName(){		return this._wr.getRemoteName();	},		/**	 * 获取客户端语言首选项的排序字符串数组。	 * @param String[]} 经过排序的客户端语言首选项的字符串数组，或者，如果为空，则为 null。	 * @remark 此属性将消费大量性能，应该保存属性返回值以重复使用资源。	 */	get userLanguages(){		return parseMultivalueHeader(this.getHeader('Accept-Language'));	},		/**	 * 将传入图像字段窗体参数映射为适当的 x 坐标值和 y 坐标值。	 * @param {String} imageFieldName 窗体图像映射的名称。	 * @returns {[Number, Number]} 二维整数数组。	 */	mapImageCoordinates: function(imageFieldName){		var obj;		switch (this.httpMethod) {                case "GET":                case "HEAD":                    obj = this.queryString;                    break;                case "POST":                    obj = this.form;                    break;                default:                    return null;            }		return [+obj[imageFieldName + ".x"], +obj[imageFieldName + ".y"]];	},		/**	 * 将指定的虚拟路径映射到物理路径。	 * @param {String} virtualPath 当前请求的虚拟路径（绝对路径或相对路径）。	 * @param {String} baseVirtualDir 用于相对解析的虚拟基目录路径。	 * @param {Boolean}  allowCrossAppMapping允许属于另一个应用程序。	 * @returns 服务器物理路径。	 */	mapPath: function(virtualPath, baseVirtualDir, allowCrossAppMapping){		if(baseVirtualDir) {			virtualPath = virtualPath.replace(baseVirtualDir, "");		}				virtualPath = this._wr.mapPath(virtualPath);				if(allowCrossAppMapping === false && this._wr.getAppPathTranslated().indexOf(virtualPath) !== 0) {			throw new Error('Cross app mapping');		}				return virtualPath;	},		/**	 * 将 HTTP 请求保存到磁盘。	 * @param {String} filename 物理驱动器路径。	 * @param {Boolean} includeHeaders 一个布尔值，该值指定是否应将 HTTP 头保存到磁盘。	 */	saveAs: function(filename, includeHeaders){				var FS = require('fs');			var s = FS.createWriteStream(filename, {			flags: 'w',			encoding: null,			mode: 0666		});				if(includeHeaders !== false){			var header = this.httpVersion + ' ' + this.httpMethod + ' ' + this.rawUrl + '\r\n';			var headers = this.headers;			for(var key in headers){				header += key + ': ' + headers[key] + '\r\n';			}						header += '\r\n';			s.write(header);		}				if(this._wr.hasEntityBody()){			s.write(this._wr.getEntityBody());		}				s.end();	},		/**	 * 对集合进行验证。	 */	validateInput: function(){			validate(this.cookies);		validate(this.form);		validate(this.queryString);				function validate(collection){			for(var key in collection){				if(check(collection[key]) === false) {					throw new Error('ValidateInput Error: `' + collection[key] + '` is not allowed');				}			}		}				function check(value){			return /<\w+>/.test(value);		}	}	};function parseMultivalueHeader(s) {	if (!s) {		return null;	}	var list = [];	var startIndex = 0;	var num = s.length;	while (startIndex < num) {		var index = s.indexOf(',', startIndex);		if (index < 0) {			index = num;		}		list.push(s.substr(startIndex, index - startIndex));		startIndex = index + 1;		if ((startIndex < num) && (s.charAt(startIndex) == ' ')) {			startIndex++;		}	}	return list;}module.exports = HttpRequest;
});

__tpack__.define("../../../aspserver/lib/httpworkerrequest.js", function(exports, module, require){
var Http = require("http");/** * 此抽象类定义由服务器用于处理请求的基本辅助方法和枚举。
 * @abstract * @class * @remark  * 此类是和底层 API 直接进行交互的内部类。 * 修改或继承此类，可以方便地将服务器模型移植到其它坏境中。 */function HttpWorkerRequset() {}function emptyFn() {}HttpWorkerRequset.prototype = {    constructor: HttpWorkerRequset,    /**	 * 终止与客户端的连接。
     * @abstract	 */    closeConnection: emptyFn,    /**	 * 由运行库使用以通知 @HttpWorkerRequest 当前请求的请求处理已完成。
     * @abstract	 */    endOfRequest: emptyFn,    /**	 * 将所有挂起的响应数据发送到客户端。	 * @param {Boolean} finalFlush 如果这将是最后一次刷新响应数据，则为 true；否则为 false。
     * @abstract	 */    flushResponse: emptyFn,    /**	 * 返回当前正在执行的服务器应用程序的虚拟路径。	 * @returns {String} 当前应用程序的虚拟路径。	 */    getAppPath: function() {        return "/";    },    /**	 * 返回当前正在执行的服务器应用程序的物理路径。	 * @returns {String} 当前应用程序的物理路径。	 */    getAppPathTranslated: function() {        return "/";    },    /**	 * 在派生类中被重写时，返回当前 URL 的应用程序池 ID。	 * @returns {String} 返回应用程序池 ID。	 */    getAppPoolID: function() {        return null;    },    /**	 * 获取从客户端读入的字节数。	 * @returns {Number} 客户端读入的字节数。	 */    getBytesRead: emptyFn,    /**	 * 在派生类中被重写时，从客户端发出的请求获取证书字段（以 X.509 标准指定）。	 * @returns {Buffer} 包含整个证书内容流的字节数组。	 */    getClientCertificate: emptyFn,    /**	 * 获取证书颁发者（以二进制格式表示）。	 * @returns {Buffer} 包含以二进制格式表示的证书颁发者的字节数组。	 */    getClientCertificateBinaryIssuer: emptyFn,    /**	 * 在派生类中被重写时，返回用于编码客户端证书的编码。	 * @returns {Number} 表示为整数的证书编码。	 */    getClientCertificateEncoding: emptyFn,    /**	 * 在派生类中被重写时，获取与客户端证书关联的 PublicKey 对象。	 * @returns {Buffer} 包含整个证书内容流的字节数组。	 */    getClientCertificatePublicKey: emptyFn,    /**	 * 在派生类中被重写时，则获取证书开始生效的日期。此日期随区域设置的不同而不同。	 * @returns {Date} 表示证书生效时间的 Date 对象。	 */    getClientCertificateValidFrom: emptyFn,    /**	 * 获取证书到期日期。	 * @returns {Date} 表示证书失效日期的 Date 对象。	 */    getClientCertificateValidUntil: emptyFn,    /**	 * 在派生类中被重写时，返回当前连接的 ID。	 * @returns {Number} 返回当前连接的 ID。	 */    getConnectionID: emptyFn,    /**	 * 在派生类中被重写时，返回所请求的 URI 的虚拟路径。	 * @returns {String} 请求的 URI 的路径。	 */    getFilePath: emptyFn,    /**	 * 返回请求的 URI 的物理文件路径（并将其从虚拟路径转换成物理路径：例如，从"/proj1/page.aspx"转换成"c:\dir\page.aspx"）。	 * @returns {String} 请求的 URI 的已转换的物理文件路径。	 */    getFilePathTranslated: emptyFn,    /**	 * 返回请求标头的指定成员。	 * @returns {String} 请求标头中返回的 HTTP 谓词。	 */    getHttpVerbName: emptyFn,    /**	 * 提供对请求的 HTTP 版本（如"HTTP/1.1"）的访问。	 * @returns {String} 请求标头中返回的 HTTP 版本。	 */    getHttpVersion: emptyFn,    /**	 * 返回与指定的索引相对应的标准 HTTP 请求标头。	 * @returns {String} 标头的索引。	 */    getHeader: emptyFn,    /**	 * 请求标头中返回的服务器 IP 地址。	 * @returns {String} 请求标头中返回的服务器 IP 地址。	 */    getLocalAddress: emptyFn,    /**	 * 请求标头中返回的服务器端口号。	 * @returns {String} 请求标头中返回的服务器端口号。	 */    getLocalPort: emptyFn,    /**	 * 在派生类中被重写时，返回 HTTP 协议（HTTP 或 HTTPS）。	 * @returns {String} 如果使用了 SSL ，是HTTPS；否则，为 HTTP。	 */    getProtocol: emptyFn,    /**	 * 返回请求 URL 中指定的查询字符串。	 * @returns {String} 请求查询字符串。	 */    getQueryString: emptyFn,    /**	 * 返回附加了查询字符串的请求标头中包含的 URL 路径。	 * @returns {String} 请求标头的原始 URL 路径。	 */    getRawUrl: emptyFn,    /**	 * 提供对请求标头的指定成员的访问。	 * @returns {String} 客户端的 IP 地址。	 */    getRemoteAddress: emptyFn,    /**	 * 在派生类中被重写时，返回客户端计算机的名称。	 * @returns {String} 客户端计算机的名称。	 */    getRemoteName: emptyFn,    /**	 * 提供对请求标头的指定成员的访问。	 * @returns {Number} 客户端的 HTTP 端口号。	 */    getRemotePort: emptyFn,    /**	 * 在派生类中被重写时，返回请求的原因。	 * @returns {Number} 原因代码。	 */    getRequestReason: emptyFn,    /**	 * 在派生类中被重写时，返回本地服务器的名称。	 * @returns {Number} 本地服务器的名称。	 */    getServerName: emptyFn,    /**	 * 从与请求关联的服务器变量词典返回单个服务器变量。	 * @param {String} name 请求的服务器变量的名称。	 * @returns {Number} 请求的服务器变量。	 */    getServerVariable: emptyFn,    /**	 * 返回请求的 URI 的虚拟路径。	 * @returns {String} 请求的 URI 的路径。	 */    getUriPath: emptyFn,    /**	 * 返回一个值，该值指示是否已为当前的请求将 HTTP 响应标头发送到客户端。	 * @returns {Boolean} 如果 HTTP 响应标头已发送到客户端，则为 true；否则，为 false。	 */    headersSent: emptyFn,    /**	 * 返回一个值，该值指示客户端连接是否仍处于活动状态。	 * @returns {Boolean} 如果客户端连接仍处于活动状态，则为 true；否则，为 false。	 */    isClientConnected: emptyFn,    /**	 * 返回一个指示连接是否使用 SSL 的值。	 * @returns {Boolean} 如果连接是 SSL 连接，则为 true；否则为 false。默认值为 false。	 */    isSecure: emptyFn,    /**	 * 返回与指定虚拟路径相对应的物理路径。	 * @param {String} virtualPath 虚拟路径。	 * @returns {String} 参数中指定的虚拟路径相对应的物理路径。	 */    mapPath: emptyFn,    /**	 * 将 Content-Length HTTP 标头添加到小于或等于 2 GB 的消息正文的响应。	 * @param {Number} contentLength 响应的长度（以字节为单位）。	 */    sendCalculatedContentLength: emptyFn,    /**	 * 将 Content-Length HTTP 标头添加到小于或等于 2 GB 的消息正文的响应。	 * @param {String} filename 要写入 HTTP 输出的文件名。	 * @param {Number} [offset=0] 文件中的位置，将从该位置开始将内容写入到 HTTP 输出中。	 * @param {Number} [length=buffer.length] 要传输的字节数。	 */    sendResponseFromFile: emptyFn,    /**	 * 将字节数组中指定数目的字节添加到响应。	 * @param {String} data 要发送的字节数组。	 * @param {Number} [length=data.length] 要发送的字节数（从第一个字节开始）。	 */    sendResponseFromMemory: emptyFn,    /**	 * 指定响应的 HTTP 状态代码和状态说明，例如 SendStatus(200, "Ok")。	 * @param {Number} statusCode 要发送的状态代码。	 * @param {String} statusDescription 要发送的状态说明。	 */    sendStatus: emptyFn,    /**	 * 将指定的 @HttpCookieCollection 输出到 HTTP 响应。	 * @param {HttpCookieCollection} cookies 要发送的状态代码。	 */    sendCookies: emptyFn,    /**	 * 在发送所有响应数据后注册可选通知。	 * @param {Function} callback 在发送所有数据（带外）后调用的通知回调。	 * @param {Object} extraData 回调的附加参数。	 */    setEndOfSendNotification: emptyFn,    /**	 * 获取或设置一个编码，该对象表示当前标头输出流的编码。	 */    get headerEncoding() {    },    /**	 * 获取或设置一个编码，该对象表示当前标头输出流的编码。	 */    set headerEncoding(value) {    }};/** * 返回一个字符串，该字符串描述指定的 HTTP 状态代码的名称。 * @param {Number} code HTTP 状态代码。 * @returns 状态说明。 */HttpWorkerRequset.getStatusDescription = function(statusCode) {    return Http.STATUS_CODES[statusCode] || "Unknown";};module.exports = HttpWorkerRequset;
});

__tpack__.define("../../../aspserver/lib/httpresponse.js", function(exports, module, require){
var FS = require("fs");var HttpWorkerRequset = require("../../aspserver/lib/httpworkerrequest.js");var HttpUtility = require("../../aspserver/lib/httputility.js");var HttpCookie = require("../../aspserver/lib/httpcookie.js");var HttpCookieCollection = require("../../aspserver/lib/httpcookiecollection.js");/** * 封装来自服务器操作的 HTTP 响应信息。 * @class */function HttpResponse(httpWorkerRequest, context){	this._wr = httpWorkerRequest;	this.context = context;	this._buffers = [];		this.contentEncoding = httpWorkerRequest.contentEncoding;}HttpResponse.prototype = {    constructor: HttpResponse,	/**	 * 当前对象关联的 {@link HttpWorkerRequest} 对象。	 * @type HttpWorkerRequest	 * @private	 */	_wr: null,		/**	 * 当前对象的输出缓存对象。	 * @type Buffer[]	 * @private	 */	_buffers: null,		_statusCode: 200,		_statusDescription: null,		_raiseHeaderWrittenException: function(){		throw new Error('Can\'t set headers after they are sent.');	},		_writeHeaders: function(finalFlush){				var headers = this._headers || Object,			wr = this._wr;				// 发送 Http 状态。		wr.sendStatus(this.statusCode, this.statusDescription);				// 发送预定义的头。		for(var key in headers){			wr.sendHeader(key, headers[key]);		}				// 如果未发送一些字段，则自动生成。				//if(!('Content-Type' in headers)) {		//	wr.sendHeader('Content-Type', 'text/html; charset=' + this.contentEncoding);		//}				var connection = headers['connection'];		var chunk = false;				// 如果支持缓存，并且是最后一次发送，则生成 Content-Length 并关闭连接。		if(this.bufferOutput && finalFlush){						if(!('content-length' in headers)) {				wr.sendCalculatedContentLength(this._calculateContentLength());			}						if(!connection){				wr.sendHeader('Connection', connection = 'Close');			}						} else if('content-length' in headers){			if(!connection){				wr.sendHeader('Connection', connection = 'Close');			}		} else if(!headers['transfer-encoding']){			chunk = true;			wr.sendHeader('transfer-encoding', "Chunked");						if(!connection){				wr.sendHeader('Connection', connection = "Keep-Alive");			}		} else if(!connection){			chunk = /^chunk$/i.test(headers['transfer-encoding']);			wr.sendHeader('Connection', connection = chunk ? "Keep-Alive" : 'Close');		}				wr.setKeepAlive(!/^close$/i.test(connection), chunk);				if(this._cookies){			wr.sendCookies(this._cookies);		}				// 发送附加隐藏的 Cookie 。比如 Session 。		if(this._externalCookie){			wr.sendHeader('Set-Cookie', this._externalCookie);		}				if(!('date' in headers)) {			wr.sendHeader('Date', utcDate());		}				if(!('server' in headers)) {			wr.sendHeader('Server', wr.getServerName());		}				wr.endOfHeaderSent();				if('expect' in headers) {			wr.sendResponseFromMemory('');		}		},		_calculateContentLength: function(){		for(var i = 0, buffers = this._buffers, len = buffers.length, sum = 0; i < len; i++){			sum += buffers[i].length;		}		return sum;	},		_writeRaw: function(data){		this._buffers.push(data);				if(!this.bufferOutput) {			this.flush();		}	},		/**	 * 获取当前对象关联的 {@link HttpContext} 对象。	 * @type HttpContext	 */	context: null,		/**	 * 获取或设置一个值，该值指示是否有异步处理逻辑，并在这个异步逻辑完成后主动调用 end() 以结束请求。	 * @returns 如果有异步处理逻辑，则为 true；否则为 false。	 */	async: false,		// buffer		/**	 * 获取或设置一个值，该值指示是否缓冲输出并在处理完整个响应之后发送它。	 * @returns 如果缓冲了发送给客户端的输出，则为 true；否则为 false。	 */	bufferOutput: true,		/**	 * 获取或设置 Cache-Control HTTP 标头。	 * @returns {String} Cache-Control HTTP 标头。	 */	get cacheControl(){		return this.getHeader("Cache-Control");	},		/**	 * 获取或设置 Cache-Control HTTP 标头。	 * @returns {String} Cache-Control HTTP 标头。	 */	set cacheControl(value){		this.setHeader("Cache-Control", value);	},		// Charset		/**	 * 获取或设置向客户端输出的内容编码。	 * @type Encoding	 */	contentEncoding: null,		/**	 * 获取或设置输出流的 HTTP MIME 类型。	 * @returns {String} 输出流的 HTTP MIME 类型。默认值为"text/html"。	 */	get contentType(){		return this.getHeader("Content-Type") || "text/html";	},		/**	 * 获取或设置输出流的 HTTP MIME 类型。	 * @returns {String} 输出流的 HTTP MIME 类型。默认值为"text/html"。	 */	set contentType(value){		//if(/^text\/html/i.test(value) && !/\bcharset\b/i.test(value)){		//	value += '; charset=' + this.contentEncoding;		//}		this.setHeader("Content-Type", value);	},		/**	 * 获取或设置主体的大小。	 * @returns {Number} 可以是任何值或 OutputStream 的长度。	 */	get contentLength(){		var value = +this.getHeader("Content-Length");		return isNaN(value) ? -1 : value;	},		/**	 * 获取或设置主体的大小。	 * @returns {Number} 可以是任何值或 OutputStream 的长度。	 */	set contentLength(value){		this.setHeader("Content-Length", value.toString());	},		/**	 * 获取或设置传输方式。	 * @returns {Boolean}	 */	get chunked(){		var chunk = this.getHeader("Transfer-Encoding");		return chunk ? /^chunked$/i.test(chunk) : false;	},		/**	 * 获取或设置传输方式。	 * @returns {Boolean}	 */	set chunked(value){		if(value){			this.setHeader("Transfer-Encoding", 'Chunk');		} else {			this.removeHeader("Transfer-Encoding");		}	},		/**	 * 获取响应 Cookie 集合。	 * @returns {HttpCookieCollection} 响应 Cookie 集合。	 */	get cookies(){		return this._cookies || (this._cookies = new HttpCookieCollection());	},		/**	 * 获取指示当前是否存在 Cookie 的值。	 * @returns {Boolean} 如果存在 Cookie 则返回 true 。	 */	get hasCookies(){		if(!this._cookies){			return false;		}				for(var key in this._cookies){			if(!this._cookies.hasOwnProperty(key)){				return true;			}		}						return false;	},		/**	 * 获取或设置在浏览器上缓存的页过期之前的分钟数。如果用户在页面过期之前返回同一页，则显示缓存的版本。	 * @returns {Integer} 在页过期之前的分钟数。	 */	get expires(){		var value = this.getHeader("Expires");		if(value){			try{				value = new Date(value);				return new Date() - value;			} catch(e){							}		}				return -1;	},	/**	 * 获取或设置在浏览器上缓存的页过期之前的分钟数。如果用户在页面过期之前返回同一页，则显示缓存的版本。	 * @returns {Integer} 在页过期之前的分钟数。	 */	set expires(value){		var n = new Date();		n.setMinutes(n.getMinutes() + value);		this.setHeader("Expires", n.toUTCString());	},		/**	 * 获取或设置从缓存中移除缓存信息的绝对日期和时间。	 * @returns {Date} 该页过期时的日期和时间。	 */	get expiresAbsolute(){		return HttpUtility.getDateFromHeader(this.getHeader("Expires"));	},		/**	 * 获取或设置从缓存中移除缓存信息的绝对日期和时间。	 * @returns {Date} 该页过期时的日期和时间。	 */	set expiresAbsolute(value){		this.setHeader("Expires", value.toUTCString());	},		// Filter		// /**	 // * 获取或设置一个值，该对象表示当前标头输出流的编码。	 // * @returns {Encoding} 一个编码，包含与当前标头的字符集有关的信息。	 // */	// get headerEncoding(){		// return this._wr.responseHeaderEncoding;	// },		// /**	 // * 获取或设置一个值，该对象表示当前标头输出流的编码。	 // * @returns {Encoding} 一个编码，包含与当前标头的字符集有关的信息。	 // */	// set headerEncoding(value){		// this._wr.responseHeaderEncoding = value;	// },		/**	 * 获取响应标头的集合。	 * @returns {Object} 响应标头的集合。	 */	get headers(){		return this._headers || (this._headers = {});	},		/**	 * 获取一个值，通过该值指示客户端是否仍连接在服务器上。	 * @returns {Boolean} 如果客户端仍连接在服务器上则返回 true 。	 */	get isClientConnected(){		return this._wr.isClientConnected();	},		/**	 * 获取一个布尔值，该值指示客户端是否正在被传输到新的位置。	 * @returns {Boolean} 如果客户端正在被传输到新的位置则返回 true 。	 */	get isRequestBeingRedirected(){		return !!this.getHeader("Location");	},		// Output		/**	 * 启用到输出 HTTP 内容主体的二进制输出。	 * @returns {Stream} 内容正文。	 */	get outputStream(){		return this._wr.outputStream;	},		/**	 * 获取或设置 Http Location 标头的值。	 * @returns {String} 通过 HTTP Location 标头传输到客户端的绝对 URI。	 */	get redirectLocation(){		return this.getHeader("Location");	},		/**	 * 获取或设置 Http Location 标头的值。	 * @returns {String} 通过 HTTP Location 标头传输到客户端的绝对 URI。	 */	set redirectLocation(value){		this.setHeader("Location", value);	},		/**	 * 设置返回到客户端的 Status 栏。	 * @returns {String} 设置状态代码会使描述 HTTP 输出状态的字符串返回到客户端。默认值为 200 (OK)。	 */	get status(){		return this.statusCode + " " + this.statusDescription;	},		/**	 * 设置返回到客户端的 Status 栏。	 * @returns {String} 设置状态代码会使描述 HTTP 输出状态的字符串返回到客户端。默认值为 200 (OK)。	 */	set status(value){		var n = value.indexOf(' ');		this.statusCode = value.substr(0, n);		this.statusDescription = value.substr(n + 1);	},		/**	 * 获取或设置返回给客户端的输出的 HTTP 状态代码。	 * @returns {Integer} 表示返回到客户端的 HTTP 输出状态的整数。默认值为 200 (OK)。有关有效状态代码的列表，请参见 Http Status Codes（Http 状态代码）。	 */	get statusCode(){		return this._statusCode;	},		/**	 * 获取或设置返回给客户端的输出的 HTTP 状态代码。	 * @returns {Integer} 表示返回到客户端的 HTTP 输出状态的整数。默认值为 200 (OK)。有关有效状态代码的列表，请参见 Http Status Codes（Http 状态代码）。	 */	set statusCode(value){		if(this._wr.headersSent()) {			this._raiseHeaderWrittenException();		}		this._statusCode = value;	},		/**	 * 获取或设置返回给客户端的输出的 HTTP 状态字符串。	 * @returns {String} 一个字符串，描述返回给客户端的 HTTP 输出的状态。默认值为"OK"。	 */	get statusDescription(){		return this._statusDescription || HttpWorkerRequset.getStatusDescription(this._statusCode);	},		/**	 * 获取或设置返回给客户端的输出的 HTTP 状态代码。	 * @returns {String} 表示返回到客户端的 HTTP 输出状态的整数。默认值为 200 (OK)。有关有效状态代码的列表，请参见 Http Status Codes（Http 状态代码）。	 */	set statusDescription(value){		if(this._wr.headersSent()) {			this._raiseHeaderWrittenException();		}		this._statusDescription = value;	},		// Status		// SubStatusCode		// SuppressContent		/**	 * 获取或设置向客户端输出的 Last-Modified 字段。	 * @returns {Date} Last-Modified 字段。	 */	get LastModified(){		return HttpUtility.getDateFromHeader(this.getHeader("Last-Modified"));	},		/**	 * 获取或设置向客户端输出的 Last-Modified 字段。	 * @returns {Date} Last-Modified 字段。	 */	set LastModified(value){		this.setHeader("Last-Modified", value.toUTCString());	},        /**	 * 返回一个值，该值指示是否已为当前的请求将 HTTP 响应标头发送到客户端。	 * @returns {Boolean} 如果 HTTP 响应标头已发送到客户端，则为 true；否则，为 false。	 */	get headersSent() {	    return this._wr.headersSent();	},		/**	 * 将一个 HTTP 标头添加到输出流。	 * @param {String} name 要添加 *value* 的 HTTP 头名称。	 * @param {String} value 要添加到头中的字符串。	 * @returns {String} 头部内容。	 */	getHeader: function(name){		if (arguments.length < 1) {			throw new Error('`name` is required for getHeader().');		}		if (!this._headers) return;		return this._headers[name.toLowerCase()];	},		/**	 * 将一个 HTTP 标头添加到输出流。	 * @param {String} name 要添加 *value* 的 HTTP 头名称。	 * @param {String} value 要添加到头中的字符串。	 */	setHeader: function(name, value){		if (arguments.length < 2) {			throw new Error('`name` and `value` are required for setHeader().');		}		if (this._wr.headersSent()) {		    this._raiseHeaderWrittenException();		}				this.headers[name.toLowerCase()] = value;	},		/**	 * 将一个 HTTP 标头添加到输出流。	 * @param {String} name 要添加 *value* 的 HTTP 头名称。	 * @param {String} value 要添加到头中的字符串。	 * @returns {Boolean} 如果删除成功，返回 true， 否则返回 false。	 */	removeHeader: function(name){		if (arguments.length < 1) {		    throw new Error('`name` is required for removeHeader().');		}		if (this._wr.headersSent()) {		    this._raiseHeaderWrittenException();		}				return delete this.headers[name.toLowerCase()];	},		// AppendCookie	// AppendHeader	// AppendToLog	// ApplyAppPathModifier		/**	 * 将一个二进制字符串写入 HTTP 输出流。	 * @param {Buffer} buffer 要写入输出流的字节。	 * @param {Number} offset=0 *buffer* 中的从零开始的字节偏移量，从此处开始将字节复制到当前流。	 * @param {Number} count=buffer.length 要写入当前流的字节数。	 */	binaryWrite: function(buffer, offset, count){		if(offset !== undefined && count !== undefined){			buffer = buffer.slice(offset, offset + count);		}				this._writeRaw(buffer);	},		/**	 * 清除缓冲区流中的所有内容输出。	 */	clear: function(){		this._buffers.length = 0;	},		/**	 * 清除缓冲区流中的所有头。	 */	clearHeaders: function() {		if(this._wr.headersSent()) {			this._raiseHeaderWrittenException();        }				if(this._headers) {			for(var item in this._headers){				delete this._headers[item];			}		}		        this._statusCode = 200;        this._statusDescription = null;        this.removeHeader("content-type");	},		/**	 * 关闭到客户端的套接字连接。	 */	close: function(){		this._wr.closeConnection();	},		/**	 * 关闭到客户端的套接字连接。	 */	end: function(data){		if(data){			this.write(data);		}		this.context.applicationInstance.onEndRequest(this.context);		this.flush(true);		this._wr.endOfRequest();		//this.close();	},		/**	 * 向客户端发送当前所有缓冲的输出。	 * @param {Boolean} finalFlush 如果这将是最后一次刷新响应数据，则为 true；否则为 false。	 */	flush: function(finalFlush){			var buffers = this._buffers,			wr = this._wr,			contentEncoding = this.contentEncoding;		if (!wr.headersSent()) {			this._writeHeaders(finalFlush);		}				for(var i = 0, len = buffers.length; i < len; i++){			wr.sendContent(buffers[i], contentEncoding);		}				buffers.length = 0;		        wr.flushResponse(finalFlush);			},		/**	 * 将一个 HTTP PICS-Label 标头追加到输出流。	 * @param {String} value 要添加到 PICS-Label 标头的字符串。	 */	pics: function(value){		this.setHeader("PICS-Label", value);	},		/**	 * 将客户端重定向到新的 URL。指定新的 URL 并指定当前页的执行是否应终止。	 * @param {String} url 目标的位置。	 * @param {Boolean} endResponse 指示当前页的执行是否应终止。	 */	redirect: function(url, endResponse){		this.statusCode = 302;		this.redirectLocation = url;		if(endResponse) {			this.write('Object Moved To <a herf="' + url + '">' + url + '</a>');			this.end();		}	},		/**	 * 更新 Cookie 集合中的一个现有 Cookie。	 * @param {HttpCookie} cookie 集合中要更新的 Cookie。	 */	setCookie: function(cookie){		if(!(cookie instanceof HttpCookie)){			cookie = new HttpCookie(cookie);		}		this.cookies.add(cookie);	},		/**	 * 将指定的文件直接写入 HTTP 响应输出流，而不在内存中缓冲该文件。	 * @param {String} filename 要写入 HTTP 输出的文件名。	 * @param {Number} offset=0 文件中的位置，将从该位置开始将内容写入到 HTTP 输出中。	 * @param {Number} length=buffer.length 要传输的字节数。	 */	transmitFile: function(filename, offset, length){			filename = this._wr.mapPath(filename);				if(!FS.existsSync(filename)){			throw new Error('file not found: ' + filename);		}				this._wr.sendResponseFromFile(filename, offset, size);	},		/**	 * 将一个字符串写入 HTTP 响应输出流。	 * @param {String} value 要写入 HTTP 输出流的字符串。	 */	write: function(value){		this._writeRaw(new Buffer(String(value)));	},		/**	 * 将一个字符串进行 HTML 编码后写入 HTTP 响应输出流。	 * @param {String} value 要写入 HTTP 输出流的字符串。	 */	writeText: function(value){		this.write(HttpUtility.htmlEncode(value));	},		/**	 * 将指定文件的内容作为文件块直接写入 HTTP 响应输出流。	 * @param {String} filename 要写入 HTTP 输出的文件名。	 * @param {Number} offset=0 文件中将开始进行写入的字节位置。	 * @param {Number} size=buffer.length 要写入输出流的字节数。	 */	writeFile: function(filename, offset, size){			/* var me = this;				filename = this._wr.mapPath(filename);				if(!FS.existsSync(filename)){			throw new Error('file not found: ' + filename);		}			FS.readFile(filename, function(error, content) {			me.binaryWrite(content, offset, size);		});		 */			this.binaryWrite(FS.readFileSync(this._wr.mapPath(filename)), offset, size);	},		/**	 * 添加尾部头。	 * @param {Object} headers 头部信息。	 */	addTrailers: function(headers){		this._wr.addTrailers(headers);	},		writeHead: function(statusCode){		var reasonPhrase, headers, headerIndex;		if (typeof arguments[1] == 'string') {			reasonPhrase = arguments[1];			headerIndex = 2;		} else {			reasonPhrase = HttpWorkerRequset.getStatusDescription(statusCode);			headerIndex = 1;		}				this.statusCode = statusCode;		this.statusDescription = reasonPhrase;				var obj = arguments[headerIndex];		if (obj) {			for(var key in obj){				this.setHeader(key, obj[key]);			}		}	}	};var dateCache;function utcDate() {  if (!dateCache) {    var d = new Date();    dateCache = d.toUTCString();    setTimeout(function() {      dateCache = undefined;    }, 1000 - d.getMilliseconds());  }  return dateCache;}module.exports = HttpResponse;
});

__tpack__.define("../../../aspserver/lib/httpcontext.js", function(exports, module, require){
var Http = require("http");var Path = require("path");var Url = require("url");var FS = require("fs");var Util = require("util");var HttpRequest = require("../../aspserver/lib/httprequest.js");var HttpResponse = require("../../aspserver/lib/httpresponse.js");/** * 封装有关个别 HTTP 请求的所有 HTTP 特定的信息。 * @class */function HttpContext(httpWorkerRequest){	this.request = new HttpRequest(httpWorkerRequest, this);	this.response = new HttpResponse(httpWorkerRequest, this);}HttpContext.prototype = {    constructor: HttpContext,	/**	 * 为当前 HTTP 请求获取 {@link HttpRequest} 对象。	 * @type HttpRequest	 */	request: null,		/**	 *  为当前 HTTP 请求获取 {@link HttpResponse} 对象。	 * @type HttpResponse	 */	response: null,		/**	 * 为当前 HTTP 请求获取 {@link HttpApplication} 对象。	 * @type HttpApplication	 */	get applicationInstance() {		return this.request._wr.applicationInstance;	},		// /**	 // * 获取或设置负责处理 HTTP 请求的处理程序.	 // * @type HttpHandler	 // */	// handler: null,		/**	 * 获取可用于在 HTTP 请求过程中在 Module 和 Handler 之间组织和共享数据的键/值对象。	 * @returns {Object} 对象。	 */	get items(){		return this._items || (this._items = {});	},		/**	 * 为当前 HTTP 请求获取 HttpSessionState 对象。	 * @returns {Object} 当前 HTTP 请求的 HttpSessionState 对象。	 */	get session(){				var sessionState = this.applicationInstance._sessionState;				if(!sessionState){			var HttpSessionState = require('./httpsessionstate');			this.applicationInstance._sessionState = sessionState = new HttpSessionState(this.applicationInstance);		}				// 获取当前匹配的 Session ID 。		var session = sessionState.getSession(this);				// 如果不存在 session，则创建 Session 。		if(!session){			sessionState.setSession(this, session = {});			this.applicationInstance.onSessionStart(this);		} 				return session;	},		/**	 * 为当前 HTTP 请求获取 HttpApplicationState 对象。	 * @returns {Object} 当前 HTTP 请求的 HttpApplicationState 对象。	 */	get application(){		return this.applicationInstance._applicationState || (this.applicationInstance._applicationState = {});	},		/**	 * 获取当前 HTTP 请求的初始时间戳。	 */	get timestamp(){		return this.request._wr.getRequestTimestamp();;	},		/**	 * 向客户端报告错误。	 * @param {Number} statusCode 错误码。	 * @param {Error} error 引发错误的原始异常。	 */	reportError: function (statusCode, error) {		this.applicationInstance.reportError(this, statusCode, error);	},		/**	 * 用于为请求指定处理程序。	 *  @param {HttpHandler} handler 应处理请求的对象。	 */	remapHandler: function(handler){		return handler.processRequest(this);	},		/**	 * 使用给定虚拟路径、路径信息、查询字符串信息和一个布尔值重写 URL，该布尔值用于指定是否将客户端文件路径设置为重写路径。	 * @param {String} path 内部重写路径。	 * @param {Boolean} rebaseClientPath 若要将用于客户端资源的文件路径设置为 *path*，则为 true；否则为 false。	 */	rewritePath: function(path, rebaseClientPath){			if(rebaseClientPath) {			this.context.response.redirect(path);			return;		}				// 清空 queryString 。		this.request.redirected = true;		this.request._queryString = null;		this.request._wr.rewritePath(path);		this.applicationInstance.remapHandler(this);	}	};	 module.exports = HttpContext;
});

__tpack__.define("../../../aspserver/lib/httpapplication.js", function(exports, module, require){

var Path = require("path");
var FS = require("fs");
var HttpContext = require("../../aspserver/lib/httpcontext.js");

/**
 * 表示一个 HTTP 应用程序。
 * @param {Object} configs 应用程序的默认配置。
 */
function HttpApplication(configs) {

	this.headers = {};
	this.modules = {};
	this.handlers = {};
	this.errorPages = {};
	this.virtualPaths = {};
	this.defaultPages = {};

	loadConfigs(require("../../aspserver/configs.json"), this);
	loadConfigs(configs, this);

}

function loadConfigs(configs, target, deepCount) {
	for (var key in configs) {
		var value = configs[key]; 
		if (typeof target[key] === "object") {
			deepCount = deepCount || 0;
			if (deepCount < 3) {
				loadConfigs(value, target[key], deepCount + 1);
			}
		} else {
			target[key] = value;
		}
	}
}

HttpApplication.prototype = {

    __proto__: require("events").EventEmitter.prototype,

    constructor: HttpApplication,

	// 配置

	/**
	 * 当前应用程序对应的域名。如 www.domain.com。
	 * @type {String}
	 * @remark * 表示任意域名。
	 */ 
	host: "*",

	/**
	 * 当前应用程序对应的 http 地址。
	 * @type {String}
	 * @remark '0.0.0.0' 表示任意地址。
	 */ 
	address: '0.0.0.0',
	
	/**
	 * 当前应用程序对应的端口。
	 * @type {Integer}
	 */ 
	port: 80,
	
	/**
	 * 当前应用程序的真实地址。
	 * @type {String}
	 */
	physicalPath: '.',
	
	/**
	 * 传输编码。
	 * @type {String}
	 */
	headerEncoding: 'utf-8',
	
	/**
	 * 源码编码。
	 * @type {String}
	 */
	contentEncoding: 'utf-8',
	
	/**
	 * 解析文件时的默认编码。
	 * @type {String}
	 */
	fileEncoding: 'utf-8',
	
	/**
	 * 当前应用程序的子虚拟地址。
	 * @type {String}
	 */
	virtualPaths: null,
	
	/**
	 * 支持的请求头信息。
	 * @type {String}
	 */
	headers: null,
	
	/**
	 * 支持的模块信息。
	 * @type {Object}
	 */
	modules: null,
	
	/**
	 * 支持的处理模块。
	 * @type {Object}
	 */
	handlers: null,
	
	/**
	 * 支持的错误页。
	 * @type {Object}
	 */
	errorPages: null,
	
	/**
	 * 支持的主页。
	 * @type {Object}
	 */
	defaultPages: null,
	
	/**
	 * 默认的 Session 过期时间。单位为分钟。
	 * @type {Integer}
	 */
	sessionTimeout: -1,
	
	/**
	 * 存储 Session 的键值。
	 * @type {Integer}
	 */
	sessionKey: 'XFLYSESSION',
	
	/**
	 * 存储 Session 的加密键。
	 * @type {Integer}
	 */
	sessionCryptoKey: 'xfly1',

	// 字段

	/**
	 * 获取当前应用程序在应用程序池的 ID 。
	 * @type {String}
	 */
	get id(){
		// 获取详细信息。
		var address = this.address;
		return (address ? address === 'localhost' ? '127.0.0.1' : address : '0.0.0.0') + ':' + this.port;
	},
	
	/**
	 * 获取当前应用程序的主机名。
	 * @type {String}
	 */
	get hostname(){
		return this.host !== "*" ? this.host + (this.port !== 80 && this.port !== 0 ? ':' + this.port : '')  : '*'
	},
	
	/**

	 * 获取当前应用程序的主页地址。
	 * @type {String}
	 */
	get rootUrl(){
		return 'http://' + (this.host !== '*' && this.host ? this.host : this.address && this.address !== '0.0.0.0' ? this.address : 'localhost') + (this.port !== 80 && this.port !== 0 ? ':' + this.port : '') + '/';
	},
	
	/**
	 * 初始化应用程序需要的全部资源。
	 */
	init: function(){
		
		// 将当前地址转为绝对路径。
		this.physicalPath = Path.resolve(__dirname, '../', this.physicalPath);

		this.port = +this.port || 80;

		for(var virtualPath in this.virtualPaths) {
			this.virtualPaths[virtualPath] =  Path.resolve(this.virtualPaths[virtualPath]);
		}

		this.loadModules(this.modules);
		this.loadModules(this.handlers);
		
	},

	/**
	 * 初始化额外加载的其它模块。
	 */
	loadModules: function(moduleList) {
		for (var key in moduleList) {
			var module = moduleList[key];
			switch (typeof module) {
			    case "string":
			        moduleList[key] = module = require(/^\./.test(module) ? Path.resolve(__dirname, "../", module) : module);
					// fall through
				case "object":
					if (module.init) {
						module.init(this);
					}
					if(!module.processRequest) {
						module.processRequest = function() {};
					}
			}
		}
	},
	
	onApplicationStart: function(){
		this.emit("start", this);
	},
	
	onApplicationStop: function(){
		this.emit("stop", this);
	},
	
	onBeginRequest: function(context) { 
		this.emit("beginRequest", context);
	},
	
	onEndRequest: function(context) { 
		this.emit("endRequest", context);
	},
	
	onSessionStart: function(context){
		this.emit("sessionStart", context);
	},
	
	onSessionEnd: function(context){
		this.emit("sessionEnd", context);
	},
	
	reportError: function (context, statusCode, error) {
	    context.errorCode = statusCode;
	    context.error = error;

	    if (!context.response.headersSent) {
	        context.response.statusCode = statusCode;
			context.response.contentType = 'text/html; charst=UTF-8';

	        if (this.errorPages[statusCode]) {
	            return context.response.writeFile(this.errorPages[statusCode]);
	        }
	    }
		
		if(this.handlers.error){
			this.handlers.error.processRequest(context);
		} else {
			var desc = require("../../aspserver/lib/httpworkerrequest.js").getStatusDescription(statusCode);
			context.response.write(statusCode + ' - ' + desc);
			
			if(error) {
				context.response.write('<pre>');
				context.response.write(error.toString());
				context.response.write('</pre>');
			}
			
			context.response.end();
		}
		
	},
	
	remapHandler: function(context){
	
		var me = this;
		
		// 当前准备输出的文件的物理位置。
		var path = context.request.physicalPath;
	
		// 使用文件方式处理请求。
		FS.stat(path, function(err, stats) {
			
			// 如果文件不存在，则调用错误报告器。
		    if (err) {

		        //// 根据指定的扩展名获取对应的 HttpHandler
		        //var handler = me.handlers[context.request.filePathExtension] || me.handlers["*"];

		        //// 如果存在对应的 Handler，则使用 Handler 继续处理请求。
		        //if (handler) {
		        //    handler.processRequest(context);
		        //} else {
		        //    context.reportError(404, err);
		        //}

		        context.reportError(404, err);
				
			// 如果目标是一个文件。
			} else if(stats.isFile()) {
			
				// 根据指定的扩展名获取对应的 HttpHandler
				var handler = me.handlers[context.request.filePathExtension] || me.handlers["*"];

				// 如果存在对应的 Handler，则使用 Handler 继续处理请求。
				if(handler){
					handler.processRequest(context);
				} else {
					context.reportError(403);
				}
				
			// 如果目标是一个文件夹。
			} else if(stats.isDirectory()) {
				
				// 如果末尾不包含 /, 自动补上。
				if(!(/\/$/).test(context.request.filePath)) {
					context.response.redirect(context.request.filePath + '/', true);
					return;
				}
				
				// 处理主页。
				for(var index in me.defaultPages){
					if(FS.existsSync(path + index)){
						context.rewritePath(context.request.filePath + index);
						return;
					}
				}

				if (me.handlers.directory) {
					me.handlers.directory.processRequest(context);
					return;
				}
				
				context.reportError(403);
			
			// 无权限访问。
			} else {
				context.reportError(403);
			}
			
		});
		
		return true;
		
	},
	
	process: function(httpWorkerRequest){
		var context = new HttpContext(httpWorkerRequest);
		this.onBeginRequest(context);
		this.processRequest(context);
	},
	
	processRequest: function(context){
	
		var me = this;
		
		// 优先使用各个模块处理请求，如果请求处理完毕，则返回 true 。
		for(var key in me.modules){
			if(me.modules[key] && me.modules[key].processRequest(context) === true){
				return true;
			}
		}
		
		// 然后使用使用各个处理程序处理请求。
		return me.remapHandler(context);
	}

};

module.exports = HttpApplication;
});

__tpack__.define("../../../aspserver/lib/defaulthttpworkerrequest.js", function(exports, module, require){
var Path = require("path");var Url = require("url");var HttpWorkerRequset = require("../../aspserver/lib/httpworkerrequest.js");/** * 基于默认坏境支持实现的 HttpWorkerRequset 类。 * @class * @extends HttpWorkerRequset */function DefaultHttpWorkerRequest(request, response, application){		var me = this;	me._req = request;	me._res = response;	me.applicationInstance = application;		// 初始化 request	request.addListener("data", function(data) {		if(!me._entityBodys) {			me._entityBodys = [];			me._entityBodys.count = 0;		}				me._entityBodys.push(data);		me._entityBodys.count += data.length;		if (me._entityBodys.count.length > 1e6) {			// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST			me.closeConnection();		}	});		var path = me._path = Url.parse(request.url, false);		try{		path.pathname = decodeURIComponent(path.pathname);	}catch(e){		}	// 根据路径搜索匹配的虚拟路径。	for(var virtualPath in application.virtualPaths) {		if((path.pathname + "/").indexOf(virtualPath + "/") == 0) {			me.appPath = virtualPath;			me.appPhysicalPath = application.virtualPaths[virtualPath];			return;		}	}	me.appPath = "";	me.appPhysicalPath = application.physicalPath;}DefaultHttpWorkerRequest.prototype = {    __proto__: HttpWorkerRequset.prototype,    constructor: DefaultHttpWorkerRequest,	_req: null,		_res: null,		_path: null,		_entityBodys: null,		applicationInstance: null,		/**	 * 获取传入的 HTTP 实体主体的内容。	 * @returns {Stream} 请求正文。	 */	get inputStream(){		return this._res;	},		/**	 * 启用到输出 HTTP 内容主体的二进制输出。	 * @returns {Stream} 内容正文。	 */	get outputStream(){		return this._res;	},		/**	 * 获取或设置一个编码，该对象表示当前标头输出流的编码。	 */ 	get headerEncoding(){		return this.applicationInstance.headerEncoding;	},		/**	 * 获取或设置一个编码，该对象表示当前标头输出流的编码。	 */ 	set contentEncoding(value){		this._req.setEncoding(value);	},		/**	 * 获取或设置一个编码，该对象表示当前标头输出流的编码。	 */ 	get contentEncoding(){		return this.applicationInstance.contentEncoding;	},		/**	 * 终止与客户端的连接。	 */	closeConnection: function(){		this._req.connection.destroy();	},		/**	 * 返回当前正在执行的服务器应用程序的虚拟路径。	 * @returns {String} 当前应用程序的虚拟路径。	 */	getAppPath: function(){		return this.appPath;	},		/**	 * 返回当前正在执行的服务器应用程序的物理路径。	 * @returns {String} 当前应用程序的物理路径。	 */	getAppPathTranslated: function(){		return this.appPhysicalPath;	},		/**	 * 在派生类中被重写时，返回当前 URL 的应用程序池 ID。	 * @returns {String} 返回应用程序池 ID。	 */	getAppPoolID: function(){		return this.applicationInstance.id;	},		/**	 * 获取从客户端读入的字节数。	 * @returns {Number} 客户端读入的字节数。	 */	getBytesRead: function(){		return this._req.connection.bytesRead;	},		/**	 * 在派生类中被重写时，从客户端发出的请求获取证书字段（以 X.509 标准指定）。	 * @returns {Buffer} 包含整个证书内容流的字节数组。	 */	getClientCertificate: function(){		return null;	},		/**	 * 获取证书颁发者（以二进制格式表示）。	 * @returns {Buffer} 包含以二进制格式表示的证书颁发者的字节数组。	 */	getClientCertificateBinaryIssuer: function(){		return null;	},		/**	 * 在派生类中被重写时，返回用于编码客户端证书的编码。	 * @returns {Number} 表示为整数的证书编码。	 */	getClientCertificateEncoding: function(){		return null;	},		/**	 * 在派生类中被重写时，获取与客户端证书关联的 PublicKey 对象。	 * @returns {Buffer} 包含整个证书内容流的字节数组。	 */	getClientCertificatePublicKey: function(){		return null;	},		/**	 * 在派生类中被重写时，则获取证书开始生效的日期。此日期随区域设置的不同而不同。	 * @returns {Date} 表示证书生效时间的 Date 对象。	 */	getClientCertificateValidFrom: function(){		return null;	},		/**	 * 获取证书到期日期。	 * @returns {Date} 表示证书失效日期的 Date 对象。	 */	getClientCertificateValidUntil: function(){		return null;	},		/**	 * 在派生类中被重写时，返回当前连接的 ID。	 * @returns {Number} 始终返回 0。	 */	getConnectionID: function(){		return 0;	},		/**	 * 在派生类中被重写时，返回所请求的 URI 的虚拟路径。	 * @returns {String} 请求的 URI 的路径。	 */	getFilePath: function(){		return this._path.pathname;	},		/**	 * 返回请求的 URI 的物理文件路径（并将其从虚拟路径转换成物理路径：例如，从"/proj1/page.aspx"转换成"c:\dir\page.aspx"）。	 * @returns {String} 请求的 URI 的已转换的物理文件路径。	 */	getFilePathTranslated: function(){		return this.mapPath(this._path.pathname);	},		/**	 * 返回请求标头的指定成员。	 * @returns {String} 请求标头中返回的 HTTP 谓词。	 */	getHttpVerbName: function(){		return this._req.method;	},		/**	 * 提供对请求的 HTTP 版本（如"HTTP/1.1"）的访问。	 * @returns {String} 请求标头中返回的 HTTP 版本。	 */	getHttpVersion: function(){		return 'HTTP/' + this._req.httpVersion;	},		/**	 * 返回指定字段的 HTTP 请求标头。	 * @param {String} name 标头的名称。	 * @returns {String} HTTP 请求标头。	 */	getRequestHeader: function(name){		return this._req.headers[name.toLowerCase()];	},		/**	 * 返回 HTTP 请求标头。	 * @returns {Object} 获取请求头对象。	 */	getAllRequestHeaders: function(){		return this._req.headers || {};	},		/**	 * 请求标头中返回的服务器 IP 地址。	 * @returns {String} 请求标头中返回的服务器 IP 地址。	 */	getLocalAddress: function(){		var addr = this._req.connection.server.address();		return addr ? addr.address : null;	},		/**	 * 请求标头中返回的服务器端口号。	 * @returns {String} 请求标头中返回的服务器端口号。	 */	getLocalPort: function(){		var addr = this._req.connection.server.address();		return addr ? addr.port : 0;	},		/**	 * 在派生类中被重写时，返回 HTTP 协议（HTTP 或 HTTPS）。	 * @returns {String} 如果使用了 SSL ，是HTTPS；否则，为 HTTP。	 */	getProtocol: function(){		return this.isSecure() ? "http" : "https";	},		/**	 * 返回请求 URL 中指定的查询字符串。	 * @returns {String} 请求查询字符串。	 */	getQueryString: function(){		return this._path.query || "";	},		/**	 * 返回附加了查询字符串的请求标头中包含的 URL 路径。	 * @returns {String} 请求标头的原始 URL 路径。	 */	getRawUrl: function(){		return this._path.href;	},		/**	 * 获取请求的开始时间。	 * @returns {Date} 一个开始时间。	 */	getRequestTimestamp: function(){		return this._req.connection._idleStart;	},		/**	 * 提供对请求标头的指定成员的访问。	 * @returns {String} 客户端的 IP 地址。	 */	getRemoteAddress: function(){		return this._req.connection.remoteAddress;	},		/**	 * 在派生类中被重写时，返回客户端计算机的名称。	 * @returns {String} 客户端计算机的名称。	 */	getRemoteName: function(){		return this.getRemoteAddress();	},		/**	 * 提供对请求标头的指定成员的访问。	 * @returns {Number} 客户端的 HTTP 端口号。	 */	getRemotePort: function(){		return this._req.connection.remotePort;	},		/**	 * 在派生类中被重写时，返回请求的原因。	 * @returns {Number} 原因代码。	 */	getRequestReason: function(){		var header = this.getRequestHeader('X-Requested-With');		return header && /XMLHttpRequest/i.test(header) ? 1 : 0;	},		/**	 * 在派生类中被重写时，返回本地服务器的名称。	 * @returns {Number} 本地服务器的名称。	 */	getServerName: function(){		return "Node-AspServer/1.0";	},		/**	 * 从与请求关联的服务器变量词典返回单个服务器变量。	 * @param {String} name 请求的服务器变量的名称。	 * @returns {Number} 请求的服务器变量。	 */	getServerVariable: function(name){		return null;	},		/**	 * 返回请求的 URI 的虚拟路径。	 * @returns {String} 请求的 URI 的路径。	 */	getUriPath: function(){		return this._path.path;	},		/**	 * 返回一个值，该值指示客户端连接是否仍处于活动状态。	 * @returns {Boolean} 如果客户端连接仍处于活动状态，则为 true；否则，为 false。	 */	isClientConnected: function(){		return this._req.connection.destroyed;	},		/**	 * 返回一个指示连接是否使用 SSL 的值。	 * @returns {Boolean} 如果连接是 SSL 连接，则为 true；否则为 false。默认值为 false。	 */	isSecure: function(){		return false;	},		hasEntityBody: function(){		return this._entityBodys ? this._entityBodys.count > 0 : false;	},		getTotalEntityBodyLength: function(){		return this._entityBodys ? this._entityBodys.count : 0;	},		getEntityBody: function(){		return this._entityBodys && this._entityBodys.count > 0 ? Buffer.concat(this._entityBodys) : null;	},		/**	 * 返回与指定虚拟路径相对应的物理路径。	 * @param {String} virtualPath 虚拟路径。	 * @returns {String} 参数中指定的虚拟路径相对应的物理路径。	 */	mapPath: function(virtualPath){		return Path.normalize(this.appPhysicalPath + virtualPath.substr(this.appPath.length));	},		/**	 * 返回一个值，该值指示是否已为当前的请求将 HTTP 响应标头发送到客户端。	 * @returns {Boolean} 如果 HTTP 响应标头已发送到客户端，则为 true；否则，为 false。	 */	headersSent: function(){		return !!this._res._headerSent;	},		/**	 * 指定响应的 HTTP 状态代码和状态说明，例如 SendStatus(200, "Ok")。	 * @param {Number} statusCode 要发送的状态代码。	 * @param {String} statusDescription 要发送的状态说明。	 */	sendStatus: function(statusCode, statusDescription){		this._res._header = this.getHttpVersion() + ' ' + statusCode + ' ' + statusDescription + '\r\n';							if (statusCode === 204 || statusCode === 304 ||			  (100 <= statusCode && statusCode <= 199)) {			// RFC 2616, 10.2.5:			// The 204 response MUST NOT include a message-body, and thus is always			// terminated by the first empty line after the header fields.			// RFC 2616, 10.3.5:			// The 304 response MUST NOT contain a message-body, and thus is always			// terminated by the first empty line after the header fields.			// RFC 2616, 10.1 Informational 1xx:			// This class of status code indicates a provisional response,			// consisting only of the Status-Line and optional headers, and is			// terminated by an empty line.			this._res._hasBody = false;		}		// don't keep alive connections where the client expects 100 Continue		// but we sent a final status; they may put extra bytes on the wire.		if (this._res._expect_continue && ! this._res._sent100) {			this._res.shouldKeepAlive = false;		}	},		sendHeader: function(name, value){		this._res._header += name + ': '+ value + '\r\n';	},		/**	 * 将 Content-Length HTTP 标头添加到小于或等于 2 GB 的消息正文的响应。	 * @param {Number} contentLength 响应的长度（以字节为单位）。	 */	sendCalculatedContentLength: function(contentLength){		this._res._header += "Content-Length: " + contentLength + '\r\n';	},		/**	 * 将指定的 *HttpCookieCollection* 输出到 HTTP 响应。	 * @param {HttpCookieCollection} cookies 要发送的状态代码。	 */	sendCookies: function(cookies){		for(var key in cookies){			if(cookies.hasOwnProperty(key)){				var cookie = cookies[key];				if(typeof cookie === 'string'){					cookie = key + '=' + cookie;										try{						cookie = encodeURI(cookie);					}catch(e){										}									this._res._header += "Set-Cookie: " + cookie + '\r\n';				} else {					this._res._header += "Set-Cookie: " + cookie.toFullString() + '\r\n';				}			}		}	},		setKeepAlive: function(value, chunk){		if(value) {			this._res.shouldKeepAlive = true;		} else {			this._res._last = true;		}				this.chunkedEncoding = chunk;	},		/**	 * 由运行库使用以通知 *HttpWorkerRequest* 当前请求的请求头已发送完毕。	 */	endOfHeaderSent: function(){				for(var key in this.applicationInstance.headers){			this.sendHeader(key, this.applicationInstance.headers[key]);		}				this._res._headerSent = true;		this.sendResponseFromMemory(this._res._header + '\r\n', this.headerEncoding);	},		/**	 * 将正文字节添加到响应。同时添加 chunk 标记。	 * @param {String} data 要发送的字节数组。	 * @param {Number} encoding 要发送的编码。	 */	sendContent: function(data, encoding){				if (!this._res._hasBody) {			console.trace('This type of response MUST NOT have a body. ' +		  'Ignoring write() calls.');			return true;		}		if (data.length === 0) return false;		if (typeof data !== 'string' && !Buffer.isBuffer(data)) {			throw new TypeError('first argument must be a string or Buffer');		}				if (this.chunkedEncoding) {			if (typeof data === 'string') {			  return this.sendResponseFromMemory(Buffer.byteLength(data, encoding).toString(16) + '\r\n' + data + '\r\n', encoding);			} else {			  // buffer			  this.sendResponseFromMemory(data.length.toString(16) + '\r\n');			  this.sendResponseFromMemory(data);			  return this.sendResponseFromMemory('\r\n');			}		} else {			return this.sendResponseFromMemory(data, encoding);		}	},		/**	 * 将 Content-Length HTTP 标头添加到小于或等于 2 GB 的消息正文的响应。	 * @param {String} filename 要写入 HTTP 输出的文件名。	 * @param {Number} offset=0 文件中的位置，将从该位置开始将内容写入到 HTTP 输出中。	 * @param {Number} length=buffer.length 要传输的字节数。	 */	sendResponseFromFile: function(filename, offset, length){				var options = {			flags : "r", 			encoding : null		};				if(offset !== undefined) {			options.start = options;					if(length !== undefined) {				options.end = offset + length;			}		}				FS.createReadStream(filename, options).pipe(this._res);	},		/**	 * 将字节添加到响应。	 * @param {String} data 要发送的字节数组。	 * @param {Number} encoding 要发送的编码。	 */	sendResponseFromMemory: function(data, encoding){		this._res._writeRaw(data, encoding);		//this._res.write(data, encoding);	},		/**	 * 将所有挂起的响应数据发送到客户端。	 * @param {Boolean} finalFlush 如果这将是最后一次刷新响应数据，则为 true；否则为 false。	 */	flushResponse: function(finalFlush){	    if(finalFlush){	        if(this.chunkedEncoding){	            this.sendResponseFromMemory('0\r\n\r\n');	        }			this._res.end();		} else {	        this._res._flush();		}	},		/**	 *  由运行库使用以通知 *HttpWorkerRequest* 当前请求的请求处理已完成。	 */	endOfRequest: function(){			},		///**	// * 将头部添加到相应底部。	// * @param {String} headers 要发送的头部。	// */	//addTrailers: function(headers){	//	this._res.addTrailers(headers);	//},		/**	 * 在发送所有响应数据后注册可选通知。	 * @param {Function} callback 在发送所有数据（带外）后调用的通知回调。	 * @param {Object} extraData 回调的附加参数。	 */	setEndOfSendNotification: function(callback, extraData){		if(extraData){			callback = callback.bind(this, extraData);		}		this._res.on('close', callback);	},		getPathInfo: function(){		return '';	},		rewritePath: function(path){		var tp = this._path;		path = Url.parse(path, false);		try{			tp.pathname = decodeURIComponent(path.pathname);		}catch(e){			tp.pathname = path.pathname;		}				tp.path = tp.pathname;				if('hash' in path){			tp.hash = path;		}				if('search' in path){			tp.search = path.search;			tp.query = path.query;						tp.path += tp.search;		}			}	};module.exports = DefaultHttpWorkerRequest;
});

__tpack__.define("../../../aspserver/lib/httpserver.js", function(exports, module, require){


var Http = require("http");
var Path = require("path");
var Url = require("url");
var Util = require("util");
var HttpApplication = require("../../aspserver/lib/httpapplication.js");
var HttpContext = require("../../aspserver/lib/httpcontext.js");
var DefaultHttpWorkerRequest = require("../../aspserver/lib/defaulthttpworkerrequest.js");

/**
 * 表示一个 Node Http 服务器。
 * @class
 */
function HttpServer() {

	var me = this;
	HttpApplication.apply(this, arguments);
	HttpServer.current = this;
	var server = this.socket = new Http.Server(function(request, response){
		me.process(new DefaultHttpWorkerRequest(request, response, me));
	});
	
	server.on('error', function(e){
		me.onError(e);
	});
	
	server.on('listening', function(){
		me.isListening = true;
		var addr = this.address();
		me.address = addr.address;
		me.port = addr.port;
		me.init();
		me.onApplicationStart();
	});
	
	server.on('close', function(){
		me.isListening = false;
		me.onApplicationStop();
	});
}

HttpServer.prototype = {

	__proto__: HttpApplication.prototype,
	constructor: HttpServer,
	/**
	 * 当前应用程序对应的实际的 Http.Server 对象。
	 * @type {Http.Server}
	 */
	socket: null,
	
	onError: function(e){
		this.emit('error', e, this);
	},
	
	/**
	 * 启动当前服务器。
	 */
	start: function(callback){
		this.socket.listen(this.port, this.address, 511, callback);
	},
	
	/**
	 * 停止当前应用程序池管理的全部服务器。
	 */
	stop: function(callback){
		this.socket.close(callback);
	},
	
	/**
	 * 重启当前应用程序池管理的全部服务器。
	 */
	restart: function(){
		this.stop(this.start.bind(this));
	}

};

module.exports = HttpServer;
});

__tpack__.define("../../../aspserver/lib/webserver.js", function(exports, module, require){


var Http = require("http");
var Path = require("path");
var Url = require("url");
var HttpContext = require("../../aspserver/lib/httpcontext.js");
var DefaultHttpWorkerRequest = require("../../aspserver/lib/defaulthttpworkerrequest.js");

/**
 * 表示一个 Web 服务器。
 * @class
 */
function WebServer(options){
	WebServer.current = this;
	this.sockets = {};
}

function getFieldCount(obj){
	var sum = 0;
	for(var key in obj){
		sum++;
	}
	
	return sum;
}

/**
 * 所有 http 请求的核心处理函数。
 */
function listeningHandler(request, response){

	// 找出当前 HOST 关联的 HttpApplication 对象。
	var hostnames = this.hostnames;
	var hostname = request.headers.host;
	var application = hostnames[hostname] || hostnames['*']; 
	
	if(application) {
		var wr = new DefaultHttpWorkerRequest(request, response, application);
		application.processRequest(new HttpContext(wr));
	} else {
		response.writeHead(403, 'Bad Request');
		response.end('No Application Available');
	}
}

function getApplicationId(application){
			
	// 获取详细信息。
	var address = application.address;
	var port = application.port;
	
	address = address ? address === 'localhost' ? '127.0.0.1' : address : '0.0.0.0';
	
	return address + ':' + port;
}

WebServer.prototype = {
    constructor: WebServer,
	log: function(e){
		console.log(e);
	},
	
	error: function(e){
		console.error(e);
	},

	defaultApplication: null,
	
	add: function(application){
	
		var me = this;
		var sockets = me.sockets;
		var appPoolId = application.id;
		var server = sockets[appPoolId];
		
		if(!server) {
			
			sockets[appPoolId] = server = new Http.Server(listeningHandler);
			
			// 创建 server 对应的支持的 application 数组。
			server.applications = [];
		
			server.on('error', function(e){
				var application = this.applications[0];
				if (e.code == 'EADDRINUSE') {
				    me.error('Cannot create server on port ' + application.port + (application.address && application.address !== '0.0.0.0' ? ' of ' + application.address : ''));
				} else {
					me.error(e);
				}
			});
			
			server.on('listening', function(){
				this.isListening = true;
				this.hostnames = {};
				var addr = this.address();
				var defaultApp;
				
				for(var i = 0;i < this.applications.length; i++){
					var application = this.applications[i];
					application.address = addr.address;
					application.port = addr.port;
					
					var hostname = application.hostname;
					if(!defaultApp && hostname === '*') {
						me.defaultApplication = defaultApp = application;
					}
					
					this.hostnames[hostname] = application;
					
					if(application.hosts){
						application.hosts.split(';').forEach(function(value){
							this.hostnames[value] = application;
						}, this);
					}

					application.init();
					application.onApplicationStart();
				}
				
				me.log("Server started successfully at " + (defaultApp || this.applications[0]).rootUrl + "\r\nClose this window to stop server.");
			});
			
			server.on('close', function(){
				this.isListening = false;
				var application = this.applications[0];
				var defaultApp;
				
				for(var i = 0;i < server.applications.length; i++){
					this.applications[i].onApplicationStop();
					
					if(!defaultApp && application.hostname === '*') {
						defaultApp = application;
					}
				}
				me.log("Server stopped at " + (defaultApp || this.applications[0]).rootUrl);
			});

			if (!me.defaultApplication) {
				me.defaultApplication = application;
			}
			
		}
		
		// 将当前 application 添加到 server 的支持范围内。
		server.applications.push(application);
		application.socket = server;
		
	},
	
	remove: function(application){
	
		var me = this;
		var sockets = me.sockets;
		var appPoolId = getApplicationId(application);
		var server = sockets[appPoolId];
		
		if(server) {
			var i = server.applications.indexOf(application);
			if(i >= 0){
				server.applications.splice(application, 1);

				if (this.defaultApplication == application) {
					this.defaultApplication = server.applications[0];
				}
			}
		}
	},
	
	/**
	 * 启动当前应用程序池管理的全部服务器。
	 */
	start: function(callback){
		var me = this;
		var sockets = me.sockets;
		var current = getFieldCount(sockets);
		for(var id in sockets){
			var server = sockets[id];
			
			// 启动对应的服务器。
			if(!server.isListening){
				var application = server.applications[0];
				server.listen(application.port, application.address, 511, callback && function(){
					if(--current === 0){
						callback.call(me);
					}
				});
			} else {
				--current;
			}
		}
	},
	
	/**
	 * 停止当前应用程序池管理的全部服务器。
	 */
	stop: function(callback){
		var me = this;
		var sockets = me.sockets;
		var current = getFieldCount(sockets);
		
		for(var id in sockets){
			var server = sockets[id];
			
			// 启动对应的服务器。
			if(server.isListening){
				server.close(callback && function(){
					if(--current === 0){
						callback.call(me);
					}
				});
			} else {
				--current;
			}
		}
	},
	
	/**
	 * 重启当前应用程序池管理的全部服务器。
	 */
	restart: function(){
		this.stop(this.start);
	},
	
	/**
	 * 使用当前服务器处理指定的请求。
	 */
	process: function(httpWorkerRequest){
		var address = httpWorkerRequest.getLocalAddress();
		var port = httpWorkerRequest.getLocalPort();
		var host = httpWorkerRequest.getRequestHeader('Host') || address;
		
		if(port != 80){
			host += ':' + port;
		}
		
		var me = this;
		var sockets = me.sockets;
		
		for(var id in sockets){
			var server = sockets[id];
			var serverAddr = server.address();
			
			if(serverAddr.address === address && serverAddr.port === port) {
				var application = server.hostnames[hostname] || server.hostnames['*']; 
				application.process(httpWorkerRequest);
				return;
			}
			
		}
		
		httpWorkerRequest.sendStatus(403, 'Bad Request');
		httpWorkerRequest.sendResponseFromMemory('No Application Available');
		httpWorkerRequest.flushResponse(true);
		httpWorkerRequest.endOfRequest();
		
	}
	
};

module.exports = WebServer;
});

__tpack__.define("../../../aspserver/lib/index.js", function(exports, module, require){

exports.HttpServer = require("../../aspserver/lib/httpserver.js");
exports.WebServer = require("../../aspserver/lib/webserver.js");
exports.HttpUtility = require("../../aspserver/lib/httputility.js");
exports.HttpCookie = require("../../aspserver/lib/httpcookie.js");
exports.HttpCookieCollection = require("../../aspserver/lib/httpcookiecollection.js");
exports.HttpRequest = require("../../aspserver/lib/httprequest.js");
exports.HttpResponse = require("../../aspserver/lib/httpresponse.js");
exports.HttpContext = require("../../aspserver/lib/httpcontext.js");
});

__tpack__.define("../../../node-libs-browser/node_modules/sha.js/hash.js", function(exports, module, require){
module.exports = function (Buffer) {

  //prototype class for hash functions
  function Hash (blockSize, finalSize) {
    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
    this._finalSize = finalSize
    this._blockSize = blockSize
    this._len = 0
    this._s = 0
  }

  Hash.prototype.init = function () {
    this._s = 0
    this._len = 0
  }

  Hash.prototype.update = function (data, enc) {
    if ("string" === typeof data) {
      enc = enc || "utf8"
      data = new Buffer(data, enc)
    }

    var l = this._len += data.length
    var s = this._s = (this._s || 0)
    var f = 0
    var buffer = this._block

    while (s < l) {
      var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
      var ch = (t - f)

      for (var i = 0; i < ch; i++) {
        buffer[(s % this._blockSize) + i] = data[i + f]
      }

      s += ch
      f += ch

      if ((s % this._blockSize) === 0) {
        this._update(buffer)
      }
    }
    this._s = s

    return this
  }

  Hash.prototype.digest = function (enc) {
    // Suppose the length of the message M, in bits, is l
    var l = this._len * 8

    // Append the bit 1 to the end of the message
    this._block[this._len % this._blockSize] = 0x80

    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
    this._block.fill(0, this._len % this._blockSize + 1)

    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
      this._update(this._block)
      this._block.fill(0)
    }

    // to this append the block which is equal to the number l written in binary
    // TODO: handle case where l is > Math.pow(2, 29)
    this._block.writeInt32BE(l, this._blockSize - 4)

    var hash = this._update(this._block) || this._hash()

    return enc ? hash.toString(enc) : hash
  }

  Hash.prototype._update = function () {
    throw new Error('_update must be implemented by subclass')
  }

  return Hash
}

});

__tpack__.define("../../../node-libs-browser/node_modules/sha.js/sha1.js", function(exports, module, require){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = require("util").inherits

module.exports = function (Buffer, Hash) {

  var A = 0|0
  var B = 4|0
  var C = 8|0
  var D = 12|0
  var E = 16|0

  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80)

  var POOL = []

  function Sha1 () {
    if(POOL.length)
      return POOL.pop().init()

    if(!(this instanceof Sha1)) return new Sha1()
    this._w = W
    Hash.call(this, 16*4, 14*4)

    this._h = null
    this.init()
  }

  inherits(Sha1, Hash)

  Sha1.prototype.init = function () {
    this._a = 0x67452301
    this._b = 0xefcdab89
    this._c = 0x98badcfe
    this._d = 0x10325476
    this._e = 0xc3d2e1f0

    Hash.prototype.init.call(this)
    return this
  }

  Sha1.prototype._POOL = POOL
  Sha1.prototype._update = function (X) {

    var a, b, c, d, e, _a, _b, _c, _d, _e

    a = _a = this._a
    b = _b = this._b
    c = _c = this._c
    d = _d = this._d
    e = _e = this._e

    var w = this._w

    for(var j = 0; j < 80; j++) {
      var W = w[j] = j < 16 ? X.readInt32BE(j*4)
        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

      var t = add(
        add(rol(a, 5), sha1_ft(j, b, c, d)),
        add(add(e, W), sha1_kt(j))
      )

      e = d
      d = c
      c = rol(b, 30)
      b = a
      a = t
    }

    this._a = add(a, _a)
    this._b = add(b, _b)
    this._c = add(c, _c)
    this._d = add(d, _d)
    this._e = add(e, _e)
  }

  Sha1.prototype._hash = function () {
    if(POOL.length < 100) POOL.push(this)
    var H = new Buffer(20)
    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
    H.writeInt32BE(this._a|0, A)
    H.writeInt32BE(this._b|0, B)
    H.writeInt32BE(this._c|0, C)
    H.writeInt32BE(this._d|0, D)
    H.writeInt32BE(this._e|0, E)
    return H
  }

  /*
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  function sha1_ft(t, b, c, d) {
    if(t < 20) return (b & c) | ((~b) & d);
    if(t < 40) return b ^ c ^ d;
    if(t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  /*
   * Determine the appropriate additive constant for the current iteration
   */
  function sha1_kt(t) {
    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
           (t < 60) ? -1894007588 : -899497514;
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
   *
   */
  function add(x, y) {
    return (x + y ) | 0
  //lets see how this goes on testling.
  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  //  return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  return Sha1
}

});

__tpack__.define("../../../node-libs-browser/node_modules/sha.js/sha256.js", function(exports, module, require){

/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require("util").inherits

module.exports = function (Buffer, Hash) {

  var K = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ]

  var W = new Array(64)

  function Sha256() {
    this.init()

    this._w = W //new Array(64)

    Hash.call(this, 16*4, 14*4)
  }

  inherits(Sha256, Hash)

  Sha256.prototype.init = function () {

    this._a = 0x6a09e667|0
    this._b = 0xbb67ae85|0
    this._c = 0x3c6ef372|0
    this._d = 0xa54ff53a|0
    this._e = 0x510e527f|0
    this._f = 0x9b05688c|0
    this._g = 0x1f83d9ab|0
    this._h = 0x5be0cd19|0

    this._len = this._s = 0

    return this
  }

  function S (X, n) {
    return (X >>> n) | (X << (32 - n));
  }

  function R (X, n) {
    return (X >>> n);
  }

  function Ch (x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj (x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  function Sigma0256 (x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }

  function Sigma1256 (x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }

  function Gamma0256 (x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }

  function Gamma1256 (x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  Sha256.prototype._update = function(M) {

    var W = this._w
    var a, b, c, d, e, f, g, h
    var T1, T2

    a = this._a | 0
    b = this._b | 0
    c = this._c | 0
    d = this._d | 0
    e = this._e | 0
    f = this._f | 0
    g = this._g | 0
    h = this._h | 0

    for (var j = 0; j < 64; j++) {
      var w = W[j] = j < 16
        ? M.readInt32BE(j * 4)
        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]

      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w

      T2 = Sigma0256(a) + Maj(a, b, c);
      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
    }

    this._a = (a + this._a) | 0
    this._b = (b + this._b) | 0
    this._c = (c + this._c) | 0
    this._d = (d + this._d) | 0
    this._e = (e + this._e) | 0
    this._f = (f + this._f) | 0
    this._g = (g + this._g) | 0
    this._h = (h + this._h) | 0

  };

  Sha256.prototype._hash = function () {
    var H = new Buffer(32)

    H.writeInt32BE(this._a,  0)
    H.writeInt32BE(this._b,  4)
    H.writeInt32BE(this._c,  8)
    H.writeInt32BE(this._d, 12)
    H.writeInt32BE(this._e, 16)
    H.writeInt32BE(this._f, 20)
    H.writeInt32BE(this._g, 24)
    H.writeInt32BE(this._h, 28)

    return H
  }

  return Sha256

}

});

__tpack__.define("../../../node-libs-browser/node_modules/sha.js/sha512.js", function(exports, module, require){
var inherits = require("util").inherits

module.exports = function (Buffer, Hash) {
  var K = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
  ]

  var W = new Array(160)

  function Sha512() {
    this.init()
    this._w = W

    Hash.call(this, 128, 112)
  }

  inherits(Sha512, Hash)

  Sha512.prototype.init = function () {

    this._a = 0x6a09e667|0
    this._b = 0xbb67ae85|0
    this._c = 0x3c6ef372|0
    this._d = 0xa54ff53a|0
    this._e = 0x510e527f|0
    this._f = 0x9b05688c|0
    this._g = 0x1f83d9ab|0
    this._h = 0x5be0cd19|0

    this._al = 0xf3bcc908|0
    this._bl = 0x84caa73b|0
    this._cl = 0xfe94f82b|0
    this._dl = 0x5f1d36f1|0
    this._el = 0xade682d1|0
    this._fl = 0x2b3e6c1f|0
    this._gl = 0xfb41bd6b|0
    this._hl = 0x137e2179|0

    this._len = this._s = 0

    return this
  }

  function S (X, Xl, n) {
    return (X >>> n) | (Xl << (32 - n))
  }

  function Ch (x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }

  function Maj (x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }

  Sha512.prototype._update = function(M) {

    var W = this._w
    var a, b, c, d, e, f, g, h
    var al, bl, cl, dl, el, fl, gl, hl

    a = this._a | 0
    b = this._b | 0
    c = this._c | 0
    d = this._d | 0
    e = this._e | 0
    f = this._f | 0
    g = this._g | 0
    h = this._h | 0

    al = this._al | 0
    bl = this._bl | 0
    cl = this._cl | 0
    dl = this._dl | 0
    el = this._el | 0
    fl = this._fl | 0
    gl = this._gl | 0
    hl = this._hl | 0

    for (var i = 0; i < 80; i++) {
      var j = i * 2

      var Wi, Wil

      if (i < 16) {
        Wi = W[j] = M.readInt32BE(j * 4)
        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4)

      } else {
        var x  = W[j - 15*2]
        var xl = W[j - 15*2 + 1]
        var gamma0  = S(x, xl, 1) ^ S(x, xl, 8) ^ (x >>> 7)
        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7)

        x  = W[j - 2*2]
        xl = W[j - 2*2 + 1]
        var gamma1  = S(x, xl, 19) ^ S(xl, x, 29) ^ (x >>> 6)
        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6)

        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
        var Wi7  = W[j - 7*2]
        var Wi7l = W[j - 7*2 + 1]

        var Wi16  = W[j - 16*2]
        var Wi16l = W[j - 16*2 + 1]

        Wil = gamma0l + Wi7l
        Wi  = gamma0  + Wi7 + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0)
        Wil = Wil + gamma1l
        Wi  = Wi  + gamma1  + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0)
        Wil = Wil + Wi16l
        Wi  = Wi  + Wi16 + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0)

        W[j] = Wi
        W[j + 1] = Wil
      }

      var maj = Maj(a, b, c)
      var majl = Maj(al, bl, cl)

      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7)
      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7)
      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9)
      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9)

      // t1 = h + sigma1 + ch + K[i] + W[i]
      var Ki = K[j]
      var Kil = K[j + 1]

      var ch = Ch(e, f, g)
      var chl = Ch(el, fl, gl)

      var t1l = hl + sigma1l
      var t1 = h + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0)
      t1l = t1l + chl
      t1 = t1 + ch + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0)
      t1l = t1l + Kil
      t1 = t1 + Ki + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0)
      t1l = t1l + Wil
      t1 = t1 + Wi + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0)

      // t2 = sigma0 + maj
      var t2l = sigma0l + majl
      var t2 = sigma0h + maj + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0)

      h  = g
      hl = gl
      g  = f
      gl = fl
      f  = e
      fl = el
      el = (dl + t1l) | 0
      e  = (d + t1 + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
      d  = c
      dl = cl
      c  = b
      cl = bl
      b  = a
      bl = al
      al = (t1l + t2l) | 0
      a  = (t1 + t2 + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0
    }

    this._al = (this._al + al) | 0
    this._bl = (this._bl + bl) | 0
    this._cl = (this._cl + cl) | 0
    this._dl = (this._dl + dl) | 0
    this._el = (this._el + el) | 0
    this._fl = (this._fl + fl) | 0
    this._gl = (this._gl + gl) | 0
    this._hl = (this._hl + hl) | 0

    this._a = (this._a + a + ((this._al >>> 0) < (al >>> 0) ? 1 : 0)) | 0
    this._b = (this._b + b + ((this._bl >>> 0) < (bl >>> 0) ? 1 : 0)) | 0
    this._c = (this._c + c + ((this._cl >>> 0) < (cl >>> 0) ? 1 : 0)) | 0
    this._d = (this._d + d + ((this._dl >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
    this._e = (this._e + e + ((this._el >>> 0) < (el >>> 0) ? 1 : 0)) | 0
    this._f = (this._f + f + ((this._fl >>> 0) < (fl >>> 0) ? 1 : 0)) | 0
    this._g = (this._g + g + ((this._gl >>> 0) < (gl >>> 0) ? 1 : 0)) | 0
    this._h = (this._h + h + ((this._hl >>> 0) < (hl >>> 0) ? 1 : 0)) | 0
  }

  Sha512.prototype._hash = function () {
    var H = new Buffer(64)

    function writeInt64BE(h, l, offset) {
      H.writeInt32BE(h, offset)
      H.writeInt32BE(l, offset + 4)
    }

    writeInt64BE(this._a, this._al, 0)
    writeInt64BE(this._b, this._bl, 8)
    writeInt64BE(this._c, this._cl, 16)
    writeInt64BE(this._d, this._dl, 24)
    writeInt64BE(this._e, this._el, 32)
    writeInt64BE(this._f, this._fl, 40)
    writeInt64BE(this._g, this._gl, 48)
    writeInt64BE(this._h, this._hl, 56)

    return H
  }

  return Sha512

}

});

__tpack__.define("../../../node-libs-browser/node_modules/sha.js/index.js", function(exports, module, require){
var exports = module.exports = function (alg) {
  var Alg = exports[alg]
  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
  return new Alg()
}

var Buffer = require("buffer").Buffer
var Hash   = require("../../node-libs-browser/node_modules/sha.js/hash.js")(Buffer)

exports.sha1 = require("../../node-libs-browser/node_modules/sha.js/sha1.js")(Buffer, Hash)
exports.sha256 = require("../../node-libs-browser/node_modules/sha.js/sha256.js")(Buffer, Hash)
exports.sha512 = require("../../node-libs-browser/node_modules/sha.js/sha512.js")(Buffer, Hash)

});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/helpers.js", function(exports, module, require){
var intSize = 4;
var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
var chrsz = 8;

function toArray(buf, bigEndian) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize));
    buf = Buffer.concat([buf, zeroBuffer], len);
  }

  var arr = [];
  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
  for (var i = 0; i < buf.length; i += intSize) {
    arr.push(fn.call(buf, i));
  }
  return arr;
}

function toBuffer(arr, size, bigEndian) {
  var buf = new Buffer(size);
  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
  for (var i = 0; i < arr.length; i++) {
    fn.call(buf, arr[i], i * 4, true);
  }
  return buf;
}

function hash(buf, fn, hashSize, bigEndian) {
  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
  return toBuffer(arr, hashSize, bigEndian);
}

module.exports = { hash: hash };

});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/md5.js", function(exports, module, require){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var helpers = require("../../node-libs-browser/node_modules/crypto-browserify/helpers.js");

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

module.exports = function md5(buf) {
  return helpers.hash(buf, core_md5, 16);
};

});

__tpack__.define("../../../node-libs-browser/node_modules/ripemd160/lib/ripemd160.js", function(exports, module, require){

module.exports = ripemd160



/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/** @preserve
(c) 2012 by Cédric Mesnil. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Constants table
var zl = [
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
var zr = [
    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
var sl = [
     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
var sr = [
    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

var bytesToWords = function (bytes) {
  var words = [];
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32);
  }
  return words;
};

var wordsToBytes = function (words) {
  var bytes = [];
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
  }
  return bytes;
};

var processBlock = function (H, M, offset) {

  // Swap endian
  for (var i = 0; i < 16; i++) {
    var offset_i = offset + i;
    var M_offset_i = M[offset_i];

    // Swap
    M[offset_i] = (
        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    );
  }

  // Working variables
  var al, bl, cl, dl, el;
  var ar, br, cr, dr, er;

  ar = al = H[0];
  br = bl = H[1];
  cr = cl = H[2];
  dr = dl = H[3];
  er = el = H[4];
  // Computation
  var t;
  for (var i = 0; i < 80; i += 1) {
    t = (al +  M[offset+zl[i]])|0;
    if (i<16){
        t +=  f1(bl,cl,dl) + hl[0];
    } else if (i<32) {
        t +=  f2(bl,cl,dl) + hl[1];
    } else if (i<48) {
        t +=  f3(bl,cl,dl) + hl[2];
    } else if (i<64) {
        t +=  f4(bl,cl,dl) + hl[3];
    } else {// if (i<80) {
        t +=  f5(bl,cl,dl) + hl[4];
    }
    t = t|0;
    t =  rotl(t,sl[i]);
    t = (t+el)|0;
    al = el;
    el = dl;
    dl = rotl(cl, 10);
    cl = bl;
    bl = t;

    t = (ar + M[offset+zr[i]])|0;
    if (i<16){
        t +=  f5(br,cr,dr) + hr[0];
    } else if (i<32) {
        t +=  f4(br,cr,dr) + hr[1];
    } else if (i<48) {
        t +=  f3(br,cr,dr) + hr[2];
    } else if (i<64) {
        t +=  f2(br,cr,dr) + hr[3];
    } else {// if (i<80) {
        t +=  f1(br,cr,dr) + hr[4];
    }
    t = t|0;
    t =  rotl(t,sr[i]) ;
    t = (t+er)|0;
    ar = er;
    er = dr;
    dr = rotl(cr, 10);
    cr = br;
    br = t;
  }
  // Intermediate hash value
  t    = (H[1] + cl + dr)|0;
  H[1] = (H[2] + dl + er)|0;
  H[2] = (H[3] + el + ar)|0;
  H[3] = (H[4] + al + br)|0;
  H[4] = (H[0] + bl + cr)|0;
  H[0] =  t;
};

function f1(x, y, z) {
  return ((x) ^ (y) ^ (z));
}

function f2(x, y, z) {
  return (((x)&(y)) | ((~x)&(z)));
}

function f3(x, y, z) {
  return (((x) | (~(y))) ^ (z));
}

function f4(x, y, z) {
  return (((x) & (z)) | ((y)&(~(z))));
}

function f5(x, y, z) {
  return ((x) ^ ((y) |(~(z))));
}

function rotl(x,n) {
  return (x<<n) | (x>>>(32-n));
}

function ripemd160(message) {
  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

  if (typeof message == 'string')
    message = new Buffer(message, 'utf8');

  var m = bytesToWords(message);

  var nBitsLeft = message.length * 8;
  var nBitsTotal = message.length * 8;

  // Add padding
  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
  );

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  // Swap endian
  for (var i = 0; i < 5; i++) {
      // Shortcut
    var H_i = H[i];

    // Swap
    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  }

  var digestbytes = wordsToBytes(H);
  return new Buffer(digestbytes);
}



});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/create-hash.js", function(exports, module, require){
var createHash = require("../../node-libs-browser/node_modules/sha.js/index.js")

var md5 = toConstructor(require("../../node-libs-browser/node_modules/crypto-browserify/md5.js"))
var rmd160 = toConstructor(require("../../node-libs-browser/node_modules/ripemd160/lib/ripemd160.js"))

function toConstructor (fn) {
  return function () {
    var buffers = []
    var m= {
      update: function (data, enc) {
        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
        buffers.push(data)
        return this
      },
      digest: function (enc) {
        var buf = Buffer.concat(buffers)
        var r = fn(buf)
        buffers = null
        return enc ? r.toString(enc) : r
      }
    }
    return m
  }
}

module.exports = function (alg) {
  if('md5' === alg) return new md5()
  if('rmd160' === alg) return new rmd160()
  return createHash(alg)
}

});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/create-hmac.js", function(exports, module, require){
var createHash = require("../../node-libs-browser/node_modules/crypto-browserify/create-hash.js")

var zeroBuffer = new Buffer(128)
zeroBuffer.fill(0)

module.exports = Hmac

function Hmac (alg, key) {
  if(!(this instanceof Hmac)) return new Hmac(alg, key)
  this._opad = opad
  this._alg = alg

  var blocksize = (alg === 'sha512') ? 128 : 64

  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key

  if(key.length > blocksize) {
    key = createHash(alg).update(key).digest()
  } else if(key.length < blocksize) {
    key = Buffer.concat([key, zeroBuffer], blocksize)
  }

  var ipad = this._ipad = new Buffer(blocksize)
  var opad = this._opad = new Buffer(blocksize)

  for(var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = createHash(alg).update(ipad)
}

Hmac.prototype.update = function (data, enc) {
  this._hash.update(data, enc)
  return this
}

Hmac.prototype.digest = function (enc) {
  var h = this._hash.digest()
  return createHash(this._alg).update(this._opad).update(h).digest(enc)
}


});

__tpack__.define("../../../node-libs-browser/node_modules/pbkdf2-compat/pbkdf2.js", function(exports, module, require){
module.exports = function(crypto) {
  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
    if ('function' === typeof digest) {
      callback = digest
      digest = undefined
    }

    if ('function' !== typeof callback)
      throw new Error('No callback provided to pbkdf2')

    setTimeout(function() {
      var result

      try {
        result = pbkdf2Sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }

      callback(undefined, result)
    })
  }

  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
    if ('number' !== typeof iterations)
      throw new TypeError('Iterations not a number')

    if (iterations < 0)
      throw new TypeError('Bad iterations')

    if ('number' !== typeof keylen)
      throw new TypeError('Key length not a number')

    if (keylen < 0)
      throw new TypeError('Bad key length')

    digest = digest || 'sha1'

    if (!Buffer.isBuffer(password)) password = new Buffer(password)
    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)

    var hLen, l = 1, r, T
    var DK = new Buffer(keylen)
    var block1 = new Buffer(salt.length + 4)
    salt.copy(block1, 0, 0, salt.length)

    for (var i = 1; i <= l; i++) {
      block1.writeUInt32BE(i, salt.length)

      var U = crypto.createHmac(digest, password).update(block1).digest()

      if (!hLen) {
        hLen = U.length
        T = new Buffer(hLen)
        l = Math.ceil(keylen / hLen)
        r = keylen - (l - 1) * hLen

        if (keylen > (Math.pow(2, 32) - 1) * hLen)
          throw new TypeError('keylen exceeds maximum length')
      }

      U.copy(T, 0, 0, hLen)

      for (var j = 1; j < iterations; j++) {
        U = crypto.createHmac(digest, password).update(U).digest()

        for (var k = 0; k < hLen; k++) {
          T[k] ^= U[k]
        }
      }

      var destPos = (i - 1) * hLen
      var len = (i == l ? r : hLen)
      T.copy(DK, destPos, 0, len)
    }

    return DK
  }

  return {
    pbkdf2: pbkdf2,
    pbkdf2Sync: pbkdf2Sync
  }
}

});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/pbkdf2.js", function(exports, module, require){
var pbkdf2Export = require("../../node-libs-browser/node_modules/pbkdf2-compat/pbkdf2.js")

module.exports = function (crypto, exports) {
  exports = exports || {}

  var exported = pbkdf2Export(crypto)

  exports.pbkdf2 = exported.pbkdf2
  exports.pbkdf2Sync = exported.pbkdf2Sync

  return exports
}

});

__tpack__.define("../../../node-libs-browser/node_modules/crypto-browserify/index.js", function(exports, module, require){
var rng = require("../../node-libs-browser/node_modules/crypto-browserify/rng.js")

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = require("../../node-libs-browser/node_modules/crypto-browserify/create-hash.js")

exports.createHmac = require("../../node-libs-browser/node_modules/crypto-browserify/create-hmac.js")

exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, new Buffer(rng(size)))
    } catch (err) { callback(err) }
  } else {
    return new Buffer(rng(size))
  }
}

function each(a, f) {
  for(var i in a)
    f(a[i], i)
}

exports.getHashes = function () {
  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160']
}

var p = require("../../node-libs-browser/node_modules/crypto-browserify/pbkdf2.js")(exports)
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync


// the least I can do is make error messages for the rest of the node.js/crypto api.
each(['createCredentials'
, 'createCipher'
, 'createCipheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDiffieHellman'
], function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

});

__tpack__.define("../../lib/builder.js", function(exports, module, require){
var process = __tpack__.require("process");
/**
 * @fileOverview 项目生成逻辑核心。
 */

var Path = require("path");
var FS = require("fs");
var IO = require("../../tutils/io.js");
var Lang = require("../../tutils/lang.js");

// #region Builder

/**
 * 表示一个项目生成器。
 * @param {Builder} [parentBuilder] 当前生成器的父级生成器。当前生成器将复制父级生成器的属性。
 * @class
 */
function Builder(parentBuilder) {
    if (parentBuilder) {
        this.parentBuilder = this.__proto__ = parentBuilder;
        this.rules = parentBuilder.rules.slice(0);
        this.ignores = parentBuilder.ignores.slice(0);
        this.cdnUrls = { __proto__: parentBuilder.cdnUrls };
        this.virtualPaths = { __proto__: parentBuilder.virtualPaths };
        this.messages = { __proto__: parentBuilder.messages };
        this.mimeTypes = { __proto__: parentBuilder.mimeTypes };
    } else {
        this.parentBuilder = null;
        this.rules = [];
        this.ignores = [];
        this.cdnUrls = { __proto__: null };
        this.virtualPaths = { __proto__: null };
        this.messages = { __proto__: null };
        try {
            this.mimeTypes = require("../../aspserver/configs.json").mimeTypes;
        } catch (e) {
            this.mimeTypes = { __proto__: null };
        }
    }
    this.files = { __proto__: null };
    this.errors = [];
    this.warnings = [];
}

// #region 日志等级

/**
 * 表示日志等级的枚举。
 * @enum
 */
Builder.LOG_LEVEL = {
    
    /**
     * 无日志。
     */
    none: 0,
    
    /**
     * 错误级别。
     */
    error: 1,
    
    /**
     * 警告级别。
     */
    warn: 2,
    
    /**
     * 成功级别。
     */
    success: 3,
    
    /**
     * 信息级别。
     */
    info: 4,
    
    /**
     * 普通级别。
     */
    log: 5

};

// #endregion

Builder.prototype = {
    
    // #region 核心
    
    constructor: Builder,
    
    /**
     * 存储当前生成器的源文件夹路径。
     * @type {String}
     */
    _srcPath: "",
    
    /**
     * 获取当前生成器的源文件夹路径。所有文件路径都相对此路径。
     * @type {String}
     */
    get srcPath() {
        return Path.resolve(this._srcPath);
    },
    
    /**
     * 设置当前生成器的源文件夹。所有文件路径都相对此路径。
     * @type {String}
     */
    set srcPath(value) {
        this._srcPath = value || "";
    },
    
    /**
     * 存储当前生成器的目标文件夹路径。
     * @type {String}
     */
    _destPath: "",
    
    /**
     * 获取当前生成器的目标文件夹路径。
     * @type {String}
     */
    get destPath() {
        return Path.resolve(this._destPath || this._srcPath);
    },
    
    /**
     * 设置当前生成器的目标文件夹路径。
     * @type {String}
     */
    set destPath(value) {
        this._destPath = value;
        // 由于目标文件夹被自动忽略，需要更新忽略列表。
        delete this.ignored;
    },
    
    /**
     * 获取或设置当前生成器读写文件使用的默认编码。
     */
    encoding: "utf-8",
    
    /**
     * 判断或设置是否启用生成器调试。
     * @type {Boolean}
     */
    verbose: false,
    
    /**
     * 将指定的绝对路径转为名称。
     * @param {String} path 要转换的路径。
     * @returns {String} 返回名称。格式如：“a/b.jpg”
     */
    toName: function (path) {
        return path ? Path.isAbsolute(path) ? Path.relative(this.srcPath, path).replace(/\\/g, "/") : path : null;
    },
    
    /**
     * 将指定的名称转为绝对路径。
     * @param {String} name 要转换的名称。
     * @returns {String} 返回绝对路径。格式如：“E:\www\a\b.jpg”
     */
    toPath: function (name) {
        return name ? Path.resolve(this._srcPath, name) : null;
    },
    
    /**
     * 获取当前生成器所有已忽略的路径。
     */
    ignores: null,
    
    /**
     * 判断指定文件或文件夹是否被忽略。
     * @param {String} name 要判断的文件或文件夹名称。
     * @returns {Boolean} 如果已忽略则返回 @true，否则返回 @false。
     */
    ignored: function (name) {
        var additionalIgnores = ["tpack.config.js"];
        
        // 自动忽略目标文件夹。
        if (!containsDir(this.destPath, this.srcPath)) {
            additionalIgnores.push(this.toName(this.destPath));
        }
        
        // 自动忽略 node 所在路径。
        if (process.argv[0]) {
            additionalIgnores.push(this.toName(process.argv[0]));
        }
        
        // 自动忽略当前执行的文件。
        if (process.argv[1]) {
            additionalIgnores.push(this.toName(process.argv[1]));
        }
        
        this.ignored = createNameFilter(this.ignores.concat(additionalIgnores));
        return this.ignored(name);
    },
    
    /**
     * 添加生成时忽略的文件或文件夹。
     * @param {String|RegExp|Function} ... 要忽略的文件或文件夹名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     */
    ignore: function () {
        this.ignores.push.apply(this.ignores, arguments);
        // 更新忽略列表。
        delete this.ignored;
    },
    
    /**
     * 获取当前生成器已定义的所有规则。
     * @type {Object}
     */
    rules: null,
    
    /**
     * 添加针对指定名称的处理规则。
     * @param {String|RegExp|Function|Null} ... 要处理的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {BuildRule} 返回一个处理规则，可针对此规则进行具体的处理方式的配置。
     */
    src: function () {
        var rule = new BuildRule(this, arguments);
        this.rules.push(rule);
        return rule;
    },
    
    /**
     * 遍历当前项目内所有未被忽略的文件并执行 @callback。
     * @param {Function} callback 要执行的回调。其参数为：
     * * @this {Builder} 当前生成器。
     * * @param {String} name 要处理文件的名称。
     */
    walk: function (callback) {
        var builder = this;
        IO.walkDir(this.srcPath, function (name, isDir) {
            // 判断路径是否被忽略。
            if (builder.ignored(name)) {
                return false;
            }
            if (!isDir) {
                callback.call(builder, name);
            }
        });
    },
    
    // #endregion
    
    // #region 日志功能
    
    /**
     * 获取或设置当前构建器的日志等级。
     * @type {Number}
     */
    logLevel: Builder.LOG_LEVEL.log,
    
    /**
     * 判断或设置是否启用颜色化输出。
     */
    coloredOutput: true,
    
    /**
     * 获取当前生成器累积的所有错误信息。
     */
    errors: null,
    
    /**
     * 获取当前生成器累积的所有警告信息。
     */
    warnings: null,
    
    /**
     * 存储所有信息对象。
     */
    messages: null,
    
    /**
     * 当被子类重写时，负责自定义输出日志的方式（如需要将日志保存为文件）。
     * @param {String} message 要输出的信息。 
     * @param {Number} logLevel 要输出的日志等级。
     */
    write: function (message, logLevel) {
        if (this.coloredOutput) {
            var formator = [0, '\033[49;31;1m*\033[0m', '\033[49;33;1m*\033[0m', '\033[49;32;1m*\033[0m', '\033[36m*\033[0m', 0, '\033[32m*\033[0m'][logLevel];
            if (formator) {
                message = formator.replace('*', message);
            }
        } else {
            message = message.replace(/\033\[[\d;]*?m/g, "");
        }
        return logLevel === Builder.LOG_LEVEL.error ? console.error(message) :
            logLevel === Builder.LOG_LEVEL.warn ? console.warn(message) :
            logLevel === Builder.LOG_LEVEL.info || logLevel === Builder.LOG_LEVEL.success ? console.info(message) :
            console.log(message);
    },
    
    /**
     * 打印一条普通日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    log: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.log) return;
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.log);
    },
    
    /**
     * 打印一条信息日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    info: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.info) return;
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.info);
    },
    
    /**
     * 打印一条警告日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    warn: function (message) {
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        this.warnings.push(message);
        return this.logLevel >= Builder.LOG_LEVEL.warn && this.write(message, Builder.LOG_LEVEL.warn);
    },
    
    /**
     * 打印一条错误日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    error: function (message) {
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        this.errors.push(message);
        return this.logLevel >= Builder.LOG_LEVEL.error && this.write(message, Builder.LOG_LEVEL.error);
    },
    
    /**
     * 打印一条成功日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    success: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.success) return;
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.success);
    },
    
    /**
     * 打印一条调试信息。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    debug: function (message) {
        if (!this.verbose) return;
        message = this.messages[message] || String(message);
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.log);
    },
    
    // #endregion
    
    // #region 生成底层
    
    /**
     * 获取当前生成的次数。
     */
    counter: 0,
    
    /**
     * 获取当前成功保存的文件数。
     */
    savedFileCount: 0,
    
    /**
     * 创建一个新的执行上下文。
     */
    newContext: function () {
        this.counter++;
        this.files = { __proto__: null };
        this.errors.length = this.warnings.length = this.savedFileCount = 0;
        this._context = null;
    },
    
    /**
     * 创建一个文件对象。
     * @param {String} name 要创建的文件名称。
     * @param {String} [content] 如果是虚拟文件，则手动指定文件的内容。
     * @returns {BuildFile} 返回创建的文件对象。
     */
    createFile: function (name, content) {
        return new BuildFile(this, name, content);
    },
    
    /**
     * 使用当前设置的规则处理指定的文件。
     * @param {BuildFile} file 要处理的文件。
     */
    processFile: function (file) {
        
        if (this.verbose && !file.isGenerated) {
            this.info("> {0}", file.srcPath);
        }
        
        // 依次执行所有规则。
        for (var i = 0; i < this.rules.length; i++) {
            var rule = this.rules[i];
            
            // 跳过一次性任务，检查匹配性。
            if (rule.runOnce || rule.match(file.name) === null) {
                continue;
            }
            
            // 处理文件。
            this.processFileWithRule(file, rule);
        }
    },
    
    /**
     * 使用指定的规则处理指定的文件。
     * @param {BuildFile} file 要处理的文件。
     * @param {BuildRule} rule 要使用的规则。
     */
    processFileWithRule: function (file, rule) {
        
        // 标记文件已处理。
        file.processed = true;
        
        // 根据当前规则更新文件的最终内容。
        for (var i = 0; i < rule.processors.length; i++) {
            
            // 生成配置。
            var options = rule.processorOptions[i];
            options = options == null ? {} : Object.clone(options);
            
            // 执行处理器。
            var result;
            if (this.verbose) {
                result = rule.processors[i].call(rule, file, options, this);
            } else {
                try {
                    result = rule.processors[i].call(rule, file, options, this);
                } catch (e) {
                    this.error("{0}: Uncaught error: {1}", file.srcName || "#Rule " + (this.rules.indexOf(rule) + 1), e.message);
                }
            }
            
            // 保存结果。
            if (result !== undefined) {
                file.content = result;
            }
        }

    },
    
    /**
     * 获取指定名称对应的文件实例。
     * @param {String} name 要获取的文件名称。
     * @returns {BuildFile} 返回对应的文件实例。如果文件不存在则返回 @null。 
     */
    getFile: function (name) {
        var file = this.files[name];
        if (!file) {
            this.files[name] = file = this.createFile(name);
            this.processFile(file);
        }
        return file;
    },
    
    /**
     * 执行所有一次性的任务。
     */
    runRunOnceRules: function () {
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i].runOnce) {
                this.debug("> Executing Rule {0}", i);
                var file = this.createFile("", "");
                this.processFileWithRule(file, this.rules[i]);
                file.save();
            }
        }
    },
    
    // #endregion
    
    // #region 对外接口
    
    /**
     * 使用当前设置的规则生成指定的文件。
     * @param {String} name 要生成的文件名称。
     * @returns {BuildFile} 返回生成的文件对象。
     */
    buildFile: function (name) {
        this.newContext();
        var file = this.files[name] = this.createFile(name);
        this.processFile(file);
        file.save();
        return file;
    },
    
    /**
     * 使用当前设置的规则生成指定的文件。
     * @param {String|RegExp|Function} ... 要生成的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {} 
     */
    build: function () {
        this.newContext();
        
        // 过滤器。
        var filter = arguments.length && createNameFilter(arguments);
        
        this.walk(function (name) {
            if (!filter || filter.call(this, name)) {
                this.getFile(name).save();
            }
        });
        return this.savedFileCount;
    },
    
    /**
     * 使用当前设置的规则生成整个项目。
     * @param {Boolean} [clean] 指示是否在生成前清理文件夹。默认为自动清理。
     * @returns {Number} 返回本次最终生成的文件数。 
     */
    buildAll: function (clean) {
        
        // 准备工作。
        this.info("> Start Building...");
        this.info("> {srcPath} => {destPath}", this);
        this.newContext();
        
        if (clean == null ? !containsDir(this.destPath, this.srcPath) : clean) {
            this.debug("> Cleaning...", this);
            try {
                IO.cleanDir(this.destPath);
            } catch (e) {
            }
        }
        
        // 生成所有文件。
        this.debug("> Processing Files...", this);
        this.walk(function (name) {
            this.getFile(name).save();
        });
        
        // 执行一次性规则。
        this.runRunOnceRules();
        
        // 输出结果。
        var savedFileCount = this.savedFileCount;
        var errorCount = this.errors.length;
        if ((this.logLevel >= Builder.LOG_LEVEL.log && savedFileCount > 0) || errorCount > 0) {
            this.info("> {srcPath} => {destPath}", this);
        }
        if (errorCount) {
            this.error("> Build Completed! ({0} files saved, {1} error(s) found)", savedFileCount, errorCount);
        } else {
            this.success("> Build Success! ({0} files saved, without errors)", savedFileCount, errorCount);
        }
        
        return savedFileCount;
    },
    
    /**
     * 监听当前项目的改动并实时生成。
     * @param {String|RegExp|Function} ... 要监听的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {Watcher} 返回监听器。
     */
    watch: function () {
        var builder = this;
        
        // 监听的规则。
        var filter = arguments.length && createNameFilter(arguments);
        
        var watcher = require("../../chokidar/index.js").watch(this.srcPath).on('change', function (path) {
            builder.buildFile(builder.toName(path));
        });
        
        // 忽略不需要生成的文件以提高性能。
        watcher._isIgnored = function (path, stats) {
            
            var name = builder.toName(path);
            
            if ((filter && !filter.call(builder, name)) || builder.ignored(name)) {
                return true;
            }
            
            // 如果源文件夹和目标文件夹不同，则监听所有文件并拷贝。
            // 否则只需监听含规则的文件。
            if (builder.srcPath !== builder.destPath) {
                return false;
            }
            
            // 文件夹一定监听。
            if (!stats || stats.isDirectory()) {
                return false;
            }
            
            // 符合任一规则才监听。
            for (var i = 0; i < builder.rules.length; i++) {
                if (!builder.rules[i].runOnce && builder.rules[i].match(name) !== null) {
                    return false;
                }
            }
            
            return true;
        };
        
        this.info("> Watching {srcPath} ...", this);
        return watcher;

    },
    
    // #endregion
    
    // #region 服务器
    
    /**
     * 启用可在响应时自动处理当前规则的服务器。
     * @param {String|Number} port 服务器地址或端口。 
     * @returns {HttpServer} 返回服务器对象。
     */
    startServer: function (port) {
        var builder = this;
        var server = new (require("../../aspserver/lib/index.js").HttpServer)({
            port: port,
            physicalPath: this.srcPath,
            modules: {
                buildModule: {
                    processRequest: function (context) {
                        
                        var name = context.request.path.slice(1);
                        
                        // 生成当前请求相关的文件。
                        var file = builder.createFile(name);
                        if (file.exists) {
                            builder.processFile(file);
                        } else {
                            // 目标文件可能是生成的文件。
                            for (var key in builder.files) {
                                if (builder.files[key].destName === name) {
                                    file = builder.files[key];
                                    break;
                                }
                            }
                        }
                        
                        // 如果当前路径被任一规则处理，则响应处理后的结果。
                        if (file.processed) {
                            context.response.contentType = server.mimeTypes[file.extension];
                            
                            if (file.hasPlaceholder) {
                                context.response.write(file.replacePlaceholder(function (name) {
                                    if (/^\./.test(name)) {
                                        return "file:///" + builder.toPath(name).replace(/\\/g, "/");
                                    }
                                    return this.relativePath(name);
                                }));
                            } else {
                                context.response.write(file.data);
                            }
                            
                            context.response.end();
                            return true;
                        }
                        
                        return false;
                    }
                }
            },
            handlers: {
                ".bat": {
                    processRequest: function (context) {
                        var Process = require("child_process");
                        var HttpUtility = require("../../aspserver/lib/httputility.js");
                        
                        var args = [];
                        for (var key in context.request.queryString) {
                            if (context.request.queryString[key]) {
                                args.push("-" + key);
                                args.push(context.request.queryString[key]);
                            } else {
                                args.push(key);
                            }
                        }
                        
                        var p = Process.execFile(context.request.physicalPath, args, { cwd: Path.dirname(context.request.physicalPath) });
                        
                        context.response.contentType = 'text/html;charset=utf-8';
                        context.response.bufferOutput = false;
                        context.response.write('<!doctype html>\
		<html>\
		<head>\
		<title>正在执行 ');
                        
                        context.response.write(HttpUtility.htmlEncode(context.request.physicalPath));
                        
                        context.response.write('</title>\
		</head>\
		<body style="font-family: Monaco, Menlo, Consolas, Courier New, monospace; color:#ececec; background: ' + (context.request.queryString.background || "black") + ';">');
                        
                        context.response.write('<pre>');
                        
                        var scrollToEnd = context.request.queryString.scroll !== false ? "<script>window.scrollTo(0, document.body.offsetHeight);</script>" : "";
                        
                        p.stdout.on('data', function (data) {
                            context.response.write(controlColorToHtml(data));
                            if (data.indexOf('\r') >= 0 || data.indexOf('\n') >= 0) {
                                context.response.write(scrollToEnd);
                            }
                        });
                        
                        p.stderr.on('data', function (data) {
                            context.response.write('<span style="color:red">');
                            context.response.write(controlColorToHtml(data));
                            context.response.write('</span>');
                            if (data.indexOf('\r') >= 0 || data.indexOf('\n') >= 0) {
                                context.response.write(scrollToEnd);
                            }
                        });
                        
                        p.on('exit', function (code) {
                            context.response.write('</pre><p><strong>执行完毕!</strong></p>' + scrollToEnd);
                            context.response.write('<script>document.title=document.title.replace("正在执行", "执行完毕：")</script>');
                            context.response.write('</body></html>');
                            
                            context.response.end();
                        });
                        
                        function controlColorToHtml(data) {
                            var Colors = {
                                '30': ['black', '#1a1a1a', '#333333'],
                                '31': ['red', '#ff3333', '#ff6666'],
                                '32': ['green', '#00b300', '#00e600'],
                                '33': ['yellow', '#ffff33', '#ffff66'],
                                '34': ['blue', '#3333ff', '#6666ff'],
                                '35': ['magenta', '#ff33ff', '#ff66ff'],
                                '36': ['cyan', '#33ffff', '#66ffff'],
                                '37': ['lightgray', '#ececec', '#ffffff'],
                            }
                            
                            return HttpUtility.htmlEncode(data).replace(/\033\[([\d;]*)m/g, function (all, c) {
                                if (c === '0') {
                                    return '</span>';
                                }
                                
                                c = c.split(';');
                                
                                var bold = c.indexOf('1') >= 0;
                                var lighter = c.indexOf('2') >= 0;
                                var underline = c.indexOf('4') >= 0;
                                var blackground = c.indexOf('7') >= 0;
                                
                                var color;
                                for (var key in Colors) {
                                    if (c.indexOf(key) >= 0) {
                                        color = Colors[key][bold ? 0 : lighter ? 2 : 1];
                                        break;
                                    }
                                }
                                
                                var span = '<span style="';
                                
                                if (blackground) {
                                    span += "background: ";
                                } else {
                                    span += "color: ";
                                }
                                span += color;
                                
                                if (underline) {
                                    span += "; text-decoration: underline;";
                                }
                                
                                span += '">';
                                
                                return span;
                            });
                        }
                        
                        return true;

                    }
                }
            },
            mimeTypes: this.mimeTypes
        });
        
        server.on('start', function () {
            builder.info("> Server Running At {rootUrl}", this);
        });
        
        server.on('stop', function () {
            builder.info("> Server Stopped At {rootUrl}", this);
        });
        
        server.on('error', function (e) {
            if (e.code === 'EADDRINUSE') {
                builder.error(this.address && this.address !== '0.0.0.0' ? 'Create Server Error: Port {port} of {address} is used by other programs.' : 'Create Server Error: Port {port} is used by other programs.', this);
            } else {
                builder.error(e.toString());
            }
        });
        
        server.start();
        
        return server;
    },
    
    // #endregion
    
    // #region 插件支持
    
    /**
     * 添加一个已生成的文件。
     * @param {String} name 生成的文件名。
     * @param {String} content 生成的文件的内容。
     * @returns {BuildFile} 返回文件对象。
     */
    addFile: function (name, content) {
        var file = this.createFile("", content);
        file.name = name;
        file.save();
        return file;
    },
    
    /**
     * 获取项目里的文件列表。
     * @param {String|RegExp|Function} ... 要获取的文件或文件夹路径。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {Array} 返回名称数组。
     */
    getFiles: function () {
        if (arguments.length === 0) {
            var result = [];
            this.walk(function (name) {
                result.push(name);
            });
            return result;
        }
        return new BuildRule(this, arguments).getFiles();
    },
    
    /**
     * 获取存储当前生成信息的上下文对象。
     * @returns {Object} 
     */
    getContext: function () {
        return this._context || (this._context = {});
    },
    
    /**
     * 获取或设置所有需要上传到 CDN 的路径。
     * @name cdnUrls
     * @example 如：{"assets/": "http://cdn.com/assets/"} 表示路径 assets/ 最终将发布到 http://cdn.com/assets/。
     */
    cdnUrls: null,
    
    /**
     * 添加一个名称发布后对应的 CDN 地址。
     * @param {String} name 要添加的文件夹名称。
     * @param {String} url 设置该 CDN 的地址。
     * @example builder.addCdn("assets", "http://cdn.com/assets");
     */
    addCdnUrl: function (name, url) {
        this.cdnUrls[appendSlash(name.toLowerCase())] = appendSlash(url);
    },
    
    /**
     * 获取或设置所有虚拟路径。
     * @name virtualPaths
     * @example 如：{"/": "../"} 表示地址 / 映射到 ../ 所在目录。
     */
    virtualPaths: null,
    
    /**
     * 添加一个虚拟地址。
     * @param {String} name 要添加的虚拟网址名。
     * @param {String} path 要添加的虚拟网址实际地址名。
     * @example builder.addVirtualPath("assets", "assets");
     */
    addVirtualPath: function (name, path) {
        this.virtualPaths[appendSlash(name.toLowerCase()).replace(/^[^\/]/, "/$&")] = Path.resolve(path);
    },
    
    /**
     * 根据 MIME 类型获取扩展名。
     * @param {String} mimeType 要获取的 MIME 类型。
     * @returns {String} 返回扩展名。
     */
    getExtByMimeType: function (mimeType) {
        for (var ext in this.mimeTypes) {
            if (this.mimeTypes[ext] === mimeType) {
                return ext;
            }
        }
        return '.' + mimeType.replace(/^.*\//, '');
    },
    
    /**
     * 根据扩展名获取 MIME 类型。
     * @param {String} ext 要获取扩展名。
     * @returns {String} 返回  MIME 类型。
     */
    getMimeTypeByExt: function (ext) {
        return this.mimeTypes[ext] || ext.replace('.', 'application/x-');
    }

    // #endregion

};

module.exports = Builder;

// #endregion

// #region BuildFile

/**
 * 表示一个生成文件。一个生成文件可以是一个物理文件或虚拟文件。
 * @param {Builder} builder 当前文件所属的生成器。
 * @param {String} [name] 当前文件的名称。
 * @param {String|Buffer} [content] 当前文件的内容。如果为 @undefined 则从路径读取。
 * @class
 */
function BuildFile(builder, name, content) {
    this.builder = builder;
    this.destName = this.srcName = name;
    if (content != null) {
        this.content = content;
    }
}

BuildFile.prototype = {
    
    // #region 核心
    
    __proto__: require("events").EventEmitter.prototype,
    
    constructor: BuildFile,
    
    /**
     * 获取当前文件所属的生成器。
     * @type {Builder}
     */
    builder: null,
    
    /**
     * 获取当前文件的源名称。
     * @type {String}
     */
    srcName: "",
    
    /**
     * 获取当前文件的源路径。
     * @type {String}
     */
    get srcPath() {
        return this.srcName ? Path.resolve(this.builder.srcPath, this.srcName) : null;
    },
    
    /**
     * 获取当前文件的目标名称。
     * @type {String}
     */
    destName: "",
    
    /**
     * 获取当前文件的目标路径。
     * @type {String}
     */
    get destPath() {
        return this.destName ? Path.resolve(this.builder.destPath, this.destName) : null;
    },
    
    /**
     * 获取当前文件的最终保存名称。
     * @type {String}
     */
    get name() {
        return this.destName;
    },
    
    /**
     * 设置当前文件的最终保存名称。
     * @type {String}
     */
    set name(value) {
        if (this.destName) {
            this.prevName = this.destName;
        }
        this.destName = value || null;
        this.emit('rename');
    },
    
    /**
     * @event rename
     * 当当前文件路径被改变时执行。
     */
    
    /**
     * 获取当前文件的最终保存路径。
     */
    get path() {
        return this.destPath;
    },
    
    /**
     * 设置当前文件的最终保存路径。
     */
    set path(value) {
        this.name = this.builder.toName(value);
    },
    
    /**
     * 当前文档的数据。
     */
    _data: null,
    
    /**
     * 标记内容已更新。
     */
    _changed: false,
    
    /**
     * 获取当前文件的最终保存文本内容。
     * @type {String}
     */
    get content() {
        if (this._data == null) {
            this._data = this.load(this.builder.encoding);
        } else if (typeof this._data !== "string") {
            this._data = this._data.toString(this.builder.encoding);
        }
        return this._data;
    },
    
    /**
     * 设置当前文件的最终保存文本内容。
     * @type {String}
     */
    set content(value) {
        this._data = value;
        this._changed = true;
        this.emit('change');
    },
    
    /**
     * 获取当前文件的最终保存二进制内容。
     * @type {Buffer}
     */
    get buffer() {
        if (this._data == null) {
            this._data = this.load();
        } else if (!(this._data instanceof Buffer)) {
            this._data = new Buffer(this._data);
        }
        return this._data;
    },
    
    /**
     * 设置当前文件的最终保存二进制内容。
     * @type {Buffer}
     */
    set buffer(value) {
        this._data = value;
        this._changed = true;
        this.emit('change');
    },
    
    /**
     * @event change
     * 当当前文件内容被改变时执行。
     */
    
    /**
     * 获取当前文件的数据。
     * @type {Buffer|String} 返回二进制或文本数据。
     */
    get data() {
        return this._data != null ? this._data : this.content;
    },
    
    /**
     * 获取当前文件的源文件夹路径。
     * @type {String}
     */
    get srcDirPath() {
        return Path.dirname(this.srcPath);
    },
    
    /**
     * 获取当前文件的目标文件夹路径。
     * @type {String}
     */
    get destDirPath() {
        return Path.dirname(this.destPath);
    },
    
    /**
     * 判断当前文件是否是生成的文件。
     * @type {Boolean}
     */
    get isGenerated() {
        return !this.srcName;
    },
    
    /**
     * 获取当前文件的扩展名。
     * @type {String}
     */
    get extension() {
        return Path.extname(this.destName || this.prevName || this.srcName);
    },
    
    /**
     * 判断当前文件是否实际存在。
     * @type {Buffer}
     */
    get exists() {
        return this.srcName && IO.existsFile(this.srcPath);
    },
    
    /**
     * 判断当前文件是否需要保存。
     * @type {Boolean}
     */
    get canSave() {
        return !!this.destName && containsDir(this.builder.destPath, this.destPath);
    },
    
    /**
     * @event load
     * 当当前文件被加载时执行。
     */
    
    /**
     * 从硬盘载入当前文件的内容。
     * @param {String} [encoding] 解析文本内容的编码。
     * @return {String|Buffer} 如果指定了编码则返回文件文本内容，否则返回文件数据。
     */
    load: function (encoding) {
        this.emit('load');
        if (this.srcName) {
            var srcPath = this.srcPath;
            try {
                return encoding ? IO.readFile(srcPath, encoding) : IO.existsFile(srcPath) ? FS.readFileSync(srcPath) : new Buffer(0);
            } catch (e) {
                this.builder.error("{0}: Cannot Read File: {1}", srcPath, e);
            }
        }
        return "";
    },
    
    /**
     * @event save
     * 当当前文件被保存时执行。
     */
    
    /**
     * 保存当前文件。
     * @param {String} [name] 设置保存的名字。
     * @return {Boolean} 如果成功保存则返回 @true，否则返回 @false。
     */
    save: function (name) {
        
        // 默认保存到设置的位置。
        name = name || this.destName;
        
        // 如果目标名称为 null，表示删除文件。
        if (!name) {
            return false;
        }
        
        // 获取目标保存路径。
        var destPath = Path.resolve(this.builder.destPath, name);
        
        // 忽略项目外的文件夹。
        if (!containsDir(this.builder.destPath, destPath)) {
            return false;
        }
        
        // 内容发生改变则存储文件。
        if (this._changed || this.hasPlaceholder) {
            this.builder.log(this.srcName === name ? "> M {0}" : this.srcName ? "> M {0} => {1}" : "> A {1}", this.srcName, name);
            try {
                IO.ensureDir(destPath);
                if (this.hasPlaceholder) {
                    FS.writeFileSync(destPath, this.replacePlaceholder(this.relativePath), this.builder.encoding);
                } else if (this._data instanceof Buffer) {
                    FS.writeFileSync(destPath, this._data);
                } else {
                    FS.writeFileSync(destPath, this._data, this.builder.encoding);
                }
                this.builder.savedFileCount++;
            } catch (e) {
                this.builder.error("{0}: Cannot Write File: {1}", name, e);
                return false;
            }
            this.emit('save', name);
            return true;
        }
        
        // 仅路径改变则简单复制文件。
        var srcPath = this.srcPath;
        if (srcPath !== destPath) {
            this.builder.log(this.srcName === this.destName ? "> C {1}" : "> C {0} => {1}", this.srcName, this.destName);
            try {
                IO.copyFile(srcPath, destPath);
                this.builder.savedFileCount++;
            } catch (e) {
                this.builder.error("{0}: Cannot Copy File: {1}", name, e);
                return false;
            }
            this.emit('save', name);
            return true;
        }
        
        return false;
    },
    
    valueOf: function () {
        return this.srcPath;
    },
    
    toString: function () {
        return this.content;
    },
    
    // #endregion
    
    // #region 插件支持
    
    /**
     * 判断或设置当前文件是否存在错误。
     */
    hasError: false,
    
    /**
     * 添加当前文件生成时发生的错误。并将错误信息追加到文件内部。
     * @param {String} title 错误的标题。
     * @param {Error} [error] 错误的详细信息。
     * @param {String} [message] 指定错误的信息。
     * @param {String} [path] 指定发生错误的位置。
     * @param {Number} [line] 错误的行号。
     * @param {Number} [column] 错误的列号。
     * @param {String} [code] 错误的代码。
     */
    addError: function (title, error, message, path, line, column, code) {
        
        this.hasError = true;
        
        // 填充参数信息。
        error = error || title;
        if (message == null) message = error.message || error.toString();
        if (path == null) path = error.filename ? this.builder.toName(error.filename, 'src') : this.srcName;
        else path = this.builder.toName(path, 'src');
        if (line == null) line = error.line;
        if (column == null) line = error.column;
        
        // 整合行号信息。
        if (line != null) {
            path += '(' + line;
            if (column != null) {
                path += ', ' + column;
            }
            path += ')';
        }
        
        // 报告错误。
        this.builder.error("{0}: {1}: {2}", path, title, message);
        
        // 文本文件追加错误信息。
        if (typeof this._data === "string") {
            this.content = String.format("/*\r\n\
\r\n\
\t{0}: \r\n\
\t\t{1}\r\n\
\t\tAt {2)\r\n\
\r\n\
*/\r\n\r\n", title, message, path) + this.content;
        };
        
        if (code) {
            this.builder.write(code, Builder.LOG_LEVEL.log);
        }
        
        // 调试时输出错误信息。
        if (this.builder.verbose) {
            var details = error.stack || error.details;
            details && this.builder.debug(details);
        }

    },
    
    /**
     * 获取配置中的源码表的配置。
     * @param {Object} options 用户传递的原始配置对象。
     * @returns {Object} 返回源码表的配置。
     */
    getSourceMapOptions: function (options) {
        
        // 优先级：options.sourceMap > this.sourceMapOptions > this.builder.sourceMap
        if (this.sourceMapOptions && !options.sourceMap) {
            return this.sourceMapOptions;
        }
        
        // 支持从 builder.sourceMap 获取统一配置。
        options = options.sourceMap || this.builder.sourceMap;
        if (!options) {
            return null;
        }
        
        var file = this;
        return this.sourceMapOptions = {
            __proto__: typeof options === "object" ? options : null,
            relative: (typeof options === "string" ? options : options.path || "$0.map").replace(/\$0/g, Path.basename(this.destPath)),
            get name() {
                return Path.join(Path.dirname(file.name), this.relative).replace(/\\/g, "/");
            },
            get path() {
                return Path.resolve(Path.dirname(file.path), this.relative);
            },
            get data() {
                if (typeof this._data === "string") {
                    this._data = JSON.parse(this._data);
                }
                return this._data;
            },
            set data(value) {
                this._data = value;
            },
            get content() {
                if (typeof this._data !== "string") {
                    this._data = JSON.stringify(this._data);
                }
                return this._data;
            },
            set content(value) {
                this._data = value;
            }
        };
    },
    
    /**
     * 保存生成的源码表。
     * @param {String} sourceMap 源码表的内容。
     */
    saveSourceMap: function (sourceMap) {
        if (!sourceMap) return;
        
        // 自动生成 sourceMap 配置。
        var sourceMapOptions = this.sourceMapOptions || this.getSourceMapOptions({ sourceMap: true });
        
        sourceMapOptions.data = sourceMap;
        
        // 将 sourceMap 中路径转为绝对路径。
        var sourceMapDir = Path.dirname(sourceMapOptions.path);
        sourceMapOptions.data.sources = sourceMapOptions.data.sources.map(function (soruce) {
            return Path.join(sourceMapDir, soruce);
        });
        
        // 在文件保存时生成 source-map。
        if (!this._hasSourceMap) {
            this._hasSourceMap = true;
            this.on('save', function () {
                
                // 将 sourceMap 中路径转为相对路径。
                var sourceMapDir = Path.dirname(sourceMapOptions.path);
                sourceMapOptions.data.file = Path.relative(sourceMapDir, this.destPath).replace(/\\/g, "/");
                sourceMapOptions.data.sources = sourceMapOptions.data.sources.map(function (soruce) {
                    return Path.relative(sourceMapDir, soruce).replace(/\\/g, "/");
                });
                
                this.builder.addFile(sourceMapOptions.name, sourceMapOptions.content);
            });
        }

    },
    
    /**
     * 判断当前文件是否符合指定的模式表达式。
     * @param {String|RegExp|Function|Null} ... 要判断的过滤器。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {Boolean} 
     */
    match: function () {
        return createNameRouter(arguments).call(this.builder, this.srcName) !== null;
    },
    
    /**
     * 获取指定相对路径表示的实际路径。
     * @param {String} relativePath 要处理的相对路径。如 ../a.js
     */
    resolvePath: function (relativePath) {
        
        // / 开头表示跟地址。
        if (/^\//.test(relativePath)) {
            var pl = relativePath.toLowerCase();
            for (var vp in this.builder.virtualPaths) {
                if (pl.startsWith(vp)) {
                    return Path.resolve(this.builder.virtualPaths[vp], relativePath.substr(vp.length));
                }
            }
            return Path.join(this.builder.srcPath + relativePath);
        }
        
        return Path.join(this.srcDirPath, relativePath || "");
    },
    
    /**
     * 获取指定相对路径表示的实际名称。
     * @param {String} relativePath 要处理的相对路径。如 ../a.js
     */
    resolveName: function (relativePath) {
        return this.builder.toName(this.resolvePath(relativePath), 'src');
    },
    
    /**
     * 判断当前文件内容是否存在路径占位符。
     */
    hasPlaceholder: false,
    
    /**
     * 在当前文件内创建引用指定路径所使用的占位符。
     * @param {String} name 占位符的路径。
     * @remark
     * 由于发布过程中文件可能发生改变，文件内部的相对路径或内联部分可能因此而失效。
     * 因此为了方便程序处理，在解析文件时将文件内的依赖部分设置为占位符，
     * 在文件真正保存前才替换回相对路径。
     */
    createPlaceholder: function (name) {
        this.hasPlaceholder = true;
        return "tpack://" + (name || "") + "?";
    },
    
    /**
     * 替换当前文件中的路径占位符。
     * @param {Function} placeholderReplacer 计算占位符实际使用路径的回调函数。
     * @returns {String} 返回已去除占位符的内容。 
     */
    replacePlaceholder: function (placeholderReplacer) {
        var file = this;
        return this.content.replace(/tpack:\/\/(.*?)\?/g, function (all, name) {
            return placeholderReplacer.call(file, name);
        });
    },
    
    /**
     * 获取在当前文件内引用指定名称所使用的相对路径。
     * @param {String} name 要处理的名称。如 styles/test.css（注意不能是绝对路径）
     */
    relativePath: function (name) {

        name = name || "";
        
        // 判断 name 是否需要发布到 CDN。
        var nameLower = name.toLowerCase();
        for (var cdnPrefix in this.builder.cdnUrls) {
            if (nameLower.startsWith(cdnPrefix)) {
                return this.builder.cdnUrls[cdnPrefix] + name.substr(cdnPrefix.length);
            }
        }
        
        // 将路径转为当前目标路径的绝对路径。
        return Path.relative(Path.dirname(this.destName), name).replace(/\\/g, '/');
    },
    
    /**
     * 根据当前文件的信息填入指定的字符串。
     * @param {String} name 要填入的字符串。
     * @returns {String} 
     */
    formatName: function (name) {
        name = name || "";
        var file = this;
        return name.replace(/\<(\w+)\>/g, function (all, tagName) {
            
            if (tagName === "date") {
                tagName = "yyyyMMdd";
            } else if (tagName === "time") {
                tagName = "yyyyMMddHHmmss";
            }
            
            if (/(yyyy|MM|dd|HH|mm|ss)/.test(tagName)) {
                var date = new Date();
                tagName = tagName.replace(/yyyy/g, date.getFullYear())
                    .replace(/MM/g, padZero(date.getMonth() + 1))
                    .replace(/dd/g, padZero(date.getDate()))
                    .replace(/HH/g, padZero(date.getHours()))
                    .replace(/mm/g, padZero(date.getMinutes()))
                    .replace(/ss/g, padZero(date.getSeconds()));
            }
            
            if (/md5/i.test(tagName)) {
                var md5 = file.getMd5();
                tagName = tagName.replace(/md5\D(\d+)/g, function (all, num) {
                    return md5.substr(0, +num);
                }).replace(/md5/g, md5).replace(/MD5\D(\d+)/g, function (all, num) {
                    return md5.substr(0, +num).toUpperCase();
                }).replace(/MD5/g, function () {
                    return md5.toUpperCase();
                });
            }
            
            return tagName;
        });
    },
    
    /**
     * 计算当前文件内容的 MD5 值。
     * @returns {String} 返回小写字母组成的 MD5 值。
     */
    getMd5: function () {
        var md5sum = require("crypto").createHash('md5');
        md5sum.update(this.data);
        return md5sum.digest('hex');
    },
    
    /**
     * 获取通过 Base64 编码获取当前资源的地址。
     * @returns {String} 返回 Base64 编码的地址。 
     */
    getBase64Url: function () {
        return 'data:' + this.builder.getMimeTypeByExt(this.extension) + ';base64,' + this.buffer.toString('base64');
    }

    // #endregion

};

exports.BuildFile = BuildFile;

// #endregion

// #region BuildRule

/**
 * 表示一个生成规则。
 * @param {Builder} builder 当前规则所属的生成器。
 * @param {Array} filters 当前规则的过滤器数组。
 * @class
 */
function BuildRule(builder, filters) {
    this.builder = builder;
    this.filters = Array.prototype.slice.call(filters);
    this._router = createNameRouter(this.filters);
    this.ignores = [];
    this.processors = [];
    this.processorOptions = [];
}

BuildRule.prototype = {
    
    // #region 核心
    
    constructor: BuildRule,
    
    /**
     * 判断当前规则是否是一次性规则。
	 * @type {Boolean}
     */
    get runOnce() {
        return this.filters.length === 0;
    },
    
    /**
     * 为当前规则添加一个忽略项。
     * @param {String|RegExp|Function|Null} ... 要忽略的文件或文件夹路径。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns this 
     */
    ignore: function () {
        this.ignores.push.apply(this.ignores, arguments);
        delete this.ignored;
        return this;
    },
    
    /**
     * 为当前规则添加一个处理器。
     * @param {Function} processor 要追加的处理器。
     * @param {Object} [processorOptions] 传递给处理器的配置对象。
     * @returns this 
     */
    pipe: function (processor, processorOptions) {
        // 只执行一次则直接创建为一次性的规则。
        if (processor.runOnce && !this.runOnce) {
            
            // 加入新的一次性规则。
            var newRule = this.builder.src().pipe(processor, processorOptions);
            newRule.files = [];
            
            // 原规则加入一个负责收集文件的处理器。
            this.pipe(function (file) {
                newRule.files.push(file);
            });
            
            return newRule;
        }
        this.processors.push(processor);
        this.processorOptions.push(processorOptions);
        return this;
    },
    
    /**
     * 设置当前规则的目标路径。
     * @param {String} name 要设置的目标路径。目标路径可以是字符串（其中 $N 表示匹配的模式)。
     * @returns this
     */
    dest: function (name) {
        
        // 目标为空。
        if (name == null) {
            return this.pipe(function (file) {
                file.name = '';
            });
        }
        
        // 目标为含特殊标记的名字。
        name = name.replace(/^\//, "");
        if (/<\w+>/.test(name)) {
            return this.pipe(function (file) {
                var targetName = file.formatName(name);
                file.name = this.match(file.name, targetName) || targetName;
            });
        }
        
        // 目标为普通文件名。
        return this.pipe(function (file) {
            file.name = this.match(file.name, name) || name;
        });

    },
    
    /**
     * 保存文件的当前状态。
     * @param {String} [name] 保存的名称。
     * @returns this
     */
    save: function (name) {
        return this.pipe(function (file) {
            file.save(name);
        });
    },
    
    // #endregion
    
    // #region 对外接口
    
    /**
     * 判断指定文件或文件夹是否被忽略。
     * @param {String} name 要判断的文件或文件夹名称。
     * @returns {Boolean} 如果已忽略则返回 @true，否则返回 @false。
     */
    ignored: function (name) {
        if (!this.ignores.length) {
            return false;
        }
        this.ignored = createNameFilter(this.ignores);
        return this.ignored(name);
    },
    
    /**
     * 使用当前规则匹配指定的名称返回匹配的结果。
     * @param {String} srcName 要匹配的源名称。
     * @param {String} [destName] 要匹配的目标名称。
     * @return {String} 如果匹配返回当前规则设置的目标名称。否则返回 @null。
     */
    match: function (srcName, destName) {
        return this.ignored(srcName) ? null : this._router(srcName, destName);
    },
    
    /**
     * 判断当前规则是否符合指定名称。
     * @param {String} name 要判断的名称。
     * @returns {Boolean} 如果匹配则返回 @true，否则返回 @false。
     */
    test: function (name) {
        return this.match(name) !== null;
    },
    
    /**
     * 获取匹配当前规则的所有文件。
     * @returns {Array} 返回文件名称数组。
     */
    getFiles: function () {
        var result = [];
        var rule = this;
        this.builder.walk(function (name) {
            if (rule.match(name) !== null) {
                result.push(name);
            }
        });
        return result;
    },

    // #endregion

};

exports.BuildRule = BuildRule;

// #endregion

// #region 工具函数

/**
 * 对齐十位。
 */
function padZero(val) {
    return val < 10 ? '0' + val : val;
}

/**
 * 判断一个父文件夹是否包含指定子文件夹。
 * @param {String} parent 父文件夹路径。
 * @param {String} child 子文件夹路径。
 * @returns {Boolean} 
 */
function containsDir(parent, child) {
    return child.toLowerCase().startsWith(parent.toLowerCase());
}

/**
 * 为路径末尾追加 /。
 * @param {String} path 要处理的路径。
 * @returns {String} 
 */
function appendSlash(path) {
    return path.endsWith("/") ? path : (path + "/");
}

/**
 * 判断一个名称是否表示特定的文件。
 * @param {String|Array} name 要判断的名称或数组。
 * @returns {Boolean} 
 */
function isSpecifiedName(name) {
    return typeof name === "string" ? !/[\*\?]/.test(name) : name && typeof name === "object" && typeof name.length === "number" ? Array.prototype.every.call(name, isSpecifiedName) : false;
}

/**
 * 创建一个名称过滤器函数。该函数可判断指定的名称是否符合要求。
 * @param {String|RegExp|Function|Null} filter 允许重定向的名称过滤器。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
 * @returns {Function} 返回一个路由器函数。此函数的参数为：
 * * @param {String} name 要重定向的输入名称。
 * * @return {Boolean} 如果符合过滤器，则返回 @true。否则返回 @false。
 */
function createNameFilter(filter) {
    
    // createNameFilter(/.../)
    if (filter instanceof RegExp) {
        return function (name) {
            return filter.test(name);
        };
    }
    
    switch (typeof filter) {

        // createNameFilter([...])
        case "object":
            if (filter.length > 1) {
                filter = Array.prototype.map.call(filter, createNameFilter);
                return function (name) {
                    for (var i = 0; i < filter.length; i++) {
                        if (filter[i].call(this, name)) {
                            return true;
                        }
                    }
                    return false;
                };
            }
            return createNameFilter(filter[0]);

            // createNameFilter("*.sources*")
        case "string":
            
            var prefix;
            var postfix;
            
            if (/^\//.test(filter)) {
                filter = filter.substr(1);
                prefix = '^';
            } else {
                prefix = '(^|\\/)'
            }
            
            if (/\/$/.test(filter)) {
                filter = filter.substr(0, filter.length - 1);
                postfix = '\\/';
            } else {
                postfix = '(\\/|$)'
            }
            
            return createNameFilter(new RegExp(prefix + filter.replace(/([-.+^${}|\/\\])/g, '\\$1').replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + postfix, "i"));

            // createNameFilter(function(){ ... })
        case "function":
            return filter;

            // createNameFilter()
        default:
            return function () {
                return false;
            };
    }

}

/**
 * 创建一个名称路由器函数。该函数可将符合要求的名称重定向到另一个名称。
 * @param {String|RegExp|Function|Null} filter 允许重定向的名称过滤器。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
 * @returns {Function} 返回一个路由器函数。此函数的参数为：
 * * @param {String} srcName 要重定向的输入名称。
 * * @param {String} [destName=@srcName] 要重定向的目标路径（其中 $n 会被替换为 @srcName 中的匹配部分)。
 * * @return {String} 如果不符合过滤器，则返回 @null。否则返回 @destName，如果 @destName 为空则返回 @srcName。
 */
function createNameRouter(filter) {
    
    // createNameRouter(/.../)
    if (filter instanceof RegExp) {
        return function (srcName, destName) {
            var match = filter.exec(srcName);
            return match ? destName == null ? srcName : destName.replace(/\$(\d+)/g, function (all, n) {
                return n in match ? match[n] : all;
            }) : null;
        };
    }
    
    switch (typeof filter) {

        // createNameRouter([...])
        case "object":
            if (filter.length > 1) {
                filter = Array.prototype.map.call(filter, createNameRouter);
                return function (srcName, destName) {
                    for (var i = 0; i < filter.length; i++) {
                        var result = filter[i].call(this, srcName, destName);
                        if (result !== null) {
                            return result;
                        }
                    }
                    return null;
                };
            }
            return createNameRouter(filter[0]);

            // createNameRouter("*.sources*")
        case "string":
            return createNameRouter(new RegExp("^" + filter.replace(/([\-.+^${}|\/\\])/g, '\\$1').replace(/\*/g, "(.*)").replace(/\?/g, "([^/])") + "$", "i"));

            // createNameRouter(function(){ ... })
        case "function":
            return function (srcName, destName) {
                var match = filter.apply(this, arguments);
                return match === true ? destName == null ? srcName : destName : match === false ? null : match;
            };

            // createNameRouter()
        default:
            return function () {
                return null;
            };
    }

}

exports.createNameFilter = createNameFilter;
exports.createNameRouter = createNameRouter;

// #endregion

});

__tpack__.define("../../lib/i18n/zh-cn.js", function(exports, module, require){

module.exports = {
    "> Start Building...": "> 开始生成...",
    "> Build Completed! ({0} files saved, {1} error(s) found)": "> 生成完成（已生成：{0} 文件，错误：{1}）",
    "> Build Success! ({0} files saved, without errors)": "> 生成成功（已生成：{0} 文件，无错误）",
    "> Cleaning...": "> 清理目标文件夹...",
    "> Processing Files...": "> 处理文件...",
    "{0}: Uncaught error: {1}": "{0}: 未捕获的错误: {1}",
    "> Executing Rule {0}": "> 执行规则 {0}",
    "> Watching {srcPath} ...": "> 正在监听 {srcPath} ...",
    "> Server Running At {rootUrl}": "> 已启动服务器： {rootUrl}",
    "> Server Stopped At {rootUrl}": "> 已停止服务器： {rootUrl}",
    "Create Server Error: Port {port} of {address} is used by other programs.": "无法启动服务器: {address} 上的端口 {port} 已被其它程序占用",
    "Create Server Error: Port {port} is used by other programs.": "无法启动服务器: 端口 {port} 已被其它程序占用"
};
});

__tpack__.define("../../lib/index.js", function(exports, module, require){
var process = __tpack__.require("process");
var Path = require("path");
var IO = require("../../tutils/io.js");
var Lang = require("../../tutils/lang.js");
var Builder = require("../lib/builder.js");

/**
 * @namespace tpack
 */

var rootBuilder = new Builder;

// 设置默认语言为中文。
rootBuilder.messages = require("../lib/i18n/zh-cn.js");

var exports = module.exports = {
    
    // #region 生成器
    __proto__: Builder,
    
    /**
     * 获取当前正在使用的生成器。
     * @name builder
     * @type {String}
     */
    builder: rootBuilder,
    
    /**
     * 获取当前生成器的源文件夹。
     * @type {String}
     */
    get srcPath() { return this.builder.srcPath; },
    
    /**
     * 设置当前生成器的源文件夹。
     * @type {String}
     */
    set srcPath(value) { this.builder.srcPath = value; },
    
    /**
     * 获取当前生成器的目标文件夹。
     * @type {String}
     */
    get destPath() { return this.builder.destPath; },
    
    /**
     * 设置当前生成器的目标文件夹。
     * @type {String}
     */
    set destPath(value) { this.builder.destPath = value; },
    
    /**
     * 获取当前生成器读写文件使用的默认编码。
     * @type {String}
     */
    get encoding() { return this.builder.encoding; },
    
    /**
     * 设置当前生成器读写文件使用的默认编码。
     * @type {String}
     */
    set encoding(value) { this.builder.encoding = value; },
    
    /**
     * 判断是否启用生成器调试。
     * @type {Boolean}
     */
    get verbose() { return this.builder.verbose; },
    
    /**
     * 设置是否启用生成器调试。
     * @type {Boolean}
     */
    set verbose(value) { this.builder.verbose = value; },
    
    /**
     * 获取当前构建器的日志等级。
     * @type {Number}
     */
    get logLevel() { return this.builder.logLevel; },
    
    /**
     * 设置当前构建器的日志等级。
     * @type {Number}
     */
    set logLevel(value) { this.builder.logLevel = value; },
    
    /**
     * 判断是否启用颜色化输出。
     * @type {Boolean}
     */
    get coloredOutput() { return this.builder.coloredOutput; },
    
    /**
     * 设置是否启用颜色化输出。
     * @type {Boolean}
     */
    set coloredOutput(value) { this.builder.coloredOutput = value; },
    
    /**
     * 获取本地化消息对象。
     * @type {Object}
     */
    get messages() { return this.builder.messages; },
    
    /**
     * 设置本地化消息对象。
     * @type {Object}
     */
    set messages(value) { this.builder.messages = value; },
    
    /**
     * 添加生成时忽略的文件或文件夹。
     * @param {String|RegExp|Function} ... 要忽略的文件或文件夹名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     */
    ignore: function () { return this.builder.ignore.apply(this.builder, arguments); },
    
    /**
     * 添加针对指定名称的处理规则。
     * @param {String|RegExp|Function|Null} ... 要处理的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {BuildRule} 返回一个处理规则，可针对此规则进行具体的处理方式的配置。
     */
    src: function () { return this.builder.src.apply(this.builder, arguments); },
    
    /**
     * 添加一个名称发布后对应的 CDN 地址。
     * @param {String} name 要添加的文件夹名称。
     * @param {String} url 设置该 CDN 的地址。
     * @example tpack.addCdn("assets", "http://cdn.com/assets");
     */
    addCdnUrl: function () { return this.builder.addCdnUrl.apply(this.builder, arguments); },
    
    /**
     * 添加一个虚拟地址。
     * @param {String} name 要添加的虚拟网址名。
     * @param {String} path 要添加的虚拟网址实际地址名。
     * @example tpack.addVirtualPath("assets", "assets");
     */
    addVirtualPath: function () { return this.builder.addVirtualPath.apply(this.builder, arguments); },
    
    /**
     * 新建一个生成会话。新会话将会忽略上一个会话上创建的配置项。
     * @returns {Builder}
     */
    newSession: function () {
        return exports.builder = new Builder(exports.rootBuilder);
    },
    
    /**
     * 停止一个生成会话。
     * @returns {Builder}
     */
    endSession: function () {
        return exports.builder = exports.builder.parentBuilder || exports.rootBuilder;
    },
    
    /**
     * 载入忽略文件（如 .gitignoer）。
     * @param {String} path 文件路径。
     */
    loadIgnoreFile: function (path) {
        IO.readFile(path).split(/[\r\n]/).forEach(function (content) {
            content = content.trim();
            
            // 忽略空行和注释。
            if (!content || /^#/.test(content)) {
                return;
            }
            
            this.ignore(content);
        }, this);
    },
    
    /**
     * 打印一条普通日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    log: function () { return this.builder.log.apply(this.builder, arguments); },
    
    /**
     * 打印一条信息日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    info: function () { return this.builder.info.apply(this.builder, arguments); },
    
    /**
     * 打印一条警告日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    warn: function () { return this.builder.warn.apply(this.builder, arguments); },
    
    /**
     * 打印一条错误日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    error: function () { return this.builder.error.apply(this.builder, arguments); },
    
    /**
     * 打印一条成功日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    success: function () { return this.builder.success.apply(this.builder, arguments); },
    
    /**
     * 打印一条调试信息。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    debug: function () { return this.builder.debug.apply(this.builder, arguments); },
    
    /**
     * 执行生成任务。
     * @param {Object|Array|String|Function|RegExp|Boolean} [options] 命令行参数集合或者要发布的文件列表或者布尔值指示是否清理文件夹。
     */
    build: function (options) {
        
        // 无参数。
        if (options == null) {
            return this.builder.buildAll();
        }
        
        // 命令行参数
        if (typeof options === "object" && !Array.isArray(options)) {
            initOptions(options);
            
            // 生成用户指定的所有文件。
            if (options.length >= 2) {
                return this.builder.build.apply(this.builder, getFilesFromOptions(options));
            }
            
            // 生成整个项目。
            return this.builder.buildAll(options.clean);
        }
        
        // 是否清理。
        if (typeof options === "boolean") {
            return this.builder.buildAll(options);
        }
        
        // 生成指定的文件。
        return this.builder.build(options);

    },
    
    /**
     * 执行监听任务。
     * @param {Object} options 命令行参数集合。
     */
    watch: function (options) {
        
        if (!options || typeof options !== "object") {
            return this.builder.watch();
        }
        
        initOptions(options);
        
        // 监听指定项。
        if (options.length >= 2) {
            return this.builder.watch.apply(this.builder, getFilesFromOptions(options));
        }
        
        // 监听整个项目。
        return this.builder.watch();
    },
    
    /**
     * 执行启动服务器任务。
     * @param {Object} options 命令行参数集合。
     */
    startServer: function (options) {
        
        if (!options || typeof options !== "object") {
            return this.builder.startServer(options);
        }
        
        initOptions(options);
        
        if (typeof options !== "object") {
            return this.builder.startServer(options);
        }
        return this.builder.startServer(options[1] || options.port || 8080);
    },
    
    /**
     * 执行打开服务器任务。
     * @param {Object} options 命令行参数集合。
     */
    openServer: function (options) {
        var server = exports.startServer();
        if (server) {
            require("child_process").exec("start " + server.rootUrl, function (error, stdout, stderr) {
                if (error) {
                    exports.error(stderr);
                } else {
                    exports.log(stdout);
                }
            });
        }
        return server;
    },
    
    // #endregion
    
    // #region 任务
    
    /**
     * 获取所有任务列表。
     */
    tasks: { __proto__: null },
    
    /**
     * 创建或执行一个任务。
     * @param {String} taskName 任务名。
     * @param {Function|Object|Array|String} taskAction 如果是定义任务，传递任务函数本身；否则传递任务的前置任务或执行任务的参数。
     * @param {Function|Boolean} subTask 任务内容或标识是否是子任务。
     * @returns {mixed} 返回任务。
     * @example 
     * tpack.task("hello")               // 执行任务 hello
     * tpack.task("hello", fn)           // 定义任务 hello
     * tpack.task("hello", ["base"], fn) // 定义任务 hello, 前置任务 base
     */
    task: function (taskName, taskAction, subTask) {
        
        // tpack.task("hello") 定义任务。
        if (typeof taskAction === "function") {
            return exports.tasks[taskName] = taskAction;
        }
        
        // tpack.task("hello", "base") 定义任务别名。
        if (typeof taskAction === "string") {
            taskAction = [taskAction];
        }
        
        // tpack.task("hello", ["base"], fn) 定义多任务别名。
        if (Array.isArray(taskAction)) {
            return exports.tasks[taskName] = function (options) {
                
                // 首先执行子任务。
                for (var i = 0; i < taskAction.length; i++) {
                    exports.task(taskAction[i], options, true);
                }
                
                // 然后执行当前任务。
                return subTask && subTask.apply(this, arguments);
            };
        }
        
        // 执行任务。
        if (typeof exports.tasks[taskName] === "function") {
            exports.newSession();
            try {
                return exports.tasks[taskName].call(exports, taskAction == null ? {} : taskAction);
            } finally {
                exports.endSession();
            }
        }
        
        // 报告错误。
        taskName && exports.error("Task `{0}` is undefined", taskName);
    },
    
    // #endregion
    
    /**
     * 获取当前命令行的配置项。
     * @type {Object}
     */
    get options() {
        return this._options || (this._options = parseArgv(process.argv));
    },
    
    /**
     * 设置当前命令行的配置项。
     * @type {Object}
     */
    set options(value) {
        this._options = value;
    },
    
    /**
     * 获取当前要执行的任务名。
     * @type {String}
     */
    get cmd() {
        var cmd = this._cmd || this.options[0];
        return exports.alias[cmd] || cmd || "build";
    },
    
    /**
     * 设置当前要执行的任务名。
     */
    set cmd(value) {
        this._cmd = value;
    },
    
    /**
     * 驱动执行主任务。
     * @param {String} cmd 要执行的任务名。
     */
    run: function (cmd) {
        if (this._hasRun) {
            return;
        }
        this._hasRun = true;
        exports.task(cmd || exports.cmd, exports.options);
    }

};

/**
 * 初始化全局系统参数。
 * @param {Object} options 
 */
function initOptions(options) {
    
    var t;
    
    // -src, -in, -i
    if ((t = options.src || options['in'] || options.i)) {
        exports.srcPath = t;
    }
    
    // -dest, -out, -o
    if ((t = options.dest || options.out || options.o)) {
        exports.destPath = t;
    }
    
    // -verbose, -debug, -d
    if (options.verbose || options.debug || options.d) {
        exports.verbose = true;
    }
    
    // --color
    if (options['color'] || options['-color']) {
        exports.colored = true;
    }
    
    // --no-color
    if (options['no-color'] || options['-no-color']) {
        exports.colored = false;
    }
    
    // -error, -e, -info, -silient, -s, -log
    if ((t = options.error || options.e ? exports.LOG_LEVEL.error :
        options.warn || options.w ? exports.LOG_LEVEL.warn :
        options.log ? exports.LOG_LEVEL.log :
        options.info ? exports.LOG_LEVEL.info :
        options.silient || options.s ? exports.LOG_LEVEL.none :
        null) != null) {
        exports.logLevel = t;
    }
    
    // -h, -help, -?, --help
    if (options.h || options.help || options["?"]) {
        exports.cmd = 'help';
    }
    
}

function getFilesFromOptions(options) {
    var result = Array.prototype.slice.call(options, 1);
    for (var i = 0; i < result.length; i++) {
        result[i] = exports.builder.toName(Path.resolve(result[i]));
    }
    return result;
}

// #region 任务

// 生成任务。
exports.task('build', exports.build);

// 监听任务。
exports.task('watch', exports.watch);

// 服务器任务。
exports.task('server', exports.startServer);

// 启动服务器任务。
exports.task('open', exports.openServer);

// 帮助任务。
exports.task("help", function (options) {
    console.log('Usage: tpack task-name [Options]');
    console.log('Defined Tasks:');
    console.log('');
    for (var cmdName in exports.tasks) {
        console.log('\t' + cmdName);
    }
});

// 初始化任务。
exports.task("init", function (options) {
    var config = options.config;
    var IO = require("../../tutils/io.js");
    if (IO.existsFile(options.config)) {
        exports.builde.log("File already exists: '{0}'. Nothing done.", config);
        return;
    }
    
    IO.copyFile(Path.resolve(__dirname, "tpack.config.js"), config);
    exports.builder.success("File created at: '{0}'", config);
});

// #endregion

// #region 控制台

/**
 * 解析命令提示符参数。
 * @param {Array} 原始参数数组。
 * @returns {Object} 返回键值对象。
 * @example 
 * parseArgv(["a", "-c1", "-c2", "v", "b"]) // {0: "a", c1: true, c2: "v", 1: "b"}
 */
function parseArgv(argv) {
    var result = { length: 0 };
    // 0: node.exe, 1: tpack.config.js
    for (var i = 2; i < argv.length; i++) {
        var arg = argv[i];
        if (/^[\-\/]/.test(arg)) {
            var value = argv[i + 1];
            // 如果下一个参数是参数名。
            if (!value || /^[\-\/]/.test(value)) {
                value = true;
            } else {
                i++;
            }
            result[arg.substr(1)] = value;
        } else {
            result[result.length++] = arg;
        }
    }
    return result;
}

/**
 * 获取当前任务的别名列表。
 */
exports.alias = {
    "b": "build",
    "w": "watch",
    "start": "server",
    "s": "server",
    "boot": "open",
    "o": "open",
    "h": "help"
};

// #endregion

});

__tpack__.define("t.js", function(exports, module, require){
require("../lib/index.js");
});

__tpack__.require("scripts/t.js");