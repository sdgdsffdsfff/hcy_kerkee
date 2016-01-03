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
    function RecommenddetailDo(){
        // this.pageSize=20;
        this.page=1;
        this.canNextRequest=false;
        this.timer=null;
        this.netWork=true;
        this.id=util.getQueryString('job_id');
    }

    RecommenddetailDo.prototype.render=function(){
        var t=this;
        fastclick.attach(document.body);
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
            // clearTimeout(t.timer);
            // t.timer=setTimeout(function(){
            //     if(($(document).height() - $(window).height())-window.pageYOffset<=50 && t.canNextRequest){
            //         $('.loadingList').removeClass('displayNone');
            //         t.loadData();  
            //     }
            // },400);//两次数据加载时间间隔
            
        });
    };

    RecommenddetailDo.prototype.userEvents=function(){
        $('body').on('click','.return-top',function(){
            window.scroll(0,0);
        });
    };


    RecommenddetailDo.prototype.loadData=function(){
        var t=this;
        var url=t.host+'/api/v1/client/ucenter/post-user-list';
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:url,
                    data:{
                        // pageSize:t.pageSize,
                        postId:t.id,
                        // page:t.page,
                        ts:new Date().getTime(),
                        platform:util.OS(),
                        token:''
                    },
                    timeout:10000,
                    headers:{'Cookie': t.cookie },
                    dataType:'json',
                    beforeSend:function(){
                        t.canNextRequest=false;
                    },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        $('.loadingList').addClass('displayNone');
                        if(!!data && !data.list){
                            // if(t.page==1){
                            //     widget.loadState();
                            // }else{
                            //     widget.toast('网络错误，请刷新重试');
                            // }
                            widget.loadState();
                        }else if(!!data && !!data.list && data.list.length>0){
                            t.canNextRequest=true;
                            try{
                                var newsHtml = util.compileTempl("recommendDetailList", data);   
                            }catch(e){
                                widget.loadState();
                                return;
                            }
                            $('.recommend-dtl-wrap').append(newsHtml); 
                            // clientInfo.dataDownloadFinished();  
                            t.page++;
                        }else if (!!data && !!data.list && data.list.length==0){
                            t.canNextRequest=true;
                            // if(t.page==1){
                            //     $('.J_emptyBox').removeClass('displayNone');
                            // }else{
                            $('.noMoreList').removeClass('displayNone');
                            // } 
                        }else{
                            t.canNextRequest=true;
                            // if(t.page==1){
                            //     widget.loadState();
                            // }else{
                            //     widget.toast('网络错误，请刷新重试');
                            // }
                            widget.loadState();
                        }
                    },
                    error:function(){
                        t.canNextRequest=true;
                        $('.loadingList').addClass('displayNone');
                        $('.loading-pop').removeClass('active');
                        // if(t.page==1){
                        //     widget.loadState();
                        // }else{
                        //     widget.toast('网络错误，请刷新重试');
                        // }
                        widget.loadState();
                    }
                });
            }else{
                t.canNextRequest=false;
                $('.loading-pop').removeClass('active');
                $('.loadingList').addClass('displayNone');
                // if(t.page==1){
                //     widget.loadState();
                // }else{
                //     widget.toast('网络错误，请刷新重试');
                // }
                widget.loadState();
            }
        });
        
    };



    RecommenddetailDo.prototype.init=function(){
        var t=this; 
        userCenterApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new RecommenddetailDo();
});