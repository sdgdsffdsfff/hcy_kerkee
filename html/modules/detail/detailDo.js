/**
 * Created by liyong on 2015/11/10.
 */
define([
    'zepto',
    'clientApi/clientInfo',
    'clientApi/util',
    'fastclick',
    'api/nativeUI/widget',
    'clientApi/detailApi',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,clientInfo,util,fastclick,widget,detailApi,userCenterApi) {
    function DetailDo(){
        this.id=util.getQueryString('job_id');
    }

    DetailDo.prototype.render=function(){
        fastclick.attach(document.body);
        var t=this;
        clientInfo.getHost(function(host){
            t.host=host.info;
            userCenterApi.userStatus(function(data){
                if(data.status==true){
                    t.cookie=data.cookie;
                    clientInfo.addLog('0','职位详情页_展现量&已登录&');
                }else{
                    t.cookie='';
                    clientInfo.addLog('0','职位详情页_展现量&未登录&');
                }
                t.loadData();
            });      
        });
    };

    DetailDo.prototype.loadData=function(){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                //有网
                $.ajax({
                    //http://www.doumi.com/api/v1/client/detail/100256?ts=1448344395489
                    url:t.host + '/api/v1/client/detail/' + t.id,
                    dataType:'json',
                    timeout:10000,
                    headers:{'Cookie': t.cookie },
                    data:{
                        token:'',
                        platform:util.OS(),
                        ts: Date.now()
                    },
                    success:function(data){
                        $('.loading-pop').removeClass('active');
                        if(!!data && !!data.id){
                            /**
                            *给客户端准备的数据 
                            *start
                            */
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
                            };

                            //分享数据
                            window.share=function(){
                                return {
                                    title:data.title,
                                    url:data.detail_url,
                                    img:data.image,
                                    text:data.job_content.substring(0,29)
                                };
                            };

                            //报名状态 是否有邀请码 电话
                            window.applyStatus=function(){
                                var json={};
                                json.can_apply=data.can_apply;
                                json.has_subsidy=data.has_subsidy;
                                json.contact_phone=data.contact_phone;
                                var arr=[];
                                arr.push(json);
                                return arr;
                            };

                            //报名成功提示
                            window.applySuccess=function(qcordImg,data){
                                // data=new Function('return '+data)();
                                // console.log(data);
                                data.qcordImg=qcordImg;
                                var newsHtml = util.compileTempl("successPop", data);
                                $('.detail-box').append(newsHtml);
                            };
                            
                            /**
                            *给客户端准备的数据 
                            *end
                            */
                            var newsHtml = util.compileTempl("detailText", data);
                            $('.detail-box').append(newsHtml);
                            clientInfo.dataDownloadFinished();
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
                //无网
                $('.loading-pop').removeClass('active');
                widget.loadState(); 
            }
        });
        
    };

    DetailDo.prototype.userEvents=function(){
        var t=this;
        $('body').on('click','.J_successPopBtn',function(){
            $('.mask').remove();
            $('.J_successPop').remove();
        });
        $('body').on('click','.J_morePostAdd',function(){
            clientInfo.addLog('0','职位详情页_更多地址&&');
        });
    };

    DetailDo.prototype.init=function(){
        var t=this;
        detailApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new DetailDo();
});



