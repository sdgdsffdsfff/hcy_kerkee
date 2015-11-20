/** setup gulp:
 npm install -g gulp
 npm install --save-dev gulp
 npm install --save-dev gulp-jshint
 **/

//基本使用方式：(1).保持原始模块:copyall -> umin -> zip  (2).使用r.js+ almond模块合并: rjs -> rmin -> zip

var gulp = require('gulp');
var fs = require('fs');
var gulpLoadPlugins = require("gulp-load-plugins");
var plugins = gulpLoadPlugins();
var pkg = require("./package.json");
var log4js = require("log4js");
var shell  = require('gulp-shell');
var path     = require("path");
var through  = require("through2");
var util     = require("gulp-util");
var Q = require('q');
var debug = true;

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

var config_basePath=".";
var config_devRootDir="html";


/*开发路径定义，分开发目录和生产目录*/
var basePath = config_basePath;//pkg.path;//pkg.project;
var depsPath = pkg.dependModule+ "/"+config_devRootDir;
var devPath = basePath + "/" + config_devRootDir;
var destPath = basePath + "/target";
var tempPath = destPath + "/temp";

var createLog =function(){
    return through.obj(function (file, enc, callback) {
        util.log(">>", util.colors.yellow(path.relative(process.cwd(), file.path)));
        callback(null, file);
    });
};

//构建app
var modules={
    app:"special",
    appDo:"special",
    title:"专题列表"
}

var tmod={
    name:"article"
};

//日志台控制
log4js.configure(pkg.log4js);
var logger = log4js.getLogger('cheese');
logger.setLevel('INFO');    // trace|debug|info|warn|error|fatal

/*
 * @desc  js压缩
 * @deps  none
 * @src   destPath/js/*.js
 * @dest  destPath/js
 */
gulp.task('jsmin', function () {
    return gulp.src(destPath + '/**/*.js')
        .pipe(plugins.uglify())
        //.pipe(plugins.concat("all.js"))
        //.pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(destPath));
});

/*
 * @desc  js压缩
 * @deps  none
 * @src   destPath/js/*.js
 * @dest  destPath/js
 */
gulp.task("svp",function(){
    return gulp.src([
        devPath + '/tmod/svp'+"/baseLib.min.20150615.js",
        devPath + '/tmod/svp'+"/coreLib.min.20150615.js",
        devPath + '/tmod/svp'+"/foxPlayer.min.20150615.js"])
       .pipe(plugins.concat("video.js"))
       .pipe(gulp.dest(devPath + '/tmod/svp/dest'))
       .pipe(createLog());
});


/*
 * @desc  js语法检测
 * @deps  none
 * @src   none
 * @dest  none
 */
gulp.task('jshint', function () {
    return gulp.src([devPath + '/modules/**/*.js', devPath + '/vendor/api/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
});

/*
 * @desc js less语言构建，将less转成css
 * @deps none
 * @src  devPath/less/*.less
 * @dest devPath/css
 */
gulp.task('less', function () {
    return gulp.src(devPath + '/less/test.less')
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer('last 2 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest(devPath + '/css'));
});

/*
 * @desc css压缩
 * @src  devPath/css/*.css
 * @deps less
 * @dest destPath/css
 */
gulp.task("cssmin", function () {
    return gulp.src(destPath + '/css/*.css')
        .pipe(plugins.minifyCss({keepBreaks: true}))
        .pipe(gulp.dest(destPath + '/css'));
});

/*
 * @desc css构建&合并
 * @src  destPath/css
 * @deps cssmin
 * @dest destPath/css
 */
gulp.task("csscat", ['cssmin'], function () {
    return gulp.src(destPath + '/css/*.css')
        .pipe(plugins.concat("all.css"))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(destPath + '/css'))
});

/*
 * @desc httpServer服务启动-开发目录
 * @src  devPath
 * @deps none
 * @dest devPath
 * @host 0.0.0.0
 * @port 3001
 */
gulp.task("server", function () {
    gulp.src(devPath)
        .pipe(plugins.webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            host: "0.0.0.0",
            fallback: 'index.html',
            port: "3001",
            enable: true
        }));
});

