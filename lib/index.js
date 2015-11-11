var Path = require('path');
var IO = require('tealweb/io');
var Lang = require('tealweb/lang');
var Builder = exports = module.exports = require('./builder.js');

/**
 * @namespace tpack
 */

// #region 生成器

/**
 * 获取当前正在使用的生成器。
 * @name builder
 * @type {String}
 */
exports.rootBuilder = exports.builder = new Builder;

// 设置默认语言为中文。
exports.rootBuilder.messages = require('./i18n/zh-cn.js');

/**
 * 获取当前生成器的源文件夹。
 * @type {String}
 */
exports.__defineGetter__("srcPath", function () { return this.builder.srcPath; });

/**
 * 设置当前生成器的源文件夹。
 * @type {String}
 */
exports.__defineSetter__("srcPath", function (value) { this.builder.srcPath = value; });

/**
 * 获取当前生成器的目标文件夹。
 * @type {String}
 */
exports.__defineGetter__("destPath", function () { return this.builder.destPath; });

/**
 * 设置当前生成器的目标文件夹。
 * @type {String}
 */
exports.__defineSetter__("destPath", function (value) { this.builder.destPath = value; });

/**
 * 获取当前生成器读写文件使用的默认编码。
 * @type {String}
 */
exports.__defineGetter__("encoding", function () { return this.builder.encoding; });

/**
 * 设置当前生成器读写文件使用的默认编码。
 * @type {String}
 */
exports.__defineSetter__("encoding", function (value) { this.builder.encoding = value; });

/**
 * 判断是否启用生成器调试。
 * @type {Boolean}
 */
exports.__defineGetter__("verbose", function () { return this.builder.verbose; });

/**
 * 设置是否启用生成器调试。
 * @type {Boolean}
 */
exports.__defineSetter__("verbose", function (value) { this.builder.verbose = value; });

/**
 * 获取当前构建器的日志等级。
 * @type {Number}
 */
exports.__defineGetter__("logLevel", function () { return this.builder.logLevel; });

/**
 * 设置当前构建器的日志等级。
 * @type {Number}
 */
exports.__defineSetter__("logLevel", function (value) { this.builder.logLevel = value; });

/**
 * 判断是否启用颜色化输出。
 * @type {Boolean}
 */
exports.__defineGetter__("colored", function () { return this.builder.colored; });

/**
 * 设置是否启用颜色化输出。
 * @type {Boolean}
 */
exports.__defineSetter__("colored", function (value) { this.builder.colored = value; });

/**
 * 获取本地化消息对象。
 * @type {Object}
 */
exports.__defineGetter__("messages", function () { return this.builder.messages; });

/**
 * 设置本地化消息对象。
 * @type {Object}
 */
exports.__defineSetter__("messages", function (value) { this.builder.messages = value; });

/**
 * 添加生成时忽略的文件或文件夹。
 * @param {String|RegExp|Function} ... 要忽略的文件或文件夹名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
 */
exports.ignore = function () { return this.builder.ignore.apply(this.builder, arguments); };

/**
 * 添加针对指定名称的处理规则。
 * @param {String|RegExp|Function|Null} ... 要处理的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
 * @returns {BuildRule} 返回一个处理规则，可针对此规则进行具体的处理方式的配置。
 */
exports.src = function () { return this.builder.src.apply(this.builder, arguments); };

/**
 * 添加一个名称发布后对应的 CDN 地址。
 * @param {String} name 要添加的文件夹名称。
 * @param {String} url 设置该 CDN 的地址。
 * @example tpack.addCdn("assets", "http://cdn.com/assets");
 */
exports.addCdnUrl = function () { return this.builder.addCdnUrl.apply(this.builder, arguments); };

/**
 * 添加一个虚拟地址。
 * @param {String} name 要添加的虚拟网址名。
 * @param {String} path 要添加的虚拟网址实际地址名。
 * @example tpack.addVirtualPath("assets", "assets");
 */
exports.addVirtualPath = function () { return this.builder.addVirtualPath.apply(this.builder, arguments); };

/**
 * 新建一个生成会话。新会话将会忽略上一个会话上创建的配置项。
 * @returns {Builder}
 */
exports.newSession = function () {
    return exports.builder = new Builder(exports.rootBuilder);
};

/**
 * 停止一个生成会话。
 * @returns {Builder}
 */
exports.endSession = function () {
    return exports.builder = exports.builder.parentBuilder || exports.rootBuilder;
};

/**
 * 载入忽略文件（如 .gitignoer）。
 * @param {String} path 文件路径。
 */
exports.loadIgnoreFile = function (path) {
    IO.readFile(path).split(/[\r\n]/).forEach(function (content) {
        content = content.trim();

        // 忽略空行和注释。
        if (!content || /^#/.test(content)) {
            return;
        }

        this.ignore(content);
    }, this);
};

/**
 * 执行生成任务。
 * @param {Object} options 命令行参数集合。
 */
exports.build = function (options) {

    // 调用原生接口。
    if (options == null || typeof options === "boolean") {
        return this.builder.build(options);
    }

    initOptions(options);

    // 生成用户指定的所有文件。
    if (options.length >= 2) {
        return this.builder.build.apply(this.builder, getFilesFromOptions(options));
    }

    // 生成整个项目。
    return this.builder.buildAll(options.clean);
};

/**
 * 执行监听任务。
 * @param {Object} options 命令行参数集合。
 */
exports.watch = function (options) {

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
};

/**
 * 执行启动服务器任务。
 * @param {Object} options 命令行参数集合。
 */
exports.startServer = function (options) {

    if (!options || typeof options !== "object") {
        return this.builder.startServer(options);
    }

    initOptions(options);

    if (typeof options !== "object") {
        return this.builder.startServer(options);
    }
    return this.builder.startServer(options[1] || options.port || 8080);
};

/**
 * 执行打开服务器任务。
 * @param {Object} options 命令行参数集合。
 */
exports.openServer = function (options) {
    var server = exports.startServer();
    if (server) {
        require('child_process').exec("start " + server.rootUrl, function (error, stdout, stderr) {
            if (error) {
                exports.builder.error(stderr);
            } else {
                exports.builder.log(stdout);
            }
        });
    }
    return server;
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

}

function getFilesFromOptions(options) {
    var result = Array.prototype.slice.call(options, 1);
    for (var i = 0; i < result.length; i++) {
        result[i] = exports.builder.getName(Path.resolve(result[i]));
    }
    return result;
}

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
        exports.newSession();
        try {
            return exports.tasks[taskName].call(exports, taskAction == null ? {} : taskAction);
        } finally {
            exports.endSession();
        }
    }

    // 报告错误。
    taskName && exports.error("Task `{0}` is undefined", taskName);
};

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
    var IO = require('tealweb/io.js');
    if (IO.existsFile(options.config)) {
        exports.builde.log("File already exists: '{0}'. Nothing done.", config);
        return;
    }

    IO.copyFile(Path.resolve(__dirname, "tpack.config.tpl"), config);
    exports.builder.success("File created at: '{0}'", config);
});

// #endregion

// #region 控制台

/**
 * 获取当前命令行的配置项。
 * @type {Object}
 */
exports.__defineGetter__("options", function () {
    return this._options || (this._options = parseArgv(process.argv));
});

/**
 * 设置当前命令行的配置项。
 * @type {Object}
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
 * 驱动执行主任务。
 * @param {String} cmd 要执行的任务名。
 */
exports.run = function (cmd) {
    exports.task(cmd || exports.cmd, exports.options);
};

// #endregion
