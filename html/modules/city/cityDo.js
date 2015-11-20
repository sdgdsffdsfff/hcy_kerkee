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
        'fastclick',
        'domReady!'
    ],

    function ($,clientInfo,widget,when,util,cityApi,fastclick) {

        /*
         * 构造函数
         */
        function cityDo(){
            this.netWork = true; // 判断是否有网络
            this.host = '';     // 主机域名
            this.param = ''; // 客户端参数
            // {"s_city":"喀什","city":"北京市","citydomain":"kashi","s_citydomain":"kashi"}
            this.otherCityData = null;  // 缓存 其他城市 数据
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

            fastclick.attach(document.body);

            var t = this;

            // 获取网络信息
            clientInfo.getNetworkType(function(data){
                if(data.network=='invalid'){
                    t.netWork=false;
                }
            });

            // 获取域名信息
            clientInfo.getHost(function(host){
                t.host=host.info;
                if(t.netWork){

                    // 从客户端获取参数
                    cityApi.getOptions(function(data){
                        t.param = data;

                        t.compCity(t.param.citydomain, t.param.s_citydomain, t.param.city, t.param.cityid);
                        
                    });

                    // 点击定位城市
                    $('.icon-refresh').on('click', function(){
                        $('.location').removeClass('active');
                        $('.icon-refresh').addClass('active');
                        $('.js-city-position').html('正在定位中');
                        t.getPosCity();
                    });

                    // 加载热门城市
                    t.loadTopCityData()
                    .then(function(){
                        // 点击可切换的城市，向客户端发送请求
                        
                        $('.js-change-city').off('click');
                        $('.js-change-city').on('click', function(){
                            $.proxy(t.sendDataChangeCity, this)();
                        });
                    }, function(){
                        widget.toast('网络错误，请刷新重试');
                    });

                    // 加载其他城市
                    t.loadOtherCityData()
                    .then(t.toggleCity, function(){
                        widget.toast('网络错误，请刷新重试');
                    });
                    

                }else{
                    widget.loadState();
                }     
            });

        };

        /*
         * 定位城市
         * @method getPosCity
         * @public
         * @return {Null}
         * @example
         *      this.getPosCity();
         * @since 1.0.0
         */
        cityDo.prototype.getPosCity = function(){
            var t = this;

            cityApi.getPosition(function(data){

                t.compCity(data.citydomain, t.param.s_citydomain, data.city, data.cityid);
                
            });
        
        };

        /*
         * 对比用户选择的城市与当前定位城市是否一致
         * @method showAlter
         * @public
         * @param {String} ditydomain 当前定位的城市domain
         * @param {String} s_ditydomain 用户选择的城市domain
         * @param {String} city 定位城市
         * @param {String} cityid 定位城市的id
         * @return {Null}
         * @example
         *      this.showAlter();
         * @since 1.0.0
         */
        cityDo.prototype.compCity = function(citydomain, s_citydomain, city, cityid){
            var t = this;
            $('.location').addClass('active');
            $('.icon-refresh').removeClass('active');
            $('.js-city-position').html(city);
            if(citydomain != s_citydomain){

                t.showAlter();

                $('.js-cancel').on('click', function(){
                    t.hideAlter();
                });

                // 设置更换按钮数据
                var jsonParam = {};
                jsonParam.citydomain = citydomain;
                jsonParam.cityname = city;
                jsonParam.cityid = cityid;
                // 点击更换按钮
                $('.js-change').on('click', function(){
                    t.hideAlter();
                    cityApi.changeCity(jsonParam);
                });

                
            }
        };

        /*
         * 显示切换城市提示弹窗
         * @method showAlter
         * @public
         * @return {Null}
         * @example
         *      this.showAlter();
         * @since 1.0.0
         */
        cityDo.prototype.showAlter = function(){
            var t = this;
            $('.pop').show();
            $('.mask').show();

            $('.js-cancel').on('click', function(){
                t.hideAlter();
            });
        };

        /*
         * 隐藏切换城市提示弹窗
         * @method hideAlter
         * @public
         * @return {Null}
         * @example
         *      this.hideAlter();
         * @since 1.0.0
         */
        cityDo.prototype.hideAlter = function(){
            $('.js-cancel').off('click');
            $('.js-change').off('click');
            $('.pop').hide();
            $('.mask').hide();
        };

        /*
         * 加载开通城市数据(热门城市)
         * @method loadTopCityData
         * @public
         * @param {String} host api接口域名
         * @return {Null}
         * @example
         *      this.loadTopCityData(host);
         * @since 1.0.0
         */
        cityDo.prototype.loadTopCityData = function(){
            var t = this;
            var dfd = $.Deferred();
            $.ajax({
                type : 'GET',
                // url : '/api/v1/client/citys',
                url : t.host + '/api/v1/client/citys',
                success : function(data){

                    var _data = {};
                    _data.citys = data;
                    var topCitysHtml = util.compileTempl('top-citys-tpl', _data);
                    $('.js-top-citys-wrap').html(topCitysHtml);

                    dfd.resolve();

                },
                error : function(){
                    dfd.reject();
                }
            });

            return dfd.promise();
        };

        /*
         * 加载其他城市数据
         * @method loadOtherCityData
         * @public
         * @param {String} host api接口域名
         * @return {Null}
         * @example
         *      this.loadOtherCityData(host);
         * @since 1.0.0
         */
        cityDo.prototype.loadOtherCityData = function(){
            var t = this;
            var dfd = $.Deferred();

            $.ajax({
                type : 'GET',
                // url : '/api/v1/client/provinces',
                url : t.host + '/api/v1/client/provinces',
                success : function(data){
                    
                    // 数据处理成适合模板的结构
                    var _data = {};
                    var dataLength = data.length;
                    var tempArray = [];
                    for(var i = 0; i < Math.ceil(dataLength / 4); i++){
                        tempArray.push(data.slice(i * 4, (i * 4) + 4));
                    }

                    t.otherCityData = data;

                    _data.provinces = tempArray;

                    var otherCitysHtml = util.compileTempl('other-citys-tpl', _data);
                    $('.js-other-citys-wrap').html(otherCitysHtml);

                    dfd.resolve(t);

                },
                error : function(){
                    dfd.reject();
                }
            });

            return dfd.promise();

        };

        /*
         * 点击带有子城市的省份展开/收起的方法
         * @method toggleCity
         * @public
         * @return {Null}
         * @example
         *      this.toggleCity();
         * @since 1.0.0
         */
        cityDo.prototype.toggleCity = function(_this){
        
            var t = _this;
            var city;

            // 点击省份 展开城市
            $('.city-true').on('click', function(){

                $('.category-child').detach();

                if(!$(this).hasClass('active')){

                    $('.category b').removeClass('active');
                    $('.category li').removeClass('active');
                    $(this).addClass('active');
                    $(this).parent().addClass('active');
                    
                    var curName = $(this).data('name');
                    var citysData = [];
                    var childCitysHtml = '';
                    var len = t.otherCityData.length;
                    var _data = {};
                    var $parent = $(this).parent().parent();


                    for(var i = 0; i < len; i++){
                        city = t.otherCityData[i];

                        if(city.name == curName){
                            
                            _data.childCitys = city.citys;
                            childCitysHtml = util.compileTempl('child-citys-tpl', _data);
                            
                            $parent.after($(childCitysHtml));

                            // 点击可切换的城市，向客户端发送请求
                            $('.js-change-city').off('click');
                            $('.js-change-city').on('click', function(){
                                $.proxy(t.sendDataChangeCity, this)();
                            });
                            
                        }
                    }
                }else{
                    $('.category b').removeClass('active');
                    $('.category li').removeClass('active');
                }

            });
            
            // 点击可切换的城市，向客户端发送请求
            $('.js-change-city').off('click');
            $('.js-change-city').on('click', function(){
                $.proxy(t.sendDataChangeCity, this)();
            });
        };

        /*
         * 向客户端发送切换城市的数据
         * @method sendDataChangeCity
         * @public
         * @return {Null}
         * @example
         *      this.toggleCity();
         * @since 1.0.0
         */
        cityDo.prototype.sendDataChangeCity = function(){
            var jsonParam = {};
            jsonParam.citydomain = $(this).data('domain');
            jsonParam.cityname = $(this).data('cityname');
            jsonParam.cityid = $(this).data('cityid');


            cityApi.changeCity(jsonParam);
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
            // t.render();
            cityApi.start(function () {
                t.render();
            });
        };

        return new cityDo();
    });