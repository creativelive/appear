'use strict';

var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var pkg = require('../package');
var header = require('gulp-header');
var replace = require('gulp-replace');
var size = require('gulp-size');

module.exports = function(gulp, conf) {
  gulp.task('build', function() {
    var info = '/* ' + pkg.name + ' ' + pkg.version + ' */\n';
    return gulp.src('lib/*.js')
      .pipe(header(info))
      .pipe(stripDebug())
      .pipe(replace(/void 0;/g, ''))
      .pipe(size({
        showFiles: true
      }))
      .pipe(gulp.dest('dist'))
      .pipe(rename(function(path) {
        path.extname = '.min.js';
      }))
      .pipe(uglify())
      .pipe(header(info))
      .pipe(size({
        showFiles: true
      }))
      .pipe(size({
        showFiles: true,
        gzip: true
      }))
      .pipe(gulp.dest('dist'));
  });
};
