var React        = require("react"),
    mui          = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField    = mui.TextField,
    RepeatedEventModal = require("./RepeatedEventModal.jsx");

export default React.createClass({
    _handleTouchTap() {
        this.refs.repeatedEventModal.show();
    },

    render() {
        return (
            <div>
                <RepeatedEventModal ref="repeatedEventModal" />

                <TextField
                    hintText="Title"
                    floatingLabelText="Title" />

                <TextField
                    hintText="Title"
                    floatingLabelText="Title" />

                <RaisedButton label="Open" primary={true} onTouchTap={this._handleTouchTap} />
            </div>
        );
    }
});
