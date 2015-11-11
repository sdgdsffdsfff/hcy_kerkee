define([
    'zepto',
    'template',
    'when',
    'helper/util',
    'helper/interface',
    //自匹配无串参项
    'domReady!'

],function($,template,when,util,interface){

    function special(){
        this.mainBox=$("#mainBox");
    };

    special.prototype.settings=function(){

    };

    special.prototype.render=function(){
        var t=this;
    }

    special.prototype.init=function(){
        var t = this;
        interface.start(function () {
            t.settings();
            t.render();
        });
    }

    return new special();
});