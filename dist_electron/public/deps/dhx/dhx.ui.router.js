(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
/**
	$dhx.ui.Router is used to handle url navigation by setting up routes and hash codes
 	
 	@namespace $dhx.ui
	@class $dhx.ui.Router
	@constructor    
	**/

$dhx.ui.router = (function(){

	var router = crossroads.create();
    router.normalizeFn = crossroads.NORM_AS_OBJECT;
    router.routed.add(function(request, data){
        //console.log('xxxxxxx');
		//console.log(request);
		//console.log(data);

		//console.log( arguments );
        $dhx.ui.mvp.loadModule( request, data );
	});

	crossroads.bypassed.add(function(request){
	    throw 'Route ' + request + ' not declared';
	});

    var API = {
    	router: router,
    	request_url: false,
        /**
        Creates a new route pattern and add it to crossroads routes collection
        @method addRoute
			
        @param {String} pattern String pattern that should be used to match against requests
        @param {Function} handler Function that should be executed when a request matches the route pattern
        **/
        addRoute: function(pattern, handler) {
            var route = router.addRoute(pattern, handler);
            route.matched.add(function(id){
			 	//console.log('XXXDDDDDD matched ', id);
			});
			route.switched.add(function(id){
			 	//console.log('XXXDDDDDD switched: '+ id);
			});
        },
        /**
        Set the hash code to the url
        @method routeTo
        		
        @param {String} path Hash code to update the url
        **/
        routeTo: function(path) {
        	//console.log( 'path: ', path );
            hasher.setHash(path);
        },
        /**
        Initializes the router by parsing initial hash, parsing hash changes and initializing the hasher 
        @method init
        **/
        init: function() {
        	var none_route = '',
    			root_route = '#/';

    		this.request_url = ( window.location.hash || '' ).replace(/#/, '').replace(/\//, '');
    		if( this.request_url.length === 0 )
    		{
    			this.request_url = false;
    		}

    		//console.log( window.location.hash );

    		window.location.hash = '';

            function parseHash(newHash, oldHash) {
                router.parse(newHash);
            }
            hasher.initialized.add(parseHash); // parse initial hash
            hasher.changed.add(parseHash); // parse hash changes
            if (!hasher.isActive()) {
                hasher.init(); // start listening for history change
            }
        }
    };

    

    

    API.init();

    return API;


})();
