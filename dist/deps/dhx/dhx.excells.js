/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */
(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
$dhx.excells = $dhx.excells || {
    env: window,
    init: function() {
        var self = $dhx.excells;
        // US
        self.env.eXcell_UScurrency = self.us.currency;
        self.env.eXcell_UScurrency.prototype = new eXcell();
        self.env.eXcell_ssn = self.us.ssn;
        self.env.eXcell_ssn.prototype = new eXcell();
        self.env.eXcell_USphone = self.us.phone;
        self.env.eXcell_USphone.prototype = new eXcell();
        // BR
        self.env.eXcell_BRcurrency = self.br.currency;
        self.env.eXcell_BRcurrency.prototype = new eXcell();
        self.env.eXcell_BRphone = self.br.phone;
        self.env.eXcell_BRphone.prototype = new eXcell();
        self.env.eXcell_cep = self.br.cep;
        self.env.eXcell_cep.prototype = new eXcell();
        self.env.eXcell_cpf = self.br.cpf;
        self.env.eXcell_cpf.prototype = new eXcell();
        self.env.eXcell_cnpj = self.br.cnpj;
        self.env.eXcell_cnpj.prototype = new eXcell();
        // GENERAL
        self.env.eXcell_integer = self.numbers.integer;
        self.env.eXcell_integer.prototype = new eXcell();
        self.env.eXcell_time = self.numbers.time;
        self.env.eXcell_time.prototype = new eXcell();
    },
    numbers: {
        integer: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || 0;
                this.setCValue(parseInt(val));
            };
            this.getValue = function() {
                    return this.cell.innerHTML;
            };
                //this.setValue = function (val) {
                //	this.setCValue(val);
                //}
                //this.getValue = function () {
                //	return this.cell.innerHTML; 
                //}
            this.edit = function() {
                this.input_id = 'eXcell_integer.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='10' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.integer(this);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        time: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '00:00:00';
                if (val.toString().split(' ').length == 2) val = val.toString().split(' ')[1];
                this.setCValue("<span>" + val + "</span><span> h</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_time.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='8' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.time(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        }
    },
    br: {
        currency: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || 0;
                if (val.toString().split(',').length == 2 && val.toString().split('.').length == 1) {
                    val = val.toString().replace(/\./g, '');
                    val = val.toString().replace(/,/g, '.');
                } else if (val.toString().split(',').length == 2 && val.toString().split('.').length == 2) {
                    var index_comma = val.indexOf(',');
                    var index_dot = val.indexOf('.');
                    if (index_dot < index_comma) {
                        val = val.toString().replace(/\./g, '');
                        val = val.toString().replace(/,/g, '.');
                    }
                } else if (val.toString().split(',').length == 2 && val.toString().split('.').length > 2) {
                    val = val.toString().replace(/\./g, '');
                    val = val.toString().replace(/,/g, '.');
                } else {
                    val = val.toString().replace(/,/g, "");
                }
                this.setCValue("<span>R$ </span><span>" + Number(parseFloat(+val)).formatMoney(2, '', '.', ',') + "</span>", val);
            };
            this.getValue = function() {
                var val = this.cell.childNodes[1].innerHTML;
                val = val.toString().replace(/\./g, '');
                val = val.toString().replace(/,/g, '.');
                return val;
            };
            this.edit = function() {
                this.input_id = 'eXcell_BRcurrency.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='34' type='text' id='" + this.input_id + "' style='width:100%;'>";
                $dhx.ui.form.input.mask.currency(document.getElementById(this.input_id), {
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: '',
                    suffixUnit: '',
                    zeroCents: false
                });
                this.val = this.val || 0;
                this.val = this.val.replace(/./g, '');
                this.val = this.val.replace(/,/g, '.');
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        phone: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_BRphone.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='16' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.br_phone(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        cpf: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_cpf.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='14' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.cpf(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        cnpj: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_cnpj.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='18' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.cnpj(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        cep: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_cep.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='9' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.cep(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        }
    },
    us: {
        currency: function(cell) { //excell name is defined here
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || 0;
                this.setCValue("<span>USD </span><span>" + Number(parseFloat(val.toString().replace(/,/g, ""))).formatMoney(2, '', ',', '.') + "</span>", val);
            };
            this.getValue = function() {
                var val = this.cell.childNodes[1].innerHTML;
                //val = val.toString().replace(/\./g,'');
                val = val.toString().replace(/,/g, '');
                return val;
            };
            this.edit = function() {
                this.input_id = 'eXcell_UScurrency.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='34' type='text' id='" + this.input_id + "' style='width:100%;'>";
                $dhx.ui.form.input.mask.currency(document.getElementById(this.input_id), {
                    precision: 2,
                    separator: '.',
                    delimiter: ',',
                    unit: '',
                    suffixUnit: '',
                    zeroCents: false
                });
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        phone: function() {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_USphone.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='13' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.us_phone(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        },
        ssn: function(cell) {
            if (cell) {
                this.cell = cell;
                this.grid = this.cell.parentNode.grid;
            }
            this.setValue = function(val) {
                val = val || '';
                this.setCValue("<span>" + val + "</span>", val);
            };
            this.getValue = function() {
                return this.cell.childNodes[0].innerHTML;
            };
            this.edit = function() {
                this.input_id = 'eXcell_ssn.' + window.dhx4.newId();
                this.val = this.getValue();
                this.cell.innerHTML = "<input maxlength='11' type='text' id='" + this.input_id + "' style='width:100%;'>";
                document.getElementById(this.input_id).onkeydown = function(e) {
                    $dhx.ui.form.input.mask.ssn(this, e);
                };
                this.cell.firstChild.value = this.val;
                this.cell.childNodes[0].onclick = function(e) {
                    (e || event).cancelBubble = true;
                };
            };
            this.detach = function() {
                this.setValue(this.cell.childNodes[0].value);
                return this.val != this.getValue();
            };
        }
    }
};