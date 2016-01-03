/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'clientApi/util',
    'api/nativeUI/widget',
    'fastclick',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,clientInfo,util,widget,fastclick,userCenterApi) {
    function AccountDo(){
    }

    AccountDo.prototype.render=function(){
        fastclick.attach(document.body);
        var t=this;
        clientInfo.getHost(function(host){
            t.host=host.info;
            t.getCookie();     
        });


        window.loadData=function(){
            t.getCookie();
        };
    };

    AccountDo.prototype.getCookie=function(){
        var t=this;
        userCenterApi.userStatus(function(data){
            if(data.status==true){
                t.cookie=data.cookie;
                clientInfo.addLog('0','个人中心&访问量&{"状态":"登录"}');
            }else{
                t.cookie='';
                clientInfo.addLog('0','个人中心&访问量&{"状态":"未登录"}');
            }
            t.loadData();
        });
    };

    AccountDo.prototype.loadData=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                //http://jianzhi.ganji.com/api/v1/client/ucenter/index
                $.ajax({
                    url:t.host + '/api/v1/client/ucenter/index',
                    data:{
                        platform:util.OS(),
                        token:''
                    },
                    timeout:10000,
                    headers:{'Cookie': t.cookie },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        if(!!data){
                            var newsHtml = util.compileTempl("userInfo", data);
                            $('.userInfoBox').html('').append(newsHtml); 
                            $('.btnbox').removeClass('displayNone');
                        }else{
                            $('.loading-pop').removeClass('active');
                            widget.loadState();
                        }    
                    },
                    error:function(xhr){
                        $('.loading-pop').removeClass('active');
                        var err=JSON.parse(xhr.responseText);
                        if(err.code=-100){
                            userCenterApi.logOut();
                        }else{
                            widget.loadState();
                        }
                    }
                });
            }else{
                $('.loading-pop').removeClass('active');
                widget.loadState();
            }
        });
    };

    AccountDo.prototype.userEvents=function(){
        $('body').on('click','.logoutBtn',function(){
            userCenterApi.logOut();
        });
        $('body').on('click','.phoneCall',function(){
            clientInfo.makePhoneCall('4007333300');
        });

        $('body').on('click','.listHrefBox',function(){
            var label=$(this).data('label');
            clientInfo.addLog('0','个人中心&' + label + '&');
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

