$dhx.ui.mvp.views.declare({
    "help": (function () {
        'strict';
        var route = 'help',
            collection = 'faq',
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
                            text: "Frequently Asked Questions"
                        }, {
                            id: "b",
                            text: "Select a question first"
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
                                text: "Text", // string, header's text (html allowed)
                                //icon:   "icon.png", // string, header's icon, optional
                                open: true, // boolean, true to open/false to close item on init
                                //height: 200         // number, cell's height (multimode only)
                            }, {
                                id: "b", // item id, required
                                text: "Job bids", // string, header's text (html allowed)
                                //icon:   "bid.png", // string, header's icon, optional
                                open: false, // boolean, true to open/false to close item on init
                                //height: 200         // number, cell's height (multimode only)
                            }
                        ]
                    },
                    
                    toolbar: {
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

                    grid: {
                        header: [],
                        id: [],
                        width: [], // 
                        colAligns: [],
                        colTypes: []
                    },


                    form: {
                        template: [{
                                type: "settings",
                                position: "label-left",
                                labelWidth: 130
                            },
                            
                        ]
                    }
                },

                layout: null,

                grid: null,

                accordion: null,

                toolbar: null,
                form: null,

                initialize: function(options) {
                    $dhx.debug.log('CHILD:VIEW:: called initialize from help_view.initialize');
                },
                destroy: function() {

                   
                    if (this.grid) {
                        this.grid.destructor();
                        this.grid = null;
                    }
                    if (this.layout) {
                        //this.layout.unload();
                        //this.layout = null;
                    }
                },
                _layout: function() {
                    if (this.layout === null) {
                        this.layout = this._wrapper.cells('/help').attachLayout(this._settings.layout);
                        this.layout.cells('a').setWidth(300);
                        this.layout.cells('b').collapse();
                    }
                    return this.layout;
                },

                _grid: function() {
                    var self = this,
                        defaults = self.model.versions[1].questions.defaults;
                    if (this.grid === null) {
                        for (var prop in defaults) {
                            self._settings.grid.id.push(prop);
                            self._settings.grid.header.push(defaults[prop].ui.grid.header);
                            self._settings.grid.width.push(defaults[prop].ui.grid.width);
                            self._settings.grid.colAligns.push(defaults[prop].ui.grid.align);
                            self._settings.grid.colTypes.push(defaults[prop].ui.grid.coltype);
                        }
                        this.grid = self.layout.cells('a').attachGrid();
                        this.grid.setHeader(self._settings.grid.header.join(','));
                        this.grid.setColumnIds(self._settings.grid.id.join(','));
                        this.grid.enableAutoWidth(true);
                        this.grid.setInitWidths(self._settings.grid.width.join(','));
                        //console.log( self._settings.grid.id.join(',') );
                        //console.log( self._settings.grid.width.join(',') );
                        this.grid.setColAlign(self._settings.grid.colAligns.join(','));
                        this.grid.setColTypes(self._settings.grid.colTypes.join(','));
                        this.grid.enableMultiline(false);
                        this.grid.setColumnHidden(self.grid.getColIndexById("description"), true);
                        this.grid.init();
                        this.grid.enableEditEvents(false, false, false);
                        this.grid.attachEvent("onRowSelect", function(id) {
                            self.show_question();
                        });
                    }
                    return this.grid;
                },

                _toolbar: function() {
                    var self = this;
                    if (this.toolbar === null) {
                        self._settings.toolbar.icons_path = this.icons_path;
                        this.toolbar = this.layout.cells('b').attachToolbar(self._settings.toolbar);
                        this.toolbar.attachEvent("onClick", function(id) {
                            if (id == 'close') {
                                self.destroy_question();
                            }
                        });
                    }
                    return this.toolbar;
                },


                _form: function() {
                    var self = this,
                        selected_row,
                        job_title,
                        company;
                    if (this.form !== null) {
                        self.form.unload();
                        self.form = null;
                    }


                    selected_row = self.grid.getSelectedRowId();
  
                    self._settings.form.template = [{
                        type: "settings",
                        position: "label-left",
                        labelWidth: 130
                    }];
                    self._settings.grid.id.forEach(function(id, index) {
                        var header = self._settings.grid.header[index],
                            type = self.grid.getColType(0),
                            format = bold_text,
                            value = self.grid.cells(selected_row, index).getValue() || self.grid.cells(selected_row, index).getTitle();
                        $dhx.debug.log(id, value);
                        

                        value = value.replace(/\n/g, '<br>');
                        if( id == '__v' || id == '_id' )
                            return;
                        
                        self._settings.form.template.push({
                            type: "template",
                            name: id,
                            label: header + ":",
                            value: value,
                            format: format
                        });
                    });
                    this.form = this.layout.cells('b').attachForm(self._settings.form.template);
                    this.form.attachEvent("onButtonClick", function(name) {});
                    //}
                    return this.form;
                },

                show_question: function() {
                    var self = this,
                        selected_row = self.grid.getSelectedRowId(),
                        question = self.grid.cells(selected_row, 0).getValue();
                    

                    if(  window.screen.availWidth < 1024   )
                    {
                        self.layout.cells('a').collapse();
                        self.layout.cells('b').expand();
                    }
                    else
                    {
                        self.layout.cells('b').expand();
                    }
                    
                    self._toolbar();
                    
                    self._form();

                },
                destroy_question: function() {
                    var self = this;
                    self.layout.cells('b').collapse();
                    //self.form.unload();
                    //self.form = null;
                    //self.accordion.unload();
                    //self.accordion = null;
                },
                
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function() {
                    var self = this;
                    $dhx.debug.log('CHILD:VIEW:: rendering view');
                    self._layout();
                    self._grid();

                    self.presenter.fill_grid();

                    $dhx.debug.log(this);
                },
                /**
                 * [subscriber function which receives jobs from presenter]
                 * @param  {[string]} topic [listened topic]
                 * @param  {[Objec]} data  [message object]
                 */
                _subscriber: function(topic, data) {
                    var self = $dhx.ui.mvp.views.get( route );
                }
            });

        return view;
    }())
});