!function(e){"use strict"}(window.$dhx=window.$dhx||{}),function(e){"use strict"}($dhx.ui=$dhx.ui||{}),$dhx.ui.form=$dhx.ui.form||{setInputHighlighted:function(e,t){var n=e.name,l=e.type;if("combo"==l){var o=t.getCombo(n);o.openSelect()}else"editor"==l||("multiselect"==l?$dhx.ui.form.input.validate.invalid(t.getSelect(n)):"select"==l?$dhx.ui.form.input.validate.invalid(t.getSelect(n)):$dhx.ui.form.input.validate.invalid(t.getInput(n)))},select:{validate:{invalid:function(e){e.style.backgroundColor="#fdafa3",e.onclick=function(){e.style.backgroundColor="#fff"}}}},combo:{validate:{invalid:function(e){var t=e.DOMelem.style.backgroundColor,n=e.DOMelem.style.borderColor,l=e.DOMelem_input.style.backgroundColor;e.DOMelem.style.backgroundColor="#fdafa3",e.DOMelem.style.borderColor="#8F0000",e.DOMelem_input.style.backgroundColor="#fdafa3",e.DOMelem_input.addEventListener("click",function(o){e.DOMelem.style.backgroundColor=t,e.DOMelem.style.borderColor=n,e.DOMelem_input.style.backgroundColor=l}),e.DOMelem_input.addEventListener("change",function(o){e.DOMelem.style.backgroundColor=t,e.DOMelem.style.borderColor=n,e.DOMelem_input.style.backgroundColor=l}),e.openSelect()}}},input:{validate:{invalid:function(e){var t=e.style.backgroundColor;e.style.backgroundColor="#fdafa3",e.focus(),e.addEventListener("click",function(n){e.style.backgroundColor=t}),e.addEventListener("change",function(n){e.style.backgroundColor=t}),e.addEventListener("keydown",function(n){e.style.backgroundColor=t})}},mask:{currency:function(e,t){t=t||!1,VMasker(e).maskMoney(t)},integer:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,""),$dhx.isNumber(e.value)&&(e.value=parseInt(e.value),parseInt(e.value)>2147483647&&($dhx.ui.form.input.validate.invalid(e),e.title="value need to be less than 2147483647"))},1)},credit_card:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,""),e.value=e.value.replace(/(\d{4})(\d)/,"$1-$2"),e.value=e.value.replace(/(\d{4})(\d)/,"$1-$2"),e.value=e.value.replace(/(\d{4})(\d)/,"$1-$2")},1)},number:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,""),$dhx.isNumber(e.value)&&(e.value=e.value)},1)},cpf:function(e,t){t=t||event,setTimeout(function(){kcode=t.keyCode,8!=kcode&&(3==e.value.length&&(e.value=e.value+"."),7==e.value.length&&(e.value=e.value+"."),11==e.value.length&&(e.value=e.value+"-"))},1)},cnpj:function(e,t){t=t||event;var n=t.keyCode,l=String(e.value);l=l.replace(".",""),l=l.replace("/",""),l=l.replace("-",""),tam=l.length+1,14!=n&&(3==tam&&(e.value=l.substr(0,2)+"."),6==tam&&(e.value=l.substr(0,2)+"."+l.substr(2,5)+"."),10==tam&&(e.value=l.substr(0,2)+"."+l.substr(2,3)+"."+l.substr(6,3)+"/"),15==tam&&(e.value=l.substr(0,2)+"."+l.substr(2,3)+"."+l.substr(6,3)+"/"+l.substr(9,4)+"-"+l.substr(13,2)))},cep:function(e,t){t=t||event,setTimeout(function(){e.value=e.value.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2")},1)},us_phone:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,"").replace(/^(\d\d\d)(\d)/g,"($1)$2").replace(/(\d{3})(\d)/,"$1-$2")},1)},br_phone:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,"").replace(/^(\d\d\d)(\d)/g,"($1) $2"),15==e.value.length?e.value=e.value.replace(/(\d{5})(\d)/,"$1-$2"):e.value=e.value.replace(/(\d{4})(\d)/,"$1-$2")},1)},expiration_date:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,"").replace(/^(\d\d)(\d)/g,"$1/$2")},1)},expiration_date2:function(e){setTimeout(function(){e.value=e.value.replace(/\D/g,"").replace(/^(\d\d)(\d)/g,"$1/$2")},1)},ssn:function(e,t){t=t||event,setTimeout(function(){kcode=t.keyCode,8!=kcode&&(3==e.value.length&&(e.value=e.value+"-"),6==e.value.length&&(e.value=e.value+"-"))},1)},time:function(e,t){var n=0,l=t,o=null;o=document.all?l.keyCode:t.which,(o>=96&&o<=105||o>=48&&o<=57)&&(n=1),8!=o&&9!=o&&46!=o||(n=2),0===n&&(l.returnValue=!1),1==n&&(2==e.value.length||5==e.value.length&&e.maxLength>5)&&(e.value=e.value+":")}}}},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.VMasker=t()}(this,function(){var e="9",t="A",n="S",l=[9,16,17,18,36,37,38,39,40,91,92,93],o=function(e){for(var t=0,n=l.length;t<n;t++)if(e==l[t])return!1;return!0},i=function(e){return e=e||{},e={precision:e.hasOwnProperty("precision")?e.precision:2,separator:e.separator||",",delimiter:e.delimiter||".",unit:e.unit&&e.unit.replace(/[\s]/g,"")+" "||"",suffixUnit:e.suffixUnit&&" "+e.suffixUnit.replace(/[\s]/g,"")||"",zeroCents:e.zeroCents,lastOutput:e.lastOutput},e.moneyPrecision=e.zeroCents?0:e.precision,e},u=function(l,o,i){for(;o<l.length;o++)l[o]!==e&&l[o]!==t&&l[o]!==n||(l[o]=i);return l},a=function(e){this.elements=e};a.prototype.unbindElementToMask=function(){for(var e=0,t=this.elements.length;e<t;e++)this.elements[e].lastOutput="",this.elements[e].onkeyup=!1,this.elements[e].onkeydown=!1,this.elements[e].value.length&&(this.elements[e].value=this.elements[e].value.replace(/\D/g,""))},a.prototype.bindElementToMask=function(e){for(var t=this,n=function(n){n=n||window.event;var l=n.target||n.srcElement;o(n.keyCode)&&setTimeout(function(){t.opts.lastOutput=l.lastOutput,l.value=r[e](l.value,t.opts),l.lastOutput=l.value,l.setSelectionRange&&t.opts.suffixUnit&&l.setSelectionRange(l.value.length,l.value.length-t.opts.suffixUnit.length)},0)},l=0,i=this.elements.length;l<i;l++)this.elements[l].lastOutput="",this.elements[l].onkeyup=n,this.elements[l].value.length&&(this.elements[l].value=r[e](this.elements[l].value,this.opts))},a.prototype.maskMoney=function(e){this.opts=i(e),this.bindElementToMask("toMoney")},a.prototype.maskNumber=function(){this.opts={},this.bindElementToMask("toNumber")},a.prototype.maskAlphaNum=function(){this.opts={},this.bindElementToMask("toAlphaNumeric")},a.prototype.maskPattern=function(e){this.opts={pattern:e},this.bindElementToMask("toPattern")},a.prototype.unMask=function(){this.unbindElementToMask()};var r=function(e){if(!e)throw new Error("VanillaMasker: There is no element to bind.");var t="length"in e?e.length?e:[]:[e];return new a(t)};return r.toMoney=function(e,t){if(t=i(t),t.zeroCents){t.lastOutput=t.lastOutput||"";var n="("+t.separator+"[0]{0,"+t.precision+"})",l=new RegExp(n,"g"),o=e.toString().replace(/[\D]/g,"").length||0,u=t.lastOutput.toString().replace(/[\D]/g,"").length||0;e=e.toString().replace(l,""),o<u&&(e=e.slice(0,e.length-1))}var a=e.toString().replace(/[\D]/g,""),r=new RegExp("^(0|\\"+t.delimiter+")"),s=new RegExp("(\\"+t.separator+")$"),c=a.substr(0,a.length-t.moneyPrecision),d=c.substr(0,c.length%3),p=new Array(t.precision+1).join("0");c=c.substr(c.length%3,c.length);for(var v=0,f=c.length;v<f;v++)v%3===0&&(d+=t.delimiter),d+=c[v];if(d=d.replace(r,""),d=d.length?d:"0",!t.zeroCents){var g=a.length-t.precision,h=a.substr(g,t.precision),m=h.length,b=t.precision>m?t.precision:m;p=(p+h).slice(-b)}var k=t.unit+d+t.separator+p+t.suffixUnit;return k.replace(s,"")},r.toPattern=function(l,o){var i,a="object"==typeof o?o.pattern:o,r=a.replace(/\W/g,""),s=a.split(""),c=l.toString().replace(/\W/g,""),d=c.replace(/\W/g,""),p=0,v=s.length,f="object"==typeof o?o.placeholder:void 0;for(i=0;i<v;i++){if(p>=c.length){if(r.length==d.length)return s.join("");if(void 0!==f&&r.length>d.length)return u(s,i,f).join("");break}if(s[i]===e&&c[p].match(/[0-9]/)||s[i]===t&&c[p].match(/[a-zA-Z]/)||s[i]===n&&c[p].match(/[0-9a-zA-Z]/))s[i]=c[p++];else if(s[i]===e||s[i]===t||s[i]===n)return void 0!==f?u(s,i,f).join(""):s.slice(0,i).join("")}return s.join("").substr(0,i)},r.toNumber=function(e){return e.toString().replace(/(?!^-)[^0-9]/g,"")},r.toAlphaNumeric=function(e){return e.toString().replace(/[^a-z0-9 ]+/i,"")},r});