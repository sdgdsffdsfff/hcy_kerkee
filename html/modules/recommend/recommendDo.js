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
    function RecommendDo(){
        this.share={};
    }

    RecommendDo.prototype.render=function(){
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
        // widget.setPullToRefreshWebView(true);
    };
    RecommendDo.prototype.loadData=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
               $.ajax({
                    url:t.host+'/api/v1/client/ucenter/my-link',
                    dataType:'json',
                    timeout:10000,
                    headers:{'Cookie': t.cookie },
                    data:{
                        platform:util.OS(),
                        token:'',
                        ts: Date.now()
                    },
                    success:function(data){
                        if(!!data){
                            t.share=data;
                            // clientInfo.dataDownloadFinished();
                            $('.loading-pop').removeClass('active');
                            var newsHtml = util.compileTempl("recommendContent", data);
                            $('.pagewrap').append(newsHtml);
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
            }else{
                $('.loading-pop').removeClass('active');
                widget.loadState();
            }
        });
        
    };

    RecommendDo.prototype.userEvents=function(){
        var t=this;
        $('body').on('tap','.invitebtn',function(){
            //分享
            widget.share(t.share);
        });
    };


    RecommendDo.prototype.init=function(){
        var t=this; 
        userCenterApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new RecommendDo();
});