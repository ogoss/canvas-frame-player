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
  var framePlayer = {};
  var document = window.document;
  var frameList = [];
  var config = {
    $canvasEl: '#canvas',
    width: 750,
    height: 1207
  };

  function init(param) {
    clone(config, param);
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
   * @param  {Array} frameSrc 序列帧数组
   */
  function loadFrame(frameSrc) {
    frameSrc = frameSrc || [];

    var i = 0;
    var length = frameSrc.length;
    var imageArr = [];

    for (; i < length; i++) {
      var image = new Image();
      image.onload = imageArr.push(this);
      image.src = frameSrc[i];
    }

    frameList.push(imageArr);
  }

  /**
   * 播放序列帧
   * @param  {Number} index 索引
   */
  function play(index) {

  }

  framePlayer.init = init;
  framePlayer.loadFrame = loadFrame;
  framePlayer.play = play;

  return framePlayer;
}));