/*
 * @desc httpServer服务启动-生产目录
 * @src  devPath
 * @deps none
 * @dest devPath
 * @host 0.0.0.0
 * @port 3001
 */
gulp.task("online", function () {
    gulp.src(destPath)
        .pipe(plugins.webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            host: "0.0.0.0",
            fallback: 'index.html',
            port: "3002",
            enable: true
        }));
});

/*
 * @desc  css,js引入资源自动嵌入（需要是真实存在的文件资源）
 * @deps  none
 * @src   devPath/*.html
 * @dest  destPath
 * @eg    <!--include:js(js/app/media.js)--> / <!-- include:css(css/allmin.css) -->
 */
gulp.task("include", function () {
    return gulp.src(devPath + '/modules/**/*.html')
        .pipe(plugins.includeSource())
        .pipe(gulp.dest(tempPath));
});

/*
 * @desc 将所有资源项目中的block删除
 * @src  devPath
 * @deps none
 * @dest destPath
 * @demo<!--removeIf(production)--><!--endRemoveIf(production)-->
 */
gulp.task('xspace', ["include"], function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(plugins.removeCode({production: true}))
        .pipe(gulp.dest(tempPath))
});

/*
 * @desc  js模板构建，页面写占位符，编译后生成页面
 * @deps  rjs
 * @src   devPath/*.html
 * @dest  destPath
 * @demo  <%=name%>
 */
gulp.task("template", ["xspace"], function () {
    return gulp.src(tempPath + '/**/*.html')
        //.pipe(plugins.template({name: 'jenking',age:27}))
        .pipe(plugins.data(function () {
            return {name: 'shframework', version: "1.0", title: "output"};
        }))
        .pipe(plugins.template())
        .pipe(gulp.dest(tempPath));
});

/*
 * @desc  css,js引入资源进行块范围替换
 * @deps  none
 * @src   destPath/*.html
 * @dest  destPath
 * @tag  <!-- build:css --><!-- endbuild -->
 */
gulp.task('replace', function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(plugins.htmlReplace({
            css: {
                src: '../../all.min',
                tpl: '<link href="%s.css" rel="stylesheet"/>'
            }
        }))
        .pipe(gulp.dest(tempPath));
});

/*
 * @desc  压缩html
 * @deps  replace
 * @src   destPath/*.html
 * @dest  destPath
 */
gulp.task("htmlmin", ["template"], function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(plugins.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destPath + "/modules"));
});


/*
 * @desc  拷贝tmod
 * @deps  none
 * @src   dev/template/*.html
 * @dest  destPath
 */
gulp.task("tmod", function () {
    var module_tpl = tmod.name;
    return gulp.src(devPath + '/tmod/' + module_tpl + '/dev/*.html')
        .pipe(plugins.tmod({
            base: devPath + '/tmod/' + module_tpl + '/dev',
            combo: true,
            minify: true,
            cache: true,
            type: "default",    //default、cmd、amd、commonjs
            helpers: devPath + '/tmod/' + module_tpl + '/dev/helpers/template-helper.js',
            output: devPath + '/tmod/' + module_tpl
        }));
});

gulp.task("tmove", ["tmod"], function () {
    var module_tpl = tmod.name;
    return gulp.src(devPath + '/tmod/' + module_tpl+'/template.js')
        .pipe(gulp.dest(devPath + "/modules/"+module_tpl));
});

/*
 * @desc  给css/js打上md5 tag
 * @deps  none
 * @src   destPath/*.html
 * @dest  destPath
 */
gulp.task("md5", function () {
    return gulp.src(devPath + "/css/*.css")
        .pipe(plugins.md5Plus(10, destPath + "/*.html"))
        .pipe(gulp.dest(destPath + "/css/"));
});

/*
 * @desc  拷贝资源css文件
 * @deps  none
 * @src   devPath
 * @dest  destPath
 */
gulp.task("copycss", function () {
    console.log("copy css....");
    return gulp.src(devPath + "/css/*.css")
        .pipe(gulp.dest(destPath + "/css"));
});

/*
 * @desc  拷贝SHFramework的资源
 * @deps  none
 * @src   devPath
 * @dest  destPath
 */
