/**
 * city相关接口
 * @class CityApi
 * @extends Klass
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/cityApi',',function(cityApi){
 *          cityApi.getCurCity();
 *     });
 * @since 1.0.0
 * @public
 */

define(["bridgeLib", "clientApi/baseApi"], function (bridgeLib, base) {

    var CityApi = (function () {

        //构建一个DetailApi类,继承自基础类
        base.sub(CityApi);

        //构造函数
        function CityApi() {
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

            CityApi.__super__.constructor.apply(this, arguments);
        }

        CityApi.include({

            /**
             * 获取定位城市
             * @method getPosition
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * {info: "http://api.k.sohu.com/"}
             * @example
             *        clientInfo.getPosition(function(posCity){
             *          console.log(posCity);
             *      }
             * @since 1.0.0
             */
            getPosition: function (callBack) {
                this.sendData({
                    method: "getPosition",
                    param: {
                        "info": "getPosition"
                    },
                    callBack: callBack
                });
            },

            /**
             * 切换城市，向客户端发送请求
             * @method changeCity
             * @public
             * @param {Object} param 给客户端发送的参数
             * @return {Null}
             * @example
             *        CityApi.changeCity()
             * @since 1.0.0
             */
            changeCity : function (params) {
                this.sendData({
                    method: "changeCity",
                    param: params
                });
            }
            
        });
        return CityApi;
    })();

    return new CityApi({
        name: "kerkee cityApi",
        author: "zihong",
        version: "1.0",
        jsbc: jsBridgeClient,
        nativeCls: "cityModules"
    });

});