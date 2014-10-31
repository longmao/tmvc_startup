//view层
KISSY.add(function(S, E, D, renderEngine) {
    var View = {
        init: function(tmpl) {
            renderEngine.init(tmpl);
        },
        renderHtml: function(tmpl, data, callback) {
            renderEngine.renderHtml(tmpl, data, callback);
        },
        bindEvent: function() {//初始化页面绑定事件
            E.on("#refresh","click",function(){
                TMVC.combinAjaxData([{taskName: "task1" ,url: "mockData/index/updateUsername.js"}],function(data){
                    View.renderHtml("user_update", data, function(){
                    })
                },"user_update")
            })

            E.on("#showScriptTmpl","click",function(){
                View.renderHtml("script-tmpl-demo", {}, function() {
                    console.log("script-tmpl-demo view rendered!");

                })
            })

            E.on("#loadScript","click",function(){
                var loadScript = "http://facebook.github.io/react/js/react.js"
                TMVC.loadComponet([loadScript],function(){
                    View.renderHtml("script-tmpl-loadScript", {loadScript:loadScript}, function() {
                    })
                },0)
            })
            E.on("#loadScriptTmpl","click",function(){
                var loadScript = "http://facebook.github.io/react/js/react.js"
                TMVC.loadComponet([loadScript],function(){
                    View.renderHtml("script-inline-tmpl-loadScript", {}, function() {
                    })
                },0)
            })


        }
    };
    return View;
}, {requires:['event', 'dom', 'renderEngine']});