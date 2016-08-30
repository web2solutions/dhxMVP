$dhx.ui.mvp.presenters.declare({
    "customers": (function() {
        'strict';
        var presenter_name = 'customers',
        collection = 'customers',
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

                    console.log( record );
                    console.log( view.form.action );
                    //return;
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
            fill_ips_grid_form_input_ui: function( providerId ){
                var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view;

                view.grid_ips.clearAll();
                view.form.lock();
                self.model.schema.io.ips.readAll({
                    filter: function(ip) {
                        if( ip.provider == providerId )
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

                        view.grid_ips.adjustColumnSize(view.grid_ips.getColIndexById("number"));

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
                        throw 'Can not lookup with a number';
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
            mount_form_input_ui: function( action ){
                 var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    container = view._window(),
                    states = [],
                    combo_type, 
                    combo_provider;
                
                view.window.setText( ( action == 'create' ? 'Add new' : 'Edit' ) + ' Customer');
                view._form( container, action );

                combo_provider = view.form.getCombo('provider');
                combo_provider.allowFreeText(false);
                combo_provider.enableAutocomplete();
                combo_provider.enableFilteringMode(true);

                combo_type = view.form.getCombo('type');
                combo_type.allowFreeText(false);
                combo_type.enableAutocomplete();
                combo_type.enableFilteringMode(true);

                if( action == 'create' )
                {
                    view.form.getContainer("assigned_ips").innerHTML = '<i>Please save the customer prior to assign IPs</i>';
                    view.form.getContainer("notes").innerHTML = '<i>Please save the customer prior to add notes</i>';
                }
                else
                {
                    view._grid_ips();
                    view._grid_notes();

                    combo_provider.attachEvent("onChange", function(value, text){
                        self.fill_ips_grid_form_input_ui( value );
                    });
                }
                
                view.form.lock();
                self.model.schema.io.providers.readAll({
                    filter: function(provider) {
                        if( provider.status == 'Active' )
                        {
                            return provider;
                        }
                    },
                    onSuccess: function(  col , response, options  ){
                        combo_provider.addOption(response.map(function( provider ){
                            return [ provider.id, provider.name ];
                        }));

                        self.model.schema.io.customer_types.readAll({
                            onSuccess: function(  col , response, options  ){
                                combo_type.addOption(response.map(function( type ){
                                    return [ type.type, type.type ];
                                }));

                                if( action == 'update' )
                                {
                                    //view.form.lock();
                                    self.model.schema.io[ collection ].read({
                                        record: {
                                            id: view.grid.getSelectedRowId()
                                        },
                                        onSuccess: function( model ) {
                                            
                                            var hash = model.toJSON();

                                            delete hash.id;
                                            delete hash._id;
                                            delete hash.__v;

                                            hash.expiration = new Date(hash.expiration);


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
                            onFail: function(){

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
                view.layout.cells('b').collapse();
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
                self.model.data[ collection ]().fetch({
                    sort: {
                        index: "name", // postdate
                        order: 1
                    },
                    success: function(collection, response, options) {
                        collection.models.forEach(function(model) {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {
                                if( col_id == 'expiration' )
                                {
                                    record.push( (new Date(model.get(col_id))).toISOString() );
                                    
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
        };
        return API;
    }())
});