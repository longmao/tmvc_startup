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
			
		}
	};
	return View;
}, {requires:['event', 'dom', 'renderEngine']});