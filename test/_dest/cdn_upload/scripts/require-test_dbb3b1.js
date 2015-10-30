
// 同步加载模块，发布后包会被打包到当前文件。
console.log("a");
/*_include:0*/
../../tpack:/d:/mywork/Node/node_modules/tpack/test/d:/mywork/Node/node_modules/tpack/test/libs/partC/c.js#();

//// 异步加载模块，发布后包不会被打包进来
//// require(['./page1_dep_async.js'], function (module) {

//// });


var a = 6;