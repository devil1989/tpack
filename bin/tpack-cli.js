#!/usr/bin/env node

const defaultTpackConfig = "tpack.config.js";

main();

function main() {
    
    var Path = require('path');
    var FS = require('fs');
    
    // 1. 优先考虑使用本地安装的 tpack 版本。
    try {
        var localCli = require.resolve(Path.resolve("node_modules/tpack/bin/tpack-cli.js"));
        if (__filename !== localCli) {
            return module.exports = require(localCli);
        }
    } catch (e) { }
    
    // 2. 载入 tpack 库。
    var tpack = module.exports = require('../lib/index.js');
    
    // 3. 解析内置命令行参数。
    var options = tpack.options;
    
    // -v, -version, --version
    if (options.v || options.version || options["-version"]) {
        console.log(require('../package.json').version);
        return 0;
    }
    
    // -cwd, --cwd
    if (options.cwd || options["-cwd"]) {
        process.cwd(options.cwd || options["-cwd"]);
    }
    
    // -config, --config, 
    var configName = options.config || options['-config'] || defaultTpackConfig;
    
    // 4. 从当前目录开始查找 tpack.config.js 所在目录。
    var configPath = Path.resolve(configName);
    if (!FS.existsSync(configPath)) {
        configPath = null;
        var dir = Path.resolve();
        while (dir !== '.') {
            dir = Path.dirname(dir);
            if (FS.existsSync(Path.join(dir, configName))) {
                process.cwd(dir);
                configPath = Path.join(dir, configName);
                break;
            }
        }
    }
    
    if (!configPath) {
        configPath = Path.resolve(__dirname, "../lib/tpack.config.js");
    }

    options.config = configPath;
    
    // 5. 支持载入全局模块。
    try {
        require('require-global')([Path.resolve(__dirname, "../../"), Path.resolve(__dirname, "../node_modules/")]);
    } catch (e) {
    }
    
    // 6. 执行 tpack.config.js
    require(configPath);
    
    // 7. 自动执行默认任务。
    process.nextTick(function () {
        tpack.run();
    })
    
    return 0;
    
}
