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
    function DetailDo(){
        this.id=util.getQueryString('job_id');
        this.netWork=true;
    }

    DetailDo.prototype.render=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network=='invalid'){
                t.netWork=false;
            }
        });

        if(t.netWork){
            t.loadData();
        }else{
            widget.loadState();
        } 
    };

    DetailDo.prototype.loadData=function(){
        var t=this;
        detailApi.getDetailData(t.id,function(data){
            $('.loading-pop').removeClass('active');
            if(!!data && !!data.id){
                //给客户端准备的数据
                //工作地址列表
                window.postList=function(){
                    var postListLen=0;
                    if(!!data.post_addr_list){
                        postListLen=data.post_addr_list.length;
                    }
                    var addList=data.post_addr_list;
                    var arr=[];
                    for(var i=0;i<postListLen;i++){
                        var json={};
                        json.name=addList[i].city_name+addList[i].district_name+addList[i].street_name+addList[i].address;
                        json.postId=addList[i].id;
                        arr.push(json);
                    }
                    return arr;
                }

                //分享数据
                window.share=function(){
                    return {
                        title:$('.shareTitle').html(),
                        url:data.detail_url,
                        img:'../../images/logo_app.png',
                        text:this.$('.jobContent').find('dd').text().substring(0,29)
                    };
                }

                //报名状态
                window.applyStatus=function(){
                    var json={};
                    json.can_apply=data.can_apply;
                    json.has_subsidy=data.has_subsidy;
                    json.contact_phone=data.contact_phone;
                    var arr=[];
                    arr.push(json);
                    return arr;
                }

                var newsHtml = util.compileTempl("detailText", data);
                $('.detail-box').append(newsHtml);
                clientInfo.dataDownloadFinished();
            }else{
                widget.loadState();
            }
        });
    };

    DetailDo.prototype.init=function(){
        var t=this;
        detailApi.start(function () {
            t.render();
        });
    };

    return new DetailDo();
});



