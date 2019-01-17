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
            width: 60,
            height: 60,
            value: i,
        })
    }
}

function pushShape(data) {
    //一个随机不重复的id，用于当前判断
    data.id = getShapeId();
    data.active = false;
    data.selectArea = false;

    var defaultData = {
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid',

        fontColor: '#000',
        fontSize: 12,
        fontStyle: '',
        value: '文本标签',
    }
    for(var key in defaultData){
        if(!data[key]){
            data[key] = defaultData[key];
        }
    }
    app.shapes.push(data);
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
                    app.shapes.forEach(item => {
                        //计算出每个item的x1 x2 y1 y2
                        var ix1 = item.left, ix2 = item.left + item.width;
                        var iy1 = item.top, iy2 = item.top + item.height;

                        //碰撞检测
                        var crash = (data.y2 >= iy1 && data.y1 <= iy2) && (data.x2 >= ix1 && data.x1 <= ix2);
                        item.active = crash;
                        item.selectArea = crash;
                    });

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
                    split: true
                }, {
                    text: '置于顶层',
                    icon: 'fa-angle-up',
                    handler: function () {

                    }
                }, {
                    text: '置于底层',
                    icon: 'fa-angle-down',
                    handler: function () {

                    }
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
                e.preventDefault();
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