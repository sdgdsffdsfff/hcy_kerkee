/**
 * Created by zihong on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'fastclick',
        'clientApi/util',
        'clientApi/listApi',
        'domReady!'
    ],

    function ($,clientInfo,widget,fastclick,util,listApi) {
        function ListDo(){
            this.pageSize=20;
            this.page=1;
            this.canNextRequest=false;
            this.timer=null;
            this.label='&';
            this.tjData={};
            this.startTimer=null;
            this.moveTimer=null;
        }

        ListDo.prototype.getTjArg=function(data){
            var t=this;
            if(data.ganji_pay==1){
                t.label='&斗米直付';
            }else if(data.order==0){
                t.label='&全部兼职';
            }else if (data.order==3){
                t.label='&高薪急聘';
            }else if (data.order==1){
                t.label='&附近兼职';
            }else{
                t.label='&全部兼职';
            }
            
        };

        ListDo.prototype.render=function(){
            fastclick.attach(document.body);
            var t=this;
            //每次初始化，首先取参数
            listApi.getOptions(function(data){
                t.param=util.json2url(data);
                t.tjData=data;
            });
            clientInfo.getHost(function(host){
                t.host=host.info;
                t.loadData(false);    
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
                        clientInfo.addLog('0','兼职列表页_翻页量&&');  
                    }
                },400);//两次数据加载时间间隔  
            });

            //客户端调用函数，传参getArgList,1:重新获取参数，0:使用当前参数
            window.loadData=function(getArgList){
                t.page=1;
                if(getArgList===1){
                    //重新获取参数
                    listApi.getOptions(function(data){
                        t.param=util.json2url(data);
                        t.loadData(true);
                        t.tjData=data;
                    });
                }else{
                    t.loadData(true);
                }     
            }; 
        };

        ListDo.prototype.userEvents=function(){
            var t=this;
            $('body').on('click','.return-top',function(){
                window.scroll(0,0);
            });
            //统计
            $('body').on('click','.J_listTj',function(){
                clientInfo.addLog('0','兼职列表页_访问详情页' + t.label + '&');
            });
            // //添加点击的阴影效果
            util.touchActiveBackground('.activeBackground');
        };

    
        ListDo.prototype.loadData=function(loadagain){
            var t=this;
            clientInfo.getNetworkType(function(data){
                if(data.network!='invalid'){
                    var url=t.host+'/api/v1/client/list?'+t.param;
                    $.ajax({
                        url:url,
                        data:{
                            platform:util.OS(),
                            token:'',
                            pageSize:t.pageSize,
                            page:t.page,
                            ts:new Date().getTime()
                        },
                        timeout:10000,
                        dataType:'json',
                        beforeSend:function(){
                            t.canNextRequest=false;
                        },
                        success:function(data){
                            $('.loading-pop').removeClass('active');
                            $('.loadingList').addClass('displayNone');
                            $('.noMoreList').addClass('displayNone');
                            t.getTjArg(t.tjData);
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
                                if(t.page==1){
                                    if(loadagain){
                                        widget.toast('网络错误，请检查设置');
                                        t.canNextRequest=true;
                                    }else{
                                        widget.loadState();
                                    }
                                }else{
                                    widget.toast('网络错误，请检查设置');
                                    t.canNextRequest=true;
                                }
                                if(loadagain){
                                    clientInfo.dataDownloadFinished();
                                } 
                            }
                        },
                        error:function(){
                            $('.loading-pop').removeClass('active');
                            $('.loadingList').addClass('displayNone');
                            if(loadagain){
                                clientInfo.dataDownloadFinished();
                            }
                            if(t.page==1){
                                if(loadagain){
                                    widget.toast('网络错误，请检查设置');
                                    t.canNextRequest=true;
                                }else{
                                    widget.loadState();
                                }
                            }else{
                                widget.toast('网络错误，请检查设置');
                                t.canNextRequest=true;
                            }   
                        }
                    });
                }else{
                    $('.loading-pop').removeClass('active');
                    $('.loadingList').addClass('displayNone');
                    clientInfo.dataDownloadFinished();
                    if(t.page==1){
                        if(loadagain){
                            widget.toast('网络错误，请检查设置');
                        }else{
                            widget.loadState();
                        }
                    }else{
                        widget.toast('网络错误，请检查设置');
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