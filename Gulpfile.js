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
var gls = require('gulp-live-server');
//var istanbulReport = require('gulp-istanbul-report');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var beautify = require('gulp-beautify');
var print = require('gulp-print');
var fs = require("fs");

var package = JSON.parse(fs.readFileSync('./package.json'));

var mochaPhantomJS = require('gulp-mocha-phantomjs');
var coverageFile = './coverage/coverage.json';

var files = "./lib/*.js";
var views = "./lib/view/*.js";
var model = "./lib/model/*.js";
var presenters = "./lib/presenter/*.js";
var paths = ["lib", "lib/view", "lib/presenter", "lib/model", "lib/dhx", /*"lib/thirdparty"*/],
    jsHint = function ( cb, fn  ) {
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
                        if(fn) fn();
                        if(cb) cb();
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
    dist = function( cb, fn ) {
        var file = '',
            t_files = 0,
            done_files = 0,
            start_date = new Date(),
            end_date = 0;

        jsHint( null, function(){
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
                            console.log('#======> moving files to dist/');
                            gulp
                                .src(['lib/**/*'])
                                .pipe(gulp.dest('dist/lib'))
                                .on('finish', function() {
                                    
                                    gulp
                                        .src(['assets/**/*'])
                                        .pipe(gulp.dest('dist/assets'))
                                        .on('finish', function() {


                                            gulp
                                                .src(['boilerplate_sidebar.html'])
                                                .pipe(rename('index.html'))
                                                .pipe(gulp.dest('dist/'))
                                                .on('finish', function() {
                                                    end_date = new Date();
                                                    var elapsed_time = (+end_date) - (+start_date);
                                                    console.log('# dist executed in: ', elapsed_time + ' ms');
                                                    console.log('#======> gulp dist is done with no errors <=====#', (end_date).toISOString());
                                                    //gulp.src("gulpfile.js").pipe(notify('# dist done in: ' + elapsed_time + ' ms'));
                                                    if(fn) fn();
                                                    
                                                });


                                            
                                            
                                        });
                                    
                                });
                            if(cb) cb();
                        }
                    });
                });
            });
            /*dis*/
        });
        
    },
    test = function( cb, fn ) {
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
            if(fn) fn();
            if(cb) cb();
        });
    },
    git_add = function( cb, fn ){
        var start_date = new Date(),
            end_date,
            elapsed_time;
        return gulp
            .src(['./*', '!./node_modules','!./node_modules/**', '!./dhxMVP.sublime-project', '!./dhxMVP.sublime-workspace', '!./sublime-gulp.log'])
            .pipe(git.add())
            .on('error', function(e){
                console.log( '>>>> error on git-add' );
                this.emit('end');
            })
            .on('finish', function() {
                end_date = new Date(),
                elapsed_time = (+end_date) - (+start_date);
                console.log('# git-add executed in: ', elapsed_time + ' ms');
                console.log('#======> gulp git-add is done with no errors <=====#', (end_date).toISOString());
                gulp.src("gulpfile.js").pipe(notify('# git-add done in: ' + elapsed_time + ' ms'));
                if( fn ) fn( );
            });
    },

    git_commit = function( cb, fn ){
        var self = this,
            start_date = new Date(),
            end_date,
            elapsed_time,
            total_data_stream = 0,
            commit_message = '',
            varray = package.version.split('.'),
            final_version = +( varray[2] || 0 ),
            middle_version = +( varray[1] || 0 ),
            start_version = +( varray[0] || 0 ),
            string_version = '';

        if( final_version < 999 )
        {
            final_version += 1;
        }

        if( final_version > 999 )
        {
            final_version = 0;
            if( middle_version < 999 )
            {
                middle_version += 1;
            }

            if( middle_version > 999 )
            {
                final_version = 0;
                middle_version = 0;
                start_version += 1;
            }
        }

        string_version = start_version + '.' + middle_version + '.' + final_version;
        commit_message = 'build #' + string_version + ' - built with gulp';


        return gulp
            .src(['./*', '!./node_modules','!./node_modules/**', '!./dhxMVP.sublime-project', '!./dhxMVP.sublime-workspace', '!./sublime-gulp.log'])
            .pipe(git.commit(commit_message , {emitData:true}))
            .on('data',function(data) {
                var self = this;
                try{
                    total_data_stream += 1;
                    if( typeof data === 'string' )
                    {
                        if( data.indexOf('files changed') > -1 || data.indexOf('file changed') > -1 )
                        {
                            console.log( 'there is file changed' );
                            data = data.replace(/\n/g, "||");
                            var arr = data.split('||');
                            console.log( arr[1] );
                            if(fn) fn({ push : true });
                        }
                        else if( data.indexOf('Your branch is ahead of') > -1 )
                        {
                            console.log( 'done' );
                            console.log( 'you need push' );
                            //self.emit('end')
                            if(fn) fn({ push : true });
                        }
                        else if( data.indexOf('no changes addedd') > -1 )
                        {
                            console.log( 'done' );
                            console.log( 'nothing changed' );
                            //self.emit('end')
                            if(fn) fn();
                        }
                        else
                        {
                            console.log( 'xxxx', data );
                            //self.emit('end');
                        }
                        
                    }
                }
                catch(e)
                {
                    console.log('>>>>>>>1 ', e.stack);
                    //self.emit('end');
                }

            })
            .on('error', function(e){
                console.log( '>>>> error on git-add-commit' );
                this.emit('end');
            })
            .on('finish', function() {
                try{
                    end_date = new Date(),
                    elapsed_time = (+end_date) - (+start_date);
                    console.log('# git-commit executed in: ', elapsed_time + ' ms');
                    console.log('#======> gulp git-commit is done with no errors <=====#', (end_date).toISOString());
                    gulp.src("gulpfile.js").pipe(notify('# git-commit done in: ' + elapsed_time + ' ms'));
                }
                catch(e)
                {
                    console.log('>>>>>>> ', e.stack)
                }
                //if(cb) cb();
            });
    },
    git_add_commit_push = function( cb, fn ){
        var self = this,
            start_date = new Date(),
            end_date,
            elapsed_time,
            total_data_stream = 0,
            commit_message = '',
            varray = package.version.split('.'),
            final_version = +( varray[2] || 0 ),
            middle_version = +( varray[1] || 0 ),
            start_version = +( varray[0] || 0 ),
            string_version = '';

        if( final_version < 999 )
        {
            final_version += 1;
        }

        if( final_version > 999 )
        {
            final_version = 0;
            if( middle_version < 999 )
            {
                middle_version += 1;
            }

            if( middle_version > 999 )
            {
                final_version = 0;
                middle_version = 0;
                start_version += 1;
            }
        }

        string_version = start_version + '.' + middle_version + '.' + final_version;
        commit_message = 'build #' + string_version + ' - built with gulp';

        package.version = string_version;
        var pstring = JSON.stringify( package );

        fs.writeFile("./package.json", pstring, function(err) {
            if(err) {
                console.log("xxxxx=====>>> Error updating version in package.json");
                return console.log(err);
            }
            console.log("xx Ok for updating version in package.json xx");
        }); 

        return gulp
            .src(['./*', '!./node_modules','!./node_modules/**', '!./dhxMVP.sublime-project', '!./dhxMVP.sublime-workspace', '!./sublime-gulp.log'])
            .pipe(git.add())
            .pipe(git.commit(commit_message, {emitData:true}))
            .on('data',function(data) {
                var self = this;
                try{
                    total_data_stream += 1;
                    if( typeof data === 'string' )
                    {
                        if( data.indexOf('files changed') > -1 || data.indexOf('file changed') > -1 )
                        {
                            console.log( 'there is file changed' );
                            data = data.replace(/\n/g, "||");
                            var arr = data.split('||');
                            console.log( arr[1] );
                            gulp.run('git-push');
                            if(fn) fn({
                                commit_message: commit_message,
                                string_version: string_version
                            });
                        }
                        else if( data.indexOf('Your branch is ahead of') > -1 )
                        {
                            console.log( 'done' );
                            console.log( 'you need push' );
                            gulp.run('git-push');
                            if(fn) fn({
                                commit_message: commit_message,
                                string_version: string_version
                            });
                        }
                        else if( data.indexOf('no changes addedd') > -1 )
                        {
                            console.log( 'done' );
                            console.log( 'nothing changed' );
                            //self.emit('end')
                            if(fn) fn();
                        }
                        else
                        {
                            console.log( 'xxxx', data );
                            //self.emit('end');
                        }
                        
                    }
                }
                catch(e)
                {
                    console.log('>>>>>>>1 ', e.stack);
                    //self.emit('end');
                }

            })
            .on('error', function(e){
                console.log( '>>>> error on git-add-commit' );
                this.emit('end');
            })
            .on('finish', function() {
                try{
                    end_date = new Date(),
                    elapsed_time = (+end_date) - (+start_date);
                    console.log('# git-commit executed in: ', elapsed_time + ' ms');
                    console.log('#======> gulp git-commit is done with no errors <=====#', (end_date).toISOString());
                    gulp.src("gulpfile.js").pipe(notify('# git-commit done in: ' + elapsed_time + ' ms'));
                }
                catch(e)
                {
                    console.log('>>>>>>> ', e.stack)
                }
                //if(cb) cb();
            });
    },
    build = function( cb ) {
        var start_date = new Date(),
            end_date,
            elapsed_time;
        //jsHint( null, function(){
            dist( null, function(){
                test( null, function(){
                    //git_add( null, function(){
                        git_add_commit_push( null, function( c ){

                            console.log( ('v'+c.string_version) );
                            console.log( ('gulp built version ' + c.string_version) );
                            


                            end_date = new Date(),
                            elapsed_time = (+end_date) - (+start_date);
                            console.log('# build executed in: ', elapsed_time + ' ms');
                            console.log('#======> gulp build is done with no errors <=====#', (end_date).toISOString());
                            gulp.src("gulpfile.js").pipe(notify('# build done in: ' + elapsed_time + ' ms'));
                            if(cb) cb();
                        } );                    
                    //} );
                } );
            } );
        //} );    
    };



