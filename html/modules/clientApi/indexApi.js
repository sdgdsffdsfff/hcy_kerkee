/**
 * index相关接口
 * @class IndexApi
 * @extends BaseApi
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/indexApi',',function(indexApi){
 *          indexApi.getTestInfo();
 *     });
 * @since 1.0.0
 * @public
 */

define(["bridgeLib", "clientApi/baseApi"], function (bridgeLib, base) {

    var IndexApi = (function () {

        //构建一个IndexApi类,继承自baseApi基础类
        base.sub(IndexApi);

        //构造函数
        function IndexApi() {
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

            IndexApi.__super__.constructor.apply(this, arguments);
        }

        IndexApi.include({
            

        });
        return IndexApi;
    })();

    return new IndexApi({
        name: "kerkee IndexApi",
        author: "huochunyang",
        version: "1.0",
        jsbc: jsBridgeClient,
        nativeCls: "indexModules"
    });

});