function eXcell_moment_calendar(cell) { //the eXcell name is defined here
    if (cell) { //the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
    this.setValue = function(val) {
        var d = moment(new Date(val)).isValid() ? moment(new Date(val)).calendar() : val;
        if( val !== null && val != 'null' )
        {
            this.setCValue('<span>' + d + '</span> ' + '<noscript>' + val + '</noscript>', val);
        }
        else
        {
            this.setCValue('<span>Not defined yet</span> ' + '<noscript></noscript>', null);
        }
    };
    this.getValue = function() {
        return this.cell.childNodes[2].innerHTML; // gets the value
    };
}
eXcell_moment_calendar.prototype = new eXcell();

function eXcell_moment_to(cell) { //the eXcell name is defined here
    if (cell) { //the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
    this.setValue = function(val) {
        var d = moment( new Date( val ) ).isValid() ? moment().to( new Date( val ) ) : val;
        if( val !== null && val != 'null' )
        {
            this.setCValue('<span>' + d + '</span> ' + '<noscript>' + val + '</noscript>', $dhx.isDate(val) ? ( new Date(val) ).getTime() : val);
        }
        else
        {
            this.setCValue('<span>Not defined yet</span> ' + '<noscript></noscript>', null);
        }
        
    };
    this.getValue = function() {
        return this.cell.childNodes[2].innerHTML; // gets the value
    };
}
eXcell_moment_to.prototype = new eXcell();

function eXcell_moment_from(cell) { //the eXcell name is defined here
    if (cell) { //the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
    this.setValue = function(val) {
        var d = moment( new Date( val ) ).isValid() ? moment( new Date( val ) ).from() : val;
        if( val !== null && val != 'null' )
        {
            this.setCValue('<span>' + d + '</span> ' + '<noscript>' + val + '</noscript>', val);
        }
        else
        {
            this.setCValue('<span>Not defined yet</span> ' + '<noscript></noscript>', null);
        }
    };
    this.getValue = function() {
        return this.cell.childNodes[2].innerHTML; // gets the value
    };
}
eXcell_moment_from.prototype = new eXcell();

function eXcell_moment_fromNow(cell) { //the eXcell name is defined here
    if (cell) { //the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
    this.setValue = function(val) {
        var d = moment(new Date(val)).isValid() ? moment(new Date(val)).fromNow() : val;

        if( val !== null && val != 'null' )
        {
            this.setCValue('<span>' + d + '</span> ' + '<noscript>' + val + '</noscript>', $dhx.isDate(val) ? ( new Date(val) ).getTime() : val  );
        }
        else
        {
            this.setCValue('<span>Not defined yet</span> ' + '<noscript></noscript>', null);
        }  
    };
    this.getValue = function() {
        //console.log(this.cell.childNodes);
        return this.cell.childNodes[2].innerHTML; // gets the value
    };
}
eXcell_moment_fromNow.prototype = new eXcell();

function eXcell_myprice(cell) { //the eXcell name is defined here
    if (cell) { //the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
        eXcell_ed.call(this); //uses methods of the "ed" type
    }
    this.setValue = function(val) {
        this.setCValue("<span>" + (( +val )).formatMoney(2, 'US$ ', ',', '.') + "</span><noscript>" + val + "</noscript>", val);
    };
    this.getValue = function() {
        return this.cell.childNodes[1].innerHTML; // gets the value
    };
}
eXcell_myprice.prototype = new eXcell(); // nests all other methods from the base class


// moment_fromNow
var simple_text = function (name, value) {
    return "<div>" + value + "</div>";
},
    simple_italic = function (name, value) {
        return "<div style='color:#A6ACB2;'>" + value + "</div>";
    },
    moment_to = function (name, value) {
       return ( value === null || value == 'null' ) ?  "" : "<div>" + value.split('.')[0].toString().replace(/T/gi,' ') + " - " + moment().to(new Date(value)) + "</div>";
    },
    moment_fromNow = function (name, value) {
        return ( value === null || value == 'null' ) ?  "" : "<div>" + value.split('.')[0].toString().replace(/T/gi,' ') + " - " + moment(new Date(value)).fromNow() + "</div>";
    },
    myprice = function (name, value) {
        return "<div>" + (( +value )).formatMoney(2, 'US$ ', ',', '.') + "</div>";
    },
    bold_text = function (name, value) {
        return "<div class='simple_bold'>" + value + "</div>";
    },
    format_b = function (name, value) {
        // to access form instance from format function
        // you cann use the following method:
        // var form = this.getForm();
        return "<div class='simple_link'>" + value + "</div>";
    },
    featureList = function ( items ){
        return '<div class="skill_set">' + 
        items.map(function(skill) {
            return '<div class="form_skill">'+skill+'</div>';
        }).join('') + '</div>';
    };