gulp.task('jshint', jsHint);
gulp.task('dist', dist);
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
            //if(cb) cb();
        });
});
gulp.task('git-add', git_add);
gulp.task('git-commit', git_commit);
gulp.task('git-add-commit-push', git_add_commit_push);
gulp.task('git-push', function(){
    var start_date = new Date(),
        end_date,
        elapsed_time,
        commit_message = '';
        
  commit_message = 'build #' + package.version + ' - built with gulp';           
  git.push('origin', ['master'], {args: " --tags 'v"+(package.version)+"'"}, function (err) {
    if (err)
    {
        throw err;  
    } 
    end_date = new Date(),
    elapsed_time = (+end_date) - (+start_date);
    console.log('# git push executed in: ', elapsed_time + ' ms');

    console.log('# setting tag ' + ('v'+package.version) + ' ' + commit_message );
    git.tag( ('v'+package.version), commit_message, function (err) {
        
        if (err) throw err;
        if( err ) console.log( 'err: ', err);
        gulp.src("gulpfile.js").pipe(notify('# git push done in: ' + elapsed_time + ' ms'));
    });
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



gulp.task('server-start', function() {
    //2. serve at custom port
    var server = gls.static('dist', 8888);
    server.start();
   
    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['dist/*'], function(file) {
        server.notify.apply(server, [file]);
    });
});





//process.on('uncaughtException', function(err){
  //fs.writeSync(1, `Caught exception: ${err}`);
//});


//require('events').EventEmitter.prototype._maxListeners = 100;

process.on('exit', function(code){
  console.log("Gulp terminated: " + ( ( code == 0 ) ? 'with' : 'with no' ) + ' success'  );
});