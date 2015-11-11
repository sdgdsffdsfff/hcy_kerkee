/**
 * userCenter相关接口
 * @class userCenter
 * @extends Klass
 * @constructor
 * @module modules
 * @example
 *     define('clientApi/userCenterApi',',function(userCenterApi){
 *          userCenterApi.getTestInfo();
 *     });
 * @since 1.0.0
 * @public
 */

define(["bridgeLib", "api/helper/util"], function (bridgeLib, util) {

    var UserCenterApi = (function () {

        //构建一个UserCenterApi类,继承自基础类
        util.Klass().sub(UserCenterApi);

        //构造函数
        function UserCenterApi() {
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

            UserCenterApi.__super__.constructor.apply(this, arguments);
        }

        UserCenterApi.include({
            /**
             * 获取验证码
             * @method mobileCode
             * @public
             * @param {String} phoneNumber 用户所填写手机号
             * @example
             *      loginApi.mobileCode(phoneNumber);
             * @since 1.0.0
             */
            mobileCode: function (phoneNumber) {
                this.sendData({
                    method: "mobileCode",
                    param: {
                       "phoneNumber":phoneNumber
                    }
                });
            },
            /**
             * 登录
             * @method logIn
             * @public
             * @param  {String} phoneNumber 用户手机号
             * @param  {String} verifyCode 验证码
             * @example
             *      loginApi.logIn(num,code);
             * @since 1.0.0
             */
             logIn: function (phoneNumber,verifyCode) {
                this.sendData({
                    method: "logIn",
                    param: {
                       "phoneNumber":phoneNumber,
                       "verifyCode":verifyCode
                    }
                });
            },
            /**
             * 获取个人中心信息
             * @method userInfo
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.userInfo(function(data){
             *          console.log(data);
             *      }
             * @since 1.0.0
             */
            userInfo: function (callBack) {
                this.sendData({
                    method: "userInfo",
                    param: {
                        info:'userInfo'
                    },
                    callBack: callBack
                });
            },
            /**
             * 登出
             * @method logOut
             * @public
             * @param {null} void
             * @return {null} void
             * @example
             *        userCenter.logOut();
             * @since 1.0.0
             */
            logOut: function () {
                this.sendData({
                    method: "logOut",
                    param: {
                        info:'logOut'
                    }
                });
            },
            /**
             * 钱包页面入账列表
             * @method cashList
             * @public
             * @param {Function} callBack 回调函数
             * @param {Number} page 第几页
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.cashList(function(data){
             *          console.log(data);
             *      }
             * @since 1.0.0
             */
            cashList: function(page,callBack){
                this.sendData({
                    method: "cashList",
                    param: {
                        page:page
                    },
                    callBack:callBack
                });
            },
            /**
             * 钱包页面余额
             * @method userBalance
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.userBalance(function(data){
             *          console.log(data);
             *      }
             * @since 1.0.0
             */
            userBalance: function(callBack){
                this.sendData({
                    method: "userBalance",
                    param: {
                        info:'userBalance'
                    },
                    callBack:callBack
                });
            },
            /**
             * 通知客户端提现
             * @method applyCash
             * @public
             * @return {null} void
             * @example
             *        userCenter.applyCash();
             * @since 1.0.0
             */
            applyCash: function(){
                this.sendData({
                    method: "applyCash",
                    param: {
                        info:'applyCash'
                    }
                });
            },
            /**
             * 获取邀请码
             * @method inviteCode
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.inviteCode();
             * @since 1.0.0
             */
            inviteCode: function(callBack){
                this.sendData({
                    method: "inviteCode",
                    param: {
                        info:'inviteCode'
                    },
                    callBack:callBack
                });
            },
            /**
             * 我的兼职
             * @method applyList
             * @public
             * @param {Function} callBack 回调函数
             * @param {Number} page 第几页
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.applyList(function(data){
             *          console.log(data);
             *      }
             * @since 1.0.0
             */
            applyList: function(page,callBack){
                this.sendData({
                    method: "applyList",
                    param: {
                        page:page
                    },
                    callBack:callBack
                });
            },
            /**
             * 用户登录状态，以及cookie
             * @method userStatus
             * @public
             * @param {Function} callBack 回调函数
             * @return {Object}
             * {data:信息}
             * @example
             *        userCenter.applyList(function(data){
             *          console.log(data);
             *      });
             * @since 1.0.0
             */
            userStatus: function(callBack){
                this.sendData({
                    method: "userStatus",
                    param: {
                        "info": "userStatus"
                    },
                    callBack: callBack
                });
            }
        });
        return UserCenterApi;
    })();

    return new UserCenterApi({
        name: "kerkee userCenterApi",
        author: "zihong",
        version: "1.0",
        jsbc: jsBridgeClient,
        nativeCls: "userCenter"
    });

});