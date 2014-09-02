'use strict';

var eslint = require('gulp-eslint');

module.exports = function(gulp, conf) {
  gulp.task('eslint', function() {
    return gulp.src('lib/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .on('data', function(file) {
        if(file.eslint.messages && file.eslint.messages.length){
          gulp.fail = true;
        }
      });
  });
};
