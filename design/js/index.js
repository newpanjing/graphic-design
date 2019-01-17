//引入js

var libs = ['/js/select.area.js','js/resize.js','js/drag.js','vue/vue.js','js/components.js','/js/frame.js'];
var base = './design/';
libs.forEach(lib => {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = base + lib;
    document.body.appendChild(script);
});

window.onload = function () {
    //初始化
    frameInit();
}