$dhx.ui.mvp.presenters.declare({
    "providers": (function() {
        'strict';
        var presenter_name = 'providers',
        collection = 'providers',
        API = {
            ___aaaa: 'provider presenter',
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
                console.log(presenter_name+' Child Presenter Received Message: ', message);
                
                // if message was sent by this client
                //if( message.client_id == $dhx.ui.session.client_id() )
                //{
                    if( message.collection == collection )
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
                    else if( message.collection == 'servers' )
                    {
                        ///alert();
                        if( message.method == 'create')
                        {
                            var record = [];
                            view.servers._settings.grid.id.forEach(function(col_id) {
                                record.push(message.model[ col_id ]);
                            });
                            console.log( message );
                            view.servers.grid.addRow( ( message.model.id || message.model._id), record, 0);
                        }
                        else if( message.method == 'update')
                        {
                            view.servers._settings.grid.id.forEach(function(col_id, index) {

                                view.servers.grid.cells(message.model.id, view.grid.getColIndexById(col_id)).setValue(message.model[ col_id ]);
                            });

                            if( view.servers.form_item )
                            {
                                //alert(view.form_item);
                                var t = setTimeout( function(){
                                    view.servers.presenter.show_item();
                                }, 300 );
                            }
                        }
                        else if( message.method == 'destroy')
                        {
                            view.servers.grid.deleteRow(message.model.id);
                        }
                    }
                    else if( message.collection == 'ips' )
                    {
                        ///alert();
                        if( message.method == 'create')
                        {
                            var record = [];
                            view.ips._settings.grid.id.forEach(function(col_id) {
                                record.push(message.model[ col_id ]);
                            });
                            console.log( message );
                            view.ips.grid.addRow( ( message.model.id || message.model._id), record, 0);
                        }
                        else if( message.method == 'update')
                        {
                            view.ips._settings.grid.id.forEach(function(col_id, index) {

                                view.ips.grid.cells(message.model.id, view.grid.getColIndexById(col_id)).setValue(message.model[ col_id ]);
                            });

                            if( view.ips.form_item )
                            {
                                //alert(view.form_item);
                                var t = setTimeout( function(){
                                    view.ips.presenter.show_item();
                                }, 300 );
                            }
                        }
                        else if( message.method == 'destroy')
                        {
                            view.ips.grid.deleteRow(message.model.id);
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

                    if( record.password )
                    {
                        record.password =  $dhx.crypt.base64_encode(record.password);
                    }

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
            formOnEnterHandler: function( ){
                $dhx.ui.mvp.presenters.get(presenter_name).form_process( );
            },
            mount_form_input_ui: function( action ){
                 var self = $dhx.ui.mvp.presenters.get(presenter_name),
                    view = self.view,
                    container = view._window(),
                    states = [];
                
                view.window.setText( ( action == 'create' ? 'Add new' : 'Edit' ) + ' Provider');
                view._form( container, action );

                // abbreviation
                // name

                if( action == 'update' )
                {
                    view.form.lock();
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

                            if( hash.password )
                            {
                                hash.password =  $dhx.crypt.base64_decode(hash.password);
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
                    view.form.setFocusOnFirstActive();
                }
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
                self.selected_provider = id;
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

                self.destroy_item();

                view.layout.cells('b').progressOn();
                self.model.schema.io[ collection ].read({
                    record: {
                        id: view.grid.getSelectedRowId()
                    },
                    onSuccess: function( model ) {

                        //view.layout.cells('b').setText(model.get('number'));
                        
                        if ( $dhx.ui.mvp.ui.isMobile ) {
                            view.layout.cells('a').collapse();
                            view.layout.cells('b').expand();
                        } else {
                            view.layout.cells('b').expand();
                        }
                        view._accordion();
                        view._toolbar_item();
                        view._form_item( model );
                        view._layout_servers();

                        view.accordion.cells('a').setText(model.get('name') + ' - Overall information');
                        view.accordion.cells('b').setText(model.get('name') + ' - Servers information');

                        //console.log( $dhx.ui.mvp.views );
                        //console.log( $dhx.ui.mvp.views );
                        //console.log( $dhx.ui.mvp.views.get('ip') );

                        $dhx.ui.mvp.views.get('servers').render( view.layout_servers.cells('a') );

                        $dhx.ui.mvp.views.get('ip').render( view.layout_servers.cells('b') );

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

                view.servers.presenter.destroy_item();
                view.ips.presenter.destroy_item();

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
            selected_provider: null,
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