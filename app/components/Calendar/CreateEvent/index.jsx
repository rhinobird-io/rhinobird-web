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

    getInitialState() {
        return {
            fromTime: new Date()
        };
    },

    render() {
        return (
            <div>
                <RepeatedEventModal ref="repeatedEventModal" event={this.state} />
                <MUI.Paper zDepth={2} className="cal-create-event">
                    <div style={{padding: 20}}>
                        <h3><span style={{textDecoration: "underline"}}>C</span>reate Event</h3>

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

                        <MUI.Tabs className="cal-create-event-tab">
                            <MUI.Tab label="Period" >
                                <div className="tab-template-container">
                                    <Layout horizontal justified>
                                        <MUI.DatePicker hintText="From Date" />
                                        <MUI.DatePicker hintText="To Date" />
                                    </Layout>
                                </div>
                            </MUI.Tab>
                            <MUI.Tab label="Content" >
                                <div className="tab-template-container">
                                    <Layout horizontal justified>
                                        <MUI.DatePicker hintText="From Date" />
                                        <MUI.DatePicker hintText="To Date" />
                                    </Layout>
                                </div>
                            </MUI.Tab>
                        </MUI.Tabs>


                        <MUI.Toggle
                            onToggle={this._onRepeatToggled}
                            label="Repeated" />
                    </div>
                </MUI.Paper>
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
