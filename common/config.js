var TMVC = {};
TMVC.sourceId = "20140811";
TMVC.isUseCache = false;
TMVC.host = "http://172.30.10.76:8080";
TMVC.isUseMiniTmpl = false;
(function(S) {
	function initConfig() {
		S.config({
			   packages:[
				   {

					   name:"utils",

					   tag:"20130106",

					   path:"http://172.30.10.76:8000/",  // cdn上适当修改对应路径

					   charset:"gbk",

					   debug: true
				   }

			   ]
		});
	
	}
	initConfig();
})(KISSY);
