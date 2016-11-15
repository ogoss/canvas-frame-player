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
   * @param {Array} frameSrc 序列帧数组
   * @param {String} tag 序列帧索引
   */
  function loadFrame(frameSrc, tag) {
    frameSrc = frameSrc || [];
    tag = tag || 'tag' + Math.round(new Date().getTime() / 1000);

    var i = 0;
    var length = frameSrc.length;
    var imageArr = [];
    var image;

    frameList[tag] = {
      status: 0,
      res: []
    };

    for (; i < length; i++) {
      image = new Image();
      image.onload = onload(tag, i, length);
      image.src = frameSrc[i];
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
   */
  function play(tag) {
    if (frameList[tag].status === 100) {
      console.log(frameList[tag]);
      context.drawImage(frameList[tag].res[0], 0, 0, config.width, config.height);
    } else {
      console.log('Failed to play frames');
    }
  }

  framePlayer.init = init;
  framePlayer.loadFrame = loadFrame;
  framePlayer.play = play;

  return framePlayer;
}));
