(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
/**
	$dhx.ui.Mediator Mediate messages between connected actors
 	
 	@namespace $dhx.ui
	@class $dhx.ui.Mediator
	@constructor    
	**/

$dhx.ui.Mediator = (function(root){

    var pubsub = $dhx.MQ,
        PubNub = (function(){
            var full = function(args) {
                var chan = args.channel || 'questions',
                    callback = args.data || function() {},
                    error = args.error || function() {},
                    limit = +args.limit || 5000,
                    start = 0,
                    count = 100,
                    history = [],
                    params = {
                        channel: chan,
                        count: count,
                        callback: function(messages) {
                            var msgs = messages[0];
                            start = messages[1];
                            params.start = start;
                            PUBNUB.each(msgs.reverse(), function(m) {
                                history.push(m);
                            });
                            if (history.length >= limit) return callback(history);
                            if (msgs.length < count) return callback(history);
                            count = 100;
                            add_messages();
                        },
                        error: function(e) {
                            callback(history);
                            error(history);
                        }
                    },
                    add_messages = function () {
                        pubnub.history(params);
                    };
                add_messages();
            },
            hourly = function(setup) {
                var limit = 24;
                var count = 0;
                var chan = setup.channel || 'questions';
                var cb = setup.data || function() {};
                var eb = setup.error || function() {};
                var now = new Date();
                now.setUTCHours(0);
                now.setUTCMinutes(0);
                now.setUTCSeconds(0);
                now.setUTCMilliseconds(0);
                var utc_now = now.getTime();
                var vectors = [];
                PUBNUB.each((new Array(limit)).join(',').split(','), function(_, d) {
                    var day = utc_now - 3600000 * d;
                    pubnub.history({
                        limit: 1,
                        channel: chan,
                        start: day * 10000,
                        error: function() {
                            count++;
                            eb();
                        },
                        callback: function(messages) {
                            // DONE?
                            if (++count == limit) return cb(vectors);
                            // ADD TIME SLICES
                            var res = +(((messages[0][0] || {}).ticker || {}).avg || {}).value;
                            var dt = (new Date(day)).getUTCHours();
                            var rdt = [dt, res];
                            //res && vectors.push(rdt);
                            if( res ) vectors.push(rdt);
                            // KEEP IT SORTED
                            vectors.sort(function(a, b) {
                                return a[0] > b[0] && -1 || 1;
                            });
                        }
                    });
                });
            },
            API = {
                publish: function( message, callback) {
                    //console.log(message);
                    if( typeof message.collection === 'undefined' )
                    {
                        throw "Mediator alerts: Your message does not specify a collection.";
                    }
                    return root.pubnub.publish({
                        channel: message.collection,
                        message: message,
                        callback : callback || function(m){
                            console.log(m);
                        }
                    });
                },
                history: {
                    hourly: hourly,
                    full: full
                }
            };
            return API;
        })(),
        _private = {
            _settingListenerUp: false,
            _listeners: [],
            listening: [],
            _make_listener: function( pattern, fn, onConnect, subscriber_token ){
                var self = this,
                    event,
                    collection;
                
                event = pattern.split(':')[1];
                collection = pattern.split(':')[0];

                //console.info( '$dhx.ui.Mediator registered listener #'+subscriber_token+' event '+event+' for '+ collection + ': ', arguments );

                //subscriber_token = pubsub.subscribe(event, fn);

                if( ! API.live )
                {
                    console.warn("Mediator is performing offline operations.");
                    self._settingListenerUp = false;
                    if( onConnect ) onConnect( subscriber_token );
                }
                else
                {

                    
                    if( _private.listening.length > 0  )
                    {
                        return;
                    }

                    self._settingListenerUp = true;
                    _private.listening.push( collection );

                    //console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', _private.listening);

                    var state = {
                            age: $dhx.ui.session.age(),
                            full: $dhx.ui.session.name(),
                            country: $dhx.ui.session.country(),
                            //appstate: 'foreground',
                            //latlong: '51.5072° N, 0.1275° W'
                    };
                    pubnub.subscribe({
                        channel : collection,
                        //state: state,
                        message : function( message, env, channel ){
                            console.info('Mediator received message sent by '+( message.client_id == $dhx.ui.session.client_id() ? 'this' : 'other'  )+' client from PubNub #'+channel+'. Forwarding to pusub now.');
                            pubsub.publish(message.event, message);
                        },
                        connect : function(channel){
                            
                            
                            
                            self._settingListenerUp = false;
                            
                            console.info('Listening to #'+channel+' collection channel on PubNub.');
                            //console.warn("Mediator is now performing online operations through PubNub.");

                            /*pubnub.state({
                                channel  : channel,
                                state    : state,
                                callback : function(m){
                                    console.log(m)
                                },
                                error    : function(m){
                                    console.log(m)
                                }
                            });*/
                            
                            if( onConnect ) onConnect( subscriber_token );
                        },
                        disconnect : function(){
                            console.log("Disconnected");
                        },
                        reconnect : function(){
                            console.log("Reconnected");
                        },
                        error : function(){
                            console.log("Network Error");
                        },
                        presence : function(m){
                            //console.log('presence: ', m);
                            if(m.data) dhtmlx.message(m.data.full + ' is online.');
                        }
                    });
                }

                return subscriber_token;
            },
            _add_listener: function( list ){
                var self = this,
                    listener;

                for( var x = 0; x < self._listeners.length; x++ )
                {
                    listener = self._listeners[ x ];
                    if( listener.fn ==  list.fn && listener.pattern ==  list.pattern)
                    {
                        return;
                    }
                }

                listener = {
                    pattern: list.pattern, 
                    fn: list.fn, 
                    onConnect: list.onConnect
                };

                self._listeners.push( listener );
            },
            waitForListener: function (listener, callback, interval) {
                interval = +interval || 1000;
                if ( ! self._settingListenerUp ) {
                    callback(listener);
                } else {
                    setTimeout(function () {
                        waitForConnection(listener, callback, interval);
                    }, interval);
                }
            },
        },
        
        API = {
            PubNub: PubNub,
            live: true,
            compose_message: function(event, collection, method, model, options) {
                var message;
                message = {
                    client_id: $dhx.ui.session.client_id(),
                    method: method || null,
                    model: model || null,
                    options: options || null,
                    event: event || null,
                    collection: collection,
                    uuid: $dhx.guid()
                };
                return message;
            },
            /**
            Notify others on an occurrence of an event by setting up a publish point with a string
            @method notify
            
            @param {String} event Event to publish
            @param {Array} params
            **/
            notify : function(event, params) {
                var message;

                if( typeof event === 'undefined' )
                {
                    throw "Mediator alerts: Can not notify without a event";
                }

                if( typeof params  === 'undefined' )
                {
                    throw "Mediator alerts: Can not notify without message params";
                }

                message = this.compose_message(event, params.collection, params.method, params.model, params.options);
                //console.log('publishing: ', message);
                if( API.live )
                {
                    PubNub.publish( message, function(){
                    
                        console.info('Message published to PubNub #'+ message.collection, message);

                        
                    } );
                }
                else
                {
                    console.info('Message published to pubsub #'+ event, message);
                    pubsub.publish(event, message);
                }
                
                
            },
            
            
            /**
            listen to the events published by others by registering a callback on a named event
            @method listen
            
            @param {String} event Event to subscribe the callback function
            @param {Function} fn Callback function
            **/
            // pattern   collectionName:changeModel
            listen : function(pattern, fn, onConnect) {
                var self = this,
                    event,
                    collection,
                    subscriber_token;
                
                event = pattern.split(':')[1];
                collection = pattern.split(':')[0];

                console.warn('Setting up listener to listen to #'+ collection +' on PubNub');

                subscriber_token = pubsub.subscribe(event, fn);

                _private._settingListenerUp = true;
                
                var listener = {
                    pattern: pattern, 
                    fn: fn, 
                    onConnect: onConnect
                };
                _private._add_listener( listener );

                _private.waitForListener(listener, function( listener ){
                    _private._make_listener( listener.pattern, listener.fn, listener.onConnect, subscriber_token );
                });

                return subscriber_token;
            },
            /**
            Unlisten to the events published by others
            @method unlisten
            
            @param {String} event Event to subscribe the callback function
            **/
            unlisten : function(token) {
                pubsub.unsubscribe(token);
            }
        };


    return API;


})(window);
