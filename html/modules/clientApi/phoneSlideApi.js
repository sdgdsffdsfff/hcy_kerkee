/**
 * phoneSlide相关接口
 * @class phoneSlide
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/phoneSlideApi',',function(phoneSlide){
 *          phoneSlide({
 *              wrapSelector : '.slide-box'     // 包裹层选择符
 *              autoLoop : true,                // 自动轮播
 *              loopTime : 2000                 // 轮播等待时间
 *          });
 *     });
 * @since 1.0.0
 * @public
 */

define(["zepto"], function ($) {

    var phoneSlide = function(opations){
        if(!(this instanceof phoneSlide))  return new phoneSlide(opations);

        // 配置参数
        this.settings = {
            wrapSelector : '.slide-box',
            autoLoop : true,
            loopTime : 2000
        };

        $.extend(this.settings, opations);

        this.$wrap = $(this.settings.wrapSelector);
        this.$itemBox = this.$wrap.find('ul');
        // console.log(this.$wrap);
        this.$items = this.$wrap.find('ul li');

        this._cloneDom();

        this.clientWidth = document.documentElement.clientWidth;
        this.maxNum = this.$items.length - 1;
        this.pageNum = 0;
        this.firstNum = this.$items.length / 2
        this.preFirstNum = this.firstNum - 1;
        this.temCur = this.firstNum;
        this.slideMinDistance = parseInt(this.clientWidth / 4);
        this.direction = 'left';
        this.distance = 0;
        this.startPageX = 0;
        this.startPageY = 0;
        this.movePageX = 0;
        this.movePageY = 0;
        this.endPageX = 0;
        this.endPageY = 0;
        this.timer = null;
        this.onlyOne = this.$items.length == 2;

        this._init();

    };

    $.extend(phoneSlide.prototype, {

        constructor : phoneSlide,

        /*
         * 初始化方法
         * @method _init
         * @private
         * @param {Null}
         * @return {Null}
         * @example
         *      this._init()
         * @since 1.0.0
         */
        _init : function(){

            config = this.settings;

            // 设置样式
            this.$wrap.css({
                width : '100%',
                overflow : 'hidden'
            });

            this.$itemBox.css({
                width : this.$items.length * 100 + '%',
                height : '100%'
            });

            this._setTranslateX(this.$itemBox, -this.temCur * this.clientWidth);

            this.$items.css({
                width : 100 / this.$items.length + '%',
                height : '100%',
            });

            // 绑定事件
            if(!this.onlyOne){
                this.$itemBox.on('touchstart', $.proxy(this._start, this));
                this.$itemBox.on('touchmove', $.proxy(this._move, this));
                this.$itemBox.on('touchend', $.proxy(this._end, this));
            }
            

            // 这个时候轮播图片只有一张，无需轮播。
            if(this.onlyOne){
                this.settings.autoLoop = false;
            }

            if(config.autoLoop){
                this._autoLoopFn();
            }

        },

        /*
         * touchstart 事件函数
         * @method _start
         * @private
         * @param {Null}
         * @return {Null}
         * @example
         *      $.proxy(this._start, this)
         * @since 1.0.0
         */
        _start : function(event){
            this.startPageX = event.targetTouches[0].pageX;
            this.startPageY = event.targetTouches[0].pageY;
            this._opaTransition('0s');
            // 关闭轮播
            this._closeAutoLoop();
        },

        /*
         * touchmove 事件函数
         * @method _move
         * @private
         * @param {Null}
         * @return {Null}
         * @example
         *      $.proxy(this._move, this)
         * @since 1.0.0
         */
        _move : function(event){
            event.preventDefault();

            this.movePageX = event.targetTouches[0].pageX;
            this.movePageY = event.targetTouches[0].pageY;

            this.direction = this.movePageX - this.startPageX > 0 ? 'right' : 'left';
            this.distance = Math.abs(this.movePageX - this.startPageX);

            var changeX = this.direction == 'right' ? this.distance : -this.distance;
            this._setTranslateX(this.$itemBox, -this.temCur * this.clientWidth + changeX);
        },

        /*
         * touchend 事件函数
         * @method _end
         * @private
         * @param {Null}
         * @return {Null}
         * @example
         *      $.proxy(this._end, this)
         * @since 1.0.0
         */
        _end : function(event){
            this.endPageX = event.changedTouches[0].pageX;
            this.endPageY = event.changedTouches[0].pageY;
            
            this.startPageX = 0;
            this.startPageY = 0;

            if(this.distance > this.slideMinDistance){
                if(this.direction == 'right'){
                    this.temCur--;
                }else if(this.direction == 'left'){
                    this.temCur++;
                }
                
            }

            this._opaTransition('0.3s');
            // alert(cur);
            this._toDoSlide();

            // 开启轮播
            this._autoLoopFn();

        },

        /*
         * 执行滚动
         * @method _toDoSlide
         * @private
         * @param {Null}
         * @return {Null}
         * @example
         *      this._toDoSlide();
         * @since 1.0.0
         */
        _toDoSlide : function(){
            this._setTranslateX(this.$itemBox, -this.temCur * this.clientWidth, function(){

                this._changeTag();

                if(this.temCur == this.$items.length - 1){
                    this.temCur = this.preFirstNum;
                }else if(this.temCur == 0){
                    this.temCur = this.firstNum;
                }
                this._opaTransition('0s');
                this._setTranslateX(this.$itemBox, -this.temCur * this.clientWidth);
                
            });
        },

        /*
         * 给元素设置translateX值
         * @method _start
         * @private
         * @param {Object} obj DOM元素可以是jquery对象或zepot对象
         * @param {Number} diff 像素值
         * @return {Null}
         * @example
         *      this._serTranslateX(obj, 200)
         * @since 1.0.0
         */
        _setTranslateX : function(obj, diff, fn){
            $(obj).css({
                "-webkit-transform": "translateX(" + diff + "px)",
                "transform": "translateX(" + diff + "px)"
            });
            if(fn){
                setTimeout($.proxy(fn, this), 300);
            }
            
        },

        /*
         * 切换页面标签
         * @method _start
         * @private
         * @param {Object} obj DOM元素可以是jquery对象或zepot对象
         * @param {Number} diff 像素值
         * @return {Null}
         * @example
         *      this._serTranslateX(obj, 200)
         * @since 1.0.0
         */
        _changeTag : function(){
            $('i[data-slide-to]').removeClass('active');

            if(this.temCur < this.$items.length / 2){
                this.pageNum = this.temCur;
            }else{
                this.pageNum = this.temCur - this.$items.length / 2;
            }
            $('i[data-slide-to="' + this.pageNum + '"]').addClass('active');
        },

        /*
         * 操作transition属性
         * @method _opaTransition
         * @private
         * @param  {String} time 时间，秒 
         * @return {Null}
         * @example
         *      this._opaTransition('0.3s')
         * @since 1.0.0
         */
        _opaTransition : function(time){
            this.$itemBox.css({
                "-webkit-transition": time,
                "-moz-transition": time,
                "-ms-transition": time,
                "-o-transition": time,
                "transition": time
            });
        },

        /*
         * 自动循环
         * @method _autoLoopFn
         * @private
         * @return {Null}
         * @example
         *      this._autoLoopFn()
         * @since 1.0.0
         */
        _autoLoopFn : function(){
            var config = this.settings;
            if(!config.autoLoop) return;
            var config = this.settings;
            var self = this;
            
            this.timer = setInterval(function(){
                self._opaTransition('0.3s');
                self.temCur++;

                self._toDoSlide();
                
            }, config.loopTime);

        },

        /*
         * 关闭自动循环
         * @method _closeAutoLoop
         * @private
         * @return {Null}
         * @example
         *      this._closeAutoLoop()
         * @since 1.0.0
         */
        _closeAutoLoop : function(){
            clearInterval(this.timer);
        },

        /*
         * 克隆轮播元素
         * @method _cloneDom
         * @private
         * @return {Null}
         * @example
         *      this._cloneDom()
         * @since 1.0.0
         */
        _cloneDom : function(){
            this.$items.clone(true).appendTo(this.$itemBox);

            this.$items = this.$wrap.find('ul li');
        }

    });
    
    return phoneSlide;

});