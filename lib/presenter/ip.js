$dhx.ui.mvp.presenters.declare({
    "ip": (function() {
        'strict';
        var presenter_name = 'ip',
        collection = 'ips',
        API = {
            start: function() {
                $dhx.debug.log(presenter_name+':PRESENTER: start from presenter defined by user');
            },
            destroy: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log(presenter_name+':PRESENTER: destroy from presenter defined by user');
            },
            subscriber: function( event, message ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view;
                console.log(presenter_name+'Child Presenter Received Message: ', message);
                
                // if message was sent by this client
                //if( message.client_id == $dhx.ui.session.client_id() )
                //{
                    if( message.collection == collection)
                    {
                        if( message.method == 'create')
                        {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {
                                record.push(message.model[ col_id ]);
                            });
                            console.log( message );
                            view.grid.addRow( ( message.model.id || message.model._id), record, 0);
                        }
                        else if( message.method == 'update')
                        {
                            view._settings.grid.id.forEach(function(col_id, index) {

                                view.grid.cells(message.model.id, view.grid.getColIndexById(col_id)).setValue(message.model[ col_id ]);
                            });

                            if( view.form_item )
                            {
                                //alert(view.form_item);
                                var t = setTimeout( function(){
                                    self.show_item();
                                }, 300 );
                            }
                        }
                        else if( message.method == 'destroy')
                        {
                            view.grid.deleteRow(message.model.id);
                        }
                    }
                    else if( message.collection == 'providers')
                    {
                        // update provider grid combo here
                        if( message.method == 'create')
                        {
                            
                        }
                        else if( message.method == 'update')
                        {
                            
                        }
                        else if( message.method == 'destroy')
                        {
                            
                        }
                    }    
                //}
            },
            toolbarOnClickHandler: function(id) {
                var self = $dhx.ui.mvp.presenters.get(presenter_name);
                    view = self.view;

                if( id != 'destroy' )
                {
                    self.mount_form_input_ui( id );
                }
                else if( id == 'destroy' )
                {
                    //console.log( view );
                    this.disableItem('destroy');
                    self.delete_item({
                        onSuccess: function(){
                            self.destroy_item();
                            //view.window.close();
                        },
                        onFail: function(){
                            view.form.unlock();
                        }
                    });
                }
            },
            form_process:function( ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    record,
                    form_data = view.form.getFormData();

                if (view.form.check()) {
                    view.form.lock();
                    
                    record = {
                        
                    };

                    for( var i in form_data)
                    {
                        record[ i ] = form_data[ i ];
                    }

                    if( view.form.action == 'update' )
                    {
                        record.id = view.grid.getSelectedRowId();
                    }

                    if( record.expiration )
                    {
                        record.expiration = (new Date(record.expiration)).getTime();
                    }
                    if( record.number )
                    {
                        record.number = record.number.replace(/_/gi, '');
                    }

                    //if(! record.assigned_to ) record.assigned_to = null;

                    console.log( view.form.action );
                    self.model.schema.io[ collection ][ view.form.action ]({
                        record: record,
                        onSuccess: function() {
                            //console.info('success inserting record: ', record);
                            if( view.form.isItemChecked('close_on_save') )
                            {
                                //alert();
                                view.window.close();
                            }
                            else
                            {
                                view.form.reset();
                                view.form.unlock();
                            }
                        },
                        onFail: function() {
                            //console.error('error inserting record: ', record);
                            //console.warn('props: ', Object.keys(message.model).length);
                            view.form.unlock();
                        }
                    });
                }
            },
            formOnButtonClickHandler: function(id){
                if( id == 'save' )
                {
                    $dhx.ui.mvp.presenters.get(presenter_name).form_process( );
                }
                else if( id == 'reset' )
                {
                    view.form.reset();
                }
                
            },
            formOnEnterHandler: function(  ){
                $dhx.ui.mvp.presenters.get(presenter_name).form_process( );
            },
            set_combos_mount_form_input_ui: function( providers, servers,  customers ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    combo_provider = view.form.getCombo('provider'),
                    combo_server = view.form.getCombo('server'),
                    combo_status = view.form.getCombo('status'),
                    assigned_to = view.form.getCombo('assigned_to');

                combo_provider.addOption(providers.map(function(provider) {
                    return [provider.id, provider.name];
                }));
                combo_server.addOption(servers.map(function(server) {
                    return [server.id, server.name];
                }));
                customers.push({
                    id: null,
                    name: ''
                });
                assigned_to.addOption(customers.map(function(customer) {
                    return [customer.id, customer.name];
                }));


                assigned_to.attachEvent("onChange", function(value, text){
                    if( value === null )
                    {
                        combo_status.selectOption(combo_status.getIndexByValue('Available'), true, true);
                    }
                    else
                    {
                        combo_status.selectOption(combo_status.getIndexByValue('Used'), true, true);
                    }
                });


                if (self.get_selected_provider()) combo_provider.selectOption(combo_provider.getIndexByValue(self.get_selected_provider()), true, true);
                if (self.get_selected_server()) combo_server.selectOption(combo_server.getIndexByValue(self.get_selected_server()), true, true);
                view.form.disableItem("provider");
                view.form.disableItem("server");
                combo_status.selectOption(combo_status.getIndexByValue('Available'), true, true);
                assigned_to.selectOption(assigned_to.getIndexByValue(null), true, true);
                view.form.disableItem("assigned_to");
                view.form.disableItem("status");
            },
            mount_form_input_ui: function( action ){
                 var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    container = view._window();
                
                view.window.setText( ( action == 'create' ? 'Add new' : 'Edit' ) + ' IP');
                view._form( container, action );

                view.form.lock();
                self.model.schema.io.providers.readAll({
                    onSuccess: function(  col , providers, options  )
                    {
                        
                        self.model.schema.io.servers.readAll({
                            filter: function( server ){
                                if( server.provider == self.get_selected_provider() ) return server;
                            },
                            onSuccess: function(col, servers, options) 
                            {

                                self.model.schema.io.customers.readAll({
                                    onSuccess: function(col_customers, customers, options) 
                                    {
                                        self.set_combos_mount_form_input_ui( providers, servers,  customers  );

                                        if( action == 'update' )
                                        {
                                            self.model.schema.io[ collection ].read({
                                                record: {
                                                    id: view.grid.getSelectedRowId()
                                                },
                                                onSuccess: function( model ) {
                                                    var hash = model.toJSON();
                                                    delete hash.id;
                                                    delete hash._id;
                                                    delete hash.__v;
                                                    
                                                    if( hash.number )
                                                    {
                                                        hash.number = hash.number.replace(/_/gi, '');
                                                    }

                                                    view.form.setFormData( hash );
                                                    view.form.unlock();
                                                    view.form.setFocusOnFirstActive();
                                                },
                                                onFail: function() {
                                                
                                                }
                                            });
                                        }
                                        else
                                        {
                                            view.form.unlock();
                                            view.form.setFocusOnFirstActive();
                                        }
                                        
                                    },
                                    onFail: function() {

                                    }
                                });


                                
                                
                            },
                            onFail: function() {

                            }
                        });

                        
                    },
                    onFail: function(){

                    }
                 });

                
            },
            delete_item: function( c ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name);
                    view = self.view;
                self.model.schema.io[ collection ].destroy({
                    record: {
                        id: view.grid.getSelectedRowId()
                    },
                    onSuccess: function(model) {
                        if( c.onSuccess ) c.onSuccess();
                    },
                    onFail: function() {
                        if( c.onFail ) c.onFail();
                    }
                });
            },
            gridOnRowSelectHandler: function(id) {
                var self = $dhx.ui.mvp.presenters.get(presenter_name);
                    view = self.view;
                self.show_item();
            },
            toolbar_itemOnClickHandler: function(id) {
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view;
                if (id == 'close') {
                    self.destroy_item();
                }
            },
            show_item: function() {
                var self = this,
                    view = self.view;
                view.layout.cells('b').progressOn();
                self.model.schema.io[ collection ].read({
                    record: {
                        id: view.grid.getSelectedRowId()
                    },
                    onSuccess: function( model ) {
                        
                        if ( $dhx.ui.mvp.ui.isMobile ) {
                            view.layout.cells('a').collapse();
                            view.layout.cells('b').expand();
                        } else {
                            view.layout.cells('b').expand();
                        }
                        view._toolbar_item();
                        view._form_item( model );

                        view.toolbar.enableItem('update');
                        view.toolbar.enableItem('destroy');

                        view.layout.cells('b').progressOff();
                    },
                    onFail: function() {
                    
                    }
                });


                
            },
            destroy_item: function() {
                var self = this,
                    view = self.view;
                if(view.layout)
                {
                    view.layout.cells('b').collapse();
                    view.layout.cells('b').setText('Select a IP first');
                }

                if( view.form_item )
                {
                    view.form_item.unload();
                    view.form_item = null;
                }
                
                //self.layout.unload();
                //self.layout = null;
                //self.accordion.unload();
                //self.accordion = null;
            },
            fill_grid: function( callBack ) {
                var self = this,
                    view = self.view;

                view.grid.clearAll();

                self.model.data[ collection ]().fetch({
                    sort: {
                        index: "number", // postdate
                        order: 1
                    },
                    filter:function( ip ){
                        if( ip.server == self.get_selected_server() ) return ip;
                    },
                    success: function(collection, response, options) {
                        collection.models.forEach(function(model) {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {
                                if( col_id == 'assigned_to' )
                                {
                                    record.push( model.get(col_id) ? model.get(col_id) : 'null'  );
                                }
                                else
                                {

                                    record.push( $dhx.strip_tags( model.get(col_id) ) );
                                }
                            });
                            //$dhx.debug.log(model.get('skills'));
                            view.grid.addRow(model.get('id'), record);
                        });
                        view.grid.adjustColumnSize(view.grid.getColIndexById("assigned_to"));
                        if ( callBack ) callBack();
                    },
                    error: function(collection, response, options) {
                        //$dhx.debug.log(collection);
                    }
                });
            },
            get_selected_provider: function(){
                return $dhx.ui.mvp.presenters.get('providers').selected_provider;
            },
            get_selected_server: function(){
                return $dhx.ui.mvp.presenters.get('servers').selected_server;
            }
        };
        return API;
    }())
});