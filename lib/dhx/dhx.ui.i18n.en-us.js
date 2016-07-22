(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
$dhx.ui.i18n['en-us'] = {
    //$dhx.ui.language = {
    // menu
    text_labels: {
        // validation text labels section
        validation_notEmpty: function(label) {
            return "The '" + label + "' field value can not be empty";
        },
        validation_Empty: function(label) {
            return "The '" + label + "' field value should be empty";
        },
        validation_ValidEmail: function(label) {
            return "The " + label + " field value is not a valid e-mail";
        },
        validation_ValidInteger: function(label) {
            return "The " + label + " field should be a valid integer value";
        },
        validation_ValidFloat: function(label) {
            return "The " + label + " field should be a valid float value";
        },
        validation_ValidNumeric: function(label) {
            return "The " + label + " field value should be a valid numeric value";
        },
        validation_ValidAplhaNumeric: function(label) {
            return "The " + label + " field value should be a valid alpha numeric value";
        },
        validation_ValidDatetime: function(label) {
            return "The " + label + " field value should be a valid date time value";
        },
        validation_ValidExpirationdate: function(label) {
            return "The " + label + " field value should be a valid expiration date";
        },
        validation_ValidDate: function(label) {
            return "The " + label + " field value should be a valid date value";
        },
        validation_ValidTime: function(label) {
            return "The " + label + " field value should be a valid time value";
        },
        validation_ValidCurrency: function(label) {
            return "The " + label + " field should be a valid currency value";
        },
        validation_ValidSSN: function(label) {
            return "The " + label + " field should be a valid social security number value";
        }
    },
    File: 'File'.CFC(),
    New: 'New'.CFC(),
    OpenSelected: 'Open selected'.CFC(),
    PDFVersion: 'PDF version'.CFC(),
    Edit: 'Edit'.CFC(),
    UpdateSelect: 'Update selected'.CFC(),
    Deleteselected: 'Delete selected'.CFC(),
    Settings: 'Settings'.CFC(),
    SetUpGridColumns: 'Set up grid columns'.CFC(),
    Formsettings: 'Set up forms'.CFC(),
    Gridsettings: 'Grid settings'.CFC(),
    SelectIdiom: 'Select idiom'.CFC(),
    Portuguese: 'Portuguese'.CFC(),
    English: 'English'.CFC(),
    Help: 'Help'.CFC(),
    ReportBug: 'Repost bug'.CFC(),
    QuickHelp: 'Quick help'.CFC(),
    AnotherRecords: 'Another records'.CFC(),
    EditNameTable: function(table) {
            return table.CFC() + ' - management';
    },
    recordsmanagement: 'records management',
    Newrecord: 'New record',
    Openrecord: 'Open record',
    FindRecords: 'Find records',
    updateselected: 'update selected',
    deleteselected: 'delete selected',
    reloaddata: 'reload data',
    quicknavigation: 'quick navigation',
    gotofirstrecord: 'go to first<br>record',
    gotolast: 'go to last',
    gotoprevious: 'go to previous',
    gotonext: 'go to next',
    Filloutthefields: 'Fill out the fields',
    ChangeIdiomAgreement: 'The window will be reloaded now to apply the new changes. <br><br> It will also generate a cookie on your browser.<br><br> Do you want to continue?',
    ChangeskinAgreement: 'The window will be reloaded now to apply the new changes. <br><br> It will also generate a cookie on your browser.<br><br> Do you want to continue?',
    continue: 'continue',
    cancelar: 'cancel',
    Selectskin: 'Select skin'.CFC(),
    Initializing: 'Initializing',
    time_remaining_for_token_expiration: 'time remaining until session expires',
    no_data_transferred: 'no data transferred',
    Notauthorizedyet: 'Not authorized yet',
    no_errors: 'no errors',
    could_not_sync_grid: 'could not sync grid',
    counting_records: 'counting records',
    total_records: 'total records',
    getting_quota_information: 'getting quota information',
    used: 'used',
    remaining: 'remaining',
    Quota_information: 'Quota information',
    requesting_first_record: 'requesting first record',
    requesting_next_record: 'requesting next record',
    requesting_previous_record: 'requesting previous record',
    requesting_last_record: 'requesting last record',
    selected: 'selected record',
    save_record: 'save record',
    update_record: 'update record',
    Provide_some_values_to_search: 'Provide some values to search',
    search: 'search',
    clear_results: 'clear results',
    insensitivity_search: 'there is no sensitivity for case or special chars when searching',
    About: 'About',
    open: 'open',
    close: 'close',
    right_click_to_select_a_language: 'right click to select a language',
    closeall: 'close all',
    ControlPanel: 'Control Panel',
    minimizeall: 'minimize all',
    Click_on_a_wallpaper_to_preview: 'Click on a wallpaper to preview',
    Walpapersettings: 'Walpaper settings',
    Systeminformations: 'System informations',
    Globalformssettings: 'Global forms settings',
    setaswallpaper: 'set as wallpaper',
    click_to_open_control_panel: 'click to open Control Panel',
    capitalize_note: "Enabling this feature, all the times you type a text on a form, that text will be automatically upper case conveted. <br><br>Example: if you type <strong>Name</strong>, it will be translated to <strong>NAME</strong>.<br><br>Please make sure before turning it on.",
    latinize_note: "Enabling this feature, all the times you type a text on a form, that text will have all it accents coverted to lating characters. <br><br>Example: if you type <strong>Años</strong>, it will be translated to <strong>Anos</strong>.<br><br>Please make sure before turning it on.",
    "Capitalize form inputs": "Capitalize form inputs",
    "Latinize form inputs": "Latinize form inputs",
    "capitalize text while typing": "capitalize text when typing",
    "latinize text while typing": "latinize text when typing",
    "Forms global settings": "Forms global settings",
    "quota usage": "quota usage",
    "Size in GB": "Size in GB",
    'Live quota information': 'Live quota information',
    username: 'username',
    password: 'password',
    login: 'login',
    forgot_password: 'forgot password',
    session_expires_in: 'session ends in',
    click_to_open_messages: 'click to open messages',
    expired_token_message: 'Expired token. Please do login again ... ',
    really_want_to_delete: 'Do you really want to delete?',
    could_not_delete: 'could not delete',
    record_deleted: 'record deleted. ',
    deleting_record: 'deleting record',
    realtime_communication_is_on: 'socket is online',
    realtime_communication_is_off: 'socket is offline',
    there_is_no_active_transfer: 'REST transfer is idle',
    there_is_active_transfer: 'transferência REST ativa'
};