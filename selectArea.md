# select.area.js
js div 创建选区

用法：
```javascript
    new SelectArea(options).register(el)
```

options：

| 名称 | 参数 | 说明 |
|---|----|----|
|onBegin|data|选区结束|
|onHandler|data|选区拉伸中|
|onEnd|data|选区开始|

## 支持jquery
```javascript

$.fn.selectArea=function() {
    var options={
        onBegin:function(data) {
          
        },
        onEnd:function(data) {
          
        },
        onHandler:function(data) {
          
        }
    }
  new SelectArea(options).register(this);
}
```

jquery使用：
```javascript
 $(".aa").selectArea();
```

## 支持vue
```javascript

    Vue.directive('selectarea', {
        inserted(el, binding) {
            var options={};
            new Resize(options).register(el);
        }});
```

vue使用:
```html
<div v-selectarea="{aa:123}"></div>
```

### PS: 为什么不适用驼峰大小写？
> vue会报错，具体原因还没来得及去看文档。