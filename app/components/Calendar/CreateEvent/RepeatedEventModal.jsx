var React        = require("react"),
    mui          = require('material-ui'),
    Dialog       = mui.Dialog;

require("./style.less");

module.exports = React.createClass({
    show() {
        this.refs.dialog.show();
    },

    render() {
        return (
            <Dialog {...this.props} ref="dialog" title="Repeated Information">
                <div>
                    <label>Repeats:</label>
                </div>
                <div>
                    <label>Repeated Every:</label>
                </div>
                <div>
                    <label>Ends Way:</label>
                </div>
                <div>
                    <label>Repeated Summary:</label>
                </div>
            </Dialog>
        );
    }
});