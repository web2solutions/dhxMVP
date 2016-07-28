var gulp = require('gulp'),
  watch = require('gulp-watch'),

// This will keeps pipes working after error event
  plumber = require('gulp-plumber'),

// linting
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),

// Used in linting custom reporter
  map = require('map-stream'),
  events = require('events'),
  notify = require('gulp-notify'),
  emmitter = new events.EventEmitter(),
  path = require('path');

var git = require('gulp-git');
//var istanbulReport = require('gulp-istanbul-report');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var beautify = require('gulp-beautify');
var print = require('gulp-print');
var fs = require("fs");

var mochaPhantomJS = require('gulp-mocha-phantomjs');
var coverageFile = './coverage/coverage.json';

var files = "./lib/*.js";
var views = "./lib/view/*.js";
var model = "./lib/model/*.js";
var presenters = "./lib/presenter/*.js";
var paths = ["lib", "lib/view", "lib/presenter", "lib/model", "lib/dhx", /*"lib/thirdparty"*/],
    jsHint = function ( cb ) {
        var t_files = 0,
            done_files = 0,
            start_date = new Date(),
            end_date = 0,
            elapsed_time = 0,
            list_of_files = []
            there_is_error = false,
            all_errors = [];
        console.warn('#======> gulp jshint is started <=====#', (start_date).toISOString());
        paths.forEach(function(path_file) {
            //console.log('=====> working on the directory: ', path_file);
            var app_files = fs.readdirSync(path.join(__dirname, path_file));
            var app_files_a = [];
            app_files.forEach(function(file) {
                if (file.indexOf(".js", file.length - 3) != -1) {
                    if (file.indexOf("min.") == -1) {
                        app_files_a.push(file);
                        t_files += 1;
                    }
                }
            });
            //console.log( app_files_a );
            app_files_a.forEach(function(file) {
                there_is_error = false;
                //console.log("./" + path_file + "/" + file);
                list_of_files.push("./" + path_file + "/" + file);

                gulp.src("./" + path_file + "/" + file)
                .pipe(print(function(filepath) {
                    return "running jsHint against " + filepath;
                }))
                .pipe(jshint())
                .pipe(jshint.reporter(stylish)) // Console output
                .pipe(jshint.reporter('fail'))
                .on('finish', function() 
                {
                    if (!there_is_error) {
                        done_files += 1;
                        //console.log(file + ' is ok!');
                    } else {
                        //console.log( 'all_errors ', all_errors );
                    }
                    if (done_files == t_files) {
                        end_date = new Date();
                        elapsed_time = (+end_date) - (+start_date);
                        console.log('# jshint executed in: ', elapsed_time + ' ms');
                        console.log('#======> gulp jshint is done with no errors <=====#', (end_date).toISOString());
                        //gulp.src("gulpfile.js").pipe(notify('# jshint done in: ' + elapsed_time + ' ms'));
                        cb();
                    }
                        
                })
                .on('error', notify.onError(function (error) {
                    //console.log( 'ERROR: ', error.message );
                    there_is_error = true;
                    all_errors.push(error);
                    return error.message;
                }));
            });
        });
    },
    dist = function( cb ) {
        var file = '',
            t_files = 0,
            done_files = 0,
            start_date = new Date(),
            end_date = 0;
        console.warn('#======> gulp dist is started <=====#', (start_date).toISOString());
        paths.forEach(function(path_file) {
            //console.log('=====> working on the directory: ', path_file);
            var app_files = fs.readdirSync(path.join(__dirname, path_file));
            var app_files_a = [];
            app_files.forEach(function(file) {
                if (file.indexOf(".js", file.length - 3) != -1) {
                    if (file.indexOf("min.") == -1) {
                        app_files_a.push(file);
                        t_files += 1;
                    }
                }
            });
            app_files_a.forEach(function(file) {
                //console.log('reading ' + path_file + "/" + file);
                gulp.src("./" + path_file + "/" + file)
                .pipe(print(function(filepath) {
                    return "packing " + filepath;
                }))
                .pipe(rename('min.' + file))
                .pipe(uglify({
                    mangle: true
                }))
                .pipe(gulp.dest('./' + path_file))
                .on('finish', function() {
                    //console.log( file +' minified to --> min.' + file );
                    done_files += 1;

                    if( done_files == t_files )
                    {
                        end_date = new Date();
                        var elapsed_time = (+end_date) - (+start_date);
                        console.log('# dist executed in: ', elapsed_time + ' ms');
                        console.log('#======> gulp dist is done with no errors <=====#', (end_date).toISOString());
                        //gulp.src("gulpfile.js").pipe(notify('# dist done in: ' + elapsed_time + ' ms'));
                        cb();
                    }
                });
            });
        });
        /*dis*/
    },
    test = function( cb ) {
        var start_date = new Date(),
            end_date = 0,
            elapsed_time = 0;
        //console.log('test arguments', arguments);
        
        return gulp
        .src('./test/test.html')
        .pipe(mochaPhantomJS({
            phantomjs: {
                viewportSize: {
                    width: 1024,
                    height: 768
                },
                useColors: true
            },
            reporter: 'spec'
        }))
        .on('finish', function() {
            end_date = new Date();
             var elapsed_time = (+end_date) - (+start_date);
            gulp.src("gulpfile.js").pipe(notify('# test done in: ' + elapsed_time + ' ms'));
            cb();
        });
    },
    git_add = function( cb ){
        var start_date = new Date(),
            end_date,
            elapsed_time;
        return gulp
            .src('./git-test/*')
            .pipe(git.add())
            .on('finish', function() {
                end_date = new Date(),
                elapsed_time = (+end_date) - (+start_date);
                console.log('# git-add executed in: ', elapsed_time + ' ms');
                console.log('#======> gulp git-add is done with no errors <=====#', (end_date).toISOString());
                gulp.src("gulpfile.js").pipe(notify('# git-add done in: ' + elapsed_time + ' ms'));
                cb();
            })
            .on('error', function(){
                console.log( '!!>>>!!!>>>! error here add' );
            });
    },
    git_commit = function( cb ){
        var start_date = new Date(),
            end_date,
            elapsed_time,
            total_data_stream = 0;
        return gulp
            .src('./git-test/*')
            .pipe(git.add())
            .pipe(git.commit('testing git via gulp 12', {emitData:true}))
            .on('data',function(data) {
                total_data_stream += 1;
                if( typeof data === 'string' )
                {
                    if( data.indexOf('files changed') > -1 || data.indexOf('file changed') > -1 )
                    {
                        console.log( 'there is file changed' );
                        data = data.replace(/\n/g, "||");
                        var arr = data.split('||');
                        console.log( arr[1] );
                        cb();
                    }
                    else if( data.indexOf('Your branch is ahead of') > -1 )
                    {
                        console.log( 'done' );
                        console.log( 'you need push' );
                        cb({ push : true });
                    }
                    else
                    {
                        console.log( data );
                    }
                }

            })
            .on('finish', function() {
                end_date = new Date(),
                elapsed_time = (+end_date) - (+start_date);
                console.log('# git-commit executed in: ', elapsed_time + ' ms');
                console.log('#======> gulp git-commit is done with no errors <=====#', (end_date).toISOString());
                gulp.src("gulpfile.js").pipe(notify('# git-commit done in: ' + elapsed_time + ' ms'));
                
            })
            .on('error', function(){
                //console.log( '!!>>>!!!>>>! error here commit' );
            });
    },
    build = function( cb ) {
        var start_date = new Date(),
            end_date,
            elapsed_time;
        jsHint( function(){
            dist( function(){
                test( function(){
                    //git_add( function(){
                        git_commit( function( c ){


                            if( c.push )
                            {

                            }


                            //git.tag('v1.1.1', 'Version message', function (err) {
                            //    if (err) throw err;
                            //});


                            end_date = new Date(),
                            elapsed_time = (+end_date) - (+start_date);
                            console.log('# build executed in: ', elapsed_time + ' ms');
                            console.log('#======> gulp build is done with no errors <=====#', (end_date).toISOString());
                            gulp.src("gulpfile.js").pipe(notify('# build done in: ' + elapsed_time + ' ms'));
                            cb();
                        } );                    
                    //} );
                } );
            } );
        } );    
    };



