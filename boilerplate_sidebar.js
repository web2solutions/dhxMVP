var app;
document.addEventListener('DOMContentLoaded', function() {

    //$dhx.environment = "production";

    var dhx_application = $dhx.ui.mvp.application.extend({
        initialize: function(options) {
            //$dhx.debug.log('called initialize from factory');
            //$dhx.debug.log('app initialized from ' + options.from );
        }
    }),
        dhx_router = $dhx.ui.mvp.router.extend({ }),
        router = new dhx_router({});

    // lets use the events
    dhx_application.on('before:start', function(options) {
        console.log('fired app.onBeforeStart event 1');

        //$dhx.debug.log('options ', options);
        return true; // cancelable
    });


    dhx_application.on('start', function(options) {
        console.log('fired app.onStart event');
        //$dhx.debug.log('options ', options);
    });

    dhx_application.on('render', function(options) {
        console.log('fired app.onRender event');
        //app.main_view.dispatch( '/help' );
        //$dhx.debug.log('options ', options);
    });

    // instantiate $dhx MVP application and router
    app = new dhx_application({
            appId: "MV* DHTMLX Demo app",
            container: document.body,
            root: '',
            //icons_path: '../assets/icons/64/', // not mandatory, default root + 'assets/icons/64/'
            //deps_path: '../deps/', // not mandatory, default root + 'deps/'
            //lib_path: '../lib/', // not mandatory, default root + 'lib/'
            model:{
                engine: 'backboneIDB',
                models: [
                    "user",
                    "question",
                    //"pet",
                    "customer",
                    "customer_type",
                    "ip",
                    "provider",
                    "server"
                ],
                collections: [
                    "users",
                    "questions",
                    //"pets",
                    "customers",
                    "customer_types",
                    "ips",
                    "providers",
                    "servers"
                ]
            }
        });

    /*
        How to declare a route:

        Properties:
        url: Route address starting with "/". Mandatory
        view: will assume url.replace(/\//g,'') as view name if view not explicitly defined
        presenter: will assume url.replace(/\//g,'') as presenter name if presenter not explicitly defined
        method: implicity call view.start() if not explicitly defined
    
        router.route({
            url: '/route_name',
            view: 'view_file_name',
            presenter: 'presenter_file_name',
            method: 'start_method_name', // implicity call presenter.start() if not explicitly defined
            append_views: [
                { "chatter" : 'chatter_view' }
            ]
        });

     */

    router.route({
        url: 'help/:id:',
        view: 'help',
        presenter: 'help',
    });


    router.route({
        url: 'providers',
        view: 'providers',
        presenter: 'providers',
        append_views: [
            { "ip" : 'ips' },
            { "servers" : 'servers' }
        ]
    });


    router.route({
        url: 'customers',
        view: 'customers',
        presenter: 'customers',
    });

    router.route({
        url: 'customer_types',
        view: 'customer_types',
        presenter: 'customer_types',
    });

    


    app.start({
        backboneIDB: true,
        $dhx_form: true,
        $dhx_grid: true,
        $dhx_crypt: true
    });
});    