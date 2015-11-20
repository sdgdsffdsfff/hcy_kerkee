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
             *      listApi.getOptions(function(data){
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
            }


        });

        return BaseApi;
    })();

    return BaseApi;

});