gulp.task('jshint', jsHint);
gulp.task('dist', ['jshint'], dist);
gulp.task('build', build);
gulp.task('test', function( cb ) {
        var start_date = new Date(),
            end_date = 0,
            elapsed_time = 0;
        //console.log('test arguments', arguments);
        
        return gulp
        .src('./test/test.html')
        .pipe(mochaPhantomJS({
            phantomjs: {
                viewportSize: {
                    width: 1024,
                    height: 768
                },
                useColors: true
            },
            reporter: 'spec'
        }))
        .on('finish', function() {
            end_date = new Date();
             var elapsed_time = (+end_date) - (+start_date);
            gulp.src("gulpfile.js").pipe(notify('# test done in: ' + elapsed_time + ' ms'));
            //cb();
        });
});
gulp.task('git-add', git_add);
gulp.task('git-add-commit', git_commit);
gulp.task('git-push', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});
gulp.task('git-init', function(){
  git.init();
});


/*

var coverageFile = './coverage/coverage.json';
var mochaPhantomOpts = {
  phantomjs: {
    hooks: 'mocha-phantomjs-istanbul',
    coverageFile: coverageFile 
  },
  reporter: 'spec'
};

gulp.task('test-coverage', function () {
  gulp.src('./test/test.html', {read: false})
    .pipe(mochaPhantomJS(mochaPhantomOpts))
    .on('finish', function() {
      gulp.src(coverageFile)
        .pipe(istanbulReport({
		  reporterOpts: {
		    dir: './coverage'
		  },
		  reporters: [
		  	'text-summary', // outputs summary to stdout, uses default options 
		    {'name': 'text', file: 'report.txt'}, // -> ./coverage/report.txt
		    {'name': 'json', file: 'cov.json'} // -> ./jsonCov/cov.json
		  ]
		}))
    });
});
*/

gulp.task('default', function() {
    gulp.run('jshint');
    //gulp.watch(files, function(evt) {
    //    gulp.run('jshint');
    //});
});





//process.on('uncaughtException', function(err){
  //fs.writeSync(1, `Caught exception: ${err}`);
//});


//require('events').EventEmitter.prototype._maxListeners = 100;

process.on('exit', function(code){
  console.log("Gulp terminated: " + ( ( code == 0 ) ? 'with' : 'with no' ) + ' success'  );
});