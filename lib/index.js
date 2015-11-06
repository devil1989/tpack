var Path = require('path');
var Lang = require('tealweb/lang');
var Builder = exports = module.exports = require('./builder.js');

// #region 自动任务

/**
 * 获取命令行中指定的所有文件名。
 * @param {Object} options 命令行参数集合。
 */
exports.getFilesFromOptions = function (options) {
    var inputs = Array.prototype.slice.call(options, 1);
    for (var i = 0; i < inputs.length; i++) {
        inputs[i] = this.currentBuilder.getName(Path.resolve(inputs[i]));
    }
    return this.currentBuilder.getFiles.apply(this.currentBuilder, inputs);
};

/**
 * 执行生成任务。
 * @param {Object} options 命令行参数集合。
 */
exports.build = function (options) {

    options.build = true;
    if (exports.init) {
        exports.init(options);
    }

    // 调用原生接口。
    if (options == null || typeof options === "boolean") {
        return this.currentBuilder.build(options);
    }

    // 生成整个项目。
    if (options.length < 2) {
        return this.currentBuilder.build(options.clean);
    }

    // 生成用户指定的所有文件。
    this.currentBuilder.savedFileCount = 0;
    this.getFilesFromOptions(options).forEach(this.currentBuilder.buildFile, this.currentBuilder);
    return this.currentBuilder.savedFileCount;
};

/**
 * 执行监听任务。
 * @param {Object} options 命令行参数集合。
 */
exports.watch = function (options) {

    options.watch = true;
    if (exports.init) {
        exports.init(options);
    }

    if (typeof options !== "object" || options.length < 2) {
        return this.currentBuilder.watch();
    }

    return this.currentBuilder.watch.apply(this.currentBuilder, this.getFilesFromOptions(options));
};

/**
 * 执行启动服务器任务。
 * @param {Object} options 命令行参数集合。
 */
exports.startServer = function (options) {

    options.server = true;
    if (exports.init) {
        exports.init(options);
    }

    if (typeof options !== "object") {
        return this.currentBuilder.startServer(options);
    }
    return exports.startServer(options[1] || options.port || 8080);
};

// #endregion

// #region 核心

exports.rootBuilder = exports.currentBuilder = new Builder;

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

/**
 * 重置当前任务内设置的所有属性。
 */
exports.reset = function () {
    exports.currentBuilder = new Builder(exports.currentBuilder.parentBuilder || exports.rootBuilder);
};

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
    if (typeof taskAction === 'function') {
        return exports.tasks[taskName] = taskAction;
    }

    // tpack.task("hello", "base") 定义任务别名。
    if (typeof taskAction === 'string') {
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
    if (typeof exports.tasks[taskName] === 'function') {
        exports.currentBuilder = new Builder(exports.currentBuilder);
        try {
            return exports.tasks[taskName].call(exports, taskAction == null ? {} : taskAction);
        } finally {
            exports.currentBuilder = exports.currentBuilder.parentBuilder;
        }
    }

    // 报告错误。
    taskName && exports.error("Task `{0}` is undefined", taskName);
};

/*
 * 执行一次生成操作。
 * @param {Object} options 相关参数。
 * @returns {Builder} 返回构建器对象。
 */
exports.task('build', exports.build);

/**
 * 执行监听任务。
 * @param {Object} options 相关参数。
 * @returns {Builder} 返回构建器对象。
 */
exports.task('watch', exports.watch);

/**
 * 启动服务器任务。
 * @param {Object} options 相关参数。
 * @returns {AspServer} 返回服务器对象。
 */
exports.task('startServer', exports.startServer);

/**
 * 启动服务器任务。
 * @param {Object} options 相关参数。
 * @returns {AspServer} 返回服务器对象。
 */
exports.task('openServer', function (options) {
    var server = exports.task('startServer');
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

// 默认任务。
exports.task('default', ["build", "watch"]);

exports.task("h", "help");
exports.task("b", "build");

exports.task("w", "watch");

exports.task("server", "startServer");
exports.task("start", "startServer");
exports.task("s", "startServer");

exports.task("open", "openServer");
exports.task("boot", "openServer");
exports.task("o", "openServer");

// #endregion

exports.rootBuilder.messages = require('../lib/i18n/zh-cn.js');
