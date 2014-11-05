//model层
KISSY.add(function(S) {
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