'use strict';

var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var pkg = require('../package');
var replace = require('gulp-replace');
var size = require('gulp-size');
var tap = require('gulp-tap');
var path = require('path');

module.exports = function(gulp, conf) {
  gulp.task('build', function() {
    function info(file){
      return '/* ' + path.basename(file.path) + ' ' + pkg.version + ' */\n';
    }
    return gulp.src('lib/*.js')
      .pipe(tap(function(file, t) {
        file.contents = Buffer.concat([
          new Buffer(info(file)),
          file.contents
        ]);
      }))
      .pipe(stripDebug())
      .pipe(replace(/void 0;/g, ''))
      .pipe(size({
        showFiles: true
      }))
      .pipe(gulp.dest('dist'))
      .pipe(rename(function(file) {
        file.extname = '.min.js';
      }))
      .pipe(uglify())
      .pipe(tap(function(file, t) {
        file.contents = Buffer.concat([
          new Buffer(info(file)),
          file.contents
        ]);
      }))
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
