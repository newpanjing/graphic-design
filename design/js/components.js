function componentInit() {


    //注册选区


    var directions = ['nw', 'w', 'ws', 's', 'se', 'e', 'ne', 'n'];



    //注册拖拽和拉伸
    // Vue.directive('drag', {
    //     inserted(dv, binding) {
    //
    //         var x = 0;
    //         var y = 0;
    //         var l = 0;
    //         var t = 0;
    //         var isDown = false;
    //
    //
    //         //鼠标按下事件
    //         dv.onmousedown = function (e) {
    //             if (e.button != 0) {
    //                 //屏蔽左键以外的按键
    //                 return;
    //             }
    //             // dv.click();
    //             //获取x坐标和y坐标
    //             x = e.clientX;
    //             y = e.clientY;
    //
    //             //获取左部和顶部的偏移量
    //             l = dv.offsetLeft;
    //             t = dv.offsetTop;
    //             //开关打开
    //             isDown = true;
    //             //设置样式
    //             dv.style.cursor = 'move';
    //
    //             window.onmousemove = function (e) {
    //                 if (isDown == false) {
    //                     return;
    //                 }
    //                 //获取x和y
    //                 var nx = e.clientX;
    //                 var ny = e.clientY;
    //
    //
    //                 //计算移动后的左偏移量和顶部的偏移量
    //                 var nl = nx - (x - l);
    //                 var nt = ny - (y - t);
    //
    //                 binding.value.shape.left = nl;
    //                 binding.value.shape.top = nt;
    //                 binding.value.shape.position={
    //                     x:nx-x,
    //                     y: ny - y
    //                 }
    //
    //                 dv.style.left = nl + 'px';
    //                 dv.style.top = nt + 'px';
    //
    //
    //             }
    //
    //             window.onmouseup = function () {
    //                 //开关关闭
    //                 isDown = false;
    //                 dv.style.cursor = 'default';
    //                 e.stopPropagation()
    //
    //             }
    //             e.stopPropagation()
    //
    //         }
    //
    //         //给拖拽图标注册事件，拖动改变dv
    //         directions.forEach(str => {
    //             var isDown = false;
    //             var obj = dv.querySelector("." + str);
    //             obj.onmousedown = function (e) {
    //
    //
    //                 var ox = e.clientX;
    //                 var oy = e.clientY;
    //
    //                 var data = {
    //                     ox: ox,
    //                     oy: oy,
    //                     ow: dv.offsetWidth,
    //                     oh: dv.offsetHeight,
    //                     ol: dv.offsetLeft,
    //                     ot: dv.offsetTop
    //
    //                 };
    //                 var isResize = true;
    //                 window.onmousemove = function (event) {
    //                     if (!isResize) {
    //                         return;
    //                     }
    //                     var x = event.clientX;
    //                     var y = event.clientY;
    //
    //                     //计算 width和height 差值
    //
    //                     var width = x - data.ox;
    //                     var height = y - data.oy;
    //
    //
    //                     data.width = width;
    //                     data.height = height;
    //
    //                     var fun = mappers[str];
    //                     if (fun) {
    //                         fun.call(obj, data, event);
    //                     }
    //                 }
    //                 window.onmouseup = function (ee) {
    //                     isResize = false;
    //                     ee.stopPropagation()
    //                 }
    //
    //                 //阻止事件冒泡
    //                 e.stopPropagation()
    //             }
    //
    //         });
    //
    //
    //         function setLeft(l) {
    //             binding.value.shape.left = l;
    //         }
    //
    //         function setTop(t) {
    //             binding.value.shape.top = t;
    //         }
    //
    //         function setWidth(w) {
    //             if (w < 20) {
    //                 w = 20;
    //             }
    //             binding.value.shape.width = w;
    //         }
    //
    //         function setHeight(h) {
    //
    //             if (h < 20) {
    //                 h = 20;
    //             }
    //             binding.value.shape.height = h;
    //         }
    //
    //         var mappers = {
    //             s: function (data) {
    //                 setHeight(data.oh + data.height);
    //             },
    //             e: function (data) {
    //                 setWidth(data.ow + data.width)
    //             },
    //             w: function (data) {
    //                 var value = data.width;
    //
    //
    //                 var l = data.ol + value;
    //                 var w = data.ow + Math.abs(value);
    //
    //                 if (value > 0) {
    //                     w = data.ow - value;
    //                 }
    //
    //                 if (w > 20) {
    //                     setLeft(l);
    //                     setWidth(w);
    //                 }
    //             },
    //             n: function (data) {
    //                 var value = data.height;
    //
    //                 var t = data.ot + value;
    //                 var h = data.oh + Math.abs(value);
    //
    //                 if (value > 0) {
    //                     h = data.oh - value;
    //                 }
    //                 if (h > 20) {
    //                     setHeight(h);
    //                     setTop(t);
    //                 }
    //             },
    //             se: function (data) {
    //                 mappers.s(data);
    //                 mappers.e(data);
    //             },
    //             nw: function (data) {
    //                 mappers.n(data);
    //                 mappers.w(data);
    //             },
    //             ws: function (data) {
    //                 mappers.w(data);
    //                 mappers.s(data);
    //             },
    //             ne: function (data) {
    //                 mappers.n(data);
    //                 mappers.e(data);
    //             }
    //         }
    //
    //     },
    //     componentUpdated(el, binding) {
    //     }
    //
    // })

    //注册组件
    Vue.component('shape', {
        props: ['shape'],
        data: function () {

            var shape = this.shape;


            var mappers = {
                numbers: ['left', 'top', 'width', 'height', 'borderWidth', 'fontSize'],
                strings: ['active', 'borderColor', 'borderStyle', 'fontColor', 'fontStyle']
            }
            var alias = {
                fontColor: 'color'
            };

            return {
                data: shape,

                //方向
                directions: directions,
                style() {

                    var json = {};
                    for (var key in shape) {
                        var value = shape[key];

                        var isNumber = mappers.numbers.indexOf(key) != -1;
                        var isString = mappers.strings.indexOf(key) != -1;

                        //不在样式表范围内的字段不处理
                        if (isNumber || isString) {
                            if (isNumber) {
                                value = value + 'px';
                            }

                            key = alias[key] || key;
                            json[key] = value;
                        }
                    }
                    return json;
                }
            }
        },
        watch: {
            'data.position': function (val, old) {
                this.$emit('move', val)
            }
        },
        methods: {},
        computed: {},
        template: `<div :class="{shape:true,active:data.active}" :style="style()"><div type="text">{{data.value}}</div></div>`
    });
}