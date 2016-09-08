(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
/**
	$dhx.ui.session Emulate session on client side
 	
 	@namespace $dhx.ui
	@class $dhx.ui.session
	@constructor    
	**/

$dhx.ui.session = (function(){

    var API = {
        _client_id: $dhx.guid(),
        _first_name: 'Jose Eduardo',
        _last_name: 'Perotta de Almeida',
        _age: 32,
        _country: 'BR',
        client_id: function(){
            return this._client_id;
        },
        age: function(){
            return this._age;
        },
        country: function(){
            return this._country;
        },
        name: function(){
            return this._first_name + ' ' + this._last_name;
        }
    };


    return API;
})();
