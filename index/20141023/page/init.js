/*
combined files : 

page/mods/index-control
page/mods/index-model
page/mods/index-view
page/init

*/
//control层
KISSY.add('page/mods/index-control',function(S, GarbageCollector, Css, D, Model, View, IO) {
    var Control = {
        init: function() {
            GarbageCollector.startCollect(); //启动垃圾回收器
            Css.setCurrentPageName("index"); //设置当前页面名称
            View.init("tmpl/index/index.tmpl") //添加自己的初始化模板;
            View.bindEvent(); //绑定页面事件。
            Model.getMarkData(function(data) {
                //渲染html模块例如: View.renderHtml('content-tmpl', data);
                //为添加的模块绑定事件View.bindContentEvent();
            }); //获取标签数据并且渲染
            Model.getFooterIntroduceData(function(data) {

                View.renderHtml("test", data, function() {
                    console.log("test view rendered!");
                })
            }); //获取介绍数据并且渲染


            TMVC.combinAjaxData([{
                taskName: "task1",
                url: "mockData/index/getUsername.js"
            },{
                taskName: "task2",
                url: "mockData/index/getUsername2.js"
            }], function(data) {
                View.renderHtml("user", data, function() {
                    console.log("user view rendered!");

                })
            })



            TMVC.combinAjaxData([{
                taskName: "task1",
                url: "mockData/index/getUsername.js"
            }], function(data) {
                View.renderHtml("user_update", data, function() {
                    console.log("user_update view rendered!");

                })
            })


            TMVC.combinCrossDomainData([{
                task: function(param) {
                    new IO({
                        type:"get",
                        dataType: 'jsonp',
                        jsonpCallback: 'cb1',
                        url: "http://127.0.0.1:8000/mockData/index/crossdomain.js",
                        success: function(data) {
                            console.log(data)
                            window['task1'] && window['task1'](data)
                        }
                    });
                },
                taskName: "task1"
            }, {
                task: function(param) {
                    new IO({
                        type:"get",
                        dataType: 'jsonp',
                        jsonpCallback: 'cb2',
                        url: "http://127.0.0.1:8000/mockData/index/crossdomain2.js",
                        success: function(data) {
                            console.log(data)
                            window['task2'] && window['task2'](data)
                        }
                    });
                },
                taskName: "task2"
            }], function(data) {
                View.renderHtml("CrossDomainData", data, function() {
                    console.log("CrossDomainData view rendered!");

                })
            })





        }
    }
    return Control;
}, {
    requires: ["garbageCollector", "css", "dom", "page/mods/index-model", "page/mods/index-view", "io"]
});
//# sourceURL=dynamicScript.js

//model层
KISSY.add('page/mods/index-model',function(S) {
	var Model = {
		getMarkData: function(callback) {
			var data = {  title: '标签',
						  list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
					   };
			callback(data);
		},
		getFooterIntroduceData: function(callback) {
			var data = {
				introduce: "TMVC--Demo"
			};
			callback(data);
		}
	};
	return Model;
});
//view层
KISSY.add('page/mods/index-view',function(S, E, D, renderEngine) {
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
KISSY.add("page-init", function(S) {
}, {
    requires: ['page/mods/index-control']
});

KISSY.use('page/mods/index-control', function(S, Control) {
	Control.init();	
});
