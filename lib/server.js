
var Path = require('path');


exports.batHandler = {
    processRequest: function(context) {
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

        p.stdout.on('data', function(data) {
            context.response.write(controlColorToHtml(data));
            if (data.indexOf('\r') >= 0 || data.indexOf('\n') >= 0) {
                context.response.write(scrollToEnd);
            }
        });

        p.stderr.on('data', function(data) {
            context.response.write('<span style="color:red">');
            context.response.write(controlColorToHtml(data));
            context.response.write('</span>');
            if (data.indexOf('\r') >= 0 || data.indexOf('\n') >= 0) {
                context.response.write(scrollToEnd);
            }
        });

        p.on('exit', function(code) {
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

            return HttpUtility.htmlEncode(data).replace(/\033\[([\d;]*)m/g, function(all, c) {
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
};
