/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */
(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
$dhx.ui.form = $dhx.ui.form || {
    setInputHighlighted: function(field, DHTMLXForm) {
        var name = field.name,
            type = field.type;
        //$dhx.debug.log( field );
        //var associated_label = field.associated_label || false;
        // these if / else is just for highlightning the formfield which should be filled
        if (type == "combo") {
            var fcombo = DHTMLXForm.getCombo(name);
            fcombo.openSelect();
        } else if (type == "editor") {
            //var feditor = DHTMLXForm.getEditor(name);
        } else if (type == "multiselect") {
            $dhx.ui.form.input.validate.invalid(DHTMLXForm.getSelect(name));
        } else if (type == "select") {
            $dhx.ui.form.input.validate.invalid(DHTMLXForm.getSelect(name));
        } else {
            $dhx.ui.form.input.validate.invalid(DHTMLXForm.getInput(name));
        }
    },
    select: {
        validate: {
            //setSelectInvalid
            invalid: function(objInput) {
                objInput.style.backgroundColor = "#fdafa3";
                objInput.onclick = function() {
                    objInput.style.backgroundColor = "#fff";
                };
            }
        }
    },
    combo: {
        validate: {
            //setSelectInvalid
            invalid: function(combo) {
                var oc = combo.DOMelem.style.backgroundColor;
                var ob = combo.DOMelem.style.borderColor;
                var oi = combo.DOMelem_input.style.backgroundColor;
                combo.DOMelem.style.backgroundColor = '#fdafa3';
                combo.DOMelem.style.borderColor = '#8F0000';
                combo.DOMelem_input.style.backgroundColor = '#fdafa3';
                combo.DOMelem_input.addEventListener('click', function(event) {
                    combo.DOMelem.style.backgroundColor = oc;
                    combo.DOMelem.style.borderColor = ob;
                    combo.DOMelem_input.style.backgroundColor = oi;
                });
                combo.DOMelem_input.addEventListener('change', function(event) {
                    combo.DOMelem.style.backgroundColor = oc;
                    combo.DOMelem.style.borderColor = ob;
                    combo.DOMelem_input.style.backgroundColor = oi;
                });
                combo.openSelect();
            }
        }
    },
    input: {
        validate: {
            //setInputInvalid
            invalid: function(objInput) {
                var original_color = objInput.style.backgroundColor;
                objInput.style.backgroundColor = "#fdafa3";
                objInput.focus();
                objInput.addEventListener('click', function(event) {
                    objInput.style.backgroundColor = original_color;
                });
                objInput.addEventListener('change', function(event) {
                    objInput.style.backgroundColor = original_color;
                });
                objInput.addEventListener('keydown', function(event) {
                    objInput.style.backgroundColor = original_color;
                });
            }
        },
        mask: {
            currency: function(el, settings) {
                settings = settings || false;
                VMasker(el).maskMoney(settings);
            },
            integer: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "");
                    if ($dhx.isNumber(obj.value)) {
                        obj.value = parseInt(obj.value);
                        if (parseInt(obj.value) > 2147483647) {
                            $dhx.ui.form.input.validate.invalid(obj);
                            obj.title = 'value need to be less than 2147483647';
                        }
                    }
                }, 1);
            },
            credit_card: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "");
                    obj.value = obj.value.replace(/(\d{4})(\d)/, "$1-$2");
                    obj.value = obj.value.replace(/(\d{4})(\d)/, "$1-$2");
                    obj.value = obj.value.replace(/(\d{4})(\d)/, "$1-$2");
                }, 1);
            },
            number: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "");
                    if ($dhx.isNumber(obj.value)) {
                        obj.value = obj.value;
                    }
                }, 1);
            },
            cpf: function(obj, evt) {
                evt = evt || event;
                setTimeout(function() {
                    kcode = evt.keyCode;
                    if (kcode == 8) return;
                    if (obj.value.length == 3) {
                        obj.value = obj.value + '.';
                    }
                    if (obj.value.length == 7) {
                        obj.value = obj.value + '.';
                    }
                    if (obj.value.length == 11) {
                        obj.value = obj.value + '-';
                    }
                }, 1);
            },
            cnpj: function(campo, teclapres) {
                teclapres = teclapres || event;
                var tecla = teclapres.keyCode;
                var vr = String(campo.value);
                vr = vr.replace(".", "");
                vr = vr.replace("/", "");
                vr = vr.replace("-", "");
                tam = vr.length + 1;
                if (tecla != 14) {
                    if (tam == 3) campo.value = vr.substr(0, 2) + '.';
                    if (tam == 6) campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 5) + '.';
                    if (tam == 10) campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(6, 3) + '/';
                    if (tam == 15) campo.value = vr.substr(0, 2) + '.' + vr.substr(2, 3) + '.' + vr.substr(6, 3) + '/' + vr.substr(9, 4) + '-' + vr.substr(13, 2);
                }
            },
            cep: function(obj, evt) {
                evt = evt || event;
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
                }, 1);
            },
            us_phone: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "").replace(/^(\d\d\d)(\d)/g, "($1)$2").replace(/(\d{3})(\d)/, "$1-$2");
                }, 1);
            },
            br_phone: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "").replace(/^(\d\d\d)(\d)/g, "($1) $2");
                    //(876) 9983-18663
                    if (obj.value.length == 15) obj.value = obj.value.replace(/(\d{5})(\d)/, "$1-$2");
                    else {
                        obj.value = obj.value.replace(/(\d{4})(\d)/, "$1-$2");
                    }
                }, 1);
            },
            expiration_date: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "").replace(/^(\d\d)(\d)/g, "$1/$2");
                }, 1);
            },
            expiration_date2: function(obj) {
                setTimeout(function() {
                    obj.value = obj.value.replace(/\D/g, "").replace(/^(\d\d)(\d)/g, "$1/$2");
                }, 1);
            },
            ssn: function(obj, evt) {
                evt = evt || event;
                setTimeout(function() {
                    kcode = evt.keyCode;
                    if (kcode == 8) return;
                    if (obj.value.length == 3) {
                        obj.value = obj.value + '-';
                    }
                    if (obj.value.length == 6) {
                        obj.value = obj.value + '-';
                    }
                    //if (obj.value.length == 11) { obj.value = obj.value + '-'; }
                }, 1);
            },
            time: function(obj, e) {
                var returning = 0,
                    event = e,
                    key = null;
                if (document.all) // Internet Explorer
                {
                    key = event.keyCode;
                } else //Outros Browsers
                {
                    key = e.which;
                }
                if (((key >= 96) && (key <= 105)) || ((key >= 48) && (key <= 57))) {
                    returning = 1;
                }
                if ((key == 8) || (key == 9) || (key == 46)) {
                    returning = 2;
                }
                if (returning === 0) {
                    event.returnValue = false;
                }
                if (returning == 1) {
                    if ((obj.value.length == 2) || ((obj.value.length == 5) && (obj.maxLength > 5))) {
                        obj.value = obj.value + ':';
                    }
                }
            }
        }
    }
};
// Copyright © 2015 BankFacil, http://bankfacil.com.br
// MIT license -> http://bankfacil.mit-license.org/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.VMasker = factory();
    }
}(this, function() {
    var DIGIT = "9",
        ALPHA = "A",
        ALPHANUM = "S",
        BY_PASS_KEYS = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
        isAllowedKeyCode = function(keyCode) {
            for (var i = 0, len = BY_PASS_KEYS.length; i < len; i++) {
                if (keyCode == BY_PASS_KEYS[i]) {
                    return false;
                }
            }
            return true;
        },
        mergeMoneyOptions = function(opts) {
            opts = opts || {};
            opts = {
                precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
                separator: opts.separator || ",",
                delimiter: opts.delimiter || ".",
                unit: opts.unit && (opts.unit.replace(/[\s]/g, '') + " ") || "",
                suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g, '')) || "",
                zeroCents: opts.zeroCents,
                lastOutput: opts.lastOutput
            };
            opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
            return opts;
        },
        // Fill wildcards past index in output with placeholder
        addPlaceholdersToOutput = function(output, index, placeholder) {
            for (; index < output.length; index++) {
                if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
                    output[index] = placeholder;
                }
            }
            return output;
        };
    var VanillaMasker = function(elements) {
        this.elements = elements;
    };
    VanillaMasker.prototype.unbindElementToMask = function() {
        for (var i = 0, len = this.elements.length; i < len; i++) {
            this.elements[i].lastOutput = "";
            this.elements[i].onkeyup = false;
            this.elements[i].onkeydown = false;
            if (this.elements[i].value.length) {
                this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
            }
        }
    };
    VanillaMasker.prototype.bindElementToMask = function(maskFunction) {
        var that = this,
            onType = function(e) {
                e = e || window.event;
                var source = e.target || e.srcElement;
                if (isAllowedKeyCode(e.keyCode)) {
                    setTimeout(function() {
                        that.opts.lastOutput = source.lastOutput;
                        source.value = VMasker[maskFunction](source.value, that.opts);
                        source.lastOutput = source.value;
                        if (source.setSelectionRange && that.opts.suffixUnit) {
                            source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
                        }
                    }, 0);
                }
            };
        for (var i = 0, len = this.elements.length; i < len; i++) {
            this.elements[i].lastOutput = "";
            this.elements[i].onkeyup = onType;
            if (this.elements[i].value.length) {
                this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
            }
        }
    };
    VanillaMasker.prototype.maskMoney = function(opts) {
        this.opts = mergeMoneyOptions(opts);
        this.bindElementToMask("toMoney");
    };
    VanillaMasker.prototype.maskNumber = function() {
        this.opts = {};
        this.bindElementToMask("toNumber");
    };
    VanillaMasker.prototype.maskAlphaNum = function() {
        this.opts = {};
        this.bindElementToMask("toAlphaNumeric");
    };
    VanillaMasker.prototype.maskPattern = function(pattern) {
        this.opts = {
            pattern: pattern
        };
        this.bindElementToMask("toPattern");
    };
    VanillaMasker.prototype.unMask = function() {
        this.unbindElementToMask();
    };
    var VMasker = function(el) {
        if (!el) {
            throw new Error("VanillaMasker: There is no element to bind.");
        }
        var elements = ("length" in el) ? (el.length ? el : []) : [el];
        return new VanillaMasker(elements);
    };
    VMasker.toMoney = function(value, opts) {
        opts = mergeMoneyOptions(opts);
        if (opts.zeroCents) {
            opts.lastOutput = opts.lastOutput || "";
            var zeroMatcher = ("(" + opts.separator + "[0]{0," + opts.precision + "})"),
                zeroRegExp = new RegExp(zeroMatcher, "g"),
                digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
                lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0;
            value = value.toString().replace(zeroRegExp, "");
            if (digitsLength < lastDigitLength) {
                value = value.slice(0, value.length - 1);
            }
        }
        var number = value.toString().replace(/[\D]/g, ""),
            clearDelimiter = new RegExp("^(0|\\" + opts.delimiter + ")"),
            clearSeparator = new RegExp("(\\" + opts.separator + ")$"),
            money = number.substr(0, number.length - opts.moneyPrecision),
            masked = money.substr(0, money.length % 3),
            cents = new Array(opts.precision + 1).join("0");
        money = money.substr(money.length % 3, money.length);
        for (var i = 0, len = money.length; i < len; i++) {
            if (i % 3 === 0) {
                masked += opts.delimiter;
            }
            masked += money[i];
        }
        masked = masked.replace(clearDelimiter, "");
        masked = masked.length ? masked : "0";
        if (!opts.zeroCents) {
            var beginCents = number.length - opts.precision,
                centsValue = number.substr(beginCents, opts.precision),
                centsLength = centsValue.length,
                centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength;
            cents = (cents + centsValue).slice(-centsSliced);
        }
        var output = opts.unit + masked + opts.separator + cents + opts.suffixUnit;
        return output.replace(clearSeparator, "");
    };
    VMasker.toPattern = function(value, opts) {
        var pattern = (typeof opts === 'object' ? opts.pattern : opts),
            patternChars = pattern.replace(/\W/g, ''),
            output = pattern.split(""),
            values = value.toString().replace(/\W/g, ""),
            charsValues = values.replace(/\W/g, ''),
            index = 0,
            i,
            outputLength = output.length,
            placeholder = (typeof opts === 'object' ? opts.placeholder : undefined);
        for (i = 0; i < outputLength; i++) {
            // Reached the end of input
            if (index >= values.length) {
                if (patternChars.length == charsValues.length) {
                    return output.join("");
                } else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
                    return addPlaceholdersToOutput(output, i, placeholder).join("");
                } else {
                    break;
                }
            }
            // Remaining chars in input
            else {
                if ((output[i] === DIGIT && values[index].match(/[0-9]/)) || (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) || (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
                    output[i] = values[index++];
                } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
                    if (placeholder !== undefined) {
                        return addPlaceholdersToOutput(output, i, placeholder).join("");
                    } else {
                        return output.slice(0, i).join("");
                    }
                }
            }
        }
        return output.join("").substr(0, i);
    };
    VMasker.toNumber = function(value) {
        return value.toString().replace(/(?!^-)[^0-9]/g, "");
    };
    VMasker.toAlphaNumeric = function(value) {
        return value.toString().replace(/[^a-z0-9 ]+/i, "");
    };
    return VMasker;
}));