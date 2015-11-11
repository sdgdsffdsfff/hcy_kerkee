/**
 * detail相关接口
 * @class detailModules
 * @extends Klass
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/detailApi',',function(platform){
 *          detailApi.getTestInfo();
 *     });
 * @since 1.0.0
 * @public
 */

define(["bridgeLib", "api/helper/util"], function (bridgeLib, util) {

    var DetailApi = (function () {

        //构建一个DetailApi类,继承自基础类
        util.Klass().sub(DetailApi);

        //构造函数
        function DetailApi() {
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

            DetailApi.__super__.constructor.apply(this, arguments);
        }

        DetailApi.include({

            /*
             * 获取详情页数据
             * @method getDetailData
             * @public
             * @param {Function} callBack 回调函数
             * @param {String} string jobId
             * @return {Object}
             * @example
             *      detailApi.getDetailData(function(data){
             *          console.log(data);
             * 	    });
             * @since 1.0.0
             */
             
            getDetailData: function(id,callBack){
                this.sendData({
                    method: "getDetailData",
                    param: {
                        "jobId": id
                    },
                    callBack: callBack
                });
            }
        });
        return DetailApi;
    })();

    return new DetailApi({
        name: "kerkee detailApi",
        author: "zihong",
        version: "1.0",
        jsbc: jsBridgeClient,
        nativeCls: "detailModules"
    });

});