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

            // 获取域名信息
            clientInfo.getHost(function(host){
                t.host=host.info;

                // 从客户端获取参数
                cityApi.getOptions(function(data){
                    t.param = data;
                    if(!t.param.cityid){
                        // 定位失败
                        $('.js-city-position').html('定位失败');
                        $('.location').addClass('active');
                        $('.icon-refresh').removeClass('active');
                        widget.toast('定位失败，请手动切换城市');
                    }else{
                        t.compCity(t.param.citydomain, t.param.s_citydomain, t.param.city, t.param.cityid);
                    }
                    
                });

                // 点击定位城市
                $('.icon-refresh').on('click', function(){
                    $('.location').removeClass('active');
                    $('.icon-refresh').addClass('active');
                    $('.js-city-position').html('正在定位中');
                    t.getPosCity();
                });

                // 弹窗按钮添加点击效果
                $('.js-touch-state').on('touchstart', function(){
                    $(this).addClass('active');
                });
                $('.js-touch-state').on('touchend', function(){
                    $(this).removeClass('active');
                });


                clientInfo.getCache('topCityData', function(data){
                    if(!data){
                        // 没有缓存
                        // 加载热门城市
                        t.loadTopCityData();
                    }else{

                        // 加载热门城市
                        t.loadTopCityData(data);
                        
                    }
                });

                clientInfo.getCache('otherCityData', function(data){
                    if(!data){
                        // 没有缓存
                        // 加载其他城市
                        t.loadOtherCityData();
                    }else{

                        // 加载其他城市
                        t.loadOtherCityData(data);
                        
                    }
                });
                   
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
                if(!data){
                    // 定位失败
                    $('.js-city-position').html('定位失败');
                    $('.location').addClass('active');
                    $('.icon-refresh').removeClass('active');
                    widget.toast('定位失败，请手动切换城市');
                }else{
                    t.compCity(data.citydomain, t.param.s_citydomain, data.city, data.cityid);
                }
                
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
         * @param {Array} cacheData 数据，如果cacheData不是undefined，证明有缓存数据
         * @return {Null}
         * @example
         *      this.loadTopCityData(cacheData);
         * @since 1.0.0
         */
        cityDo.prototype.loadTopCityData = function(cacheData){
            var t = this;

            if(cacheData){
                t.renderTopCity(cacheData);
            }
            clientInfo.getNetworkType(function(data){
                if(data.network != 'invalid'){
                    // 有网
                    $.ajax({
                        type : 'GET',
                        // url : '/api/v1/client/citys',
                        url : t.host + '/api/v1/client/citys',
                        timeout : 10000,
                        data:{
                            platform:util.OS,
                            token:''
                        },
                        success : function(data){
                            if(!!data && $.isArray(data)){

                                if(!cacheData){
                                    t.renderTopCity(data);
                                }
                                // 更新缓存数据
                                clientInfo.setCache('topCityData', data, 3 * 24 * 60 * 60);

                            }else{
                                if(!cacheData){
                                    widget.toast('网络异常');
                                }
                            }

                        },
                        error : function(xhr, status){
                            if(!cacheData){
                                if(status == 'timeout'){
                                    widget.toast('网络请求超时');
                                }else{
                                    widget.toast('网络异常');
                                }
                            }
                            
                        }
                    });
                }else{
                    // 无网
                    if(!cacheData){
                        widget.loadState();
                    }else{
                        // widget.toast('网络异常');
                    }
                }
            });

        };

        /*
         * 加载其他城市数据
         * @method loadOtherCityData
         * @public
         * @param {Array} cacheData 数据，如果cacheData不是undefined，证明有缓存数据
         * @return {Null}
         * @example
         *      this.loadOtherCityData(cacheData);
         * @since 1.0.0
         */
        cityDo.prototype.loadOtherCityData = function(cacheData){
            var t = this;

            if(cacheData){
                t.renderOtherCity(cacheData);
            }
            clientInfo.getNetworkType(function(data){

                if(data.network != 'invalid'){
                    // 有网
                    $.ajax({
                        type : 'GET',
                        // url : '/api/v1/client/provinces',
                        url : t.host + '/api/v1/client/provinces',
                        data:{
                            platform:util.OS,
                            token:''
                        },
                        success : function(data){
                            
                            if(!!data && $.isArray(data)){
                                
                                if(!cacheData){
                                    t.renderOtherCity(data);
                                }
                                // 更新缓存数据
                                clientInfo.setCache('otherCityData', data, 3 * 24 * 60 * 60);

                            }else{
                                if(!cacheData){
                                    widget.toast('网络异常');
                                }
                            }

                        },
                        error : function(xhr, status){
                            if(!cacheData){
                                if(status == 'timeout'){
                                    widget.toast('网络请求超时');
                                }else{
                                    widget.toast('网络异常');
                                }
                            }
                        }
                    });
                }else{
                    // 无网
                    if(!cacheData){
                        widget.loadState();
                    }else{
                        // widget.toast('N');
                    }
                }

            });

        };

        /*
         * 渲染热门城市数据
         * @method renderTopCity
         * @public
         * @param {Array} data
         * @return {Null}
         * @example
         *      this.renderTopCity(data);
         * @since 1.0.0
         */
        cityDo.prototype.renderTopCity = function(data){
            var t = this;
            var _data = {};
            _data.citys = data;

            var topCitysHtml = util.compileTempl('top-citys-tpl', _data);
            $('.js-top-citys-wrap').html(topCitysHtml);

            // 点击可切换的城市，向客户端发送请求
            $('.js-body').show();
            $('.js-change-city').off('click');
            $('.js-change-city').on('click', function(){
                $.proxy(t.sendDataChangeCity, this)();
            });
        }

        /*
         * 渲染其他城市数据
         * @method renderOtherCity
         * @public
         * @param {Array} data
         * @return {Null}
         * @example
         *      this.renderOtherCity(data);
         * @since 1.0.0
         */
        cityDo.prototype.renderOtherCity = function(data){
            // 数据处理成适合模板的结构
            var t = this;
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

            t.toggleCity();
        }

        /*
         * 点击带有子城市的省份展开/收起的方法
         * @method toggleCity
         * @public
         * @return {Null}
         * @example
         *      this.toggleCity();
         * @since 1.0.0
         */
        cityDo.prototype.toggleCity = function(){
        
            var t = this;
            var city;

            $('.js-body').show();

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