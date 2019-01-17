/**
 * 初始化布局UI
 */
function frameInit() {
    console.log('frame init.')


    initSelectArea();
    initDrag();
    componentInit();
    initApp();
    initLayout();

    for (var i = 0; i < 10; i++) {
        app.shapes.push({
            left: i * 3 * 10,
            top: i * 3 * 10,
            width: 60,
            height: 60,
            active: false,
            value: i,
            position: {}
        })
    }
}

function initSelectArea() {
    Vue.directive('selectarea', {
        inserted(el, binding) {
            new SelectArea({
                onHandler: function (data) {
                    app.shapes.forEach(item => {
                        //计算出每个item的x1 x2 y1 y2
                        var ix1 = item.left, ix2 = item.left + item.width;
                        var iy1 = item.top, iy2 = item.top + item.height;

                        //碰撞检测
                        var crash = (data.y2 >= iy1 && data.y1 <= iy2) && (data.x2 >= ix1 && data.x1 <= ix2);
                        item.active = crash;
                        item.selectArea = crash;
                    });

                }
            }).register(el);
        }
    });
}

function initDrag() {

    Vue.directive('drag', {
        inserted(dv, binding) {
            var drag = new Drag({
                onBegin: function (data) {
                    //所有选中的 记录下旧的坐标
                    app.shapes.forEach(item => {
                        if (item.active) {
                            item.oldLeft = item.left;
                            item.oldTop = item.top;
                        }
                    });
                    var index = parseInt(dv.getAttribute('data-index'));
                    app.shapes[index].active = true;
                },
                onEnd: function (data) {
                    app.shapes.forEach(item => {
                        if (item.active) {
                            item.oldLeft = item.left;
                            item.oldTop = item.top;
                        }
                    });
                },
                onDrag: function (data) {
                    var shape = binding.value.shape;
                    shape.left = data.left;
                    shape.top = data.top;

                    //所有选中的移动，不包括当前
                    app.shapes.forEach(item => {
                        if (item.active && item != shape) {
                            item.left = data.x + item.oldLeft;
                            item.top = data.y + item.oldTop;
                        }
                    });
                }
            })
            drag.register(dv);

            //注册拉伸
            var resize = new Resize({
                onResize: function (data) {
                    for (var key in data) {
                        binding.value.shape[key] = data[key];
                    }
                }
            });
            resize.register(dv);
        }
    });

}

function moveLeft(val) {
    app.shapes.forEach(item => {
        if (item.active && item.selectArea) {
            item.left += val;
        }
    });
}

function moveTop(val) {
    app.shapes.forEach(item => {
        if (item.active && item.selectArea) {
            item.top += val;
        }
    });
}

function initApp() {
    window.app = new Vue({
        el: '#app',
        data: {
            layout: {
                left: 250,
                right: 250,
                center: 200,
                margin: 30,
                width: getSize().width,
                height: getSize().width
            },
            card: {
                width: 500,
                height: 700
            },
            selected: {},
            isSelected: false,
            shapes: [{
                left: 10,
                top: 20,
                width: 200,
                height: 60,
                active: false,
                value: 'sd',
                position: {}
            }, {
                left: 30,
                top: 50,
                width: 50,
                height: 50,
                active: false,

                borderWidth: 0,
                borderColor: '',
                borderStyle: 'solid',

                fontColor: '',
                fontSize: 12,
                fontStyle: '',
                value: '文本标签',
                position: {}
            }],
            popup: {
                show: false,
                left: 0,
                top: 0,
                data: {},
                cut: function () {
                    console.log('cut')
                    console.log(this.data)
                    this.show = false;
                },
                copy: function () {
                    console.log('copy')


                    this.show = false;
                },
                del: function () {
                    for (var i = 0; i < app.shapes.length; i++) {
                        var item = app.shapes[i];
                        if (item == this.data) {
                            app.shapes.splice(i, 1);
                            break;
                        }
                    }
                    this.show = false;
                },
                up: function () {
                    this.show = false;
                },
                down: function () {
                    this.show = false;
                }
            },
            selectArea: {
                show: false,
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            isShiftDown: false
        },
        watch: {
            selected: function (value) {
                var sed = false;


                for (var i in value) {
                    sed = true;
                    break;
                }

                app.isSelected = sed;
            }
        },
        methods: {
            cardClick: function (e) {

                var area = app.selectArea;

                app.shapes.forEach(item => item.active = false);
                app.popup.show = false;
                app.selected = {}
            },
            componnetsMove: function (data) {
                // app.shapes.forEach(item => {
                //     if (item.active) {
                //         item.left -= data.x;
                //         item.top -= data.y;
                //     }
                // })
            },
            selectShape: function (e, shape) {
                this.shapes.forEach(item => item.active = false);
                shape.active = true;
                e.preventDefault();
                this.selected = shape;
                this.isSelected = true;
            },
            showContextmenu: function (e, data) {
                app.popup.left = e.clientX;
                app.popup.top = e.clientY;
                app.popup.show = true;
                app.popup.data = data;
            },
            cardKeyup: function (e) {
                if (e.keyCode == 9) {
                    app.isShiftDown = false;
                }
            },
            shapeMove: function (e, data, index) {
                var code = e.keyCode;
                console.log(code)
                var keymaps = {
                    37: () => moveLeft(-1),
                    38: () => moveTop(-1),
                    39: () => moveLeft(1),
                    40: () => moveTop(1),
                    9: () => app.isShiftDown = true,
                    8: function () {

                        if (confirm('您确定要删除选中的元素吗？')) {

                            for (var i = 0; i < app.shapes.length; i++) {
                                if (app.shapes[i].active) {
                                    app.shapes.splice(i--, 1);
                                }
                            }

                            app.selected = {};
                        }
                    },

                }
                var fun = keymaps[code];
                if (fun) {
                    fun.call(data, index);
                }
            }
        }
    });
}

function initLayout() {


    function handlerLayout() {
        var size = getSize();
        // if (size.width < 600 || size.height < 500) {
        //     return;
        // }
        app.layout.width = size.width;
        app.layout.height = size.height;

        //计算center的宽度
        //2=3个边框的宽度3*2
        //20=2个框的外边距
        //20=内边距

        app.layout.center = size.width - app.layout.left - app.layout.right - 22 - (app.layout.margin * 2);

    }

    handlerLayout();

    window.onresize = handlerLayout;

}

function getSize() {

    return {
        width: document.documentElement.clientWidth || document.body.clientWidth,
        height: document.documentElement.clientHeight || document.body.clientHeight
    };
}