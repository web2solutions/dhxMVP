$dhx.ui.mvp.views.declare({
    "customer_servers": (function () {
        'strict';
        var route = 'customer_servers',
            collection = 'servers',
            servers_child_view = $dhx.ui.mvp.child_view.extend({ }),
            view = new servers_child_view({
                /**
                 * [_settings View's settings. Components' internal settings]
                 * @type {Object}
                 */
                _settings: {
                    layout: {
                        pattern: "1C",
                        //skin: "dhx_web",
                        cells: [{
                            id: "a",
                            text: "Assigned servers"
                        }]
                    },

                    
                    toolbar: {
                        "icon_path": '',
                        items: [{
                            id: "assign_server",
                            type: "button",
                            img: "server.png",
                            img_disabled: "server.png",
                            text: 'Assign Server',
                            tooltip: 'Assign Server'
                        }]
                    },

                    grid: {
                        header: [],
                        id: [],
                        width: ['0','0','*','100','120','90','0','0','0','0'], // 
                        colAligns: [],
                        colTypes: []
                    },

                    grid_ips: {
                        header: [],
                        id: [],
                        width: [], // 
                        colAligns: [],
                        colTypes: []
                    },

                    toolbar_item: {
                        "icon_path": '',
                        items: [{
                            id: "text",
                            type: "text",

                            text: ' '
                        },
                        {
                            type: "spacer"
                        }, {
                            id: "close",
                            type: "button",
                            img: "close.png",
                            text: 'close',
                            tooltip: 'Close job.'
                        }]
                    },


                    form: {
                        template: []
                    },

                    form_item: {
                        template: [{
                                type: "settings",
                                position: "label-left",
                                labelWidth: 130,
                                inputWidth: ($dhx.ui.mvp.ui.isMobile ? 270 : 500),
                                offsetLeft: 10
                            },
                            
                        ]
                    }
                },

                layout: null,
                toolbar: null,
                grid: null,

                grid_ips: null,

                form: null,


                toolbar_item: null,
                form_item: null,

                initialize: function(options) {
                    var self = this;
                    console.log('CHILD:VIEW:: called initialize from '+collection+'_view.initialize');
                },
                destroy: function() {
                    var self = this;
                    console.log('called destroy from '+collection+'.view');
                    

                    if (self.grid) {
                        self.grid.destructor();
                        self.grid = null;
                    }

                    if (self.layout) {
                        self.layout.unload();
                        self.layout = null;
                    }
                },
                _layout: function( container ) {
                    var self = this;
                    if (self.layout === null) {
                        if( container )
                        {
                            self.layout = container.attachLayout(self._settings.layout);
                        }
                        else
                        {
                            self.layout = self._wrapper.cells(route).attachLayout(self._settings.layout);
                        }
                        
                        //self.layout.cells('a').setWidth(300);
                        //self.layout.cells('b').collapse();
                    }
                    return self.layout;
                },


                _toolbar: function() {
                    var self = this;
                    if (self.toolbar === null) {
                        self._settings.toolbar.icons_path = self.icons_path;
                        self.toolbar = self.layout.cells('a').attachToolbar(self._settings.toolbar);
                        self.toolbar.attachEvent("onClick", self.presenter.toolbarOnClickHandler);
                    }
                    return self.toolbar;
                },

                _grid: function() {
                    var self = this,
                        defaults = self.presenter.model.versions[1][ collection ].defaults;
                    if (self.grid === null) {
                        for (var prop in defaults) {
                            self._settings.grid.id.push(prop);
                            self._settings.grid.header.push(defaults[prop].ui.grid.header);
                            //self._settings.grid.width.push(defaults[prop].ui.grid.width);
                            self._settings.grid.colAligns.push(defaults[prop].ui.grid.align);
                            self._settings.grid.colTypes.push(defaults[prop].ui.grid.coltype);
                        }
                        self.grid = self.layout.cells('a').attachGrid();
                        self.grid.setHeader(self._settings.grid.header.join(','));
                        self.grid.setColumnIds(self._settings.grid.id.join(','));
                        self.grid.enableAutoWidth(true);
                        self.grid.setInitWidths(self._settings.grid.width.join(','));
                        
                        console.log( self._settings.grid.id.join(',') );
                        console.log( self._settings.grid.width.join(',') );
                        console.log( self._settings.grid.colAligns.join(',') );
                        console.log( self._settings.grid.colTypes.join(',') );
                        
                        self.grid.setColAlign(self._settings.grid.colAligns.join(','));
                        self.grid.setColTypes(self._settings.grid.colTypes.join(','));
                        self.grid.enableMultiline(false);
                        self.grid.setColumnHidden(self.grid.getColIndexById("description"), true);
                        self.grid.init();
                        self.grid.enableEditEvents(false, false, false);


                        

                        self.grid.attachEvent("onRowSelect", self.presenter.gridOnRowSelectHandler);
                    }

                    return self.grid;
                },

                _grid_ips: function() {
                    var self = this,
                        defaults = self.presenter.model.versions[1].ips.defaults,
                        wrapper;
                    if (self.grid_ips === null) {
                        for (var prop in defaults) {
                            self._settings.grid_ips.id.push(prop);
                            self._settings.grid_ips.header.push(defaults[prop].ui.grid.header);
                            //self._settings.grid_ips.width.push(defaults[prop].ui.grid.width);
                            self._settings.grid_ips.colAligns.push(defaults[prop].ui.grid.align);
                            self._settings.grid_ips.colTypes.push(defaults[prop].ui.grid.coltype);
                        }
                    }

                        wrapper = self.form.getContainer("assign_ip");

                        wrapper.style.height = "150px";
                        
                        self.grid_ips = new dhtmlXGridObject( wrapper.id );



                        self.grid_ips.setHeader(self._settings.grid_ips.header.join(',') + ',Assign');
                        self.grid_ips.setColumnIds(self._settings.grid_ips.id.join(',') + ',assigned');
                        self.grid_ips.enableAutoWidth(true);
                        self.grid_ips.setInitWidths('0,0,0,0,*,90,0,90');
                        //console.log( self._settings.grid.id.join(',') );
                        //console.log( self._settings.grid_ips.width.join(',') );
                        self.grid_ips.setColAlign(self._settings.grid_ips.colAligns.join(',') + ',center');
                        self.grid_ips.setColTypes(self._settings.grid_ips.colTypes.join(',') + ',acheck');
                        self.grid_ips.enableMultiline(false);
                        
                        self.grid_ips.init();
                        self.grid_ips.enableEditEvents(false, false, false);
                    //}
                    return self.grid_ips;
                },



                _form: function( container, action ) {
                    var self = this,
                        defaults = self.presenter.model.versions[1][ collection ].defaults;

                    if (this.form !== null) {
                        self.form.unload();
                        self.form = null;
                    }

                    self._settings.form.template = [{
                        type: "settings",
                        position: "label-top",
                        labelWidth: ($dhx.ui.mvp.ui.isMobile ? 240 : 500),
                        inputWidth: ($dhx.ui.mvp.ui.isMobile ? 240 : 500),
                        offsetLeft: 10
                    }];

                
                    
                    //=====>>>>> pragmatically build form layout

                    self._settings.form.template.push({
                        type: 'combo',
                        name: 'provider',
                        label: 'Provider',
                        required: true,
                        validate: 'NotEmpty'
                    });

                    self._settings.form.template.push({
                        type: 'combo',
                        name: 'server',
                        label: 'Server',
                        required: true,
                        validate: 'NotEmpty'
                    });

                    self._settings.form.template.push({
                        type: 'input',
                        name: 'price',
                        label: 'Price',
                        required: true,
                        validate: 'NotEmpty',
                        mask_to_use: 'currency',
                    });

                    self._settings.form.template.push({
                        type: 'calendar',
                        name: 'expiration',
                        label: 'Expiration',
                        required: true,
                        validate: 'NotEmpty',
                        readonly: true
                    });


                    self._settings.form.template.push({
                        type: 'container',
                        name: 'assign_ip',
                        label: 'Assign IPs'
                    });

                    self._settings.form.template.push({
                        type: "block",
                        list: [
                        {
                            type: "settings",
                            position: "label-right",
                            offsetLeft: 0
                        },{
                            type: 'checkbox',
                            name: 'close_on_save',
                            label: 'Close on assign',
                            checked: true
                            //position: 'label-right'
                        }]
                    });

                    self._settings.form.template.push({
                        type: "block",
                        list: [{
                            type: "button",
                            name: 'save',
                            value: 'Assign Server'
                        }, {
                            type: 'newcolumn'
                        }, {
                            type: "button",
                            name: 'reset',
                            value: 'Reset form'
                        }]
                    });
                    

                    self.form = new $dhx.component.form({
                        id: collection + '.form',
                        parent: container,
                        settings: self._settings.form,
                        // defaults-> build form layout passing model defaults, 
                        // remove this line if you want to pragmatically build the form interface on the view layer
                        // it will add 'save' and 'reset' button to your form
                        //defaults: defaults 
                    });

                    self.form.action = action;

                    self.form.attachEvent("onButtonClick", self.presenter.formOnButtonClickHandler );
                    self.form.attachEvent("onEnter", self.presenter.formOnEnterHandler );

                    return self.form;
                },

                strWindowID: "dhxMVP."+collection+".view.window.",
                window: null,
                window_status_bar: null,
                _window: function() {
                    var self = this,
                        width, height;

                    if (self.window === null) {
                        width = ($dhx.ui.mvp.ui.isMobile ? 270 : 550);
                        height = 570;

                        self.window = new $dhx.ui.mvp.ui.window({
                            id: self.strWindowID,
                            width: width,
                            height: height
                        });

                        self.window.centerOnScreen();

                        self.window.button('park').hide();                        
                        self.window.button('stick').hide();

                        self.window.attachEvent("onClose", function(win) {
                            self.form.unload();
                            self.form = null;
                            self.window = null;
                            self.toolbar.enableItem('assign_server');
                            return true;
                        });
                        
                        
                        self.window_status_bar = self.window.attachStatusBar();
                    }

                    return self.window;   
                },
                
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function(  ) {
                    var self = this,
                        container = false;

                    //console.log('CHILD:VIEW:: rendering view');

                    //console.log( arguments );

                    container = arguments[0];

                    self._layout( container );
                    self._toolbar();
                    self._grid();




                    self.presenter.model.schema.io.providers.readAll({
                        onSuccess: function(  col , response, options  ){
                            //console.log( col );

                            col.forEach( function( model ){
                                self.grid.getCombo(self.grid.getColIndexById("provider")).put(model.get('id'), model.get('name'));
                            } );
                            
                            self.presenter.fill_grid();
                        },
                        onFail: function(){

                        }
                     });


                    

                    //console.log(this);
                }
            });
        
        return view;
    }())
});