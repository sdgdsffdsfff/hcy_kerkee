({
    /*npm install requirejs -g*/
    /*node r.js -o build.js*/
    appDir: '../',                   //相对build.js的当前路径的所属地址
    baseUrl: './modules',            //定位到appDir后，找到js脚本相对页面地址的位置
    dir: '../../target',             //生成的文件地址
    modules: [
        {
            name: 'test/test',
            include: ['almond', 'test/testDo']
        },{
            name: 'list/list',
            include: ['almond', 'list/listDo']
        },{
            name: 'detail/detail',
            include: ['almond', 'detail/detailDo']
        },{
            name: 'jobaddress/jobaddress',
            include: ['almond', 'jobaddress/jobaddressDo']
        },{
            name: 'login/login',
            include: ['almond', 'login/loginDo']
        },{
            name: 'account/account',
            include: ['almond', 'account/accountDo']
        },{
            name: 'wallet/wallet',
            include: ['almond', 'wallet/walletDo']
        },{
            name: 'applylist/applylist',
            include: ['almond', 'applylist/applylistDo']
        },{
            name: 'invitecode/invitecode',
            include: ['almond', 'invitecode/invitecodeDo']
        },{
            name: 'index/index',
            include: ['almond', 'index/indexDo']
        },{
            name: 'city/city',
            include: ['almond', 'city/cityDo']
        }
    ],
    fileExclusionRegExp: /(^build)|(.idea)|(gulpfile.js)|(gulp.sh)|(package.json)|(.gitignore)|(tpl)|(less)$/,
    optimizeCss: 'standard', /* none|standard|standard.keepLines|standard.keepComments|standard.keepComments.keepLines */
    removeCombined: true,
    inlineText: false,
    //optimize: "none",

    waitSeconds: 10,

    '*':{
        'text':'../vendor/plugin/require.text',
        'css':'../vendor/plugin/require.css'
    },


    paths: {
        api:"../vendor/api",
        bridgeLib: "../bridgeLib",
        jquery: '../vendor/lib/jquery-2.1.3',
        zepto:"../vendor/lib/zepto.min",
        fastclick: "../vendor/lib/fastclick",
        lazyload:"../vendor/lib/jquery.lazyload",
        template: '../vendor/lib/template',
        when: '../vendor/lib/when',
        orgwhen: '../vendor/lib/orgwhen',
        almond:"../vendor/plugin/almond",
        domReady: '../vendor/plugin/domReady',
        text: '../vendor/plugin/require.text',
        css: '../vendor/plugin/require.css',
        text_path:"../modules",     // eg:"text!text_path/channel.tpl.html"
        css_path:"../css"           // eg:"css!css_path/new.css"
    },

    shim: {
        "bridgeLib": {
            exports: "bridgeLib"
        },

        "video": {
            exports: "video"
        },

        'zepto': {
            exports: '$'
        },

        when:{
            deps:['zepto'],
            exports:"when"
        },

        'template': {
            exports: "template"
        },

        lazyload: {
            deps: ['zepto'],
            exports: "lazyload"
        }
    }

})