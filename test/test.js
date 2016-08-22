var clickElement = function(el) {
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent("click", true /* bubble */ , true /* cancelable */ , window, null, 0, 0, 0, 0, /* coordinates */ false, false, false, false, /* modifier keys */ 0 /*left*/ , null);
    el.dispatchEvent(ev);
};

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
    //it('app.main_presenter should be a object', function() {
    //    console.log( 'XXXXXXXX app.main_presenter ', app.main_presenter  );
    //    console.log( 'XXXXXXXX app.main_presenter ', typeof app.main_presenter  );
    //    app.main_presenter.should.be.an.Object;
    //});
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
    describe('dispatching route help -> ', function() {
        it(' app.active_route should be help/:id:', function() {
            app.main_view.dispatch('help');
            (app.active_route).should.equal('help/:id:');
        });

        it(' help view should be defined', function() {
            ($dhx.ui.mvp.views.get('help')? true : false).should.be.ok;
        });

        it(' active cell in DHTMLX sidebar should be help', function() {
            (app.main_view.sidebar.items("help").isActive() ? true : false).should.be.ok;
        });

    });

    describe('dispatching route # -> ', function() {
        it(' app.active_route should be #', function() {
            app.main_view.dispatch('#');
            (app.active_route).should.equal('#');
        });
        it(' active cell in DHTMLX sidebar should be #', function() {
            (app.main_view.sidebar.items("#").isActive() ? true : false).should.be.ok;
        });
    });

    describe('dispatching route help/1 -> ', function() {
        it(' app.active_route should be help/:id:', function() {
            app.main_view.dispatch('help/1');
            (app.active_route).should.equal('help/:id:');
        });

        it(' active cell in DHTMLX sidebar should be help', function() {
            (app.main_view.sidebar.items("help").isActive() ? true : false).should.be.ok;
        });
    });
});