define(function(require, exports, module){

	require('css!crossplatform_css_path/base.css');
	require('css!crossplatform_css_path/indexPage.css');
	var template = require('template');
	var global = require('crossplatform/base/global');

	var head = '<header class="header">'
+				    '<a href="/uc/"><i class="icon-user js-touch-state"></i></a>'
+				    '<h1 class="tit">斗米兼职</h1>'
+				    '<address class="head-city tit">'
+				        '<a href="/modules/city/city.html" style="color:#fff">{{cityname}}</a>'
+				    '</address>'
+				'</header>';

	var renderHead = template.compile(head);
	var headData = global.get('curCity');
	if(!headData){
		headData = {
			citydomain : 'bj',
			cityname : '北京',
			cityid : 12
		}
	}
	var html = renderHead(headData);

	$('body').prepend(html);

});