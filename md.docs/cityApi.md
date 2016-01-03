#H5调用客户端接口
##cityApi
~~~
H5:"cityApi.js"
nativeCls:"cityModules"
~~~

###<font color="red">getPosition</font>
~~~
获取地理位置
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
clientInfo.getPosition(function(posCity){
	console.log(posCity);
}
~~~

###<font color="red">changeCity</font>
~~~
切换城市
~~~
<table>
	<tr>
		<td>param</td>
		<td>Object</td>
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
CityApi.changeCity()
~~~