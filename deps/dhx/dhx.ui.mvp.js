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
            this.icons_path = stash.icons_path || stash.root + 'assets/icons/64/';
            this.deps_path = stash.deps_path || stash.root + 'deps/';
            this.lib_path = stash.lib_path || stash.root + 'lib/';
            this.stash = stash;
            root = stash.root;
            //this.options = {};
            _options = stash;
            _options.from = 'super';
            var isAllEventsReturninOk = namespace.triggerMethod('before:start', _options);
            if (!isAllEventsReturninOk) {
                throw ' application will not initialize due a onBeforeStart event returning false';
            }
            this.initialize(_options);
            this.active_route = false;
            this.last_active_route = false;
            _application = this;
        },
        /**
         * [router private router constructor]
         * @param  {[Object]} stash [xxxxxxxxxxx]
         * @return {[Object]}       [returns an router object]
         */
        router = function(stash) {
            var self = this;
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
                _router.dispatch(id, true);
                if (this.onDispatch) this.onDispatch(id);
            };
            _main_view = this;
        },
        /**
         * [private view constructor]
         * @param  {[type]} stash [description]
         * @return {[view]}   view    [description]
         */
        child_view = function(factory) {
            child_view = namespace.copyTo(child_view, factory);
            this.appId = _application.appId;
            this.container = _application.container;
            this.root = _application.root;
            this.icons_path = _application.icons_path;
        },
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
        start: function(c) {
                var hash = window.location.hash,
                    deps = [],
                    core = [],
                    models = [],
                    model_engine = [],
                    model,
                    presenter,
                    view;
                c = c || {};
                core.push(_application.lib_path + "presenter/" + ($dhx.environment != 'test' ? "min." : "") + "presenter.js");
                core.push(_application.lib_path + "view/" + ($dhx.environment != 'test' ? "min." : "") + "view.js");
                deps.push("http://cdn.dhtmlx.com/edge/dhtmlx.css");
                deps.push("http://cdn.dhtmlx.com/edge/dhtmlx.js");






                deps.push(_application.deps_path + "thirdparty/signals.js");
                deps.push(_application.deps_path + "thirdparty/hasher.js");
                deps.push(_application.deps_path + "thirdparty/crossroads.js");
                deps.push(_application.deps_path + "dhx/min.dhx.MQ.js");
                deps.push(_application.deps_path + "dhx/dhx.ui.router.js");
                if (c.full) {
                    deps.push(_application.deps_path + "thirdparty/jquery.min.js");
                    deps.push("https://cdn.jsdelivr.net/pouchdb/5.4.5/pouchdb.min.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.ui.i18n.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.ui.i18n.en-us.js");
                    deps.push(_application.deps_path + "thirdparty/moment.min.js");
                    deps.push(_application.deps_path + "thirdparty/moment-timezone-with-data.min.js");
                    deps.push(_application.deps_path + "dhx/min.dhtmlx_grid_moment_type.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.excells.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.crypt.js");
                    //deps.push(_application.deps_path + "thirdparty/creditcard.min.js");
                    //deps.push(_application.deps_path + "thirdparty/min.progressbar.js");
                    //deps.push("https://js.stripe.com/v2/");
                    deps.push(_application.deps_path + "thirdparty/ie10-viewport-bug-workaround.js");
                    deps.push(_application.deps_path + "thirdparty/min.underscore.js");
                    deps.push(_application.deps_path + "thirdparty/backbone-min.js");
                    deps.push(_application.deps_path + "thirdparty/min.backbone-indexeddb.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.component.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.dhtmlx.js");
                    deps.push(_application.deps_path + "dhx/min.dhx.ui.form.js");
                } else {
                    if (c.stripe) {
                        deps.push("https://js.stripe.com/v2/");
                    }
                    if (c.pouch) {
                        deps.push("https://cdn.jsdelivr.net/pouchdb/5.4.5/pouchdb.min.js");
                    }
                    if (c.backboneIDB) {
                        deps.push(_application.deps_path + "thirdparty/min.underscore.js");
                        deps.push(_application.deps_path + "thirdparty/backbone-min.js");
                        deps.push(_application.deps_path + "thirdparty/min.backbone-indexeddb.js");
                    }
                    if (c.$dhx_crypt) {
                        deps.push(_application.deps_path + "dhx/min.dhx.crypt.js");
                    }
                    if (c.$dhx_grid || c.$dhx_form) {
                        deps.push(_application.deps_path + "thirdparty/jquery.min.js");
                        deps.push(_application.deps_path + "dhx/min.dhx.ui.i18n.js");
                        deps.push(_application.deps_path + "dhx/min.dhx.ui.i18n.en-us.js");
                        deps.push(_application.deps_path + "thirdparty/moment.min.js");
                        deps.push(_application.deps_path + "thirdparty/moment-timezone-with-data.min.js");
                        deps.push(_application.deps_path + "dhx/min.dhtmlx_grid_moment_type.js");
                        deps.push(_application.deps_path + "dhx/min.dhx.component.js");
                        deps.push(_application.deps_path + "thirdparty/creditcard.min.js");
                    }
                    if (c.$dhx_grid) {
                        deps.push(_application.deps_path + "dhx/min.dhx.excells.js");
                    }
                    if (c.$dhx_form) {
                        deps.push(_application.deps_path + "dhx/min.dhx.dhtmlx.js");
                        deps.push(_application.deps_path + "dhx/min.dhx.ui.form.js");
                    }
                }
                if (_application.stash.model.models) {
                    _application.stash.model.models.forEach(function(file) {
                        models.push(_application.lib_path + "model/models/" + ($dhx.environment != 'test' ? "min." : "") + "" + file + ".js");
                    });
                }
                if (_application.stash.model.collections) {
                    _application.stash.model.collections.forEach(function(file) {
                        models.push(_application.lib_path + "model/collections/" + ($dhx.environment != 'test' ? "min." : "") + "" + file + ".js");
                    });
                }
                if (_application.stash.model.engine) {
                    model_engine = [
                        _application.lib_path + "model/engines/" + ($dhx.environment != 'test' ? "min." : "") + "" + _application.stash.model.engine + ".js"
                    ];
                } else {
                    _application.stash.model.engine = 'backboneIDB';
                    model_engine = [
                        _application.lib_path + "model/engines/" + ($dhx.environment != 'test' ? "min." : "") + "" + _application.stash.model.engine + ".js"
                    ];
                }
                // load dep files
                $dhx.onDemand.require(deps, function() {
                    // import models and collections files
                    $dhx.onDemand.require(models, function() {
                        // import models engine file
                        $dhx.onDemand.require(model_engine, function() {
                            $dhx.onDemand.require(core, function() {
                                namespace.start_all();
                            }); // end $dhx.onDemand.require(core, function() 
                        }); // end $dhx.onDemand.require(model_engine, function() 
                    }); // end  $dhx.onDemand.require(models, function() 
                }); // end $dhx.onDemand.require(deps, function() 
            } // end application.start()
    };
    /**
     * [router.prototype MVP router constructor class prototype chain]
     * @type {Object}
     */
    router.prototype = {
        dispatch: function(route, addEntry) {
            var router = this.router;
            //console.info('Dispatching route: ', route);
            if( route != '#' )
            {
                $dhx.ui.router.routeTo(route);
                $dhx.ui.router.router.resetState();
            }
            else
            {
                window.location.hash = '/';
                _application.active_route = route;
            }
            

            //console.log('router: ', _router);
            
        },
        route: function(stash) {
            this.routes[stash.url] = stash;
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
                console.log('start from extend factory');
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
    namespace.start_all = function() {
        namespace.setup_routes();
        namespace.setup_models();
        namespace.setup_collections();
        namespace.start_model();
    };
    namespace.setup_routes = function() {
        var route_handler = function( o ) {
                    
        };

        console.log( _router.routes );
        // declare routes
        for (var route in _router.routes) {
            if (route != '#') {
                console.info('Route setup: ', route);
                $dhx.ui.router.addRoute(route, route_handler);
            }
        }
    };


    namespace.start_model = function() {
        var presenter = $dhx.ui.mvp.presenters.get('presenter'),
            view = $dhx.ui.mvp.views.get('view'),
            model = $dhx.ui.mvp.model.engine.get(_application.stash.model.engine);
        model.start({
            onSuccess: function() {
                    console.info('model started');
                    model.schema.start({
                        onSuccess: function() {
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
                            if (!namespace.app_started) {
                                namespace.start_app();
                            }
                        }
                    }); // end model.schema.start
                } // end onSuccess
        }); // end model.start
    };
    namespace.setup_models = function() {
        // for each model
        _application.stash.model.models.forEach(function(modelName) {
            // declare model
            var model = {};
            model[modelName] = (function(model) {
                'strict';
                return model;
            }(window[modelName]));
            $dhx.ui.mvp.model.declare(model);
        });
    };
    namespace.setup_collections = function() {
        // for each collection
        _application.stash.model.collections.forEach(function(collectionName) {
            // declare collection
            var collection = {};
            collection[collectionName] = (function(collection) {
                'strict';
                collection.defaults = $dhx.ui.mvp.model.get(collection.model);
                collection.item = collection.model;
                return collection;
            }(window[collectionName]));
            $dhx.ui.mvp.model.collection.declare(collection);
        });
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
    namespace.app_started = false;
    namespace.start_app = function() {
        var current_url = $dhx.ui.router.request_url || '';
        if (current_url == '#/') {
            current_url = '';
        }
        if (current_url !== '') {
            current_url = current_url.toString().replace(/#/, '');
        }
        _router.dispatch('#');
        $dhx.ui.mvp.presenters.get('presenter').start();
        namespace.triggerMethod('start', _options);
        // start all $dhx dependence
        if ($dhx.ui.i18n) $dhx.ui.i18n.start();
        if ($dhx.excells) $dhx.excells.init();
        // when current url is not root, when starting with calling a sub view:
        if (current_url !== '') {
            _router.presenter._view.render({
                onSuccess: function(c) {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                    
                    $dhx.ui.mvp.views.get('view').dispatch(current_url);

                    if (c.onComplete) c.onComplete(current_url);
                },
                ok: function(c) {
                    namespace.triggerMethod('render', _options);
                    $dhx.ui.mvp.views.get('view').rendered = true;
                    
                    $dhx.ui.mvp.views.get('view').dispatch(current_url);

                    if (c.onComplete) c.onComplete(current_url);
                },
                onFail: function() {},
            });
        } else {
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
        namespace.app_started = true;
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
    namespace.loadModule = function( dispatched_route, data ) {
        var method_name = 'start',
            router = _router,
            routes = router.routes,
            route = null,
            route_matched = false,
            ev = eval,
            reg = ev(data.route._matchRegexp),
            remove = [];

        //console.log( dispatched_route );
        //console.log( data );
        //console.log( data.route._optionalParamsIds );
        //console.log( data.route._paramsIds );
        //console.log( data.route._pattern );

        for( var r in router.routes )
        {
            if( reg.test(r) )
            {
                route_matched = true;
            }
        }

        if( ! route_matched )
        {
            throw 'Undeclared ' + dispatched_route + ' route';
        }


        //remove = data.route._optionalParamsIds.map( function(){
        //    
        //} );
        
        
        route = data.route._pattern;
        //console.log( 'dispatched_route: ', dispatched_route );
        //console.log( 'internal matched route: ', route );


        if (route in router.routes) {
            if (router.routes[route].method) {
                method_name = router.routes[route].method;
            }
        } else {
            throw 'Undeclared ' + route + ' route';
        }


        // destroy last active view
        if (_application.active_route && _application.active_route != '#' && _application.active_route != route) {
            _application.last_active_route = _application.active_route;
            _child_presenters[_application.last_active_route].destroy();
            _child_views[_application.last_active_route].destroy();
            $dhx.MQ.unsubscribe(_child_views[_application.last_active_route]._subscriber_presenter_token);
            $dhx.MQ.unsubscribe(_child_presenters[_application.last_active_route]._subscriber_model_token);
            $dhx.MQ.unsubscribe(_child_presenters[_application.last_active_route]._subscriber_view_token);
            _child_views[_application.last_active_route] = null;
            _child_presenters[_application.last_active_route] = null;
            delete _child_views[_application.last_active_route];
            delete _child_presenters[_application.last_active_route];
        }

        // set global active_route value
        _application.active_route = route;



        // if active route is not first route(#)
        if (route != '#') {
            // If not explicity defined, then implicity set Presenter and View names by using route name
            routes[route].presenter = routes[route].presenter || route;
            routes[route].view = routes[route].view || route;
        }


        // this route has a predefined presenter
        if (routes[route].presenter) {
            var deps = [];
            if (routes[route].view) {
                deps.push(_application.lib_path + "view/" + ($dhx.environment != 'test' ? "min." : "") + routes[route].view + ".js");
            }
            deps.push(_application.lib_path + "presenter/" + ($dhx.environment != 'test' ? "min." : "") + routes[route].presenter + ".js");
            // import auxiliar views
            if (routes[route].append_views) {
                routes[route].append_views.forEach(function(stash) {
                    deps.push(_application.lib_path + "view/" + ($dhx.environment != 'test' ? "min." : "") + stash[Object.keys(stash)[0]] + ".js");
                });
            }
            $dhx.onDemand.load(deps, function() {
                _child_presenters[route] = $dhx.ui.mvp.presenters.get(routes[route].presenter);
                _child_views[route] = $dhx.ui.mvp.views.get(routes[route].view);
                // import auxiliar views as new object into currently namespace scope
                if (routes[route].append_views) {
                    routes[route].append_views.forEach(function(stash) {
                        _child_views[route][Object.keys(stash)[0]] = window[stash[Object.keys(stash)[0]]];
                    });
                }
                _child_presenters[route]._view = _child_views[route];
                _child_presenters[route]._view._wrapper = _main_view._wrapper;
                _child_presenters[route]._view.app = {
                    mainView: $dhx.ui.mvp.views.get('view'),
                    _child_presenters: _child_presenters,
                    _child_views: _child_views
                };
                _child_presenters[route]._view.window_manager = _main_view.window_manager;
                _child_presenters[route].model = _router.presenter._model;
                _child_presenters[route].view = _child_views[route];
                if (!_child_presenters[route]._model) {
                    _child_presenters[route]._model = _router.presenter._model;
                }
                _child_presenters[route] = setBusChannel(_child_presenters[route]);
                _child_views[route].model = _router.presenter._model;
                _child_views[route].presenter = _child_presenters[route];
                // start presenter
                _child_presenters[route].start();
                //initialize view
                _child_views[route].initialize();
                // render view
                _child_views[route].render(_router.presenter._model, _child_presenters[route]);
                $dhx.MQ.publish(_child_presenters[route].topic, {
                    action: 'start',
                    target: null
                });
            });
        } else {
            // this route has not a predefined presenter
            // like #
            // $dhx.ui.mvp.presenters.get('presenter')
            //if (router.presenter[method_name]) {
            //    router.presenter[method_name]();
            //} else if (_router[method_name]) {
            //    _router[method_name]();
            //}
        }
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
    namespace.models = {
        models: [],
        declare: function(c) {
            var model_name = Object.keys(c)[0];
            model_name = model_name.toString().replace(/\//g, '');
            namespace.models.models[model_name] = c[model_name];
        },
        get: function(model_name) {
            model_name = model_name.toString().replace(/\//g, '');
            return namespace.models.models[model_name] || false;
        }
    };
    namespace.model = {
        _collections: {},
        collection: {
            declare: function(c) {
                var collection_name = Object.keys(c)[0];
                collection_name = collection_name.toString().replace(/\//g, '');
                namespace.model._collections[collection_name] = c[collection_name];
            },
            get: function(collection_name) {
                collection_name = collection_name || false;
                if (collection_name) {
                    collection_name = collection_name.toString().replace(/\//g, '');
                    return namespace.model._collections[collection_name] || false;
                } else {
                    return namespace.model._collections;
                }
            }
        },
        _engines: {},
        engine: {
            declare: function(c) {
                var core_name = Object.keys(c)[0];
                core_name = core_name.toString().replace(/\//g, '');
                namespace.model._engines[core_name] = c[core_name];
            },
            get: function(core_name) {
                core_name = core_name.toString().replace(/\//g, '');
                return namespace.model._engines[core_name] || false;
            }
        },
        _models: {},
        declare: function(c) {
            var model_name = Object.keys(c)[0];
            model_name = model_name.toString().replace(/\//g, '');
            namespace.model._models[model_name] = c[model_name];
        },
        get: function(model_name) {
            if (model_name) {
                model_name = model_name.toString().replace(/\//g, '');
                return namespace.model._models[model_name] || false;
            }
            return namespace.model._models;
        },
        helpers: {
            schema: {
                record: function(c) {
                    var self = this,
                        attributes = {},
                        reject = ['_id', 'id', '__v'],
                        model_schema = namespace.model.get(c.model);
                    c.record = JSON.parse(JSON.stringify(c.record));
                    for (var record_field in c.record) {
                        if (!reject.contains(record_field)) {
                            // if field is declared in schema
                            if (record_field in model_schema) {
                                attributes[record_field] = c.record[record_field];
                            } else {
                                //console.warn('ignoring field ' + record_field);
                            }
                        }
                    }
                    for (var model_field_obj_key in model_schema) {
                        if (!reject.contains(model_field_obj_key)) {
                            // if attributes already have model_field_obj_key declared
                            if (typeof attributes[model_field_obj_key] !== 'undefined') {
                                // check it type if it matches the type declared on schema
                                if (typeof attributes[model_field_obj_key] !== model_schema[model_field_obj_key].type.toLowerCase()) {
                                    console.warn('error creating record object');
                                    throw 'Invalid type for ' + model_field_obj_key + '. It should be ' + model_schema[model_field_obj_key].type.toLowerCase() + ', but you passed ' + typeof attributes[model_field_obj_key];
                                }
                                // check it format if it matches the validate.rules declared on schema
                                if (model_schema[model_field_obj_key].validate.required || (model_schema[model_field_obj_key].validate.rules || "").indexOf('NotEmpty') > -1) {
                                    //console.log( 'IS MANDATORY'  );
                                    //console.log( 'attributes[ model_field_obj_key ]: ', attributes[ model_field_obj_key ]  );
                                    if (attributes[model_field_obj_key] === "" || attributes[model_field_obj_key] === null) {
                                        console.warn('error creating record object');
                                        throw 'You need to provide a value for ' + model_field_obj_key + '. It should be ' + model_schema[model_field_obj_key].type.toLowerCase() + '.';
                                    }
                                }
                                //console.log('------XXX-------');
                            } else {
                                console.info('setting default value (' + model_schema[model_field_obj_key].default+') for ' + model_field_obj_key);
                                // append field and use it default value
                                attributes[model_field_obj_key] = model_schema[model_field_obj_key].default;
                            }
                        }
                    }
                    //console.log(model_schema);
                    if (c.record.__v) {
                        attributes.__v = c.record.__v;
                    }
                    if (c.record.id) {
                        attributes.id = c.record.id;
                    }
                    if (c.record._id) {
                        attributes._id = c.record._id;
                    }
                    for (var i in attributes) {
                        self[i] = attributes[i];
                    }
                    //console.warn( 'formated record: ', self );
                },
                defaults: {
                    __v: {
                        type: 'number',
                        default: 0,
                        unique: false,
                        validate: {
                            required: true,
                            mask_to_use: '',
                            rules: ''
                        },
                        ui: {
                            form: {
                                label: '__v',
                                type: 'hidden',
                            },
                            grid: {
                                header: '__v',
                                align: 'left',
                                coltype: 'ro',
                                width: '0'
                            }
                        }
                    },
                    _id: {
                        type: 'string',
                        default: 0,
                        unique: true,
                        validate: {
                            required: true,
                            mask_to_use: '',
                            rules: ''
                        },
                        ui: {
                            form: {
                                label: '_id',
                                type: 'hidden',
                            },
                            grid: {
                                header: '_id',
                                align: 'left',
                                coltype: 'ro',
                                width: '0'
                            }
                        }
                    }
                }
            }
        }
    };
})($dhx.ui.mvp = $dhx.ui.mvp || {});