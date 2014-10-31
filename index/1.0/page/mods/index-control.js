//control层
KISSY.add(function(S, GarbageCollector, Css, D, Model, View, IO) {
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
