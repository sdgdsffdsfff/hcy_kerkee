/**
 * Created by huohcunyang on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'when',
        'fastclick',
        'clientApi/util',
        'clientApi/indexApi',
        'swiper',
        'domReady!'
    ],

    function ($,clientInfo,widget,when,fastclick,util,indexApi,swiper) {

        /*
         * 构造函数
         */
        function indexDo(){
            // ajax请求数据域名
            this.host = '';
            // 向客户端请求数据
            this.param = '';
            // 是否是首次加载
            this.first = true;
            // 轮播图片的数量
            this.foucsImgLength = 0;
            // 加载完成的轮播图片的数量（无论加载成功还是失败）
            this.foucsImgCurLength = 0;
            // 保存加载完毕的图片的数组
            this.foucsImgArray = [];
            // 请求次数
            this.requestTimes = 1;
            // 用来存储本次轮播图数量
            this.imgNum = 0;
            // 轮播组件对象
            this.swiper = null;
            // 调用renderIndexData方法时所渲染的数据是否是缓存数据
            this.isCache = false;
            //清除touchstart计时器
            this.startTimer=null;
            //清除touchmove计时器
            this.moveTimer=null;
            // 绑定日志统计事件的单例方法
            this.singleLogEvent = util.getSingle(this.logEvent);
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
            fastclick.attach(document.body);
            var t = this;

            clientInfo.getHost(function(host){
                t.host=host.info;
                clientInfo.getCache('indexData', function(data){
                    if(!data){
                        // 没有缓存
                        $('.loading-pop').addClass('active');
                        t.getOptionsAndData();
                    }else{
                        $('.loading-pop').removeClass('active');

                        // 有缓存先读取缓存，并刷新数据
                        t.renderCacheData(data);
                        indexApi.refreshPage();
                    }
                });
                // t.getOptionsAndData();
            });

            window.loadData = function(type){
                if(type){
                    t.getOptionsAndData();
                }else{
                    t.loadData();
                }
            }

        };

        /*
         * 设置轮播图的高度
         * @method setFoucsImgHeight
         * @public
         * @return {Null}
         * @example
         *      this.setFoucsImgHeight();
         * @since 1.0.0
         */
        indexDo.prototype.setFoucsImgHeight = function(){
            slideHeight = $(window).width() * 116 / 375;
            $('.swiper-wrapper').css({height: slideHeight + 'px'});
        };

        /*
         * 日志统计
         * @method logEvent
         * @public
         * @return {Null}
         * @example
         *      this.logEvent();
         * @since 1.0.0
         */
        indexDo.prototype.logEvent = function(){
            // $('body').off('click', '.js-log-case');
            // $('body').off('click', '.js-log-topmore');
            // $('body').off('click', '.js-log-btmmore');
            // $('.js-item').off('click');
            
            $('body').on('click', '.js-log-case', function(){

                if($(this).data('id') == 2){
                    // 高薪急聘
                    clientInfo.addLog('0','首页_访问兼职列表页&点击首页高薪急聘按钮&');
                }else if($(this).data('id') == 3){
                    // 附近兼职
                    clientInfo.addLog('0','首页_访问兼职列表页&点击首页附近兼职按钮&');
                }else if($(this).data('id') == 4){
                    // 高薪急聘
                    clientInfo.addLog('0','首页_访问兼职列表页&点击首页斗米直付按钮&');
                }
            });
            $('body').on('click', '.js-log-topmore',function(){
                // 点击右侧更多按钮
                clientInfo.addLog('0','首页_访问兼职列表页&点击更多进入&');
            });

            $('body').on('click', '.js-log-btmmore', function(){
                // 点击右侧更多按钮
                clientInfo.addLog('0','首页_访问兼职列表页&点击猜你喜欢列表底部更多按钮&');
            });
            $('.js-item').on('click', function(){
                var value = $(this).index() + 1;
                clientInfo.addLog('0','猜你喜欢列表&职位详情点击量&{"列表位置":"' + value + '"}');
            });

            return true;
        };

        /*
         * 重新获取参数并加载数据
         * @method getOptionsAndData
         * @public
         * @return {Null}
         * @example
         *      this.getOptionsAndData();
         * @since 1.0.0
         */
        indexDo.prototype.getOptionsAndData = function(){
            var t = this;
            indexApi.getOptions(function(data){

                if(!data || util.isEmptyObject(data)){
                    data = {};
                    data.citydomain = 'bj';
                }

                t.param = 'citydomain=' + data.citydomain;
                t.loadData();
            });
        };
        /*
         * 加载数据
         * @method loadData
         * @public
         * @return {Null}
         * @example
         *      this.loadData();
         * @since 1.0.0
         */
        indexDo.prototype.loadData = function(){
            var t = this;
            clientInfo.getNetworkType(function(networkData){
                if(networkData.network != 'invalid'){
                    // 有网
                    $.ajax({
                        url : t.host + "/api/v1/client/index?" + t.param,
                        timeout : 10000,
                        // url : "/api/v1/client/index?" + t.param,
                        success : function(data){
                            // 获取理想数据
                            if(!!data && data.cityInfo && typeof(data) == 'object'){
                                // 写入缓存
                                clientInfo.setCache('indexData', data, 3 * 24 * 60 * 60);

                                t.renderIndexData(data);
                            }else{
                                if(t.requestTimes == 1){
                                    // 重新请求
                                    t.requestTimes++;
                                    t.loadData();

                                }else if(t.requestTimes == 2){
                                    
                                    t.renderCacheData(null, '网络异常');
                                    
                                }
                            }
                            
                            
                        },
                        error : function(xhr, status){

                            var toastStr = '';
                            
                            if(t.requestTimes == 1){
                                // 重新请求
                                t.requestTimes++;
                                t.loadData();

                            }else if(t.requestTimes == 2){

                                if(status == 'timeout'){
                                    toastStr = '网络请求超时';
                                }else{
                                    toastStr = '服务器异常';
                                }

                                t.renderCacheData(null, toastStr);
                                
                            }
                            
                        }
                    });
                }else{
                    // 无网
                    t.renderCacheData(null, '网络异常');
                }   
            });
            
            
            
        };

        /*
         * 使用缓存数据渲染页面
         * @method renderCacheData
         * @param {Object} cacheData 缓存数据
         * @public
         * @return {Null}
         * @example
         *      this.renderCacheData(cacheData);
         * @since 1.0.0
         */
        indexDo.prototype.renderCacheData = function(cacheData, toastString){
            var t = this;

            if(cacheData){
                t.renderIndexData(cacheData, true);
            }else{
                // 读取缓存
                clientInfo.getCache('indexData', function(data){
                    if(!data){
                        // widget.toast('网络错误，请刷新重试');
                        widget.loadState();
                    }else{
                        if(!toastString){
                            toastString = '网络异常';
                        }
                        widget.toast(toastString);
                        t.renderIndexData(data, true);
                    }
                });
            }
            
        }

        /*
         * 渲染页面
         * @method renderIndexData
         * @public
         * @param {Object} data 数据
         * @param {Object} isCache 是否是缓存数据
         * @return {Null}
         * @example
         *      this.renderIndexData();
         * @since 1.0.0
         */
        indexDo.prototype.renderIndexData= function(data, isCache){
            var t = this;
            if(isCache){
                t.isCache = true;
            }else{
                t.isCache = false;
            }
            // url编码处理
            $.each(data.focus_imgs, function(i, item){
                data.focus_imgs[i].url = encodeURIComponent(item.url);
            });

            $('.js-body').show();

            // 使用模板引擎加载菜单按钮数据
            var caseHtml = t.loadDataFn('caselistwrap', data);
            $('.navbox').html(caseHtml);

            // 使用模板引擎加载内容数据
            var postsHtml = t.loadDataFn('content-list-tpl', data);
            $('.mod-label-listwrap').html(postsHtml);

            // 首次加载 或者 轮播图数量不等的时候 使用模板渲染
            if(t.first || (t.imgNum != data.focus_imgs.length)){

                t.imgNum = data.focus_imgs.length;

                t.setFoucsImgHeight();
                
                // 使用模板引擎加载图片数据
                var focusImgHtml = t.loadDataFn('focus-img-tpl', data);
                $('.swiper-wrapper').html(focusImgHtml);
                // 调用轮播组件
                if(t.swiper){
                    t.swiper.destroy(true);
                }
                
                t.swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    spaceBetween: 0,
                    centeredSlides: true,
                    autoplay: 2500,
                    autoplayDisableOnInteraction: false,
                    loop : t.imgNum == 1 ? false : true
                });

                if(t.imgNum == 1){
                    // 隐藏页标
                    $('.swiper-pagination').hide();
                }

                t.first = false;

                
                if(t.isCache){
                    t.androidImgCache();
                }

            }else{
                // 非首次加载不适用模板加载轮播图片，优化
                var imgUrlData = [];
                // console.log(data.focus_imgs);
                for(var k = 0; k < data.focus_imgs.length; k++){
                    imgUrlData.push([data.focus_imgs[k].image, data.focus_imgs[k].id, data.focus_imgs[k].url]);
                }

                t.getImgs(imgUrlData);

            }


            clientInfo.dataDownloadFinished();
            // 隐藏等待加载弹窗
            $('.loading-pop').removeClass('active');

            // 日志
            // t.logEvent();
            t.singleLogEvent();
        }

        /*
         * 获取Android缓存图片
         * @method androidImgCache
         * @public
         * @return {null}
         * @example
         *      this.androidImgCache();
         * @since 2.1.0
         */
        indexDo.prototype.androidImgCache = function(){
            if(util.OS() == 'android'){
                clientInfo.getWebImageCacheDir(function(fileRootPath){
                    if($('img').attr('src').search(/^file:/) == -1){
                        $('img').each(function(i, obj){
                            var oldUrl = $(obj).attr('src');
                            var newUrlIndex = oldUrl.indexOf('/', 7);
                            var newUrl = fileRootPath + oldUrl.substr(newUrlIndex);
                            $(obj).attr('src', newUrl);
                        });
                    }
                });
            }
        }

        /*
         * 非首次加载轮播图片
         * @method getImgs
         * @public
         * @param {String} url 图片资源路径
         * @return {null}
         * @example
         *      this.reLoadFoucsImgs(url);
         * @since 1.0.0
         */
        indexDo.prototype.getImgs = function(urlArray){
            this.foucsImgCurLength = 0;
            this.foucsImgArray = [];
            this.foucsImgLength = urlArray.length;
            for(var i = 0; i < urlArray.length; i++) {
                this.reLoadFoucsImgs(urlArray[i]);
            }
        };

        /*
         * 非首次加载轮播图片
         * @method reLoadFoucsImgs
         * @public
         * @param {String} url 图片资源路径
         * @return {null}
         * @example
         *      this.reLoadFoucsImgs(url);
         * @since 1.0.0
         */
        indexDo.prototype.reLoadFoucsImgs = function(url){
            
            var t = this;

            var img = new Image();
            img.src = url[0];
            img.onload = function() {
                t.foucsImgCurLength++;
                t.foucsImgArray.push({target : img, id : url[1], href: url[2]});
                if(t.foucsImgCurLength == t.foucsImgLength){
                    t.showImgs();
                }
            };
            img.onerror = function(){
                t.foucsImgCurLength++;
                t.foucsImgArray.push({target : img, id : url[1], href: url[2]});
                if(t.foucsImgCurLength == t.foucsImgLength){
                    t.showImgs();
                }
            };

        };

        /*
         * 非首次加载轮播图片,显示图片
         * @method showImgs
         * @public
         * @param {String} img 图片资源路径
         * @return {null}
         * @example
         *      this.showImgs(img);
         * @since 1.0.0
         */
        indexDo.prototype.showImgs = function(){
            var t = this;
            $('.js-slider-img').each(function(k, m){
                $.each(t.foucsImgArray, function(i, value){
                    if($(m).data('imgid') == value.id){
                        $(m).attr('src', value.target.src);
                        $(m).parent().attr('href', 'doumi://browser/' + value.href);
                    }

                });

            });
            if(t.isCache){
                t.androidImgCache();
            }

        };

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
        };

        indexDo.prototype.userEvents=function(){
            //添加点击的阴影效果
            util.touchActiveBackground('.activeBackground');
        };
        
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
                t.userEvents();
            });
        };

        return new indexDo();
    });