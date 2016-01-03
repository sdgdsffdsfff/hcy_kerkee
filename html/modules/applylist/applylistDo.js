/**
 * Created by liyong on 2015/9/14.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'clientApi/util',
    'fastclick',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,clientInfo,util,fastclick,widget,userCenterApi) {
    function ApplylistDo(){
        this.page=1;
        this.canNextRequest=false;
        this.timer=null;
    }

    ApplylistDo.prototype.render=function(){
        fastclick.attach(document.body);
        var t=this;
        clientInfo.getHost(function(host){
            t.host=host.info;
            userCenterApi.userStatus(function(data){
                if(data.status==true){
                    t.cookie=data.cookie;
                }else{
                    t.cookie='';
                }
                t.loadData();
            });    
        });
    };

    ApplylistDo.prototype.loadData=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:t.host + '/api/v1/client/ucenter/applylist',
                    data:{
                        page:t.page,
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
                        if(!!data && !!data.data && data.data.length>0){
                            t.canNextRequest=true;
                            var newsHtml = util.compileTempl("applyList", data);
                            $('.mod-label-listwrap').append(newsHtml);
                            t.page++;
                        }else if(!!data && !!data.data && data.data.length==0) {
                            t.canNextRequest=false;
                            if(t.page>1){
                                $('.loadingList').addClass('displayNone');
                                $('.noMoreList').removeClass('displayNone');
                            }else if (t.page==1){
                                $('.recommend-empty-hintbox').removeClass('displayNone');
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
                        $('.loadingList').addClass('displayNone');
                        t.canNextRequest=true;
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
                $('.loading-pop').removeClass('active');
                $('.loadingList').addClass('displayNone');
                if(t.page==1){
                    widget.loadState();
                }else{
                    widget.toast('网络错误，请刷新重试');
                }
            } 
        });   
    };

    ApplylistDo.prototype.scrollLode=function(){
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
                    t.loadData();  
                }
            },400);//两次数据加载时间间隔  
        }); 
    };
    ApplylistDo.prototype.userEvents=function(){
        $('body').on('click','.return-top',function(){
            window.scroll(0,0);
        });
    };

    ApplylistDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            t.scrollLode();
            t.userEvents();
        });
    };

    return new ApplylistDo();
});

