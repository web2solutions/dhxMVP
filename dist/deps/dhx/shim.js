/* jshint -W024 */
/* jshint expr:true */
var splash_base64 = "",
    loading_gif = "data:image/gif;base64,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";

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this === null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| 
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal 
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) 
        //    where Array is the standard built-in constructor with that name and 
        //    len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal 
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal 
                //    method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal 
                //     method of callback with T as the this value and argument 
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/ ) {
        'use strict';
        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this),
            len = t.length >>> 0,
            k = 0,
            value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.22
// Reference: http://es5.github.io/#x15.4.4.22
if ('function' !== typeof Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function(callback /*, initialValue*/) {
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      throw new TypeError('Array.prototype.reduce called on null or undefined' );
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = len - 1, value;
    if (arguments.length >= 2) {
      value = arguments[1];
    } else {
      while (k >= 0 && !(k in t)) {
        k--;
      }
      if (k < 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k--];
    }
    for (; k >= 0; k--) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisArg*/ ) {
        'use strict';

        if (this === null) {
            throw new TypeError('Array.prototype.some called on null or undefined');
        }

        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}


if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        'use strict';
        var T, k;

        if (this === null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the this 
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method
        //    of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal 
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method
                //    of O with argument Pk.
                kValue = O[k];

                // ii. Let testResult be the result of calling the Call internal method
                //     of callbackfn with T as the this value and argument list 
                //     containing kValue, k, and O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. If ToBoolean(testResult) is false, return false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}

Array.prototype.dataCount = function() {
    'use strict';
    return this.length;
};
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, thisArg) {
        var T, k;
        if (this === null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (Object.prototype.hasOwnProperty.call(O, k)) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!Array.prototype.contains) {
    Array.prototype.contains = function(value) {
        for (var p = 0; p < this.length; p++) {
            if (this[p] === value) return true;
        }
        return false;
    };
}

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

String.prototype.CFC = function() {
    return '<u>' + this.charAt(0).toUpperCase() + '</u>' + this.slice(1);
};
String.prototype.soundex = function(p) {
    var i, j, l,
        m = {
            BFPV: 1,
            CGJKQSXZ: 2,
            DT: 3,
            L: 4,
            MN: 5,
            R: 6
        },
        r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
    p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p;
    for (i = -1, l = s.length; ++i < l;)
        for (j in m)
            if (j.indexOf(s[i]) + 1 && r[r.length - 1] != m[j] && r.push(m[j])) break;
    return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
};
if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}
String.prototype.realToDouble = function() {
    var value = this;
    value = value.replace(/\D/g, "");
    value = +value / 100;
    return value.toFixed(2);
};


/*String.prototype.extenso = function(c) {
    var ex = [
        ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
        ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"],
        ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
        ["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
    ];
    var a, v, i, n = this.replace(c ? /[^,\d]/g : /\D/g, "").split(","),
        e = " e ",
        $ = "real",
        d = "centavo",
        sl;
    for (var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []) {
        j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
        if (!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
        for (a = -1, l = v.length; ++a < l; t = "") {
            if (!(i = v[a] * 1)) continue;
            i % 100 < 20 && (t += ex[0][i % 100]) || i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
            s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) + ((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
        }
        a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
        a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
    }
    return r.join(e);
};*/


// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var number = this, 
	    negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
};

Date.prototype.addMinutes = function(h) {    
   this.setTime(this.getTime() + (h*60*1000)); 
   return this;   
};



/*if (!Element.prototype.addEventListener) {
  var oListeners = {};
  function runListeners(oEvent) {
    if (!oEvent) { oEvent = window.event; }
    for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
      if (oEvtListeners.aEls[iElId] === this) {
        for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
        break;
      }
    }
  }
    //Element.prototype.addEventListener = function (sEventType, fListener , useCapture (will be ignored!) )
  Element.prototype.addEventListener = function (sEventType, fListener) {
    if (oListeners.hasOwnProperty(sEventType)) {
      var oEvtListeners = oListeners[sEventType];
      for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
        if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
      }
      if (nElIdx === -1) {
        oEvtListeners.aEls.push(this);
        oEvtListeners.aEvts.push([fListener]);
        this["on" + sEventType] = runListeners;
      } else {
        var aElListeners = oEvtListeners.aEvts[nElIdx];
        if (this["on" + sEventType] !== runListeners) {
          aElListeners.splice(0);
          this["on" + sEventType] = runListeners;
        }
        for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
          if (aElListeners[iLstId] === fListener) { return; }
        }
        aElListeners.push(fListener);
      }
    } else {
      oListeners[sEventType] = { aEls: [this], aEvts: [ [fListener] ] };
      this["on" + sEventType] = runListeners;
    }
  };
    //Element.prototype.removeEventListener = function (sEventType, fListener , useCapture (will be ignored!))
  Element.prototype.removeEventListener = function (sEventType, fListener ) {
    if (!oListeners.hasOwnProperty(sEventType)) { return; }
    var oEvtListeners = oListeners[sEventType];
    for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
      if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
    }
    if (nElIdx === -1) { return; }
    for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
      if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
    }
  };
}
*/

