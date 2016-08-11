var gulp = require('gulp'),
    watch = require('gulp-watch'),
    //plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    map = require('map-stream'),
    events = require('events'),
    notify = require('gulp-notify'),
    emmitter = new events.EventEmitter(),
    path = require('path'),
    electron = require('gulp-electron'),
    electron_version = 'v1.3.1',
    //electron = require('gulp-atom-electron'),
    //gulpAsar = require('gulp-asar')
    packageJson = require('./package.json'),
    git = require('gulp-git'),
    gulp_live_server = require('gulp-live-server'),
    //istanbulReport = require('gulp-istanbul-report'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    beautify = require('gulp-beautify'),
    print = require('gulp-print'),
    fs = require("fs"),
    package = JSON.parse(fs.readFileSync('./package.json')),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    coverageFile = './coverage/coverage.json',
    files = "./lib/*.js",
    views = "./lib/view/*.js",
    model = "./lib/model/**/*.js",
    presenters = "./lib/presenter/*.js",
    paths = ["lib", "lib/view", "lib/presenter", "lib/model","lib/model/collections","lib/model/engines","lib/model/models", "deps/dhx", /*"lib/thirdparty"*/],
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
                        mangle: true//,
                        //outSourceMap: true
                    }))
                    .pipe(gulp.dest('./' + path_file))
                    .on('finish', function() {
                        //console.log( file +' minified to --> min.' + file );
                        done_files += 1;

                        if( done_files == t_files )
                        {
                            move_file_to_dist(null, function(){
                                move_file_to_dist_electron(null, function() {
                                    move_file_to_dist_chrome_app(null, function(){

                                        move_file_to_dist_chrome_extension( null, function(){
                                            end_date = new Date();
                                            var elapsed_time = (+end_date) - (+start_date);
                                            console.log('# dist executed in: ', elapsed_time + ' ms');
                                            console.log('#======> gulp dist is done with no errors <=====#', (end_date).toISOString());
                                            //gulp.src("gulpfile.js").pipe(notify('# dist done in: ' + elapsed_time + ' ms'));
                                            if(cb) cb();
                                            if (fn) fn();
                                        } );
                                    })
                                });
                            }) ; 
                            
                        }
                    });
                });
            });
            /*dis*/
        });
        
    },
    move_file_to_dist = function( cb, fn ){
        console.log('#======> moving files to dist/');
        // create dist/
        gulp
        .src(['lib/**/*'])
        .pipe(gulp.dest('dist/lib'))
        .on('finish', function() {
            gulp
            .src(['assets/**/*'])
            .pipe(gulp.dest('dist/assets'))
            .on('finish', function() {
                gulp
                .src(['deps/**/*'])
                .pipe(gulp.dest('dist/deps'))
                .on('finish', function() {
                    gulp.src(['boilerplate_sidebar.js'])
                        .pipe(gulp.dest('dist/'))
                        .on('finish', function() {
                            gulp
                            .src(['boilerplate_sidebar.html'])
                            .pipe(rename('index.html'))
                            .pipe(gulp.dest('dist/'))
                            .on('finish', function() {
                                if(fn)fn();
                            });
                        });
                });
            });
        });
    },
    move_file_to_dist_electron = function( cb, fn ){
        console.log('#======> moving files to dist_electron/');
        // create dist_electron/
        gulp
        .src(['dist/**/*'])
        .pipe(gulp.dest('dist_electron/public/'))
        .on('finish', function() {
            gulp
            .src(['assets/**/*'])
            .pipe(gulp.dest('dist_electron/public/assets'))
            .on('finish', function() {
                gulp
                .src('./electron.js')
                .pipe(rename('index.js'))
                .pipe(gulp.dest('dist_electron/'))
                .on('finish', function() {
                    gulp
                    .src('./package.json')
                    .pipe(gulp.dest('dist_electron/'))
                    .on('finish', function() {
                        if(fn)fn();
                    });
                });
            });
        });
    },
    move_file_to_dist_chrome_app = function( cb, fn ){
        console.log('#======> moving files to dist_chrome_app/');
        // create dist_electron/
        gulp
        .src(['dist/**/*'])
        .pipe(gulp.dest('dist_chrome_app/'))
        .on('finish', function() {
            gulp
            .src(['assets/**/*'])
            .pipe(gulp.dest('dist_chrome_app/assets'))
            .on('finish', function() {
                gulp
                .src('./google_app_manifest.json')
                .pipe(rename('manifest.json'))
                .pipe(gulp.dest('dist_chrome_app/'))
                .on('finish', function() {
                    gulp
                    .src('./assets/images/icon-16.png')
                    .pipe(gulp.dest('dist_chrome_app/'))
                    .on('finish', function() {
                        gulp
                        .src('./assets/images/icon-128.png')
                        .pipe(gulp.dest('dist_chrome_app/'))
                        .on('finish', function() {
                            gulp
                                .src(['./boilerplate_sidebar.html'])
                                .pipe(rename('index.html'))
                                .pipe(gulp.dest('dist_chrome_app/'))
                                .on('finish', function() {
                                    gulp
                                    .src(['./google_app_backgound.js'])
                                    .pipe(gulp.dest('dist_chrome_app/'))
                                    .on('finish', function() {
                                        if(fn)fn();
                                    });
                                });
                        });
                        
                    });
                });
            });
        });
    },
    move_file_to_dist_chrome_extension = function( cb, fn ){
        console.log('#======> moving files to dist_chrome_extension/');
        // create dist_chrome_extension/
        gulp
        .src(['dist/**/*'])
        .pipe(gulp.dest('dist_chrome_extension/'))
        .on('finish', function() {
            gulp
            .src(['assets/**/*'])
            .pipe(gulp.dest('dist_chrome_extension/assets'))
            .on('finish', function() {
                gulp
                .src('./google_extension_manifest.json')
                .pipe(rename('manifest.json'))
                .pipe(gulp.dest('dist_chrome_extension/'))
                .on('finish', function() {
                    gulp
                    .src('./assets/images/icon-16.png')
                    .pipe(gulp.dest('dist_chrome_extension/'))
                    .on('finish', function() {
                        gulp
                        .src('./assets/images/icon-128.png')
                        .pipe(gulp.dest('dist_chrome_extension/'))
                        .on('finish', function() {
                            gulp
                                .src(['./boilerplate_sidebar_chrome.html'])
                                .pipe(rename('index.html'))
                                .pipe(gulp.dest('dist_chrome_extension/'))
                                .on('finish', function() {
                                    //gulp
                                    //.src(['./google_extension_backgound.js'])
                                    //.pipe(gulp.dest('dist_chrome_extension/'))
                                    //.on('finish', function() {
                                        if(fn)fn();
                                    //});
                                });
                        });
                        
                    });
                });
            });
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
            .src([
                    './*', 
                    '!./node_modules','!./node_modules/**', 
                    '!./cache','!./cache/**',
                    '!./installers','!./installers/**',
                    '!./dhxMVP.sublime-project', 
                    '!./dhxMVP.sublime-workspace', 
                    '!./sublime-gulp.log'
            ])
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
            .src(['./*', '!./node_modules','!./node_modules/**','!./cache','!./cache/**','!./installers','!./installers/**', '!./dhxMVP.sublime-project', '!./dhxMVP.sublime-workspace', '!./sublime-gulp.log'])
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
            .src(['./*', '!./node_modules','!./node_modules/**','!./cache','!./cache/**', '!./installers','!./installers/**','!./dhxMVP.sublime-project', '!./dhxMVP.sublime-workspace', '!./sublime-gulp.log'])
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


gulp.task('build-installer-mac', function( ) {
 
    gulp.src('')
    .pipe(electron({
        src: './dist_electron',
        packageJson: packageJson,
        release: './installers',
        cache: './cache',
        version: electron_version,
        packaging: true,
        //asar: true,
        //token: 'abc123...',
        platforms: ['darwin-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: 'assets/icons/gulp-electron.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'assets/icons/gulp-electron.ico'
            }
        }
    }))
    .on('error', function(e){
        console.log( e );
        this.emit('end');
    })
    .on('finish', function() {
        
        //if(cb) cb();
    })
    .pipe(gulp.dest(""));
});


gulp.task('build-installer-windows', function() {
 
    gulp.src('')
    .pipe(electron({
        src: './dist_electron',
        packageJson: packageJson,
        release: './installers',
        cache: './cache',
        version: electron_version,
        packaging: true,
        //asar: true,
        //token: 'abc123...',
        platforms: ['win32-ia32', /*'win32',*/],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: 'assets/icons/gulp-electron.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'assets/icons/gulp-electron.ico'
            }
        }
    }))
    .on('error', function(e){
        console.log( e );
        this.emit('end');
    })
    .on('finish', function() {
        
        //if(cb) cb();
    })
    .pipe(gulp.dest(""));
});

