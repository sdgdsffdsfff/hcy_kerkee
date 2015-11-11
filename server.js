/**
 * Created by huangjian on 15-4-5.
 */
var http = require('http'),
    url = require('url'),
    fs=require('fs'),
    qs = require('querystring'),
    request=require("request"),
    pkg = require("./package.json"),
    port=3002;

//日志台控制
var log4js = require("log4js");
log4js.configure(pkg.log4js);
var logger = log4js.getLogger('cheese');
logger.setLevel('INFO');    // trace|debug|info|warn|error|fatal

/*
request("http://jenking.sinaapp.com/index.php/Home/Index/data",function(err,response,body){
    if(!err && response.statusCode==200){
        console.log(body);
    }
});

request
    .get('https://www.baidu.com/img/bd_logo1.png')
    .on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
    })
    .pipe(request.put('http://mysite.com/img.png'));
*/

//var live="http://www.taikongfeizhu.com/ip.php";
var live="http://api.k.sohu.com/api/news/v4/article.go?channelId=&apiVersion=29&gid=-1&imgTag=1&newsId=62063782&openType=0&u=5&p1=NjAxMjIzODg3Nzc3NDIyOTU4Mg%3D%3D&pid=-1&recommendNum=3&refer=130&rt=json&showSdkAd=1";
var getUrl=url.parse(live).query;
//var param=qs.parse(getUrl);

http.createServer(function (req, res) {
    if (req.url === '/test') {
        if (req.method === 'GET' || req.method === 'HEAD') {
            request(live,function(err,response,body){
                if(!err && response.statusCode==200){
                    res.setHeader('Content-Type', 'application/json;charset=utf8');
                    res.end(body);
                    console.log(body)
                }
            });
        }
    }
}).listen(port, function(){
    console.log('http://127.0.0.1:' + port);
});
