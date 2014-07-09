/*eslint no-process-exit:0 */
'use strict';

var gulp = require('gulp');
var path = require('path');

// combine all the gulp tasks
require('fs').readdirSync('./gulp').forEach(function(file) {
  if (path.extname(file) === '.js') {
    require('./gulp/' + file)(gulp);
  }
});

gulp.task('default', function() {
  console.log('gulp!');
});

process.on('exit', function() {
  if (gulp.fail) {
    // return non-zero exit code
    process.exit(1);
  }
});
