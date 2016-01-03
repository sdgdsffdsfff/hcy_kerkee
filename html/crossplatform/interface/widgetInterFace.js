define(['crossplatform/base/global'], function(global){
	var interFace = {
		loadState : function(){
			alert('网络开小差');
		},
		toast : function(){
			alert('网络异常，请刷新重试');
		}
	};
	
	// 模块路由
	return interFace;

});