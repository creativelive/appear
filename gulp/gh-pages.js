'use strict';

var path = require('path');
var fs = require('fs');
var ejstpl = require('ejstpl');
var mkdirp = require('mkdirp').sync;

var marked = require('marked');
var renderer = new marked.Renderer();
// don't add ids to headings
renderer.heading = function(text, level) {
  return '<h' + level + '>' + text + '</h' + level + '>';
};

module.exports = function(gulp, conf) {

  var data = {
    js: {},
    css: {},
    img: {
      logo64: 'https://cdn.rawgit.com/creativelive/appear/ac50b538687b3ab111131a02780373de479fca50/assets/appear-64.png',
      hat: 'https://cdn.rawgit.com/creativelive/appear/715cd5df6c518493dc406365b0026cc7da92cf78/assets/magic-hat.png',
      hatEmpty: 'https://cdn.rawgit.com/creativelive/appear/715cd5df6c518493dc406365b0026cc7da92cf78/assets/magic-hat-empty.png'
    }
  };

  gulp.task('gh-pages', function(cb) {

    var readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
    data.js.appear = fs.readFileSync(path.join(process.cwd(), 'lib', 'appear.js'), 'utf8');
    data.js.appearmin = fs.readFileSync(path.join(process.cwd(), 'dist', 'appear.min.js'), 'utf8');
    data.js.appearlazy = fs.readFileSync(path.join(process.cwd(), 'lib', 'appearlazy.js'), 'utf8');
    data.css.appearlazy = fs.readFileSync(path.join(process.cwd(), 'dist', 'appearlazy.css'), 'utf8');

    readme = readme.split('\n');
    // remove H1
    readme.shift();
    readme = readme.join('\n');
    data.readme = marked(readme, {
      renderer: renderer
    });

    var templates = ejstpl({cwd: path.join(process.cwd(), 'templates')});

    var dest = path.join(process.cwd(), '.gh-pages');
    mkdirp(dest);

    fs.writeFileSync(path.join(dest, 'index.html'), templates.index(data));
    data.title = ' - simple example';
    mkdirp(path.join(dest, 'examples', 'simple'));
    fs.writeFileSync(path.join(dest, 'examples', 'simple', 'index.html'), templates['examples/simple/index'](data));
    data.title = ' - lazyload example';
    mkdirp(path.join(dest, 'examples', 'lazy'));
    fs.writeFileSync(path.join(dest, 'examples', 'lazy', 'index.html'), templates['examples/lazy/index'](data));

    cb();

  });
};
