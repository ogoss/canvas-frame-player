/**
 * Canvas Frame Player v1.0.0
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

  var config = {
    nodeName: '#canvas',
    nodeClass: '',
    width: 750,
    height: 1207
  };
  var frameList = {};
  var canvas;
  var context;

  var currentTime = 0;
  var lastTime = 0;
  var deltaTime = 0;
  var start = 0;
  var total = 0;
  var interval = 0;
  var playtimes = 0;
  var looping = false;
  var loopObj = {};
  var onLoopStart = {};
  var onLoopProcess = {};
  var onLoopEnd = {};

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
   * 启动循环函数
   */
  function startLoop() {
    onLoopStart.type = isFunction(onLoopStart.func);
    onLoopProcess.type = isFunction(onLoopProcess.func);
    onLoopEnd.type = isFunction(onLoopEnd.func);

    lastTime = Date.now();
    looping = true;

    if (onLoopStart.type) {
      onLoopStart.func();
    }

    loop();
  }

  /**
   * 循环主函数
   */
  function loop() {
    if (!looping || playtimes === 0) {
      (onLoopEnd.type && start === total) ? onLoopEnd.func(): '';

      return;
    }

    currentTime = Date.now();
    deltaTime = currentTime - lastTime;

    if (onLoopProcess.type) {
      onLoopProcess.func();
    }

    requestAnimationFrame(loop);
  }

  /**
   * 验证是否是函数
   * @param {Object} functionToCheck [description]
   * @return {Boolean}
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  function queue(params) {
    var rate, image, timer, clearTimer;

    if (params.start >= params.total) {
      return;
    }

    clearTimer = function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      params.start++;
      queue(params);
    };

    image = new Image();
    image.onload = image.onabort = image.onerror = null;

    image.onload = function() {
      rate = parseInt(((params.start + 1) / params.total) * 100);
      frameList[params.tag].status = rate;
      frameList[params.tag].res.push(this);

      clearTimer();
    };
    image.onerror = function() {
      clearTimer();
    };
    image.src = params.frames[params.start];

    timer = setInterval(function() {
      clearTimer();
    }, 2000);
  }

  /**
   * 初始化
   * @param {Object} param 参数
   */
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
   * 加载序列帧图片
   * @param {Array} frames 序列帧数组
   * @param {String} tag 序列帧索引
   */
  function loadFrame(frames, tag) {
    frames = frames || [];
    tag = tag || 'tag' + Math.round(new Date().getTime() / 1000);

    frameList[tag] = {
      status: 0,
      res: []
    };

    queue({
      start: 0,
      total: frames.length,
      imageArr: [],
      frames: frames,
      tag: tag
    });
  }

  /**
   * 播放序列帧
   * @param {String} tag 序列帧索引
   * @param {Number} duration 持续时间，单位ms
   * @param {Number} times 动画播放次数 [times<0:无限次, times=0:不播放, times>0:播放times次]
   * @param {Function} onPlayStart 开始播放回调函数
   * @param {Function} onPlayEnd 结束播放回调函数
   */
  function play(tag, duration, times, onPlayStart, onPlayEnd) {
    if (frameList[tag].status === 100) {
      start = 0;
      total = frameList[tag].res.length;
      playtimes = times || 0;
      interval = duration / total;
      loopObj = {
        tag: tag
      };
      onLoopStart.func = onPlayStart;
      onLoopEnd.func = onPlayEnd;
      onLoopProcess.func = function() {
        if ((deltaTime >= interval) && (start < total)) {
          context.drawImage(frameList[loopObj.tag].res[start], 0, 0, config.width, config.height);
          start++;
          lastTime = currentTime;
        } else if (start >= total) {
          if (playtimes != 0) {
            start = 0;
            playtimes--;
          } else {
            looping = false;
          }
        }
      };

      startLoop();
    } else {
      console.log('Failed to play frames');
    }
  }

  /**
   * 清除屏幕内容
   */
  function clear() {
    context.clearRect(0, 0, config.width, config.height);
  }

  /**
   * 停止动画
   */
  function stop() {
    looping = false;
  }

  framePlayer.init = init;
  framePlayer.loadFrame = loadFrame;
  framePlayer.play = play;
  framePlayer.clear = clear;
  framePlayer.stop = stop;

  return framePlayer;
}));
