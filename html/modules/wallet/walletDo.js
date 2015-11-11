/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'template',
    'clientApi/clientUI',
    'clientApi/clientInfo',
    'clientApi/util',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,template,clientUI,clientInfo,util,widget,userCenterApi) {
    function WalletDo(){
        this.page=1;
        this.scrollPage=false;
    }

    WalletDo.prototype.render=function(){
        var t=this;
        userCenterApi.userBalance(function(data){
            $('.btnbox').removeClass('displayNone');
            $('.loading-pop').removeClass('active');
            var newsHtml = util.compileTempl("userBalance", data);
            $('.userBalanceBox').append(newsHtml);
        });
        t.loadList(t.page);
    };

    WalletDo.prototype.loadList=function(page){
        var t=this;
        userCenterApi.cashList(t.page,function(dataList){
            t.scrollPage=true;
            if(dataList.data.length==0 && page!=1 && $('.listBox').html()!=''){
                $('.loadingList').addClass('displayNone');
                $('.noMoreList').removeClass('displayNone');
                t.scrollPage=false;
                return;
            }
            var newsHtml = util.compileTempl("cashList", dataList);
            $('.listBox').append(newsHtml);
        });    
    };

    WalletDo.prototype.userEvents=function(){
        $('body').on('tap','.btnbox',function(){
            userCenterApi.applyCash();
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
            if(($(document).height() - $(window).height())-window.pageYOffset<=50 && t.scrollPage){
                $('.loadingList').removeClass('displayNone');
                t.page++;
                t.loadList(t.page);  
            }
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

