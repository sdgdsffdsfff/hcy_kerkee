/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'clientApi/util',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,clientInfo,util,widget,userCenterApi) {
    function InviteCodeDo(){
        this.page=1;
        this.scrollPage=false;
    }

    InviteCodeDo.prototype.render=function(){
        var t=this;
        userCenterApi.inviteCode(function(data){
            $('.loading-pop').removeClass('active');
            if(!!data.invite_code && data.invite_code!=''){
                var dataArr=data.invite_code.split('');
                var dataJson={};
                dataJson.invite_code=dataArr;
                var newsHtml = util.compileTempl("content", dataJson);
                $('.pagewrap').append(newsHtml);
            } 
        });
    };


    // InviteCodeDo.prototype.userEvents=function(){
    //     $('body').on('tap','.shareTo',function(){
    //         //分享
    //         widget.share({
    //             title:'',
    //             img:'',
    //             text:'',
    //             url:''
    //         });
    //     });
    // };

    InviteCodeDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            // t.userEvents();
        });
    };

    return new InviteCodeDo();
});
