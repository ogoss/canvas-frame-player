# CanvasFramePlayer 模块

## 初始化

- 安装依赖

```
npm install
```

- 启动服务

```
npm start
```

## 配置属性

``` javascript
framePlayer.init({
  nodeName: '#canvas',
  nodeClass: '',
  width: 750,
  height: 1207
});
```

- nodeName: canvas外层元素
- nodeClass: canvas外层元素样式类名
- width: (default: 750) canvas宽度
- height: (default: 1207) canvas高度

## 方法调用

- 加载序列帧图片

``` javascript
/**
 * @param {Array} frames 序列帧数组
 * @param {String} tag 序列帧索引
 */
framePlayer.loadFrame(frames, tag);
```

- 播放序列帧

``` javascript
/**
 * @param {String} tag 序列帧索引
 * @param {Number} duration 持续时间，单位毫秒
 */
framePlayer.play(tag, duration);
```