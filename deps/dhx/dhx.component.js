/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */
(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
$dhx.component = $dhx.component || {
    checkCommomConfiguration: function(c, type) {
        var error_message;
        if (c.parent) {} else {
            error_message = "parent is missing when creating " + type + " component";
            $dhx.debug.error(error_message);
            dhtmlx.message({
                type: "error",
                text: error_message
            });
            return false;
        }
        if (c.settings) {} else {
            error_message = "settings is missing when creating " + type + " component";
            $dhx.debug.error(error_message);
            dhtmlx.message({
                type: "error",
                text: error_message
            });
            return false;
        }
        return true;
    },
    form: function(c) {
        var dhxForm = null,
            self = this,
            that = $dhx.component;
        if (!that.checkCommomConfiguration(c, 'form')) {
            return;
        }
        if (typeof c.parent == 'string') {
            dhxForm = new dhtmlXForm(c.parent, c.settings.template);
        } else {
            dhxForm = c.parent.attachForm(c.settings.template);
        }
        dhxForm._dhx_form_id = c.id;
        $dhx.dhtmlx.prepareForm(c.id, c.settings, dhxForm);
        dhxForm.fields = $dhx.dhtmlx.getFormFields(c.id);
        dhxForm.getFields = function() {
            //console.log(c.id);
            //console.log($dhx.dhtmlx.formFields);
            $dhx.dhtmlx.getFormFields(c.id);
        };
        dhxForm.getField = function(name) {
            //console.log(c.id);
            //console.log($dhx.dhtmlx.formFields);
            $dhx.dhtmlx.getFormItem(name, c.id);
        };
        dhxForm.getFieldsName = function() {
            $dhx.dhtmlx.getFormFields(c.id);
        };
        dhxForm.check = function() {
            return $dhx.dhtmlx.validateForm(c.id, dhxForm);
        };
        dhxForm.validate = function() {
            return $dhx.dhtmlx.validateForm(c.id, dhxForm);
        };
        dhxForm.setFieldMandatory = function(fieldId, state) {
            /*dhxForm.add = function( state ){
            	
            }
            dhxForm.update = function( state ){
            	
            }*/
        };
        dhxForm.getFormDataO = dhxForm.getFormData;
        dhxForm.getFormData = function() {
            var hash = dhxForm.getFormDataO(),
                h = {};
            for (var i in hash)
                if (hash.hasOwnProperty(i)) {
                    if (typeof hash[i] == 'string') {
                        h[i] = hash[i].replace(/\&/g, encodeURIComponent('&'));
                    } else {
                        h[i] = hash[i];
                    }
                }
            dhxForm.fields.forEach(function(field) {
                //console.log( field );
                if (field.type == 'combo' && field.comboType == 'checkbox') {
                    var combo = dhxForm.getCombo(field.name);
                    var checked_array = combo.getChecked();
                    h[field.name] = checked_array.join(', ');
                }
                if (field.type == 'input' && field.mask_to_use == 'currency') {
                    h[field.name] = h[field.name].toString().replace(/,/g, '');
                    if (!$dhx.isNumber(h[field.name])) {
                        h[field.name] = 0;
                    }
                }
                if (field.type == 'input' && field.mask_to_use == 'can_currency') {
                    h[field.name] = h[field.name].toString().replace(/,/g, '');
                    if (!$dhx.isNumber(h[field.name])) {
                        h[field.name] = 0;
                    }
                }
                if (field.type == 'input' && field.mask_to_use == 'br_currency') {
                    h[field.name] = h[field.name].toString().replace(/./g, '');
                    h[field.name] = h[field.name].toString().replace(/,/g, '.');
                    if (!$dhx.isNumber(h[field.name])) {
                        h[field.name] = 0;
                    }
                }
                if (field.type == 'input' && field.sql_type == 'timestamp without time zone') {
                    h[field.name] = h[field.name].toString().replace(/,/g, '');
                    if (!$dhx.isNumber(h[field.name])) {
                        delete h[field.name];
                    }
                }
                if (field.type == 'input' && field.sql_type == 'integer') {
                    h[field.name] = h[field.name].toString().replace(/,/g, '');
                    if (!$dhx.isNumber(h[field.name])) {
                        h[field.name] = 0;
                    }
                }
            });
            return h;
        };
        dhxForm.fill = function(hash) {
            //alert();
            //console.log( hash );
            dhxForm.fields.forEach(function(field) {
                    if (field.type == 'input' && field.mask_to_use == 'br_currency') {
                        if (hash[field.name] === '' || hash[field.name] === null) hash[field.name] = 0;
                        hash[field.name] = Number(parseFloat(hash[field.name])).formatMoney(2, '', '.', ',');
                            //alert(hash[field.name]);
                            //dhxForm.setItemValue(field.name, hash[field.name]);
                    } else if (field.type == 'input' && field.mask_to_use == 'can_currency') {
                        if (hash[field.name] === '' || hash[field.name] === null) hash[field.name] = 0;
                        hash[field.name] = Number(parseFloat(hash[field.name])).formatMoney(2, '', ',', '.');
                            //dhxForm.setItemValue(field.name, hash[field.name]);
                    } else if (field.type == 'input' && field.mask_to_use == 'currency') {
                        if (hash[field.name] === '' || hash[field.name] === null) hash[field.name] = 0;
                        hash[field.name] = Number(parseFloat(hash[field.name])).formatMoney(2, '', ',', '.');
                            //dhxForm.setItemValue(field.name, hash[field.name]);
                    }
                    if (field.type == 'date') {
                        if (hash[field.name] === '' || hash[field.name] === null) delete hash[field.name];
                        //dhxForm.setItemValue(field.name, hash[field.name]);
                    }
                    if (field.type == 'time') {
                        if (hash[field.name] === '' || hash[field.name] === null) delete hash[field.name];
                        //dhxForm.setItemValue(field.name, hash[field.name]);
                    }
                });
                //console.log( hash );
            dhxForm.setFormData(hash);
            dhxForm.fields.forEach(function(field) {
                if (field.type == 'btn2state' || field.type == 'checkbox') {
                    if (typeof hash[field.name] == 'undefined') dhxForm.uncheckItem(field.name);
                    else if (hash[field.name] == 1) dhxForm.checkItem(field.name);
                    else if (hash[field.name] == '1') dhxForm.checkItem(field.name);
                    else dhxForm.uncheckItem(field.name);
                } else if (field.type == 'combo' && field.comboType == 'checkbox') {
                    var combo = dhxForm.getCombo(field.name);
                    hash[field.name] = hash[field.name] || '';
                    if (hash[field.name] !== '') {
                        var array = hash[field.name].split(', ');
                        combo.forEachOption(function(optObj) {
                            if (optObj.value !== "") {
                                if (array.contains(optObj.value)) {
                                    combo.setChecked(optObj.index, true);
                                }
                            }
                        });
                    }
                }
            });
        };
        dhxForm.on = function(ev, fn) {
            if (ev == 'change') {
                dhxForm.attachEvent("onChange", function(name, value, state) {});
            }
        };
        return dhxForm;
    },
    toolbar: function(c) {
        var dhxToolbar = null,
            self = this,
            that = $dhx.component;
        if (!that.checkCommomConfiguration(c, 'toolbar')) {
            return;
        }
        if (typeof c.parent == 'string') {
            c.settings.parent = c.parent;
            dhxToolbar = new dhtmlXToolbarObject(c.settings);
        } else {
            delete c.settings.parent;
            dhxToolbar = c.parent.attachToolbar(c.settings);
        }
        if (c.iconSize) {
            dhxToolbar.setIconSize(parseInt(c.iconSize));
        }
        return dhxToolbar;
    },
    menu: function(c) {
        var dhxMenu = null,
            self = this,
            that = $dhx.component;
        if (!that.checkCommomConfiguration(c, 'menu')) {
            return;
        }
        if (typeof c.parent == 'string') {
            c.settings.parent = c.parent;
            dhxMenu = new dhtmlXMenuObject(c.settings);
        } else {
            delete c.settings.parent;
            dhxMenu = c.parent.attachMenu(c.settings);
        }
        return dhxMenu;
    },
    tree: function(c) {
        var dhxTree = null,
            self = this,
            that = $dhx.component,
            width = c.width ? width : '100%',
            height = c.height ? c.height : '100%',
            rootId = c.rootId ? c.rootId : 0;
        if (typeof c.parent == 'string') {
            dhxTree = dhtmlXTreeObject(c.parent, width, height, rootId);
        } else {
            dhxTree = c.parent.attachTree();
        }
        if (c.setImagePath) {
            dhxTree.setImagePath(c.setImagePath);
        }
        if (c.enableDragAndDrop) {
            dhxTree.enableDragAndDrop(true);
        }
        if (c.setDragBehavior) {
            dhxTree.setDragBehavior('complex');
        }
        if (c.enableItemEditor) {
            dhxTree.enableItemEditor(true);
        }
        //alert(c.enableKeyboardNavigation);
        if (c.enableKeyboardNavigation) {
            //dhxTree.enableKeyboardNavigation(true);
            // pro only
        }
        //console.log(dhxTree);	
        return dhxTree;
    },
    grid: function(c) {
        var dhxGrid = null,
            self = this,
            that = $dhx.component;
        if (!that.checkCommomConfiguration(c, 'toolbar')) {
            return;
        }
        if (typeof c.parent == 'string') {
            dhxGrid = new dhtmlXGridObject(c.parent);
        } else {
            delete c.settings.parent;
            dhxGrid = c.parent.attachGrid(c.settings);
        }
        if (c.settings.header) dhxGrid.setHeader($dhx.isArray(c.settings.header) ? c.settings.header.join(',') : c.settings.header);
        if (c.settings.id) dhxGrid.setColumnIds($dhx.isArray(c.settings.id) ? c.settings.id.join(',') : c.settings.id);
        if (c.settings.width) dhxGrid.setInitWidths($dhx.isArray(c.settings.width) ? c.settings.width.join(',') : c.settings.width);
        if (c.settings.align) dhxGrid.setColAlign($dhx.isArray(c.settings.align) ? c.settings.align.join(',') : c.settings.align);
        if (c.settings.type) dhxGrid.setColTypes($dhx.isArray(c.settings.type) ? c.settings.type.join(',') : c.settings.type);
        if (c.settings.sorting) dhxGrid.setColSorting($dhx.isArray(c.settings.sorting) ? c.settings.sorting.join(',') : c.settings.sorting);
        //myGrid.registerCList(2,["Stephen King","John Grisham","Honore de Balzac"]);	
        dhxGrid.setDateFormat("%Y-%m-%d", "%Y-%m-%d");
        if (c.beforeInit) c.beforeInit();
        dhxGrid.init();
        return dhxGrid;
    }
};