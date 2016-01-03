/**
 * 全局数据类
 * @class Global
 * @constructor
 * @module global
 * @example
 *     define('crossplatform/base/global',function(global){
 *          global.get('curCity');
 *          global.remove('curCity');
 *          global.clear();
 *          global.getAllKeys();
 *			global.set('curCity', data.param);
 *     });
 * @since 1.0.0
 * @public
 */

define(function(){

	var storage = window.sessionStorage,
		nameSpace = 'moduleGlobalVar',
		resetData = function(data){
			var dataString = JSON.stringify(data);
			storage.setItem(nameSpace, dataString);
		};
	
	var Global = function(){};

	Global.prototype.data = {};

	/**
     * 设置全局数据
     * @method set
     * @public
     * @param {String} key 键
     * @param {Any variable} value 值
     * @return {Null}
     * @example
     *     define('crossplatform/base/global',function(global){
	 *			global.set(key, value);
	 *     });
     * @since 1.0.0
     */
	Global.prototype.set = function(key, value){
		var dataString = storage.getItem(nameSpace) ? storage.getItem(nameSpace) : '{}';
		this.data = JSON.parse(dataString);
		this.data[key] = value;
		resetData(this.data);
	};

	/**
     * 获取全局数据
     * @method get
     * @public
     * @param {String} key 键
     * @return {Any variable} 值
     * @example
     *     define('crossplatform/base/global',function(global){
	 *			global.get(key);
	 *     });
     * @since 1.0.0
     */
	Global.prototype.get = function(key){
		var dataString = storage.getItem(nameSpace) ? storage.getItem(nameSpace) : '{}';
		if(dataString == '{}'){
			return null;
		}else{
			var data = JSON.parse(dataString);
			return data[key];
		}
		
	};

	/**
     * 移除全局数据
     * @method remove
     * @public
     * @param {String} key 键
     * @return {Any variable | Boolean} 移除成功返回移除的数据，失败返回false, 如何要移除的数据本来就不在全局数据中返回true
     * @example
     *     define('crossplatform/base/global',function(global){
	 *			global.remove(key);
	 *     });
     * @since 1.0.0
     */
	Global.prototype.remove = function(key){

		var dataString = storage.getItem(nameSpace) ? storage.getItem(nameSpace) : '{}';
		this.data = JSON.parse(dataString);
		var tempData;

		if(this.data.hasOwnProperty(key)){
			
			tempData = this.data[key];

			delete this.data[key];

			if(!this.data.hasOwnProperty(key)){
				resetData(this.data);
				return tempData
			}else{
				return false;
			}

		}else{
			return true;
		}

	};

	/**
     * 移除所有全局数据
     * @method clear
     * @public
     * @example
     *     define('crossplatform/base/global',function(global){
	 *			global.clear();
	 *     });
     * @since 1.0.0
     */
	Global.prototype.clear = function(){

		resetData({});

	};

	/**
     * 获取目前全局数据中所有的键
     * @method getAllKeys
     * @public
     * @return {Array} 键组成的数组
     * @example
     *     define('crossplatform/base/global',function(global){
	 *			global.getAllKeys();
	 *     });
     * @since 1.0.0
     */
	Global.prototype.getAllKeys = function(){

		this.data = JSON.parse(storage.getItem(nameSpace));
		var keys = [];

		for(key in this.data){
			keys.push(key);
		}

		return keys;

	};

	return new Global();

});