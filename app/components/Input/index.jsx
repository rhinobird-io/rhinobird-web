const React = require('react');
const MUI = require('material-ui');

function Input() {

}

Input.RegexInput = React.createClass({
    render() {
        let {
            ref,
            pattern,
            onKeyDown,
            ...other
        } = this.props;

        return <MUI.TextField ref={ref}  onKeyDown={(e) => this._onKeyDownListener(e, pattern)} {...other} />;
    },

    _onKeyDownListener(e, pattern) {
        let keyCode = e.which || e.keyCode;

        let char = String.fromCharCode(keyCode);

        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;

        let valid =
            (keyCode > 47 && keyCode < 58)   || // number keys
            keyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
            (keyCode > 64 && keyCode < 91)   || // letter keys
            (keyCode > 95 && keyCode < 112)  || // numpad keys
            (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
            (keyCode > 218 && keyCode < 223);   // [\]' (in order)

        let value = e.target.value.substring(0, start) + char + e.target.value.substring(end);
        if (valid && pattern && pattern.test && !pattern.test(value)) {
            e.preventDefault();
        }
    }
});

module.exports = Input;

