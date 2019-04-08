/*
使用
    DJ.toucher('#div')
    .on('touchStart', function(e) {
        console.log('touchStart');
    })
    .on('swipeLeft swipeRight swipeUp swipeDown', function(e) {
        console.log('...')
    })
    ...
*/
;(function(w, d, factory) {
    var fn = factory(w, d);

    w.DJ = w.DJ || {};

    w.DJ.toucher = w.DJ.toucher || fn;
})(this, document, function(w, d) {
    "use strict";
    function Djswipe(el) {
        this.elem = d.querySelector(el) || {};
        // 自定义事件库
        this._events = this._events || {};
        // 记录垂直或水平方向
        this.dir = false;
        // 处理长按的定时器
        this.ltimer = null;
        this.istouched = false;
    }

    Djswipe.prototype = {
        events: ['touchStart', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'dragVertical', 'dragHorizontal', 'touchEnd', 'drag', 'tag', 'longTag'],
        init: function() {
            this.touch();
            return this;
        },
        //模拟on自定义事件绑定，多事件空格隔开
        on: function(evt, handler) {
            var arrevts = evt.split(' '),
                len = arrevts.length,
                isFunction = typeof(handler) === 'function';
            for(var i=0;i<len;i++) {
                this._events[arrevts[i]] = this._events[arrevts[i]] || [];
                isFunction && this._events[arrevts[i]].push(handler);
            }
            return this;
        },
        //自定义事件触发器
        trigger: function(evt, e, s) {
            if (!!evt)
                for (var i = 0; evt[i]; evt[i++].call(this.elem, e, s));
        },
        touch: function() {
            var _t = this,
                sx, sy,
                disX, disY;
            this.elem.addEventListener('touchstart', function(e) {
                _t.dir = false;
                _t.istouched = true;
                _t.islongtag = false;
                _t.startTime = new Date();
                sx = e.targetTouches[0].pageX, sy = e.targetTouches[0].pageY;
                // 开始触摸
                _t.trigger(_t._events.touchStart, e);

                _t.ltimer = setTimeout(function() {
                    // 长按
                    _t.istouched && _t.dir === false && (_t.trigger(_t._events.longTag, e),_t.islongtag = true);
                }, 500);
            }, false);
            this.elem.addEventListener('touchmove', function(e) {
                var mx = e.targetTouches[0].pageX,
                    my = e.targetTouches[0].pageY,
                    x, y;
                disX = mx - sx, disY = my - sy;

                x = Math.abs(disX), y = Math.abs(disY);
                //坐标和位移值等，方便外部直接拿到，做其他操作
                var status = {
                    startx: sx,
                    starty: sy,
                    movex: mx,
                    movey: my,
                    disx: disX,
                    disy: disY
                }

                // 水平
                if (x !== 0 && x >= 4 && x > y && _t.dir === false)
                    _t.dir = 0;
                // 垂直
                if (y !== 0 && y >= 4 && x < y && _t.dir === false)
                    _t.dir = 1;
                // 拖拽
                _t.dir !== false && _t.trigger(_t._events.drag, e, status);
                // 水平和垂直滑动
                _t.trigger(_t._events[['dragHorizontal', 'dragVertical'][_t.dir]], e, status);
            }, false);
            this.elem.addEventListener('touchend', function(e) {
                _t.istouched = false;
                _t.disTime = new Date() - _t.startTime;
                clearInterval(_t.ltimer);
                if (_t.disTime < 150) {
                    if (_t.dir === 0) {
                        // 左右
                        disX < 0 && _t.trigger(_t._events.swipeLeft, e);
                        disX > 0 && _t.trigger(_t._events.swipeRight, e);
                    }
                    if (_t.dir === 1) {
                        // 上下
                        disY < 0 && _t.trigger(_t._events.swipeUp, e);
                        disY > 0 && _t.trigger(_t._events.swipeDown, e);
                    }
                    // 轻击
                    _t.dir === false && _t.trigger(_t._events.tag, e);
                } else {
                    // 处理tag、longtag多余的间隙
                    (_t.dir !== false || _t.dir === false && _t.islongtag === false) && _t.trigger(_t._events.touchEnd, e);
                }
            }, false);
        }
    };

    return function(el) {
        return new Djswipe(el).init();
    }
});