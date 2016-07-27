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
var paths = ["lib", "lib/view", "lib/presenter", "lib/model", "lib/dhx", /*"lib/thirdparty"*/];


gulp.task('jshint', function ( cb ) {
	
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
				    console.log('# gulp jshint executed in: ', elapsed_time + ' ms');
				    console.log('#======> gulp jshint is done with no errors <=====#', (end_date).toISOString());
				    gulp.src("gulpfile.js").pipe(notify('# gulp jshint done in: ' + elapsed_time + ' ms'));
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
});




gulp.task('all', ['jshint'], function() {
  gulp.src("gulpfile.js").pipe(notify('# gulp ALL done in:  ms'));
});

gulp.task('dist', ['jshint', 'test'], function() {
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
            .pipe(uglify())
            .pipe(gulp.dest('./' + path_file))
            .on('finish', function() {
	        	//console.log( file +' minified to --> min.' + file );
	        	done_files += 1;

	        	if( done_files == t_files )
	        	{
	        		end_date = new Date();
	        		var elapsed_time = (+end_date) - (+start_date);
	        		console.log('# gulp dist executed in: ', elapsed_time + ' ms');
	        		console.log('#======> gulp dist is done with no errors <=====#', (end_date).toISOString());
	        		gulp.src("gulpfile.js").pipe(notify('# gulp dist done in: ' + elapsed_time + ' ms'));
	        	}
	    	});
        });
    });
    /*dis*/
});
var called = false;
gulp.task('test', function( cb ) {
	var start_date = new Date(),
		end_date = 0,
		elapsed_time = 0;
	//console.log('test arguments', arguments);
	
    return gulp.src('./test/test.html')
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
    	gulp.src("gulpfile.js").pipe(notify('# gulp test done in: ' + elapsed_time + ' ms'));
    	if( !called )
    	{
    		//cb();	
    	}
	});
});


var istanbulReport = require('gulp-istanbul-report');

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

gulp.task('default', function() {
    gulp.run('jshint');
    gulp.watch(files, function(evt) {
        gulp.run('jshint');
    });
});



//process.on('uncaughtException', function(err){
  //fs.writeSync(1, `Caught exception: ${err}`);
//});


require('events').EventEmitter.prototype._maxListeners = 100;

process.on('exit', function(code){
  console.log("About to exit with code: " + code );
});