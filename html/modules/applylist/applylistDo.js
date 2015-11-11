/**
 * Created by liyong on 2015/9/14.
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
    function ApplylistDo(){
        this.page=1;
        this.scrollPage=false;
    }

    ApplylistDo.prototype.render=function(){
        var t=this;
        t.loadList(t.page);
    };

    ApplylistDo.prototype.loadList=function(page){
        var t=this;
        userCenterApi.applyList(t.page,function(dataList){
            $('.loading-pop').removeClass('active');
            t.scrollPage=true;
            if(dataList.data.length==0 && page==1){
                $('.recommend-empty-hintbox').removeClass('displayNone');
                t.scrollPage=false;
                return;
            }
            if(dataList.data.length==0 && page!=1){
                $('.loadingList').addClass('displayNone');
                $('.noMoreList').removeClass('displayNone');
                t.scrollPage=false;
                return;
            }
            var newsHtml = util.compileTempl("applyList", dataList);
            $('.mod-label-listwrap').append(newsHtml);
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
            if(($(document).height() - $(window).height())-window.pageYOffset<=50 && t.scrollPage){
                $('.loadingList').removeClass('displayNone');
                t.page++;
                t.loadList(t.page);  
            }
        });
    };

    ApplylistDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            t.scrollLode();
        });
    };

    return new ApplylistDo();
});