/*======================= BUILD CONSOLE OBJECT ========================*/
// create a noop console object if the browser doesn't provide one ...
if (!window.console) {
    window.console = {};
}
// IE has a console that has a 'log' function but no 'debug'. to make console.debug work in IE,
// we just map the function. (extend for info etc if needed)
else {
    if (!window.console.debug && typeof window.console.log !== 'undefined') {
        window.console.debug = window.console.log;
    }
}
// ... and create all functions we expect the console to have (took from firebug).
var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
for (var i = 0; i < names.length; ++i) {
    if (!window.console[names[i]]) {
        window.console[names[i]] = function() {};
    }
}

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
          unit: opts.unit && (opts.unit.replace(/[\s]/g,'') + " ") || "",
          suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g,'')) || "",
          zeroCents: opts.zeroCents,
          lastOutput: opts.lastOutput
        };
        opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
        return opts;
      },
      // Fill wildcards past index in output with placeholder
      addPlaceholdersToOutput = function(output, index, placeholder) {
        for (; index < output.length; index++) {
          if(output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
            output[index] = placeholder;
          }
        }
        return output;
      }
  ;

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
        }
    ;
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
    this.opts = {pattern: pattern};
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
      var zeroMatcher = ("("+ opts.separator +"[0]{0,"+ opts.precision +"})"),
          zeroRegExp = new RegExp(zeroMatcher, "g"),
          digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
          lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0
      ;
      value = value.toString().replace(zeroRegExp, "");
      if (digitsLength < lastDigitLength) {
        value = value.slice(0, value.length - 1);
      }
    }
    var number = value.toString().replace(/[\D]/g, ""),
        clearDelimiter = new RegExp("^(0|\\"+ opts.delimiter +")"),
        clearSeparator = new RegExp("(\\"+ opts.separator +")$"),
        money = number.substr(0, number.length - opts.moneyPrecision),
        masked = money.substr(0, money.length % 3),
        cents = new Array(opts.precision + 1).join("0")
    ;
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
          centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength
      ;
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
        placeholder = (typeof opts === 'object' ? opts.placeholder : undefined)
    ;
    
    for (i = 0; i < outputLength; i++) {
      // Reached the end of input
      if (index >= values.length) {
        if (patternChars.length == charsValues.length) {
          return output.join("");
        }
        else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
          return addPlaceholdersToOutput(output, i, placeholder).join("");
        }
        else {
          break;
        }
      }
      // Remaining chars in input
      else{
        if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
            (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
            (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
          output[i] = values[index++];
        } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
          if(placeholder !== undefined){
            return addPlaceholdersToOutput(output, i, placeholder).join("");
          }
          else{
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


/*!
 * Object.observe "lite" polyfill - v0.2.4
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/object-observe
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */

// Some type definitions
/**
 * This represents the data relative to an observed object
 * @typedef  {Object}                     ObjectData
 * @property {Map<Handler, HandlerData>}  handlers
 * @property {String[]}                   properties
 * @property {*[]}                        values
 * @property {Notifier}                   notifier
 */
/**
 * Function definition of a handler
 * @callback Handler
 * @param {ChangeRecord[]}                changes
 */
/**
 * This represents the data relative to an observed object and one of its
 * handlers
 * @typedef  {Object}                     HandlerData
 * @property {Map<Object, ObservedData>}  observed
 * @property {ChangeRecord[]}             changeRecords
 */
/**
 * @typedef  {Object}                     ObservedData
 * @property {String[]}                   acceptList
 * @property {ObjectData}                 data
 */
/**
 * Type definition for a change. Any other property can be added using
 * the notify() or performChange() methods of the notifier.
 * @typedef  {Object}                     ChangeRecord
 * @property {String}                     type
 * @property {Object}                     object
 * @property {String}                     [name]
 * @property {*}                          [oldValue]
 * @property {Number}                     [index]
 */
/**
 * Type definition for a notifier (what Object.getNotifier returns)
 * @typedef  {Object}                     Notifier
 * @property {Function}                   notify
 * @property {Function}                   performChange
 */
/**
 * Function called with Notifier.performChange. It may optionally return a
 * ChangeRecord that gets automatically notified, but `type` and `object`
 * properties are overridden.
 * @callback Performer
 * @returns {ChangeRecord|undefined}
 */

Object.observe || (function(O, A, root, _undefined) {
    "use strict";

    /**
     * Relates observed objects and their data
     * @type {Map<Object, ObjectData}
     */
    var observed,
        /**
         * List of handlers and their data
         * @type {Map<Handler, Map<Object, HandlerData>>}
         */
        handlers,

        defaultAcceptList = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];

    // Functions for internal usage

    /**
     * Checks if the argument is an Array object. Polyfills Array.isArray.
     * @function isArray
     * @param {?*} object
     * @returns {Boolean}
     */
    var isArray = A.isArray || (function(toString) {
            return function(object) {
                return toString.call(object) === "[object Array]";
            };
        })(O.prototype.toString),

        /**
         * Returns the index of an item in a collection, or -1 if not found.
         * Uses the generic Array.indexOf or Array.prototype.indexOf if available.
         * @function inArray
         * @param {Array} array
         * @param {*} pivot           Item to look for
         * @param {Number} [start=0]  Index to start from
         * @returns {Number}
         */
        inArray = A.prototype.indexOf ? A.indexOf || function(array, pivot, start) {
            return A.prototype.indexOf.call(array, pivot, start);
        } : function(array, pivot, start) {
            for (var i = start || 0; i < array.length; i++)
                if (array[i] === pivot)
                    return i;
            return -1;
        },

        /**
         * Returns an instance of Map, or a Map-like object is Map is not
         * supported or doesn't support forEach()
         * @function createMap
         * @returns {Map}
         */
        createMap = root.Map === _undefined || !Map.prototype.forEach ? function() {
            // Lightweight shim of Map. Lacks clear(), entries(), keys() and
            // values() (the last 3 not supported by IE11, so can't use them),
            // it doesn't handle the constructor's argument (like IE11) and of
            // course it doesn't support for...of.
            // Chrome 31-35 and Firefox 13-24 have a basic support of Map, but
            // they lack forEach(), so their native implementation is bad for
            // this polyfill. (Chrome 36+ supports Object.observe.)
            var keys = [],
                values = [];

            return {
                size: 0,
                has: function(key) {
                    return inArray(keys, key) > -1;
                },
                get: function(key) {
                    return values[inArray(keys, key)];
                },
                set: function(key, value) {
                    var i = inArray(keys, key);
                    if (i === -1) {
                        keys.push(key);
                        values.push(value);
                        this.size++;
                    } else values[i] = value;
                },
                "delete": function(key) {
                    var i = inArray(keys, key);
                    if (i > -1) {
                        keys.splice(i, 1);
                        values.splice(i, 1);
                        this.size--;
                    }
                },
                forEach: function(callback /*, thisObj*/ ) {
                    for (var i = 0; i < keys.length; i++)
                        callback.call(arguments[1], values[i], keys[i], this);
                }
            };
        } : function() {
            return new Map();
        },

        /**
         * Simple shim for Object.getOwnPropertyNames when is not available
         * Misses checks on object, don't use as a replacement of Object.keys/getOwnPropertyNames
         * @function getProps
         * @param {Object} object
         * @returns {String[]}
         */
        getProps = O.getOwnPropertyNames ? (function() {
            var func = O.getOwnPropertyNames, x,
                strict = (function() { return !this; }());
            if( strict )
            {
                // Strict mode is supported

                // In strict mode, we can't access to "arguments", "caller" and
                // "callee" properties of functions. Object.getOwnPropertyNames
                // returns [ "prototype", "length", "name" ] in Firefox; it returns
                // "caller" and "arguments" too in Chrome and in Internet
                // Explorer, so those values must be filtered.
                var avoid = (func(inArray).join(" ") + " ").replace(/prototype |length |name /g, "").slice(0, -1).split(" ");
                if (avoid.length) func = function(object) {
                    var props = O.getOwnPropertyNames(object);
                    if (typeof object === "function")
                        for (var i = 0, j; i < avoid.length;)
                            if ((j = inArray(props, avoid[i++])) > -1)
                                props.splice(j, 1);

                    return props;
                };
            }
            return func;
        })() : function(object) {
            // Poor-mouth version with for...in (IE8-)
            var props = [],
                prop, hop;
            if ("hasOwnProperty" in object) {
                for (prop in object)
                    if (object.hasOwnProperty(prop))
                        props.push(prop);
            } else {
                hop = O.hasOwnProperty;
                for (prop in object)
                    if (hop.call(object, prop))
                        props.push(prop);
            }

            // Inserting a common non-enumerable property of arrays
            if (isArray(object))
                props.push("length");

            return props;
        },

        /**
         * Sets up the next check and delivering iteration, using
         * requestAnimationFrame or a (close) polyfill.
         * @function nextFrame
         * @param {function} func
         * @returns {number}
         */
        nextFrame = root.requestAnimationFrame || root.webkitRequestAnimationFrame || (function() {
            var initial = +new Date(),
                last = initial;
            return function(func) {
                return setTimeout(function() {
                    func((last = +new Date()) - initial);
                }, 17);
            };
        })(),

        /**
         * Sets up the observation of an object
         * @function doObserve
         * @param {Object} object
         * @param {Handler} handler
         * @param {String[]} [acceptList]
         */
        doObserve = function(object, handler, acceptList) {
            var data = observed.get(object);

            if (data) {
                performPropertyChecks(data, object);
                setHandler(object, data, handler, acceptList);
            } else {
                data = createObjectData(object);
                setHandler(object, data, handler, acceptList);

                if (observed.size === 1)
                // Let the observation begin!
                    nextFrame(runGlobalLoop);
            }
        },

        /**
         * Creates the initial data for an observed object
         * @function createObjectData
         * @param {Object} object
         */
        createObjectData = function(object, data) {
            var props = getProps(object),
                values = [],
                i = 0;

            data = {
                handlers: createMap(),
                properties: props,
                values: values,
                notifier: retrieveNotifier(object, data)
            };

            while (i < props.length)
                values[i] = object[props[i++]];

            observed.set(object, data);

            return data;
        },

        /**
         * Performs basic property value change checks on an observed object
         * @function performPropertyChecks
         * @param {ObjectData} data
         * @param {Object} object
         * @param {String} [except]  Doesn't deliver the changes to the
         *                           handlers that accept this type
         */
        performPropertyChecks = function(data, object, except) {
            if (!data.handlers.size) return;

            var props, proplen, keys,
                values = data.values,
                i = 0,
                idx,
                key, value, ovalue;

            props = data.properties.slice();
            proplen = props.length;
            keys = getProps(object);

            // Check for value additions/changes
            while (i < keys.length) {
                key = keys[i++];
                idx = inArray(props, key);
                value = object[key];

                if (idx === -1) {
                    addChangeRecord(object, data, {
                        name: key,
                        type: "add",
                        object: object
                    }, except);
                    data.properties.push(key);
                    values.push(value);
                } else {
                    ovalue = values[idx];
                    props[idx] = null;
                    proplen--;
                    if (ovalue === value ? ovalue === 0 && 1 / ovalue !== 1 / value : ovalue === ovalue || value === value) {
                        addChangeRecord(object, data, {
                            name: key,
                            type: "update",
                            object: object,
                            oldValue: ovalue
                        }, except);
                        data.values[idx] = value;
                    }
                }
            }

            // Checks if some property has been deleted
            for (i = props.length; proplen && i--;)
                if (props[i] !== null) {
                    addChangeRecord(object, data, {
                        name: props[i],
                        type: "delete",
                        object: object,
                        oldValue: values[i]
                    }, except);
                    data.properties.splice(i, 1);
                    data.values.splice(i, 1);
                    proplen--;
                }
        },

        /**
         * Sets up the main loop for object observation and change notification
         * It stops if no object is observed.
         * @function runGlobalLoop
         */
        runGlobalLoop = function() {
            if (observed.size) {
                observed.forEach(performPropertyChecks);
                handlers.forEach(deliverHandlerRecords);
                nextFrame(runGlobalLoop);
            }
        },

        /**
         * Deliver the change records relative to a certain handler, and resets
         * the record list.
         * @param {HandlerData} hdata
         * @param {Handler} handler
         */
        deliverHandlerRecords = function(hdata, handler) {
            var records = hdata.changeRecords;
            if (records.length) {
                hdata.changeRecords = [];
                handler(records);
            }
        },

        /**
         * Returns the notifier for an object - whether it's observed or not
         * @function retrieveNotifier
         * @param {Object} object
         * @param {ObjectData} [data]
         * @returns {Notifier}
         */
        retrieveNotifier = function(object, data) {
            if (arguments.length < 2)
                data = observed.get(object);

            /** @type {Notifier} */
            return data && data.notifier || {
                /**
                 * @method notify
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype._notify
                 * @memberof Notifier
                 * @param {ChangeRecord} changeRecord
                 */
                notify: function(changeRecord) {
                    changeRecord.type = changeRecord.type; // Just to check the property is there...

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object);
                    if (data) {
                        var recordCopy = {
                                object: object
                            },
                            prop;
                        for (prop in changeRecord)
                            if (prop !== "object")
                                recordCopy[prop] = changeRecord[prop];
                        addChangeRecord(object, data, recordCopy);
                    }
                },

                /**
                 * @method performChange
                 * @see http://arv.github.io/ecmascript-object-observe/#notifierprototype_.performchange
                 * @memberof Notifier
                 * @param {String} changeType
                 * @param {Performer} func     The task performer
                 * @param {*} [thisObj]        Used to set `this` when calling func
                 */
                performChange: function(changeType, func /*, thisObj*/ ) {
                    if (typeof changeType !== "string")
                        throw new TypeError("Invalid non-string changeType");

                    if (typeof func !== "function")
                        throw new TypeError("Cannot perform non-function");

                    // If there's no data, the object has been unobserved
                    var data = observed.get(object),
                        prop, changeRecord,
                        thisObj = arguments[2],
                        result = thisObj === _undefined ? func() : func.call(thisObj);

                    data && performPropertyChecks(data, object, changeType);

                    // If there's no data, the object has been unobserved
                    if (data && result && typeof result === "object") {
                        changeRecord = {
                            object: object,
                            type: changeType
                        };
                        for (prop in result)
                            if (prop !== "object" && prop !== "type")
                                changeRecord[prop] = result[prop];
                        addChangeRecord(object, data, changeRecord);
                    }
                }
            };
        },

        /**
         * Register (or redefines) an handler in the collection for a given
         * object and a given type accept list.
         * @function setHandler
         * @param {Object} object
         * @param {ObjectData} data
         * @param {Handler} handler
         * @param {String[]} acceptList
         */
        setHandler = function(object, data, handler, acceptList) {
            var hdata = handlers.get(handler);
            if (!hdata)
                handlers.set(handler, hdata = {
                    observed: createMap(),
                    changeRecords: []
                });
            hdata.observed.set(object, {
                acceptList: acceptList.slice(),
                data: data
            });
            data.handlers.set(handler, hdata);
        },

        /**
         * Adds a change record in a given ObjectData
         * @function addChangeRecord
         * @param {Object} object
         * @param {ObjectData} data
         * @param {ChangeRecord} changeRecord
         * @param {String} [except]
         */
        addChangeRecord = function(object, data, changeRecord, except) {
            data.handlers.forEach(function(hdata) {
                var acceptList = hdata.observed.get(object).acceptList;
                // If except is defined, Notifier.performChange has been
                // called, with except as the type.
                // All the handlers that accepts that type are skipped.
                if ((typeof except !== "string" || inArray(acceptList, except) === -1) && inArray(acceptList, changeRecord.type) > -1)
                    hdata.changeRecords.push(changeRecord);
            });
        };

    observed = createMap();
    handlers = createMap();

    /**
     * @function Object.observe
     * @see http://arv.github.io/ecmascript-object-observe/#Object.observe
     * @param {Object} object
     * @param {Handler} handler
     * @param {String[]} [acceptList]
     * @throws {TypeError}
     * @returns {Object}               The observed object
     */
    O.observe = function observe(object, handler, acceptList) {
        if (!object || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.observe cannot observe non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.observe cannot deliver to non-function");

        if (O.isFrozen && O.isFrozen(handler))
            throw new TypeError("Object.observe cannot deliver to a frozen function object");

        if (acceptList === _undefined)
            acceptList = defaultAcceptList;
        else if (!acceptList || typeof acceptList !== "object")
            throw new TypeError("Third argument to Object.observe must be an array of strings.");

        doObserve(object, handler, acceptList);

        return object;
    };

    /**
     * @function Object.unobserve
     * @see http://arv.github.io/ecmascript-object-observe/#Object.unobserve
     * @param {Object} object
     * @param {Handler} handler
     * @throws {TypeError}
     * @returns {Object}         The given object
     */
    O.unobserve = function unobserve(object, handler) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.unobserve cannot unobserve non-object");

        if (typeof handler !== "function")
            throw new TypeError("Object.unobserve cannot deliver to non-function");

        var hdata = handlers.get(handler),
            odata;

        if (hdata && (odata = hdata.observed.get(object))) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            nextFrame(function() {
                deliverHandlerRecords(hdata, handler);
            });

            // In Firefox 13-18, size is a function, but createMap should fall
            // back to the shim for those versions
            if (hdata.observed.size === 1 && hdata.observed.has(object))
                handlers["delete"](handler);
            else hdata.observed["delete"](object);

            if (odata.data.handlers.size === 1)
                observed["delete"](object);
            else odata.data.handlers["delete"](handler);
        }

        return object;
    };

    /**
     * @function Object.getNotifier
     * @see http://arv.github.io/ecmascript-object-observe/#GetNotifier
     * @param {Object} object
     * @throws {TypeError}
     * @returns {Notifier}
     */
    O.getNotifier = function getNotifier(object) {
        if (object === null || typeof object !== "object" && typeof object !== "function")
            throw new TypeError("Object.getNotifier cannot getNotifier non-object");

        if (O.isFrozen && O.isFrozen(object)) return null;

        return retrieveNotifier(object);
    };

    /**
     * @function Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#Object.deliverChangeRecords
     * @see http://arv.github.io/ecmascript-object-observe/#DeliverChangeRecords
     * @param {Handler} handler
     * @throws {TypeError}
     */
    O.deliverChangeRecords = function deliverChangeRecords(handler) {
        if (typeof handler !== "function")
            throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");

        var hdata = handlers.get(handler);
        if (hdata) {
            hdata.observed.forEach(function(odata, object) {
                performPropertyChecks(odata.data, object);
            });
            deliverHandlerRecords(hdata, handler);
        }
    };
})(Object, Array, this);



