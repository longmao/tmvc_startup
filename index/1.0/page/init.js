KISSY.add("page-init", function(S) {
}, {
    requires: ['page/mods/index-control']
});
KISSY.use('page/mods/index-control', function(S, Control) {
	Control.init();	
});