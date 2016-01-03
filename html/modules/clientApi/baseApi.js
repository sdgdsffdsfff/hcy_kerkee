/**
 * base基础Api类
 * @class BaseApi
 * @extends Klass
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/baseApi',',function(base){
 *          base.sub(child);
 *     });
 * @since 1.0.0
 * @public
 */

define(["api/helper/util"], function (util) {

    var BaseApi = (function () {

        //继承自Util类
        util.Klass().sub(BaseApi);

        //构造函数
        function BaseApi() {

            BaseApi.__super__.constructor.apply(this, arguments);
        }

        BaseApi.include({

            /**
             * 向客户端请求参数
             * @method getOptions
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * @example
             *      indexApi.getOptions(function(data){
             *          console.log(data);
             *      });
             * @since 1.0.0
             */
            getOptions: function (callBack) {
                this.sendData({
                    method: "getOptions",
                    param: {
                        "info": "getOptions"
                    },
                    callBack: callBack
                });
            },
            
            /**
             * 通知客户端数据已加载完毕
             * @method dataDownloadFinished
             * @example
             *        indexApi.dataDownloadFinished();
             * @since 1.0.0
             */
            dataDownloadFinished: function(){
                this.sendData({
                    method: "dataDownloadFinished",
                    param: {
                        "info": "dataDownloadFinished"
                    }
                });
            },

            /**
             * 调用客户端刷新
             * @method refreshPage
             * @example
             *        indexApi.refreshPage();
             * @since 1.0.0
             */
            refreshPage: function(type){
                this.sendData({
                    method: "refreshPage",
                    param: {
                        "info": "refreshPage",
                        "type": type
                    }
                });
            }


        });

        return BaseApi;
    })();

    return BaseApi;

});