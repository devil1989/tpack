/**
 * @fileOverview 项目生成逻辑核心。
 */

var Path = require('path');
var FS = require('fs');
var IO = require('tealutility/io');
var Lang = require('tealutility/lang');

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
            this.mimeTypes = require('aspserver/configs').mimeTypes;
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
     * 当前生成器所有路径的基础路径。
     */
    basePath: "",
    
    /**
     * 当前生成器的源文件夹。
     */
    _srcPath: "",
    
    /**
     * 获取当前生成器的源文件夹。
     * @type {String}
     */
    get srcPath() {
        return this._srcPath || Path.resolve();
    },
    
    /**
     * 设置当前生成器的源文件夹。
     * @type {String}
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
     * @type {String}
     */
    get destPath() {
        return this._destPath || this.srcPath;
    },
    
    /**
     * 设置当前生成器的目标文件夹。
     * @type {String}
     */
    set destPath(value) {
        this._destPath = Path.resolve(value);
        // 由于目标文件夹被自动忽略，需要更新忽略列表。
        delete this.ignored;
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
        return Path.isAbsolute(path) ? Path.relative(this.srcPath, path).replace(/\\/g, "/") : path;
    },
    
    /**
     * 获取指定名称对应的路径。
     * @param {String} name 要处理的名称。
     * @returns {String} 返回绝对路径。格式如：“E:\www\a\b.jpg”
     */
    getPath: function (name) {
        return Path.isAbsolute(name) ? name : Path.join(this.srcPath, name);
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
        var additionalIgnores = [];
        
        // 自动忽略目标文件夹。
        if (!containsDir(this.destPath, this.srcPath)) {
            additionalIgnores.push(this.getName(this.destPath));
        }
        
        // 自动忽略 node 所在路径。
        if (process.argv[0]) {
            additionalIgnores.push(this.getName(process.argv[0]));
        }
        
        // 自动忽略当前执行的文件。
        if (process.argv[1]) {
            additionalIgnores.push(this.getName(process.argv[1]));
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
    colored: true,
    
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
        if (this.colored) {
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
        
        var watcher = require('chokidar').watch(this.srcPath).on('change', function (path) {
            builder.buildFile(builder.getName(path));
        });
        
        // 忽略不需要生成的文件以提高性能。
        watcher._isIgnored = function (path, stats) {
            
            var name = builder.getName(path);
            
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
        var server = new (require('aspserver').HttpServer)({
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
                                        return "file:///" + builder.getPath(name).replace(/\\/g, "/");
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
                        var Process = require('child_process');
                        var HttpUtility = require('aspserver/lib/httputility');
                        
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
        return Path.isAbsolute(this.srcName) ? this.srcName : Path.join(this.builder.srcPath, this.srcName);
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
        return this.destName && (Path.isAbsolute(this.destName) ? this.destName : Path.join(this.builder.destPath, this.destName));
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
        if (this.destName) {
            this.prevName = this.destName;
        }
        this.destName = value;
        this.emit('redirect');
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
        } else if (this._data instanceof Buffer) {
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
     * 获取当前文件的数据。
     * @type {Buffer|String} 返回二进制或文本数据。
     */
    get data() {
        return this._data != null ? this._data : this.content;
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
     * 判断当前文件是否是生成的文件。
     */
    get isGenerated() {
        return !this.srcName;
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
        var destPath = Path.join(this.builder.destPath, name);
        
        // 只能生成 destPath 下的文件。
        if (!containsDir(this.builder.destPath, destPath)) {
            return false;
        }
        
        // 执行处理器。
        this.emit('save', name);
        
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
            this.emit('saved');
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
        if (path == null) path = error.filename ? this.builder.getName(error.filename) : this.srcName;
        else path = this.builder.getName(path);
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
            },
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
            this.on('saved', function () {
                
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
    test: function () {
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
                    return Path.join(this.builder.virtualPaths[vp], relativePath.substr(vp.length));
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
        return this.builder.getName(this.resolvePath(relativePath));
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
        return "tpack://" + name + "?";
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
        var md5sum = require('crypto').createHash('md5');
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
