var S = KISSY,
    parentId = "#main",
    timePool = [],
    elementArray = [],
    prevPage = "",
    scriptUrls = {},
    delay = setInterval;
var clearTimer = function() {
    for(var index = 0; index < timePool.length; index++) {
        clearInterval(timePool[index]);
        timePool[index] = null;
    }       
}
window.setInterval = function(cb, timer) {
    var timeId = delay(cb, timer);
    timePool.push(timeId);
    return timeId;
}
var clearNode = function() {
    for(var index = 0; index < elementArray.length; index++) {
        if(S.isArray(elementArray[index])) {
            for(var nodeIndex = 0; nodeIndex < elementArray[index].length; nodeIndex++) {
                S.Event.remove(elementArray[index][nodeIndex]);
                elementArray[index][nodeIndex] = null;      
            }
        } else {
            S.Event.remove(elementArray[index]);
            elementArray[index] = null;
        }
    }
}
var clearObject = function() {
                                                                                                    
}
var clearCss = function(D) {
    if(prevPage != "") {
        D.remove("#" + prevPage);
    }
}
TMVC.pageEvent = {};
TMVC.getPageName = function() {
    var hash = window.location.hash;
    var whatPos = hash.indexOf("?");
    var gotoPage = 0;
    if(whatPos == -1) {
        gotoPage = hash.substr(1, hash.length);
    } else {
        gotoPage = hash.substr(1, whatPos - 1);
    }
    if(gotoPage == "") {
        gotoPage = "index";
    }
    return gotoPage;
}
String.prototype.replaceAll = stringReplaceAll;
function stringReplaceAll(AFindText,ARepText){ 
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig"); 
    return this.replace(raRegExp,ARepText); 
}
TMVC.loadComponet = function(urlArray, callback, index) {
        if(!index) {
            index = 0;
        }
        if(scriptUrls[urlArray[index]]) {
            if(index == urlArray.length - 1) {
                callback();
                return;
            } else {
                index++;
                TMVC.loadComponet(urlArray, callback, index);       
            }
        }
        var doc = document;
        var scriptEle = doc.createElement("script");
        scriptEle.src = urlArray[index];
        var headEle = doc.getElementsByTagName("head")[0];
        headEle.appendChild(scriptEle);
        scriptUrls[urlArray[index]] = urlArray[index];
        scriptEle.onload = function() {
            index++;
            if(index == urlArray.length) {
                callback();
            } else {
                TMVC.loadComponet(urlArray, callback, index);
            }
        }
}
TMVC.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var whatPos = window.location.href.indexOf("?");
    var r = window.location.href.substring(whatPos + 1, window.location.href.length).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
