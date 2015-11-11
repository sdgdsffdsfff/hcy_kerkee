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
    function AccountDo(){
    }

    AccountDo.prototype.render=function(){
        var t=this;
        userCenterApi.userInfo(function(data){
            $('.loading-pop').removeClass('active');
            var newsHtml = util.compileTempl("userInfo", data);
            $('.userInfoBox').html('').append(newsHtml); 
            $('.btnbox').removeClass('displayNone');
        });
    };
    AccountDo.prototype.userEvents=function(){
        $('body').on('tap','.logoutBtn',function(){
            userCenterApi.logOut();
        });
        $('body').on('tap','.phoneCall',function(){
            clientInfo.makePhoneCall('4007333300');
        });
    };

    AccountDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new AccountDo();
});

