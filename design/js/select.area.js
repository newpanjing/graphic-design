function SelectArea(options) {

    this.register = function (el) {

        el.addEventListener('mousedown', function (e) {


            if (e.button != 0) {
                return;
            }

            var x = e.clientX;
            var y = e.clientY;

            var ox = x;
            var oy = y;

            var tempX = x - e.target.offsetLeft;
            var tempY = y - e.target.offsetTop;
            console.log(tempX)
            var isDown = true;

            x = tempX;
            y = tempY;

            var select = document.createElement('div');

            select.style.position = 'absolute';
            select.style.border = '1px #4a98be solid';
            select.style.backgroundColor = 'rgba(127,214,255,0.3)';

            el.appendChild(select);

            window.onmousemove = function (ev) {
                if (!isDown) {
                    return;
                }
                //计算差值
                var w = ev.clientX - ox;
                var h = ev.clientY - oy;


                if (w < 0) {
                    x = tempX + w;

                }

                if (h < 0) {
                    y = tempY + h;
                }

                var width = Math.abs(w);
                var height = Math.abs(h);


                //计算 选区覆盖的元素，并进行选中
                var x1 = x, y1 = y;
                var x2 = x + width, y2 = y + height;

                select.style.left = x + 'px';
                select.style.top = y + 'px';
                select.style.width = width + 'px';
                select.style.height = height + 'px';

                if (options && options.onHandler) {
                    options.onHandler.call(el, {
                        x1: x1,
                        x2: x2,
                        y1: y1,
                        y2: y2,
                        width: width,
                        height: height
                    })
                }
            }
            window.onmouseup = function () {
                isDown = false;
                select.remove();
            }
        });
    }
}