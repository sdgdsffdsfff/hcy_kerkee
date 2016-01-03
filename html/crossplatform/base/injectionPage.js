/**
 * 页面注入类
 * @class Global
 * @constructor
 * @module injection
 * @example
 *      require(['crossplatform/base/injectionPage'], function(injection){
 *          injection(self.constructorName, function(){
 *              callBack();
 *          });
 *      });
 * @since 1.0.0
 * @private
 */

define(function(require, exports, module){

	var array = [];

    /**
     * urd 跳转路由配置
     * action : rul
     */
	var urdMap = {
		joblist : '/modules/list/list.html',
		jobdetail : '/modules/detail/detail.html'
	}

    /**
     * URD 跳转解析
     * @method parseURD
     * @private
     * @example
     *      parseURD();
     * @since 1.0.0
     */
	var parseURD = function(){
        $('body').on('click', '[href]', function(event){
            var thisScheme = $(this).attr('href');
            var isURD = thisScheme.search(/^doumi:\/\//) != -1 ? true : false;
            var arr = [];
            var schemeJson = {};

            if(isURD){
            	
                thisScheme = thisScheme.replace(/^doumi:\/\//, "");
                arr = thisScheme.split('/');
                var tmp = arr[arr.length - 1].split('?');
                arr[arr.length - 1] = tmp[0];
                arr[arr.length] = tmp[1];

                if(arr.length == 2){
                    // 只有action, 无path
                    schemeJson.action = arr[0];
                    schemeJson.path = undefined;
                }else if(arr.length == 3){
                    // 有action, 有path
                    schemeJson.action = arr[0];
                    schemeJson.path = arr[1];
                }
                schemeJson.param = arr[arr.length - 1];

                if(schemeJson.path){
                    location.href = decodeURIComponent(schemeJson.path);
                }else{
                    if(schemeJson.action){
                        location.href = urdMap[schemeJson.action];
                    }
                }
                
            }else{
                location.href = thisScheme;
            }

            return false;
            
        });
    };

    /**
     * 注入页面
     * @method injection
     * @private
     * @param {String} page 注入的页面对应的API名字，如首页对应的是 indexApi
     * @param {Function} callback 回调函数
     * @return {Null}
     * @example
     *      require(['crossplatform/base/injectionPage'], function(injection){
     *          injection(self.constructorName, function(){
     *              callBack();
     *          });
     *      });
     * @since 1.0.0
     */
	function injection(page, callback){
		
		page = page ? page.toLowerCase() : 'defaultapi';

		array = [];

		array.push('injectionPage/' + page + 'Page');

		require(array, function(module){
			parseURD();
			callback(module);
		});
		
	}

	return injection;

});