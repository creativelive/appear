'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var ejstpl = require('ejstpl');

module.exports = function(gulp, conf) {
  gulp.task('ghpage', function(cb) {

    var readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
    readme = readme.split('\n');
    // remove H1
    readme.shift();
    readme = readme.join('\n');
    readme = marked(readme);

    var templates = ejstpl({cwd: path.join(process.cwd(), 'templates')});

    fs.writeFileSync(path.join(process.cwd(), 'ghpage', 'index.html'), templates.main({content: readme}));
    cb();

  });
};
