#!/usr/bin/env node

var Path = require('path');
var FS = require('fs');
var IO = require('tutils/io');

main();

function main() {
    
    // 优先考虑使用本地安装的 tpack 版本。
    var localCli = IO.searchDirs("node_modules/tpack/bin/tpack-cli.js");
    if (localCli && __filename !== localCli) {
        return module.exports = require(localCli);
    }
    
    // 载入 tpack 库。
    var tpack = module.exports = require('../lib/index.js');
    
    // 载入配置。
    var options = parseArgv(process.argv);
    var t;
    
    // -cwd, --cwd
    if (t = options["-cwd"] || options['cwd']) {
        process.chdir(t);
    }
    
    // -c, -config, --config
    if (options.config = IO.searchDirs(options['-config'] || options['config'] || options['c'] || "tpack.config.js")) {
        if (Path.dirname(options.config) !== process.cwd()) {
            process.chdir(Path.dirname(options.config));
        }
    } else {
        options.config = Path.join(__dirname, "../lib/tpack.config.js");
    }
    
    // -dest, -out, -o
    if (t = options['dest'] || options['out'] || options['o']) {
        tpack.destPath = t;
    }
    
    // -ignore, -i
    if (t = options['ignore'] || options['i']) {
        tpack.ignore(t.split(";"));
    }
    
    // -verbose, -debug, -d
    if (options['verbose'] || options['debug'] || options['d']) {
        tpack.verbose = true;
    }
    
    // --colors, -colors
    if (options['-colors'] || options['colors']) {
        tpack.coloredOutput = true;
    }
    
    // --no-colors, -no-colors
    if (options['-no-colors'] || options['no-colors']) {
        tpack.coloredOutput = false;
    }
    
    // -error, -e
    if (options['error'] || options['e']) {
        tpack.logLevel = tpack.LOG_LEVEL.error;
    }
    
    // -warn
    if (options['warn']) {
        tpack.logLevel = tpack.LOG_LEVEL.warn;
    }
    
    // -info
    if (options['info']) {
        tpack.logLevel = tpack.LOG_LEVEL.info;
    }
    
    // -log
    if (options['log']) {
        tpack.logLevel = tpack.LOG_LEVEL.log;
    }
    
    // -silence, -s
    if (options['silence'] || options['s']) {
        tpack.logLevel = tpack.LOG_LEVEL.none;
    }
    
    // -lang
    if ((options.lang = options['lang'] || 'zh-cn') != 'en-us') {
        try {
            tpack.messages = require('../i18n/' + options.lang + '.js');
        } catch (e) {
            
        }
    }
    
    // 支持载入全局模块。
    if (options['global'] !== false) {
        try {
            require('require-global')([Path.resolve(__dirname, "../../"), Path.resolve(__dirname, "../node_modules/")]);
        } catch (e) {
        }
    }
    
    // 执行 tpack.config.js
    require(options.config);
    
    // 自动执行默认任务。
    return tpack.task(options[0] || "default", options);
    
}

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
