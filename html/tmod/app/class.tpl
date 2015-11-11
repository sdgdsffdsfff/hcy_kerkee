define([
    'zepto',
    'template',
    'when',
    'helper/util',
    'helper/interface',
    //自匹配无串参项
    'domReady!'

],function($,template,when,util,interface){

    function <%=@@body%>(){
        this.mainBox=$("#mainBox");
    };

    <%=@@body%>.prototype.settings=function(){

    };

    <%=@@body%>.prototype.render=function(){
        var t=this;
    }

    <%=@@body%>.prototype.init=function(){
        var t = this;
        interface.start(function () {
            t.settings();
            t.render();
        });
    }

    return new <%=@@body%>();
});