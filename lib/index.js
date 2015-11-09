var Path = require('path');
var Lang = require('tealweb/lang');
var Builder = exports = module.exports = require('./builder.js');

// #region 控制台

/**
 * 获取当前命令行的配置项。
 * @type {Object}
 */
exports.__defineGetter__("options", function () {
    return this._options || (this._options = initOptions(parseArgv(process.argv)));
});

/**
 * 设置当前命令行的配置项。
 */
exports.__defineSetter__("options", function (value) {
    this._options = value;
});

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
 * 初始化全局系统参数。
 * @param {Object} options 
 * @returns {Object} 
 */
function initOptions(options) {

    // -src, -in, -i
    if (options.src = options.src || options['in'] || options.i) {
        exports.srcPath = options.src;
    }

    // -dest, -out, -o
    if (options.dest = options.dest || options.out || options.o) {
        exports.destPath = options.dest;
    }

    // -verbose, -debug, -d
    if (options.verbose = options.verbose || options.debug || options.d) {
        exports.verbose = true;
    }

    // --no-color
    if (options['no-color'] = options['no-color'] || options['-no-color']) {
        exports.colored = false;
    }

    // -error, -e, -info, -silient, -s, -log
    exports.logLevel = options.error || options.e ? exports.LOG_LEVEL.error :
        options.log ? exports.LOG_LEVEL.log :
        options.info ? exports.LOG_LEVEL.info :
        options.silient || options.s ? exports.LOG_LEVEL.none :
        exports.logLevel;

    return options;

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

/**
 * 获取当前要执行的任务名。
 * @type {String}
 */
exports.__defineGetter__("cmd", function () {
    var cmd = this._cmd || this.options[0];
    return exports.alias[cmd] || cmd || "build";
});

/**
 * 设置当前要执行的任务名。
 */
exports.__defineSetter__("cmd", function (value) {
    this._cmd = value;
});

/**
 * 获取命令行中指定的所有文件名。
 * @param {Object} options 命令行参数集合。
 * @returns {Array}
 */
exports.getTargetFiles = function () {
    var inputs = Array.prototype.slice.call(this.options, 1);
    for (var i = 0; i < inputs.length; i++) {
        inputs[i] = this.currentBuilder.getName(Path.resolve(inputs[i]));
    }
    return this.currentBuilder.getFiles.apply(this.currentBuilder, inputs);
};

/**
 * 驱动执行主任务。
 */
exports.run = function () {

    // 仅执行一次。
    if (exports._run) {
        return;
    }
    exports._run = true;

    // 执行预设的命令。
    var cmd = exports.cmd;
    if (typeof exports.tasks[cmd] === "function" && exports.currentBuilder.rules.length > 0) {
        exports.tasks[cmd].call(exports, exports.options);
    }
};

// 自动执行 exports.run，可以让用户省略 tpack.run()。
process.nextTick(exports.run);

// #endregion

// #region 任务

/**
 * 获取所有任务列表。
 */
exports.tasks = { __proto__: null };

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
exports.task = function (taskName, taskAction, subTask) {

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
        return exports.tasks[taskName].call(exports, taskAction == null ? {} : taskAction);
    }

    // 报告错误。
    taskName && exports.error("Task `{0}` is undefined", taskName);
};

/*
 * 执行一次生成操作。
 * @param {Object} options 相关参数。
 * @returns {Builder} 返回构建器对象。
 */
exports.task('build', function (options) {

    // 生成用户指定的所有文件。
    if (options.length >= 2) {
        this.getTargetFiles().forEach(this.currentBuilder.buildFile, this.currentBuilder);
        return;
    }

    // 生成整个项目。
    this.currentBuilder.build(options.clean);

});

/**
 * 执行监听任务。
 * @param {Object} options 相关参数。
 * @returns {Builder} 返回构建器对象。
 */
exports.task('watch', function (options) {

    // 监听整个项目。
    if (options.length >= 2) {
        return this.currentBuilder.watch.apply(this.currentBuilder, this.getFilesFromOptions(options));
    }

    // 监听指定项。
    return this.currentBuilder.watch();
});

/**
 * 启动服务器任务。
 * @param {Object} options 相关参数。
 * @returns {AspServer} 返回服务器对象。
 */
exports.task('server', function (options) {
    return exports.startServer(options[1] || options.port || 8080);
});

/**
 * 启动服务器任务。
 * @param {Object} options 相关参数。
 * @returns {AspServer} 返回服务器对象。
 */
exports.task('open', function (options) {
    var server = exports.startServer(options[1] || options.port || 8080);
    if (server) {
        require('child_process').exec("start " + server.rootUrl, function (error, stdout, stderr) {
            if (error) {
                exports.error(stderr);
            } else {
                exports.log(stdout);
            }
        });
    }
    return server;
});

/**
 * 启动服务器任务。
 * @param {Object} options 相关参数。
 * @returns {AspServer} 返回服务器对象。
 */
exports.task("help", function (options) {
    console.log('Usage: tpack task-name [Options]');
    console.log('Defined Tasks:');
    console.log('');
    for (var cmdName in exports.tasks) {
        console.log('\t' + cmdName)
    }
});

/**
 * 初始化任务。
 */
exports.task("init", function (options) {
    var config = options.config;
    var IO = require('tealweb/io.js');
    if (IO.existsFile(options.config)) {
        exports.log("File already exists: `{0}`. Nothing done.", config);
        return;
    }

    IO.copyFile(Path.resolve(__dirname, "tpack.config.tpl", config));
    exports.success("File created at: `{0}`", config);
});

// #endregion

// #region 生成器

exports.rootBuilder = exports.currentBuilder = new Builder;

/**
 * 新建一个生成会话。
 * @returns {Builder}
 */
exports.newSession = function () {
    return exports.currentBuilder = new Builder(exports.rootBuilder);
};

// 将 builder 的方法提升为全局方法。
(function (obj, fn) {
    for (var key in obj) {
        if (!key.startsWith("_")) {
            fn(obj[key], key);
        }
    }
})(Builder.prototype, function (value, key) {
    if (key in exports) {
        return;
    }
    if (typeof value === "function") {
        exports[key] = function () {
            return this.currentBuilder[key].apply(this.currentBuilder, arguments);
        };
    } else {
        exports.__defineGetter__(key, function () { return this.currentBuilder[key] });
        exports.__defineSetter__(key, function (value) { this.currentBuilder[key] = value; });
    }
});

exports.rootBuilder.messages = require('./i18n/zh-cn.js');

// #endregion
