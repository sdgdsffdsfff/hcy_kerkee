#H5调用客户端接口
##baseApi
~~~
baseApi.js(模块继承类)
~~~

###<font color='red'>getOptions</font>
~~~
从客户端获取参数
~~~
<table>
	<tr>
		<td>param</td>
		<td>Function callBack</td>
	</tr>
	<tr>
		<td>return</td>
		<td>Object</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>2.1.0</td>
	</tr>
</table>
~~~
example
listApi.getOptions(function(data){
	console.log(data);
});
~~~

###<font color='red'>dataDownloadFinished</font>
~~~
通知客户端数据加载完成
~~~
<table>
	<tr>
		<td>param</td>
		<td>void</td>
	</tr>
	<tr>
		<td>return</td>
		<td>void</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>2.1.0</td>
	</tr>
</table>
~~~
example
clientInfo.dataDownloadFinished();
~~~