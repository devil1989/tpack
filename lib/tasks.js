
var tpack = require('./index.js');

// 默认任务。
tpack.task('default', function (options) {
    
    // -v, -version, --version
    if (options["-version"] || options["version"] || options["v"]) {
        console.log(require('../package.json').version);
        return;
    }
    
    // -h, --help, -?
    if (options["-help"] || options["h"] || options["?"]) {
        return tpack.task("help", options);
    }
    
    // -watch, -w
    if (options["watch"] || options["w"]) {
        return tpack.task("watch", options);
    }
    
    // -server, -s
    if (options["server"] || options["s"]) {
        return tpack.task("server", options);
    }
    
    // 其它任务默认作为生成操作。
    return tpack.task("build", options);


});

// 生成任务。
tpack.task('build', tpack.build);

// 监听任务。
tpack.task('watch', tpack.watch);

// 服务器任务。
tpack.task('server', tpack.startServer);

// 启动服务器任务。
tpack.task('open', tpack.openServer);

// 帮助任务。
tpack.task("help", function (options) {
    console.log('Usage: tpack task-name [Options]');
    console.log('Defined Tasks:');
    console.log('');
    for (var cmdName in tpack.tasks) {
        console.log('\t' + cmdName);
    }
});

// 初始化任务。
tpack.task("init", function (options) {
    var config = options.config;
    var IO = require('tutils/io.js');
    if (IO.existsFile(options.config)) {
        tpack.builde.log("File already exists: '{0}'. Nothing done.", config);
        return;
    }
    
    IO.copyFile(Path.resolve(__dirname, "tpack.config.js"), config);
    tpack.builder.success("File created at: '{0}'", config);
});

// 任务简写。
tpack.task('w', 'watch');
tpack.task('start', 'server');
tpack.task('s', 'start');
tpack.task('boot', 'open');
tpack.task('b', 'boot');
tpack.task('h', 'help');
