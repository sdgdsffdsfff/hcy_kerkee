/**
 * Created by zihong on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'clientApi/util',
        'clientApi/listApi',
        'domReady!'
    ],

    function ($,clientInfo,widget,util,listApi) {
        function ListDo(){
            this.pageSize=20;
            this.page=1;
            this.canNextRequest=false;
            this.timer=null;
            this.netWork=true;
        }

        ListDo.prototype.render=function(){
            var t=this;
            //每次初始化，首先取参数
            listApi.getOptions(function(data){
                t.param=util.json2url(data);
            });
            clientInfo.getNetworkType(function(data){
                if(data.network=='invalid'){
                    t.netWork=false;
                }
            });
            clientInfo.getHost(function(host){
                t.host=host.info;
                if(t.netWork){
                    t.loadData(false);
                }else{
                    $('.loading-pop').removeClass('active');
                    widget.loadState();
                }     
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
                        t.loadData(false);  
                    }
                },400);//两次数据加载时间间隔
                
            }); 

            //客户端调用函数，传参getArgList,1:重新获取参数，0:使用当前参数
            window.loadData=function(getArgList){
                if(t.netWork){
                    t.page=1;
                    if(getArgList===1){
                        //重新获取参数
                        listApi.getOptions(function(data){
                            t.param=util.json2url(data);
                            t.loadData(true);
                        });
                    }else{
                        t.loadData(true);
                    } 
                }else{
                    $('.loading-pop').removeClass('active');
                    widget.loadState(); 
                }
                  
            }; 
        };

        ListDo.prototype.userEvents=function(){
            $('body').on('click','.return-top',function(){
                window.scroll(0,0);
            });
        };

    
        ListDo.prototype.loadData=function(loadagain){
            var t=this;
            var url=t.host+'/api/v1/client/list?'+t.param;
            $.ajax({
                url:url,
                data:{
                    pageSize:t.pageSize,
                    page:t.page,
                    ts:new Date().getTime()
                },
                dataType:'json',
                beforeSend:function(){
                    t.canNextRequest=false;
                },
                success:function(data){
                    $('.loading-pop').removeClass('active');
                    $('.loadingList').addClass('displayNone');
                    $('.noMoreList').addClass('displayNone');
                    if(!!data && !!data.data && data.data.length>0){
                        t.canNextRequest=true;
                        // console.log(data);
                        try{
                            var newsHtml = util.compileTempl("listView", data);   
                        }catch(e){
                            widget.loadState();
                            return;
                        }
                        if(loadagain){
                           $('.mod-padding-list').html('').append(newsHtml);
                        }else{
                           $('.mod-padding-list').append(newsHtml); 
                        }
                        clientInfo.dataDownloadFinished();  
                        t.page++;
                    }else if (!!data && !!data.data && data.data.length==0){
                        t.canNextRequest=false;
                        $('.loadingList').addClass('displayNone');
                        $('.noMoreList').removeClass('displayNone');
                        if(loadagain){
                            if(t.page==1){
                               $('.mod-padding-list').html(''); 
                            }
                            clientInfo.dataDownloadFinished();
                        }
                    }else{
                        t.canNextRequest=false;
                        if(t.page==1){
                            widget.loadState();
                        }else{
                            widget.toast('网络错误，请刷新重试');
                        }
                        if(loadagain){
                            clientInfo.dataDownloadFinished();
                        } 
                    }
                },
                error:function(){
                    t.canNextRequest=false;
                    $('.loading-pop').removeClass('active');
                    if(loadagain){
                        clientInfo.dataDownloadFinished();
                    }
                    if(t.page==1){
                        widget.loadState();
                    }else{
                        widget.toast('网络错误，请刷新重试');
                    }   
                }
            });
        };



        ListDo.prototype.init=function(){
            var t=this; 
            listApi.start(function () {
                t.render();
                t.userEvents();
            });
        };

        return new ListDo();
    });