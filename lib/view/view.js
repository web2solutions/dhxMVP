$dhx.ui.mvp.views.declare({
    "view": (function() {
        'strict';
        var route = '#',
            main_view = $dhx.ui.mvp.main_view.extend({
                //initialize: function(options) {
                //  $dhx.debug.log('VIEW:: called initialize from main_view');
                //$dhx.debug.log('app initialized from ' + options.from );
                //}
            }),
            view = new main_view({
                _settings: {
                    sidebar_buttons: [],
                    sidebar: {
                        template: (window.screen.availWidth < 1024 ? "detail" : "tiles"), // string, used template, "details" by default
                        icons_path: null, // string, path to the folder with icons
                        //single_cell: true, // boolean, true to enable the single cell mode
                        width: 200, // number, width of the left part
                        header: (window.screen.availWidth < 1024 ? true : false), // boolean, true to enable the header
                        autohide: (window.screen.availWidth < 1024 ? true : false), // boolean, true to enable autohide for navigation bar 
                        items: [{
                            id: "/dashboard", // item id
                            text: "Dashboard", // item text
                            icon: 'dashboard.png', // icon used for the item
                            selected: true // boolean, true to select an item
                        }]
                    },
                    toolbar: {
                        icons_size: (window.screen.availWidth < 1024 ? 16 : 32),
                        icons_path: '',
                        items: [{
                            type: "button",
                            id: "logo",
                            img_disabled: "",
                            text: "<span style='font-size: 14px;'>dhx</span><span style='font-weight: bold; font-size: 14px;'>MV*</span>",
                            disabled: true
                        }, {
                            type: "separator"
                        }, {
                            type: "text",
                            id: "title",
                            text: "<img src='assets/icons/64/dashboard.png' width='32' style='position:relative;float:left; margin-top:10px; margin-right: 10px;' /><span style='font-weight: bold; font-size: 14px;'>Dashboard</span>"
                        }, {
                            type: (window.screen.availWidth < 1024 ? "separator" : "spacer")
                        }, {
                            type: "separator"
                        }, {
                            type: "button",
                            id: "/logout",
                            img: "logout.png",
                            img_disabled: "logout.png"
                        }]
                    },
                    layout: {
                        pattern: "1C",
                        //skin: "dhx_web",
                        cells: [{
                            id: "a",
                            text: "Dashboard"
                        }]
                    },
                    
                },
                // set var for each DHTMLX component used in this UI
                status_bar: null,
                sidebar: null,
                toolbar: null,
                layout: null,
                
                initialize: function(options) {
                    //$dhx.debug.log('VIEW:: called initialize from view.initialize');
                    //$dhx.debug.log(this);
                },
                _sidebar: function() {
                    var self = this;
                    if (self.sidebar === null) {
                        self._settings.sidebar.parent = this.container;
                        self._settings.sidebar.icons_path = this.icons_path;
                        self.sidebar = new dhtmlXSideBar(self._settings.sidebar);
                        self.sidebar.attachEvent("onSelect", self.presenter.sidebarOnSelectHandler);
                        self._wrapper = self.sidebar;
                    }
                    return self.sidebar;
                },
                _toolbar: function() {
                    var self = this;
                    if (self.toolbar === null) {
                        self._settings.toolbar.icons_path = this.icons_path;
                        self.toolbar = self.sidebar.attachToolbar(self._settings.toolbar);
                        self.toolbar.attachEvent("onClick", self.presenter.toolbarOnClickHandler);
                    }
                    console.log( 'self.toolbar: ', self.toolbar );
                    return self.toolbar;
                },
                _layout: function() {
                    var self = this;
                    if (self.layout === null) {
                        self.layout = self.sidebar.cells('/dashboard').attachLayout(self._settings.layout);
                        self.layout.attachEvent("onExpand", self.presenter.layoutOnExpandHandler);
                    }
                    console.log( 'self.layout: ', self.layout );
                    return self.layout;
                },
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function( render ) {
                    var self = this;
                    /**
                     * Start sidebar.      --> Mandatory 
                     * In this demo, DHTMLX Sidebar is used as main application wrapper and navigation panel,
                     * Dispatched routes will load content on sidebar cells
                     */
                    self._sidebar();

                    // Start your UI here
                    self.presenter.start_database({
                        onSuccess: function(){
                            

                            // Last statement of a view render() method.
                            // mandatory to call ... 
                            // will dispatch any sub view passed as route
                            // && will set the view as rendered
                            render.ok({
                                onComplete: function( route ){
                                    self.toolbar.setItemText("title", window.dhx4.template("<img src='assets/icons/64/#image#' width='32' style='position:relative;float:left; margin-top:10px; margin-right: 10px;' /><span style='font-weight: bold; font-size: 14px;'>#text#</span>", {
                                        text: view.sidebar.cells(route).getText().text,
                                        image: view.sidebar.cells(route).getText().text.toLowerCase() + '.png'
                                    }));
                                }
                            }); // OR render.onSuccess(); (deprecated) //
                            //console.log('this.rendered: ', this.rendered);

                        }
                    });
                },
                /**
                 * [subscriber function which receives messages from presenter]
                 * @param  {[string]} topic [listened topic]
                 * @param  {[Objec]} data  [message object]
                 */
                _subscriber: function(topic, data) {
                    var self = $dhx.ui.mvp.views.get('view');
                    
                }
            });
        return view;
    }())
});