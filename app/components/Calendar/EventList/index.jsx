var React                = require("react"),
    mui                  = require('material-ui'),
    Link                 = require("react-router").Link,
    FloatingActionButton = mui.FloatingActionButton;

require("./style.less");

module.exports = React.createClass({
    _gotoCreateEventPage() {

    },

    render() {
        return (
            <div>
                <Link to="create-event">
                    <FloatingActionButton
                        className="add-event"
                        iconClassName="muidocs-icon-action-grade"
                        onTouchTap={this._gotoCreateEventPage}>
                    </FloatingActionButton>
                </Link>
            </div>
        );
    }
});
