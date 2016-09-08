$dhx.ui.mvp.presenters.declare({
    "customer_types": (function() {
        'strict';
        var presenter_name = 'customer_types',
        collection = 'customer_types',
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
                    container = view._window();
                
                view.window.setText( ( action == 'create' ? 'Add new' : 'Edit' ) + ' Customer Type');
                view._form( container, action );

                if (action == 'update') {
                    view.form.lock();
                    self.model.schema.io[collection].read({
                        record: {
                            id: view.grid.getSelectedRowId()
                        },
                        onSuccess: function(model) {
                            var hash = model.toJSON();
                            delete hash.id;
                            delete hash._id;
                            delete hash.__v;
                            
                            
                            view.form.setFormData(hash);
                            view.form.unlock();
                            view.form.setFocusOnFirstActive();
                        },
                        onFail: function() {}
                    });
                } else {
                    view.form.unlock();
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
                        index: "type", // postdate
                        order: 1
                    },
                    success: function(collection, response, options) {
                        collection.models.forEach(function(model) {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {
                                record.push( $dhx.strip_tags( model.get(col_id) ) );
                            });
                            //$dhx.debug.log(model.get('skills'));
                            view.grid.addRow(model.get('id'), record);
                        });
                        view.grid.adjustColumnSize(view.grid.getColIndexById("type"));
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