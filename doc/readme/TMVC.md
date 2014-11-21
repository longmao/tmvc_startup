    

# TMVC2.0

TMVC是一个基于kissy的MVC框架，封装了针对web page开发的normal case以及spa两种开发模式。

目前版本是2.0。

## Why TMVC为何使用TMVC

1.  基于成熟框架kissy，可采用kissy丰富又强大的模块，开发效率高

2.  基于自动化开发部署工具TMVCPIE，可自动生成开发starter目录，以及自动打包及部署功能，开发新页面或者模块非常方便快捷

3.  框架支持模块扩展，可根据项目需求进行自主开发模块，增强项目开发的灵活性。

## Installment安装

 1.  首先需要安装node

 2.  安装tmvc-pie

		 
		 npm install tmvcpie -g
		 

## Usage使用

1. 获取配置文件


        tmvc  start


      *   配置文件tmvc-conf.json如下
	      *   appType可为spa、normal，分别代表单页面应用以及常规应用。

                        {
						    "appType":"spa",
						    "pageType":"html",
						    "deploy": {
						        "A":
						        {
						            "host":"172.30.10.219",
						            "port":"8888",
						            "path":"/upload.php",
						            "username": "xxxx",
						            "password": "******",
						            "serverAppPath": "/dianyi/app/aef"
						        }
						    },
						    "publish": {
						        "backHost": "http://ips.ymtech.info",
						        "frontHost": "http://feips.ymtech.info/"    
						    }
2.  根据配置文件，创建tmvc初始化项目
		
		tmvc  -i  tmvc2.0
	
3.  新添加新页面，如新添加home页面.

        tmvc <span class="hljs-attribute">-c</span> home
        
4.  根据 项目名称根路径/页面名称 进行前端打包

        tmvc -b tmvc/index
        
5.  启动调试服务器。打开[http://longmao.github.io/tmvc_startup?debug](http://longmao.github.io/tmvc_startup?debug) 测试调试开发(debug代表当前是调试状态，所有js css文件采用非压缩版本。)

        tmvc release -p 8000

## Module模块

### garbageCollector

垃圾收集器，完成对之前页面存在的timer 和 通过kissy.event.on以及kissy.event.delegate 绑定的dom 事件。

	    var garbageCollector = {    
	        startCollect: function() {
	            clearTimer();
	            clearNode();
	            clearObject();
	            clearCss(D);
	        },  
	        init: function() {
	            window.Evt = {};
	            window.Evt.on = S.Event.on;
	            window.Evt.delegate = S.Event.delegate;
	            S.Event.delegate = function(contextSelector, eventType, selector, func) {
	                var elemenet = storeElementArray(selector);
	                Evt.delegate(contextSelector, eventType, elemenet, func);
	            }
	            S.Event.on = function(selector, eventType, func) {
	                var elemenet = storeElementArray(selector); 
	                Evt.on(elemenet, eventType, func);
	            }       
	        }
	
	    }
### readTmplTool

实现对模板文件的读取以及读取模板中包含include子模板

### renderEnginein

1.  实现对模板中包含对class命名为sciprt-tmp的元素解析：将script-tmpl中包含的include进行替换

2.  增加ajax请求某一id元素时添加遮罩。

3.  通过renderHtml进行渲染html操作：

    *   首先判断html片段是否在更新，如果正在更新，则返回。
    *   通过artTempalte提供template(id,data)方法获得html字符串。
    *   通过D.query(selector, htmlElem)查找类名include-tmpl的元素。如果存在这样的元素。则读取元素的data属性，获取到要请求的include文件路径。执行include子模板请求，并将返回结果替换掉原模板中include片段。
    *   如果指定id是scirpt标签，则运用D.replaceWith用新生成的htmlElm替换掉原有scriptElm，如果不是，则运用D.html更新原有elem。
    *   判断当前id渲染是否是第一次，如果是，则执行渲染完成后的callback，并按照{id:callback}存储在TMVC.pageEvent[TMVC.getPageName()]对象中。

4.  通过init完成初始化工作：

    *   根据配置文件中指定的isUseMiniTmpl，决定是否获取模板的压缩文件。
    *   同步读取模板文件，将获取到的模板文件存在this.contentHtml
    *   查找模板中是否存在类名为script-tmpl的元素。如果存在，则将script-tmpl元素存在this.tmplScriptEle数组中。
    *   对this.tmplScriptEle通过replaceAll进行替换处理。将<#include(‘temp.tmpl’)#>片段。替换成
                            `<div class="include-tmpl" data="temp.tmpl">`

### css

1.  通过页面url是否包含debug决定是否加载压缩文件。

2.  创建style元素。prepend插入到document.body中前面。

3.  设置当前页面名称。

### spa

1.  通过onhashchange绑定gotoPage回调处理，这是tmvc对spa和normal两种不同应用不同的地方。

2.  showGotopage处理页面跳转：

    *   计算当前显示高度viewportHeight，显示loadingpic。
    *   通过css模块中loadCss方法加载跳转页面相关的css文件。
    *   如果当前是调试状态，则将页面指定的view、model、control三个js文件加载同步加载，将请求的结果拼装成一个字符串，运用eval进行执行javascript代码。

3.  对入口#main元素做以下处理：

    *   清空 #main元素
    *   在#mian中插入id为pageScript的当前页面init文件
    *   当init文件加载完成后，隐藏loadingPic。

## 目前存在的问题

1.  hard to breakpoint debug，对于debug开发，难于断点测试，目前只能靠console or alert比较费时的debug方式

2.  lack of test unit 缺乏测试用例

3.  lack of some html5 support,such as History API pushstate ,缺少html5支持。

4.  lack of mobile platform support，缺少移动端支持，需要对移动端开发进行优化。