TMVC.combinCrossDomainData = function(taskArray, callback, id) {
    S.use("renderEngine", function(S, renderEngine) {
        if(id) {
            renderEngine.showAreaLoaddingPic(id);
        }
        var data = {};
        var syncTaskCount = 0;
        var executedSyncTaskCount = 0;
        function clearGlobalVal() {
            for(var index = 0; index < taskArray.length; index++) {
                window[taskArray[index]['taskName']] = null; 
            }
        }
        for(var index = 0; index < taskArray.length; index++) {
            if(taskArray[index]['taskName']) {
                syncTaskCount++;
            }
        }
        
        S.each(taskArray, function(taskItem) {
            var taskName = taskItem['taskName'];
            if(taskName) {
                window[taskName] = function(newData) {
                    executedSyncTaskCount++;
                    data[taskName] = newData;                               
                    if(executedSyncTaskCount == syncTaskCount) {
                        clearGlobalVal();
                        callback(data);
                    }
                }
            }
            taskItem['task'](taskItem['taskParam']);    
        });
    });
}
TMVC.combinAjaxData = function(taskArray, callback, id) {
    S.use("renderEngine", function(S, renderEngine) {
        var data = {};
        var index = 0;
        if(id) {
            renderEngine.showAreaLoaddingPic(id);
        }
        S.use(['io','json'], function(S, IO, JSON) {
            S.each(taskArray, function(taskItem) {
                $.getJSON(taskItem['url'], function(returnData) {
                    index++;
                    data[taskItem['taskName']] = returnData;
                    if(index == taskArray.length) {
                        callback(data);
                    }       
                }).fail(function(jqXHR, textStatus, errorThrown){
                    console.error(taskItem['url'] + " " + textStatus + ", please check the url path ");
                })

            });
        });
    });
} 
KISSY.add("garbageCollector", function(S, E, D) {
    var elemenet = null;
    function storeElementArray(selector) {
        if(S.isString(selector) && selector.indexOf(".") == 0) {
            elemenet = D.query(selector);
            elementArray.push(elemenet);
        } else if(S.isString(selector) && selector.indexOf("#") == 0) {
            elemenet = D.get(selector);
            elementArray.push(elemenet);
        } else {
            elemenet = selector;
            elementArray.push(elemenet);
        }
        return elemenet;
    }
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
    return garbageCollector;
}, {requires:["event", "dom"]});
KISSY.add("readTmplTool", function(S, D, IO) {
    var tmpl = '';
    function constructIncludeTmpl(tmpl, data) {
        if(!tmpl) {
            return;
        }
        if(tmpl.indexOf('<#include') == -1) {
            if(data) {
                return template("", tmpl)(data);
            } else {
                return tmpl;
            }
        }
        var includePath = '';
        if(data) {
            tmpl = template("", tmpl)(data);
        }
        var reg = /<#include(.*)#>/gi;
        var arrMatches = tmpl.match(reg);
        var arrMatchesStr = arrMatches.join('');
        arrMatches = arrMatchesStr.split('#>');
        if(arrMatches.length > 0) {
            S.each(arrMatches, function(includeItem) {
                if(includeItem == '') {
                    return;
                }
                var includeHtml = includeItem + "#>";
                includeItem = includeItem.replaceAll("'", '"');
                includePath = includeItem.substring(includeItem.indexOf('("') + 2, includeItem.indexOf('")'));
                if(includePath.indexOf("#") > -1) {
                    if(TMVC.isUseMiniTmpl) {
                        includePath = includePath + "-min.tmpl" + "&t=" + TMVC.sourceId
                    } else {
                        includePath = includePath + ".tmpl" + "&t=" + TMVC.sourceId;
                    }
                } else {
                    if(TMVC.isUseMiniTmpl) {
                        includePath = includePath + "-min.tmpl" + "?t=" + TMVC.sourceId;
                    } else {
                        includePath = includePath + ".tmpl" + "?t=" + TMVC.sourceId;
                    }
                }
                new IO({
                    type: "GET",
                    url: includePath,
                    dataType: "html",
                    async: false,
                    cache: TMVC.isUseCache,
                    success: function(html) {
                        if(data) {
                            html = template("", html)(data);
                        }
                        tmpl = tmpl.replaceAll(includeHtml, html);
                    }
                });
            });
        }
        if(tmpl.indexOf('<#include') > -1) {
            tmpl = constructIncludeTmpl(tmpl, data);
        }
        return tmpl;
    }
    var readTmpl = {
        constructIncludeTmpl: function(tmpl, data) {
            return constructIncludeTmpl(tmpl, data);
        },
        readTmplFile: function(tmplIndex, isAsync, tmplPath, callback) {
            var self = this;
            if(tmplPath.indexOf("?") > -1) {
                tmplPath = tmplPath + "&t=" + TMVC.sourceId;
            } else {
                tmplPath = tmplPath + "?t=" + TMVC.sourceId;
            }
            new IO({
               type: "GET",
               url: tmplPath,
               dataType: "html",
               async: isAsync,
               cache: TMVC.isUseCache,
               success: function(html) {
                  tmpl = html;
                  if(callback) {
                     callback(tmplIndex, tmpl);
                  }
                },
                error:function() {
                     callback(tmplIndex, "");
                }
            }); 
            return tmpl;
        }       
    }
    return readTmpl;
}, {requires:['dom', 'io']});

