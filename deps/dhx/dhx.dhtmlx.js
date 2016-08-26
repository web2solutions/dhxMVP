/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */

(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});

$dhx.dhtmlx = $dhx.dhtmlx || {
    grid: {
        // format json elements as grid payload
		formatData: function(primary_key, data) {
            var rows = [];
            if (typeof data !== 'undefined') data.forEach(function(row, index, array) {
                var obj = {};
                for (var i in row)
                    if (row.hasOwnProperty(i)) obj[i] = row[i];
                rows.push({
                    id: obj[primary_key],
                    data: obj.data
                });
            });
            return {
                rows: rows
            };
        }
    },
    /*form  validation*/
    formFields: [],
    formFields_tofill: [],
    formFields_filled: [],
    
    getFormFields: function(form_id) {
        var self = $dhx.dhtmlx;
		//console.log(self.formFields[form_id]);
        if (typeof self.formFields[form_id] !== 'undefined')
		{
			 return self.formFields[form_id];
			 
		}
        else return [];
    },
    prepareForm: function(formID, JSONformConfiguration, DHTMLXForm) {
        var self = $dhx.dhtmlx;
        self.formFields[formID] = []; // clean the array of formFields
        self.formFields_tofill[formID] = 0;
        self._setFormFieldsToBind(JSONformConfiguration.template, formID);
        self._setFormMasks(formID, DHTMLXForm);
    },
	
	unPrepareForm: function(formID) {
		var self = $dhx.dhtmlx;
        delete self.formFields[formID];
		delete self.formFields_tofill[formID];
		delete self.formFields_filled[formID];
    },
	
    _setFormFieldsToBind: function(json, formID, appended_on_the_fly) {
        var self = $dhx.dhtmlx;
        // iterates over all items of the form's JSON
        //console.log(json.length);
        //console.log(json);
        try {
            for (var x = 0; x < json.length; x++) {
                json[x] = json[x] || {};
                var formField = json[x];
                //console.log(formField);
                // catch the type of the item
                try {
                    formField.type = formField.type || "button";
                } catch (e) {
                    //console.log('formField.type = formField.type || "button" : ' + e.stack || e.message);
                    //console.log(formField);
                }
                var type = formField.type;
                //var type = formField.type || "";
                //console.log(type);
                // if the item has one of each following type, we'll discard it
                if (type == "newcolumn" || type == "settings" || type == "button") {
                    continue; // discard the item
                }
                try {
                    if (typeof self.formFields[formID] === 'undefined') {
                        self.formFields[formID] = [];
                    }
                } catch (e) {
                    //console.log("if(! self.formFields[ formID ]) === " + e.stack || e.message);
                }
                // if the item has a "block" type, we need to catch the items inside of the list property of the block
                if (type == "block") {
                    if (appended_on_the_fly) {
                        self._setFormFieldsToBind(formField.list, formID, true); // use this same function to catch the items inside of the list
                    } else {
                        self._setFormFieldsToBind(formField.list, formID); // use this same function to catch the items inside of the list
                    }
                } else if (type == "label" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self._setFormFieldsToBind(formField.list, formID, true); // use this same function to catch the items inside of the list
                    } else {
                        self._setFormFieldsToBind(formField.list, formID); // use this same function to catch the items inside of the list
                    }
                    //}
                } else if (type == "checkbox" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self.formFields[formID].unshift(formField);
                        self.formFields_tofill[formID] = self.formFields_tofill[formID] + 1;
                        self._setFormFieldsToBind(formField.list, formID, true); // use this same function to catch the items inside of the list
                    } else {
                        self.formFields[formID].push(formField);
                        self.formFields_tofill[formID] = self.formFields_tofill[formID] + 1;
                        self._setFormFieldsToBind(formField.list, formID); // use this same function to catch the items inside of the list
                    }
                    //}
                } else if (type == "fieldset" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self.formFields[formID].unshift(formField);
                        self.formFields_tofill[formID] = self.formFields_tofill[formID] + 1;
                        self._setFormFieldsToBind(formField.list, formID, true); // use this same function to catch the items inside of the list
                    } else {
                        self.formFields[formID].push(formField);
                        self.formFields_tofill[formID] = self.formFields_tofill[formID] + 1;
                        self._setFormFieldsToBind(formField.list, formID); // use this same function to catch the items inside of the list
                    }
                    //console.log(" fieldset ");
                    //}
                }
                // if not, we push the formfield into the self.formFields[ formID ] array
                else {
                    if (appended_on_the_fly) {
                        self.formFields[formID].unshift(formField);
                        //console.log("unshift")
                    } else {
                        self.formFields[formID].push(formField);
                        //console.log("push")
                    }
                    self.formFields_tofill[formID] = self.formFields_tofill[formID] + 1;
                }
            }
        } catch (e) {
            //console.log("_setFormFieldsToBind method " + e.stack || e.message);
        }
    },
    setCursor: function() {
        if (this.createTextRange) {
            var part = this.createTextRange();
            this.move("character", this.value.length);
            this.select();
        } else if (this.setSelectionRange) {
            this.setSelectionRange(this.value.length, this.value.length);
        }
        this.focus();
    },
    inputIntegerHandler: function(event) {
        $dhx.ui.form.input.mask.integer(this);
    },
    inputNumberHandler: function(event) {
        $dhx.ui.form.input.mask.number(this);
    },
    inputCreditCardHandler: function(event) {
        $dhx.ui.form.input.mask.credit_card(this);
    },
    inputUsPhoneHandler: function(event) {
        $dhx.ui.form.input.mask.us_phone(this);
    },
    inputBrPhoneHandler: function(event) {
        $dhx.ui.form.input.mask.br_phone(this);
    },
    inputExpirationDateHandler: function(event) {
        $dhx.ui.form.input.mask.expiration_date(this);
    },
    inputTimeHandler: function(event) {
        $dhx.ui.form.input.mask.time(this, event);
    },
    inputSSNHandler: function(event) {
        $dhx.ui.form.input.mask.ssn(this);
    },
    inputCEPandler: function(event) {
        $dhx.ui.form.input.mask.cep(this);
    },
    inputCPFandler: function(event) {
        $dhx.ui.form.input.mask.cpf(this);
    },
    inputCNPJandler: function(event) {
        $dhx.ui.form.input.mask.cnpj(this);
    },
    _setFormMasks: function(formID, DHTMLXForm) {
        var self = $dhx.dhtmlx;
        //console.log(self.formFields[ formID ]);
        for (var x = 0; x < self.formFields[formID].length; x++) {
            var field = self.formFields[formID][x];
            // check if the item has a name. Lets assume that all the fields which should be validate has a name
            if (field.name) {
                var mask_to_use, name, type, id = null;
                mask_to_use = field.mask_to_use || "";
                //console.log(mask_to_use);
                if (typeof field.type === 'undefined') {
                    field.type = "";
                }
                type = field.type || "";
                name = field.name || "";
                if (type == "input") 
				{
                    if (mask_to_use == "currency") {
						try {
							id = DHTMLXForm.getInput(name).id;
						} catch (e) {
							id = DHTMLXForm.getInput(name).getAttribute("id");
						}
						$dhx.ui.form.input.mask.currency(document.getElementById(id), {
						  precision: 2,
						  separator: '.',
						  delimiter: ',',
						  unit: '',
						  suffixUnit: '',
						  zeroCents: false
						});

                        DHTMLXForm.getInput(name).addEventListener('keydown', self.setCursor);

                        DHTMLXForm.getInput(name).addEventListener('keyup', self.setCursor);

                        DHTMLXForm.getInput(name).addEventListener('click', self.setCursor);

						DHTMLXForm.getInput(name).maxLength = "34";
					} else if (mask_to_use == "can_currency") {
						try {
							id = DHTMLXForm.getInput(name).id;
						} catch (e) {
							id = DHTMLXForm.getInput(name).getAttribute("id");
						}
						$dhx.ui.form.input.mask.currency(document.getElementById(id), {
						  precision: 2,
						  separator: '.',
						  delimiter: ',',
						  unit: 'CAN ',
						  suffixUnit: '',
						  zeroCents: false
						});
						DHTMLXForm.getInput(name).maxLength = "34";
					}else if (mask_to_use == "br_currency") {
						try {
							id = DHTMLXForm.getInput(name).id;
						} catch (e) {
							id = DHTMLXForm.getInput(name).getAttribute("id");
						}
						$dhx.ui.form.input.mask.currency(document.getElementById(id), {
						  precision: 2,
						  separator: ',',
						  delimiter: '.',
						  unit: '',
						  suffixUnit: '',
						  zeroCents: false
						});
						DHTMLXForm.getInput(name).maxLength = "34";
					} else if (mask_to_use == "integer") {
                        DHTMLXForm.getInput(name).addEventListener("keydown", self.inputIntegerHandler);
                        DHTMLXForm.getInput(name).maxLength = "10";
                    }else if (mask_to_use == "ip") {
                        
                        // <input type="text" data-inputmask="'alias': 'customAlias'" />
                        DHTMLXForm.getInput(name).setAttribute('data-inputmask', "'alias': 'ip'");

                        Inputmask().mask( DHTMLXForm.getInput(name) );

                    }else if (mask_to_use == "universal_phone") {
                        
                        // <input type="text" data-inputmask="'alias': 'customAlias'" />
                        DHTMLXForm.getInput(name).setAttribute('data-inputmask', "'alias': 'phone'");

                        Inputmask().mask( DHTMLXForm.getInput(name) );

                    }else if (mask_to_use == "email") {
                        
                        // <input type="text" data-inputmask="'alias': 'customAlias'" />
                        DHTMLXForm.getInput(name).setAttribute('data-inputmask', "'alias': 'email'");

                        Inputmask().mask( DHTMLXForm.getInput(name) );

                    }else if (mask_to_use == "number") {
                        DHTMLXForm.getInput(name).addEventListener("keydown", self.inputNumberHandler);
                    }else if (mask_to_use == "credit_card") {
                        DHTMLXForm.getInput(name).addEventListener("keydown", self.inputCreditCardHandler);
                        DHTMLXForm.getInput(name).maxLength = "19";
                    } else if (mask_to_use == "us_phone") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputUsPhoneHandler);
						DHTMLXForm.getInput(name).maxLength = "13";
					}else if (mask_to_use == "br_phone") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputBrPhoneHandler);
						DHTMLXForm.getInput(name).maxLength = "16";
					} else if (mask_to_use == "expiration_date") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputExpirationDateHandler);
						DHTMLXForm.getInput(name).maxLength = "5";
					} else if (mask_to_use == "cvv") {
                        DHTMLXForm.getInput(name).addEventListener("keydown", self.inputIntegerHandler);
						DHTMLXForm.getInput(name).maxLength = "4";
					} /*else if (mask_to_use == "credit_card") {
						DHTMLXForm.getInput(name).onkeydown = function(event) {
							$dhx.ui.form.input.mask.integer(this);
						};
						DHTMLXForm.getInput(name).maxLength = "16";
					}*/ else if (mask_to_use == "time") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputTimeHandler);
						DHTMLXForm.getInput(name).maxLength = "8";
					} else if (mask_to_use == "SSN") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputSSNHandler);
						DHTMLXForm.getInput(name).maxLength = "11";
					}else if (mask_to_use == "CEP") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputCEPHandler);
						DHTMLXForm.getInput(name).maxLength = "9";
					}else if (mask_to_use == "CPF") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputCPFHandler);
						DHTMLXForm.getInput(name).maxLength = "14";
					}else if (mask_to_use == "CNPJ") {
						DHTMLXForm.getInput(name).addEventListener("keydown", self.inputCNPJandler);
						DHTMLXForm.getInput(name).maxLength = "18";
					}
                }
				else  if (type == "calendar") {
                    if (mask_to_use == "time") {
						//alert();
						var dhxCalendar = DHTMLXForm.getCalendar(name);
						DHTMLXForm.setCalendarDateFormat(name, "%H:%i:%s", "%H:%i:%s");
						dhxCalendar.showTime();
					}
                }
				else {
                    continue;
                }
                
            } // END - check if the item has a name.
        } // END FOR
    },
    getFormItem: function(name, formID) {
        var self = $dhx.dhtmlx;
        if (self.formFields[formID] === undefined) {
            return false;
        }
        for (var x = 0; x < self.formFields[formID].length; x++) {
            var field = self.formFields[formID][x];
            if (field.name == name) {
                return field;
            }
        }
        return false;
    },
    getFormDataAsPayload: function(formID, DHTMLXForm) {
        var self = $dhx.dhtmlx,
            hash = DHTMLXForm.getFormData(),
            payload = "";
        for (var formfield in hash) {
            payload = payload + formfield + "=" + encodeURIComponent(hash[formfield]) + "&";
        }
        if (payload === "") return null;
        if (payload.charAt(payload.length - 1) == '&') payload = payload.substr(0, payload.length - 1);
        return payload;
    },
    validateForm: function(formID, DHTMLXForm) {
		//alert(11111);
        var self = $dhx.dhtmlx,
            hash;
        hash = DHTMLXForm.getFormData();
        for (var fieldname in hash) {
            if (hash.hasOwnProperty(fieldname)) {
                //console.log(DHTMLXForm.getForm())
                // check if the item has a name. Lets assume that all the fields which should be validate has a name
                var field = self.getFormItem(fieldname, formID);
                if (!field) {
                    continue;
                }
                if (field.name) {
                    //console.log(field.name);
                    var name, type, value, validate, label;
                    name = field.name;
                    type = field.type || "";
                    label = field.label || "";
                    try {
                        value = DHTMLXForm.getInput(fieldname).value;
                    } catch (e) {
						
						if(type == 'btn2state')
						{
							value = DHTMLXForm.isItemChecked(fieldname);
						}
						else if(type == 'checkbox')
						{
							value = DHTMLXForm.isItemChecked(fieldname) ? 1 : 0;
						}
						else if(type == 'combo')
						{
							var fcombo = DHTMLXForm.getCombo(fieldname);
							value = fcombo.getSelectedValue() ? fcombo.getSelectedValue() : fcombo.getChecked().length > 0 ? fcombo.getChecked() : '';
						}
						else
						{
							value = hash[fieldname] || "";
						}
                    }
                    validate = field.validate || "";
					
					
					//console.log(fieldname, validate);
					
                    //console.log(validate);
                    //==== DO the validations
                    // if the value is not valid, the function will returns, terminating the execution
                    //==== NotEmpty validation
                    var NotEmpty = validate.toString().match("NotEmpty");
                    if (NotEmpty == "NotEmpty") {
                        value = value || '';
                        if (value.toString().length < 1) {
                            $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                            dhtmlx.message({
                                type: "error",
                                text: $dhx.ui.language.text_labels.validation_notEmpty(label)
                            }); //
                            return;
                        }
                    }
                    var Empty = validate.toString().match("Empty");
                    if (Empty == "Empty" && NotEmpty != "NotEmpty") {
                        // if the value have not a lenght > 0
                        if (value.toString().length > 0) {
                            $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                            dhtmlx.message({
                                type: "error",
                                text: $dhx.ui.language.text_labels.validation_Empty(label)
                            });
                            return;
                        }
                    }
                    var ValidEmail = validate.toString().match("ValidEmail");
                    if (ValidEmail == "ValidEmail") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidEmail(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidInteger = validate.toString().match("ValidInteger");
                    if (ValidInteger == "ValidInteger") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^\d+$/)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidInteger(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidFloat = validate.toString().match("ValidFloat");
                    if (ValidFloat == "ValidFloat") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^\d+\.\d+$/)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidFloat(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidNumeric = validate.toString().match("ValidNumeric");
                    if (ValidNumeric == "ValidNumeric") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(value)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidNumeric(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidAplhaNumeric = validate.toString().match("ValidAplhaNumeric");
                    if (ValidAplhaNumeric == "ValidAplhaNumeric") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^[0-9a-z]+$/)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidAplhaNumeric(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidDatetime = validate.toString().match("ValidDatetime");
                    if (ValidDatetime == "ValidDatetime") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(Date.parse(value))) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidDatetime(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidDate = validate.toString().match("ValidDate");
                    if (ValidDate == "ValidDate") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(Date.parse(value))) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidDate(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidTime = validate.toString().match("ValidTime");
                    if (ValidTime == "ValidTime") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            var matchArray = value.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);
                            if (matchArray === null) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                });
                                return;
                            }
                            if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
                                if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
                                    $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                    });
                                    return;
                                }
                            } else {
                                if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
                                    $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    var ValidCurrency = validate.toString().match("ValidCurrency");
                    if (ValidCurrency == "ValidCurrency") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
							
							if( value.indexOf(',') != -1  )
								value = value.replace(/,/g,'');
                            
							
							if (!/^\d+(?:\.\d{0,2})$/.test(value)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidCurrency(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidSSN = validate.toString().match("ValidSSN");
                    if (ValidSSN == "ValidSSN") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
							
							
							// return a.toString().match(/^\d{3}\-?\d{2}\-?\d{4}$/) && true || false
							
                            if (!value.match(/^\d{3}\-?\d{2}\-?\d{4}$/)) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidSSN(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidExpirationdate = validate.toString().match("ValidExpirationdate");
                    if (ValidExpirationdate == "ValidExpirationdate") {
                        // if the value have not a lenght > 0  00/00
                        if (value.length > 0) {
                            if (value.length != 5) {
                                $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                });
                                return;
                            } else {
                                var month = value.split("/")[0];
                                var year = value.split("/")[1];
                                if (isNaN(month) || isNaN(year)) {
                                    $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                                if (!(month > 0 && month < 13)) {
                                    $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                                if (!(year > 0 && year < 99)) {
                                    $dhx.ui.form.setInputHighlighted(field, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                            }
                        }
                    }
                } // end if have name
            }
        } // end for
        return true;
    }
};
