# dhxMVP  

[![NPM version](https://badge.fury.io/js/dhxmvp.png)](http://badge.fury.io/js/dhxmvp) [![Build Status](https://travis-ci.org/web2solutions/dhxMVP.svg?branch=master)](https://travis-ci.org/web2solutions/dhxMVP) ![Dependency Status](https://gemnasium.com/web2solutions/dhxMVP.png) [![License GPL-2.0](http://b.repl.ca/v1/License-GPL--2.0-brightgreen.png)](https://github.com/web2solutions/dhxMVP/blob/master/LICENSE) 

dhxMVP is a boilerplater system for building MV* DHTMLX applications.


- [Why another MV* implementation](#why-another-mv-implementation)
- [Kit installation](#kit-installation)
- [What the boilerplate provides?](#what-the-boilerplate-provides)
- [Boilerplate architecture](#boilerplate-architecture)
- [How to use the boilerplate to get my application done?](#how-to-use-the-boilerplate-to-get-my-application-done)
    - [Setup development environment](#setup-development-environment)
    - [The application `main` View](#the-application-main-view)
    - [The application `main` Presenter](#the-application-main-presenter)
    - [The application Model](#the-application-model)
    - [Declaring routes](#declaring-routes)
        - [Child Views](#child-views)
        - [Child Presenters](#child-presenters)
    - [Software validation and code automation](#software-validation-and-code-automation)
        - [Code quality](#code-quality)
            - [Run JSHint to check the code and look for error and bad pratices](#run-jshint-to-check-the-code-and-look-for-error-and-bad-pratices)
        - [Unit Tests](#unit-tests)
        - [Deploy](#deploy)
            - [Creating minified version of the application javascript files](#creating-minified-version-of-the-application-javascript-files)
            - [Build a distribution](#build-a-distribution)
        - [Application distributing](#application-distributing)
            - [Creating Mac installers](#creating-mac-installers)
            - [Creating Windows installers](#creating-windows-installers)
            - [Creating Linux installers](#creating-linux-installers)
    - [Move to production](#move-to-production)

- [License](#license)




##### 


##### 


##### 


## Why another MV* implementation?

[DHTMLX framework](http://www.dhtmlx.com) does NOT provides any MV* solution, or even implement any complex design pattern in their component calls. Rather than the facade pattern used in several frameworks to init components, generally, DHTMLX pragmatically set up components `line by line`, by explicit calling component methods and passing the properly arguments on each call. That is their `default model`, but also let you to set up your component using facade.

It makes DHTMLX simple and powerful. It let starter javascript programmers to build Enterprise Javascript applications.

Another reason is actually there is no MV* framework or library which let you to build MV* aplications using DHTMLX components `using the same paradigm` or even similar in the way they were created. DHTMLX fits to a paradigm that is very similar to other frameworks like EXT JS (Senha actually), Dojo, Qooxdoo and others in term of how to implement applications using the `Component Driven Developmemnt` approach.

Frameworks like DHTMLX provides mature and tested components API, rather the model where you create your own components.

There is no problem with the paradigm where you create your own components, it can be great for small applications or when you have sufficient time to start from the scratch to create components mature like the components which already exists in frameworks for Enterprise applications.

Frameworks like Angular, React an others, render `views` by using `predefined` or `static` plain HTML templates.

Frameworks like DHTMLX provides `built in` components where you can consume it APIs. The HTML, by itself, is generated on the fly when when the code which call the components is executed.

Frameworks for Enterprise Applications keep the developer focus on the business logic, avoiding time wasting to create HTML and css code. 

You may be wondering: "What about concepts like `reaction` and data binding?"

Don't worry. Take a deep look into DHTMLX documentation and you will see those concepts are nothing new.

Framerworks for Enterprise Javascript Applications are the first citizens from the `Javascript Development World`.

There is nothing you can not do with those frameworks, certainly they may not be the best choice for a small POC or application, but they are the best choice in several scenarios which I will not discuss here.

As DHTMLX offers rich components through simple interfaces (API) with a great docs, it may be a right choice for small application too. Not only for Enterprise applications.

Although, generally, a Enterprise application has it code increasing on it lifetime, resulting in a big codebase. In this scenario, you may see a lack in DHTMLX that is it does not encourage any pattern for development. Requiring from the developer to create it own application design and structure.

Another common problems are:

- Giant Javascript modules/classes which are harder to maintain and get new people envolved on it development
- `Load the whole app in just one file`, encouraged in top most several modern frameworks may not work for Enterprise applications, where you may have ` 2, 3, 4, 5 or even more` MB loading at the same time before application starts.

The dhxMVP boilerplate solves the problems by using `dhx.ui.mvp`, a MV* framework built on top of [dhx framework](https://github.com/web2solutions/dhx).

`dhx.ui.mvp` let you to declare your routes and it will call it properly `presenter` and `view`, automatically creating references to the model on each view and presenter.

For each route, you declare (will use route as file name if not declared) a `view` and a `presenter`, but not least, you may also to attach any javascript file to the view scope.

On the view, you basically you declare DHTMLX component settings and it calls.

On the presenter, you orchestrate your view, meanwhile you may implement and provide any required helper method.

Both view and presenter have reference to the application model, although it would be great to implement model tasks over the presenter and let the view to be the simple as possible.

For now, the model is framework agnostic, you may develop it using Backbone for a faster approach, or to use PouchDB, db for example, which would to require a less abstracted model code. Anyway, the model is just a Javascript Module or Object Literal called `model`.

To solve the problems regarding loading performance, `dhx.ui.mvp` implements a `on demand loading` model for loading your javascript views and presenters, let the end user to load it on their browsers only when they really need that file on their cache.





## Kit installation

List of the softwares you need to have installed in your computer to use the whole features of the development kit.

 - [Node.js](https://nodejs.org/en/download/)
 - [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
 - [Git](https://desktop.github.com/) - `I'm using github`

Install process:

### Via npm

[![NPM](https://nodei.co/npm/dhxmvp.png?compact=true)](https://nodei.co/npm/dhxmvp/)


### Via Github repo

Clone this repository to a given directory, lets assume: ***/Users/YourName/apps/***

    $ cd /Users/YourName/apps/
    $ git clone https://github.com/web2solutions/dhxMVP.git

Or Download this repository as zip and uncompress it at /Users/YourName/apps/

    $ cd dhxMVP
    $ npm install --global gulp-cli
    $ npm install





## Boilerplate architecture


***The File system for a properly fresh install version of dhxMVP should be something like:***

    |---- dhxMVP/
        |---- assets/
        |---- cache/ -> automatically created when creating Application installers
        |---- coverage/ -> Instabul coverage files
        |---- dist/ -> automatically created when running $ gulp dist
        |---- dist_electron/ -> automatically created when running $ gulp dist
        |---- installers/ -> automatically created when creating Application installers
        |---- lib/
            |---- dhx
            |---- model
                |---- model.js
            |---- presenter
                |---- presenter.js
            |---- thirdparty
            |---- view
                |---- view.js
            |---- app.js
        |---- node_modules/ -> automatically created when installing the Boilerplate system
        |---- test/
        |---- .gitignore
        |---- .travis.yml
        |---- boilerplate_sidebar.html
        |---- electron.js
        |---- Gulpfile.js
        |---- LICENSE
        |---- package.json
        |---- Readme.md

***The File system for a final distributed application should be something like:***

_Distributed application version are created running `$ gulp dist`._

    |---- MyApplicationName/
        |---- assets/
        |---- lib/
            |---- dhx
            |---- model
                |---- model.js
            |---- presenter
                |---- presenter.js
            |---- thirdparty
            |---- view
                |---- view.js
            |---- app.js
        |---- index.html




## What the boilerplate provides?

- Foundation for Single Page Applications
    - Main View
        - Initially Using DHTMLX Sidebar as application `wrapper and navigation`
    - Main Presenter
    - Demo Model
        - Initially using Backbone and [indexeddb-backbonejs-adapter](https://github.com/superfeedr/indexeddb-backbonejs-adapter)
    - Demo routes
        - #
            - Main view
            - Main presente
        - /help
            - view
            - presenter

- Code Validation and Automation Suite
 - gulp jshint - Run jsHint against application code
 - gulp dist 
    - Run jshint (_The dist will not be executed if is there any programmimng error reported by jshint_)
    - Minify JavaScript files
    - Copy `lib/`to `dist/`
    - Copy `assets/`to `dist/`
    - Copy `boilerplate_sidebar.html`to `dist/` and rename to `index.html

 - gulp test - Unit Tests
 - gulp git-init - init git on the repository
 - gulp git-add - prepare staged content to the next commit
 - sudo gulp git-add-commit-push - prepare staged content, commit and push to the repository
 - gulp git-push - push commit from Origin to Master branch
 - sudo gulp build - Build distribution. Performs several tasks over the code. If any task breaks, the upcoming task will not be executed. The tasks order is:
    - dist
    - test
    - git-add-commit-push
 - gulp build-installer-mac - generate a Mac installer of the current build.
 - gulp build-installer-windows - generate a Windows installer of the current build.
 - gulp build-installer-linux - generate a Linux installer of the current build.

***Note about `git` features:***

You will need `GIT LFS` to push large files to the repository.
Please install it. Check the doc at [Git-LFS repo at Github](https://github.com/github/git-lfs)





## How to use the boilerplate to get my application done?



### Setup development environment

1. ***Give a name to your application.***

Open the file `./package.json` and alter the the following properties. 

Example:

````javascript
{
  "name": "MyApplicationName",
  "version": "0.0.0",
  "description": "Provide a description here.",
  "keywords": [
    "Your Keyword 1"
  ],
  "author": {
    "name": "Your Name",
    "email": "Your E-mail"
  }
}
````

***_Note:_*** 

The `version property` shall to be set to `0.0.0`. On every time you make a distribution of your application by running `gulp build`, the application version will be automatically incremented.




2. ***Rename the Application directory***

The currently directory name is `dhxMVP`. Change it by providing your application name.

For example

`dhxMVP/` ***-->*** `MyApplicationName/`




3. ***Start the development server***:

    $ cd MyApplicationName/
    $ gulp start-development-server

Now open your browser and reach [http://localhost:9999/boilerplate_sidebar.html](http://localhost:9999/boilerplate_sidebar.html)

***Note about _boilerplate_sidebar.html_***

This is the demo html file which uses DHTMLX Sidebar as the main `Application wrapper and navigation component`.

_On a future version I will release a new demo example using `DHTMLX Layout` and `DHTMLX Toolbar` as the main `Application wrapper and navigation components`_




4. ***Set up a new project on your prefered HTML5 and Javascript IDE***: 

I'm using [Sublime Text](https://www.sublimetext.com/) here and it provides a excellent plugin to run `gulp` directly from the IDE rather than requiring from you to run the `gulp commands` via `terminal`. Atom is a excellent choice too.





5. ***Setup a new git repository for your application.***

On this step you will need a github account and it client installed locally.

You may use the Github client to setup the new repository.

Or you may prefer to use `gulp` to init it:

    $ cd MyApplicationName/
    $ gulp git-init





### The application `main` View

The `Main View` on a dhxMVP application is JavaScript Module that is reponsible to render all the components that are shared by all the `child views`.

Initially, it need to provides a `wrapper` component which will be used as base to construct our entire application. All application componentes will be attached to the `wrapper component`.

As wrapper component, we may use DHTMLX Sidebar and DHTMLX Layout.

Still yet initially, we also need a `navigation` component which is responsible to provide `navigation` feature to the end user meanwhile it `dispatchs routes` (inject child views and presenters) into the application.

When using `DHTMLX Sidebar` as main `application wrapper component` we already have the `navigation component` included.

When using `DHTMLX Layout` as main `application wrapper component` we will need to set up a `navigation component`, and for this case we may use:

    - DHTMLX Toolbar
    - DHTMLX Menu
    - DHTMLX Ribbon

As a `Application Main View` you can assume it as `what the end user sees when application starts`, nothing more.

The application `Main View` shall to provide the following mandatory methods:

- ***render***

    Used call methods which calls DHTMLX components and render the View on browser.

- ***onDispatch***

    event function which is triggered always when a route is dispatched.

- ***_subscriber***

    Used to receive messages from different application modules

- ***initialize***

    Used to perform any task before rendering the view

It should looks like the following:

````javascript
$dhx.ui.mvp.views.declare({
    "view": (function() {
        'strict';
        var route = '#',
            main_view = $dhx.ui.mvp.main_view.extend({ }),
            view = new main_view({
                /**
                 * [initialize view. Called before view is rendered]
                 */
                initialize: function(options) {
                    console.log('VIEW:: called initialize from view.initialize');
                    console.debug.log(this);
                },

                /**
                 * [onDispatch event. Called each time a route is dispatched via main_view.dispatch() ]
                 */
                onDispatch:function(id) {
                    var self = this;
                },
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function( render ) {
                    var self = this;
                    
                },
                /**
                 * [subscriber function which receives messages from presenter]
                 * @param  {[string]} topic [listened topic]
                 * @param  {[Objec]} data  [message object]
                 */
                _subscriber: function(topic, data) {
                    var self = $dhx.ui.mvp.views.get('view');
                    
                }
            });
        return view;
    }())
});
```

A more complete `Main View` demo code may be [viewed here](https://gist.github.com/web2solutions/b5efa4546b9502396b1e3b007d51a465)

The `main view` is represented by the `#` route and it is executed `only one time` in the entire application lifetime when the same starts.


The application `main view` code resides in the following path: `MyApplicationName/lib/view/view.js`.

***NOTE***

The name of the file is mandatory to be `view.js`. Don't change it.






### The application `main` Presenter

In order to take advantage of the `MV*` development model, in the `Main Presenter` we orchestrate the `Main View` operations and tasks.

In the `Main Presenter` we could define `function event handlers` for the components defined in the 'Main View'.

Not least, we could start the application database or provide any 'help method' to be used into the `Main View`.

In this way, we keep the code separated in accordance with it type of usage.

The application `Main Presenter` shall to provide the following mandatory methods:

- ***start***

    Called when the route code starts.

- ***destroy***

    Used to destroy components when unloading the entire application


It should looks like the following:

````javascript
$dhx.ui.mvp.presenters.declare({
    "presenter": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            }
        }; // end API
        return API;
    }())
});
```

A more complete `Main Presenter` demo code may be [viewed here](https://gist.github.com/web2solutions/3ffe4b181640c810d152cbd158693c78)

The `main presenter` is represented by the `#` route and it is executed `only one time` in the entire application lifetime when the same starts.

The application `main presenter` code resides in the following path: `MyApplicationName/lib/presenter/presenter.js`.

***NOTE***

The name of the file is mandatory to be `presenter.js`. Don't change it.





### The application Model

Until this version of dhxMVP, the model is a simple Javascript Module/Object which will be automatically referenced by all `Views` and `Presenters` when you declare the model.

It should looks like the following:

````javascript
$dhx.ui.mvp.models.declare({
    "model": (function() {
        'strict';
        var API = {
            
        }; // end API
        return API;
    }())
});
```

A more complete `model` demo code may be [viewed here](https://gist.github.com/web2solutions/2c829ea0cd11660b10bda3504c8d26b3)

For a future version, I will be implementing the model using [DHTMLX Datastore](http://docs.dhtmlx.com/datastore__index.html) and integrating it with [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). It will provides to the `Views`, `Reaction` and `Data Binding` in a high abstracted API.

For now, the `demo application` implemented in this boilerplate is using Backbone and it indexedDB plugin to implement local database over indexedDB and provide a set of features to be used on `Presenters` and `View`.


***Note*** 

As best pratice, try to consume the model always via `Presenters`. Try to keep your `Views` as simplest as possible. 


The `model` is executed `only one time` in the entire application lifetime when it starts.

The application `model` code resides in the following path: `MyApplicationName/lib/model/model.js`.

***NOTE***

The name of the file is mandatory to be `model.js`. Don't change it.


### Declaring routes

Routes are declared inside the file `MyApplicationName/lib/app.js`.

When you declare a route, you are defining 4 things inside a dhxMVP application:

- a hash url to be dispatched
- a `Child Presenter` file name to be injected when dispatching the route
- a `Child View` file name to be injected when dispatching the route
- A array of names of Javascript modules to be injected into the route scope. You may use the injected code inside your `Child view`.

Routes may be dispatched through 2 different ways:

1. Calling the `dispatch()` method from the `Main View`. 

This method is automatically created when you declare your `Main View`. Don't declare it again. Example:

***On the Main Presenter***

````javascript
$dhx.ui.mvp.presenters.declare({
    "presenter": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },

            dispatch_help_route: function() {
                var self = this,
                    view = self.view;
                
                view.dispatch('/help');
                
            }
            
        }; // end API
        return API;
    }())
});
````

***On a Child Presenter***

````javascript
$dhx.ui.mvp.presenters.declare({
    "help": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },

            dispatch_help_route: function() {
                var self = this,
                    main_view = $dhx.ui.mvp.views.get('view');
                
                main_view.dispatch('/help');
            }
            
        }; // end API
        return API;
    }())
});
````


2. Calling the `dispatch()` method from the `_router` Object from the `Main View`. 


***On the Main Presenter***

````javascript
$dhx.ui.mvp.presenters.declare({
    "presenter": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },

            dispatch_help_route: function() {
                var self = this,
                    view = self.view;
                
                view._router.dispatch('/help');
                
            }
            
        }; // end API
        return API;
    }())
});
````

***On a Child Presenter***

````javascript
$dhx.ui.mvp.presenters.declare({
    "help": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
                $dhx.debug.log('MAIN:PRESENTER: start from MAIN:PRESENTER');
            },
            destroy: function() {
                $dhx.debug.log('MAIN:PRESENTER: destroy from MAIN:PRESENTER');
                //$dhx.debug.log(this._view);
            },

            dispatch_help_route: function() {
                var self = this,
                    main_view = $dhx.ui.mvp.views.get('view');
                
                main_view._router.dispatch('/help');
            }
            
        }; // end API
        return API;
    }())
});
````


Now, let's see how to declare the routes:



***Complete setup***

Use it only in two cases:

1. When you want to create files for child `Presenters` or `Views` and give the file a name that is different of the dispatched route name.

2. If you want to inject another javascript files into the route scope.


````javascript
        router.route({
            url: '/help',
            view: 'help_view_file_name',
            presenter: 'help_presenter_file_name',
            method: 'start_method_name', // implicity call presenter.start() if not explicitly defined
            append_views: [
                { "chatter" : 'chatter_view' } // "name of the javascript object": "name of the javascript file"
            ]
        });
````


***Minimal setup***

````javascript
    router.route({
        url: '/help'
    });
````

The above declared route will inject the files 'MyApplicationName/lib/view/help.js' and 'MyApplicationName/lib/presenter/help.js' when the route `/help` is dispatched into the Application scope.







#### Child Views

Child Views are Javascript Modules/Object that are reponsible for rendering the view of a dispatched route.

It should looks like the following:

````javascript
$dhx.ui.mvp.views.declare({
    "help": (function () {
        'strict';
        var route = 'help',
            child_view = $dhx.ui.mvp.child_view.extend({ }),
            view = new child_view({
                /**
                 * [_settings View's settings. Components' internal settings]
                 * @type {Object}
                 */
                _settings: {
                    
                },

                initialize: function(options) {
                    $dhx.debug.log('CHILD:VIEW:: called initialize from help_view.initialize');
                },
                destroy: function() {

                },
                
                
                
                /**
                 * [render the view. Called once application starts]
                 */
                render: function() {
                    var self = this;
                    
                },
                /**
                 * [subscriber function which receives jobs from presenter]
                 * @param  {[string]} topic [listened topic]
                 * @param  {[Objec]} data  [message object]
                 */
                _subscriber: function(topic, data) {
                    var self = $dhx.ui.mvp.views.get( route );
                }
            });

        return view;
    }())
});
```

A more complete `Child View` demo code may be [viewed here](https://gist.github.com/web2solutions/354b7f926d48ab0eb6e796834089d379)

As a example, we may consider a `Help` button on the `Main View` which dispatched the `/help` route when clicked.
`$dhx.ui.mvp` will then inject the 'lib/view/help.js' and this recently injected module will render a interface displaying a list of `Frequent Asked Questions`

On a dhxMVP application, every route is associated to a `Child View`.





#### Child Presenters

Child Presenters are Javascript Modules/Object that are reponsible for orchestrating a `Child View`. of a dispatched route.


It should looks like the following:

````javascript
$dhx.ui.mvp.presenters.declare({
    "help": (function() {
        'strict';
        var API = {
            start: function() {
                var self = this,
                    view = self.view;
            },
            destroy: function() {
                
                
            }
        }; // end API
        return API;
    }())
});
```

A more complete `Child Presenter` demo code may be [viewed here](https://gist.github.com/web2solutions/15826fd72615da2a1b1eadcf2d45e3da)


In the `Child Presenter` we could define `function event handlers` for the components defined in the associated 'Child View'.

Not least, provide any 'help method' to be used into the associated `Child View`.


As a example, we may consider a `Help` button on the `Main View` which dispatched the `/help` route when clicked.
`$dhx.ui.mvp` will then inject the 'lib/presenter/help.js' and this recently injected module will orchestrate the interface displaying a list of `Frequent Asked Questions`.


On a dhxMVP application, every route is associated to a `Child Presenter`.



***Resume***

Considering the Application Demo provided in this boilerplate, every time you want to add a new button on the left sidebar, you will need:

1. Declare a new route into `lib/app.js`
2. Add a new sidebar button on the file `lib/presenter/presenter.js`
3. Declare a new Child View and create it file inside `lib/view/` folder.
4. Declare a new Child Presenter and create it file inside `lib/presenter/` folder.


### Software validation and code automation

When you finish the development process of your dhxMVP application, you may want to move it to production.

Not least, you may want to create releases of your currently application version.

You may want too, to create `Desktop version` of your fresh created `Web Application`.

All those features are provided in this Boilerplate system. Although, you will not be able to produce new releases, or create installers for desktop version or even to create distributions of your application to run on a production server if one of the following 2 things occurs:

1. programming error o bad pratice found in your codebase.
2. Tests performed by the Testing Suite are failing.

It means you will not be able to delivery bad code to the end users.


#### Code quality

To ensure code quality and best pratices we use [jsHint](http://jshint.com/), a code quality tool, against your codebase.

##### Run JSHint to check the code and look for error and bad pratices.

Inside application directory, type:

    $ gulp jshint




#### Unit Tests

Inside application directory, type:

    $ gulp test




#### Deploy



##### Creating minified version of the javascript files

When working on localhost, the dhxMVP will generally load the non minified version of the javascript files. Although, the files used by the core are always loaded using the minified version.

In this case, on every time you change a file of the core (except views and presenters), you need to run the `dist` command to see the changes in action using a browser.

It is necessary too when putting the application on production due it will load only the minified version of the javascript files.

To make a dist, run:

    $ gulp dist

***Note***

It is a good pratice to run `$ gulp jshint` before `$ gulp dist` and check for programming error and bad pratices. Although, the `jshint` is automatically runned before `dist`





##### Build a distribution

Building a distribution will check the whole code reliability and push it to Git repository as a new version.

    $ sudo gulp build

_This command will run the following tasks in order:_

- gulp jshint
- gulp dist
- gulp test
- gulp git-add-commit-push

***Note***

If a error occurs on any of the above task, the upcoming deploy task will not be runned.






#### Application distributing

Including the web version, you may be interested in distributing your application as a `Desktop Application`. For this case, the Boilerplate system provides you a mechanism to create `executable versions` of your application with no efforts.

You can get the generated executables and distribute to your client.

The generated installers will be stored into `installers/`.

The make the installers, run the following commands:




##### Creating Mac installers

    $ gulp build-installer-mac




##### Creating Windows installers

    $ gulp build-installer-windows




##### Creating Linux installers

    $ gulp build-installer-windows




### Move to production






## Todo

- $dhx.ui.mvp refactoring
- Implement patterns on routes url





## License

This software is distributed under [GPL-2.0](https://www.gnu.org/licenses/gpl-2.0.html) in accordance with [DHTMLX license](http://dhtmlx.com/docs/products/licenses.shtml).


### DISCLAIMER OF WARRANTY

BECAUSE THIS SOFTWARE IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION.

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THE SOFTWARE AS PERMITTED BY THE ABOVE LICENCE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
