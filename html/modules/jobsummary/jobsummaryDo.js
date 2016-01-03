/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'api/nativeUI/widget',
    'fastclick',
    'clientApi/util',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,clientInfo,widget,fastclick,util,userCenterApi) {
    function JobsummaryDo(){
        // this.pageSize=20;
        this.page=1;
        this.canNextRequest=false;
        this.timer=null;
    }

    JobsummaryDo.prototype.render=function(){
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

    JobsummaryDo.prototype.userEvents=function(){
        $('body').on('click','.return-top',function(){
            window.scroll(0,0);
        });
    };


    JobsummaryDo.prototype.loadData=function(){
        var t=this;
        var url=t.host+'/api/v1/client/ucenter/monthly-summary';
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:url,
                    data:{
                        // pageSize:t.pageSize,
                        page:t.page,
                        ts:new Date().getTime(),
                        token:'',
                        platform:util.OS()
                    },
                    headers:{'Cookie': t.cookie },
                    dataType:'json',
                    timeout:10000,
                    beforeSend:function(){
                        t.canNextRequest=false;
                    },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        $('.loadingList').addClass('displayNone');
                        if(!!data && !!data.list && data.list.length>0){
                            t.canNextRequest=true;
                            // console.log(data);
                            try{
                                var newsHtml = util.compileTempl("jobSummaryList", data);   
                            }catch(e){
                                widget.loadState();
                                return;
                            }
                            $('.recommend-wrap').append(newsHtml); 
                            t.page++;
                        }else if (!!data && !!data.list && data.list.length==0){
                            t.canNextRequest=false;
                            $('.noMoreList').removeClass('displayNone');
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
                        $('.loadingList').removeClass('displayNone');
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
    JobsummaryDo.prototype.init=function(){
        var t=this; 
        userCenterApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new JobsummaryDo();
});