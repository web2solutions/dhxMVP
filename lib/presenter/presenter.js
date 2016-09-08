$dhx.ui.mvp.presenters.declare({
    "presenter": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                console.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },
            subscriber: function( event, message ){
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view,
                    currently_items = 0,
                    collectionName,
                    currently_color = $dhx.getRandomColor(),
                    currently_size = 0,
                    msg_string = '',
                    blob;
                //console.log('Presenter Received Message: ', message);
                //if( message.client_id == $dhx.ui.session.client_id() )
                //{
                    
                    if (message.method == 'create') {
                        collectionName = message.collection;

                        if (view.chart_collections_data.exists(collectionName)) {
                            currently_items = view.chart_collections_data.get(collectionName).items;
                            currently_color = view.chart_collections_data.get(collectionName).color;
                            
                            view.chart_collections_data.remove(collectionName);
                        }
                        currently_items += 1;

                        view.chart_collections_data.add({
                            id: collectionName,
                            items: currently_items,
                            collection: collectionName,
                            color: currently_color
                        });

                        if (view.chart_collections_size.exists(collectionName)) {
                            
                            currently_size = +view.chart_collections_size.get(collectionName).size;
                            currently_color = view.chart_collections_size.get(collectionName).color;
                            
                            view.chart_collections_size.remove(collectionName);
                        }
                        delete message.model.id;
                        console.log( message.model );
                        msg_string = ''+ JSON.stringify(message.model);
                        blob = new Blob([$dhx.UTF8.decode( msg_string )], {
                            type: 'text/html'
                        });
                        
                        currently_size += blob.size;
                        

                        view.chart_collections_size.add({
                            id: collectionName,
                            size: currently_size,
                            collection: collectionName,
                            color: currently_color
                        });

                        blob = null;
                    }
                //}
            },
            /*
             *
             *  INIT components event handlers
             */
            sidebarOnSelectHandler: function(id, lastId) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
                if (id == 'logout') {
                    self.do_logout();
                }
                if (id != 'logout') {
                    //$dhx.debug.log(id);
                    if( id == 'help' ) id = 'help/1';
                    view._router.dispatch(id, true);
                    window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
                }
                if( id == '#')
                {
                    self.draw_chart_database_collections();
                    self.draw_chart_collections_data();
                    self.draw_chart_collections_size();
                }
                if ( ! $dhx.ui.mvp.ui.isMobile ) {
                    if( id == 'help/1' ) id = 'help';
                    view.toolbar.setItemText("title", window.dhx4.template("<img src='assets/icons/64/#image#' width='32' style='position:relative;float:left; margin-top:-5px; margin-right: 5px;' /><span style='font-weight: bold; font-size: 14px;'>#text#</span>", {
                        text: view.sidebar.cells(id).getText().text,
                        image: view.sidebar.cells(id).getText().text.toLowerCase() + '.png'
                    }));
                }
            },
            toolbarOnClickHandler: function(id) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
                if (id == 'logout') {
                    self.do_logout();
                }
            },
            layoutOnExpandHandler: function(name) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
            },
            /*
             *
             *  END components event handlers
             */
            /**
             * /
             * Main View Helpers
             */
            do_logout: function() {
                var self = this,
                    view = self.view;
                // do logout logic here
                window.location.reload();
            },
            add_sidebar_buttons: function() {
                var self = this,
                    view = self.view;

                view.sidebar.addItem({
                    id: "s1", // item id
                    type: "separator"
                });

                view.sidebar.addItem({
                    id: "providers", // item id
                    text: "Providers", // item text
                    icon: "providers.png", // icon used for the item
                });
                /*view.sidebar.addItem({
                    id: "ip", // item id
                    text: "IPs", // item text
                    icon: "ips.png", // icon used for the item
                });*/

                view.sidebar.addItem({
                    id: "s2", // item id
                    type: "separator"
                });

                view.sidebar.addItem({
                    id: "customer_types", // item id
                    text: "Customer Types", // item text
                    icon: "customer types.png", // icon used for the item
                });
                view.sidebar.addItem({
                    id: "customers", // item id
                    text: "Customers", // item text
                    icon: "customers.png", // icon used for the item
                });

                view.sidebar.addItem({
                    id: "s3", // item id
                    type: "separator"
                });

                view.sidebar.addItem({
                    id: "help", // item id
                    text: "Help", // item text
                    icon: "help.png", // icon used for the item
                });
                if ($dhx.ui.mvp.ui.isMobile) {
                    view.sidebar.addItem([{
                        id: "sep10", // separator id
                        type: "separator" // item type, mandatory
                    }, {
                        id: "logout", // item id
                        text: "Logout", // item text
                        icon: 'logout.png', // icon used for the item
                    }]);
                }
            }, // end add_sidebar_buttons
            adjust_to_mobile: function() {
                var self = this,
                    view = self.view;
                try {
                    if ($dhx.ui.mvp.ui.isMobile) {
                        view.layout.cells('b').setText('Stats');
                        view.layout.cells('b').collapse();
                        view.layout.cells('b').setText('Stats');
                    } else {
                        view.status_bar.setText('');
                    }
                } catch (e) {
                    console.log(e.stack);
                }
            }, // end adjust_to_mobile
            build_ui: function() {
                var self = this,
                    view = self.view;
                $dhx.showDirections("Starting UI");
                if ( ! $dhx.ui.mvp.ui.isMobile ) {
                    view._toolbar();
                }
                view.status_bar = view.sidebar.attachStatusBar();
                self.add_sidebar_buttons();
                view._layout();

                view._form();

                view._chart_database_collections();
                view._chart_collections_data();
                view._chart_collections_size();

                self.draw_chart_database_collections();
                self.draw_chart_collections_data();
                self.draw_chart_collections_size();

                self.adjust_to_mobile();
                $dhx.hideDirections();
                //view.layout.progressOn();
            }, // end build_ui



            
            askNotificationPermission:function( c ){
                $dhx.ui.mvp.ui.askNotificationPermission({
                    onSuccess: function( permission ){
                        document.getElementById('dhx_npermission').value = permission;

                        if( c.onSuccess ) c.onSuccess();
                    }
                });
            },
            askLocationPermission: function( c ){
                navigator.geolocation.getCurrentPosition(function(geoposition) {
                    //console.log('DDDDD: ', geoposition.coords);
                    //document.getElementById('current_location').innerHTML = 'Latitude: ' + geoposition.coords.latitude + '. Longitude: ' + geoposition.coords.longitude;
                    //document.getElementById('location_npermission').value = 'granted';

                    if( c.onSuccess ) c.onSuccess( geoposition );
                }, function(err) {
                    //document.getElementById('location_npermission').value = 'require permission';
                    if( c.onFail ) c.onFail(err);
                });
            },
            addBubble: function(tab, num) {
                var self = this,
                    view = self.view,
                    current_number = view.sidebar.cells(tab).getBubble() || 0;
                if (current_number === '') {
                    current_number = 0;
                }
                current_number = +current_number;
                current_number = current_number + num;
                view.sidebar.cells(tab).setBubble(current_number);
            },
            clearBubble: function(tab) {
                var self = this,
                    view = self.view;
                view.sidebar.cells(tab).clearBubble();
            },
            start_database: function(c) {
                    var self = this,
                        view = self.view;
                    $dhx.showDirections("Starting database ... ");
                    //model.database.id = model.database.id + "_" + (  username.replace(/\@/, '_' ).replace(/\./, '_' ) );
                    //console.log( 'start_database' );
                    /* 
                     *  obj = { collection_name: [ collection_data ]  }
                     *  The initial data can be fetched from a server here.
                     */
                    
                    /*var initial_data = {
                        "users": [],
                        "questions": [
                        
                            {
                                id: 1,
                                _id: 1,
                                question: "How do I post a job?",
                                answer: "Answer text",
                                test: 1,
                                __v: 3
                            }, {
                                id: 2,
                                _id: 2,
                                question: "When will I get hired?",
                                answer: "Answer text",
                                __v: 2
                            }, {
                                id: 3,
                                _id: 3,
                                question: "When will I get paid?",
                                answer: "Answer text",
                                __v: 2
                            }, {
                                id: 4,
                                _id: 4,
                                question: "How do I change the Main View?",
                                answer: "Answer heresss",
                                __v: 10
                            }
                        
                        ]
                    };
                    self.model.schema._set_start_data(initial_data);*/

                    
                    $dhx.hideDirections();

                    console.warn('Syncing application');
                    $dhx.showDirections( 'Syncing application' );
                    
                    // sync with PubNub messages
                    self.model.schema.sync({
                        onSuccess: function(){
                            $dhx.hideDirections();
                            $dhx.showDirections( 'Starting UI' );
                            self.build_ui();
                            if (c.onSuccess) {
                                c.onSuccess();
                            } 
                        }
                    });
                    

                    
                    
                    
                    
                    //self.model.schema.add_initial_data({
                    //    onSuccess: function() {
                    //        
                    //    }
                    //});
            }, // end start_database
            draw_chart_database_collections: function(){
                var self = this,
                        view = self.view;

                    for( var collection in self.model.schema.io )
                    {
                        if( view.chart_database_collections.exists(collection) )
                        {
                            view.chart_database_collections.remove(collection);
                        }
                        view.chart_database_collections.add({ id:collection, items: 1, collection:collection, color: $dhx.getRandomColor()});
                    }

                    
                    
            },
            draw_chart_collections_data: function(){
                var self = this,
                    view = self.view,
                    collections_to_read = Object.keys(self.model.schema.io),
                    n_collections_to_read = collections_to_read.length,
                    n_collections_done = 0,
                    collectionName = null,
                    items_per_collection = [],
                    process = function() {
                        var items_on_collection = 0;
                        collectionName = collections_to_read.shift();
                        if (collectionName) {
                            //console.log( collectionName );
                            self.model.schema.io[collectionName].readAll({
                                onSuccess: function( collection, response, options ) {
                                    collection.models.forEach(function(model) {
                                        items_on_collection += 1;
                                    });
                                    if( view.chart_collections_data.exists(collectionName) )
                                    {
                                        view.chart_collections_data.remove(collectionName);
                                    }
                                    view.chart_collections_data.add({ id:collectionName, items: items_on_collection, collection:collectionName, color: $dhx.getRandomColor()});
                                    
                                    items_per_collection.push({
                                        collection: collectionName,
                                        items: items_on_collection
                                    });
                                    process();
                                }
                            });
                        }
                        else
                        {
                            view.layout.cells('c').progressOff();
                        }
                    };
                view.layout.cells('c').progressOn();
                process();
            },
            draw_chart_collections_size: function(){
                var self = this,
                    view = self.view,
                    collections_to_read = Object.keys(self.model.schema.io),
                    n_collections_to_read = collections_to_read.length,
                    n_collections_done = 0,
                    collectionName = null,
                    items_per_collection = [],
                    str_total = '',
                    process = function() {
                        collectionName = collections_to_read.shift();
                        if (collectionName) {
                            //console.log( collectionName );
                            self.model.schema.io[collectionName].readAll({
                                onSuccess: function( collection, response, options ) {
                                    var str = '', 
                                        blob;
                                    
                                    collection.models.forEach(function(model) {
                                        str += JSON.stringify(model.toJSON());
                                    });
                                    
                                    blob = new Blob([$dhx.UTF8.decode(str)], {
                                        type: 'text/html'
                                    });

                                    if( view.chart_collections_size.exists(collectionName) )
                                    {
                                        view.chart_collections_size.remove(collectionName);
                                    }
                                    view.chart_collections_size.add({ id:collectionName, size: ( blob.size / 1024 ).toFixed(2), collection:collectionName, color: $dhx.getRandomColor()});
                                    //console.log( 'TTTTTTTTTTTT: ', blob );
                                    // Bytes
                                    items_per_collection.push({
                                        collection: collectionName,
                                        size: blob.size
                                    });

                                    blob = null;
                                    process();
                                }
                            });
                        }
                        else
                        {
                            view.layout.cells('c').progressOff();
                        }
                    };
                view.layout.cells('c').progressOn();
                process();
            }
        }; // end API
        return API;
    }())
});

/*
str = $dhx.UTF8.decode(str);
                    var blob = new Blob([$dhx.UTF8.decode(str)], {
                        type: 'text/html'
                    }); //
 */