gulp.task('build-installer-linux', function() {
 
    gulp.src('')
    .pipe(electron({
        src: './dist_electron',
        packageJson: packageJson,
        release: './installers',
        cache: './cache',
        version: electron_version,
        packaging: true,
        //asar: true,
        //token: 'abc123...',
        platforms: ['linux-ia32','linux-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: 'assets/icons/gulp-electron.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": 'assets/icons/gulp-electron.ico'
            }
        }
    }))
    .on('error', function(e){
        console.log( e );
        this.emit('end');
    })
    .on('finish', function() {
        
        //if(cb) cb();
    })
    .pipe(gulp.dest(""));
});


gulp.task('start-server', function() {
    //2. serve at custom port
    var server = gulp_live_server.static('dist', 8888);
    server.start();
   
    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['dist/*'], function(file) {
        server.notify.apply(server, [file]);
    });
});


gulp.task('start-development-server', function() {
    //2. serve at custom port
    var server = gulp_live_server.static('./', 9999);
    server.start();
   
    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['lib/**/*', 'assets/**/*'], function(file) {
        server.notify.apply(server, [file]);
    });
});



gulp.task('git-init', function(){
  git.init();
});
gulp.task('git-add', git_add);
gulp.task('git-commit', git_commit);
gulp.task('git-add-commit-push', git_add_commit_push);
gulp.task('git-push', function(){
    var start_date = new Date(),
        end_date,
        elapsed_time,
        commit_message = '';
        
    commit_message = 'Build #' + package.version + '.\n\nBuilt with gulp.';
    git.tag( ('v'+package.version+'-alpha'), commit_message, {args: ''}, function (err) {
        
        if (err) throw err;
        if( err ) console.log( 'err: ', err);


        git.push('origin', ['master'], {args: " --tags"}, function (err) {
            if (err)
            {
                throw err;  
            } 
            end_date = new Date(),
            elapsed_time = (+end_date) - (+start_date);
            console.log('# git push executed in: ', elapsed_time + ' ms');
            gulp.src("gulpfile.js").pipe(notify('# git push done in: ' + elapsed_time + ' ms'));
        });
        
    });      
  
});




gulp.task('default', function() {
    gulp.run('jshint');
    //gulp.watch(files, function(evt) {
    //    gulp.run('jshint');
    //});
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




//process.on('uncaughtException', function(err){
  //fs.writeSync(1, `Caught exception: ${err}`);
//});


//require('events').EventEmitter.prototype._maxListeners = 100;

process.on('exit', function(code){
  console.log("Gulp terminated: " + ( ( code == 0 ) ? 'with' : 'with no' ) + ' success'  );
});