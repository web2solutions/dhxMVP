//$dhx.addEvent(window, 'load', function (event) {
    
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
        console.log('fired onBeforeStart event 1');

        //$dhx.debug.log('options ', options);
        return true; // cancelable
    });


    dhx_application.on('start', function(options) {
        console.log('fired onStart event');
        //$dhx.debug.log('options ', options);
    });

    dhx_application.on('render', function(options) {
        console.log('fired onRender event');
        app.main_view.dispatch( '/help' )
        //$dhx.debug.log('options ', options);
    });

    // instantiate $dhx MVP application and router
    var app = new dhx_application({
            appId: "MV* DHTMLX Demo app",
            container: document.body,
            root: '',
            icons_path: 'assets/icons/64/'
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
        url: '/help'
    });


    app.start();

//});