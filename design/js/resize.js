function Resize(options) {

    this.register = function (el) {

        var directions = ['nw', 'w', 'ws', 's', 'se', 'e', 'ne', 'n']
        //增加元素
        directions.forEach(str => {


            //direction ws

            var div = document.createElement('div');
            div.className = 'direction ' + str;
            //注册事件

            el.appendChild(div);

        });

        var border = document.createElement('div');
        border.className = 'border';
        el.appendChild(border);


        //注册事件

        directions.forEach(str => {
            var isDown = false;
            var obj = el.querySelector("." + str);
            obj.onmousedown = function (e) {

                if (e.button != 0) {
                    return;
                }

                var ox = e.clientX;
                var oy = e.clientY;

                var data = {
                    ox: ox,
                    oy: oy,
                    ow: el.offsetWidth,
                    oh: el.offsetHeight,
                    ol: el.offsetLeft,
                    ot: el.offsetTop

                };

                if (options && options.onBegin) {
                    options.onBegin.call(el,data)
                }

                var isResize = true;
                window.onmousemove = function (event) {
                    if (!isResize) {
                        return;
                    }
                    var x = event.clientX;
                    var y = event.clientY;

                    //计算 width和height 差值

                    var width = x - data.ox;
                    var height = y - data.oy;


                    data.width = width;
                    data.height = height;

                    var fun = mappers[str];
                    if (fun) {
                        fun.call(obj, data, event);
                    }


                }
                window.onmouseup = function (ee) {
                    isResize = false;
                    ee.stopPropagation()

                    if (options && options.onEnd) {
                        options.onEnd.call(el)
                    }
                }

                //阻止事件冒泡
                e.stopPropagation()
            }

        });


        if (!options) {
            options = {
                onResize: function () {

                }
            }
        } else if (!options.onResize) {
            options.onResize = function () {

            }
        }

        function setLeft(l) {

            options.onResize({left: l});
            el.style.left = l + 'px';
        }

        function setTop(t) {
            options.onResize({top: t});
            el.style.top = t + 'px';
        }

        function setWidth(w) {
            if (w < 20) {
                w = 20;
            }
            options.onResize({width: w});
            el.style.width = w + 'px';
        }

        function setHeight(h) {

            if (h < 20) {
                h = 20;
            }
            options.onResize({height: h});
            el.style.height = h + 'px';
        }

        var mappers = {
            s: function (data) {
                setHeight(data.oh + data.height);
            },
            e: function (data) {
                setWidth(data.ow + data.width)
            },
            w: function (data) {
                var value = data.width;


                var l = data.ol + value;
                var w = data.ow + Math.abs(value);

                if (value > 0) {
                    w = data.ow - value;
                }

                if (w > 20) {
                    setLeft(l);
                    setWidth(w);
                }
            },
            n: function (data) {
                var value = data.height;

                var t = data.ot + value;
                var h = data.oh + Math.abs(value);

                if (value > 0) {
                    h = data.oh - value;
                }
                if (h > 20) {
                    setHeight(h);
                    setTop(t);
                }
            },
            se: function (data) {
                mappers.s(data);
                mappers.e(data);
            },
            nw: function (data) {
                mappers.n(data);
                mappers.w(data);
            },
            ws: function (data) {
                mappers.w(data);
                mappers.s(data);
            },
            ne: function (data) {
                mappers.n(data);
                mappers.e(data);
            }
        }

        // el.querySelector()
    }
}