S.add("renderEngine", function(S, D, readTmpl, JSON, A) {
    function renderIncludeTmpl(includeTmplEle, tmplHtml) {
        var tmplHtmlEle = D.create(tmplHtml);
        D.replaceWith(includeTmplEle, tmplHtmlEle);
    }
    //鑾峰彇鍏冪礌鐨勭旱鍧愭爣 
    function getTop(e){ 
        var offset=e.offsetTop; 
        if(e.offsetParent!=null) offset+=getTop(e.offsetParent); 
        return offset; 
    } 
//鑾峰彇鍏冪礌鐨勬í鍧愭爣 
    function getLeft(e){ 
        var offset=e.offsetLeft; 
        if(e.offsetParent!=null) offset+=getLeft(e.offsetParent); 
        return offset; 
    } 
    var Html = {
        contentHtml: '',
        contentHtmlEle: null,
        tmplScriptEle: {},
        scriptIncludeBuffer: [],
        readTmplFile: function(page) {
            this.contentHtml = readTmpl.readTmplFile(0, false, page);
        },
        searchTmplScriptEle: function() {
            var self = this;
            this.contentHtmlEle = D.create(this.contentHtml);
            if(!this.contentHtmlEle || this.contentHtmlEle.nodeType == 3) {
                if(this.contentHtml == undefined) {
                    this.contentHtml = '';
                }
                this.contentHtmlEle = D.create('<div>' + this.contentHtml + '</div>');
            }
            var scriptTmplArray = D.query('.script-tmpl', this.contentHtmlEle);
            for(var index = scriptTmplArray.length - 1; index >= 0; index--) {
                this.tmplScriptEle[scriptTmplArray[index].id] = scriptTmplArray[index];
            }   
        },
        buildScriptInclude: function() {
            S.each(this.tmplScriptEle, function(tmplItem) {
                var scriptHtml = D.html(tmplItem);
                scriptHtml = scriptHtml.replaceAll("'", '"');
                scriptHtml = scriptHtml.replaceAll('<#include(', '<div class="include-tmpl" data=');
                scriptHtml = scriptHtml.replaceAll('")#>', '"/>');
                D.html(tmplItem, scriptHtml);               
            });
        },
        showAreaLoaddingPic: function(id) {
            if(D.get("#" + id).tagName == "SCRIPT") {
                return;
            }
            var containerTop = getTop(D.get('#' + id)),
                containerLeft = getLeft(D.get("#" + id)),
                containerWidth = D.width("#" + id),
                containerHeight = D.height("#" + id);
            var maskEle = D.create("<div class='"+ id +"-ajax-mask'></div>");
            D.width(maskEle, containerWidth);
            D.height(maskEle, containerHeight);
            D.css(maskEle, {
                "opacity":"0.5",
                "background-color":"#000",
                "border":"1px solid #ddd",
                "position":"absolute",
                "top":containerTop + "px",
                "left":containerLeft + "px",
                "width":containerWidth + "px",
                "height":containerHeight + "px",
                "z-index":"99999999"
            });
            var ajaxLoaderEle = D.create('<img src="images/loader.gif" id="ajax-loader">');
            var marginLeft = "0"; 
            var marginTop = "0";
            var top = "0";
            var scrollTop = D.scrollTop();
            var viewportH = D.viewportHeight();
            var screenBottomY = scrollTop + viewportH;
            if(containerTop >= scrollTop && containerTop + containerHeight >= screenBottomY) {
                top = (screenBottomY - containerTop) / 2 + "px";
            } else if(containerTop <= scrollTop && (containerTop + containerHeight) >= screenBottomY) {
                top = (scrollTop - containerTop) + (screenBottomY - scrollTop) / 2 + "px";
            } else if(containerTop <= scrollTop && (containerTop + containerHeight) <= screenBottomY) {
                top =  (scrollTop - containerTop) + (containerTop + containerHeight - scrollTop) / 2 + "px";
            } else {
                top = "50%";
            }
            if(containerWidth != 0 && containerHeight != 0) {
                marginLeft = -32 + "px";
                marginTop = -5 + "px";
            }
            D.css(ajaxLoaderEle, {
                "position":"absolute",
                "left":"50%",
                "top":top,
                "margin-top":marginTop,
                "margin-left":marginLeft    
            });
            D.append(ajaxLoaderEle, maskEle);
            D.append(maskEle, document.body);
        }, 
        renderHtml: function(id, data, callback) {
            var isUpdate = D.attr("#" + id, "data-is-update");
            if(isUpdate == "false") {
                return;
            }
            D.attr("#" + id, "data-is-update", "false");
            var self = this;
            var renderCount = 0;
            var htmlStr = template(id, data);
            A("#" + id, {opacity:1}, 0.5, 'ease', function() {//寮�鏇存柊鏁堟灉   
                var newHtmlEle = D.create("<div>" + htmlStr + "</div>");
                newHtmlEle.id = id;
                var includeTmplEles = D.query('.include-tmpl', newHtmlEle);
                if(includeTmplEles.length > 0) {
                    S.each(includeTmplEles, function(includeTmplEle) {
                        if(TMVC.isUseMiniTmpl) {
                            var tmplPath = D.attr(includeTmplEle, 'data') + "-min.tmpl";
                        } else {
                            var tmplPath = D.attr(includeTmplEle, 'data') + ".tmpl";
                        }
                        var scriptIncludeHtml = readTmpl.readTmplFile(0, false, tmplPath);
                        scriptIncludeHtml = readTmpl.constructIncludeTmpl(scriptIncludeHtml, data);
                        scriptIncludeHtml = S.unEscapeHTML(scriptIncludeHtml);
                        renderIncludeTmpl(includeTmplEle, scriptIncludeHtml);
                    });                                         
                }
                if(D.get("#" + id).tagName == "SCRIPT") {
                    D.replaceWith('#' + id, newHtmlEle);
                } else {
                    D.html('#' + id, D.html(newHtmlEle));
                    D.remove('.' + id + '-ajax-mask');
                    D.attr("#" + id, "data-is-update", "true");
                }
                D.css('#' + id, 'opacity', 0.1);
                A('#' + id,{opacity:1},0.5,'ease', function() {//鏄剧ず鏇存柊鍚庣殑鍐呭
                    if(!TMVC.pageEvent[TMVC.getPageName()]) {
                        TMVC.pageEvent[TMVC.getPageName()] = {};
                    } 
                    if(!TMVC.pageEvent[TMVC.getPageName()][id]) {
                        if(callback) {  
                            TMVC.pageEvent[TMVC.getPageName()][id] = callback;
                        }
                    }
                    if(TMVC.pageEvent[TMVC.getPageName()][id]) {
                        TMVC.pageEvent[TMVC.getPageName()][id]();
                    }
                }).run();
            }).run();           
        },
        init: function(page) {
            if(TMVC.isUseMiniTmpl) {
                page = page.replace(".tmpl", "-min.tmpl");
            }
            this.readTmplFile(page);
            this.searchTmplScriptEle();
            this.buildScriptInclude();
            var contentHtml = S.unEscapeHTML(D.outerHTML(this.contentHtmlEle));
            if(contentHtml.indexOf('<#include') > -1) {
                D.html(parentId, readTmpl.constructIncludeTmpl(contentHtml));
            } else {
                D.html(parentId, contentHtml);
            }
        }   
    }
    return Html;
}, {requires:['dom', 'readTmplTool', 'json', 'anim']});

