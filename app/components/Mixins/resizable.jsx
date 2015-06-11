const React = require('react');

const STATE_NORMAL = 0;
const STATE_MOUSE_OVER_TOP = 1;
const STATE_MOUSE_OVER_BOTTOM = 2;

module.exports = {
    propTypes: {
    },

    _isMouseDown: false,
    _oldMouseX: 0,
    _oldMouseY: 0,

    getDefaultProps() {
        return {
        };
    },

    componentDidMount() {
        this.getDOMNode().addEventListener("mousemove", this._mouseMoveListener);
        this.getDOMNode().addEventListener("mousedown", this._mouseDownListener);
        this.getDOMNode().addEventListener("mouseout", this._mouseOutListener);
        this.getDOMNode().addEventListener("mouseup", this._mouseUpListener);
    },

    componentWillUnmount() {
        this.getDOMNode().removeEventListener("mousemove", this._mouseMoveListener);
        this.getDOMNode().removeEventListener("mousedown", this._mouseDownListener);
        this.getDOMNode().removeEventListener("mouseup", this._mouseUpListener);
        this.getDOMNode().removeEventListener("mouseout", this._mouseOutListener);
    },

    _mouseMoveListener(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        console.log(rect.bottom);
        console.log(e.y);
        console.log(e);
        if (rect.bottom - e.y <= 60) {
            node.style.cursor = "ns-resize";
            if (this._isMouseDown) {
                node.style.height = (rect.height + (e.y - this._oldMouseY)) + "px";
            }
        } else {
            node.style.cursor = "default";
        }
        this._oldMouseY = e.y;
    },

    _mouseDownListener(e) {
        this._isMouseDown = true;
    },

    _mouseUpListener(e) {
        this._isMouseDown = false;
    },

    _mouseOutListener(e) {
        this._isMouseDown = false;
    }
};
