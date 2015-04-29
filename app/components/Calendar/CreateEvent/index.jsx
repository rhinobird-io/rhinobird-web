const React        = require("react"),
      MUI          = require('material-ui'),
      Layout       = require("../../Flex").Layout,
      RepeatedEventModal = require("./RepeatedEventModal.jsx");

require("./style.less");

export default React.createClass({
    _handleTouchTap() {
    },

    componentDidMount() {
    },

    render() {
        return (
            <div>
                <RepeatedEventModal ref="repeatedEventModal" />

                <div className="cal-create-event">
                    <div className="cal-create-event-title">
                        <h3>Create Event</h3>
                    </div>

                    <MUI.TextField
                        ref="eventTitle"
                        className="cal-create-event-textfield"
                        hintText="Event Title"
                        floatingLabelText="Event Title"/>

                    <MUI.TextField
                        multiLine={true}
                        ref="eventDescription"
                        hintText="Description"
                        className="cal-create-event-textfield"
                        floatingLabelText="Description" />

                    <MUI.Toggle
                        label="Full Day" />

                    <Layout horizontal justified>
                        <MUI.DatePicker hintText="Portrait Dialog" />
                        <MUI.DatePicker hintText="Portrait Dialog" />
                    </Layout>

                    <MUI.Toggle
                        onToggle={this._onRepeatToggled}
                        label="Repeated" />
                </div>
            </div>
        );
    },

    _onRepeatToggled(e, isInputChecked) {
        if (isInputChecked) {
            this.refs.repeatedEventModal.show();
        } else {

        }
    }
});
