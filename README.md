# dhxMVP  

[![NPM version](https://badge.fury.io/js/dhxmvp.png)](http://badge.fury.io/js/dhxmvp) [![Build Status](https://travis-ci.org/web2solutions/dhxMVP.svg?branch=master)](https://travis-ci.org/web2solutions/dhxMVP) ![Dependency Status](https://gemnasium.com/web2solutions/dhxMVP.png) [![License GPL-2.0](http://b.repl.ca/v1/License-GPL--2.0-brightgreen.png)](https://github.com/web2solutions/dhxMVP/blob/master/LICENSE) 

dhxMVP is a boilerplater system for building MV* DHTMLX applications.


- [Why another MV* implementation](#why-another-mv-implementation)
- [Kit installation](#kit-installation)
- [What the boilerplate provides?](#what-the-boilerplate-provides)
- [Testing the application](#testing-the-application)
- [Run JSHint to check the code and look for error and bad pratices](#run-jshint-to-check-the-code-and-look-for-error-and-bad-pratices)
- [Creating minified version of the application javascript files (necessary to put changes on production)](#creating-minified-version-of-the-application-javascript-files-necessary-to-put-changes-on-production)
- [Build a distribution](#build-a-distribution)
- [How to use the boilerplate to get my application done?](#how-to-use-the-boilerplate-to-get-my-application-done)
    - [Setup development env](#setup-development-env)
    - [The application `main` View](#the-application-main-view)
    - [The application `main` Presenter](#the-application-main-presenter)
    - [The application Model](#the-application-model)
    - [Declaring routes](#declaring-routes)
        - [Child Views](#child-views)
        - [Child Presenters](#child-presenters)
    - [Software validation](#software-validation)
        - [Code quality](#code-quality)
        - [Unit Tests](#unit-tests)
        - [Deploy](#deploy)
    - [Move to production](#move-to-production)
- [License](#license)



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

- Code Validation Suite
 - jshint - Run jsHint against application code
 - dist - Minify JavaScript files. It runs `jshint`first. The dist will not be executed if is there any programmimng error reported by jshint.
 - test - Unit Tests
 - git-init - init git on the repository
 - git-add - prepare staged content to the next commit
 - git-add-commit-push - prepare staged content, commit and push to the repository
 - git-push - push commit from Origin to Master branch
 - build - Build distribution. Performs several tasks over the code. If any tasks breaks, the upcoming task will not be executed. The tasks order is:
    gi- jsHint
    - dist
    - test
    - git-add-commit-push

Note about `git` features:

You will need `GIT LFS` to push large files to the repository.
Please install it. Check the doc at [Git-LFS repo at Github](https://github.com/github/git-lfs)


## Testing the application

    $ gulp test

## Run JSHint to check the code and look for error and bad pratices

    $ gulp jshint

## Creating minified version of the javascript files (necessary to put changes on production)

    $ Gulp dist

## Build a distribution

    $ Gulp build


## How to use the boilerplate to get my application done?

### Setup development env

### The application `main` View

### The application `main` Presenter

### The application Model

### Declaring routes

#### Child Views

#### Child Presenters

### Software validation

#### Code quality

#### Unit Tests

#### Deploy

### Move to production




## License

This software is distributed under [GPL-2.0](https://www.gnu.org/licenses/gpl-2.0.html) in accordance with [DHTMLX license](http://dhtmlx.com/docs/products/licenses.shtml).
