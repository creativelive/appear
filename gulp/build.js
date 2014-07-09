'use strict';

var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var rename = require('gulp-rename');
var pkg = require('../package');
var header = require('gulp-header');

module.exports = function(gulp, conf) {
  gulp.task('build', function() {
    var info = '/* ' + pkg.name + ' ' + pkg.version + ' */\n';
    return gulp.src('lib/*.js')
      .pipe(header(info))
      .pipe(stripDebug())
      .pipe(gulp.dest('dist'))
      .pipe(rename(function(path) {
        path.extname = '.min.js';
      }))
      .pipe(uglify())
      .pipe(header(info))
      .pipe(gulp.dest('dist'));
  });
};
