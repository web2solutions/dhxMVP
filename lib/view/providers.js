$dhx.ui.mvp.views.declare({
    "providers": (function () {
        'strict';
        var route = 'providers',
            collection = 'providers',
            child_view = $dhx.ui.mvp.child_view.extend({ }),
            view = new child_view({
                /**
                 * [_settings View's settings. Components' internal settings]
                 * @type {Object}
                 */
                _settings: {
                    layout: {
                        pattern: "2U",
                        //skin: "dhx_web",
                        cells: [{
                            id: "a",
                            text: "Providers Management"
                        }, {
                            id: "b",
                            text: "Select a provider first"
                        }]
                    },
                    layout_servers: {
                        pattern: "2E",
                        //skin: "dhx_web",
                        cells: [{
                            id: "a",
                            text: "Listing servers"
                        }, {
                            id: "b",
                            text: "Select a provider first"
                        }]
                    },
                    accordion: {
                        icons_path: "", // string, path to icons, optional
                        //skin: "dhx_web", // string, accordion's skin, optional
                        //multi_mode: true,           // boolean, true to enable multimode
                        dnd: true, // boolean, true to enable drag-n-drop
                        items: [ // accordion cells section
                            {
                                id: "a", // item id, required
                                text: "Overall information", // string, header's text (html allowed)
                                //icon:   "icon.png", // string, header's icon, optional
                                open: true, // boolean, true to open/false to close item on init
                                //height: 200         // number, cell's height (multimode only)
                            }, {
                                id: "b", // item id, required
                                text: "Servers information", // string, header's text (html allowed)
                                //icon:   "bid.png", // string, header's icon, optional
                                open: false, // boolean, true to open/false to close item on init
                                //height: 200         // number, cell's height (multimode only)
                            }
                        ]
                    },
                    
                    toolbar: {
                        "icon_path": '',
                        items: [{
                            id: "create",
                            type: "button",
                            img: "add.png",
                            text: 'Add new',
                            tooltip: 'Add new'
                        },{
                            id: "update",
                            type: "button",
                            img: "update.png",
                            img_disabled: "update.png",
                            text: 'Update item',
                            tooltip: 'Update item',
                            disabled:true
                        },{
                            id: "destroy",
                            type: "button",
                            img: "delete.png",
                            img_disabled: "delete.png",
                            text: 'Delete item',
                            tooltip: 'Delete item',
                            disabled:true
                        }]
                    },

                    grid: {
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

                form: null,

                accordion: null,

                toolbar_item: null,
                form_item: null,

                initialize: function(options) {
                    var self = this;
                    $dhx.debug.log('CHILD:VIEW:: called initialize from '+collection+'_view.initialize');
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
                _layout: function() {
                    var self = this;
                    if (self.layout === null) {
                        self.layout = self._wrapper.cells(route).attachLayout(self._settings.layout);
                        self.layout.cells('a').setWidth(300);
                        self.layout.cells('b').collapse();
                    }
                    return self.layout;
                },


                _toolbar: function() {
                    var self = this;
                    if (self.toolbar === null) {
                        self._settings.toolbar.icons_path = self.icons_path;
                        self.toolbar = self.layout.attachToolbar(self._settings.toolbar);
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
                            self._settings.grid.width.push(defaults[prop].ui.grid.width);
                            self._settings.grid.colAligns.push(defaults[prop].ui.grid.align);
                            self._settings.grid.colTypes.push(defaults[prop].ui.grid.coltype);
                        }
                        self.grid = self.layout.cells('a').attachGrid();
                        self.grid.setHeader(self._settings.grid.header.join(','));
                        self.grid.setColumnIds(self._settings.grid.id.join(','));
                        self.grid.enableAutoWidth(true);
                        self.grid.setInitWidths(self._settings.grid.width.join(','));
                        //console.log( self._settings.grid.id.join(',') );
                        //console.log( self._settings.grid.width.join(',') );
                        self.grid.setColAlign(self._settings.grid.colAligns.join(','));
                        self.grid.setColTypes(self._settings.grid.colTypes.join(','));
                        self.grid.enableMultiline(false);
                        self.grid.setColumnHidden(self.grid.getColIndexById("description"), true);
                        self.grid.init();
                        self.grid.enableEditEvents(false, false, false);


                        $dhx.ui.data.static.countries.forEach( function( country ){
                            self.grid.getCombo(self.grid.getColIndexById("country")).put(country.code, country.name + ', ' + country.dial_code);
                        } );

                        self.grid.attachEvent("onRowSelect", self.presenter.gridOnRowSelectHandler);
                    }
                    return self.grid;
                },


                _accordion: function() {
                    var self = this;
                    if (self.accordion === null) {
                        self._settings.accordion.icons_path = self.icons_path;
                        self.accordion = self.layout.cells('b').attachAccordion(self._settings.accordion);
                        self.accordion.attachEvent("onActive", function(id, state) {
                            if (id == 'files') {
                                self.list_files();
                            }
                        });
                    }
                    self.accordion.cells('a').open();
                    return self.accordion;
                },

                
                _toolbar_item: function() {
                    var self = this;
                    if (self.toolbar_item === null) {
                        self._settings.toolbar_item.icons_path = self.icons_path;
                        self.toolbar_item = self.accordion.attachToolbar(self._settings.toolbar_item);
                        self.toolbar_item.attachEvent("onClick", self.presenter.toolbar_itemOnClickHandler);
                    }
                    return self.toolbar_item;
                },

                _form_item: function( model ) {
                    var self = this,
                        selected_row,
                        job_title,
                        company;
                    if (self.form_item !== null) {
                        self.form_item.unload();
                        self.form_item = null;
                    }

                    //alert(typeof model);
                    selected_row = self.grid.getSelectedRowId();
  
                    self._settings.form_item.template = [{
                        type: "settings",
                        position: "label-left",
                        labelWidth: 250,
                        offsetLeft: 10
                    }];
                    self._settings.grid.id.forEach(function(id, index) {
                        var header = self._settings.grid.header[index],
                            type = self.grid.getColType(0),
                            format = bold_text,
                            value = model.get(id);
                        $dhx.debug.log(id, value);
                        
                        //console.log('xxxxxxxxxxxxxxxxxx', value);

                        if( id == 'country' )
                        {
                            value = self.grid.cells(model.get('id'), self.grid.getColIndexById("country")).getText();
                        }

                        if( id == 'expiration' )
                        {
                            value = ( new Date(value) ).toISOString();
                            format = moment_to;
                        }

                        
                        if( id == '__v' || id == '_id' )
                            return;

                        if(typeof value === 'string') value = value.replace(/\n/g, '<br>');
                        
                        self._settings.form_item.template.push({
                            type: "template",
                            name: id,
                            label: header + ":",
                            value: value,
                            format: format
                        });
                    });
                    self.form_item = self.accordion.cells('a').attachForm(self._settings.form_item.template);
                    self.form_item.attachEvent("onButtonClick", function(name) {});
                    //}
                    return self.form_item;
                },



                _form: function( container, action ) {
                    var self = this,
                        defaults = self.presenter.model.versions[1][ collection ].defaults,
                        combo_country,
                        combo_status;

                    if (self.form !== null) {
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

                    /*
                    
                    =====>>>>> pragmatically build form layout

                    var input_settings;
                    for (var prop in defaults) {
                        //console.log(prop, defaults[prop]);
                        if (prop != '_id' && prop != '__v') {
                            input_settings = {
                                type: defaults[prop].ui.form.type,
                                name: prop,
                                label: defaults[prop].ui.form.label,
                                value: defaults[prop].default || '',
                                required: (defaults[prop].validate.required || false),
                                validate: (defaults[prop].validate.rules || ''),
                                mask_to_use: (defaults[prop].validate.mask_to_use || ''),
                            };
                            if (defaults[prop].ui.note) {
                                if (defaults[prop].ui.note.length > 0) {
                                    input_settings.note = {
                                        text: defaults[prop].ui.note
                                    };
                                    input_settings.tooltip = defaults[prop].ui.note;
                                    input_settings.info = true;
                                }
                            }
                            if (defaults[prop].ui.form.options) {
                                input_settings.options = defaults[prop].ui.form.options;
                            }
                            if (defaults[prop].ui.maxLength) {
                                if ($dhx.isNumber(defaults[prop].ui.maxLength)) {
                                    if (parseInt(defaults[prop].ui.maxLength) > 0) {
                                        input_settings.maxLength = defaults[prop].ui.maxLength;
                                    }
                                }
                            }
                            self._settings.form.template.push(input_settings);
                        }
                    }

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
                            label: 'Close on save',
                            checked: true
                            //position: 'label-right'
                        }]
                    });

                    self._settings.form.template.push({
                        type: "block",
                        list: [{
                            type: "button",
                            name: 'save',
                            value: 'Save item'
                        }, {
                            type: 'newcolumn'
                        }, {
                            type: "button",
                            name: 'reset',
                            value: 'Reset form'
                        }]
                    });
                     */

                    self.form = new $dhx.component.form({
                        id: collection + '.form',
                        parent: container,
                        settings: self._settings.form,
                        // defaults-> build form layout passing model defaults, 
                        // remove this line if you want to pragmatically build the form interface on the view layer
                        // it will add 'save' and 'reset' button to your form
                        defaults: defaults 
                    });

                    self.form.action = action;

                    self.form.attachEvent("onButtonClick", self.presenter.formOnButtonClickHandler );
                    self.form.attachEvent("onEnter", self.presenter.formOnEnterHandler );

                    combo_country = self.form.getCombo('country');
                    combo_country.allowFreeText(false);
                    combo_country.enableAutocomplete();
                    combo_country.enableFilteringMode(true);
                    combo_country.addOption( $dhx.ui.data.static.countries.map(function( country ){
                        return [ country.code, country.name + ', ' + country.dial_code ];
                    }) );

                    combo_status = self.form.getCombo('status');
                    combo_status.allowFreeText(false);
                    combo_status.enableAutocomplete();
                    combo_status.enableFilteringMode(true);

                    return self.form;
                },

                strWindowID: "dhxMVP."+collection+".view.window.",
                window: null,
                window_status_bar: null,
                _window: function() {
                    var self = this,
                        width, height;

                    if (self.window === null) {
                        width = ($dhx.ui.mvp.ui.isMobile ? 270 : 570);
                        height = 650;

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
                            return true;
                        });
                        
                        
                        self.window_status_bar = self.window.attachStatusBar();
                    }

                    return self.window;   
                },


                /* ===========================================
                 *                  Start Servers
                   =========================================== */


                // layout_servers
                // toolbar servers
                // grid servers
                // toolbar IPs
                // grid IPs
                layout_servers: null,
                _layout_servers: function() {
                    var self = this;
                    if (self.layout_servers === null) {
                        self.layout_servers = self.accordion.cells('b').attachLayout(self._settings.layout_servers);
                        //self.layout_servers.cells('a').setWidth(300);
                        //self.layout_servers.cells('b').collapse();
                    }
                    return self.layout_servers;
                },


                 /* ===========================================
                 *                  End Servers
                   =========================================== */
                
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function() {
                    var self = this;
                    //alert('providers');
                    
                    self._layout();
                    self._toolbar();
                    self._grid();

                    self.presenter.fill_grid();

                    //console.log( this );
                }
            });

        return view;
    }())
});