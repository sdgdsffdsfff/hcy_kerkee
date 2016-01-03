#H5调用客户端接口
##userCenterApi

~~~
H5:"userCenterApi.js"
nativeCls:"userCenter"
~~~

###<font color="red">mobileCode(不用)</font>
~~~
获取验证码
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
userCenterApi.mobileCode(phoneNumber);
~~~

###<font color="red">logIn</font>
~~~
登录
~~~
<table>
	<tr>
		<td>param</td>
		<td>String phoneNumber</td>
	</tr>
	<tr>
		<td>param</td>
		<td>String verifyCode</td>
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
userCenterApi.logIn(phoneNumber,verifyCode);
~~~

###<font color="red">logOut</font>
~~~
登出
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
userCenterApi.logOut();
~~~

###<font color="red">userInfo(不用)</font>
~~~
获取个人中心数据
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
userCenterApi.userInfo(function(data){
	console.log(data);
});
~~~

###<font color="red">cashList(不用)</font>
~~~
钱包页面入账列表
~~~
<table>
	<tr>
		<td>param</td>
		<td>Number page</td>
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
userCenterApi.cashList(1,function(data){
	console.log(data);
});
~~~

###<font color="red">userBalance(不用)</font>
~~~
钱包页面入账列表
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
userCenterApi.userBalance(function(data){
	console.log(data);
});
~~~

###<font color="red">applyCash</font>
~~~
钱包页面入账列表
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
userCenterApi.applyCash();
~~~

###<font color="red">inviteCode(不用)</font>
~~~
获取邀请码
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
userCenterApi.inviteCode(function(data){
	console.log(data);
});
~~~

###<font color="red">applyList(不用)</font>
~~~
我的兼职数据
~~~
<table>
	<tr>
		<td>param</td>
		<td>Number page</td>
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
userCenterApi.applyList(page,function(data){
	console.log(data);
});
~~~

###<font color="red">userStatus</font>
~~~
用户登录状态，以及cookie
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
userCenterApi.userStatus(page,function(data){
	console.log(data);
});
~~~