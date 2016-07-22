$dhx.ui.mvp.presenters.declare({
    "help": (function() {
	    'strict';
	    var API = {
			start: function() {
				$dhx.debug.log('help:PRESENTER: start from presenter defined by user');
			},
			destroy:function(){
				$dhx.debug.log('help:PRESENTER: destroy from presenter defined by user');
				//$dhx.debug.log(this._view);
				
			}
		};
	    return API;
	}())
});