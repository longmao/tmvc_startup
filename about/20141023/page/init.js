/*
combined files : 

page/mods/about-control
page/mods/about-model
page/mods/about-view
page/init

*/
//control层
KISSY.add('page/mods/about-control',function(S, GarbageCollector, Css, D, Model, View) {
	var Control = {
		init: function() {
			GarbageCollector.startCollect();//启动垃圾回收器
			Css.setCurrentPageName("about");//设置当前页面名称
			View.init("tmpl/about/about.tmpl")//添加自己的初始化模板;
			Model.getMarkData(function(data) {
											//渲染html模块例如: View.renderHtml('content-tmpl', data);
											//为添加的模块绑定事件View.bindContentEvent();
			});//获取标签数据并且渲染
			Model.getFooterIntroduceData(function(data) {
				
			});//获取介绍数据并且渲染
		}
	}
	return Control;
}, 
{requires:["garbageCollector", "css", "dom", "page/mods/about-model", "page/mods/about-view"]});

//model层
KISSY.add('page/mods/about-model',function(S) {
	var Model = {
		getMarkData: function(callback) {
			var data = {  title: '标签',
						  list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
					   };
			callback(data);
		},
		getFooterIntroduceData: function(callback) {
			var data = {
				introduce: "欢迎使用artTemplate模板引擎，体验终极快感！"
			};
			callback(data);
		}
	};
	return Model;
});
//view层
KISSY.add('page/mods/about-view',function(S, E, D, renderEngine) {
	var View = {
		init: function(tmpl) {
			renderEngine.init(tmpl);
		},
		renderHtml: function(tmpl, data, callback) {
			renderEngine.renderHtml(tmpl, data, callback);
		},
		bindEvent: function() {//初始化页面绑定事件
			
		}
	};
	return View;
}, {requires:['event', 'dom', 'renderEngine']});
KISSY.add("page-init", function(S) {
}, {
    requires: ['page/mods/about-control']
});
KISSY.use('page/mods/about-control', function(S, Control) {
	Control.init();	
});
