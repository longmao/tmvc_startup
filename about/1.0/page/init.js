KISSY.add("page-init", function(S) {
}, {
    requires: ['page/mods/about-control']
});
KISSY.use('page/mods/about-control', function(S, Control) {
	Control.init();	
});