// window.saveAs
// Shims the saveAs method, using saveBlob in IE10. 
// And for when Chrome and FireFox get round to implementing saveAs we have their vendor prefixes ready. 
// But otherwise this creates a object URL resource and opens it on an anchor tag which contains the "download" attribute (Chrome)
// ... or opens it in a new tab (FireFox)
// @author Andrew Dodson
// @copyright MIT, BSD. Free to clone, modify and distribute for commercial and personal use.

window.saveAs || ( window.saveAs = (window.navigator.msSaveBlob ? function(b,n){ return window.navigator.msSaveBlob(b,n); } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function(){

    // URL's
    window.URL || (window.URL = window.webkitURL);

    if(!window.URL){
        return false;
    }

    return function(blob,name){
        var url = URL.createObjectURL(blob);

        // Test for download link support
        if( "download" in document.createElement('a') ){

            var a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', name);

            // Create Click event
            var clickEvent = document.createEvent ("MouseEvent");
            clickEvent.initMouseEvent ("click", true, true, window, 0, 
                event.screenX, event.screenY, event.clientX, event.clientY, 
                event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 
                0, null);

            // dispatch click event to simulate download
            a.dispatchEvent (clickEvent);

        }
        else{
            // fallover, open resource in new tab.
            window.open(url, '_blank', '');
        }
    };

})() );


