/**
 * 注册模块类
 * @class loadModule
 * @constructor
 * @module loadModule
 * @example
 *      require(['crossplatform/base/registerModule'], function(loadModule){
 *          loadModule(self.attributes.nativeCls, function(module){
 *				console.log(module);
 *          });
 *      });
 * @since 1.0.0
 * @private
 */

define(function(require, exports, module){
	var array = [];

	/**
     * 注册模块
     * @method loadModule
     * @private
     * @param {String} moduleTag 页面中使用到的api名字，如首页使用了 indexApi 也用到了 clientInfo 等
     * @param {Function} callback 回调函数
     * @return {Null}
     * @example
     *  	require(['crossplatform/base/registerModule'], function(loadModule){
	 *          loadModule(self.attributes.nativeCls, function(module){
	 *				console.log(module);
	 *          });
	 *      });
     * @since 1.0.0
     */
	function loadModule(moduleTag, callBack){

		array = [];

		moduleTag = 'interFace/' + moduleTag.replace(/Modules/, 'api').toLowerCase() + 'InterFace';

		array.push(moduleTag);

		require(array, function(module){
			callBack(module);
		});
		
	}

	return loadModule;

});