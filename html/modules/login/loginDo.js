/**
 * Created by zihong on 2015/9/14.
 */
define([
    'zepto',
    'template',
    'clientApi/clientUI',
    'clientApi/clientInfo',
    'clientApi/util',
    'api/nativeUI/widget',
    'clientApi/userCenterApi',
    'domReady!'
],

function ($,template,clientUI,clientInfo,util,widget,userCenterApi) {
    function LoginDo(){
        this.apply=true;
    }

    // LoginDo.prototype.render=function(){
    //     var t=this;

    // };

    LoginDo.prototype.userEvents=function(){
        var t=this;
        $('body').on('input','.phone',function(){
            if(t.validatePhone()){
                $('.ableBtn').removeClass('displayNone');
                $('.unableBtn').addClass('displayNone');
            }else{
                $('.unableBtn').removeClass('displayNone');
                $('.ableBtn').addClass('displayNone'); 
            }
        });
        $('body').on('tap','.makePhoneCall',function(){
            clientInfo.makePhoneCall('4007333300');
        });
        $('body').on('tap','.ableBtn',function(){
            t.cutDownNumber(30);
            userCenterApi.mobileCode($('.phone').val());
        });
        $('body').on('tap','.surebtn',function(){
            var phoneNumber=$('.phone').val();
            var code=$('.code').val();
            if(!!phoneNumber && !!code ){
                if(t.apply){
                    userCenterApi.logIn(phoneNumber,code);
                }else{
                    widget.toast('请阅读《斗米兼职注册协议》');
                }   
            }else if(!phoneNumber){
                widget.alertDialog('提示','手机号码不能为空');
            }else if(!code) {
                widget.alertDialog('提示','验证码不能为空');
            }   
        });
        $('body').on('tap','.lableBtn',function(){
            var readed=$('.lableBtn').hasClass('active');
            if(readed){
                t.apply=false;
                $('.lableBtn').removeClass('active');
            }else{
                t.apply=true;
                $('.lableBtn').addClass('active');
            }
        });
        $('body').on('tap','.agreementDetail',function(){
            t.apply=true;
            $('.lableBtn').addClass('active');
        });
    };
    //倒计时
    LoginDo.prototype.cutDownNumber=function(num){
        $('.unableBtn').removeClass('displayNone');
        $('.ableBtn').addClass('displayNone'); 
        var timer=null;
        var t=this;
        clearTimeout(timer);
        if(num<=0){
            $('.ableBtn').removeClass('displayNone');
            $('.unableBtn').addClass('displayNone');
            return;
        }
        var n=t.toDou(num);
        $('.unableBtn').val(n+'秒后重发');
        num--;
        timer=setTimeout(function(){
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
            // t.render();
            t.userEvents();
        });
    };

    return new LoginDo();
});

