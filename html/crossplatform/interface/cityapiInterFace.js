define(['crossplatform/base/global'], function(global){
	var interFace = {
		getOptions : function(data){
			
			var val = {
				citydomain : 'bj',
				s_citydomain : 'bj',
				city : '北京',
				s_city : '北京',
				cityid : 10
			}

			if(data.callBack){
                data.callBack(val);
            }
			
		},
		getPosition : function(data){
			setTimeout(function(){
				var val = {
					citydomain : 'tj',
					city : '天津',
					cityid : 10
				}
				
				if(data.callBack){
	                data.callBack(val);
	            }
			}, 1000);
			
		},
		changeCity : function(data){
			global.set('curCity', data.param);

			location.href = '/modules/index/index.html';
		}
	};
	
	// 模块路由
	return interFace;

});