/**
 * Created by jianhuang on 2015/1/9.
 */
var util  = require('util'),
    spawn = require('child_process').spawn,
    run = spawn('sh', ['-m','./run.sh']);

var start = +new Date();
run.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

run.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

run.on('exit', function (code) {
    var end = + new Date();
    console.log("共耗时长:"+(end-start).toString()+"ms");
});
