/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'clientApi/util',
    'api/nativeUI/widget',
    'clientApi/detailApi',
    'domReady!'
],

function ($,clientInfo,util,widget,detailApi) {
    function JobaddressDo(){
        this.id=util.getQueryString('job_id');
    }

    JobaddressDo.prototype.render=function(){
        var t=this;
        var url='';
        clientInfo.getHost(function(host){
            url=host.info+'/api/v1/client/detail/';
            t.loadData(url);
        });
        
    };

    JobaddressDo.prototype.loadData=function(url){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:url+t.id,
                    timeout:10000,
                    data:{
                        token:'',
                        platform:util.OS(),
                        ts:new Date().getTime()
                    },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        if(!!data && !!data.post_addr_list && !!data.post_addr_list.length){
                            var newsHtml = util.compileTempl("jobaddressList", data);
                            $('.mod-com-list').append(newsHtml); 
                        }else{
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

    JobaddressDo.prototype.init=function(){
        var t=this;
        detailApi.start(function () {
            t.render();
        });
    };

    return new JobaddressDo();
});

