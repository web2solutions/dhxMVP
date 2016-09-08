$dhx.ui.mvp.presenters.declare({help:function(){"strict";var e={start:function(){$dhx.debug.log("help:PRESENTER: start from presenter defined by user")},destroy:function(){var e=this;e.view;$dhx.debug.log("help:PRESENTER: destroy from presenter defined by user")},subscriber:function(e,o){var t=$dhx.ui.mvp.presenters.get("help"),i=t.view;if(console.log("help Child Presenter Received Message: ",o),"questions"==o.collection)if("create"==o.method){var r=[];i._settings.grid.id.forEach(function(e){r.push(o.model[e])}),console.log(o),i.grid.addRow(o.model.id||o.model._id,r,0)}else"update"==o.method?(i._settings.grid.id.forEach(function(e,t){i.grid.cells(o.model.id,i.grid.getColIndexById(e)).setValue(o.model[e])}),i.form_item&&t.show_item()):"destroy"==o.method&&i.grid.deleteRow(o.model.id)},toolbarOnClickHandler:function(e){var o=$dhx.ui.mvp.presenters.get("help");view=o.view,"destroy"!=e?o.mount_form_input_ui(e):"destroy"==e&&(this.disableItem("destroy"),o.delete_item({onSuccess:function(){o.destroy_item()},onFail:function(){view.form.unlock()}}))},form_process:function(){var e,o=$dhx.ui.mvp.presenters.get("help"),t=o.view,i=t.form.getFormData();t.form.check()&&(t.form.lock(),e={question:i.question,answer:i.answer},"update"==t.form.action&&(e.id=t.grid.getSelectedRowId()),console.log(t.form.action),o.model.schema.io.questions[t.form.action]({record:e,onSuccess:function(){t.form.isItemChecked("close_on_save")?t.window.close():(t.form.reset(),t.form.unlock())},onFail:function(){t.form.unlock()}}))},formOnButtonClickHandler:function(e){"save"==e?$dhx.ui.mvp.presenters.get("help").form_process():"reset"==e&&view.form.reset()},formOnEnterHandler:function(){$dhx.ui.mvp.presenters.get("help").form_process()},mount_form_input_ui:function(e){var o=$dhx.ui.mvp.presenters.get("help"),t=o.view,i=t._window();t.window.setText(("create"==e?"Add new":"Edit")+" question"),t._form(i,e),"update"==e?(t.form.lock(),o.model.schema.io.questions.read({record:{id:t.grid.getSelectedRowId()},onSuccess:function(e){t.form.setFormData({question:e.get("question"),answer:e.get("answer")}),t.form.unlock(),t.form.setFocusOnFirstActive()},onFail:function(){}})):t.form.setFocusOnFirstActive()},delete_item:function(e){var o=$dhx.ui.mvp.presenters.get("help");view=o.view,o.model.schema.io.questions.destroy({record:{id:view.grid.getSelectedRowId()},onSuccess:function(o){e.onSuccess&&e.onSuccess()},onFail:function(){e.onFail&&e.onFail()}})},gridOnRowSelectHandler:function(e){var o=$dhx.ui.mvp.presenters.get("help");view=o.view,o.show_item()},toolbar_itemOnClickHandler:function(e){var o=$dhx.ui.mvp.presenters.get("help");o.view;"close"==e&&o.destroy_item()},show_item:function(){var e=this,o=e.view;o.layout.cells("b").progressOn(),e.model.schema.io.questions.read({record:{id:o.grid.getSelectedRowId()},onSuccess:function(e){$dhx.ui.mvp.ui.isMobile?(o.layout.cells("a").collapse(),o.layout.cells("b").expand()):o.layout.cells("b").expand(),o._toolbar_item(),o._form_item(e),o.toolbar.enableItem("update"),o.toolbar.enableItem("destroy"),o.layout.cells("b").progressOff()},onFail:function(){}})},destroy_item:function(){var e=this,o=e.view;o.layout.cells("b").collapse(),o.form_item&&(o.form_item.unload(),o.form_item=null)},fill_grid:function(e){var o=this,t=o.view;o.model.data.questions().fetch({sort:{index:"question",order:1},success:function(o,i,r){o.models.forEach(function(e){var o=[];t._settings.grid.id.forEach(function(t){o.push($dhx.strip_tags(e.get(t)))}),t.grid.addRow(e.get("id"),o)}),t.grid.adjustColumnSize(t.grid.getColIndexById("question")),e&&e()},error:function(e,o,t){}})}};return e}()});