gulp.task("copyshf", function () {
    gulp.src([
        depsPath+"/modules/**/*",
    ])
    .pipe(gulp.dest(devPath+"/modules/"));

    gulp.src([
        depsPath+"/css/**/*",
    ])
    .pipe(gulp.dest(devPath+"/css/"));

    gulp.src([
        depsPath+"/images/**/*",
    ])
    .pipe(gulp.dest(devPath+"/images/"));

    gulp.src([
        depsPath+"/attach/**/*",
    ])
    .pipe(gulp.dest(devPath+"/attach/"));
});

/*
 * @desc  拷贝资源js文件
 * @deps  none
 * @src   devPath
 * @dest  destPath
 */
gulp.task("copyjs", function () {
    console.log("copy js....");
    return gulp.src(devPath + "/js/*.js")
        .pipe(gulp.dest(destPath + "/js"));
});

/*
 * @desc  监听指定文件夹中内容变化，完成自动构建
 * @deps  none
 * @src   devPath
 * @dest  destPath
 */
gulp.task("watch", function (event) {
    if (debug) {
        gulp.watch(devPath + '/modules/**/*.html', ['xspace']);
        gulp.watch(devPath + '/less/**/*', ["less"]);
    }
});

gulp.watch([devPath + '/modules/**/*.html', devPath + '/modules/**/*.js', devPath + '/css/*.css']).on('change', function (event) {
    console.info('Event type: ' + event.type);
    console.info('Event path: ' + event.path);
    plugins.livereload.changed
});

/*
 * @desc 构建app
 * @src  devPath
 * @deps cleanCss,cleanScript
 * @dest devPath
 */
gulp.task('startapp',function () {
    return gulp.src([devPath + '/tmod/app/app.tpl',devPath + '/tmod/app/appDo.tpl',devPath + '/tmod/app/app.html',devPath + '/tmod/app/app.css'])
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(devPath + '/tmod/app/dest'))
        .pipe(createLog());
});

gulp.task('app',["startapp"],function () {
    gulp.src([devPath + '/tmod/app/dest/app.tpl',devPath + '/tmod/app/dest/appDo.tpl',devPath + '/tmod/app/dest/app.html'])
        .pipe(plugins.data(function () {
            return {app: modules.app, appDo:modules.appDo,title:modules.title};
        }))
        .pipe(plugins.template())
        .pipe(gulp.dest(devPath + '/tmod/app/dest'))
        .pipe(createLog());
});

gulp.task('appcopy',function () {
    gulp.src(devPath + '/tmod/app/dest/app.tpl')
        .pipe(plugins.rename({
            basename: modules.app,
            extname: ".js"
        }))
        .pipe(gulp.dest(devPath + '/modules/'+modules.app))
        .pipe(createLog());

    gulp.src(devPath + '/tmod/app/dest/app.css')
        .pipe(plugins.rename({
            basename: modules.app,
            extname: ".css"
        }))
        .pipe(gulp.dest(devPath + '/css'))
        .pipe(createLog());

    gulp.src(devPath + '/tmod/app/dest/appDo.tpl')
        .pipe(plugins.rename({
            basename: modules.app+"Do",
            extname: ".js"
        }))
        .pipe(gulp.dest(devPath + '/modules/'+modules.app))
        .pipe(createLog());

    gulp.src([devPath + '/tmod/app/dest/*.html'])
        .pipe(plugins.rename({
            basename: modules.app,
            extname: ".html"
        }))
        .pipe(gulp.dest(devPath + '/modules/'+modules.app))
        .pipe(createLog());
});

/*
 * @desc 清空构建目录
 * @src  destPath
 * @deps none
 * @dest destPath
 */
gulp.task("cleanTarget", function () {
    return gulp.src(destPath, {read: true})
        .pipe(plugins.clean());
});

gulp.task("copyall", ["copylib", "cleanTarget"], function () {
    return gulp.src(devPath + "/**/*").pipe(gulp.dest(destPath));
    console.log("copy finished");
});


gulp.task("copylib", function () {
    return gulp.src(devPath + "/bridgeLib.js").pipe(gulp.dest(devPath + "/attach/js"));
});

