(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});
(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});
(function(namespace) {
    'use strict';
    var root,
        _application,
        _router,
        _main_view,
        _child_view,
        _child_views = [],
        _child_presenters = [],
        _registered_events = [],
        _options = {},
        _root_topic = '',
        _presenter_topic = '',
        _model_topic = '',
        /**
         * [application private application bootstrap constructor]
         * @param  {[Object]} stash [xxxxxxxxxxx]
         * @return {[Object]}       [returns an router object]
         */
        application = function(stash) {
            var appId;
            if (typeof stash.appId === 'undefined') {
                stash.appId = "" + Math.random() + "";
            }
            //application = namespace.copyTo(application, stash);
            this.appId = stash.appId;
            this.container = stash.container;
            this.root = stash.root;
            this.icons_path = stash.icons_path;
            
            root = stash.root;
            //this.options = {};
            _options = stash;
            _options.from = 'super';
            var isAllEventsReturninOk = namespace.triggerMethod('before:start', _options);
            if (!isAllEventsReturninOk) {
                throw ' application will not initialize due a onBeforeStart event returning false';
            }
            this.initialize(_options);
            
            _application = this;
        },
        /**
         * [router private router constructor]
         * @param  {[Object]} stash [xxxxxxxxxxx]
         * @return {[Object]}       [returns an router object]
         */
        router = function(stash) {
            var self = this;
            ////console.log('ROUTER:: router object created');
            // lets listen for browser navigate actions
            window.addEventListener("popstate", function(e) {
                //console.log( 'document.location.hash', document.location.hash);
                if( document.location.hash.replace(/#/gi, '').toString().length > 2 ) _router.presenter._view.dispatch(document.location.hash.replace(/#/gi, ''));
                //self.dispatch(e.state.url, true);
            });
            _router = this;
        },
        /**
         * [private view constructor]
         * @param  {[type]} stash [description]
         * @return {[view]}   view    [description]
         */
        main_view = function(factory) {
            ////console.log( _application );
            //main_view = namespace.copyTo(main_view, _application);
            main_view = namespace.copyTo(main_view, factory);
            this.appId = _application.appId;
            this.container = _application.container;
            this.root = _application.root;
            this.icons_path = _application.icons_path;
            this.dispatch = function(id) {
                try {
                    _main_view._wrapper.cells(id.split('?')[0]).setActive();
                    window.dhx4.callEvent("onSidebarSelect", [id.split('?')[0], _main_view._wrapper.cells(id.split('?')[0])]);
                } catch (e) {
                    console.log(e.stack);
                }
                _main_view._router.dispatch(id, true);
            };
            //this.presenter = _router.presenter;
            ////console.log( _router.presenter );
            _main_view = this;
        },
        /**
         * [private view constructor]
         * @param  {[type]} stash [description]
         * @return {[view]}   view    [description]
         */
        child_view = function(factory) {
            //console.log( factory );
            //console.log( active_route );
            //console.log( _child_presenters[active_route] );
            //child_view = namespace.copyTo(child_view, _application);
            child_view = namespace.copyTo(child_view, factory);
            this.appId = _application.appId;
            this.container = _application.container;
            this.root = _application.root;
            this.icons_path = _application.icons_path;
            this.dispatch = function(id) {
                try {
                    _main_view._wrapper.cells(id.split('?')[0]).setActive();
                    window.dhx4.callEvent("onSidebarSelect", [id.split('?')[0], _main_view._wrapper.cells(id.split('?')[0])]);
                } catch (e) {
                    console.log(e.stack);
                }
                _main_view._router.dispatch(id, true);
            };
            //this.presenter = _child_presenters[active_route];
            ////console.log( _router.presenter );
            //this.initialize();
            //_child_view = this;
        },
        /**
         * [active_route list of routes that are being active. Active routes are displayed on browser's URL bar]
         * @type {Array}
         */
        active_route = false,
        last_active_route = false,
        /**
         * [create communication bus between presenter, model and view]
         * @param {[Presenter]} presenter [description]
         */
        setBusChannel = function(presenter) {
            presenter.topic = _application.appId + '.presenter';
            presenter._view.topic = _application.appId + '.view';
            presenter._model.topic = _application.appId + '.model';
            //alert(_root_topic);
            // make presenter to listen both model and view
            presenter._subscriber = presenter._subscriber || function(topic, data) {
                //console.log('presenter._subscriber . message: ' + topic, data);
                if (topic == presenter._view.topic) {
                    // message from view
                } else if (topic == presenter._model.topic) {
                    // message from model
                }
            };
            presenter._subscriber_view_token = $dhx.MQ.subscribe(presenter._view.topic, presenter._subscriber);
            presenter._subscriber_model_token = $dhx.MQ.subscribe(presenter._model.topic, presenter._subscriber);
            // make view listen to presenter
            presenter._view._subscriber = presenter._view._subscriber || function(topic, data) {
                //console.log('presenter._view._subscriber message: ' + topic, data);
            };
            presenter._view._subscriber_presenter_token = $dhx.MQ.subscribe(presenter.topic, presenter._view._subscriber);
            // make model listen to presenter
            presenter._model._subscriber = presenter._model._subscriber || function(topic, data) {
                ////console.log('presenter._model._subscriber message: ' + topic, data);
            };
            presenter._model._subscriber_presenter_token = $dhx.MQ.subscribe(presenter.topic, presenter._model._subscriber);
            return presenter;
        };
    /**
     * [application.prototype MVP aplication bootstrap constructor class prototype chain]
     * @type {Object}
     */
    application.prototype = {
        initialize: function(options) {
            //console.log('method from application.prototype');
            ////console.log('app initialized from ' + options.from);
            //namespace.triggerMethod('start', options);
        },
        start: function( c ) {
            var hash = window.location.hash,
                deps = [],
                core = [
                    _application.root + "lib/view/" + ($dhx.environment != 'test' ? "min." : "") + "view.js", 
                    _application.root + "lib/model/" + ($dhx.environment != 'test' ? "min." : "") + "model.js", 
                    _application.root + "lib/presenter/" + ($dhx.environment != 'test' ? "min." : "") + "presenter.js"];
            c = c || {};
            deps.push(_application.root + "lib/thirdparty/codebase5.0_std/dhtmlx.css");
            deps.push(_application.root + "lib/thirdparty/codebase5.0_std/dhtmlx.js");
            

            deps.push(_application.root + "lib/dhx/min.dhx.MQ.js");

            if( c.full )
            {
                deps.push(_application.root + "lib/thirdparty/jquery.min.js");
                deps.push("https://cdn.jsdelivr.net/pouchdb/5.4.5/pouchdb.min.js");
                deps.push(_application.root + "lib/dhx/min.dhx.ui.i18n.js");
                deps.push(_application.root + "lib/dhx/min.dhx.ui.i18n.en-us.js");

                deps.push(_application.root + "lib/thirdparty/moment.min.js");
                deps.push(_application.root + "lib/thirdparty/moment-timezone-with-data.min.js");
                deps.push(_application.root + "lib/dhx/min.dhtmlx_grid_moment_type.js");
                deps.push(_application.root + "lib/dhx/min.dhx.excells.js");
                deps.push(_application.root + "lib/dhx/min.dhx.crypt.js");
                //deps.push(_application.root + "lib/thirdparty/creditcard.min.js");
                //deps.push(_application.root + "lib/thirdparty/min.progressbar.js");
                //deps.push("https://js.stripe.com/v2/");
                //deps.push(_application.root + "lib/thirdparty/ie10-viewport-bug-workaround.js");
                //deps.push(_application.root + "lib/thirdparty/min.underscore.js");
                //deps.push(_application.root + "lib/thirdparty/backbone-min.js");
                //deps.push(_application.root + "lib/thirdparty/min.backbone-indexeddb.js");
                
                deps.push(_application.root + "lib/dhx/min.dhx.component.js");
                deps.push(_application.root + "lib/dhx/min.dhx.dhtmlx.js");
                deps.push(_application.root + "lib/dhx/min.dhx.ui.form.js");
            }
            else
            {

                
                if( c.stripe )
                {
                    deps.push("https://js.stripe.com/v2/");
                }

                if( c.pouch )
                {
                    deps.push("https://cdn.jsdelivr.net/pouchdb/5.4.5/pouchdb.min.js");
                }

                if( c.backboneIDB )
                {
                    deps.push(_application.root + "lib/thirdparty/min.underscore.js");
                    deps.push(_application.root + "lib/thirdparty/backbone-min.js");
                    deps.push(_application.root + "lib/thirdparty/min.backbone-indexeddb.js");
                }

                if( c.$dhx_crypt )
                {
                    deps.push(_application.root + "lib/dhx/min.dhx.crypt.js");
                }

                if( c.$dhx_grid || c.$dhx_form  )
                {
                    deps.push(_application.root + "lib/thirdparty/jquery.min.js");
                    deps.push(_application.root + "lib/dhx/min.dhx.ui.i18n.js");
                    deps.push(_application.root + "lib/dhx/min.dhx.ui.i18n.en-us.js");
                    deps.push(_application.root + "lib/thirdparty/moment.min.js");
                    deps.push(_application.root + "lib/thirdparty/moment-timezone-with-data.min.js");
                    deps.push(_application.root + "lib/dhx/min.dhtmlx_grid_moment_type.js");
                    deps.push(_application.root + "lib/dhx/min.dhx.component.js");
                    deps.push(_application.root + "lib/thirdparty/creditcard.min.js");
                }

                if( c.$dhx_grid  )
                {
                    deps.push(_application.root + "lib/dhx/min.dhx.excells.js");
                }

                if( c.$dhx_form  )
                {
                    deps.push(_application.root + "lib/dhx/min.dhx.dhtmlx.js");
                    deps.push(_application.root + "lib/dhx/min.dhx.ui.form.js");
                }
            }

            $dhx.onDemand.require(deps, function() {

                $dhx.onDemand.require(core, function() {

                    var presenter = $dhx.ui.mvp.presenters.get('presenter'),
                        view = $dhx.ui.mvp.views.get('view');
                    view.model = model;
                    view.rendered = false;
                    view.initialize();
                    presenter._view = view;
                    presenter.view = view;
                    presenter._model = model;
                    presenter.model = model;
                    presenter = setBusChannel(presenter);

                    
                    

                    _application.presenters = $dhx.ui.mvp.presenters;
                    _application.views = $dhx.ui.mvp.views;

                    ////console.log( presenter );
                    _router.presenter = presenter;
                    view._router = _router;
                    view.presenter = presenter;


                    _application.main_presenter = presenter;
                    _application.main_view = view;

                    /**
                     * dispatch root '#' url
                     */
                    if (!namespace.first_dispatched) {
                        namespace.first_dispatch();
                    }
                });
            });
        }
    };
    /**
     * [router.prototype MVP router constructor class prototype chain]
     * @type {Object}
     */
    router.prototype = {
        dispatch: function(route, addEntry) {
            var self = this,
                method_name = 'start';
            //console.log( route );
            var url = route.split("?")[0];
            if (url in this.routes) {
                if (this.routes[url].method) {
                    method_name = this.routes[url].method;
                }
            } else {
                throw 'Undeclared ' + url + ' route';
            }


            ////console.log('XXXXXXXX ', method_name);
            //if (typeof method_name === 'undefined') {
            //    throw 'can not dispatch to a not declared route. URL: ' + url;
            //}
            ////console.log('dispatching ' + url);
            ////console.log('active_route: ', active_route);
            // destroy last active view
            if (active_route && active_route != '#') {
                last_active_route = active_route;
                //console.log( last_active_route );
                //console.log(_child_presenters[last_active_route]);
                //console.log( _child_views[last_active_route] );
                try {
                    _child_presenters[last_active_route].destroy();
                    _child_views[last_active_route].destroy();
                    $dhx.MQ.unsubscribe(_child_views[last_active_route]._subscriber_presenter_token);
                    $dhx.MQ.unsubscribe(_child_presenters[last_active_route]._subscriber_model_token);
                    $dhx.MQ.unsubscribe(_child_presenters[last_active_route]._subscriber_view_token);
                } catch (e) {
                    //      Uncaught TypeError: Cannot read property 'destroy' of undefined
                    //      getting this issue when calling a route that uses a wrapper of another route, ex.: 
                    //      /service_reques_update using wrapper from /service_request 
                }
                _child_views[last_active_route] = null;
                _child_presenters[last_active_route] = null;
                delete _child_views[last_active_route];
                delete _child_presenters[last_active_route];
                ////console.log('_child_presenters[' + last_active_route + '] destroyed');
            }
            active_route = url;
            if (addEntry === true) {
                // Add History Entry using pushState
                //if (!active_route.contains(url)) {
                var data = {
                        url: active_route
                    },
                    hash = window.location.hash,
                    title = active_route;
                ////console.log( window.location.href );
                //console.log( namespace.queryString("_enable_log") );
                //console.log( namespace.queryString("item", route) );
                // $dhx.ui.mvp.queryString("item", route)
                var queryString = '?';
                if (namespace.queryString("_enable_log", route) == 'true') {
                    queryString += "_enable_log=true";
                }
                if (namespace.queryString("item", route) !== null && namespace.queryString("item", route) !== '') {
                    queryString += (queryString == '?') ? ("item=" + namespace.queryString("item", route)) : ("&item=" + namespace.queryString("item", route));
                }
                if (queryString == '?') {
                    queryString = '';
                }
                //console.log( 'queryString: ', queryString );
                history.pushState(data, title, (active_route == '#' ? active_route + queryString : '#' + active_route + queryString));
                //active_route = [];
                //window.location.replace("http://www.xxxx.com");
                //}
            }
            // if active route is not first route(#)
            if (active_route != '#') {
                // If not explicity defined, then implicity set Presenter and View names by using route_name.replace(/\//g,'')
                this.routes[active_route].presenter = this.routes[active_route].presenter || url.replace(/\//g, '');
                this.routes[active_route].view = this.routes[active_route].view || url.replace(/\//g, '');
            }
            // this route has a predefined presenter
            if (this.routes[active_route].presenter) {
                var deps = [];
                if (this.routes[active_route].view) {
                    deps.push( _application.root + "lib/view/" + ($dhx.environment != 'test' ? "min." : "") + this.routes[active_route].view + ".js");
                }
                deps.push(  _application.root + "lib/presenter/" + ($dhx.environment != 'test' ? "min." : "") + this.routes[active_route].presenter + ".js");
                // import auxiliar views
                if (this.routes[active_route].append_views) {
                    this.routes[active_route].append_views.forEach(function(stash) {
                        deps.push( _application.root + "lib/view/" + ($dhx.environment != 'test' ? "min." : "") + stash[Object.keys(stash)[0]] + ".js");
                    });
                }
                $dhx.onDemand.load(deps, function() {
                    _child_presenters[active_route] = $dhx.ui.mvp.presenters.get(self.routes[active_route].presenter);
                    _child_views[active_route] = $dhx.ui.mvp.views.get(self.routes[active_route].view);
                    //_child_views[active_route]._model = model;
                    // import auxiliar views as new object into currently namespace scope
                    if (self.routes[active_route].append_views) {
                        self.routes[active_route].append_views.forEach(function(stash) {
                            _child_views[active_route][Object.keys(stash)[0]] = window[stash[Object.keys(stash)[0]]];
                        });
                    }
                    _child_presenters[active_route]._view = _child_views[active_route];
                    _child_presenters[active_route]._view._wrapper = _main_view._wrapper;
                    _child_presenters[active_route]._view.app = {
                        mainView: $dhx.ui.mvp.views.get('view'),
                        _child_presenters: _child_presenters,
                        _child_views: _child_views
                    };
                    _child_presenters[active_route]._view.window_manager = _main_view.window_manager;
                    _child_presenters[active_route].model = _router.presenter._model;
                    _child_presenters[active_route].view = _child_views[active_route];
                    if (!_child_presenters[active_route]._model) {
                        _child_presenters[active_route]._model = _router.presenter._model;
                    }
                    _child_presenters[active_route] = setBusChannel(_child_presenters[active_route]);
                    _child_views[active_route].model = _router.presenter._model;
                    _child_views[active_route].presenter = _child_presenters[active_route];
                    // start presenter
                    _child_presenters[active_route].start();
                    //initialize view
                    _child_views[active_route].initialize();
                    // render view
                    _child_views[active_route].render(_router.presenter._model, _child_presenters[active_route]);
                    $dhx.MQ.publish(_child_presenters[active_route].topic, {
                        action: 'start',
                        target: null
                    });
                });
            } else {
                // this route has not a predefined presenter
                // like #
                if (this.presenter[method_name]) {
                    this.presenter[method_name]();
                } else if (_router[method_name]) {
                    _router[method_name]();
                }
            }

            _application.active_route = active_route;
        },
        route: function(stash) {
            ////console.log('STASH ', stash)
            this.routes[stash.url] = stash;
            ////console.log(this.routes);
            ////console.log(stash);
        }
    };
    main_view.prototype = {
        initialize: function(options) {
            //console.log(' initialize  method from main_view.prototype');
            ////console.log('app initialized from ' + options.from);
            //namespace.triggerMethod('start', options);
        }
    };
    child_view.prototype = {
        initialize: function(options) {
            //console.log(' initialize  method from child_view.prototype');
            ////console.log('app initialized from ' + options.from);
            //namespace.triggerMethod('start', options);
        }
    };
    /**
     * [$dhx.ui.mvp.router Public access to MVP router features]
     * @type {Object}
     */
    namespace.router = {
        /**
         * [extend generate a new router constructor by inheriting the mvp router and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            var start = function() {
                //console.log('start from extend factory');
            };
            return namespace.extend({
                base: router,
                factory: factory,
                onBeforeExtend: function(factory) {
                    /**
                     * [factory a collection of public properties and methods]
                     * @type {[Object}
                     */
                    factory = factory || {};
                    // set a presenter class if it was not set when extending the router
                    factory.presenter = factory.presenter || {
                        start: start
                    };
                    // set a start method for the presenter if it was not set when extending the router
                    factory.presenter.start = factory.presenter.start || start;
                    // set a empty collection of application routes if it was not set when extending the router
                    //factory.appRoutes = factory.appRoutes || {};
                    //set a empty collection of routes created on the fly if it was not set when extending the router
                    factory.routes = factory.routes || {};
                    ////console.log(  '>>>>>XXX>>>>>> ', factory );
                    // map root route that will call the presenter.start();
                    if (!factory.routes.hasOwnProperty('#')) {
                        factory.routes['#'] = {
                            url: '#',
                            method: 'start'
                        };
                    }
                }
            });
        }
    };
    /**
     * [$dhx.ui.mvp.application public access to MVP application bootstrap]
     * @type {Object}
     */
    namespace.application = {
        /**
         * [extend generate a new application bootrap constructor by inheriting the mvp application schema and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            return namespace.extend({
                base: application,
                factory: factory,
                onBeforeExtend: function() {}
            });
        }
    };
    namespace.main_view = {
        /**
         * [extend generate a new application bootrap constructor by inheriting the mvp application schema and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            return namespace.extend({
                base: main_view,
                factory: factory,
                onBeforeExtend: function() {}
            });
        }
    };
    namespace.child_view = {
        /**
         * [extend generate a new application bootrap constructor by inheriting the mvp application schema and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            return namespace.extend({
                base: child_view,
                factory: factory,
                onBeforeExtend: function() {}
            });
        }
    };
    namespace.queryString = function(name, url) {
        if (!url) url = window.location.href;
        //url = url.replace(/#/gi,'');
        ////console.log( url );
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    namespace.first_dispatched = false;
    namespace.first_dispatch = function() {
        var current_url = window.location.hash || '';
        if (current_url) {
            current_url = current_url.toString().replace(/#/, '');
        }
        _router.dispatch('#', true);
        namespace.triggerMethod('start', _options);
        // start all $dhx dependence
        if( $dhx.ui.i18n ) $dhx.ui.i18n.start();
        if( $dhx.excells ) $dhx.excells.init();

        // when current url is not root, when starting with calling a sub view:
        if (current_url.indexOf('/') != -1)
        {
            _router.presenter._view.render({
                onSuccess: function() {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                    $dhx.ui.mvp.views.get('view').dispatch(current_url);

                },
                ok: function() {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                    $dhx.ui.mvp.views.get('view').dispatch(current_url);

                },
                onFail: function() {},
            });
        }
        else
        {
            _router.presenter._view.render({
                onSuccess: function() {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                },
                ok: function() {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                },
                onFail: function() {},
            });
            
        }

        
        $dhx.MQ.publish(_router.presenter.topic, {
            action: 'start',
            target: null
        });
        namespace.first_dispatched = true;
    };
    /**
     * [$dhx.ui.mvp.extend generate a new constructor by inheriting a base class and appending the methods from a factory]
     * @param  {[Object]} c [A JSON object containing the following properties and methods]
     * @param  {[Constructor]}      c.base [a constructor function to be used as base class ]
     * @param  {[Object]}           c.factory [a collection of public properties and methods to be appended to the new generated constructor]
     * @return {[Constructor]} constructor [returns a new object constructor that inherits the base class and the factory]
     */
    namespace.extend = function(c) {
        var base = c.base,
            factory = c.factory,
            sub = null;
        if (c.onBeforeExtend) {
            c.onBeforeExtend(factory);
        }
        sub = function(stash) {
            stash = stash || {};
            base.call(this, stash);
        };
        sub.prototype = Object.create(base.prototype);
        sub.prototype.constructor = sub;
        sub = namespace.copyTo(sub, factory);
        sub.on = function(pattern, fn) {
            ////console.log('instanceof base: ', (instanceof base) )
            _registered_events.push({
                pattern: pattern,
                fn: fn,
                base: base
            });
        };
        sub.start = function(options) {
            _options = options;
        };
        return sub;
    };
    namespace.copyTo = function(base, factory) {
        for (var name in factory) {
            if (factory.hasOwnProperty(name)) {
                base.prototype[name] = factory[name];
            }
        }
        return base;
    };
    namespace.triggerMethod = function() {
        var event = arguments[0],
            parameter = arguments[1] || false,
            tests = [];
        _registered_events.forEach(function(evtObject) {
            if (evtObject.pattern === event) {
                if (parameter) {
                    tests.push(evtObject.fn(parameter));
                } else {
                    tests.push(evtObject.fn());
                }
            }
        });
        return tests.join('.').indexOf('false') > -1 ? false : true;
    };
    namespace.views = {
        views: [],
        declare: function(c) {
            var view_name = Object.keys(c)[0];
            view_name = view_name.toString().replace(/\//g, '');
            namespace.views.views[view_name] = c[view_name];
        },
        get: function(view_name) {
            view_name = view_name.toString().replace(/\//g, '');
            return namespace.views.views[view_name] || false;
        }
    };
    namespace.presenters = {
        presenters: [],
        declare: function(c) {
            var view_name = Object.keys(c)[0];
            view_name = view_name.toString().replace(/\//g, '');
            namespace.presenters.presenters[view_name] = c[view_name];
        },
        get: function(view_name) {
            view_name = view_name.toString().replace(/\//g, '');
            return namespace.presenters.presenters[view_name] || false;
        }
    };
})($dhx.ui.mvp = $dhx.ui.mvp || {});