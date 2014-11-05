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
				introduce: "TMVC--Demo"
			};
			callback(data);
		}
	};
	return Model;
});