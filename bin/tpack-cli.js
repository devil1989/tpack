#!/usr/bin/env node

const defaultTpackConfig = "tpack.config.js";

var FS = require("fs");
var Path = require('path');
var tpack = module.exports = require('../lib/index.js');

main(process.argv.slice(2));

function main(argv) {
    
    // 解析命令行参数。
    var options = parseArgv(argv);

    // -v, -version, --version
    if (options.version = options.v || options.version || options["-version"]) {
        console.log(require('../package.json').version);
        return;
    }

    // -cwd, --cwd
    if (options.cwd = options.cwd || options["-cwd"]) {
        process.cwd(options.cwd);
    }
    
    // -h, -help, -?, --help
    if (options.help = options.h || options.help || options["?"]) {
        options.help = Array.prototype.slice.call(options);
        options[0] = 'help';
        options.length = 1;
    }
    
    // -src, -in, -i
    if (options.src = options.src || options['in'] || options.i) {
        tpack.srcPath = options.src;
    }

    // -dest, -out, -o
    if (options.dest = options.dest || options.out || options.o) {
        tpack.destPath = options.dest;
    }
    
    // -verbose, -debug, -d
    if (options.verbose = options.verbose || options.debug || options.d) {
        tpack.verbose = true;
    }

    // --no-color
    if (options['no-color'] = options['no-color'] || options['-no-color']) {
        tpack.colored = false;
    }
    
    // -error, -e, -info, -silient, -s, -log
    tpack.logLevel = options.error || options.e ? tpack.LOG_LEVEL.error :
        options.log ? tpack.LOG_LEVEL.log :
        options.info ? tpack.LOG_LEVEL.info :
        options.silient || options.s ? tpack.LOG_LEVEL.none :
        tpack.logLevel;
    
    // 支持载入全局模块。
    try {
        require('require-global')([Path.resolve(__dirname, "../../"), Path.resolve(__dirname, "../node_modules/")]);
    } catch (e) {
    }

    // -config, --config, 
    options.config = Path.resolve(options.config || options['-config'] || defaultTpackConfig);
    
    // 执行 tpackCfg.js
    if (FS.existsSync(options.config)) {
        exports.configPath = options.config;
        require(options.config);
    } else if (!tpack.rules.length && !options[0]) {
        tpack.error("Cannot find `{0}`. Use `tpack init` to create it.", options.config);
        return;
    }
    
    // 驱动主任务。 
    tpack.task(options[0] || 'default', options);

}

/**
 * 解析命令提示符参数。
 * @param {Array} 原始参数数组。
 * @returns {Object} 返回键值对象。
 * @example 
 * parseArgv(["a", "-c1", "-c2", "v", "b"]) // {0: "a", c1: true, c2: "v", 1: "b"}
 */
function parseArgv(argv) {
    var result = {length: 0};
    for (var i = 0; i < argv.length; i++) {
        var arg = argv[i];
        if (/^[\-\/]/.test(arg)) {
            var value = argv[i + 1];
            var nextIsCommand = !value || /^[\-\/]/.test(value);
            if (nextIsCommand) {
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
