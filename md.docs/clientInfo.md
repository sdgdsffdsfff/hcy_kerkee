#H5调用客户端接口
##clientInfo
~~~
H5:"clientInfo"
nativeCls:"clientInfo"
~~~
###<font color="red">getHost</font>
~~~
获取服务端的接口域名
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
		<td>1.0.0</td>
	</tr>
</table>
~~~
example

clientInfo.getHost(function(host{    
	console.log(host.info);
}
~~~

###<font color="red">dataDownloadFinished</font>
~~~
通知客户端数据加载完毕
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
		<td>1.0.0</td>
	</tr>
</table>
~~~
example

clientInfo.dataDownloadFinished();
~~~

###<font color="red">addLog</font>
~~~
收集统计
~~~
<table>
	<tr>
		<td>param</td>
		<td>String type 日志类型</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String log</td>
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

clientInfo.addLog(type,log);
~~~

###<font color="red">getNetworkType</font>
~~~
判断当前网络状态
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
		<td>1.0.0</td>
	</tr>
</table>
~~~
example

clientInfo.getNetworkType(function(status){
  console.log(status);
}
~~~

###<font color="red">makePhoneCall</font>
~~~
打电话
~~~
<table>
	<tr>
		<td>param</td>
		<td>String phoneNumber</td>
	</tr>
	<tr>
		<td>return</td>
		<td>void</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>1.0.0</td>
	</tr>
</table>
~~~
example

clientInfo.makePhoneCall(phoneNumber);
~~~

###<font color="red">setCache</font>
~~~
设置缓存
~~~
<table>
	<tr>
		<td>param</td>
		<td>String key</td>
	</tr>
	<tr>
		<td>param</td>
		<td>Object data</td>
	</tr>
	<tr>
		<td>param</td>
		<td>Number cacheTime</td>
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

clientInfo.setCache(key, data, timeout);
~~~


###<font color="red">getCache</font>
~~~
设置缓存
~~~
<table>
	<tr>
		<td>param</td>
		<td>String key</td>
	</tr>
	<tr>
		<td>param</td>
		<td>Function data</td>
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

clientInfo.getCache(key,callBack);
~~~

###<font color="red">getWebImageCacheDir</font>
~~~
获取缓存图片，针对安卓
~~~
<table>
	<tr>
		<td>param</td>
		<td>Function callBack</td>
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

clientInfo.getWebImageCacheDir(callBack);
~~~
