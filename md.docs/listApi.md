#H5调用客户端接口
##listApi

~~~
H5:"listApi.js"
nativeCls:"listModules"
~~~

###<font color="red">getOptions</font>
~~~
去客户端请求参数
~~~
<table>
	<tr>
		<td>param</td>
		<td>Function</td>
	</tr>
	<tr>
		<td>return</td>
		<td>Object</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>1.0.0</td>
	</tr>
</table>
~~~
example
listApi.getOptions(function(data){
   console.log(data);
});
~~~

#H5调用客户端接口
##detailApi

~~~
H5:"detailApi.js"
nativeCls:"detailModules"
~~~

###<font color="red">getDetailData(不用)</font>
~~~
去客户端请求详情页数据
~~~
<table>
	<tr>
		<td>param</td>
		<td>String id</td>
	</tr>
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
		<td>1.0.0</td>
	</tr>
</table>
~~~
example
detailApi.getDetailData(function(data){
   console.log(data);
});
~~~