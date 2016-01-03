/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'template',
    'clientApi/clientUI',
    'clientApi/clientInfo',
    'clientApi/util',
    'fastclick',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,template,clientUI,clientInfo,util,fastclick,widget,userCenterApi) {
    function WalletDo(){
        this.page=1;
        this.pageSize=10;
        this.canNextRequest=false;
        this.timer=null;
    }

    WalletDo.prototype.render=function(){
        var t=this;
        fastclick.attach(document.body);

        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                t.getHostFunction();
            }else{
                $('.loading-pop').removeClass('active');
                widget.loadState();
            }
        });
    };

    WalletDo.prototype.getHostFunction=function(){
        var t=this;
        clientInfo.getHost(function(host){
            t.host=host.info;
            userCenterApi.userStatus(function(data){
                if(data.status==true){
                    t.cookie=data.cookie;
                }else{
                    t.cookie='';
                }
                t.loadList();
                t.loadBalance();
            });    
        });
    };

    WalletDo.prototype.loadBalance=function(){
        var t=this;
        $.ajax({
            url:t.host + '/api/v1/client/ucenter/balance',
            data:{
                token:'',
                platform:util.OS()
            },
            timeout:10000,
            dataType:'json',
            headers:{'Cookie': t.cookie },
            success:function(data){
                if(!!data){
                    var newsHtml = util.compileTempl("userBalance", data);
                    $('.userBalanceBox').append(newsHtml);
                }else{
                    $('.loading-pop').removeClass('active');
                    widget.loadState();
                }
            },
            error:function(){
                $('.loading-pop').removeClass('active');
                widget.loadState();
            }
        });
    };

    WalletDo.prototype.loadList=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:t.host + '/api/v1/client/ucenter/cashrecord',
                    data:{
                        page:t.page,
                        pageSize:t.pageSize,
                        platform:util.OS(),
                        token:''
                    },
                    timeout:10000,
                    dataType:'json',
                    headers:{'Cookie': t.cookie },
                    beforeSend:function(){
                        t.canNextRequest=false;
                    },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        $('.loadingList').addClass('displayNone');
                        $('.noMoreList').addClass('displayNone');
                        $('.btnbox').removeClass('displayNone');
                        if(!!data && !!data.data && data.data.length>0){
                            t.canNextRequest=true;
                            var newsHtml = util.compileTempl("cashList", data);
                            $('.listBox').append(newsHtml);
                            t.page++;
                        }else if(!!data && !!data.data && data.data.length==0) {
                            t.canNextRequest=false;
                            if(t.page>1){
                                $('.loadingList').addClass('displayNone');
                                $('.noMoreList').removeClass('displayNone');
                            }
                        }else{
                            t.canNextRequest=true;
                            if(t.page==1){
                                widget.loadState();
                            }else{
                                widget.toast('网络错误，请刷新重试');
                            }
                        }
                    },
                    error:function(){
                        t.canNextRequest=true;
                        $('.loadingList').addClass('displayNone');
                        $('.loading-pop').removeClass('active');
                        if(t.page==1){
                            widget.loadState();
                        }else{
                            widget.toast('网络错误，请刷新重试');
                        }
                    }
                });
            }else{
                t.canNextRequest=true;
                $('.loadingList').addClass('displayNone');
                $('.loading-pop').removeClass('active');
                if(t.page==1){
                    widget.loadState();
                }else{
                    widget.toast('网络错误，请刷新重试');
                } 
            }
        });   
    };

    WalletDo.prototype.userEvents=function(){
        $('body').on('click','.btnbox',function(){
            userCenterApi.applyCash();
        });
        $('body').on('click','.return-top',function(){
            window.scroll(0,0);
        });
    };

    WalletDo.prototype.scrollLode=function(){
        var t=this;
        //滚动屏幕加载数据
        $(window).on('scroll', function () {
            if(window.pageYOffset>3*$(window).height()){
                $('.return-top').addClass('active');
            }else{
                $('.return-top').removeClass('active');
            }
            clearTimeout(t.timer);
            t.timer=setTimeout(function(){
                if(($(document).height() - $(window).height())-window.pageYOffset<=50 && t.canNextRequest){
                    $('.loadingList').removeClass('displayNone');
                    t.loadList();  
                }
            },400);//两次数据加载时间间隔  
        }); 
    };

    WalletDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            t.scrollLode();
            t.userEvents();
        });
    };

    return new WalletDo();
});

