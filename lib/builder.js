/**
 * @fileOverview 项目生成逻辑核心。
 */

var Path = require('path');
var FS = require('fs');
var IO = require('tealweb/io');
var Lang = require('tealweb/lang');

// #region Builder

/**
 * 表示一个项目生成器。
 * @param {Builder} [parentBuilder] 当前生成器的上级生成器。当前生成器将复制上级生成器的属性。
 * @class
 */
function Builder(parentBuilder) {
    if (parentBuilder) {
        this.parentBuilder = this.__proto__ = parentBuilder;
        this.rules = parentBuilder.rules.slice(0);
        this.ignores = parentBuilder.ignores.slice(0);
        this.errors = parentBuilder.errors.slice(0);
        this.files = { __proto__: parentBuilder.files };
        this.cdnPaths = { __proto__: parentBuilder.cdnPaths };
        this.virtualPaths = { __proto__: parentBuilder.virtualPaths };
        this.messages = { __proto__: parentBuilder.messages };
    } else {
        this.parentBuilder = null;
        this.rules = [];
        this.ignores = [];
        this.errors = [];
        this.files = { __proto__: null };
        this.cdnPaths = { __proto__: null };
        this.virtualPaths = { __proto__: null };
        this.messages = { __proto__: null };
    }
    this.fileCount = 0;
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
    log: 5,

    /**
     * 调试级别。
     */
    debug: 6
};

// #endregion

