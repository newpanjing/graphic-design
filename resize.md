# resize.js
js div 拉伸改变大小

用法：
```javascript
    new Resize(options).register(el)
```

options：

| 名称 | 参数 | 说明 |
|---|----|----|
|onBegin|data|开始拉伸|
|onResize|data|拉伸中|
|onEnd|data|结束拉伸|

## 支持jquery
```javascript

$.fn.resize=function() {
    var options={
        onBegin:function(data) {
          
        },
        onEnd:function(data) {
          
        },
        onResize:function(data) {
          
        }
    }
  new Resize(options).register(this);
}
```

jquery使用：
```javascript
 $(".aa").resize();
```

## 支持vue
```javascript

    Vue.directive('resize', {
        inserted(el, binding) {
            var options={};
            new Resize(options).register(el);
        }});
```

vue使用:
```html
<div v-resize="{aa:123}"></div>
```