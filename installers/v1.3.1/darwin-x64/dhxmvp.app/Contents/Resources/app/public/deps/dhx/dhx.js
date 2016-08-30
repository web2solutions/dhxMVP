/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true, maxerr : 1000, indent : 2, sloppy : true */
/*global $dhx, dhtmlx, Element */
(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {
    version: '1.0.3',
    cdn1URL: '//cdn.dhtmlx.com.br/',
    _enable_log: false,
    _enable_benchmark: false,
    windowWidth: 0,
    windowHeight: 0,
    /**
        @function loadScript -  load javascript files - code injection
        @param {string} url - the url of a given javascript file which will be loaded
        @param {function}   callback -  function  callback which will be executed after the javascript file 100% loaded
    */
    uid: function() {
      return ((Date.now() & 0x7fff).toString(32) + (0x100000000 * Math.random()).toString(32));
    },

    S4: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    guid: function () {
        var self = this;
        return (self.S4() + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + self.S4() + self.S4());
    },

    getRandomColor: function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    loadScript: function(url, callback) {
        url = url + ".js";
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) { //IE
            script.onreadystatechange = function() {
                $dhx.debug.log(script.readyState);
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    /* load javascript files - code injection */
    environment: "test",
    onDemand: {
        queue: [],
        load: function(url, callback) {
            var self = $dhx.onDemand;
            var uid = $dhx.guid();
            self.queue[uid] = [];
            //$dhx.debug.log("load");
            //$dhx.exposeForEach();
            if ($dhx.isArray(url)) {
                url.forEach(function(path, index, array) {
                    if ($dhx.environment != "production") self.queue[uid].push(path + "?uistring=" + $dhx.guid());
                    else self.queue[uid].push(path);
                });
            } else {
                if ($dhx.environment != "production")
                {
                    self.queue[uid].push(url + "?uistring=" + $dhx.guid());
                }
                else
                {
                    self.queue[uid].push(url);
                }
            }
            $dhx.showDirections("Loading_Files");
            self.process_queue(callback, uid);
        },
        require: function(url, callback) {
            var self = $dhx.onDemand;
            var uid = $dhx.guid();
            self.queue[uid] = [];
            //$dhx.debug.log("load");
            //$dhx.exposeForEach();
            if ($dhx.isArray(url)) {
                url.forEach(function(path, index, array) {
                    if ($dhx.environment != "production")
                    {
                        self.queue[uid].push(path + "?uistring=" + $dhx.guid());
                    }
                    else
                    {
                        self.queue[uid].push(path);
                    }
                });
            } else {
                if ($dhx.environment != "production")
                {
                    self.queue[uid].push(url + "?uistring=" + $dhx.guid());
                }
                else
                {
                    self.queue[uid].push(url);
                }
            }
            $dhx.showDirections("Loading_Files");
            self.process_queue(callback, uid);
        },
        process_queue: function(callback, uid) {
            var self = $dhx.onDemand;
            //$dhx.debug.log(self.queue.length);
            if (self.queue[uid].length > 0) {
                var first_on_queue = self.queue[uid].shift();
                //try {
                    //document.getElementById("$dhx_splash_div_file_info").innerHTML = 'loading ' + first_on_queue.split("/")[first_on_queue.split("/").length - 1];
                //} catch (e) {}
                $dhx.lScript(first_on_queue, function() {
                    //try {
                    //    document.getElementById("$dhx_splash_div_file_info").innerHTML = '';
                    //} catch (e) {}
                    self.process_queue(callback, uid);
                });
            } else {
                $dhx.hideDirections();
                callback();
            }
        }
    },
    /**
        @function loadScript -  load script - code injection
        @param {string} url - the url of a given javascript file which will be loaded
        @param {function}   callback -  function  callback which will be executed after the javascript file 100% loaded
    */
    lScript: function(url, callback) {
        var self = this,
            arrType, type, s, nodeType, node, tag_id = url.split("?")[0];
        //$dhx.debug.log("lScript");
        //$dhx.debug.log(url);
        //$dhx.debug.log(document.getElementById(url));
        if (document.getElementById(url) === null) {
            arrType = url.split(".");
            type = arrType[arrType.length - 1];
            //$dhx.debug.log(url);
            if (url.indexOf(".css") != -1) {
                nodeType = "link";
                node = document.createElement(nodeType);
                //node = document.createStyleSheet(url);
                node.setAttribute("rel", "stylesheet");
                node.setAttribute("type", "text/css");
                if (url.indexOf("?") != -1) node.setAttribute("href", url);
                else node.setAttribute("href", url);
            } else {
                nodeType = "script";
                node = document.createElement(nodeType);
                node.setAttribute("type", "text/javascript");
                node.async = 'true';
                if (url.indexOf("?") != -1) node.setAttribute("src", url);
                else node.setAttribute("src", url);
            }
            node.setAttribute("id", url);
            if (node.readyState) {
                node.onreadystatechange = function() {
                    if (node.readyState == 'loaded' || node.readyState == 'complete') {
                        $dhx.debug.log(node.readyState);
                        node.onreadystatechange = null;
                        //$dhx.debug.log("loaded  " + url);
                        callback();
                    }
                };
            } else {
                //$dhx.debug.log(type);
                if (url.indexOf(".css") != -1) {
                    callback();
                } else {
                    //$dhx.debug.log("no ie");
                    //$dhx.debug.log(node.onload);
                    node.onload = function() {
                        //$dhx.debug.log("loaded");
                        //$dhx.debug.log("loaded  " + url);
                        callback();
                    };
                    node.onerror = function(e) {
                        $dhx.debug.log("error on loading file: " + e.target.src.split("/")[e.target.src.split("/").length - 1]);
                        //$dhx.debug.log("loaded  " + url);
                        document.getElementById("$dhx_splash_div_file_info").innerHTML = '<br>error</b> when loading the file: <br>' + e.target.src.split("/")[e.target.src.split("/").length - 1];
                        //callback();
                    };
                }
            }
            //$dhx.debug.log( url );
            //$dhx.debug.log(document.getElementsByTagName('head')[0].appendChild(node));
            document.getElementsByTagName('head')[0].appendChild(node);
            //s = document.getElementsByTagName('script')[0];
            //s.parentNode.insertBefore(node, s);
        } else {
            //$dhx.debug.log("already exist");
            callback();
        }
    },
    getPagePosition: function(cordinate, width, height) {
        var self = this,
            l = 0,
            t = 0;
        if (!window.pageYOffset) {
            if (document.documentElement.scrollTop !== 0) {
                t = document.documentElement.scrollTop;
                l = document.documentElement.clientWidth;
            } else {
                t = document.body.scrollTop;
                l = document.body.clientWidth;
            }
        } else {
            t = window.pageYOffset;
            l = window.innerWidth;
        }
        l = (l / 2) - (width / 2);
        if (window.innerHeight) {
            t = t + (window.innerHeight / 2) - (height / 2);
        } else {
            t = t + (document.body.clientHeight / 2) - (height / 2);
        }
        if (cordinate == "y") {
            return t;
        } else {
            return l;
        }
    },
    /**
        @object Browser -  performs Browser and OS identifying

        @property Browser.name
        @property Browser.version
        @property Browser.OS

            usable properties
                Browser.name
                Browser.version
                Browser.OS
    */
    Browser: {
        /* quirksmode.org */
        init: function() {
            this.name = this.searchString(this.dataBrowser) || "An unknown browser";
            this.onLine = (navigator.onLine) || "Unknow connection status";
            this.cookieEnabled = (navigator.cookieEnabled) || "Unknow cookies permission";
            this.plugins = (navigator.plugins) || "Unknow plugins";
            /*

            navigator.geolocation = [object Geolocation]
            navigator.onLine = true
            navigator.cookieEnabled = true
            navigator.vendorSub =
            navigator.vendor = Google Inc.
            navigator.productSub = 20030107
            navigator.product = Gecko
            navigator.mimeTypes = [object MimeTypeArray]
            navigator.plugins = [object PluginArray]
            navigator.platform = Win32
            navigator.userAgent = Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
            navigator.language = pt-BR
            navigator.appVersion = 5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
            navigator.appName = Netscape
            navigator.appCodeName = Mozilla
            navigator.doNotTrack = null
            navigator.javaEnabled = function javaEnabled() { [native code] }
            navigator.getStorageUpdates = function getStorageUpdates() { [native code] }
            navigator.registerProtocolHandler = function registerProtocolHandler() { [native code] }
            navigator.webkitGetGamepads = function webkitGetGamepads() { [native code] }
            navigator.webkitGetUserMedia = function webkitGetUserMedia() { [native code] }

            */
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
                } else if (dataProp) return data[i].identity;
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        isPlugin: function(which_plugin) {
            if (typeof which_plugin === 'undefined') {
                which_plugin = "notspecified";
            }
            for (var plugin in $dhx.Browser.plugins) {
                if ($dhx.Browser.plugins.hasOwnProperty(plugin)) {
                    if (typeof $dhx.Browser.plugins[plugin].name === 'undefined') $dhx.Browser.plugins[plugin].name = "Unknow plugin";
                    var regex = new RegExp("" + which_plugin.toString() + "", "g");
                    if (typeof $dhx.Browser.plugins[plugin].name !== 'undefined') {
                        if ($dhx.Browser.plugins[plugin].name.match(regex)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]
    },
    /**
        @function getAndSetWindowDimension -  get the current window width and height and set the public properties $dhx.windowWidth and $dhx.windowHeight
    */
    getAndSetWindowDimension: function() {
        var self = $dhx,
            d = document,
            w = window;
        // w3c
        if (w.innerWidth) {
            self.windowWidth = w.innerWidth;
            self.windowHeight = w.innerHeight;
        } else { // old IEs
            if (d.documentElement.scrollTop !== 0) {
                $dhx.windowWidth = d.documentElement.clientWidth;
                $dhx.windowHeight = d.documentElement.clientHeight;
            } else {
                $dhx.windowWidth = d.body.clientWidth;
                $dhx.windowHeight = d.body.clientHeight;
            }
        }
    },
    /**
        @function checkBrowserStuff -  check if the current browser is able to run AJAX applications
        @return {boolean} - true / false
    */
    hideDirections: function() {
        try {
            document.getElementById("$dhx_wrapper_splash").parentNode.removeChild(document.getElementById("$dhx_wrapper_splash"));
            document.getElementById("$dhx_splash").parentNode.removeChild(document.getElementById("$dhx_splash"));
            document.getElementById("$dhx_splash_div_file_info").parentNode.removeChild(document.getElementById("$dhx_splash_div_file_info"));
            //document.getElementById("$dhx_splash").style.display = "none";
        } catch (e) {}
    },
    showDirections: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash, div_file_info;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; filter: alpha(opacity=50);');
        div_wrapper.setAttribute("id", '$dhx_wrapper_splash');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "9999";
        div_wrapper.style.backgroundColor = "#5190D1";
        div_wrapper.style.opacity = "0.5";
        /*div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-size:17px;padding-top:95px;padding-right:50px;padding-left:8px;color:#F0F0F0;line-height:18px;');
        div_splash.setAttribute("id", '$dhx_splash');
        div_splash.style.width = "560px";
        div_splash.style.height = "243px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight === 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 183) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 250) + "px";
        div_splash.style.zIndex = "99999";
        div_splash.style.backgroundColor = "#ccc";
        //div_splash.style.backgroundImage = "url('" + splash_base64 + "')";

        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";*/
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-family:Tahoma, Geneva, sans-serif; font-size:11px; color:#069; text-align:center; padding-top:30px;padding-left:20px;');
        div_splash.setAttribute("id", '$dhx_splash');
        div_splash.style.width = "233px";
        div_splash.style.height = "21px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight === 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 28) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 105) + "px";
        div_splash.style.zIndex = "999999";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url('" + loading_gif + "')";
        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";
        //$dhx.debug.log('XXXXXXXXXXXXXXXXXXXX');
        //$dhx.debug.log(m);
        //div_splash.innerHTML = m;
        div_file_info = document.createElement("DIV");
        div_file_info.setAttribute("style", "white-space:nowrap;font-size:11px; color:#069; ");
        div_file_info.setAttribute("id", '$dhx_splash_div_file_info');
        div_file_info.style.width = "400px";
        div_file_info.style.height = "30px";
        div_file_info.style.position = "fixed";
        div_file_info.style.top = ((self.windowHeight / 2) - 27) + "px";
        div_file_info.style.left = ((self.windowWidth / 2) - 100) + "px";
        div_file_info.style.zIndex = "999999";
        //div_file_info.style.backgroundImage = "url(" + $dhx_location + "imgs/splash.png)";
        if (m == "MSXML") {
            template = template + '<b>Your browser is out of date</b> <br>';
            template = template + 'Your computer does not have a necessary component installed <br>';
            template = template + '<b>Please click <a target="_blank" style="color:#003399;" href="http://www.microsoft.com/en-us/download/details.aspx?id=19662" title="download">here</a> to install the component or use Firefox or Google Chrome</b>';
        } else if (m == "COMPONENTS_DISABLED") {
            template = template + 'You are running Internet Explorer under <b>"no add-ons"</b> mode, <br>';
            template = template + 'or ActiveXs are disabled <br>';
            template = template + 'Close your browser and open the Internet Explorer again by reaching:<br><b>Start menu -> All Programs -> Internet Explorer</b>';
        } else if (m == "PDF_MISSING") {
            template = template + 'The Acrobat Reader plugin could not be found! <br>';
            template = template + 'If you are running IE, the ActiveXs may be disabled. Try to enable it. <br>';
            template = template + 'You can also try to install Acrobat reader. <b>Please click <a target="_blank" style="color:#003399;" href="http://get.adobe.com/br/reader/" title="download">here</a> to download and install free Acrobat Reader</b>';
        } else if (m == "BROWSER_VERSION_OUT_TO_DATE") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This version is not supported anymore.<br>';
            template = template + 'Please download and install a new version of it.';
        } else if (m == "BROWSER_NOT_ALLOWED") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This Browser vendor is not supported.<br>';
            template = template + 'List of supported browsers: <b>Internet Explorer 8+, Safari, Chrome 13+, Firefox 5+</b>';
        } else if (m == "Loading_Files") {
            template = template + '';
            template = template + '<b>Loading ... please wait!</b>';
            //template = template + 'please wait!';
        } else if (typeof m === 'undefined') {
            template = template + '';
            template = template + '<b> ...</b><br>';
            template = template + 'please wait!';
        } else {
            template = template + '';
            template = template + m;
            //template = template + 'please wait!';
        }
        div_splash.innerHTML = template;
        //document.getElementById("$dhx_wrapper_splash").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_splash") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
                document.body.appendChild(div_file_info);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
                document.getElementsByTagName('body')[0].appendChild(div_file_info);
            }
        } else {
            document.getElementById("$dhx_wrapper_splash").style.display = "block";
            document.getElementById("$dhx_splash").style.display = "block";
            document.getElementById("$dhx_splash_div_file_info").style.display = "block";
        }
    },
    progressOff: function() {
        try {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            //document.getElementById("$dhx_splash").style.display = "none";
        } catch (e) {}
    },
    progressOn: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", 'filter: alpha(opacity=15); -moz-opacity: 0.15; opacity: 0.15; background-color: #93C0E7;');
        div_wrapper.setAttribute("id", '$dhx_wrapper_loading_wheel');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "999888";
        //div_wrapper.style.backgroundColor = "#000000";
        //div_wrapper.style.opacity = "0.5";
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-family:Tahoma, Geneva, sans-serif; font-size:11px; color:#069; text-align:center; padding-top:30px;padding-left:10px;');
        div_splash.setAttribute("id", '$dhx_loading_wheel');
        div_splash.style.width = "233px";
        div_splash.style.height = "21px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight === 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 25) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 121) + "px";
        div_splash.style.zIndex = "999999";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url('" + loading_gif + "')";
        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";
        //$dhx.debug.log('XXXXXXXXXXXXXXXXXXXX');
        //$dhx.debug.log(m);
        div_splash.innerHTML = m;
        //document.getElementById("$dhx_wrapper_loading_wheel").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_loading_wheel") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        } else {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        }
    },
    toWords: function(s) {
        // Convert numbers to words
        // copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
        // permission to use this Javascript on your web page is granted
        // provided that all of the code (including this copyright notice) is
        // used exactly as shown (you can change the numbering system if you wish)
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million', 'milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        //function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] !== 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] !== 0) {
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 === 0) str += 'hundred ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
        //}
    },
    isArray: function(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    },
    isObject: function(what) {
        return ((typeof what == "object") && (what !== null) && (Object.prototype.toString.call(what) !== '[object Array]'));
    },
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isValidDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    toCurrency: function(num) {
        x = 0;
        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num)) num = "0";
        cents = Math.floor((num * 100 + 0.5) % 100);
        num = Math.floor((num * 100 + 0.5) / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        ret = num + '.' + cents;
        if (x == 1) ret = ' - ' + ret;
        return ret;
    },
    getParentByID: function(id) {
        try {
            return document.getElementById(id).parentNode;
        } catch (e) {
            return false;
        }
    },
    /**
        @function parseFloat - Convert currency string to a Javascript Float number

        @parameter currency - string or number for converting to javascript float type
            mandatory

        @parameter places - places after decimal, default: 2
            not mandatory

        @scope $dhx.parseFloat(currency, places);
    */
    parseFloat: function(currency, places) {
        if (typeof places === 'undefined') {
            places = 2;
        }
        currency = currency.replace(",", "");
        return parseFloat(currency).toFixed(places);
    },
    /**

        @function ext

        @parameter parentClass - An Object Literal Class which will be the inherited class, OR, null
            if null, NO Parent Class will be inherited when creating your Class
            mandatory

        @parameter objClass - An Object Literal notation of your Class
            mandatory

        @parameter nameSpaceName - string value holding the namespace path where the created
            Class will be appended as top level, OR false, OR undefined
            not mandory - default: The created object will be appended on the top level of window object

        @return object

    */
    ext: function(parentClass, objClass, nameSpaceName) {
        var self = this,
            ob,
            first_level,
            last_level,
            item;
        if (typeof nameSpaceName === 'undefined') {
            nameSpaceName = false;
        }
        for (var className in objClass) {
            if (nameSpaceName) {
                first_level = true;
                last_level = '';
                
                var aar = nameSpaceName.split(".");
                for( var w = 0; w < aar.length; w++ )
                {
                    var level = aar[ w ],
                        index = w;

                    if (first_level) {
                        window[level] = window[level] || {};
                        //$dhx.debug.log(window[level]);
                        //ob = window[level][className];
                        last_level = window[level];
                        first_level = false;
                    } else {
                        //$dhx.debug.log(last_level);
                        last_level[level] = last_level[level] || {};
                        //$dhx.debug.log(last_level[ level ]);
                        last_level = last_level[level];
                    }
                }
                //$dhx.debug.log(last_level);
                //$dhx.debug.log(className);
                if ((parentClass) && parentClass !== null) {
                    last_level[className] = Object.create(parentClass);
                } else {
                    last_level[className] = {};
                }
                ob = last_level[className];
                for (item in objClass[className]) {
                    last_level[className][item] = last_level[item] || {};
                    last_level[className][item] = objClass[className][item];
                    ob[item] = last_level[className][item];
                }
                //$dhx.debug.log(className);
                //$dhx.debug.log( root.NameSpace.usingNameSpace );
            } else {
                if ((parentClass) && parentClass !== null) window[className] = Object.create(parentClass);
                else window[className] = {};
                ob = window[className];
                for (item in objClass[className]) {
                    ob[item] = objClass[className][item];
                }
            }
        }
        return ob;
    },
    //,utils : {
    // $dhx.utils.shortcut.add(strAtalho, fnCallback);
    /*

        $dhx.addEvent(window, 'popstate', function (event) {
          //event
          //event.state
        });

    */
    addEvent: (function() {
        if (document.addEventListener) {
            return function(el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.addEventListener(type, fn, false);
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        } else {
            return function(el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.attachEvent('on' + type, function() {
                        return fn.call(el, window.event);
                    });
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        }
    })(),
    UTF8: {
        encode: function(s) {
            for (var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l; s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]);
            return s.join("");
        },
        decode: function(s) {
            for (var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
                ((a = s[i][c](0)) & 0x80) && (s[i] = (a & 0xfc) === 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) === 0x80 ? o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = ""));
            return s.join("");
        }
    },
    // From MDN
    notify: function(title, text, img) {
        img = img || 'http://cdn.dhtmlx.com.br/dhx/notify.png';
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            $dhx.debug.log("This browser does not support notifications.");
        }
        // Let's check if the user is okay to get some notification
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(title, {
                body: text,
                icon: img
            });
            //window.navigator.vibrate(500);
        }
        // Otherwise, we need to ask the user for permission
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                // Whatever the user answers, we make sure Chrome stores the information
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                // If the user is okay, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, {
                        body: text,
                        icon: img
                    });
                }
            });
        }
    },
    jDBdStorage: {
        storeObject: function(dataset_name, dataOBJ) {
            $dhx.debug.time("storeObject " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(dataOBJ));
            $dhx.debug.timeEnd("storeObject " + dataset_name);
        },
        insertRecord: function(dataset_name, record, index) {
            var currently_store_string = localStorage[dataset_name];
            var currently_store_object = JSON.parse(currently_store_string);
            currently_store_object.push(record);
            $dhx.jDBdStorage.saveDatabase(dataset_name, currently_data_array);
        },
        saveDatabase: function(dataset_name, payload) {
            $dhx.debug.time("save dataset " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(payload));
            $dhx.debug.timeEnd("save dataset " + dataset_name);
        },
        deleteDatabase: function(dataset_name) {
            $dhx.debug.time("delete dataset " + dataset_name);
            localStorage.removeItem(dataset_name);
            $dhx.debug.timeEnd("delete dataset " + dataset_name);
        },
        get: function(dataset_name) {
            $dhx.debug.time("get local storage " + dataset_name);
            var currently_store_string = localStorage[dataset_name];
            $dhx.debug.timeEnd("get local storage " + dataset_name);
            if (localStorage[dataset_name]) {
                $dhx.debug.time("parse dataset " + dataset_name);
                var parsed = JSON.parse(currently_store_string);
                $dhx.debug.timeEnd("parse dataset " + dataset_name);
                return parsed;
            } else return localStorage[dataset_name];
        },
        getTotalRecords: function(dataset_name) {
            var currently_store_string = localStorage[dataset_name];
            if (localStorage[dataset_name]) {
                var array = JSON.parse(currently_store_string);
                return array.length;
            } else return 0;
        }
    },
    strip_tags: function(str, allowed_tags) {
        var key = '',
            allowed = false;
        var matches = [];
        var allowed_array = [];
        var allowed_tag = '';
        var i = 0;
        var k = '';
        var html = '';
        var replacer = function(search, replace, str) {
            return str.split(search).join(replace);
        };
        // Build allowes tags associative array
        if (allowed_tags) {
            allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
        }
        str += '';
        // Match tags
        matches = str.match(/(<\/?[\S][^>]*>)/gi);
        // Go through all HTML tags
        for (key in matches) {
            if (isNaN(key)) {
                // IE7 Hack
                continue;
            }
            // Save HTML tag
            html = matches[key].toString();
            // Is tag not in allowed list? Remove from str!
            allowed = false;
            // Go through all allowed tags
            for (k in allowed_array) { // Init
                allowed_tag = allowed_array[k];
                i = -1;
                if (i !== 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + '>');
                }
                if (i !== 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + ' ');
                }
                if (i !== 0) {
                    i = html.toLowerCase().indexOf('</' + allowed_tag);
                }
                // Determine
                if (i === 0) {
                    allowed = true;
                    break;
                }
            }
            if (!allowed) {
                str = replacer(html, "", str); // Custom replace. No regexing
            }
        }
        return str;
    },
    isDHTMLXmodified: false,
    modifyDHTMLXloader: function() {
        var self = this;
        if (self.isDHTMLXmodified) {
            return;
        }
        if (window.dhx4 && window.dhx) {
            dhtmlXForm.prototype.items.vault = {
                render: function(a, c) {
                    var self = this;
                    var t = {
                            "parent": '',
                            "uploadUrl": c.uploadUrl || null,
                            "swfUrl": c.swfUrl || null,
                            "slUrl": c.slUrl || null,
                            "swfPath": c.swfPath || "dhxvault.swf",
                            "slXap": c.slXap || "dhxvault.xap",
                            "maxFileSize": c.maxFileSize || 16777216 // 16 MB (mojo default)
                        },
                        uid = dhx.guid();
                    this._vault_wrapper = $dhx.createElement({
                        tag_name: 'DIV',
                        //, parent: false
                        style: 'min-height:100px;',
                        class: '',
                        id: 'vault_wrapper_' + uid,
                        height: c.inputHeight,
                        width: c.inputWidth
                    });
                    t.parent = this._vault_wrapper.id;
                    t.skin = "dhx_skyblue";
                    t.autoStart = (typeof c.autoStart != 'undefined') ? c.autoStart : false; // start upload right after file added
                    t.autoRemove = (typeof c.autoRemove != 'undefined') ? c.autoRemove : false; // remove file from list right after upload done
                    t.buttonUpload = (typeof c.buttonUpload != 'undefined') ? c.buttonUpload : true; // show/do_not_show upload/stop buttons
                    t.buttonClear = (typeof c.buttonClear != 'undefined') ? c.buttonClear : true; // show/do_not_show clear_all button
                    t.filesLimit = (typeof c.filesLimit != 'undefined') ? c.filesLimit : 0; // correspinding number or skip or zero to ignore
                    this._vault[uid] = new dhtmlXVaultObject(t);
                    if (c.note) {
                        if (c.note.text) {
                            c.note.text = c.note.text + "<br> <span style='color:red;'>Max file size: " + this._vault[uid].readableSize(t.maxFileSize) + ". Allowed files: " + c.allowedExtensions + "</span>";
                        } else {
                            c.note.text = "<span style='color:red;'>Max file size: " + this._vault[uid].readableSize(t.maxFileSize) + ". Allowed files: " + c.allowedExtensions + "</span>";
                        }
                    } else {
                        c.note = {
                            text: "<span style='color:red;'>Max file size: " + this._vault[uid].readableSize(t.maxFileSize) + ". Allowed files: " + c.allowedExtensions + "</span>",
                        };
                    }
                    a._type = "vault";
                    a.uid = uid;
                    a._enabled = true;
                    this.doAddLabel(a, c);
                    this.doAddInput(a, c, "DIV", null, true, true, "dhxform_container");
                    this.doAttachEvents(a);
                    this.setValue(a, c.value);
                    this._uploadedFilesList[a.uid] = [];
                    var div = a.childNodes[a._ll ? 1 : 0].childNodes[0];
                    div.style.height = c.inputHeight + 'px';
                    div.appendChild(this._vault_wrapper);
                    if (c.allowedExtensions && c.allowedExtensions !== '') {
                        this._vault[uid].attachEvent("onBeforeFileAdd", function(file) {
                            var ext = this.getFileExtension(file.name);
                            if (typeof ext == 'undefined') {
                                dhtmlx.message({
                                    type: "error",
                                    text: "files without an extension are not allowed."
                                });
                                return false;
                            }
                            if (ext === '' || ext === null) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "files without an extension are not allowed."
                                });
                                return false;
                            }
                            if (c.allowedExtensions.indexOf(ext) > -1) {
                                return true;
                            } else {
                                dhtmlx.message({
                                    type: "error",
                                    text: "the extension ' " + ext + " ' is not allowed."
                                });
                                return false;
                            }
                        });
                    }
                    this._vault[uid].attachEvent("onUploadComplete", function(files) {
                        //self._uploadedFiles = files;
                        /*
                            
                            {
                                id:         123,             // int, internal file ID
                                name:       "filename.ext",  // string, filename detected by browser
                                serverName: "filename2.ext", // string, filename returned by server
                                size:       132500,          // int, file size in bytes
                                uploaded:   true,            // boolean, true/false
                                error:      false            // boolean, error while uploading, if any
                            }
                        */
                        files.forEach(function(file) {
                            if (file.uploaded) {
                                //console.log(file.serverName);
                                if (t.filesLimit) {
                                    if (t.filesLimit == 1) {
                                        //self._uploadedFilesList = [];
                                        self._uploadedFilesList[a.uid] = [];
                                        self._uploadedFilesList[a.uid].push(file.serverName);
                                    } else {
                                        self._uploadedFilesList[a.uid].push(file.serverName);
                                    }
                                } else {
                                    self._uploadedFilesList[a.uid].push(file.serverName);
                                }
                            }
                        });
                    });
                    return this;
                },
                _vault: [],
                _vault_wrapper: null,
                _uploadedFiles: [],
                _uploadedFilesList: [],
                getContainer: function(a) {
                    return this._vault[a.uid];
                },
                getVault: function(a) {
                    //console.log(a.uid)
                    return this._vault[a.uid];
                },
                enable: function(a) {
                    a._enabled = true;
                    if (String(a.className).search("disabled") >= 0) {
                        a.className = String(a.className).replace(/disabled/gi, "");
                    }
                    a.callEvent("onEnable", [a._idd]);
                    this._vault[a.uid].enable();
                },
                disable: function(a) {
                    a._enabled = false;
                    if (String(a.className).search("disabled") < 0) {
                        a.className += " disabled";
                    }
                    a.callEvent("onDisable", [a._idd]);
                    this._vault[a.uid].disable();
                },
                doAttachEvents: function() {},
                setValue: function(a, v) {
                    //console.log(a, v);
                    if (typeof v == 'string') {
                        if (v.length > 0) {
                            v = v.replace(/ /g, '');
                            this._uploadedFilesList[a.uid] = v.split(',');
                        }
                    }
                },
                getValue: function(a) {
                    return this._uploadedFilesList[a.uid].join(',');
                }
            };
            dhtmlXForm.prototype.getVault = function(a) {
                return this.doWithItem(a, "getVault");
            };
            (function() {
                for (var c in dhtmlXForm.prototype.items.input) {
                    if (!dhtmlXForm.prototype.items.vault[c]) {
                        dhtmlXForm.prototype.items.vault[c] = dhtmlXForm.prototype.items.input[c];
                    }
                }
            })();
            dhtmlXForm.prototype.setFormData = function(g) {
                for (var c in g) {
                    var j = this.getItemType(c);
                    switch (j) {
                        case "checkbox":
                            this[g[c] === true || parseInt(g[c]) == 1 || g[c] == "true" || g[c] == this.getItemValue(c, "realvalue") ? "checkItem" : "uncheckItem"](c);
                            break;
                        case "radio":
                            this.checkItem(c, g[c]);
                            break;
                        case "input":
                        case "textarea":
                        case "password":
                        case "select":
                        case "multiselect":
                        case "hidden":
                        case "template":
                        case "combo":
                        case "calendar":
                        case "vault":
                        case "colorpicker":
                        case "editor":
                            this.setItemValue(c, g[c]);
                            break;
                        default:
                            if (this["setFormData_" + j]) {
                                this["setFormData_" + j](c, g[c]);
                            } else {
                                if (!this.hId) {
                                    this.hId = this._genStr(12);
                                }
                                this.setUserData(this.hId, c, g[c]);
                            }
                            break;
                    }
                }
            };
            dhtmlXForm.prototype.getFormData = function(w, m) {
                var c = {};
                var s = this,
                    v;
                for (v in this.itemPull) {
                    var o = this.itemPull[v]._idd;
                    var x = this.itemPull[v]._type;
                    if (x == "ch") {
                        c[o] = (this.isItemChecked(o) ? this.getItemValue(o) : 0);
                    }
                    if (x == "ra" && !c[this.itemPull[v]._group]) {
                        c[this.itemPull[v]._group] = this.getCheckedValue(this.itemPull[v]._group);
                    }
                    if (x in {
                            se: 1,
                            ta: 1,
                            pw: 1,
                            hd: 1,
                            tp: 1,
                            fl: 1,
                            calendar: 1,
                            combo: 1,
                            editor: 1,
                            colorpicker: 1,
                            vault: 1
                        }) {
                        c[o] = this.getItemValue(o, w);
                    }
                    if (this["getFormData_" + x]) {
                        c[o] = this["getFormData_" + x](o);
                    }
                    if (x == "up") {
                        var l = this.getItemValue(o);
                        for (var j in l) {
                            c[j] = l[j];
                        }
                    }
                    if (this.itemPull[v]._list) {
                        for (var g = 0; g < this.itemPull[v]._list.length; g++) {
                            var n = this.itemPull[v]._list[g].getFormData(w, m);
                            for (var u in n) {
                                c[u] = n[u];
                            }
                        }
                    }
                }
                if (!m && this.hId && this._userdata[this.hId]) {
                    for (v in this._userdata[this.hId]) {
                        if (!c[v]) {
                            c[v] = this._userdata[this.hId][v];
                        }
                    }
                }
                return c;
            };
            dhtmlXGridObject.prototype.dhxPDF = function(j, r, w, u, o, C, appId) {
                var l = {
                    row: this.getSelectedRowId(),
                    col: this.getSelectedCellIndex()
                };
                if (l.row === null || l.col === -1) {
                    l = false;
                } else {
                    if (l.row && l.row.indexOf(this.delim) !== -1) {
                        var c = this.cells(l.row, l.col).cell;
                        c.parentNode.className = c.parentNode.className.replace(" rowselected", "");
                        c.className = c.className.replace(" cellselected", "");
                        l.el = c;
                    } else {
                        l = false;
                    }
                }
                r = r || "color";
                var x = r == "full_color";
                var a = this;
                a._asCDATA = true;
                if (typeof(C) === "undefined") {
                    this.target = ' target="_blank"';
                } else {
                    this.target = C;
                }
                eXcell_ch.prototype.getContent = function() {
                    return this.getValue();
                };
                eXcell_ra.prototype.getContent = function() {
                    return this.getValue();
                };

                function A(F) {
                    var M = [],
                    K, J;
                    for (K = 1; K < a.hdr.rows.length; K++) {
                        M[K] = [];
                        for (J = 0; J < a._cCount; J++) {
                            var O = a.hdr.rows[K].childNodes[J];
                            if (!M[K][J]) {
                                M[K][J] = [0, 0];
                            }
                            if (O) {
                                M[K][O._cellIndexS] = [O.colSpan, O.rowSpan];
                            }
                        }
                    }
                    var L = "<rows profile='" + F + "'";
                    if (w) {
                        L += " header='" + w + "'";
                    }
                    if (u) {
                        L += " footer='" + u + "'";
                    }
                    L += "><head>" + a._serialiseExportConfig(M).replace(/^<head/, "<columns").replace(/head>$/, "columns>");
                    for (K = 2; K < a.hdr.rows.length; K++) {
                        var D = 0;
                        var S = a.hdr.rows[K];
                        var N = "";
                        for (J = 0; J < a._cCount; J++) {
                            if ((a._srClmn && !a._srClmn[J]) || (a._hrrar[J] && (!a._fake || J >= a._fake.hdrLabels.length))) {
                                D++;
                                continue;
                            }
                            var Q = M[K][J];
                            var P = ((Q[0] && Q[0] > 1) ? ' colspan="' + Q[0] + '" ' : "");
                            if (Q[1] && Q[1] > 1) {
                                P += ' rowspan="' + Q[1] + '" ';
                                D = -1;
                            }
                            var E = "";
                            var I = S;
                            if (a._fake && J < a._fake._cCount) {
                                I = a._fake.hdr.rows[K];
                            }
                            for (var H = 0; H < I.cells.length; H++) {
                                if (I.cells[H]._cellIndexS == J) {
                                    if (I.cells[H].getElementsByTagName("SELECT").length) {
                                        E = "";
                                    } else {
                                        E = _isIE ? I.cells[H].innerText : I.cells[H].textContent;
                                    }
                                    E = E.replace(/[ \n\r\t\xA0]+/, " ");
                                    break;
                                }
                            }
                            if (!E || E == " ") {
                                D++;
                            }
                            N += "<column" + P + "><![CDATA[" + E + "]]></column>";
                        }
                        if (D != a._cCount) {
                            L += "\n<columns>" + N + "</columns>";
                        }
                    }
                    L += "</head>\n";
                    L += q();
                    return L;
                }

                function g() {
                    var D = [], E;
                    if (o) {
                        for (E = 0; E < o.length; E++) {
                            D.push(v(a.getRowIndex(o[E])));
                        }
                    } else {
                        for (E = 0; E < a.getRowsNum(); E++) {
                            D.push(v(E));
                        }
                    }
                    return D.join("\n");
                }

                function q() {
                    var F = ["<foot>"];
                    if (!a.ftr) {
                        return "";
                    }
                    for (var H = 1; H < a.ftr.rows.length; H++) {
                        F.push("<columns>");
                        var K = a.ftr.rows[H];
                        for (var E = 0; E < a._cCount; E++) {
                            if (a._srClmn && !a._srClmn[E]) {
                                continue;
                            }
                            if (a._hrrar[E] && (!a._fake || E >= a._fake.hdrLabels.length)) {
                                continue;
                            }
                            var J,I;
                            for (var D = 0; D < K.cells.length; D++) {
                                J = "";
                                I = "";
                                if (K.cells[D]._cellIndexS == E) {
                                    J = _isIE ? K.cells[D].innerText : K.cells[D].textContent;
                                    J = J.replace(/[ \n\r\t\xA0]+/, " ");
                                    if (K.cells[D].colSpan && K.cells[D].colSpan != 1) {
                                        I = " colspan='" + K.cells[D].colSpan + "' ";
                                    }
                                    if (K.cells[D].rowSpan && K.cells[D].rowSpan != 1) {
                                        I = " rowspan='" + K.cells[D].rowSpan + "' ";
                                    }
                                    break;
                                }
                            }
                            F.push("<column" + I + "><![CDATA[" + J + "]]></column>");
                        }
                        F.push("</columns>");
                    }
                    F.push("</foot>");
                    return F.join("\n");
                }

                function n(E, D) {
                    return (window.getComputedStyle ? (window.getComputedStyle(E, null)[D]) : (E.currentStyle ? E.currentStyle[D] : null)) || "";
                }

                function v(H) {
                    if (!a.rowsBuffer[H]) {
                        return "";
                    }
                    var D = a.render_row(H);
                    if (D.style.display == "none") {
                        return "";
                    }
                    var E = a.isTreeGrid() ? ' level="' + a.getLevel(D.idd) + '"' : "";
                    var L = "<row" + E + ">";
                    for (var J = 0; J < a._cCount; J++) {
                        if (((!a._srClmn) || (a._srClmn[J])) && (!a._hrrar[J] || (a._fake && J < a._fake.hdrLabels.length))) {
                            var P = a.cells(D.idd, J);
                            if (x) {
                                var I = n(P.cell, "color");
                                var O = n(P.cell, "backgroundColor");
                                var N = n(P.cell, "font-weight") || n(P.cell, "fontWeight");
                                var K = n(P.cell, "font-style") || n(P.cell, "fontStyle");
                                var M = n(P.cell, "text-align") || n(P.cell, "textAlign");
                                var F = n(P.cell, "font-family") || n(P.cell, "fontFamily");
                                if (O == "transparent" || O == "rgba(0, 0, 0, 0)") {
                                    O = "rgb(255,255,255)";
                                }
                                L += "<cell bgColor='" + O + "' textColor='" + I + "' bold='" + N + "' italic='" + K + "' align='" + M + "' font='" + F + "'>";
                            } else {
                                L += "<cell>";
                            }
                            L += "<![CDATA[" + (P.getContent ? P.getContent() : P.getTitle()) + "]]></cell>";
                        }
                    }
                    return L + "</row>";
                }

                function s() {
                    var D = "</rows>";
                    return D;
                }

                function complete() {
                    var y = document.createElement("div");
                    y.style.height = "100%";
                    y.style.width = "100%";
                    var pdf_name = "grid_" + appId + '.pdf';
                    y.id = new Date().getTime();
                    var dhx_pdf_window = new $dhx.ui.window({
                        id: new Date().getTime() - 1000,
                        left: $dhx.ui.crud.simple.View.settings.app_generic.window.left,
                        top: $dhx.ui.crud.simple.View.settings.app_generic.window.top,
                        width: 800,
                        height: 500,
                    });
                    dhx_pdf_window.button('park').hide();
                    dhx_pdf_window.button('minmax').hide();
                    dhx_pdf_window.button('stick').hide();
                    dhx_pdf_window.setText("Grid PDF version");
                    var dhx_pdf_status_bar = dhx_pdf_window.attachStatusBar();
                    dhx_pdf_status_bar.setText('Press ctrl+p (cmd+p Mac) to print it');
                    //y.style.display = "none";
                    document.body.appendChild(y);
                    var m = "form_" + a.uid();
                    y.innerHTML = '<iframe name="pdfFrame" width="100%" height="100%" frameborder="0"></iframe><form style="display:none;" id="' + m + '" method="post" action="' + j + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="pdfFrame"><input type="hidden" name="grid_xml" id="grid_xml"/><input type="hidden" name="viewer" id="viewer" value="' + $dhx.ui.cdn_address + 'dhx/ui/pdfjs/web/viewer.php?pdf_name=' + $dhx.ui.cdn_address + 'dhx/ui/bin/2pdf/' + pdf_name + '"/><input type="hidden" name="pdf_name" id="pdf_name" value="' + pdf_name + '"/> </form>';
                    dhx_pdf_window.attachObject(y.id);
                    document.getElementById(m).firstChild.value = encodeURIComponent(A(r).replace("\u2013", "-") + g() + s());
                    document.getElementById(m).submit();
                    //y.parentNode.removeChild(y);
                    a = null;
                    if (l) {
                        l.el.parentNode.className += " rowselected";
                        l.el.className += " cellselected";
                    }
                    l = null;
                }
                complete();
            };
            self.isDHTMLXmodified = true;
            $dhx.debug.log("some dhtmlx methods were modified");
        }
    },
    /**
        @function init -  performs all the necessary tasks before let the user to use the $dhx object
    */
    init: function(c) {
        var self = this;
        if (typeof $dhx.Request !== 'undefined') {
            if ($dhx.$_GET("_enable_log") !== null) {
                if ($dhx.$_GET("_enable_log") == "true") $dhx._enable_log = true;
                $dhx.debug.log("%c $dhx framework started ", 'background: #00ebbe; color: #fff; font-size: 12px; padding: 12px; line-height: 36px; font-family: Helvetica, Arial, sans-serif;');
            }
            if ($dhx.$_GET("_enable_benchmark") !== null) {
                if ($dhx.$_GET("_enable_benchmark") == "true") $dhx._enable_benchmark = true;
            }
        }
        //$dhx.debug.log(
        //      "%c under the hood, guy? why? \n\n\n thank you for reading my code", 
        //      'background: red; color: #fff; font-size: 30px; padding: 30px; line-height: 36px; font-family: Helvetica, Arial, sans-serif;'
        //  );
        $dhx.debug.info('starting $dhx');
        self.Browser.init();
        if (typeof c !== 'undefined') {
            if (c.plugins) {}
        }
        if (!self.isDHTMLXmodified) {
            self.modifyDHTMLXloader();
        }
    },
    toArray: function(obj) {
        var array = [];
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                array.push(obj[index]);
            }
        }
        return array;
    },
    extend: function(parent, child) {
        if (typeof child === 'undefined') {
            child = {};
        }
        if (!$dhx.isObject(child)) {
            child = {};
        }
        if (typeof parent === 'undefined') {
            parent = {};
        }
        if (!$dhx.isObject(parent)) {
            parent = {};
        }
        for (var i in parent) {
            if (parent.hasOwnProperty(i)) {
                child[i] = parent[i];
            }
        }
        return child;
    },
    dhx_elements: {},
    _ppc: false,
    popup: function() {
        if ($dhx._ppc === false) {
            $dhx._ppc = new dhtmlXPopup();
        }
        return $dhx._ppc;
    },
    createElement: function(c) {
        //$dhx.debug.log( JSON.stringify(c)  )
        var element = document.createElement(c.tag_name),
            id = c.id || 'el_' + window.dhx4.newId();
        element.setAttribute('style', c.style || '');
        element.setAttribute('class', c.class || '');
        $dhx.dhx_elements[id] = c;
        element.setAttribute('id', id);
        if (typeof $dhx.dhx_elements[id].parent != 'undefined' && $dhx.dhx_elements[id].parent !== false) {
            $dhx.dhx_elements[id].parent.appendChild(element);
        } else if (typeof $dhx.dhx_elements[id].parent != 'undefined' && $dhx.dhx_elements[id].parent === false) {} else {
            document.body.appendChild(element);
        }
        if (c.title) {
            element.addEventListener('mouseover', function(event) {
                //$dhx.debug.log(event);
                $dhx.popup().attachHTML(c.title);
                $dhx.popup().show(event.clientX, event.clientY, element.style.width.replace(/px/, ''), element.style.height.replace(/px/, '')); //params are: x, y, width, height
            });
            element.addEventListener('mouseout', function() {
                $dhx.popup().hide();
            });
        }
        if ($dhx.dhx_elements[id].html) {
            element.innerHTML = $dhx.dhx_elements[id].html;
        }
        if ($dhx.dhx_elements[id].dnd) {
            //alert();
            element.draggable = true;
        }
        //draggable
        if ($dhx.dhx_elements[id].width) element.style.width = $dhx.dhx_elements[id].width + 'px';
        if ($dhx.dhx_elements[id].height) element.style.height = $dhx.dhx_elements[id].height + 'px';
        window.addEventListener('resize', function() {
            for (var id in $dhx.dhx_elements) {
                var element = document.getElementById(id);
                if (typeof $dhx.dhx_elements[id].resize_width === 'undefined') {
                    $dhx.dhx_elements[id].resize_width = false;
                }
                if (typeof $dhx.dhx_elements[id].resize_height === 'undefined') {
                    $dhx.dhx_elements[id].resize_height = false;
                }
                if ($dhx.dhx_elements[id].resize_width === true) {
                    element.style.width = window.innerWidth + 'px';
                } else if ($dhx.isNumber($dhx.dhx_elements[id].resize_width) && $dhx.dhx_elements[id].resize_width !== false) {
                    element.style.width = window.innerWidth + ($dhx.dhx_elements[id].resize_width) + 'px';
                }
                if ($dhx.dhx_elements[id].resize_height === true) {
                    element.style.height = window.innerHeight + 'px';
                } else if ($dhx.isNumber($dhx.dhx_elements[id].resize_height) && $dhx.dhx_elements[id].resize_height !== false) {
                    element.style.height = window.innerHeight + ($dhx.dhx_elements[id].resize_height) + 'px';
                }
                //$dhx.debug.log(element);
                //$dhx.debug.log($dhx.dhx_elements[ id ].resize_height);
                //$dhx.debug.log($dhx.dhx_elements[ id ].resize_width);
            }
            //if($dhx.dhx_elements[ id ].resize_height) element.style.height = $dhx.dhx_elements[ id ].resize_height() + 'px';
        }, true);
        //$dhx.debug.log(element);
        return element;
    },
    defined: function(what, type) {
        what = what || false;
        type = type || false;
        if (what) {
            if (!type) {
                if (typeof what == 'undefined') return false;
                if (what === null) return false;
                if (what === false) return false;
                return true;
            } else {
                if (typeof type != 'string') return false;
                if (typeof what == type) return true;
                return false;
            }
        }
        return false;
    },
    queryString: function(name, url) {
        if (!url) url = window.location.href;
        //url = url.replace(/#/gi,'');
        //console.log( url );
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    debug: {
        log: function() {
            if ($dhx.queryString("_enable_log")) console.log(arguments);
        },
        info: function() {
            if ($dhx.queryString("_enable_log")) console.info(arguments);
        },
        debug: function() {
            if ($dhx.queryString("_enable_log")) console.debug(arguments);
        },
        error: function() {
            if ($dhx.queryString("_enable_log")) console.error(arguments);
        },
        dir: function() {
            if ($dhx.queryString("_enable_log")) console.dir(arguments);
        },
        time: function(label) {
            if ($dhx._enable_benchmark) console.time(label);
        },
        timeEnd: function(label) {
            if ($dhx._enable_benchmark) console.timeEnd(label);
        },
        warn: function() {
            if ($dhx.queryString("_enable_log")) console.warn(arguments);
        }
    }
});
Object.defineProperty($dhx, 'CDN', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: '//cdn.dhtmlx.com.br/',
    enumerable: true,
    configurable: false,
    writable: false
});
Object.defineProperty($dhx, 'version', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: "1.0.0",
    enumerable: true,
    configurable: false,
    writable: false
});
Object.defineProperty($dhx, 'Author', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: 'José Eduardo Perotta de Almeida (www.web2solutions.com.br)',
    enumerable: true,
    configurable: false,
    writable: false
});
window.onload = function() {
    $dhx.init();
};
$dhx.cookie = {
    set: function(sKey, sValue, vEnd, bSecure) {
        var sPath = false,
            sDomain = window.location.hostname;
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=." + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    del: function(sKey, sPath, sDomain) {
        var self = $dhx.cookie;
        sPath = sPath || false;
        sDomain = sDomain || window.location.hostname;
        if (!self.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    setByKey: function(cookieName, keyName, value, lngDays) {
        var self = $dhx.cookie;
        try {
            var thisCookies = unescape(self.get(cookieName));
            if (thisCookies) {
                thisCookies = thisCookies.split("&");
                ///for(){
                thisCookies.forEach(function(cookie, index, array) {
                    cookie = cookie.split("=");
                    //$dhx.debug.log(cookie[0]);
                    //$dhx.debug.log(cookie);
                    if (cookie[0] == keyName) {
                        return;
                    }
                });
                var newcookie = self.get(cookieName) + "&" + keyName + "=" + value + "";
                self.set(cookieName, newcookie, lngDays);
            } else {
                self.set(cookieName, "" + keyName + "=" + value + "", 360);
            }
            return true;
        } catch (e) {
            //$dhx.debug.error(e.message, e.stack);;
            return false;
        }
    },
    get: function(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    getByKey: function(cookiename, cookiekey) {
        var self = $dhx.cookie;
        try {
            var cookievalue = self.get(cookiename);
            if (cookievalue === "") return false;
            try {
                cookievaluesep = cookievalue.split("&");
            } catch (e) {
                return false;
            }
            for (c = 0; c < cookievaluesep.length; c++) {
                cookienamevalue = cookievaluesep[c].split("=");
                if (cookienamevalue.length > 1) //it has multi valued cookie
                {
                    if (cookienamevalue[0] == cookiekey) return unescape(cookienamevalue[1].toString().replace(/\+/gi, " "));
                } else return false;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
};