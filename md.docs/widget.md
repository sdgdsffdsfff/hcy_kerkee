#H5调用客户端接口
##widget
~~~
H5:"widget.js"
nativeCls: "widget"
~~~
###<font color="red">toast</font>

	H5调用系统原生toast
<table>
	<tr>
		<td>param</td>
		<td>String  info</td>
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
widget.toast(info);
~~~   
###<font color="red">showDialog</font>

	H5调用系统原生dialog，类似promt
<table>
	<tr>
		<td>param</td>
		<td>String  title 标题文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String message 内容文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String okBtn 确定文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String cancelBtn 取消文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>Function fn 回调函数</td>
	</tr>
	<tr>
		<td>return</td>
		<td>Object type 1-确定 | 0-取消</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>1.0.0</td>
	</tr>
</table>

~~~
example
widget.showDialog(title,message,function(data){},okBtn,cancelBtn);
~~~ 		

###<font color="red">alertDialog</font>

	H5调用系统原生dailog，显示效果类似alert
<table>
	<tr>
		<td>param</td>
		<td>String  title 标题文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String message 内容文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String okBtn 确定文本</td>
	</tr>
	<tr>
		<td>param</td>
		<td>Function fn 回调函数</td>
	</tr>
	<tr>
		<td>return</td>
		<td>Object type 1-确定</td>
	</tr>
	<tr>
		<td>appVersion</td>
		<td>1.0.0</td>
	</tr>
</table>

~~~
example
widget.showDialog(title,message,function(data){},okBtn);
~~~ 

###<font color="red">loadState</font>

	调用客户端断网view
<table>
	<tr>
		<td>param</td>
		<td>String loadState "loadFailed" 已写死</td>
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
widget.loadState();
~~~ 

###<font color="red">share</font>

	调用客户端分享控件
<table>
	<tr>
		<td>param</td>
		<td>Json {title:'',text:'',img:'',url:''}</td>
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
widget.share(json);
~~~ 

###<font color="red">setPullToRefreshWebView(待定)</font>

	调用客户端下拉刷新
<table>
	<tr>
		<td>param</td>
		<td>Boolean true 下拉刷新</td>
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
widget.setPullToRefreshWebView(true);
~~~ 