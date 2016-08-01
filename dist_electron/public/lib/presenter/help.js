$dhx.ui.mvp.presenters.declare({
    "help": (function() {
        'strict';
        var API = {
            start: function() {
                $dhx.debug.log('help:PRESENTER: start from presenter defined by user');
            },
            destroy: function() {
                $dhx.debug.log('help:PRESENTER: destroy from presenter defined by user');
                //$dhx.debug.log(this._view);
            },
            fill_grid: function( callBack ) {
                var self = this,
                    view = self.view;
                self.model.data.questions().fetch({
                    sort: {
                        index: "question", // postdate
                        order: 1
                    },
                    success: function(collection, response, options) {
                        collection.models.forEach(function(model) {
                            var record = [];
                            view._settings.grid.id.forEach(function(col_id) {
                                record.push(model.get(col_id));
                            });
                            //$dhx.debug.log(model.get('skills'));
                            view.grid.addRow(model.get('id'), record);
                        });
                        view.grid.adjustColumnSize(view.grid.getColIndexById("question"));
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