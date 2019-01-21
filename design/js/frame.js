/**
 * 初始化布局UI
 */
function frameInit() {

    initSelectArea();
    initDrag();
    componentInit();
    initApp();
    initLayout();

    document.addEventListener('click', function () {

        app.popup.show = false;
        app.cardPopup.show = false;
    });

    for (var i = 0; i < 10; i++) {

        pushShape({
            left: i * 3 * 10,
            top: i * 3 * 10,
            width: 100,
            height: 20,
            value: new Date().getTime(),
            type: 0,
        })
    }

}

function pushShape(data) {


    //0=文本，1=图片

    //一个随机不重复的id，用于当前判断
    data.id = getShapeId();
    if (!data.active) {
        data.active = false;
    }
    if (!data.type) {
        data.type = 0;
    }
    data.selectArea = false;

    var defaultData = {
        borderWidth: 0,
        borderColor: '#000',
        borderStyle: 'solid',

        fontColor: '#000',
        fontSize: 12,
        fontStyle: '',
        value: '文本标签',
    }
    for (var key in defaultData) {
        if (!data[key]) {
            data[key] = defaultData[key];
        }
    }
    app.shapes.push(data);
    data.index = app.shapes.length;
}

/**
 * 获取一个随机数id，18位
 * @returns {string}
 */
function getShapeId() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 89999 + 10000);
}

function initSelectArea() {
    Vue.directive('selectarea', {
        inserted(el, binding) {
            new SelectArea({
                onBegin: function () {

                },
                onHandler: function (data) {

                    var count = 0;
                    var tempShape = null;
                    app.shapes.forEach(item => {
                        //计算出每个item的x1 x2 y1 y2
                        var ix1 = item.left, ix2 = item.left + item.width;
                        var iy1 = item.top, iy2 = item.top + item.height;

                        //碰撞检测
                        var crash = (data.y2 >= iy1 && data.y1 <= iy2) && (data.x2 >= ix1 && data.x1 <= ix2);
                        item.active = crash;
                        item.selectArea = crash;
                        if (crash) {
                            tempShape = item;
                            count++;
                        }
                    });

                    //如果只有一个，显示置顶和底菜单，并显示属性
                    var single = count == 1;
                    for (var i = 1; i < app.popup.menus.length; i++) {
                        app.popup.menus[i].show = single;
                    }

                    if (single) {
                        app.selectShape(null, tempShape);
                    } else {
                        app.selected = {}
                    }
                },
                onEnd: function () {

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

                    var id = parseInt(dv.getAttribute('data-id'));


                    var self = {}
                    for (var i = 0; i < app.shapes.length; i++) {
                        var item = app.shapes[i];
                        if (item.id == id) {
                            self = item;
                            break;
                        }
                    }
                    self.active = true;

                    if (!self.selectArea) {
                        app.shapes.forEach(item => {
                            if (item != self) {
                                item.selectArea = false;
                                item.active = false;
                            }
                        })
                    } else {
                        //所有选中的 记录下旧的坐标
                        app.shapes.forEach(item => {
                            if (item.active) {
                                item.oldLeft = item.left;
                                item.oldTop = item.top;
                            }
                        });
                    }

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
        if (item.active) {
            item.left += val;
        }
    });
}

function moveTop(val) {
    app.shapes.forEach(item => {
        if (item.active) {
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
                height: 700,
                name: ''
            },
            selected: {},
            isSelected: false,
            shapes: [],
            cardPopup: {
                show: false,
                left: 0,
                top: 0,
                menus: [{
                    text: '插入文本',
                    icon: 'fas fa-font',
                    handler: function () {
                        app.addShape(0, app.mousePos.x, app.mousePos.y);
                    }
                }, {
                    text: '插入图片',
                    icon: 'far fa-image',
                    handler: function () {
                        app.addShape(1, app.mousePos.x, app.mousePos.y);
                    }
                }, {
                    split: true
                }, {
                    text: '全选',
                    icon: 'fa-check',
                    handler: function () {
                        app.selectAll();
                    }
                }, {
                    text: '取消全选',
                    icon: 'fa-times',
                    handler: function () {
                        app.unselectAll();
                    }
                }]
            },
            popup: {
                show: false,
                left: 0,
                top: 0,
                menus: [{
                    text: '删除',
                    icon: 'fa-unlink',
                    show: true,
                    handler: function () {
                        if (confirm('您确定要删除选中的元素吗？')) {

                            for (var i = 0; i < app.shapes.length; i++) {
                                if (app.shapes[i].active) {
                                    app.shapes.splice(i--, 1);
                                }
                            }

                            app.selected = {};
                        }

                    }
                }, {
                    split: true,
                    show: true
                }]
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
                if (e.button != 0) {
                    return;
                }
                app.shapes.forEach(item => {
                    item.active = false;
                    item.selectArea = false;
                });
                app.popup.show = false;
                app.selected = {}

            },
            selectShape: function (e, shape) {
                this.shapes.forEach(item => {
                    if (!item.selectArea) {
                        item.active = false
                    }
                });
                shape.active = true;
                if (e) {
                    e.preventDefault();
                }
                this.selected = shape;
                this.isSelected = true;
            },
            showContextmenu: function (e, data) {
                app.popup.left = e.clientX;
                app.popup.top = e.clientY;
                app.popup.show = true;
                app.popup.data = data;

                app.cardPopup.show = false;
            },
            showCardMenu: function (e) {
                var cardMenu = app.cardPopup;
                cardMenu.left = e.clientX;
                cardMenu.top = e.clientY;
                cardMenu.show = true;
                app.popup.show = false;

                //记录鼠标指针临时位置
                app.mousePos = {
                    x: e.clientX - e.target.offsetLeft,
                    y: e.clientY - e.target.offsetTop
                }
            },
            cardKeyup: function (e) {
                if (e.keyCode == 9) {
                    app.isShiftDown = false;
                }
            },
            selectAll: function () {
                app.shapes.forEach(item => {
                    item.active = true;
                    item.selectArea = true;
                });
            },
            unselectAll: function () {
                app.shapes.forEach(item => {
                    item.active = false;
                    item.selectArea = false;
                });
            },
            shapeMove: function (e, data, index) {
                var code = e.keyCode;
                if (e.ctrlKey && code == 65) {
                    this.selectAll();
                    return;
                }

                if (e.ctrlKey && code == 68) {
                    this.unselectAll();
                    return;
                }
                var keymaps = {
                    37: () => moveLeft(-1),
                    38: () => moveTop(-1),
                    39: () => moveLeft(1),
                    40: () => moveTop(1),
                    9: () => app.isShiftDown = true,
                    8: function () {

                        app.popup.del();
                    },

                };
                var fun = keymaps[code];
                if (fun) {
                    fun.call(data, index);
                }
            },
            addShape: function (type, x, y) {
                x = x || 10;
                y = y || 10;
                var value = '文本';
                var width = 60, height = 20;

                //默认图片
                if (type == 1) {
                    value = './design/images/image.jpg';
                    width = 120;
                    height = 120;
                }

                var data = {
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    value: value,
                    type: type,
                    active: true
                };
                app.selectShape(null, data);
                pushShape(data)
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