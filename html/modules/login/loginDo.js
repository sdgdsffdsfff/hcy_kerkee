/**
 * Modify by liyong on 2015/11/27.
 */
define([
    'zepto',
    'template',
    'clientApi/clientUI',
    'clientApi/clientInfo',
    'clientApi/util',
    'fastclick',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,template,clientUI,clientInfo,util,fastclick,widget,userCenterApi) {
    function LoginDo(){
        this.apply=true;
        this.timer=null;
    }

    LoginDo.prototype.render=function(){
        var t=this;
        fastclick.attach(document.body);
        clientInfo.getHost(function(host){
            t.host=host.info;    
        });

        //用户邀请关系展示
        window.showInviteUser=function(data){
            var newsHtml = util.compileTempl("inviteUser", data);
            $('.J_invite').html('').append(newsHtml);
        };

        window.pageExit=function(){
            var phoneNumber=$('.phone').val();
            var code=$('.code').val();
            if(!phoneNumber){
                clientInfo.addLog('0','登录_离开退出界面&点击界面返回按钮&{"输入框状态":"未填写手机号"}');
            }else if (!code){
                clientInfo.addLog('0','登录_离开退出界面&点击界面返回按钮&{"输入框状态":"未填写验证码"}');
            }else{
                clientInfo.addLog('0','登录_离开退出界面&点击界面返回按钮&{"输入框状态":"已填写"}'); 
            }
        };
        window.deviceExit=function(){
            var phoneNumber=$('.phone').val();
            var code=$('.code').val();
            if(!phoneNumber){
                clientInfo.addLog('0','登录_离开退出界面&Device Back Key&{"输入框状态":"未填写手机号"}');
            }else if (!code){
                clientInfo.addLog('0','登录_离开退出界面&Device Back Key&{"输入框状态":"未填写验证码"}');
            }else{
                clientInfo.addLog('0','登录_离开退出界面&Device Back Key&{"输入框状态":"已填写"}'); 
            }
        };
    };

    LoginDo.prototype.userEvents=function(){
        var t=this;
        /**
        *手机号输入
        *控制是否可以请求验证码
        */
        $('body').on('input','.phone',function(){
            if(t.validatePhone()){
                $('.ableBtn').removeClass('displayNone');
                $('.unableBtn').addClass('displayNone');
            }else{
                $('.unableBtn').removeClass('displayNone');
                $('.ableBtn').addClass('displayNone'); 
            }
        });
        /**
        *调客户端接口，打电话
        */
        $('body').on('click','.makePhoneCall',function(){
            clientInfo.makePhoneCall('4007333300');
            clientInfo.addLog('0','登录_点击收不到验证码按钮&&');
        });
        /**
        *点击发送验证码
        */
        $('body').on('click','.ableBtn',function(){
            // userCenterApi.mobileCode($('.phone').val());
            var phone=$('.phone').val();
            clearTimeout(t.timer);
            $('.unableBtn').removeClass('displayNone').html('获取确认码');
            $('.ableBtn').addClass('displayNone');
            t.getCode(phone);
            clientInfo.addLog('0','登录_点击获取验证码按钮&&');
        });
        /**
        *点击蒙层，remove掉图片验证码层，还有蒙层
        */
        $('body').on('click','.mask',function(){
            $('.unableBtn').addClass('displayNone');
            $('.ableBtn').removeClass('displayNone');
            $('.J_picCode').remove();
            $('.mask').remove();
        });
        /**
        *更换图层验证码
        */
        $('body').on('click','.J_change',function(){
            $('.J_picBox').attr({'src':t.host + '/api/v1/client/showCkCode?v='+ Date.now()});
        });
        /**
        *点击图片验证层，确定按钮
        */
        $('body').on('click','.J_sureBtn',function(){
            var code=$('.J_inputBox').val();
            var phone=$('.phone').val();
            if(!!code && code.length==4){
                clearTimeout(t.timer);
                t.getPicCode(phone,code);
            }else{
                widget.toast('请填写正确的验证码');   
            }
        });
        /**
        *确定登录
        */
        $('body').on('click','.surebtn',function(){
            var phoneNumber=$('.phone').val();
            var code=$('.code').val();
            if(!!phoneNumber && !!code ){
                if(t.apply){
                    userCenterApi.logIn(phoneNumber,code);
                }else{
                    widget.toast('请阅读《斗米兼职注册协议》');
                    clientInfo.addLog('0','登录_点击登录按钮&登录失败&{"校验失败":"未勾选斗米兼职注册协议"}');
                }   
            }else if(!phoneNumber){
                widget.alertDialog('提示','手机号码不能为空');
                clientInfo.addLog('0','登录_点击登录按钮&登录失败&{"校验失败":"手机号不能为空"}');
            }else if(!code) {
                widget.alertDialog('提示','验证码不能为空');
                clientInfo.addLog('0','登录_点击登录按钮&登录失败&{"校验失败":"验证码不能为空"}');
            }   
        });
        /**
        *点击注册协议
        */
        $('body').on('click','.lableBtn',function(){
            var readed=$('.lableBtn').hasClass('active');
            if(readed){
                t.apply=false;
                $('.lableBtn').removeClass('active');
            }else{
                t.apply=true;
                $('.lableBtn').addClass('active');
            }
        });
        /**
        *进去注册页面，选中
        */
        $('body').on('click','.agreementDetail',function(){
            t.apply=true;
            $('.lableBtn').addClass('active');
        });
    };
    /**
    *通过手机号，图片验证码验证，来发送短信验证码
    */
    LoginDo.prototype.getPicCode=function(phone,code){
        //remove
        $('.J_picCode').remove();
        $('.mask').remove();
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:t.host+'/api/v1/client/authCkCode',
                    dataType:'json',
                    type: 'POST',
                    timeout:10000,
                    data:{
                        mobile:phone,
                        code:code,
                        platform:util.OS(),
                        token:'',
                        ts: Date.now()
                    },
                    success:function(data){
                        t.cutDownNumber(30);
                    },
                    error:function(error){
                        var err=eval('('+error.responseText+')');
                        widget.toast(err.message);
                        $('.unableBtn').addClass('displayNone');
                        $('.ableBtn').removeClass('displayNone');
                    }
                });
            }else{
                widget.toast('网络错误，请检查设置');
                $('.unableBtn').addClass('displayNone');
                $('.ableBtn').removeClass('displayNone');
            }
        });
        
    };
    /**
    *通过手机号尝试获取短信验证码
    *code==-3  出现图片验证码层
    */
    LoginDo.prototype.getCode=function(phone){
        var t=this;
        clientInfo.getNetworkType(function(data){
            if(data.network!='invalid'){
                $.ajax({
                    url:t.host+'/api/v1/client/authCkCode',
                    type: 'POST',
                    dataType:'json',
                    data:{
                        mobile:phone,
                        platform:util.OS(),
                        token:'',
                        ts: Date.now()
                    },
                    timeout:10000,
                    success:function(data){
                        t.cutDownNumber(30);
                    },
                    error:function(error){
                        var err=eval('('+error.responseText+')');
                        if(err.code===-3){
                            var data={
                                host:t.host,
                                ts:Date.now()
                            };
                           var newsHtml = util.compileTempl("picCode", data);
                           $('.login-box').append(newsHtml);
                        }else{
                            widget.toast(err.message);
                            $('.unableBtn').addClass('displayNone');
                            $('.ableBtn').removeClass('displayNone');
                        }
                    }
                });
            }else{
                widget.toast('网络错误，请检查设置');
                $('.unableBtn').addClass('displayNone');
                $('.ableBtn').removeClass('displayNone');
            }
        });
    };
    //倒计时
    LoginDo.prototype.cutDownNumber=function(num){
        var t=this;
        $('.unableBtn').removeClass('displayNone');
        $('.ableBtn').addClass('displayNone');
        var t=this;
        clearTimeout(t.timer);
        if(num<=0){
            $('.ableBtn').removeClass('displayNone');
            $('.unableBtn').addClass('displayNone').val('获取确认码');
            return;
        }
        var n=t.toDou(num);
        $('.unableBtn').val(n+'秒后重发');
        num--;
        t.timer=setTimeout(function(){
            t.cutDownNumber(num);
        },1000);
    };
    //个位数补零
    LoginDo.prototype.toDou=function(n){
        return  n<10?'0'+n:''+n;
    };
    //校验手机号
    LoginDo.prototype.validatePhone=function(){
        var value = $('.input').val();
        return value.length === 11 && /^1[34578]\d{9}$/.test(value);
    };

    LoginDo.prototype.init=function(){
        var t=this;
        userCenterApi.start(function () {
            t.render();
            t.userEvents();
        });
    };

    return new LoginDo();
});

