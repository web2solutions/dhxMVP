/*jshint loopfunc: true */
/**
 * model.database
 * model.versions
 * model.schema
 * model.data
 */
$dhx.ui.mvp.model.engine.declare({
    "backboneIDB": (function() {
        'strict';
        var model = (function() {
            var _private = {
                    /**
                     * [database indexeddb-backbonejs-adapter database object]
                     * @type {Object}
                     */
                    database: {
                        /**
                         * [id name of the IndexedDB database]
                         * @type {String}
                         */
                        id: "dhxMVP__host4",
                        description: "dhxMVP demo database",
                        nolog: true,
                        /**
                         * [migrations Stores a set of metadata object. 
                         * Every object defines a database version.
                         * This array will be filled on model.schema.start() ]
                         * @type {Array}
                         */
                        migrations: []
                    },
                    /**
                     * [versions metadata is a set of objects that defines all versions of the database.
                     * This metadata will be used as configuration to set up indexedDB stores, 
                     * setup grids and forms on UI and validate input data]
                     * @type {Object}
                     */
                    versions: {
                        /**
                         * This is the number of the version. Shall to be a integer number, 
                         * but encoded as JSON string.
                         * This number is used to set up a indexedDB version number
                         */
                        "1": $dhx.ui.mvp.model.collection.get()
                    },
                    start: function(c) {
                        console.log('model.start() triggered');
                        if (c.onSuccess) c.onSuccess();
                    }
                },
                _public = {
                    database: _private.database,
                    versions: _private.versions,
                    start: _private.start
                };
            return _public;
        }());
        model.subscriber =function(event, message) {
            var now = (new Date()).getTime() * 10000;

            // if message was sent by other client
            //if( message.client_id != $dhx.ui.session.client_id() )
            //{
                console.log( message.method );
                if( model.schema.io[ message.collection ] )
                {
                    if( model.schema.io[ message.collection ][ message.method ] )
                    {
                        //console.log('backboneIDB Received Message: ', message);

                        $dhx.jDBdStorage.storeObject('$dhx.mvp.ui.last_sync_time', $dhx.crypt.base64_encode(now));
                        
                        message.model.notify = false;
                        
                        if( message.model._id )
                        {
                            message.model.id = message.model._id;
                        }
                        console.log( message.method );
                        model.schema.io[ message.collection ][ message.method ]({
                            record: message.model,
                            onSuccess: function() {
                                console.info('success '+message.method+'ing record: ', (message.model.id || message.model) );
                                
                            },
                            onFail: function() {
                                console.warn('discarding record: ', message.model);
                                //console.warn('props: ', Object.keys(message.model).length);
                            }
                        });
                        return;
                    }
                }
                
                console.warn('backboneIDB Received Unknow Message: ', message);
            //}
        };
        model.data = (function() {
            var _collections = {},
                _private = {},
                API = {
                    _collections: _collections,
                    setIoAPI : function(collectionName, modelName){
                        
                        model.schema.io[ collectionName ] = (function(collectionName, modelName) {
                            var api = {
                                model: modelName,
                                collection: collectionName,
                                create: function(c) {
                                    c.model = this.model;
                                    c.collection = this.collection;
                                    model.schema._io._create(c);
                                },
                                update: function(c) {
                                    c.model = this.model;
                                    c.collection = this.collection;
                                    model.schema._io._update(c);
                                },
                                destroy: function(c) {
                                    c.model = this.model;
                                    c.collection = this.collection;
                                    model.schema._io._destroy(c);
                                },
                                read: function(c) {
                                    c.model = this.model;
                                    c.collection = this.collection;
                                    model.schema._io._read(c);
                                },
                                readAll: function(c) {
                                    c.model = this.model;
                                    c.collection = this.collection;
                                    model.schema._io._readAll(c);
                                }
                            };
                            return api;
                        })(collectionName, modelName);
                    },
                    _start: function() {
                        console.info(' starting model.data ');
                        // iterate over collection's metadata and create private namespace
                        /**
                         *  iterate over collection's metadata and create public namespace
                         *  The namespace 'model.data' will store all backbone models and collections
                         *  The namespace 'model.schema.io' will store all CRUD operations for the model
                         */
                        for (var name in _collections) {
                            // create backbone model
                            //console.log( Backbone.ajaxSync );

                            this.setIoAPI(name, _collections[name].item);


                            _private[_collections[name].item] = Backbone.Model.extend({
                                database: model.database,
                                storeName: name,
                                nolog: true,
                                defaults: _collections[name].defaults,
                                //test : 1, // goes to model's __proto__
                                url: function() {
                                    // Important! It's got to know where to send its REST calls. 
                                    // In this case, POST to '/donuts' and PUT to '/donuts/:id'
                                    return this.id ? '/' + _collections[name].item + '/' + this.id : '/' + _collections[name].item;
                                },
                                ajaxSync: function() {},
                                incrementVersion: function() {
                                    var version = this.get('__v');
                                    console.log('version: ', version);
                                    version = version + 1;
                                    this.set({
                                        __v: version
                                    });
                                    console.log('this.get("__v"): ', this.get('__v'));
                                },
                                initialize: function() {
                                    var reject = ['_id', 'id', '__v'];
                                    if (this.get('id')) {
                                        //console.log("MODEL:: model.data." + model.storeName + "." + model.get('id') + " initialized");
                                    } else {
                                        //console.log("MODEL:: new model created in model.data." + model.storeName + " ");
                                    }
                                    //for( var attribute in this.attributes )
                                    //{
                                    //    if( ! reject.contains( attribute  ) )
                                    //    {
                                    this.on("change", this.onChange);
                                    //    }
                                    //}
                                    this.on('sync', this.onSync);
                                    this.on('error', this.onError);
                                    this.on('destroy', this.onDestroy);
                                },
                                onSync: function(model, errors, options) {
                                    // called on every indexedDB operation
                                },
                                onError: function(model, errors, options) {
                                    // your code
                                },
                                onDestroy: function(model, errors, options) {
                                    // your code
                                },
                                onChange: function(model, errors, options) {
                                    //console.log(arguments);
                                    //console.log('--MODEL CHANGED--');
                                },
                            });
                            // create backbone collection
                            _private[name] = Backbone.Collection.extend({
                                model: _private[_collections[name].item],
                                database: model.database,
                                nolog: true,
                                storeName: name,
                                url: name + ".json",
                                    //parse: function(data) {
                                    //    return data[name];
                                    //}
                            });
                            // create model
                            API[_collections[name].item] = (function(name) {
                                return function(s) {
                                    //console.log(name);
                                    //console.log(_collections[name].item);
                                    return new _private[_collections[name].item](s);
                                };
                            })(name);
                            // Create collection
                            API[name] = (function(name) {
                                //console.log( name );
                                return function() {
                                    //console.log(name);
                                    //console.log(_collections[name].item);
                                    return new _private[name]();
                                };
                            })(name);
                        }
                    }
                };
            return API;
        }());
        model.schema = (function() {
            var _private = {
                setup: function(c) {
                    var self = _private,
                        version = null,
                        version_schema,
                        start_data = {};
                    //var complete = function(){
                    for (version in model.versions) {
                        /**
                         * Lets use our metadata to setup backbone models
                         */
                        // START set up backbone models
                        var store_names = Object.keys(model.versions[version]);
                        store_names.forEach(function(name) {
                            //console.log('store name: ', name);
                            var storeObj = model.versions[version][name],
                                collection_defaults = {};
                            // for every attribute/column of the storage 'defaults' metadata
                            for (var attributeName in storeObj.defaults) {
                                // attribute/column configuration metadata
                                var attributeObj = storeObj.defaults[attributeName];
                                // set defaults for collection's attributte
                                collection_defaults[attributeName] = attributeObj.default;
                            }
                            // set up metadata for backbone models
                            model.data._collections[name] = {
                                item: storeObj.item,
                                defaults: collection_defaults
                            };
                        });
                        // END set up backbone models
                        // Define backbone indexedDB adapter configuration
                        version_schema = {
                            version: parseInt(version),
                            migrate: function(transaction, next) {
                                var stores = [],
                                    store_names = Object.keys(model.versions[version]),
                                    total_store_to_create = store_names.length,
                                    total_store_created = 0;
                                console.log('store_names: ', store_names);
                                store_names.forEach(function(name) {
                                    // store configuration metadata
                                    var storeObj = model.versions[version][name];
                                    // create store reference as null
                                    stores[name] = null;
                                    // if store does not exist, let's create it
                                    if (!transaction.db.objectStoreNames.contains(name)) {
                                        stores[name] = transaction.db.createObjectStore(name);
                                    }
                                    // reference to created/existing store
                                    stores[name] = transaction.objectStore(name);
                                    // for every attribute/column of the storage 'defaults' metadata
                                    for (var attributeName in storeObj.defaults) {
                                        // attribute/column configuration metadata
                                        var attributeObj = storeObj.defaults[attributeName];
                                        // create an index on store
                                        stores[name].createIndex(attributeName, attributeName, {
                                            unique: attributeObj.unique || false
                                        });
                                    }
                                    transaction.addEventListener('complete', function(event) {
                                        total_store_created += 1;
                                        console.log(total_store_created, total_store_to_create);
                                        if (total_store_created == total_store_to_create) {
                                            //if( c.onSetup ) c.onSetup();
                                            console.log(model.data._collections);
                                        }
                                    });
                                    transaction.onsuccess = function(event) {
                                        console.log(event);
                                    };
                                    transaction.addEventListener('success', function(event) {
                                        console.log(event);
                                    });
                                }); // end for each
                                next();
                            }
                        };
                        // push the version_schema as an item into the database migrations array
                        // This version_schema will be used to set up a IndexedDB when we create
                        //  the first Backbone model or colletion inside our application
                        model.database.migrations.push(version_schema);
                    } // end for( version in model.versions )
                    console.info('model.schema setup is done!');
                    if (c.onSetup) c.onSetup();
                    //self.add_initial_data();
                    //};
                    //complete();
                },
                _get_collection_meta: function(version, store_name) {
                    var self = _private,
                        store_names = Object.keys(model.versions[version]),
                        storeObj = false;
                    store_names.forEach(function(name) {
                        if (name == store_name) {
                            //console.log('store name: ', name);
                            storeObj = model.versions[version][name];
                        }
                    });
                    return storeObj;
                },
                _get_collection_item: function(version, store_name) {
                    var self = _private,
                        store_names = Object.keys(model.versions[version]),
                        item_name = false;
                    store_names.forEach(function(name) {
                        if (name == store_name) {
                            //
                            item_name = model.versions[version][name].item;
                        }
                    });
                    return item_name;
                },
                _set_start_data: function(data) {
                    var self = _private;
                    if (!$dhx.isObject(data)) {
                        alert('The start data does not have a valid format.\nApplication will not start.');
                        return;
                    }
                    self.start_data = data;
                    // self._get_start_data()
                },
                _get_start_data: function() {
                    var self = _private;
                    return self.start_data || {};
                },

                // == PubNub Syncing
                _setLocalSyncTime:function(now, end){
                    if (parseInt(end) > 0) {
                        last_sync_time = $dhx.jDBdStorage.get('$dhx.mvp.ui.last_sync_time');
                        if (last_sync_time) {
                            last_sync_time = $dhx.crypt.base64_decode(last_sync_time);
                            if ($dhx.isNumber(parseInt(last_sync_time))) {
                                if (parseInt(last_sync_time) < parseInt(end)) {
                                    console.log('updating last_sync_time as ', now);
                                    $dhx.jDBdStorage.storeObject('$dhx.mvp.ui.last_sync_time', $dhx.crypt.base64_encode(now));
                                }
                            }
                        } else {
                            console.log('saving last_sync_time as ', now);
                            $dhx.jDBdStorage.storeObject('$dhx.mvp.ui.last_sync_time', $dhx.crypt.base64_encode(now));
                        }
                    }
                },
                msg_iterator_queue: function( m ){
                    _private._received_messages_queue.push( m );
                },
                _received_messages_queue: [],
                _collections_to_sync_queue: [],
                _collections_to_sync: 0,
                _collections_synced: 0,
                _getAllMessagesFromPubNub: function(timetoken, channel, fn) {
                    var self = _private,
                        payload = {
                            start: timetoken,
                            channel: channel,
                            callback: function(payload) {
                                var msgs = payload[0],
                                    start = payload[1],
                                    end = payload[2],
                                    last_sync_time,
                                    now = (new Date()).getTime() * 10000;

                                

                                _.forEach(msgs, _private.msg_iterator_queue);

                                //console.log(msgs.length, msgs);
                                //console.log('------------');
                                if (msgs.length === 100) {
                                    _private._getAllMessagesFromPubNub(start, channel, fn);
                                } else {
                                    //_private._setLocalSyncTime(now, end);
                                    if(fn) fn();
                                }
                            }
                        };

                    pubnub.history( payload );
                    payload = null;
                    self = null;
                },
                
                _getLastMessagesFromPubNub: function(timetoken, channel, fn) {
                    var self = _private,
                        payload = {
                            end: timetoken,
                            channel: channel,
                            callback: function(payload) {
                                var msgs = payload[0],
                                    start = payload[1],
                                    end = payload[2],
                                    last_sync_time,
                                    now = (new Date()).getTime() * 10000;

                                

                                _.forEach(msgs, _private.msg_iterator_queue);

                                //console.log(msgs.length, msgs);
                                //console.log('------------');
                                if (msgs.length === 100) {
                                    _private._getLastMessagesFromPubNub(end, channel, fn);
                                } else {
                                    //_private._setLocalSyncTime(now, end);
                                    if(fn) fn();
                                }
                            }
                        };

                    pubnub.history( payload );
                    payload = null;
                    self = null;
                },
                _process_collections_to_sync: function(c){
                    var collection = null,
                        last_sync_time = $dhx.jDBdStorage.get('$dhx.mvp.ui.last_sync_time') || 0;

                    if( last_sync_time )
                    {
                        // fetch all messages since last synced time
                        last_sync_time = parseInt( $dhx.crypt.base64_decode( last_sync_time ) );
                    }
                    else
                    {
                        // fetch all messages since the begining
                        last_sync_time = 0;
                    }

                    //console.log('==============> ', last_sync_time);

                    if( _private._collections_to_sync_queue.length > 0 )
                    {
                        collection = _private._collections_to_sync_queue.splice(0, 1);
                        //alert( collection );
                        if( last_sync_time === 0 )
                        {
                            //alert( last_sync_time );
                            _private._getAllMessagesFromPubNub( last_sync_time, collection, function()
                            {
                                _private._collections_synced += 1;
                                
                                if (_private._collections_synced == _private._collections_to_sync) {
                                    _private._process_received_messages( c );
                                    return;
                                }

                                _private._process_collections_to_sync( c );

                            });
                        }
                        else
                        {
                            _private._getLastMessagesFromPubNub( last_sync_time, collection, function()
                            {
                                _private._collections_synced += 1;
                                
                                if (_private._collections_synced == _private._collections_to_sync) {
                                    _private._process_received_messages( c );
                                    return;
                                }

                                _private._process_collections_to_sync( c );

                            });
                        }
                        
                    }
                    else
                    {
                        if(c.onSuccess) c.onSuccess();
                    }
                },
                _process_received_messages: function( c ){
                    var initial_data = {},
                        set_collections_iterator = function( collection ){
                            initial_data[ collection ] = [];
                        },
                        read_received_messages_queue_iterator = function( message ){
                            //console.log( message );
                            if( message.method == 'create' )
                            {
                                initial_data[ message.collection ].push( message.model );
                            }
                            else if( message.method == 'update' )
                            {
                                
                                for( var x = 0; x < initial_data[ message.collection ].length; x++ )
                                {
                                    if( initial_data[ message.collection ][x].id == message.model.id )
                                    {
                                        //console.log( 'UPDATE: ', message.model.id );
                                        initial_data[ message.collection ][x] = message.model;
                                    }
                                }
                                
                            }
                            else if( message.method == 'destroy' )
                            {
                                // delete initial record
                                //console.log( 'DESTROY: ', message.uuid );
                                //console.log( 'DESTROY: ', message.model);
                                initial_data[ message.collection ].forEach(function( m, index ){
                                    if( m.id ==  message.model.id )
                                    {
                                        //console.log( 'DESTROY: ', message.model.id );
                                        initial_data[ message.collection ].splice(index, 1);
                                    }
                                });
                            }
                        };

                    // set data collections as empty array
                     _.forEach(Object.keys(_private.io), set_collections_iterator);

                    // set collection's documents
                     _.forEach( _private._received_messages_queue, read_received_messages_queue_iterator );
                   
                   _private._set_start_data(initial_data);

                   _private.add_initial_data({
                        onSuccess: function() {

                            if( c.onSuccess ) c.onSuccess();
                        }
                    });
                    
                },
                sync: function( c ){
                    _private._collections_to_sync = Object.keys(_private.io).length;
                    for(var collection in _private.io)
                    {
                        _private._collections_to_sync_queue.push(collection);
                    }
                    _private._process_collections_to_sync( c );
                },
                // == PubNub Syncing

                add_initial_data: function(c) {
                    var self = _private,
                        tables = Object.keys(self._get_start_data()),
                        total_tables = tables.length,
                        total_tables_added = 0,
                        models = [],
                        collections = [],
                        c_names = [],
                        m_names = [],
                        item = null,
                        add_all = function(done, c_names, m_names) {
                            //console.log( c_names );
                            //console.log( m_names );
                            var model_name = m_names.shift(),
                                collection_name = c_names.shift();
                            if (c_names.length > 0 && m_names.length > 0) {
                                //console.log('XXXXXXXXXX> ' + model_name, collection_name);
                                self.insert_records_into_table(models[model_name], collection_name, function(model, storeName) {
                                    add_all(done, c_names, m_names);
                                });
                            } else if (c_names.length === 0 && m_names.length === 0) {
                                //console.log('XXXXXXXXXX> ' + model_name, collection_name);
                                if (typeof model_name == 'undefined' || typeof collection_name == 'undefined') {
                                    if (done) done();
                                } else {
                                    self.insert_records_into_table(models[model_name], collection_name, function(model, storeName) {
                                        if (done) done();
                                    });
                                }
                            } else {
                                if (done) done();
                            }
                        };
                    //console.log( tables );
                    tables.forEach(function(collection, index) {
                        item = model.schema._get_collection_item(1, collection);
                        models[item] = Backbone.Model.extend({
                            database: model.database,
                            storeName: collection
                        });
                        collections[collection] = Backbone.Collection.extend({
                            database: model.database,
                            storeName: collection,
                            model: models[item]
                        });
                        c_names.push(collection);
                        m_names.push(item);
                    });
                    add_all(function() {
                        if (c.onSuccess) c.onSuccess();
                    }, c_names, m_names);
                },
                insert_records_into_table: function(model, storeName, done) {
                    var self = _private,
                        record = self._get_start_data()[storeName].shift();
                        
                    if (record) {
                        record.notify = false;
                        _private.io[storeName].create({
                            record: record,
                            onSuccess: function() {
                                //console.info('success inserting record: ', record);
                                self.insert_records_into_table(model, storeName, done);
                            },
                            onFail: function() {
                                //console.warn('discarding record: ', record);
                                //console.warn('props: ', Object.keys(record).length);
                            }
                        });
                    } else {
                        //console.log( 'done inserting records into: ', storeName );
                        //console.warn( ' ---------------- ' );
                        done(model, storeName);
                    }
                },
                start: function(c) {
                    var self = _private,
                        version = null,
                        version_schema;
                    c.onSetup = function() {
                        //try {
                            model.data._start();
                            /**
                             *  indexedDB plugin for Backbone requires a initial db operation ( may be fetch ) to really create the indexedDB database
                             */
                            model.data[Object.keys(model.data._collections)[0]]().fetch({
                                success: function(collection, response, options) {
                                    console.info('The collection ' + Object.keys(model.data._collections)[0] + ' was fetched and the indexedDB is done!');
                                    if (c.onSuccess) c.onSuccess();
                                    //console.log( collection.models );
                                },
                                error: function(collection, response, options) {
                                    console.log(collection);
                                }
                            });
                        //} catch (e) {
                        //    console.log(e.stack);
                        //}
                    };
                    self.setup(c);
                },
                _io: {
                    _create: function(c) {

                        //console.log('----------c.record-----------', c.record);

                        var jDocument = (typeof c.record === 'string' ? JSON.parse(c.record) : c.record),
                            m = new model.data[c.model](),
                            fDocument = new $dhx.ui.mvp.model.helpers.schema.record({
                                model: c.model,
                                record: jDocument
                            }),
                            save_model = function(fDocument) {
                                //console.warn('saving fDocument ', fDocument);
                                m.save(fDocument, {
                                    success: function(model, modelJSON ) {
                                        
                                        if (c.onSuccess) c.onSuccess( fDocument );

                                        if( jDocument.notify === false )
                                        {
                                            return;
                                        }
                                        $dhx.ui.Mediator.notify('changeModel', {
                                            'collection': c.collection, //  mandatory in all data events
                                            'method': 'create', // create, update, delete,
                                            'model': modelJSON,
                                            options: null,
                                            client_id: $dhx.ui.session.client_id()
                                        });


                                    },
                                    error: function(o, error) {
                                        dhtmlx.alert({
                                            text: 'Error creating '+c.model+' model data locally',
                                            type: "alert-error"
                                        });
                                        if (c.onFail) c.onFail();
                                    }
                                });
                            },
                            mm;
                        
                        fDocument.__v = +(fDocument.__v || 0);
                        

                        // if fDocument.id, then it is a update operation
                        if (fDocument.id) {
                            mm = new model.data[c.model]({
                                id: fDocument.id
                            });
                           
                            mm.fetch({
                                success: function(mmm) {
                                    var error = false,
                                        emsg;
                                    if (fDocument.__v > mmm.get('__v')) {
                                        save_model(fDocument);
                                    } else {
                                        emsg = '_io._create() -> Record rejected. The version of the record is not greater than local record version.'+ fDocument;
                                        error = {
                                            error: emsg
                                        };
                                        //console.warn(emsg);
                                        if (c.onSuccess) c.onSuccess( fDocument, error);
                                        if (c.onFail) c.onFail();
                                    }
                                },
                                error: function(o, error) {
                                    if (error == "Not Found") {
                                        console.info('Document ' + fDocument.id + ' not found. I will create then.', fDocument);
                                        save_model(fDocument);
                                    }
                                }
                            });
                        }
                        // else it is a create operation
                        else {
                            save_model(fDocument);
                        }
                    },
                    _update: function(c) {
                        var jDocument = (typeof c.record === 'string' ? JSON.parse(c.record) : c.record),
                            m = new model.data[c.model]({
                                id: jDocument.id
                            }),
                            error = false,
                            emsg,
                            fDocument = new $dhx.ui.mvp.model.helpers.schema.record({
                                model: c.model,
                                record: jDocument
                            }),
                            actual_version = 0,
                            save_model = function(fDocument) {
                                m.save(fDocument, {
                                    success: function() {
                                        //console.log('----------END-----------', arguments);
                                        if (c.onSuccess) c.onSuccess( fDocument );

                                        if( jDocument.notify === false )
                                        {
                                            return;
                                        }
                                        fDocument.id = jDocument.id;
                                        $dhx.ui.Mediator.notify('changeModel', {
                                            'collection': c.collection, //  mandatory in all data events
                                            'method': 'update', // create, update, delete,
                                            'model': fDocument,
                                            options: null,
                                            client_id: $dhx.ui.session.client_id()
                                        });
                                    },
                                    error: function(o, error) {
                                        dhtmlx.alert({
                                            text: 'Error updating '+c.model+'  model data locally',
                                            type: "alert-error"
                                        });
                                        if (c.onFail) c.onFail();
                                    }
                                });
                            };
                        m.fetch({
                            success: function(model) 
                            {
                                 
                                // delete document ids
                                delete fDocument.id;
                                delete fDocument._id;
                               
                                // set document version
                                if (fDocument.__v) {
                                    if (typeof fDocument.__v !== 'number') {
                                        throw 'fDocument version(__v) shall to be a number';
                                    }
                                    if (fDocument.__v < 0) {
                                        throw 'fDocument version(__v) shall to greater than zero';
                                    }
                                    
                                    if (fDocument.__v > model.get('__v')) {
                                        save_model(fDocument);
                                    } else {
                                        emsg = '_io._update() -> Record rejected. The version of the record is not greater than local record version.'+ fDocument;
                                        error = {
                                            error: emsg
                                        };
                                        //console.warn(emsg);
                                        if (c.onSuccess) c.onSuccess( fDocument, error );
                                        if (c.onFail) c.onFail();
                                    }
                                } else {
                                    actual_version = +(model.get('__v') || 0);
                                    actual_version += 1;
                                    fDocument.__v = actual_version;
                                    save_model(fDocument);
                                }
                            },
                            error: function(o, error) {
                                if (error == "Not Found") {
                                    emsg = ''+c.model+' '+jDocument.id+' not found';
                                    error = {
                                            error: emsg
                                    };
                                    if (c.onSuccess) c.onSuccess( fDocument, error );
                                    console.log( emsg );
                                    //dhtmlx.alert({
                                    //    text: emsg,
                                    //    type: "alert-error"
                                    //});
                                }
                            }
                        });
                    },
                    _destroy: function(c) {
                        var jDocument = (typeof c.record === 'string' ? JSON.parse(c.record) : c.record),
                            m = new model.data[c.model]({
                                id: jDocument.id
                            }),
                            destroy_model = function() {
                                m.destroy({
                                    success: function() {
                                        console.info('document destroyed: -> ', jDocument.id);
                                        if (c.onSuccess) c.onSuccess( jDocument );

                                        if( jDocument.notify === false )
                                        {
                                            return;
                                        }
                                        $dhx.ui.Mediator.notify('changeModel', {
                                            'collection': c.collection, //  mandatory in all data events
                                            'method': 'destroy', // create, update, delete,
                                            'model': jDocument,
                                            options: null,
                                            client_id: $dhx.ui.session.client_id()
                                        });
                                    },
                                    error: function(o, error) {
                                        dhtmlx.alert({
                                            text: 'Error deleting '+c.model+' model data locally',
                                            type: "alert-error"
                                        });
                                        if (c.onFail) c.onFail();
                                    }
                                });
                            };
                        m.fetch({
                            success: function(model) {
                                destroy_model();
                            },
                            error: function(o, error) {
                                if (error == "Not Found") {
                                    //dhtmlx.alert({
                                    //    text: ''+c.model+' '+jDocument.id+' not found',
                                    //    type: "alert-error"
                                    //});
                                    console.log(''+c.model+' '+jDocument.id+' not found');
                                    if (c.onFail) c.onFail();
                                }
                            }
                        });
                    },
                    _read: function(c) {
                        var jDocument = (typeof c.record === 'string' ? JSON.parse(c.record) : c.record),
                            m = new model.data[c.model]({
                                id: jDocument.id
                            });
                        m.fetch({
                            success: function(model) {
                                jDocument = model.toJSON();
                                if (c.onSuccess) c.onSuccess( model, jDocument );
                            },
                            error: function(o, error) {
                                if (error == "Not Found") {
                                    //dhtmlx.alert({
                                    //    text: ''+c.model+' '+jDocument.id+' not found',
                                    //    type: "alert-error"
                                    //});
                                    console.log( ''+c.model+' '+jDocument.id+' not found' );
                                    if (c.onFail) c.onFail(o, error);
                                }
                            }
                        });
                    },
                    _readAll: function(c) {
                        var idb_payload = {
                                success: function( collection, response, options ) {
                                    
                                    if (c.onSuccess) c.onSuccess( collection, response, options );
                                },
                                error: function(o, error) {
                                    if (error == "Not Found") {
                                        dhtmlx.alert({
                                            text: ''+c.collection+' not found',
                                            type: "alert-error"
                                        });
                                        if (c.onFail) c.onFail(o, error);
                                    }
                                }
                            };
                        if( c.sort )
                        {
                           idb_payload.sort = c.sort; 
                        }
                        if( c.filter )
                        {
                           idb_payload.filter = c.filter; 
                        }
                        model.data[c.collection]().fetch(idb_payload);
                    }
                },
                // IO API
                io: {  /* built in on the fly */   }
            },
            API = {
                start: _private.start,
                _get_collection_meta: _private._get_collection_meta,
                _get_collection_item: _private._get_collection_item,
                _set_start_data: _private._set_start_data,
                _get_start_data: _private._get_start_data,
                add_initial_data: _private.add_initial_data,
                sync: _private.sync,
                io: _private.io,
                _io: _private._io
            };
            return API;
        }());
        return model;
    }())
});