/*
 * @desc 将缓存文件删除
 * @src  tempPath
 * @deps none
 * @dest destPath
 */
gulp.task('cleanTemp', function () {
    return gulp.src([tempPath, destPath + "/*.txt", destPath + "/less", destPath + "/tpl", destPath + "/tmod", destPath + "/vendor/lib/underscore.js", destPath + "/build", basePath + "/bin", destPath + "/modules/liveonline"])
        .pipe(plugins.clean());
});

/*
 * @desc 将所有资源项目用r.js进行压缩合并
 * @src  devPath
 * @deps cleanRjs
 * @dest destPath
 */
gulp.task('rjs', ["copylib","cleanTarget"], function () {
    var spawn = require('child_process').spawn;
    var run = spawn('sh', ['-m', devPath + '/build/rjs.sh']);
    var start = +new Date();
    run.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    run.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    run.on('exit', function (code) {
        var end = +new Date();
        console.log("total:" + (end - start).toString() + "ms");
    });
});

/*
 * @desc 压缩html
 * @src  devPath
 * @deps rjs,replace,htmlmin
 * @dest devPath
 */
gulp.task('rhmin', ["htmlmin"], function () {
    console.log("html min");
});

/*
 * @desc 使用rjs进行代码合并
 * @src  devPath
 * @deps rjs,replace,htmlmin,zip
 * @dest devPath
 */
gulp.task('rmin', ["xspace"], function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(gulp.dest(destPath + "/modules"))
        .pipe(plugins.notify({message: 'rmin project complete'}));

});

/*
 * @desc 编译html模板
 * @src  destPath
 * @deps none
 * @dest destPath
 */
gulp.task("parseTemp", function () {
    return gulp.src(destPath + '/modules/**/*.html')
        .pipe(plugins.data(function () {
            return {name: 'shframework', version: "1.1", title: "output"};
        }))
        .pipe(plugins.template())
        .pipe(gulp.dest(destPath + "/modules"));
});

/*
 * @desc 使用uglifyjs进行代码合并
 * @src  devPath
 * @deps rjs,replace,htmlmin,zip
 * @dest devPath
 */
gulp.task('umin', ["jsmin", "cssmin"], function () {
    console.log("umin ok");
});

/*
 * @desc 将所有资源项目打包压缩并加上时间戳
 * @src  devPath
 * @deps cleanCss,cleanScript
 * @dest devPath
 */
gulp.task('zip', ["cleanTemp"], function () {
    var timesup=new Date().format("MMddhhmmss");

    gulp.src([destPath + '/**/*'])
        .pipe(plugins.zip("html_"+timesup+".zip"))
        .pipe(gulp.dest(basePath + "/bin"))
        .pipe(plugins.notify({message: 'coprass dev complete'}));

    gulp.src([devPath + '/**/*'])
        .pipe(plugins.zip("dev_"+timesup+".zip"))
        .pipe(gulp.dest(basePath + "/bin"))
        .pipe(plugins.notify({message: 'coprass dest complete'}));
});

gulp.task("send",shell.task([
    'python sendInfo.py'
]));

/*
 * @desc 读取modules下的目录结构
 * @src  devPath/modules
 * @dest devPath
 */
gulp.task('amdmod', function () {
    var scanFolder=function(path){
        var fileList = [],
            folderList = [],
            walk = function(path, fileList, folderList){
                files = fs.readdirSync(path);
                files.forEach(function(item) {
                    var tmpPath =  path + '/'+ item,
                        stats = fs.statSync(tmpPath);

                    if (stats.isDirectory()) {
                        walk(tmpPath, fileList, folderList);
                        folderList.push(tmpPath);
                    } else {
                        fileList.push(tmpPath);
                    }
                });
            };

        walk(path, fileList, folderList);

        return {
            'files': fileList,
            'folders': folderList
        }
    };
    var nameList=scanFolder(devPath+"/modules");
    var filesList=scanFolder(devPath+"/modules");
    var modules=[""];
    var files="\n";

    nameList.folders.forEach(function(v,i){
        var _obj={};
        var _name= v.substring(v.lastIndexOf("/")+1, v.length);
        if(_name!="helper"){
            _obj.name=_name+"/"+_name;
            _obj.include=["almond",_name+"/"+_name+"Do"];
        }else{
            return true;
        }
        modules.push(_obj);
    });
    console.log(modules);
    console.log("---------------(__)(-.-)(~o~)∣(-_-)∣(*_*) (`~~`)--------------");

    filesList.files.forEach(function(v){
        if(v.search(/html$/)>0){
            var _name= v.substring(v.lastIndexOf("/")+1, v.length);
            var _path= v.substring(v.search(/modules/), v.length);
            if(_name!="helper"){
                files+="/"+_name;
                files+="\t";
                files+="\t";
                files+="\t";
                files+="\t";
                files+="\t";
                files+="\t";
                files+="/"+_path+"\n";
                files+="\n";
            }else{
                return true;
            }
        }else{
            return true;
        }
    });
    console.log(files);
});



