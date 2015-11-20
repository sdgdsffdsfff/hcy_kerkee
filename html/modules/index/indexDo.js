/**
 * Created by huohcunyang on 2015/9/14.
 */
define([
        'zepto',
        'clientApi/clientInfo',
        'api/nativeUI/widget',
        'when',
        'clientApi/util',
        'clientApi/indexApi',
        'clientApi/phoneSlideApi',
        'domReady!'
    ],

    function ($,clientInfo,widget,when,util,indexApi,phoneSlideApi) {

        /*
         * 构造函数
         */
        function indexDo(){
            // 判断是否有网络
            this.netWork = true;
            // ajax请求数据域名
            this.host = '';
            // 向客户端请求数据
            this.param = '';
            // 是否是首次加载
            this.first = true;
            // 轮播组件对象
            this.phoneSlideObj = null;
            // 轮播图片的数量
            this.foucsImgLength = 0;
            // 加载完成的轮播图片的数量（无论加载成功还是失败）
            this.foucsImgCurLength = 0;
            // 保存加载完毕的图片的数组
            this.foucsImgArray = [];
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

                    t.getOptionsAndData();

                }else{
                    widget.loadState();
                }     
            });
            window.loadData = function(type){
                if(type){
                    t.getOptionsAndData();
                }else{
                    t.loadData()
                    .then(t.addEffect);
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
            $('.slide').css({height: slideHeight + 'px'});
        };

        /*
         * 添加item点击效果
         * @method addEffect
         * @public
         * @return {Null}
         * @example
         *      this.addEffect();
         * @since 1.0.0
         */
        indexDo.prototype.addEffect = function(){
            // $('.js-item').off('touchstart');
            // $('.js-item').off('touchend');
            // $(document).off('touchmove');
            // $(window).off('scroll');

            // $('.js-item').on('touchstart', function(){
            //     $(this).css({background:'#f1f1f1'});
            // });
            // $('.js-item').on('touchend', function(){
            //     $(this).css({background:'#fff'});
            // });
            // $(document).on('touchmove', function(){
            //     $('.js-item').css({background:'#fff'});
            // });
            // $(window).on('scroll', function(event){
            //     var event = event || window.event;
            //     if(event.preventDefault){
            //         event.preventDefault();     
            //     }else{
            //         event.returnValue = false;
            //     }
                
            // })
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
                t.param = 'citydomain=' + data.citydomain;
                t.loadData()
                .then(t.addEffect);
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
            // http://www.doumi.com/api/v1/client/index?lat=0&lng=0
            var t = this;
            var dfd = $.Deferred();
            $.ajax({
                url : t.host + "/api/v1/client/index?" + t.param,
                // url : "/api/v1/client/index?" + t.param,
                success : function(data){
                    // url编码处理
                    $.each(data.focus_imgs, function(i, item){
                        data.focus_imgs[i].url = encodeURIComponent(item.url);
                    });

                    // 使用模板引擎加载菜单按钮数据
                    var caseHtml = t.loadDataFn('caselistwrap', data);
                    $('.navbox').html(caseHtml);
                    
                    // 使用模板引擎加载内容数据
                    var postsHtml = t.loadDataFn('content-list-tpl', data);
                    $('.mod-label-listwrap').html(postsHtml);

                    if(t.first){

                        $('.js-body').show();
                        t.setFoucsImgHeight();
                        
                        // 使用模板引擎加载图片数据
                        var focusImgHtml = t.loadDataFn('focus-img-tpl', data);
                        $('.slide').html(focusImgHtml);
                        // 调用轮播组件
                        t.phoneSlideObj = new phoneSlideApi({
                            wrapSelector : '.slide',
                            autoLoop : true,
                            loopTime : 4000,
                        });
                        t.first = false;

                    }else{
                        // 非首次加载不适用模板加载轮播图片，优化
                        var imgUrlData = [];
                        // console.log(data.focus_imgs);
                        for(var k = 0; k < data.focus_imgs.length; k++){
                            imgUrlData.push([data.focus_imgs[k].image, data.focus_imgs[k].id]);
                        }

                        t.getImgs(imgUrlData);

                    }
                    

                    clientInfo.dataDownloadFinished();

                    dfd.resolve();
                    // 隐藏等待加载弹窗
                    $('.loading-pop').hide();
                    
                },
                error : function(){
                    dfd.reject();
                    widget.toast('网络错误，请刷新重试');
                }
            });
            return dfd.promise();
        };

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
                this.reLoadFoucsImgs(urlArray[i][0]);
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

            img.onload = function() {
                t.foucsImgCurLength++;
                t.foucsImgArray.push({target : img, id : url[1]});
                if(t.foucsImgCurLength == t.foucsImgLength){
                    t.showImgs();
                }
            };
            img.onerror = function(){
                t.foucsImgCurLength++;
                t.foucsImgArray.push('<img>');
                if(t.foucsImgCurLength == t.foucsImgLength){
                    t.showImgs();
                }
            };

            img.src = url[0];

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
                        $(m).append($(value.target).clone(true));
                    }

                });

            });

            t.phoneSlideObj.setToSlideStart();
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