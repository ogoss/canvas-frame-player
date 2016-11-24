'use strict';

var fs = require('fs');
var UglifyJS = require('uglify-js');
var dist = './dist/';
var file = './app/scripts/frame-player.js';
var outPutFile = 'frame-player.min.js';
var outSourceMap = 'frame-player.min.js.map';

var result = UglifyJS.minify(file, {
  outSourceMap: outSourceMap
});

fs.access(dist, fs.F_OK, function(err) {
  if (err) {
    fs.mkdirSync(dist);
  }

  fs.writeFile(dist + outPutFile, result.code, 'utf8', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Build Success!');
    }
  });
  fs.writeFile(dist + outSourceMap, result.map, 'utf8', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Build Success!');
    }
  });
});
