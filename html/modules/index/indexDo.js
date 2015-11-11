/**
 * Created by huohcunyang on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'clientApi/util',
        'clientApi/indexApi',
        'clientApi/phoneSlideApi',
        'domReady!'
    ],

    function ($,clientInfo,widget,util,indexApi,phoneSlideApi) {

        /*
         * 构造函数
         */
        function indexDo(){
            this.netWork = true;
            this.host = '';
        }

        /*
         * 渲染方法
         * @method render
         * @public
         * @return {Null}
         * @example
         *      this.render();
         * @since 1.0.0
         */
        indexDo.prototype.render=function(){

            var t = this;

            clientInfo.getNetworkType(function(data){
                if(data.network=='invalid'){
                    t.netWork=false;
                }
            });

            clientInfo.getHost(function(host){
                t.host=host.info;
                if(t.netWork){
                    t.loadData(function(){
                        // 调用轮播组件
                        phoneSlideApi({
                            wrapSelector : '.slide',
                            autoLoop : true,
                            loopTime : 3000,
                        });
                    });
                }else{
                    widget.loadState();
                }     
            });

        };

        /*
         * 加载数据
         * @method loadData
         * @public
         * @param {Function} callBack 回调函数
         * @return {Null}
         * @example
         *      this.loadData(function(){
         *          // something...
         *      });
         * @since 1.0.0
         */
        indexDo.prototype.loadData = function(callback){
            // http://www.doumi.com/api/v1/client/index?lat=0&lng=0
            var t = this;
            $.ajax({
                url : t.host + "/api/v1/client/index",
                success : function(data){

                    console.log(data.focus_imgs);
                    var caseHtml = t.loadDataFn('caselistwrap', data);
                    $('.navbox').html(caseHtml);

                    var focusImgHtml = t.loadDataFn('focus-img-tpl', data);
                    $('.slide').html(focusImgHtml);

                    var postsHtml = t.loadDataFn('content-list-tpl', data);
                    $('.mod-label-listwrap').html(postsHtml);

                    if(callback) {
                        callback();
                    }
                    
                },
                error : function(){
                    widget.toast('网络错误，请刷新重试');
                }
            });
        }

        /*
         * 加载数据，对模板解析的封装
         * @method loadDataFn
         * @public
         * @param {String} tmlId 模板ID
         * @param {Object} data 数据
         * @return {String} html 解析后的html字符串
         * @example
         *      this.loadDataFn('tplid', data);
         * @since 1.0.0
         */
        indexDo.prototype.loadDataFn = function(tmlId, data){
            var html = util.compileTempl(tmlId, data);
            return html;
        },

        /*
         * 初始化方法
         * @method init
         * @public
         * @example
         *      this.init();
         * @since 1.0.0
         */
        indexDo.prototype.init=function(){
            var t=this; 
            
            // t.render();
            indexApi.start(function () {
                t.render();
            });
        };

        return new indexDo();
    });