// =====================================================================================

/*
 * @desc 将所有资源项目用r.js进行压缩合并
 * @src  devPath
 * @deps copylib cleanTarget
 * @dest destPath
 */
gulp.task('rjsCompression', ["copylib","cleanTarget"], function () {
    var deferred = Q.defer();

    var spawn = require('child_process').spawn;
    var run = spawn('sh', ['-m', devPath + '/build/rjs.sh']);
    var start = +new Date();
    run.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    run.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    run.on('exit', function (code) {
        var end = +new Date();
        console.log("total:" + (end - start).toString() + "ms");
        deferred.resolve();
    });

    return deferred.promise;
});
/*
 * @desc  css,js引入资源自动嵌入（需要是真实存在的文件资源）
 * @deps  rjsCompression
 * @src   devPath/*.html
 * @dest  tempPath
 * @eg    <!--include:js(js/app/media.js)--> / <!-- include:css(css/allmin.css) -->
 */
gulp.task("contain", ["rjsCompression"], function () {
    return gulp.src(devPath + '/modules/**/*.html')
        .pipe(plugins.includeSource())
        .pipe(gulp.dest(tempPath));
});
/*
 * @desc 将所有资源项目中的block删除
 * @src  tempPath
 * @deps none
 * @dest tempPath
 * @demo<!--removeIf(production)--><!--endRemoveIf(production)-->
 */
gulp.task('remove', ["contain"], function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(plugins.removeCode({production: true}))
        .pipe(gulp.dest(tempPath))
});
/*
 * @desc 使用includeSource插件替换代码
 * @src  tempPath
 * @deps remove
 * @dest destPath
 */
gulp.task('replace', ["remove"], function () {
    return gulp.src(tempPath + '/**/*.html')
        .pipe(gulp.dest(destPath + "/modules"))
        .pipe(plugins.notify({message: 'rmin project complete'}));

});
/*
 * @desc 将缓存文件删除
 * @src  tempPath destPath
 * @deps replace
 * @dest destPath
 */
gulp.task('cleanTempDir', ["replace"], function () {
    return gulp.src([tempPath, destPath + "/*.txt", destPath + "/less", destPath + "/tpl", destPath + "/tmod", destPath + "/vendor/lib/underscore.js", destPath + "/build", basePath + "/bin", destPath + "/modules/liveonline"])
        .pipe(plugins.clean());
});
/*
 * @desc 将所有资源项目打包压缩并加上时间戳
 * @src  devPath destPath
 * @deps cleanCss,cleanScript
 * @dest basePath/bin
 */
gulp.task('compression', ["cleanTempDir"], function () {
    var timesup=new Date().format("MMddhhmmss");

    gulp.src([destPath + '/**/*'])
        .pipe(plugins.zip("html_"+timesup+".zip"))
        .pipe(gulp.dest(basePath + "/bin"))
        .pipe(plugins.notify({message: 'coprass dev complete'}));

    return gulp.src([devPath + '/**/*'])
        .pipe(plugins.zip("dev_"+timesup+".zip"))
        .pipe(gulp.dest(basePath + "/bin"))
        .pipe(plugins.notify({message: 'coprass dest complete'}));
});

/*
 * @desc 项目构建
 */
gulp.task('build', ["compression"], function () {
    console.log("build ok");
});
