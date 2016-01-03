define(function(require, exports, module){
	
	var template = require('template');
	require('css!crossplatform_css_path/base.css');

	var head = '<header class="header">'
+                '<h1 class="tit">斗米兼职</h1>'
+            '</header>';

	var renderHead = template.compile(head);

	var html = renderHead({});

	$('body').prepend(html);


});