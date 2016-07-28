/*jshint loopfunc: true */
/**
 * this file '/lib/model/model.js' is transparently loaded.
 *   Just wrote your code here
 *   If you change the name of the view object, 
 *   please set the new name on presenter. eg:
 *   
 *     var presenter = {  
 *       _model : MyModelName
 *       ...
 *     };
 */


/**
 * model.database
 * model.versions
 * model.schema
 * model.data
 */


//window.Backbone = window.Backbone || {};

$dhx.ui.mvp.models.declare({
    "model": (function() {
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
                        id: "dhxMVP",
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
                        "1": {
                            /**
                             * define a store/collection
                             */
                            "questions": {
                                /**
                                 * [item name of the documents stored into this collection/store]
                                 * @type {String}
                                 */
                                item: 'question',
                                defaults: {
                                     __v: {
                                        type: Number,
                                        default: 0,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: '',
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: '__v',
                                                type: 'hidden',
                                            },
                                            grid: {
                                                header: '__v',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    _id: {
                                        type: String,
                                        default: 0,
                                        unique: true,
                                        validate: {
                                            required: true,
                                            mask_to_use: '',
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: '_id',
                                                type: 'hidden',
                                            },
                                            grid: {
                                                header: '_id',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    question: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: 'NotEmpty'
                                        },
                                        ui: {
                                            form: {
                                                label: 'Question',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Question',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '*'
                                            }
                                        }
                                    },
                                    answer: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: 'NotEmpty'
                                        },
                                        ui: {
                                            form: {
                                                label: 'Answer',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Answer',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    }
                                } // end defaults
                            }, // end questions
                            "users": {
                                item: 'user',
                                defaults: {
                                    _id: {
                                        type: String,
                                        default: 0,
                                        unique: true,
                                        validate: {
                                            required: true,
                                            mask_to_use: '',
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: '_id',
                                                type: 'hidden',
                                            },
                                            grid: {
                                                header: '_id',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    phone: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: false,
                                            mask_to_use: 'us_phone',
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Phone',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Phone',
                                                align: 'right',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    first_name: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: 'NotEmpty'
                                        },
                                        ui: {
                                            form: {
                                                label: 'First name',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'First name',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '120'
                                            }
                                        }
                                    },
                                    last_name: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Last name',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Last name',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '120'
                                            }
                                        }
                                    },
                                    title: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Title',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Title',
                                                align: '',
                                                coltype: 'ro',
                                                width: ''
                                            }
                                        }
                                    },
                                    picture: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: false,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Picture',
                                                type: 'container',
                                            },
                                            grid: {
                                                header: 'Picture',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    address: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Address',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Address',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    city: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'City',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'City',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    state: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'State',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'State',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    country: {
                                        type: String,
                                        default: 'USA',
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Country',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Country',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    },
                                    username: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: true,
                                            mask_to_use: undefined,
                                            rules: 'NotEmpty'
                                        },
                                        ui: {
                                            form: {
                                                label: 'Username',
                                                type: 'input',
                                            },
                                            grid: {
                                                header: 'Username',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '120'
                                            }
                                        }
                                    },
                                    resume: {
                                        type: String,
                                        default: null,
                                        unique: false,
                                        validate: {
                                            required: false,
                                            mask_to_use: undefined,
                                            rules: ''
                                        },
                                        ui: {
                                            form: {
                                                label: 'Resume',
                                                type: 'hidden',
                                            },
                                            grid: {
                                                header: 'Resume',
                                                align: 'left',
                                                coltype: 'ro',
                                                width: '0'
                                            }
                                        }
                                    }
                                }
                            }// end users
                        }
                    }
                },
                _public = {
                    database: _private.database,
                    versions: _private.versions
                };
            return _public;
        }());
        model.data = (function() {
            var _collections = {},
                _private = {},
                API = {
                    _collections: _collections,
                    start: function() {
                        // iterate over collection's metadata and create private namespace
                        var initialize = function() {
                            ////console.log( this );
                            ////console.log("MODEL:: model.data." + this.storeName + "." + this.id + " initialized");
                        };
                        
                         /**
                         *  iterate over collection's metadata and create public namespace
                         *  The namespace 'model.data' will store all backbone models and collections
                         */

                        for (var name in _collections) {
                            // create backbone model
                            _private[_collections[name].item] = Backbone.Model.extend({
                                database: model.database,
                                storeName: name,
                                nolog: true,
                                defaults: _collections[name].defaults,
                                //test : 1, // goes to model's __proto__
                                //url: function() {
                                // Important! It's got to know where to send its REST calls. 
                                // In this case, POST to '/donuts' and PUT to '/donuts/:id'
                                //    return this.id ? '/' + _collections[name].item + '/' + this.id : '/' + _collections[name].item;
                                //},
                                initialize: initialize
                            });
                            // create backbone collection
                            _private[name] = Backbone.Collection.extend({
                                model: _private[_collections[name].item],
                                database: model.database,
                                nolog: true,
                                storeName: name
                                    //url: name + ".json",
                                    //parse: function(data) {
                                    //    return data[name];
                                    //}
                            });

                            // create model
                            API[_collections[name].item] = (function(name) {
                                return function(s) {
                                    $dhx.debug.log(name);
                                    $dhx.debug.log(_collections[name].item);
                                    return new _private[_collections[name].item](s);
                                };
                            })(name);
                            // Create collection
                            API[name] = (function(name) {
                                $dhx.debug.log( name );
                                return function() {
                                    $dhx.debug.log(name);
                                    $dhx.debug.log(_collections[name].item);
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


                    var complete = function(){
                        for (version in model.versions) {
                            /**
                             * Lets use our metadata to setup backbone models
                             */
                            // START set up backbone models
                            var store_names = Object.keys(model.versions[version]);
                            store_names.forEach(function(name) {
                                $dhx.debug.log('store name: ', name);
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


                                    $dhx.debug.log( 'store_names: ', store_names );
         
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
                                            $dhx.debug.log(total_store_created, total_store_to_create);
                                            if (total_store_created == total_store_to_create) {
                                                //if( c.onSetup ) c.onSetup();
                                                $dhx.debug.log( model.data._collections);
                                            }
                                        });
                                        transaction.onsuccess = function(event) {
                                            $dhx.debug.log(event);
                                        };
                                        transaction.addEventListener('success', function(event) {
                                            $dhx.debug.log(event);
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
                        self.create_database(c, model);
                    };

                    try {
                        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB ;
                        var dbreq = indexedDB.deleteDatabase( model.database.id );
                        dbreq.onsuccess = function (event) {
                            $dhx.debug.log("indexedDB: " + model.database.id + " deleted");
                            complete();
                        };
                        dbreq.onerror = function (event) {
                            $dhx.debug.error("indexedDB.delete Error: " + event.message);
                            complete();
                        };
                    }
                    catch (e) {
                        $dhx.debug.error("Error: " + e.message);
                        complete();
                    }
                },
                get_collection_meta : function( version, store_name ){
                    var self = _private,
                        store_names = Object.keys(model.versions[version]),
                        storeObj = false;
                        
                    store_names.forEach(function(name) {
                        if( name == store_name )
                        {
                            $dhx.debug.log('store name: ', name);
                            storeObj = model.versions[version][name];                        
                        }
                    });

                    return storeObj;
                },
                get_collection_item : function( version, store_name ){
                    var self = _private,
                        store_names = Object.keys(model.versions[version]),
                        item_name = false;

                    $dhx.debug.log( 'model.versions: ', model.versions );
                    $dhx.debug.log( 'version: ', version );
                    $dhx.debug.log( 'model.versions[ version ]: ', model.versions[ version ] );
                        
                    store_names.forEach(function(name) {
                        
                        if( name == store_name )
                        {
                            $dhx.debug.log( name, store_name );
                            item_name = model.versions[version][name].item;   
                        }
                    });

                    return item_name;
                },
                
                set_start_data: function( data ){
                     var self = _private;

                     if( ! $dhx.isObject(data) )
                     {
                        alert( 'The start data does not have a valid format.\nApplication will not start.' );
                        return;
                     }

                     self.start_data = data;

                     // self.get_start_data()
                },
                
                get_start_data: function( ){
                     var self = _private;
                     return self.start_data;
                },

                create_database: function(c, model) {
                    var self = _private,
                        tables = Object.keys( self.get_start_data() ),
                        total_tables = tables.length,
                        total_tables_added = 0,
                        models = [],
                        collections = [],
                        c_names = [],
                        m_names = [],
                        item = null,
                        add_all = function(  done, c_names, m_names ){
                            console.log( c_names );
                            console.log( m_names );
                            var model_name = m_names.shift();
                                collection_name = c_names.shift();
                            if( c_names.length > 0 && m_names.length > 0 )
                            {
                                console.log('XXXXXXXXXX> ' + model_name, collection_name);

                                self.insert_records_into_table( models[ model_name ], collection_name, function(model, storeName) {
                                    add_all( done, c_names, m_names );
                                });
                            }
                            else if( c_names.length == 0 && m_names.length == 0 )
                            {
                                console.log('XXXXXXXXXX> ' + model_name, collection_name);

                                self.insert_records_into_table( models[ model_name ], collection_name, function(model, storeName) {
                                    if( done ) done();
                                });
                            }
                            else
                            {
                                if( done ) done();
                            }
                        };

                    $dhx.debug.log( tables );
                    tables.forEach( function(collection, index){
                        
                        item = model.schema.get_collection_item( 1, collection );

                        models[ item ] = Backbone.Model.extend({
                            database: model.database,
                            storeName: collection
                        });

                        collections[ collection ] = Backbone.Collection.extend({
                            database: model.database,
                            storeName: collection,
                            model: models[ item ]
                        });

                        c_names.push( collection );
                        m_names.push( item );

                        $dhx.debug.log('--');
                        $dhx.debug.log('item: ', item);
                        $dhx.debug.log('collection: ', collection);
                        $dhx.debug.log('models[ item ]: ', models[ item ]);
                        $dhx.debug.log('collections[ collection ]: ', collections[ collection ]);
                        $dhx.debug.log('c_names: ', c_names );
                        $dhx.debug.log('m_names: ', m_names);
                    });

                    add_all( function(){
                        if (c.onSetup) c.onSetup();
                    }, c_names, m_names );

                },
                insert_records_into_table: function(model, storeName, done) {
                    var self = _private,
                        record = self.get_start_data()[storeName].shift();
                        $dhx.debug.warn( ' ---------------- ' );
                        $dhx.debug.log( 'adding records to: ', storeName );
                        
                        
                    if (record) {
                        $dhx.debug.log( record );
                        $dhx.debug.log( 'adding records to: ', storeName );
                        var m = new model();
                        
                        $dhx.debug.log( 'record: ', record );
                        $dhx.debug.log( 'model: ', m );
                        m.save(record, {
                            success: function() {
                                $dhx.debug.info('success inserting record: ', record);
                                $dhx.debug.warn('props: ', Object.keys(record).length );
                                $dhx.debug.log(arguments);
                                self.insert_records_into_table(model, storeName, done);
                            },
                            error: function(o, error) {
                                console.error( error.srcElement.error.message );
                                console.error( 'error inserting record: ', record );
                                $dhx.debug.warn('props: ', Object.keys(record).length );
                                $dhx.debug.log(o, error);
                            }
                        });
                    } else {
                        $dhx.debug.log( 'done inserting records into: ', storeName );
                        $dhx.debug.warn( ' ---------------- ' );
                        done(model, storeName);
                    }
                },
                start: function(c) {
                    var self = _private,
                        version = null,
                        version_schema;
                    c.onSetup = function() {
                        try{
                            $dhx.debug.log('model.schema setup is done!');
                            model.data.start();
                            
                            // XXXXX TODO move following logic to user_view.js
                            /**
                             *  indexedDB plugin for Backbone requires a initial db operatio
                             *  ( may be fetch ) to really create the indexedDB database
                             */
                            model.data.questions().fetch({
                                success: function(collection, response, options) {
                                    $dhx.debug.log( collection );
                                    if (c.onSuccess) c.onSuccess();
                                    $dhx.debug.log( collection.models );
                                },
                                error: function(collection, response, options) {
                                    $dhx.debug.log(collection);
                                }
                            });

                        }catch(e)
                        {
                            $dhx.debug.log( e.stack );
                        }
                    };
                    self.setup(c);
                },

                io: {
                    users:{
                        put: function( c ){
                            var jDocument = (  typeof c.record === 'string' ? JSON.parse(c.record) : c.record ),
                                settings = (jDocument._id ? { id: jDocument._id } : {}),
                                m = new model.data.user(settings);
                            m.save(jDocument, {
                                success: function() {
                                    if( c.onSuccess ) c.onSuccess();
                                },
                                error: function(o, error) {
                                    dhtmlx.alert({
                                        text: 'Error saving model data locally',
                                        type: "alert-error"
                                    });
                                    if( c.onFail) c.onFail();
                                }
                            });
                        }
                    },
                    questions:{
                        put: function( c ){
                            var jDocument = (  typeof c.record === 'string' ? JSON.parse(c.record) : c.record ),
                                settings = (jDocument._id ? { id: jDocument._id } : {}),
                                m = new model.data.user(settings);
                            m.save(jDocument, {
                                success: function() {
                                    if( c.onSuccess ) c.onSuccess();
                                },
                                error: function(o, error) {
                                    dhtmlx.alert({
                                        text: 'Error saving model data locally',
                                        type: "alert-error"
                                    });
                                    if( c.onFail) c.onFail();
                                }
                            });
                        }
                    }
                }
            };

            API = {
                start: _private.start,
                questions: function() {
                    return _private.questions;
                },
                get_collection_meta: _private.get_collection_meta,
                get_collection_item: _private.get_collection_item,
                set_start_data: _private.set_start_data,
                get_start_data: _private.get_start_data,
                io: _private.io
            };
            return API;
        }());

        return model;
    }())
});