// Navigator.sendBeacon()
(function(root) {
  'use strict';

  function sendBeacon(url, data) {
    var xhr = ('XMLHttpRequest' in window) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Accept', '*/*');
    if (typeof data === 'string') {
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
      xhr.responseType = 'text/plain';
    } else if (Object.prototype.toString.call(data) === '[object Blob]') {
      if (data.type) {
        xhr.setRequestHeader('Content-Type', data.type);
      }
    }
    xhr.send(data);
    return true;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = sendBeacon;
    }
    exports.sendBeacon = sendBeacon;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return sendBeacon;
    });
  } else if ('navigator' in root && !('sendBeacon' in root.navigator)) {
    root.navigator.sendBeacon = sendBeacon;
  }
})(this);


/*
Copyright (C) 2013 Hendrik Beskow
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function(win, doc, nav) {
    if ( /* Safari 6, Firefox 22 */ !('Notification' in win && 'permission' in win.Notification && 'requestPermission' in win.Notification)) {
        var PERMISSION_DEFAULT = 'default',
        PERMISSION_GRANTED = 'granted',
        PERMISSION_DENIED = 'denied',
        PERMISSION = [PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED],
        isString = function(value) {
            return (value && (value).constructor === String);
        },
        isFunction = function(value) {
            return (value && (value).constructor === Function);
        },
        isObject = function(value) {
            return (value && (value).constructor === Object);
        },
        noop = function() {},
        settings = {
            timeout: 5000,
            sticky: false
        };
        /* isIE9p = ('external' in win && 'msIsSiteMode' in win.external); */
        
        var checkPermission = function () {
            var permission;
            if ( /* Chrome, Firefox < 22 && ff-html5notifications */ !! ('webkitNotifications' in win && 'checkPermission' in win.webkitNotifications)) {
                permission = PERMISSION[win.webkitNotifications.checkPermission()];
            } else if ( /* Firefox Mobile */ 'mozNotification' in nav) {
                permission = PERMISSION_GRANTED;
            } else {
                permission = (localStorage.getItem('notifications') === null) ? PERMISSION_DEFAULT : localStorage.getItem('notifications');
            }
            return permission;
        };

        var requestPermission = function (callback) {
            var callbackFunction = isFunction(callback) ? callback : noop;
            if ( /* Chrome, Firefox < 22 && ff-html5notifications */ !! ('webkitNotifications' in win && 'requestPermission' in win.webkitNotifications)) {
                win.webkitNotifications.requestPermission(callbackFunction);
            } else {
                if (checkPermission() == PERMISSION_DEFAULT) {
                    if (confirm('Do you want to allow ' + doc.domain + ' to display Notifications?')) {
                        localStorage.setItem('notifications', PERMISSION_GRANTED);
                        Notification.permission = PERMISSION_GRANTED;
                    } else {
                        localStorage.setItem('notifications', PERMISSION_DENIED);
                        Notification.permission = PERMISSION_DENIED;
                    }
                }
                callbackFunction();
            }
        };

        var Notification = function (title, params) {
            var notification;
            if (isString(title) &&
                isObject(params) &&
                checkPermission() == PERMISSION_GRANTED) {
                if ( /* Firefox Mobile */ 'mozNotification' in nav) {
                    notification = nav.mozNotification.createNotification(title, params.body, params.icon);
                    if (isFunction(params.onclick)) {
                        notification.onclick = params.onclick;
                    }
                    if (isFunction(params.onclose)) {
                        notification.onclose = params.onclose;
                    }
                    notification.show();
                } else if ( /* Chrome, Firefox < 22 && ff-html5notifications */ 'webkitNotifications' in win && 'createNotification' in win.webkitNotifications) {
                    notification = win.webkitNotifications.createNotification(params.icon, title, params.body);
                    if (isFunction(params.onclick)) {
                        notification.onclick = params.onclick;
                    }
                    if (isFunction(params.onshow)) {
                        notification.onshow = params.onshow;
                    }
                    if (isFunction(params.onerror)) {
                        notification.onerror = params.onerror;
                    }
                    if (isFunction(params.onclose)) {
                        notification.onclose = params.onclose;
                    }
                    notification.show();
                } else {
                    // Your custom code goes here
                }
            }
            return notification;
        };

        if (!('Notification' in win)) {
            Notification.requestPermission = requestPermission;
            win.Notification = Notification;
        }

        if ( !! ('webkitNotifications' in win && 'checkPermission' in win.webkitNotifications)) {
            Object.defineProperty(win.Notification, 'permission', {
                get: function() {
                    return PERMISSION[win.webkitNotifications.checkPermission()];
                }
            });
        } else {
            Notification.permission = checkPermission();
        }

        if (!('requestPermission' in win.Notification)) {
            win.Notification.requestPermission = requestPermission;
        }
    }
}(this, this.document, this.navigator));