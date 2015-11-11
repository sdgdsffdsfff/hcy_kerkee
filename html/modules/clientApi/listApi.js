/**
 * list相关接口
 * @class listModules
 * @extends Klass
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/listApi',',function(platform){
 *          listApi.getTestInfo();
 *     });
 * @since 1.0.0
 * @public
 */

define(["bridgeLib", "api/helper/util"], function (bridgeLib, util) {

    var ListApi = (function () {

        //构建一个ListApi类,继承自基础类
        util.Klass().sub(ListApi);

        //构造函数
        function ListApi() {
            /**
             * 映射客户端类的名称 <strong>(必选)</strong>
             * @property nativeCls
             * @type string
             * @since 1.0.0
             * @default "channelModule"
             * @public
             */

            /**
             * jsBridgeClient通信对象 <strong>(必选)</strong>
             * @property jsbc
             * @type string
             * @since 1.0.0
             * @default jsBridgeClient
             * @public
             */

            /**
             * 模块信息描述 <strong>(可选)</strong>
             * @property name
             * @type string
             * @since 1.0.0
             * @public
             */

            /**
             * 模块版本 <strong>(可选)</strong>
             * @property verison
             * @type int
             * @since 1.0.0
             * @public
             */

            /**
             * 模块作者 <strong>(可选)</strong>
             * @property author
             * @type string
             * @since 1.0.0
             * @public
             */

            ListApi.__super__.constructor.apply(this, arguments);
        }

        ListApi.include({

            /**
             * 去客户端请求list列表页参数
             * @method getOptions
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * @example
             *      listApi.getOptions(function(data){
             *          console.log(data);
             * 	    });
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
        return ListApi;
    })();

    return new ListApi({
        name: "kerkee listApi",
        author: "zihong",
        version: "1.0",
        jsbc: jsBridgeClient,
        nativeCls: "listModules"
    });

});