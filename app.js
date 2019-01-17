/*

    创建一个简单的http服务器
 */

var http = require('http');
var baseDir = '';
var path = require('path');
var fs = require('fs');

http.createServer(function (req, res, next) {
    var url = req.url;
    if (url == '/') {
        url = 'index.html';
    }

    var index = url.indexOf('?');
    if (index != -1) {
        url = url.substring(0, index);
    }

    //读取文件

    var ap = path.join(__dirname, baseDir, url);

    var exists = fs.existsSync(ap);
    if (!exists) {
        res.writeHead(404);
        res.end('not found.')
        return;
    }


    var readerStream = fs.createReadStream(ap);
    readerStream.pipe(res);
    // readerStream.on('data', function (data) {
    //
    // });
    //
    // res.end(url);

}).on('error',function (err) {
    console.error(err);
}).listen(3000);