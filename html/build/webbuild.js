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
            name: 'index/index',
            include: [
                'almond', 
                'index/indexDo', 
                'crossplatform/base/injectionPage', 
                'crossplatform/base/registerModule',
                'injectionPage/indexapiPage',
                'interFace/clientinfoInterFace',
                'interFace/indexapiInterFace',
                'interFace/widgetInterFace'
            ]
        },{
            name: 'city/city',
            include: [
                'almond', 
                'city/cityDo', 
                'crossplatform/base/injectionPage', 
                'crossplatform/base/registerModule',
                'injectionPage/cityapiPage',
                'interFace/clientinfoInterFace',
                'interFace/cityapiInterFace',
                'interFace/widgetInterFace'
            ]
        },{
            name: 'recommend/recommend',
            include: ['almond', 'recommend/recommendDo']
        },{
            name: 'recommendlist/recommendlist',
            include: ['almond', 'recommendlist/recommendlistDo']
        },{
            name: 'recommenddetail/recommenddetail',
            include: ['almond', 'recommenddetail/recommenddetailDo']
        },{
            name: 'jobsummary/jobsummary',
            include: ['almond', 'jobsummary/jobsummaryDo'] 
        },{
            name: 'recommenduserlist/recommenduserlist',
            include: ['almond', 'recommenduserlist/recommenduserlistDo'] 
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
        crossplatform: "../crossplatform",
        interFace: "../crossplatform/interface",
        injectionPage: "../crossplatform/injectionPage",
        swiper: "../vendor/lib/swiper.min",
        jquery: '../vendor/lib/jquery-2.1.3',
        zepto:"../vendor/lib/zepto.min",
        swiper: "../vendor/lib/swiper.min",
        fastclick: "../vendor/lib/fastclick",
        lazyload:"../vendor/lib/jquery.lazyload",
        template: '../vendor/lib/template',
        when: '../vendor/lib/when',
        orgwhen: '../vendor/lib/orgwhen',
        almond:"../vendor/plugin/almond",
        underscore: '../vendor/lib/underscore',
        domReady: '../vendor/plugin/domReady',
        text: '../vendor/plugin/require.text',
        css: '../vendor/plugin/require.css',
        text_path:"../modules",     // eg:"text!text_path/channel.tpl.html"
        css_path:"../css",           // eg:"css!css_path/new.css"
        crossplatform_css_path:"../crossplatform/static/css"           // eg:"css!crossplatform_css_path/new.css"
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