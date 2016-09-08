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
                        template: ( $dhx.ui.mvp.ui.isMobile ? "detail" : "tiles"), // string, used template, "details" by default
                        icons_path: null, // string, path to the folder with icons
                        //single_cell: true, // boolean, true to enable the single cell mode
                        width: 200, // number, width of the left part
                        header: ($dhx.ui.mvp.ui.isMobile ? true : false), // boolean, true to enable the header
                        autohide: ($dhx.ui.mvp.ui.isMobile ? true : false), // boolean, true to enable autohide for navigation bar 
                        items: [{
                            id: "#", // item id
                            text: "Dashboard", // item text
                            icon: 'dashboard.png', // icon used for the item
                            selected: true // boolean, true to select an item
                        }]
                    },
                    toolbar: {
                        icons_size: ($dhx.ui.mvp.ui.isMobile ? 16 : 32),
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
                            text: "<img src='"+app.root+"assets/icons/64/dashboard.png' width='32' style='position:relative;float:left; margin-top:-5px; margin-right: 5px;' /><span style='font-weight: bold; font-size: 14px;'>Dashboard</span>"
                        }, {
                            type: ($dhx.ui.mvp.ui.isMobile ? "separator" : "spacer")
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
                        pattern: "4C",
                        //skin: "dhx_web",
                        cells: [{
                            id: "a",
                            text: "Overall information"
                        },{
                            id: "b",
                            text: "Database Collections - IndexedDB"
                        },{
                            id: "c",
                            text: "Collections data - IndexedDB"
                        },{
                            id: "d",
                            text: "Collections size - IndexedDB"
                        }]
                    },

                    form: {
                        template: [{
                            type: "settings",
                            position: ($dhx.ui.mvp.ui.isMobile ? "label-top" : "label-left"),
                            labelWidth: ($dhx.ui.mvp.ui.isMobile ? 250 : 160),
                            offsetLeft: 10
                        }]
                    },

                    chart_database_collections:{
                        view:"bar",
                        value:"#items#",
                        color:"#color#",
                        label:"#collection#",
                        tooltip:"#collection# collection",
                        gradient:"rising",
                        radius:0,
                        barWidth:35,
                    },

                    chart_collections_data: {
    
                        view:"barH",
                        value:"#items#",
                        color:"#color#",
                        //label:"#collection# #items#",
                        tooltip:"#collection# #items#",
                        barWidth:35,
                        radius:0,
                        gradient:"rising",
                        xAxis:{
                            title:"Documents per collection",
                            start:0,
                            //end:150,
                            step:50,
                            //template:"{obj}",
                        }
                    },

                    chart_collections_size: {
    
                        view:"barH",
                        value:"#size#",
                        color:"#color#",
                        //label:"#collection# #size# kB",
                        tooltip:"#collection# #size# kB",
                        barWidth:35,
                        radius:0,
                        gradient:"rising",
                        xAxis:{
                            title:"Collections per size in kB",
                            start:0,
                            //end:150,
                            step:50,
                            //template:"{obj}",
                        }
                    }
                    
                },
                // set var for each DHTMLX component used in this UI
                status_bar: null,
                sidebar: null,
                toolbar: null,
                layout: null,

                form: null,

                chart_database_collections:null,
                chart_collections_data: null,
                chart_collections_size: null,
                
                initialize: function(options) {
                    //$dhx.debug.log('VIEW:: called initialize from view.initialize');
                    //$dhx.debug.log(this);
                },
                _sidebar: function() {
                    var self = this;
                    if (self.sidebar === null) {
                        self._settings.sidebar.parent = self.container;
                        self._settings.sidebar.icons_path = self.icons_path;
                        self.sidebar = new dhtmlXSideBar(self._settings.sidebar);
                        self.sidebar.attachEvent("onSelect", self.presenter.sidebarOnSelectHandler);
                        self._wrapper = self.sidebar;
                    }
                    return self.sidebar;
                },
                _toolbar: function() {
                    var self = this;
                    if (self.toolbar === null) {
                        self._settings.toolbar.icons_path = self.icons_path;
                        self.toolbar = self.sidebar.attachToolbar(self._settings.toolbar);
                        self.toolbar.attachEvent("onClick", self.presenter.toolbarOnClickHandler);
                    }
                    //console.log( 'self.toolbar: ', self.toolbar );
                    return self.toolbar;
                },
                _layout: function() {
                    var self = this;
                    if (self.layout === null) {
                        self.layout = self.sidebar.cells('#').attachLayout(self._settings.layout);
                        self.layout.attachEvent("onExpand", self.presenter.layoutOnExpandHandler);
                        self.layout.setAutoSize("a", "b;c;d");
                        self.layout.cells('a').setWidth(400);
                    }
                    //console.log( 'self.layout: ', self.layout );
                    return self.layout;
                },

                _form: function() {
                    var self = this;

                    if (this.form !== null) {
                        self.form.unload();
                        self.form = null;
                    }
                    
                    self._settings.form.template.push({
                        type: "template",
                        name: 'system_type',
                        label: "System type",
                        value: $dhx.Browser.OS + ' ' + ( navigator.oscpu ? navigator.oscpu : ''  ),
                        format: simple_text
                    });

                    self._settings.form.template.push({
                        type: "template",
                        name: 'browser',
                        label: "Browser",
                        value: $dhx.Browser.name + ' ' + $dhx.Browser.version,
                        format: simple_text
                    });

                    self._settings.form.template.push({
                        type: "template",
                        name: 'online',
                        label: "Online",
                        value: $dhx.Browser.onLine,
                        format: simple_text
                    });



                    self._settings.form.template.push({
                        type: "template",
                        name: 'notification_permission',
                        label: "Notification Permission",
                        value: '<div><input type="button" id="dhx_npermission" value="'+Notification.permission+'" onclick="$dhx.ui.mvp.presenters.get(\'presenter\').askNotificationPermission()" /></div>',
                        format: simple_text
                    });


                    

                    self._settings.form.template.push({
                        type: "template",
                        name: 'location_permission',
                        label: "Location Permission",
                        value: '<div><input type="button" id="location_npermission" value="checking ..." onclick="$dhx.ui.mvp.presenters.get(\'presenter\').askLocationPermission()" /></div>',
                        format: simple_text
                    });
                    self._settings.form.template.push({
                        type: "template",
                        name: 'current_location',
                        label: "Current Location",
                        value: '<div id="current_location"></div>',
                        format: simple_text
                    });
                    self._settings.form.template.push({
                        type: "template",
                        name: 'quota',
                        label: "Local database Quota (IndexedDB)",
                        value: '<div id="dhx_quota"><span style="color:red">This browser does not provide quota management.</span></div>',
                        format: simple_text
                    });

                    $dhx.ui.mvp.ui.getQuota(function(used, remaining){
                        document.getElementById('dhx_quota').innerHTML = 'Used: ' + used + 'GB. <br>Remaining: ' + remaining + 'GB';
                    });

                    self.form = self.layout.cells('a').attachForm(self._settings.form.template);


                    /*navigator.geolocation.getCurrentPosition(function( geoposition ){
                        console.log( 'DDDDD: ', geoposition.coords );


                        
                        document.getElementById('current_location').innerHTML = 'Latitude: ' + geoposition.coords.latitude + '. <br>Longitude: ' + geoposition.coords.longitude;
                        document.getElementById('location_npermission').value = 'granted';

                    }, function(err){
                        document.getElementById('location_npermission').value = 'require permission';
                    });*/


                    self.form.attachEvent("onButtonClick", function(name) {});
                    return self.form;
                },

                _chart_database_collections:function(){
                    var self = this;
                    if (self.chart_database_collections === null) {
                        self.chart_database_collections = self.layout.cells('b').attachChart( self._settings.chart_database_collections );
                    }
                    return self.chart_database_collections;
                },


                _chart_collections_data:function(){
                    var self = this;
                    if (self.chart_collections_data === null) {
                        self.chart_collections_data = self.layout.cells('c').attachChart( self._settings.chart_collections_data );
                        self.chart_collections_data.define("legend",{
                            width: 150,
                            align:"right",
                            valign:"top",
                            marker:{
                                type:"round",
                                width:15
                            },
                            toggle: true,
                            template:"#collection# #items#"
                        });
                    }
                    return self.chart_collections_data;
                },

                _chart_collections_size:function(){
                    var self = this;
                    if (self.chart_collections_size === null) {
                        self.chart_collections_size = self.layout.cells('d').attachChart( self._settings.chart_collections_size );
                        self.chart_collections_size.define("legend",{
                            width: 150,
                            align:"right",
                            valign:"top",
                            marker:{
                                type:"round",
                                width:15
                            },
                            toggle: true,
                            template:"#collection# #size# kB"
                        });
                    }
                    return self.chart_collections_size;
                },

                /**
                 * [onDispatch event. Called each time a route is dispatched via main_view.dispatch() ]
                 */
                onDispatch:function(id) {
                    var self = this;

                    try {
                        //console.log( self.sidebar );
                        //console.log( id.split('?')[0] );
                        //console.log( self.sidebar.cells(id.split('?')[0]) );
                        self.sidebar.cells(id.split('?')[0]).setActive();
                        //console.log( 'ok ok ' );
                        window.dhx4.callEvent("onSidebarSelect", [id.split('?')[0], self.sidebar.cells(id.split('?')[0])]);
                        
                        if (!$dhx.ui.mvp.ui.isMobile) {
                            self.toolbar.setItemText("title", window.dhx4.template("<img src='"+self.root+"assets/icons/64/#image#' width='32' style='position:relative;float:left; margin-top:10px; margin-right: 10px;' /><span style='font-weight: bold; font-size: 14px;'>#text#</span>", {
                                text: self.sidebar.cells(id).getText().text,
                                image: self.sidebar.cells(id).getText().text.toLowerCase() + '.png'
                            }));
                        }

                        
                    } catch (e) {
                        //console.log(e.message);
                        //console.log(e.stack);
                    }
                    //self._router.dispatch(id, true);
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

                            if( $dhx.ui.mvp.ui.isMobile ) self.layout.cells('a').collapse();
                            if( $dhx.ui.mvp.ui.isMobile ) self.layout.cells('b').collapse();
                            
                            // Last statement of a view render() method.
                            // mandatory to call ... 
                            // will dispatch any sub view passed as route
                            // && will set the view as rendered
                            render.ok({
                                onComplete: function( route ){
                                    // route is something like help/1
                                    // 
                                    //console.log('now load the module requested via url: ', route);
                                    route = route.split('/')[0];
                                    if( ! $dhx.ui.mvp.ui.isMobile )
                                    {
                                        self.toolbar.setItemText("title", window.dhx4.template("<img src='"+self.root+"assets/icons/64/#image#' width='32' style='position:relative;float:left; margin-top:-5px; margin-right: 5px;' /><span style='font-weight: bold; font-size: 14px;'>#text#</span>", {
                                            text: self.sidebar.cells(route).getText().text,
                                            image: self.sidebar.cells(route).getText().text.toLowerCase() + '.png'
                                        }));
                                    }

                                    self.sidebar.cells(route).setActive();
                                }
                            }); // OR render.onSuccess(); (deprecated) //
                            //console.log('self.rendered: ', self.rendered);

                        }
                    });
                }
            });
        return view;
    }())
});