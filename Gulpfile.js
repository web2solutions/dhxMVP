var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var beautify = require('gulp-beautify');
var print = require('gulp-print');
var path = require("path");
var fs = require("fs");

var mochaPhantomJS = require('gulp-mocha-phantomjs');

/*var istanbulReport = require('gulp-istanbul-report');*/
var coverageFile = './coverage/coverage.json';

var files = "./lib/*.js";
var views = "./lib/view/*.js";
var model = "./lib/model/*.js";
var presenters = "./lib/presenter/*.js";
var paths = ["lib", "lib/view", "lib/presenter", "lib/model", "lib/dhx"];

gulp.task('lint', function() {
    paths.forEach(function(path_file) {
        console.log('=====> working on the directory: ', path_file);
        var app_files = fs.readdirSync(path.join(__dirname, path_file));
        var app_files_a = [];
        app_files.forEach(function(file) {
            if (file.indexOf(".js", file.length - 3) != -1) {
                if (file.indexOf("min.") == -1) {
                    app_files_a.push(file);
                }
            }
        });
        app_files_a.forEach(function(file) {
            console.log('linting ' + file);
            gulp.src("./" + path_file + "/" + file).pipe(print(function(filepath) {
                return "linted: " + filepath;
            })).pipe(jshint()).pipe(jshint.reporter('default'));
        });
    });
});
gulp.task('dist', function() {
    paths.forEach(function(path_file) {
        console.log('=====> working on the directory: ', path_file);
        var app_files = fs.readdirSync(path.join(__dirname, path_file));
        var app_files_a = [];
        app_files.forEach(function(file) {
            if (file.indexOf(".js", file.length - 3) != -1) {
                if (file.indexOf("min.") == -1) {
                    app_files_a.push(file);
                }
            }
        });
        app_files_a.forEach(function(file) {
            console.log('packing ' + file, ' --> min.' + file);
            gulp.src("./" + path_file + "/" + file).pipe(print(function(filepath) {
                return "built: " + filepath;
            })).pipe(rename('min.' + file)).pipe(uglify()).pipe(gulp.dest('./' + path_file));
        });
    });
    gulp.src("./lib/thirdparty/backbone-indexeddb.js").pipe(print(function(filepath) {
        return "built: " + filepath;
    })).pipe(rename('min.backbone-indexeddb.js')).pipe(uglify()).pipe(gulp.dest('./lib/thirdparty'));
    gulp.src("./lib/thirdparty/progressbar.js").pipe(print(function(filepath) {
        return "built: " + filepath;
    })).pipe(rename('min.progressbar.js')).pipe(uglify()).pipe(gulp.dest('./lib/thirdparty'));
    gulp.src("./lib/thirdparty/underscore.js").pipe(print(function(filepath) {
        return "built: " + filepath;
    })).pipe(rename('min.underscore.js')).pipe(uglify()).pipe(gulp.dest('./lib/thirdparty'));
    /*dis*/
});
gulp.task('test', function() {
    return gulp.src('./test/test.html').pipe(mochaPhantomJS({
        //reporter: 'tap', // spec
        //mocha: {
        //    grep: 'pattern'
        //},
        phantomjs: {
            viewportSize: {
                width: 1024,
                height: 768
            },
            useColors: true,
            hooks: 'mocha-phantomjs-istanbul',
            coverageFile: coverageFile,
        },
        reporter: 'spec'
    }));
});


gulp.task('test-coverage', function() {
    var phantomConf = {
        phantomjs: {
            hooks: 'mocha-phantomjs-istanbul',
            coverageFile: coverageFile
        },
        reporter: 'spec'
    };
    return gulp.src('./test/test.html', {read: false})
    	.pipe(mochaPhantomJS(phantomConf))
    	.on('finish', function() {
        	gulp.src(coverageFile).pipe(istanbulReport())
    	});
});
gulp.task('default', function() {
    gulp.run('lint');
    gulp.watch(files, function(evt) {
        gulp.run('lint');
    });
});