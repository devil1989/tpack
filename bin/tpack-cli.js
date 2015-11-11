#!/usr/bin/env node

var defaultTpackConfig = "tpack.config.js";

var FS = require("fs");
var Path = require('path');
var tpack = module.exports = require('../lib/index.js');

main();

function main() {
    
    // 解析命令行参数。
	var options = tpack.options;

    // -v, -version, --version
    if (options.v || options.version || options["-version"]) {
        console.log(require('../package.json').version);
        return;
    }

    // -cwd, --cwd
    if (options.cwd || options["-cwd"]) {
        process.cwd(options.cwd || options["-cwd"]);
    }
    
    // -h, -help, -?, --help
    if (options.h || options.help || options["?"]) {
        tpack.cmd = 'help';
    }
    
    // -config, --config, 
    options.config = Path.resolve(options.config || options['-config'] || defaultTpackConfig);
    
    // 支持载入全局模块。
    try {
        require('require-global')([Path.resolve(__dirname, "../../"), Path.resolve(__dirname, "../node_modules/")]);
    } catch (e) {
    }

    // 执行 tpack.config.js
    if (FS.existsSync(options.config)) {
        require(options.config);
    } else if (!tpack.builder.rules.length && tpack.srcPath === tpack.destPath && (tpack.cmd === "build" || tpack.cmd === "watch")) {
        tpack.error("Cannot find '{0}'. Use 'tpack init' to create it.", options.config);
        return;
    }
    
    // 驱动主任务。 
    tpack.run();

}
