define(['crossplatform/base/global'], function(global){
	var interFace = {
		refreshPage : function(data){
			setTimeout(function(){
				window.loadData(1);
			}, 0);
		},
		getOptions : function(data){
			var curCity = global.get('curCity') ? global.get('curCity') : {};
			if(data.callBack){
                data.callBack(curCity);
            }
		}
	};
	
	// 模块路由
	return interFace;

});