KISSY.add("css", function(S, D, readTmpl) {
    var cssText = "";
    var Css = {
        loadCss: function(currentPage) {
            if(location.href.indexOf('debug') == -1) {
                    cssText = readTmpl.readTmplFile(0, false, currentPage + "/" + timestamp[currentPage] + "/page/" + currentPage + ".css");
            } else {
                    cssText = readTmpl.readTmplFile(0, false, currentPage + "/1.0/page/" + currentPage + ".css");
            }
            var styleEle = D.create("<style>", {id:currentPage});
            D.html(styleEle, cssText);
            D.prepend(styleEle, document.body);
        },
        setCurrentPageName: function(CurrentPageName) {
            prevPage = CurrentPageName;
        }
    }
    return Css;
}, {requires:['dom', 'readTmplTool']});

KISSY.add("spa", function(S, E, D, A, Css, readTmpl) {
    function clearCurrentPage() {
        D.html(parentId, "");           
    }
    function loadScript(path) {
        var scriptEle = D.create("<script>");
        scriptEle.src = path;
        scriptEle.async = false;
        D.get(parentId).appendChild(scriptEle);
    }   
    function clearLoadding() {
        setTimeout(function() {
            if(!D.get("#pageScript")) {
                A(".loadding", {opacity:0}, 0.5, 'ease', null, null).run();
                A(parentId,{opacity:1},1,'ease', null).run();
                //A(parentId,{left:0},1,'ease', null).run();
            } else {
                clearLoadding();
            }   
        }, 500);
    }
    function executeJsScript(scriptContent) {
        eval(scriptContent);
    }
    function showLoaddingPic(viewportHeight) {
        S.later(function() {
            D.css(".loadding", {opacity: 1, top: viewportHeight / 2 + "px"});
        }, 500);
    }
    function showGotoPage(gotoPage) {
        TMVC.pageEvent = {};
        var mainWidth = D.width(parentId);
        var docWidth = D.docWidth();
        var viewportHeight = D.viewportHeight();
        var scriptEle = D.create("<script>");
        var timestampPath = timestamp[gotoPage];
        showLoaddingPic(viewportHeight);
        Css.loadCss(gotoPage);
        if(location.href.indexOf('debug') != -1) {
            var scriptContent = "";
            scriptContent += readTmpl.readTmplFile(0, false, gotoPage + "/1.0/page/mods/" + gotoPage + "-model.js").replaceAll("KISSY.add(function", "KISSY.add('page/mods/" + gotoPage + "-model" + "', function");
            scriptContent += readTmpl.readTmplFile(0, false, gotoPage + "/1.0/page/mods/" + gotoPage + "-view.js").replaceAll("KISSY.add(function", "KISSY.add('page/mods/" + gotoPage + "-view" + "', function");
            scriptContent += readTmpl.readTmplFile(0, false, gotoPage + "/1.0/page/mods/" + gotoPage + "-control.js").replaceAll("KISSY.add(function", "KISSY.add('page/mods/" + gotoPage + "-control" + "', function");
            executeJsScript(scriptContent);
            scriptEle.src = gotoPage + "/1.0/page/init.js";
        } else {
            scriptEle.src = gotoPage + "/" + timestampPath + "/page/init-min.js?t=" + timestamp['serverTime'];
        }
        A(
           parentId,
        {
           //left:-(mainWidth + (docWidth - mainWidth) / 2)
            opacity:0   
        },0.5,'ease',function() {
            clearCurrentPage();
            //D.css(parentId, 'left', (mainWidth + (docWidth - mainWidth) / 2));
            scriptEle.id = "pageScript";
            D.get(parentId).appendChild(scriptEle);
            scriptEle.onload = clearLoadding;
        }).run();
    }
    function gotoPage() {
        showGotoPage(TMVC.getPageName());
    }
    var Spa = {
        bindEvent: function() {
            window.onhashchange = gotoPage;
        },
        start: function() {
            showGotoPage(TMVC.getPageName());
            this.bindEvent();
        }
    }
    return Spa;
}, {requires:['event', 'dom', 'anim', 'css', 'readTmplTool']});
KISSY.use(["spa", "garbageCollector"], function(S, Spa, GarbageCollector) {
    GarbageCollector.init();
    Spa.start();
});