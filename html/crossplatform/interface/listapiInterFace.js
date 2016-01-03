define(['crossplatform/base/global'], function(global){
	var interFace = {
		getOptions : function(data){
			var val = {
				citydomain : 'bj'
			}
			if(data.callBack){
                data.callBack(val);
            }
		}
	};
	
	// 模块路由
	return interFace;

});