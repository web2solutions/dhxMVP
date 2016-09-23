$dhx.ui.mvp.presenters.declare({
    "customer_servers": (function() {
        'strict';
        var presenter_name = 'customer_servers',
        collection = 'servers',
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

                if( id == 'assign_server' )
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
                    form_data = view.form.getFormData(),
                    assigned_ips = [];

                delete form_data.close_on_save;

                view.grid_ips.forEachRow(function(row_id){
                    var row = {};
                    view.grid_ips.forEachCell(row_id, function(cellObj, ind){
                        
                        var colId = view.grid_ips.getColumnId(ind),
                            assigned_index = view.grid_ips.getColIndexById("assigned"),
                            number_index = view.grid_ips.getColIndexById("number");

                        console.log(colId);
                        if( colId == 'assigned' )
                        {
                            if( view.grid_ips.cells( row_id,  assigned_index ).getValue() == '1' )
                            {
                                row.number = view.grid_ips.cells( row_id, number_index ).getValue();
                                row.id = row_id;
                                row._id = row_id;
                            }
                        }

                        

                        
                    });
                    assigned_ips.push( row );
                    
                });

                form_data.assigned_ips = assigned_ips;

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


                    if( record.price )
                    {
                        record.price = + ( ( record.price || 0 ).replace(/,/g, '' ) );
                    }

                    console.log( record );

                    //return;

                    //console.log( view.form.action );
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
            formOnEnterHandler: function( ){
                $dhx.ui.mvp.presenters.get(presenter_name).form_process( );
            },
            mount_form_input_ui: function( action ){
                 var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    container = view._window(),
                    combo_provider = null,
                    combo_server = null;

                view.toolbar.disableItem('assign_server');
                
                view.window.setText( 'Assign Server');
                view._form( container, action );

                view._grid_ips();

                combo_provider = view.form.getCombo('provider');
                combo_server = view.form.getCombo('server');

                combo_provider.attachEvent("onChange", function(value, text){
                    self.model.schema.io.servers.readAll({
                        filter: function(  server  ){
                            if( server.provider ==  value ) return server;
                        },
                        onSuccess: function(  col , response, options  ){

                            
                            view.form.setItemValue('price', '');
                            view.form.setItemValue('expiration', null);

                            view.grid_ips.clearAll();

                            combo_server.clearAll();

                            combo_server.setComboText('');
                            combo_server.setComboValue('');



                            combo_server.addOption( response.map( function( server ){
                                return [ server.id, server.name ];
                            } ) );
                            
                        },
                        onFail: function(){

                        }
                     });
                });

                combo_server.attachEvent("onChange", function(value, text){
                    
                    if( typeof value !== 'string' )
                        return;
                    
                    if( value.length < 1 )
                        return;

                    view.form.lock();
                    self.model.schema.io.servers.read({
                        record: {
                            id: value
                        },
                        onSuccess: function(model) {

                            view.form.setFormData({
                                price: $dhx.parseFloat(model.get('price').toString(), 2),
                                expiration: new Date( model.get('expiration') )
                            });

                            self.fill_ips_grid_form_input_ui( value );

                            view.form.unlock();
                        },
                        onFail: function() {
                            view.form.unlock();
                        }
                    });
                });
                

                view.form.lock();
                self.model.schema.io.providers.readAll({
                    onSuccess: function(  col , response, options  ){
                        combo_provider.addOption(response.map(function( provider ){
                            return [ provider.id, provider.name ];
                        }));
                        view.form.unlock();
                        view.form.setFocusOnFirstActive();
                    },
                    onFail: function(){

                    }
                 });
            },
            fill_ips_grid_form_input_ui: function( serverId ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view;

                view.grid_ips.clearAll();
                view.form.lock();
                self.model.schema.io.ips.readAll({
                    filter: function(ip) {
                        if( ip.server == serverId && ip.status == 'Available' )
                        {
                            return ip;
                        }
                    },
                    onSuccess: function(col, response, options) {
                        col.forEach( function( model ){
                            self.isIpAssigned({
                                number: model.get('number'),
                                onSuccess:function(isAssigned, collection, response, options){

                                    var record = [];
                                    view._settings.grid_ips.id.forEach(function(col_id) {
                                        record.push($dhx.strip_tags(model.get(col_id)));
                                    });
                                    record.push(isAssigned);
                                    view.grid_ips.addRow( model.get('id'), record );
                                },
                                onFail: function(){

                                }
                            });
                        });

                        //view.grid_ips.adjustColumnSize(view.grid_ips.getColIndexById("number"));

                        view.form.unlock();
                    },
                    onFail: function() {
                        view.form.unlock();
                    }
                });
            },
            isIpAssigned: function( c ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    number = c.number || false, 
                    customerID = c.customerID,
                    lookup = {
                        onSuccess: function(collection, response, options) {
                            var isAssigned = false;
                            //console.log( response  );

                            if( response.length > 0 )
                            {

                            }


                            if( c.onSuccess ) c.onSuccess(isAssigned, collection, response, options);
                        },
                        onFail: function() {
                            if( c.onFail ) c.onFail(arguments);
                        }
                    };
                    if( !number )
                    {
                        throw 'Can not lookup without a number';
                    }

                    if( customerID )
                    {
                        lookup.filter = function( customer ) {
                            if (customer.id == customerID) {
                                return customer;
                            }
                        };
                    }

                self.model.schema.io.customers.readAll( lookup );
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
                self.selected_server = id;

                //self.show_item();

                //$dhx.ui.mvp.views.get('ip').toolbar.enableItem('create');

                //$dhx.ui.mvp.presenters.get('ip').fill_grid();
            },

            fill_grid: function( callBack ) {
                var self = this,
                    view = self.view;
                view.grid.clearAll();

                self.model.schema.io.customers.read({
                    record: {
                        id: $dhx.ui.mvp.views.get('customers').grid.getSelectedRowId()
                    },
                    onSuccess: function(model) {
                        
                        console.log( model );

                        view.grid.adjustColumnSize(view.grid.getColIndexById("name"));
                        if ( callBack ) callBack();
                    },
                    onFail: function() {}
                });

            },

            fill_grid_input: function( callBack ) {
                var self = this,
                    view = self.view;
                view.grid.clearAll();
                self.model.data[ collection ]().fetch({
                    sort: {
                        index: "provider", // postdate
                        order: 1
                    },
                    /*filter: function(server) {
                        if( server.provider == self.get_selected_provider() )
                        {
                            return server;
                        }
                    },*/
                    success: function(collection, response, options) {
                        collection.models.forEach(function(model) {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {

                                if( col_id == 'purchase' || col_id == 'expiration' )
                                {
                                    record.push( new Date( model.get(col_id) ) );
                                }
                                else
                                {
                                    record.push( $dhx.strip_tags( model.get(col_id) ) );
                                }

                                
                            });
                            //$dhx.debug.log(model.get('skills'));
                            view.grid.addRow(model.get('id'), record);
                        });
                        view.grid.adjustColumnSize(view.grid.getColIndexById("name"));
                        if ( callBack ) callBack();
                    },
                    error: function(collection, response, options) {
                        //$dhx.debug.log(collection);
                    }
                });
            },
            selected_server: null,
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