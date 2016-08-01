(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
$dhx.ui.i18n = $dhx.ui.i18n || {
    version: '1.0.3',
    idiom: 'pt-br',
    setIdiom: function(idiom) {
        $dhx.ui.i18n.idiom = idiom;
        // store idiom on somewhere now: indexedDB, localStorage or cookie?
    },
    setUserIdiom: function(idiom) {
        $dhx.ui.i18n.idiom = idiom;
        dhtmlx.confirm({
            type: "confirm-warning",
            text: $dhx.ui.language.ChangeIdiomAgreement,
            ok: $dhx.ui.language.continue,
            // dhtmlx BUG
            cancel: $dhx.ui.language.cancel,
            callback: function(result) {
                if (result === true) {
                    $dhx.cookie.set("dhx_idiom", idiom, 99999999);
                    location.reload();
                }
            }
        });
    },
    getUserIdiom: function() {
        var idiom = false;
        if (typeof $dhx.cookie.get("dhx_idiom") !== 'undefined') {
            idiom = $dhx.cookie.get("dhx_idiom");
        }
        return idiom;
    },
    start: function(idiom) {
        //$dhx.ui.i18n.idiom = navigator.language.toLowerCase();		

        if (typeof idiom === 'undefined') {
            $dhx.ui.i18n.idiom = navigator.language.toLowerCase();
        }
        if (idiom) {
            $dhx.ui.i18n.idiom = idiom;
        }
        if ($dhx.ui.i18n.getUserIdiom()) {
            $dhx.ui.i18n.idiom = $dhx.ui.i18n.getUserIdiom();
        }

        $dhx.ui.language = $dhx.extend($dhx.ui.i18n[$dhx.ui.i18n.idiom]);
        //console.log($dhx.ui.language);
    }
};
