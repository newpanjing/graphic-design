# drag.js
js div 实现推拽功能

用法：
```javascript
    new Drag(options).register(el)
```

options：

| 名称 | 参数 | 说明 |
|---|----|----|
|onDrag|left=左边距离，top=顶部距离|推拽中|
|onBegin|left=左边距离，top=顶部距离,x=移动的左边相对距离，y=移动的顶部相对距离|开始推拽|
|onEnd|left=左边距离，top=顶部距离|结束推拽|

## 支持jquery
```javascript

$.fn.drag=function() {
    var options={
        onBegin:function(data) {
          
        },
        onEnd:function(data) {
          
        },
        onDrag:function(data) {
          
        }
    }
  new Drag(options).register(this);
}
```

jquery使用：
```javascript
 $(".aa").drag();
```

## 支持vue
```javascript

    Vue.directive('drag', {
        inserted(el, binding) {
            var options={};
            new Drag(options).register(el);
        }});
```

vue使用:
```html
<div v-drag="{aa:123}"></div>
```