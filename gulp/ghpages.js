'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var ejstpl = require('ejstpl');

module.exports = function(gulp, conf) {

  var data = {
    js: {},
    img: {
      logo64: 'https://cdn.rawgit.com/creativelive/appear/ac50b538687b3ab111131a02780373de479fca50/assets/appear-64.png',
      hat: 'https://cdn.rawgit.com/creativelive/appear/715cd5df6c518493dc406365b0026cc7da92cf78/assets/magic-hat.png',
      hatEmpty: 'https://cdn.rawgit.com/creativelive/appear/715cd5df6c518493dc406365b0026cc7da92cf78/assets/magic-hat-empty.png'
    }
  };


  gulp.task('ghpages', function(cb) {

    var readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
    data.js.appear = fs.readFileSync(path.join(process.cwd(), 'dist', 'appear.min.js'), 'utf8');

    readme = readme.split('\n');
    // remove H1
    readme.shift();
    readme = readme.join('\n');
    data.readme = marked(readme);

    var templates = ejstpl({cwd: path.join(process.cwd(), 'templates')});

    data.page = 'main';

    fs.writeFileSync(path.join(process.cwd(), 'ghpages', 'index.html'), templates.main(data));
    cb();

  });
};
