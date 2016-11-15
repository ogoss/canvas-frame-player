'use strict';

var bs = require('browser-sync').create();
var CLIEngine = require('eslint').CLIEngine;

var cli = new CLIEngine({
  rules: {
    'quotes': [2, 'single'],
    'semi': 2,
    'no-loop-func': 2
  },
  useEslintrc: false,
  cache: true,
  cacheLocation: './.tmp/'
});
var formatter = cli.getFormatter();

var config = {
  src: './app/',
  dist: './dist/'
};

function lint(file) {
  var report = cli.executeOnFiles([file || config.src]);
  console.log(formatter(report.results));
}

function start() {
  bs.init({
    server: config.src,
    open: 'external'
  });

  bs.watch(config.src + '**/*.js', function(event, file) {
    if (event === 'change') {
      lint(file);

      bs.reload();
    }
  });
  bs.watch(config.src + '**/*.css').on('change', bs.reload);
  bs.watch([config.src + '*.html', config.src + 'images/']).on('change', bs.reload);
}

start();
