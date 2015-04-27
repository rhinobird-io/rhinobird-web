var React                = require("react"),
    MUI                  = require("material-ui"),
    Link                 = require("react-router").Link,
    FloatingActionButton = MUI.FloatingActionButton,
    SmartTimeDisplay     = require("../../SmartTimeDisplay"),
    Select = require("../../Select").Select;

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {}
    },

    render: function() {
        return (
            <div>

                <Link to="create-event">
                    <FloatingActionButton
                        className="add-event"
                        iconClassName="icon-add"/>
                </Link>
            </div>
        );
    }
});
