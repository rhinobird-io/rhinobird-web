const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      Selector        = require("../../Select").Selector,
      PerfectScroll   = require('../../PerfectScroll'),
      CalendarActions = require("../../../actions/CalendarActions");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
    },

    getInitialState() {
        return {

        };
    },

    render() {
        return <PerfectScroll style={{height: "100%", position: "relative"}}>
            <Flex.Layout horizontal centerJustified wrap>
                <MUI.Paper zDepth={3} className="cal-create-event">
                    <div style={{padding: 20}}>
                        <h3>Create Event</h3>

                        <MUI.TextField
                            ref="eventTitle"
                            hintText="Event Title"
                            errorText={this.state.titleError}
                            floatingLabelText="Event Title"
                            valueLink={this.linkState("title")}
                            className="cal-create-event-textfield" />

                        <MUI.TextField
                            multiLine={true}
                            ref="eventDescription"
                            hintText="Description"
                            errorText={this.state.descriptionError}
                            floatingLabelText="Description"
                            className="cal-create-event-textfield"
                            valueLink={this.linkState("description")} />

                        <Flex.Layout horizontal justified style={{marginTop: 24, marginBottom: 24}}>
                            <label>Full Day</label>
                            <MUI.Toggle />
                        </Flex.Layout>

                        <MUI.Tabs className="cal-create-event-tab">
                            <MUI.Tab label="Period" >
                                <div className="tab-template-container">
                                    <Flex.Layout horizontal justified>
                                        <MUI.DatePicker
                                            ref="fromDate"
                                            hintText="From Date"
                                            onChange={this._onFromDateChange}
                                            defaultDate={this.state.fromTime} />
                                        <MUI.DatePicker
                                            ref="toDate"
                                            hintText="To Date"
                                            onChange={this._onToDateChange}
                                            defaultDate={this.state.fromTime} />
                                    </Flex.Layout>
                                </div>
                            </MUI.Tab>
                            <MUI.Tab label="Point" >
                                <div className="tab-template-container">
                                    <Flex.Layout horizontal justified>
                                    </Flex.Layout>
                                </div>
                            </MUI.Tab>
                        </MUI.Tabs>

                        <Flex.Layout horizontal justified style={{marginTop: 24}}>
                            <Flex.Layout vertical selfCenter>
                                <label>Repeated</label>
                            </Flex.Layout>
                            <Flex.Layout horizontal centerJustified>
                                <Flex.Layout vertical selfCenter>
                                    <label style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{this._getSummary()}</label>
                                </Flex.Layout>
                                <MUI.FlatButton
                                    label="Edit"
                                    type="button"
                                    primary={true}
                                    onClick={() => this.setState({editRepeated: true})}
                                    style={{display: this.state.repeated ? "inline-block" : "none"}} />
                            </Flex.Layout>
                            <Flex.Layout vertical selfCenter>
                                <MUI.Toggle
                                    ref="repeated"
                                    onToggle={this._onRepeatToggled} />
                            </Flex.Layout>
                        </Flex.Layout>

                        <MemberSelect
                            hintText="Participants"
                            floatingLabelText="Participants"
                            className="cal-create-event-textfield"
                            valueLink={this.linkState("participants")} />

                        <br/>

                        <Flex.Layout horizontal justified>
                            <Link to="event-list">
                                <MUI.RaisedButton label="Cancel" />
                            </Link>
                            <MUI.RaisedButton type="submit" label="Create Event" primary={true} />
                        </Flex.Layout>

                    </div>
                </MUI.Paper>
            </Flex.Layout>
        </PerfectScroll>;
    }
});