Builder.prototype = {

    // #region 核心

    constructor: Builder,

    /**
     * 当前生成器的源文件夹。
     */
    _srcPath: "",

    /**
     * 获取当前生成器的源文件夹。
     */
    get srcPath() {
        return this._srcPath || Path.resolve();
    },

    /**
     * 设置当前生成器的源文件夹。
     */
    set srcPath(value) {
        this._srcPath = Path.resolve(value);
    },

    /**
     * 当前生成器的目标文件夹。
     */
    _destPath: "",

    /**
     * 获取当前生成器的目标文件夹。
     */
    get destPath() {
        return this._destPath || this.srcPath;
    },

    /**
     * 设置当前生成器的目标文件夹。
     */
    set destPath(value) {
        this._destPath = Path.resolve(value);
        // 更新忽略列表。
        this.ignore();
    },

    /**
     * 获取或设置当前生成器读写文件使用的默认编码。
     */
    encoding: "utf-8",

    /**
     * 判断或设置是否启用生成器调试。
     */
    verbose: false,

    /**
     * 获取指定路径对应的名称。
     * @param {String} path 要处理的路径。
     * @returns {String} 返回名称。格式如：“a/b.jpg”
     */
    getName: function (path) {
        return Path.relative(this.srcPath, path).replace(/\\/g, "/");
    },

    /**
     * 获取指定名称对应的路径。
     * @param {String} name 要处理的名称。
     * @returns {String} 返回绝对路径。格式如：“E:\www\a\b.jpg”
     */
    getPath: function (name) {
        return Path.join(this.srcPath, name);
    },

    /**
     * 判断指定名称是否被忽略。
     * @param {String} name 要判断的文件或文件夹名称。
     * @returns {String} 如果已忽略则返回 @null，否则返回 @name。
     */
    _ignored: function (name) {
        this.ignore();
        return this._ignored(name);
    },

    /**
     * 添加生成时忽略的文件或文件夹。
     * @param {String|RegExp|Function} ... 要忽略的文件或文件夹名称。支持通配符、正则表达式或函数表达式。
     */
    ignore: function () {
        this.ignores.push.apply(this.ignores, arguments);
        // 自动忽略目标文件夹。
        this._ignored = createRouter(containsDir(this.destPath, this.srcPath) ? this.ignores : this.ignores.concat(this.getName(this.destPath)));
    },

    /**
     * 添加针对指定名称的处理规则。
     * @param {String|RegExp|Function|Null} ... 要处理的文件名称。支持通配符、正则表达式或函数表达式。
     * @returns {BuildRule} 返回一个处理规则，可针对此规则进行具体的处理方式的配置。
     */
    src: function () {
        var rule = new BuildRule(arguments);
        this.rules.push(rule);
        return rule;
    },

    /**
     * 遍历当前项目内所有未被忽略的文件并执行 @callback。
     * @param {Function} callback 要执行的回调。其参数为：
     * * @param {String} name 要处理文件的名称。
     */
    walk: function (callback) {
        var builder = this;
        IO.walkDir(this.srcPath, function (name, isDir) {

            // 判断路径是否被忽略。
            if (builder._ignored(name) !== null) {
                return false;
            }

            // 将文件加入到待编译列表。
            if (!isDir) {
                callback.call(builder, name);
            }

        });
    },

    // #endregion

    // #region 日志功能

    /**
     * 获取或设置当前构建器的日志等级。
     */
    logLevel: Builder.LOG_LEVEL.log,

    /**
     * 当被子类重写时，负责自定义输出日志的方式（如需要将日志保存为文件）。
     * @param {String} message 要输出的信息。 
     * @param {Number} logLevel 要输出的日志等级。
     */
    write: function (message, logLevel) {
        var formator = [0, '\033[49;31;1m*\033[0m', '\033[49;33;1m*\033[0m', '\033[49;32;1m*\033[0m', '\033[36m*\033[0m', '\033[32m*\033[0m'][logLevel];
        if (formator) {
            message = formator.replace('*', message);
        }
        return logLevel == Builder.LOG_LEVEL.error ? console.error(message) :
            logLevel == Builder.LOG_LEVEL.warn ? console.warn(message) :
            logLevel == Builder.LOG_LEVEL.info || logLevel == Builder.LOG_LEVEL.success ? console.info(message) :
            console.log(message);
    },

    /**
     * 打印一条普通日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    log: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.log) return;
        message = this.messages[message] || message;
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
        message = this.messages[message] || message;
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.info);
    },

    /**
     * 打印一条警告日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    warn: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.warn) return;
        message = this.messages[message] || message;
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.warn);
    },

    /**
     * 打印一条错误日志。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    error: function (message) {
        message = this.messages[message] || message;
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
        message = this.messages[message] || message;
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.success);
    },

    /**
     * 打印一条调试信息。
     * @param {String} message 要输出的信息。 
     * @param {Object} ... 格式化参数。 
     */
    debug: function (message) {
        if (this.logLevel < Builder.LOG_LEVEL.debug) return;
        message = this.messages[message] || message;
        message = String.format.apply(String, arguments);
        return this.write(message, Builder.LOG_LEVEL.debug);
    },

    // #endregion

    // #region 生成底层

    /**
     * 获取当前生成的次数。
     */
    counter: 0,

    /**
     * 创建一个新的执行上下文。
     */
    newContext: function () {
        this.counter++;
        this.context = { __proto__: null };
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
     * 使用当前设置的规则生成指定的文件。
     * @param {String} name 要生成的文件名称。
     * @returns {BuildFile} 返回生成的文件对象。
     */
    buildFile: function (name) {
        var file = this.createFile(name);
        this.processFile(file);
        file.save();
        return file;
    },

    /**
     * 使用当前设置的规则处理指定的文件。
     * @param {BuildFile} file 要处理的文件。
     * @returns {Boolean} 如果处理成功则返回 @true，否则返回 @false。
     */
    processFile: function (file) {
        if (this.verbose) {
            this.debug("> {0}", file.srcPath);
        }

        // 保存处理结果。
        this.files[file.name] = file;

        var lastErrorCount = this.errors.length;

        // 依次执行所有适用的规则。
        for (var i = 0; i < this.rules.length; i++) {
            var destName = this.rules[i].match(file.name);
            if (destName !== null) {
                this.processFileWithRule(file, this.rules[i], destName);
            }
        }

        return this.errors.length === lastErrorCount;
    },

    /**
     * 使用指定的规则处理指定的文件。
     * @param {BuildFile} file 要处理的文件。
     * @param {BuildRule} rule 要使用的规则。
     * @param {String} destName 生成的目标文件名。
     */
    processFileWithRule: function (file, rule, destName) {

        file.processed = true;
        if (file.name) {
            file.prevName = file.name;
        }
        file.name = destName;

        // 根据当前规则更新文件的最终内容。
        for (var i = 0; i < rule.processors.length; i++) {
            var options = { __proto__: rule.processorOptions[i] };
            var result;
            if (this.verbose) {
                result = rule.processors[i].call(rule, file, options, this);
            } else {
                try {
                    result = rule.processors[i].call(rule, file, options, this);
                } catch (e) {
                    this.error("{0}: Uncaught Error: {1}", file.srcPath, e.message);
                    break;
                }
            }
            if (result !== undefined) {
                file.content = result;
            }
        }

    },

    // #endregion

    // #region 生成

    /**
     * 使用当前设置的规则生成整个项目。
     * @param {Boolean} [clean] 指示是否在生成前清理文件夹。默认为自动清理。
     * @returns {Number} 返回本次最终生成的文件数。 
     */
    build: function (clean) {

        // 1. 准备工作。
        this.info("Start Building...");
        this.info("{srcPath} -> {destPath}", this);
        this.newContext();

        if (clean == null ? !containsDir(this.destPath, this.srcPath) : clean) {
            this.debug("> Cleaning...", this);
            try {
                IO.cleanDir(this.destPath);
            } catch (e) {
            }
        }

        // 2. 生成所有文件。
        this.debug("> Processing Files...", this);
        this.files = { __proto__: null };
        this.fileCount = 0;

        // 遍历项目并直接生成每个文件。
        this.walk(this.buildFile);

        // 3. 执行一次性规则。
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i].runOnce) {
                var file = this.createFile("", "");
                this.processFileWithRule(file, this.rules[i], this.rules[i].destName);
                file.save();
            }
        }

        // 4.输出结果。
        var fileCount = this.fileCount;
        var errorCount = this.errors.length;
        if ((this.logLevel >= Builder.LOG_LEVEL.log && fileCount > 0) || errorCount > 0) {
            this.info("{srcPath} -> {destPath}", this);
        }
        if (errorCount) {
            this.error("Build Completed! ({0} files saved, {1} error(s) found)", fileCount, errorCount);
        } else {
            this.success("Build Success! ({0} files saved, without errors)", fileCount, errorCount);
        }

        return fileCount;
    },

    // #endregion

    // #region 监听

    /**
     * 监听当前项目的改动并实时生成。
     * @param {String|RegExp|Function} ... 要监听的文件名称。支持通配符、正则表达式或函数表达式。
     * @returns {Watcher} 返回监听器。
     */
    watch: function () {
        var builder = this;

        // 监听的规则。
        var filter = arguments.length && createRouter(arguments);

        var watcher = require('chokidar').watch(this.srcPath).on('change', function (path) {
            builder.counter++;
            builder.buildFile(builder.getName(path));
        });

        // 忽略不需要生成的文件以提高性能。
        watcher._isIgnored = function (path, stats) {

            var name = builder.getName(path);

            if ((filter && filter.call(builder, name) === null) || builder._ignored(name) !== null) {
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
                if (builder.rules[i].match(name) !== null) {
                    return false;
                }
            }

            return true;
        };

        this.info("Watching {srcPath}...", this);
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
        var server = new (require('aspserver').HttpServer)({
            port: port,
            physicalPath: this.srcPath,
            modules: {
                buildModule: {
                    processRequest: function (context) {

                        // 生成当前请求相关的文件。
                        builder.counter++;
                        var file = new BuildFile(builder, context.request.path.slice(1));

                        // 如果当前路径被任一规则处理，则响应处理后的结果。
                        if (builder.processFile(file) && file.processed) {
                            context.response.contentType = server.mimeTypes[file.extension];
                            context.response.write(file.data);
                            context.response.end();
                            return true;
                        }

                        return false;
                    }
                }
            },
            mimeTypes: this.mimeTypes
        });

        server.on('start', function () {
            builder.info("Server Running At {rootUrl}", this);
        });

        server.on('stop', function () {
            builder.info("Server Stopped At {rootUrl}", this);
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
     * 获取指定规则匹配到的所有文件名称。
     * @param {String} rule 要处理的规则。
     * @returns {Array} 返回名称数组。
     */
    getFilesByRule: function (rule) {

        // 特定的规则直接获取对应文件列表。
        if (isSpecifiedName(rule.srcNames)) {
            return rule.srcNames;
        }

        var result = [];
        this.walk(function (name) {
            if (rule.match(name) !== null) {
                result.push(name);
            }
        });
        return result;
    },

    /**
     * 根据指定过滤器返回匹配的文件列表。
     * @param {String|RegExp|Function} ... 要获取的文件或文件夹路径。支持通配符、正则表达式或函数表达式。
     * @returns {Array} 返回名称数组。
     */
    getFilesByFilter: function () {
        return this.getFilesByRule(new BuildRule(arguments));
    },

    /**
     * 获取指定名称对应的文件实例。如果文件未生成则提前生成。
     * @param {String} name 要获取的文件名称。
     * @returns {BuildFile} 返回对应的文件实例。如果文件未生成则先生成，否则返回已生成的文件。 
     */
    getFile: function (name) {
        return this.files[name] || this.buildFile(name);
    },

    /**
     * 添加一个已生成的文件。
     * @param {String} name 生成的文件名。
     * @param {String} content 生成的文件的内容。
     * @param {Boolean} [process=true] 是否按正常流程生成文件。
     * @returns {BuildFile} 返回文件对象。
     */
    addFile: function (name, content, process) {
        var file = this.createFile("", content);
        file.name = name;
        process !== false && this.processFile(file);
        file.save();
        return file;
    },

    /**
     * 获取或设置所有需要上传到 CDN 的路径。
     * @name cdnPaths
     * @example 如：{"assets/": "http://cdn.com/assets/"} 表示路径 assets/ 最终将发布到 http://cdn.com/assets/。
     */

    /**
     * 添加一个名称发布后对应的 CDN 地址。
     * @param {String} name 要添加的文件夹名称。
     * @param {String} url 设置该 CDN 的地址。
     * @example builder.addCdn("assets", "http://cdn.com/assets");
     */
    addCdn: function (name, url) {
        this.cdnPaths[appendSlash(name.toLowerCase())] = appendSlash(url);
    },

    /**
     * 获取指定名称发布后对应的 CDN 地址。
     * @param {String} name 要处理的名称。
     * @returns {String} 返回 CDN 地址。如果 @name 无对应的 CDN 地址则返回 @null。
     */
    getCdn: function (name) {
        var nameLower = name.toLowerCase();
        for (var cdnPrefix in this.cdnPaths) {
            if (nameLower.startsWith(cdnPrefix)) {

            }
        }
        return this.cdnPaths[name] || null;
    },

    /**
     * 获取或设置所有虚拟路径。
     * @name virtualPaths
     * @example 如：{"/": "../"} 表示地址 / 映射到 ../ 所在目录。
     */

    /**
     * 获取指定虚拟路径指定对应的绝对地址。
     * @param {String} name 要处理的名称。
     * @returns {String} 返回绝对地址。如果 @name 无对应的 CDN 地址则返回 @null。
     */
    mapPath: function (name) {
        return this.cdnPaths[name] || null;
    },

    // #endregion

};

module.exports = Builder;

// #endregion

// #region BuildFile

/**
 * 表示一个生成文件。一个生成文件可以是一个物理文件或虚拟文件。
 * @param {Builder} builder 当前文件所属的创建器。
 * @param {String} [name] 当前文件的名称。
 * @param {String} [content] 当前文件的内容。如果为 @undefined 则从路径读取。
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
        return Path.join(this.builder.srcPath, this.srcName);
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
        return this.destName && Path.join(this.builder.destPath, this.destName);
    },

    /**
     * 获取当前文件的最终保存名称。
     */
    get name() {
        return this.destName;
    },

    /**
     * 设置当前文件的最终保存名称。
     */
    set name(value) {
        var oldName = this.destName;
        this.destName = value;
        this.emit('redirect', oldName);
    },

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
        this.name = value && this.builder.getName(value);
    },

    _buffer: null,

    _content: null,

    /**
     * 标记内容已更新。
     */
    _contentUpdated: false,

    /**
     * 获取当前文件的最终保存文本内容。
     * @type {String}
     */
    get content() {
        if (this._content == null) {
            this._content = this._buffer != null ? this._buffer.toString(this.builder.encoding) : this.load(this.builder.encoding);
        }
        return this._content;
    },

    /**
     * 设置当前文件的最终保存文本内容。
     * @type {String}
     */
    set content(value) {
        this._content = value;
        this._buffer = null;
        this._contentUpdated = true;
        this.emit('change');
    },

    /**
     * 获取当前文件的最终保存二进制内容。
     * @type {Buffer}
     */
    get buffer() {
        if (this._buffer === undefined) {
            this._buffer = this._content != null ? new Buffer(this._content) : this.load();
        }
        return this._buffer;
    },

    /**
     * 设置当前文件的最终保存二进制内容。
     * @type {Buffer}
     */
    set buffer(value) {
        this._buffer = value;
        this._content = null;
        this._contentUpdated = true;
        this.emit('change');
    },

    /**
     * 获取当前文件的数据。
     * @type {Buffer|String} 返回二进制或文本数据。
     */
    get data() {
        return this._buffer != null ? this._buffer : this.content;
    },

    /**
     * 获取当前文件的源文件夹路径。
     */
    get srcDirPath() {
        return Path.dirname(this.srcPath);
    },

    /**
     * 获取当前文件的目标文件夹路径。
     */
    get destDirPath() {
        return Path.dirname(this.destPath);
    },

    /**
     * 获取当前文件的扩展名。
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
     */
    get canSave() {
        return !!this.destName && containsDir(this.builder.destPath, this.destPath);
    },

    /**
     * 从硬盘载入当前文件的内容。
     * @param {String} [encoding] 解析文本内容的编码。
     * @return {String|Buffer} 如果指定了编码则返回文件文本内容，否则返回文件数据。
     */
    load: function (encoding) {
        this.emit('load');
        var srcPath = this.srcPath;
        try {
            return encoding ? IO.readFile(srcPath, encoding) : IO.existsFile(srcPath) ? FS.readFileSync(srcPath) : new Buffer(0);
        } catch (e) {
            this.builder.error("{0}: Cannot Read File: {1}", srcPath, e);
            return '';
        }
    },

    /**
     * 保存当前文件内容。
     * @return {Boolean} 如果成功保存则返回 @true，否则返回 @false。
     */
    save: function () {

        // 执行处理器。
        this.emit('save');

        // 如果目标名称为 null，表示删除文件。
        if (!this.destName) {
            this.builder.log("D {0}", this.srcName);
            return false;
        }

        // 获取目标保存路径。
        var destPath = this.destPath;

        // 只能生成 destPath 下的文件。
        if (!containsDir(this.builder.destPath, destPath)) {
            return false;
        }

        // 内容发生改变则存储文件。
        if (this._contentUpdated) {
            try {
                IO.ensureDir(destPath);
                if (this._buffer != null) {
                    FS.writeFileSync(destPath, this._buffer);
                } else {
                    FS.writeFileSync(destPath, this._content, this.builder.encoding);
                }

            } catch (e) {
                this.builder.error("{0}: Cannot Write File: {1}", destPath, e);
                return false;
            }
            this.builder.log(this.srcName === this.destName ? "M {0}" : this.srcName ? "M {0} -> {1}" : "A {1}", this.srcName, this.destName);
            this.builder.fileCount++;
            this.emit('saved');

            return true;
        }

        // 仅路径改变则简单复制文件。
        var srcPath = this.srcPath;
        if (srcPath !== destPath) {
            try {
                IO.copyFile(srcPath, destPath);
            } catch (e) {
                this.builder.error("{0}: Cannot Copy File: {1}", destPath, e);
                return false;
            }
            this.builder.log(this.srcName === this.destName ? "C {1}" : "C {0} -> {1}", this.srcName, this.destName);
            this.builder.fileCount++;
            this.emit('saved');

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
     * 添加当前文件生成时发生的错误。并将错误信息追加到文件内部。
     * @param {String} title 错误的标题。
     * @param {Error} [error] 错误的详细信息。
     * @param {String} [message] 指定错误的信息。
     * @param {String} [path] 指定发生错误的位置。
     * @param {Number} [line] 错误的行号。
     * @param {Number} [column] 错误的列号。
     */
    addError: function (title, error, message, path, line, column) {

        // 填充参数信息。
        error = error || title;
        if (message == null) message = error.message || error.toString();
        if (path == null) path = error.filename || this.srcPath;
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
        this.builder.error("{0}: {1}", path, message);

        // 文本文件追加错误信息。
        if (this._content != undefined) {
            this.content = String.format("/*\r\n\
\r\n\
\t{0}: \r\n\
\t\t{1}\r\n\
\t\tAt {2)\r\n\
\r\n\
*/\r\n\r\n", title, message, path) + this.content;
        };

        // 调试时直接终止错误。
        if (this.builder.verbose) {
            throw error;
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
            get content() {
                return this.data;
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

        sourceMapOptions.data = typeof sourceMap === "string" ? JSON.parse(sourceMap) : sourceMap;

        // 将 sourceMap 中路径转为绝对路径。
        var sourceMapDir = Path.dirname(sourceMapOptions.path);
        sourceMapOptions.data.sources = sourceMapOptions.data.sources.map(function (soruce) {
            return Path.join(sourceMapDir, soruce);
        });

        // 在文件保存时生成 source-map。
        if (!this._hasSourceMap) {
            this._hasSourceMap = true;
            this.on('saved', function () {

                // 将 sourceMap 中路径转为相对。
                var sourceMapDir = Path.dirname(sourceMapOptions.path);
                sourceMapOptions.data.file = Path.relative(sourceMapDir, this.destPath).replace(/\\/g, "/");
                sourceMapOptions.data.sources = sourceMapOptions.data.sources.map(function (soruce) {
                    return Path.relative(sourceMapDir, soruce).replace(/\\/g, "/");
                });

                this.builder.addFile(sourceMapOptions.name, JSON.stringify(sourceMapOptions.data), false);
            });
        }

    },

    /**
     * 判断当前文件是否符合指定的模式表达式。
     * @param {String|RegExp|Function|Null} ... 要判断的文件名称。支持通配符、正则表达式或函数表达式。
     * @returns {Boolean} 
     */
    match: function () {
        var filter = createRouter(arguments);
        return filter.call(this.builder, this.srcName) !== null;
    },

    /**
     * 获取指定相对路径表示的实际名称。
     * @param {String} relativeName 要处理的相对路径。如 ../a.js
     * @param {String} [rootName] 路径 / 表示的路径。
     */
    resolveName: function (relativeName, rootName) {
        return Path.join(/^\//.test(relativeName) ? rootName || "" : Path.dirname(this.srcName), relativeName || "").replace(/\\/g, '/');
    },

    /**
     * 获取指定相对路径表示的实际路径。
     * @param {String} relativePath 要处理的相对路径。如 ../a.js
     * @param {String} [rootPath] 路径 / 表示的路径。
     */
    resolvePath: function (relativePath, rootPath) {
        return Path.join(/^\//.test(relativePath) ? rootPath || this.srcPath : Path.dirname(this.srcPath), relativePath || "");
    },

    /**
     * 创建在当前文件内引用指定路径所使用的路径占位符。
     * @param {BuildFile} file 引用的文件。
     * @remark
     * 由于发布过程中文件的位置可能发生改变，文件内部的相对路径可能因此而失效。
     * 因此为了方便程序处理，在解析文件时将文件内的相对路径使用绝对路径占位符的
     * 方式进行临时保存，在文件真正保存前才替换回相对路径。
     */
    createPathPlaceholder: function (file) {
        if (!this._hasPathPlaceholder) {
            this._hasPathPlaceholder = true;
            this.on('save', function () {
                var file = this;
                this.content = this.content.replace(/tpack:\/\/(.*?)\?/g, function (_, name) {
                    // 将文件的最终路径转为相对位置。如果目标文件发布后被删除，则使用源路径。
                    return file.relativeName(name);
                });
            });
        }
        return 'tpack://' + (file.destName || file.prevName || file.srcName) + '?';
    },

    /**
     * 获取在当前文件内引用指定名称所使用的相对路径。
     * @param {String} name 要处理的名称。如 styles/test.css（注意不能是绝对路径）
     */
    relativeName: function (name) {

        // 判断 name 是否需要发布到 CDN。
        var nameLower = name.toLowerCase();
        for (var cdnPrefix in this.builder.cdnPaths) {
            if (nameLower.startsWith(cdnPrefix)) {
                return this.builder.cdnPaths[cdnPrefix] + name.substr(cdnPrefix.length);
            }
        }

        // 将路径转为当前目标路径的绝对路径。


        return this.cdnPath != null && name.toLowerCase().startsWith(this.cdnPath.toLowerCase()) ? (this.cdnUrl || ("/" + this.cdnPath)) + name.substr(this.cdnPath.length) : Path.relative(Path.dirname(this.destName), name).replace(/\\/g, '/');
    },

    // #endregion

};

exports.BuildFile = BuildFile;

// #endregion

// #region BuildRule

/**
 * 表示一个生成规则。
 * @param {Array} filter 当前规则的过滤器数组。
 * @class
 */
function BuildRule(filter) {
    this.srcNames = filter;
    this._srcNamesRouter = createRouter(this.srcNames);
    this.ignores = [];
    this.processors = [];
    this.processorOptions = [];
    this.runOnce = !this.srcNames.length;
}

BuildRule.prototype = {

    constructor: BuildRule,

    /**
     * 使用当前规则匹配指定的名称返回匹配的结果。
     * @param {String} name 要匹配的名称。
     * @return {String} 如果匹配返回当前规则设置的目标名称。否则返回 @null。
     */
    match: function (name) {
        return this._ignored && this._ignored(name) !== null ? null : this._srcNamesRouter(name, this.destName);
    },

    _ignored: null,

    /**
     * 为当前规则添加一个忽略项。
     * @param {String|RegExp|Function|Null} ... 要忽略的文件或文件夹路径。支持通配符、正则表达式或函数表达式。
     * @returns this 
     */
    ignore: function () {
        this.ignores.push.apply(this.ignores, arguments);
        this._ignored = createRouter(this.ignores);
        return this;
    },

    /**
     * 为当前规则添加一个处理器。
     * @param {Function} processor 要追加的处理器。
     * @param {Object} [processorOptions] 传递给处理器的配置对象。
     * @returns this 
     */
    pipe: function (processor, processorOptions) {
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
        this.destName = name === null ? '' : name.replace(/^\//, "");
        return this;
    }

};

exports.BuildRule = BuildRule;

// #endregion

// #region createRouter

/**
 * 判断一个父文件夹是否包含指定子文件夹。
 * @param {String} parent 父文件夹路径。
 * @param {String} child 子文件夹路径。
 * @returns {} 
 */
function containsDir(parent, child) {
    return child.toLowerCase().startsWith(parent.toLowerCase());
}

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
 * 创建一个名称路由器，其可将符合要求的名称进行重定向。
 * @param {String|RegExp|Function|Null} filter 允许重定向的名称过滤器。可以是通配字符串、正则表达式、函数、空(表示不符合任何条件)或以上过滤器组合的数组。
 * @returns {Function} 返回一个路由器函数。此函数的参数为：
 * * @param {String} srcName 要重定向的输入名称。
 * * @param {Array} [destName=@srcName] 要重定向的目标路径（其中 $n 会被替换为 @srcName 中的匹配部分)。
 * * @return {String} 如果不符合过滤器，则返回 @null。否则返回 @destName，如果 @destName 为空则返回 @srcName。
 */
function createRouter(filter) {

    // createRouter(/.../)
    if (filter instanceof RegExp) {
        return function (srcName, destName) {
            var match = filter.exec(srcName);
            return match ? destName != undefined ? destName.replace(/\$(\d+)/g, function (all, n) {
                return n in match ? match[n] : all;
            }) : srcName : null;
        };
    }

    switch (typeof filter) {

        // createRouter([...])
        case "object":
            if (filter.length > 1) {
                filter = Array.prototype.map.call(filter, createRouter);
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
            return createRouter(filter[0]);

            // createRouter("*.sources*")
        case "string":
            return createRouter(new RegExp("^" + filter.replace(/([-.+^${}|()[\]\/\\])/g, '\\$1').replace(/\*/g, "(.*)").replace(/\?/g, "([^/])") + "(\/|$)", "i"));

            // createRouter(function(){ ... })
        case "function":
            return function (srcName, destName) {
                var match = filter.apply(this, arguments);
                return match === true ? destName != undefined ? destName : srcName : match === false ? null : match;
            };

            // createRouter()
        default:
            return function () {
                return null;
            };
    }

}

exports.createRouter = createRouter;

// #endregion
