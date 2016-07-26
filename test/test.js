var clickElement = function(el) {
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent("click", true /* bubble */ , true /* cancelable */ , window, null, 0, 0, 0, 0, /* coordinates */ false, false, false, false, /* modifier keys */ 0 /*left*/ , null);
    el.dispatchEvent(ev);
};
//clickElement($("#menuItemToClick")[0]);
var dhx_application = $dhx.ui.mvp.application.extend({
        initialize: function(options) {
            //$dhx.debug.log('called initialize from factory');
            //$dhx.debug.log('app initialized from ' + options.from );
        }
    }),
    dhx_router = $dhx.ui.mvp.router.extend({}),
    router = new dhx_router({});
// lets use the events
dhx_application.on('before:start', function(options) {
    console.info('Fired onBeforeStart event');
    //$dhx.debug.log('options ', options);
    return true; // cancelable
});
dhx_application.on('start', function(options) {
    console.info('fired onStart event');
});
dhx_application.on('render', function(options) {
    console.log('fired onRender event');
    console.log('##==== Running Mocha now ====##')
    mocha.run();
    //$dhx.debug.log('options ', options);
});
// instantiate $dhx MVP application and router
var app = new dhx_application({
    appId: "MV* DHTMLX Demo app",
    container: document.body,
    root: '../',
    icons_path: '../assets/icons/64/'
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
mocha.setup('bdd');
describe('testing DOM -> ', function() {
    describe('app.container - ', function() {
        it('should be defined', function() {
            (app.container ? true : false).should.be.ok;
        });
        it('should be a object', function() {
            app.container.should.be.an.Object;
        });
        it('should be a valid HTML element', function() {
            (app.container.nodeName ? true : false).should.equal(true);
        });
        it('should be a BODY or DIV html element', function() {
            (app.container.nodeName).should.equal('BODY' || 'DIV');
        });
    });
});
describe('testing application structure -> ', function() {
    it('app.main_presenter should be defined', function() {
        (app.main_presenter ? true : false).should.be.ok;
    });
    it('app.main_presenter should be a object', function() {
        app.main_presenter.should.be.an.Object;
    });
    it('app.main_presenter should refer to a model', function() {
        app.main_presenter.model.should.be.an.Object;
    });
    it('app.main_view should be defined', function() {
        (app.main_view ? true : false).should.be.ok;
    });
    it('app.main_view should be a object', function() {
        app.main_view.should.be.an.Object;
    });
    it('app.main_view should refer to a model', function() {
        app.main_view.model.should.be.an.Object;
    });
});
describe('testing application router -> ', function() {
    describe('dispatching /help - ', function() {
        it(' app.active_route should be /help', function() {
            app.main_view.dispatch('/help');
            (app.active_route).should.equal('/help');
        });
    });
});