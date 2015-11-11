/**
 * Created by huochunyang on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'when',
        'clientApi/util',
        'clientApi/cityApi',
        'domReady!'
    ],

    function ($,clientInfo,widget,when,util,cityApi) {

        /*
         * 构造函数
         */
        function cityDo(){
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
        cityDo.prototype.render=function(){

            var t = this;

            clientInfo.getNetworkType(function(data){
                if(data.network=='invalid'){
                    t.netWork=false;
                }
            });

            clientInfo.getHost(function(host){
                t.host=host.info;
                if(t.netWork){

                    t.loadCityData()
                    .then(t.changeCity, function(){
                        widget.toast('网络错误，请刷新重试');
                    });

                }else{
                    widget.loadState();
                }     
            });

        };

        /*
         * 加载开通城市数据
         * @method loadCityData
         * @public
         * @param {Function} callBack 回调函数
         * @return {Null}
         * @example
         *      this.loadCityData(function(){
         *          // something...
         *      });
         * @since 1.0.0
         */
        cityDo.prototype.loadCityData = function(){
            var dfd = $.Deferred();
            $.ajax({
                type : 'GET',
                url : '/api/v1/client/citys',
                success : function(data){

                    var _data = {};
                    _data.citys = data;
                    var citysHtml = util.compileTempl('citys-tpl', _data);
                    $('.list').html(citysHtml);

                    // if(callback){
                    //     callback();
                    // }
                    dfd.resolve();

                },
                error : function(){
                    dfd.reject();
                }
            });

            return dfd.promise();
        };

        /*
         * 点击切换城市的方法
         * @method changeCity
         * @public
         * @return {Null}
         * @example
         *      this.changeCity();
         * @since 1.0.0
         */
        cityDo.prototype.changeCity = function(){
            $('.list-item').on('tap', function(){
                $('.list-item').removeClass('active');
                $(this).addClass('active');
            })
        };

        /*
         * 初始化方法
         * @method init
         * @public
         * @example
         *      this.init();
         * @since 1.0.0
         */
        cityDo.prototype.init=function(){
            var t=this; 
            cityApi.start(function () {
                t.render();
            });
        };

        return new cityDo();
    });