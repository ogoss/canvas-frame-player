/**
 * Canvas Frame Player
 */
;
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    global.framePlayer = factory();
  }
}(window, function() {
  var document = window.document;

  var framePlayer = {};

  var frameList = {};
  var config = {
    nodeName: '#canvas',
    nodeClass: '',
    width: 750,
    height: 1207
  };
  var canvas;
  var context;

  var lastTime = 0;
  var looping = false;

  function init(param) {
    clone(config, param);

    // 获取canvas外层DOM
    var nodeName = document.querySelector(config.nodeName);
    if (!nodeName) {
      nodeName = document.createElement('div');
      document.body.appendChild(nodeName);
    }
    nodeName.className += config.nodeClass;

    // 添加canvas
    canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    context = canvas.getContext('2d');
    nodeName.appendChild(canvas);
  }

  /**
   * 属性赋值
   * @param {Object} des 目标属性对象
   * @param {Object} src 输入的新属性对象
   */
  function clone(des, src) {
    var prop;

    for (prop in src) {
      if (des.hasOwnProperty(prop)) {
        des[prop] = src[prop];
      }
    }
  }

  /**
   * 加载序列帧图片
   * @param {Array} frames 序列帧数组
   * @param {String} tag 序列帧索引
   */
  function loadFrame(frames, tag) {
    frames = frames || [];
    tag = tag || 'tag' + Math.round(new Date().getTime() / 1000);

    var i = 0;
    var length = frames.length;
    var imageArr = [];
    var image;

    frameList[tag] = {
      status: 0,
      res: []
    };

    for (; i < length; i++) {
      image = new Image();
      image.onload = onload(tag, i, length);
      image.src = frames[i];
    }

    return tag;
  }

  function onload(tag, num, sum) {
    var rate = parseInt(((num + 1) / sum) * 100);
    return function callback() {
      frameList[tag].status = rate;
      frameList[tag].res.push(this);
    };
  }

  /**
   * 播放序列帧
   * @param  {String} tag 序列帧索引
   * @param  {Number} duration 持续时间，单位ms
   */
  function play(tag, duration) {
    var i, length, interval;
    if (frameList[tag].status === 100) {
      i = 0;
      length = frameList[tag].res.length;
      lastTime = Date.now();
      interval = duration / length;
      looping = true;

      loop([i, length, tag, interval]);
    } else {
      console.log('Failed to play frames');
    }
  }

  function loop(params) {
    if (!looping) {
      return;
    }

    var currentTime = Date.now();
    var deltaTime = currentTime - lastTime;

    var i = params[0];
    var length = params[1];
    var tag = params[2];
    var interval = params[3];

    if ((deltaTime >= interval) && (i < length)) {
      console.log(frameList[tag].res[i]);
      context.drawImage(frameList[tag].res[i], 0, 0, config.width, config.height);

      params[0]++;
      lastTime = currentTime;
    } else if (i >= length) {
      looping = false;
    }

    requestAnimationFrame(loop.bind(this, params));
  }

  framePlayer.init = init;
  framePlayer.loadFrame = loadFrame;
  framePlayer.play = play;

  return framePlayer;
}));
