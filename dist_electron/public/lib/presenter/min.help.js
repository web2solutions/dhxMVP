$dhx.ui.mvp.presenters.declare({help:function(){"strict";var e={start:function(){$dhx.debug.log("help:PRESENTER: start from presenter defined by user")},destroy:function(){$dhx.debug.log("help:PRESENTER: destroy from presenter defined by user")},fill_grid:function(e){var r=this,t=r.view;r.model.data.questions().fetch({sort:{index:"question",order:1},success:function(r,d,n){r.models.forEach(function(e){var r=[];t._settings.grid.id.forEach(function(t){r.push(e.get(t))}),t.grid.addRow(e.get("id"),r)}),t.grid.adjustColumnSize(t.grid.getColIndexById("question")),e&&e()},error:function(e,r,t){}})}};return e}()});