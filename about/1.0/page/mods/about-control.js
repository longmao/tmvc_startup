//control层
KISSY.add(function(S, GarbageCollector, Css, D, Model, View) {
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
