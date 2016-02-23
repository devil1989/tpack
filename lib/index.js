var Path = require('path');
var IO = require('tutils/io');
var Lang = require('tutils/lang');
var Builder = require('./builder.js');

/**
 * @namespace tpack
 */
var tpack = module.exports = {
    
    // #region Builder 包装
    
    __proto__: Builder,
    
    /**
     * 获取当前正在使用的生成器。
     * @type {String}
     */
    builder: new Builder,
    
    /**
     * 获取当前生成器的源文件夹路径。
     * @type {String}
     */
    get srcPath() { return tpack.builder.srcPath; },
    
    /**
     * 设置当前生成器的源文件夹路径。
     * @type {String}
     */
    set srcPath(value) { tpack.builder.srcPath = value; },
    
    /**
     * 获取当前生成器的目标文件夹路径。
     * @type {String}
     */
    get destPath() { return tpack.builder.destPath; },
    
    /**
     * 设置当前生成器的目标文件夹路径。
     * @type {String}
     */
    set destPath(value) { tpack.builder.destPath = value; },
    
    /**
     * 获取当前生成器读写文件使用的默认编码。
     * @type {String}
     */
    get encoding() { return tpack.builder.encoding; },
    
    /**
     * 设置当前生成器读写文件使用的默认编码。
     * @type {String}
     */
    set encoding(value) { tpack.builder.encoding = value; },
    
    /**
     * 判断是否启用生成器调试。
     * @type {Boolean}
     */
    get verbose() { return tpack.builder.verbose; },
    
    /**
     * 设置是否启用生成器调试。
     * @type {Boolean}
     */
    set verbose(value) { tpack.builder.verbose = value; },
    
    /**
     * 获取当前构建器的日志等级。
     * @type {Number}
     */
    get logLevel() { return tpack.builder.logLevel; },
    
    /**
     * 设置当前构建器的日志等级。
     * @type {Number}
     */
    set logLevel(value) { tpack.builder.logLevel = value; },
    
    /**
     * 判断是否启用颜色化输出。
     * @type {Boolean}
     */
    get coloredOutput() { return tpack.builder.coloredOutput; },
    
    /**
     * 设置是否启用颜色化输出。
     * @type {Boolean}
     */
    set coloredOutput(value) { tpack.builder.coloredOutput = value; },
    
    /**
     * 获取本地化消息对象。
     * @type {Object}
     */
    get messages() { return tpack.builder.messages; },
    
    /**
     * 设置本地化消息对象。
     * @type {Object}
     */
    set messages(value) { tpack.builder.messages = value; },
    
    /**
     * 添加生成时忽略的文件或文件夹。
     * @param {String|RegExp|Function} ... 要忽略的文件或文件夹名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     */
    ignore: function () { return tpack.builder.ignore.apply(tpack.builder, arguments); },
    
    /**
     * 添加针对指定名称的处理规则。
     * @param {String|RegExp|Function|Null} ... 要处理的文件名称。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
     * @returns {BuildRule} 返回一个处理规则，可针对此规则进行具体的处理方式的配置。
     */
    src: function () { return tpack.builder.src.apply(tpack.builder, arguments); },
    
    /**
     * 添加一个名称发布后对应的 CDN 地址。
     * @param {String} name 要添加的文件夹名称。
     * @param {String} url 设置该 CDN 的地址。
     * @example tpack.addCdn("assets", "http://cdn.com/assets");
     */
    addCdn: function () { return tpack.builder.addCdn.apply(tpack.builder, arguments); },
    
    /**
     * 添加一个虚拟地址。
     * @param {String} name 要添加的虚拟网址名。
     * @param {String} path 要添加的虚拟网址实际地址名。
     * @example tpack.addVirtualPath("assets", "assets");
     */
    addVirtualPath: function () { return tpack.builder.addVirtualPath.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条普通日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    log: function () { return tpack.builder.log.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条信息日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    info: function () { return tpack.builder.info.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条警告日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    warn: function () { return tpack.builder.warn.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条错误日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    error: function () { return tpack.builder.error.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条成功日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    success: function () { return tpack.builder.success.apply(tpack.builder, arguments); },
    
    /**
     * 打印一条调试信息。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    debug: function () { return tpack.builder.debug.apply(tpack.builder, arguments); },
    
    // #endregion
    
    // #region 生成
    
    /**
     * 新建一个生成会话。新会话将会忽略上一个会话上创建的配置项。
     * @returns {Builder}
     */
    newSession: function () {
        return tpack.builder = new Builder(tpack.builder);
    },
    
    /**
     * 停止一个生成会话。
     * @returns {Builder}
     */
    endSession: function () {
        return tpack.builder = tpack.builder.parentBuilder || tpack.builder;
    },
    
    /**
     * 执行生成任务。
     * @param {Object|Array|String|Boolean} [options] 命令行参数集合或者要发布的文件列表或者布尔值指示是否清理文件夹。
     */
    build: function (options) {
        tpack.builder.currentAction = "build";
        
        var filter;
        var clean;
        
        if (options === true || options === false) {
            clean = options;
        } else if (typeof options === "string") {
            filter = [options];
        } else if (Array.isArray(options)) {
            filter = options;
        } else if (options) {
            filter = getFilesFromOptions(options);
            clean = options["clean"];
        }
        
        // 支持直接传递绝对路径。
        if (filter) {
            if (filter.length) {
                for (var i = 0; i < filter.length; i++) {
                    if (Path.isAbsolute(filter[i])) {
                        filter[i] = tpack.builder.toName(filter[i]);
                    }
                }
            } else {
                filter = false;
            }
        }
        
        return tpack.builder.build(filter, clean);

    },
    
    /**
     * 执行监听任务。
     * @param {Object|Array|String} options 命令行参数集合合或者要监听的文件列表或者布尔值指示是否清理文件夹。
     */
    watch: function (options) {
        tpack.builder.currentAction = "watch";
        
        var filter;
        
        if (typeof options === "string") {
            filter = [options];
        } else if (Array.isArray(options)) {
            filter = options;
        } else if (options) {
            filter = getFilesFromOptions(options);
        }
        
        return tpack.builder.watch(filter);
    },
    
    /**
     * 执行启动服务器任务。
     * @param {Object} options 命令行参数集合。
     */
    startServer: function (options) {
        tpack.builder.currentAction = "server";
        return tpack.builder.startServer(options);
    },
    
    /**
     * 执行打开服务器任务。
     * @param {Object} options 命令行参数集合。
     */
    openServer: function (options) {
        var server = tpack.startServer();
        if (server) {
            require('child_process').exec("start " + server.rootUrl, function (error, stdout, stderr) {
                if (error) {
                    tpack.error(stderr);
                } else {
                    tpack.log(stdout);
                }
            });
        }
        return server;
    },
    
    // #endregion
    
    // #region 工具
    
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
            
            tpack.ignore(content);
        });
    },
    
    /**
     * 载入指定的插件，并允许忽略载入错误。
     * @param {String} name 要载入的插件。
     * @returns {Object} 插件对象。
     */
    plugin: function (name) {
        try {
            return require(name);
        } catch (e) {
            return function (file) {
                file.addError("Plugin “" + name + "” is not installed. Nothing changed for “" + file.name + "”. Using “npm install " + name + " -g” to install the plugin.");
            };
        }
    },
    
    // #endregion
    
    // #region 任务
    
    /**
     * 获取所有任务列表。
     * @type {Object}
     */
    tasks: { __proto__: null },
    
    /**
     * 创建或执行一个任务。
     * @param {String} taskName 任务名，多个任务用空格隔开。
     * @param {Function|String} [taskAction] 如果是定义任务，则传递任务别名或任务函数本身；否则表示执行任务使用的参数。
     * @returns {Function|Object} 如果是定义任务，则返回任务函数本身，否则返回任务执行后的返回值。
     * @example 
     * tpack.task("hello", {})            // 执行任务 hello
     * tpack.task("hello", function(){ })           // 定义任务 hello
     * tpack.task("h", "hello")           // 定义任务 h 为 hello 的别名。
     */
    task: function (taskName, taskAction) {
        
        // 支持多名称。
        var p = taskName.indexOf(" ");
        if (p >= 0) {
            tpack.task(taskName.substr(0, p), taskAction);
            return tpack.task(taskName.substr(p + 1), taskAction);
        }
        
        // tpack.task("hello", function(){}) 定义任务。
        if (typeof taskAction === "function") {
            return tpack.tasks[taskName] = taskAction;
        }
        
        // tpack.task("hello", "base") 定义任务别名。
        if (typeof taskAction === "string") {
            return tpack.tasks[taskName] = function (options) {
                return tpack.task(taskAction, options);
            };
        }
        
        // 检查任务是否已定义。
        if (typeof tpack.tasks[taskName] !== "function") {
            taskName && tpack.error("Task `{0}` is undefined", taskName);
            return;
        }
        
        // 执行任务。
        tpack.newSession();
        try {
            return tpack.tasks[taskName].call(tpack, taskAction == null ? {} : taskAction);
        } finally {
            // 如果在任务期间定义了规则，则在任务执行完成后自动执行。
            if (!tpack.builder.currentAction && tpack.builder.rules.length > 0) {
                if (taskName.indexOf("watch") >= 0) {
                    tpack.watch(taskAction);
                } else if (taskName.indexOf("server") >= 0) {
                    tpack.startServer(taskAction);
                } else {
                    tpack.build(taskAction);
                }
            }
            tpack.endSession();
        }
    }
    
    // #endregion
    
};

function getFilesFromOptions(options) {
    var result = [];
    for (var i = 1; i < options.length; i++) {
        result.push(tpack.builder.toName(Path.resolve(options[i])));
    }
    return result;
}

require('./tasks.js');