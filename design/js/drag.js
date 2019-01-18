/**
 * 拖拽
 * @constructor
 */
function Drag(options) {

    /**
     *
     * @param el 节点
     */
    this.register = function (el) {

        el.addEventListener('mousedown', function (e) {

            if (e.button != 0) {
                //屏蔽左键以外的按键
                return;
            }


            //获取x坐标和y坐标
            var x = e.clientX;
            var y = e.clientY;

            //获取左部和顶部的偏移量
            var l = el.offsetLeft;
            var t = el.offsetTop;

            if (options && options.onBegin) {
                options.onBegin.call(el, {
                    left: x - l,
                    top: y - t
                });
            }


            //开关打开
            var isDown = true;
            //设置样式
            el.style.cursor = 'move';

            var nl = x, nt = y;


            window.onmousemove = function (e) {
                if (!isDown) {
                    return;
                }
                //获取x和y
                var nx = e.clientX;
                var ny = e.clientY;


                //计算移动后的左偏移量和顶部的偏移量
                nl = nx - (x - l);
                nt = ny - (y - t);


                el.style.left = nl + 'px';
                el.style.top = nt + 'px';

                if (options && options.onDrag) {
                    options.onDrag.call(el, {
                        left: nl,
                        top: nt,
                        x: nx - x,
                        y: ny - y
                    });
                }

                return false;
            }

            window.onmouseup = function (e) {
                //开关关闭
                isDown = false;
                el.style.cursor = 'default';

                if (options && options.onEnd) {
                    options.onEnd.call(el, {left: nl, top: nt});
                }

                return false;
            }
            // e.stopPropagation();
            if (e.stopPropagation) {
                e.stopPropagation();
            } else if (e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue == false;
            }
        });

    }
}