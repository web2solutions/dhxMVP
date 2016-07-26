# dhxMVP  [![NPM version](https://badge.fury.io/js/dhxMVP.png)](http://badge.fury.io/js/dhxMVP) [![Build Status](https://travis-ci.org/web2solutions/dhxMVP.svg?branch=master)](https://travis-ci.org/web2solutions/dhxMVP)

dhxMVP is a boilerplater system for building MV* DHTMLX applications.


## Why another MV* implementation?

[DHTMLX framework](http://www.dhtmlx.com) does NOT provides any MV* solution, or even implement any complex design pattern in their component calls. Rather than the facade pattern used in several frameworks to init components, generally, DHTMLX pragmatically set up components `line by line`, by explicit calling component methods and passing the properly arguments on each call. That is their `default model`, but also let you to set up your component using facade.

It makes DHTMLX simple and powerful. It let starter javascript programmers to build Enterprise Javascript applications.

Although, generally, a Enterprise application has it code increasing on it lifetime, resulting in a big codebase.

Another common problems are:

- Giant Javascript modules/classes which are harder to maintain and get new people envolved on it development
- `Load the whole app in just one file`, encouraged in top most several modern frameworks may not work for Enterprise applications, where you may have ` 2, 3, 4, 5 or even more` MB loading at the same time before application starts.

The dhxMVP boilerplate solves it by using `dhx.ui.mvp`, a MV* framework built on top of [dhx framework](https://github.com/web2solutions/dhx).

`dhx.ui.mvp` let you to declare your routes and it will call it properly `presenter` and `view`, automatically creating references to the model on each view and presenter.

For each route you declare a `view` and a `presenter`, but not least, you may also to attach any javascript file to the view scope.

On the view, you basically you declare DHTMLX component settings and it calls.

On the presenter, you orchestrate your view meanwhile you may implement and provide any required helper method.

Both view and presenter have reference to the application model, although it would be great to implement model tasks over the presenter and let the view to be the simple as possible.

For now, the model is framework agnostic, you may develop it using Backbone for a faster approach, or to use PouchDB, db for example, which would to require a less abstracted model code. Anyway, the model is just a Javascript Module or Object Literal called `model`.


## Installation

List of softwares that you need to have already installed:

 - Node.js
 - Gulp

Download this repository and uncompress to a given directory, lets assume: ***/Users/YourName/apps/

    $ cd dhxMVP
    $ npm install --global gulp-cli
    $ npm install


##  Command line testing

    $ gulp test

## Run JSHint to check the code

    $ gulp lint

## Creating minified version of the application javascript files

    $ Gulp dist
