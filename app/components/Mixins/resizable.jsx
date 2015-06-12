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
        this.getDOMNode().addEventListener("mouseup", this._handleMouseUp);
    },

    componentWillUnmount() {
        this.getDOMNode().removeEventListener("mousemove", this._mouseMoveListener);
        this.getDOMNode().removeEventListener("mousedown", this._mouseDownListener);
        this.getDOMNode().removeEventListener("mouseout", this._handleMouseUp);
    },

    _mouseMoveListener(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();

    },

    _mouseDownListener(e) {
        this._isMouseDown = true;
        this._oldMouseY = e.y;
        document.addEventListener("mousemove", this._handleDocumentMouseMove);
    },

    _handleMouseUp(e) {
        this._isMouseDown = false;
        document.removeEventListener("mousemove", this._handleDocumentMouseMove);
    },

    _handleDocumentMouseMove(e) {
        console.log("move");
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        if (rect.bottom - e.y <= 20) {
            node.style.height = (rect.height + (e.y - this._oldMouseY)) + "px";
        }
        this._oldMouseY = e.y;
    }
};
