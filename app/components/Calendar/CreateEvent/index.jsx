var React        = require("react"),
    mui          = require('material-ui'),
    Dialog       = mui.Dialog,
    RaisedButton = mui.RaisedButton,
    TextField    = mui.TextField;

var RepeatedEventModal = React.createClass({
    render() {
        return (
            <Dialog {...this.props} title="Repeated Information">

            </Dialog>
        );
    }
});

module.exports = React.createClass({
    _handleTouchTap() {
        this.refs.repeatedEventModal.show();
    },
    render: function() {
        return (
            <div>
                <Dialog ref="repeatedEventModal" title="Repeated">

                </Dialog>
                <RaisedButton label="Open" primary={true} onTouchTap={this._handleTouchTap} />

                <TextField
                    hintText="Hint Text"
                    floatingLabelText="Floating Label Text" />
            </div>
        );
    }
});
