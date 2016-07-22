$dhx.ui.mvp.presenters.declare({
    "presenter": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },

            /*
             *
             *	INIT components event handlers
             */ 
            sidebarOnSelectHandler: function(id, lastId) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
                if (id == '/logout') {
                    self.do_logout();
                }
                if (id != '/dashboard' && id != '/logout') {
                    //$dhx.debug.log(id);
                    view._router.dispatch(id, true);
                    window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
                }
                if (id == '/dashboard') {
                    view._router.dispatch('#', true);
                    
                }
                if (window.screen.availWidth > 1024) {
                    view.toolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", {
                        text: view.sidebar.cells(id).getText().text
                    }));
                }
            },
            toolbarOnClickHandler: function(id) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
                if (id == '/logout') {
                    self.do_logout();
                }
            },
            layoutOnExpandHandler: function(name) {
                var self = $dhx.ui.mvp.presenters.get('presenter'),
                    view = self.view;
                
            },
            /*
             *
             *	END components event handlers
             */ 


            /**
             * /
             * Main View Helpers
             */
            
            do_logout: function() {
                var self = this,
                    view = self.view;
                // do logout logic here
                window.location.reload();
            },
            
            
            
            add_sidebar_buttons: function() {
                var self = this,
                    view = self.view;
                
                view.sidebar.addItem({
                    id: "/help", // item id
                    text: "Help", // item text
                    icon: "help.png", // icon used for the item
                });
                
                if (window.screen.availWidth < 1024) {
                    view.sidebar.addItem([{
                        id: "sep10", // separator id
                        type: "separator" // item type, mandatory
                    }, {
                        id: "/logout", // item id
                        text: "Logout", // item text
                        icon: 'logout.png', // icon used for the item
                    }]);
                }
            }, // end add_sidebar_buttons
            adjust_to_mobile: function() {
                var self = this,
                    view = self.view;
                try {
                    if (window.screen.availWidth < 1024) {
                        view.layout.cells('b').setText('Stats');
                        view.layout.cells('b').collapse();
                        view.layout.cells('b').setText('Stats');
                    } else {
                        view.status_bar.setText('');
                    }
                } catch (e) {
                    console.log(e.stack);
                }
            }, // end adjust_to_mobile
            build_ui: function() {
                var self = this,
                    view = self.view;
                $dhx.showDirections("Starting UI");
                if (window.screen.availWidth > 1024) {
                    view._toolbar();
                }
                view.status_bar = view.sidebar.attachStatusBar();
                self.add_sidebar_buttons();
                view._layout();
                self.adjust_to_mobile();
                $dhx.hideDirections();
                //view.layout.progressOn();
            }, // end build_ui
            
            addBubble: function(tab, num) {
                var self = this,
                    view = self.view,
                    current_number = view.sidebar.cells(tab).getBubble() || 0;
                if (current_number === '') {
                    current_number = 0;
                }
                current_number = +current_number;
                current_number = current_number + num;
                view.sidebar.cells(tab).setBubble(current_number);
            },
            clearBubble: function(tab) {
                var self = this,
                    view = self.view;
                view.sidebar.cells(tab).clearBubble();
            },
            
        };
        return API;
    }())
});