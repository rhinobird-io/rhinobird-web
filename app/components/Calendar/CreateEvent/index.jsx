const React           = require("react"),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      Input           = require('../../Input'),
      Selector        = require('../../Select').Selector,
      MemberSelect    = require('../../Member').MemberSelect,
      PerfectScroll   = require('../../PerfectScroll'),
      SmartEditor     = require('../../SmartEditor').SmartEditor,
      CalendarActions = require("../../../actions/CalendarActions");

require("./style.less");

// Return the number of week days of a month
// Eg: 2015/2/1 is the first sunday of February, it will return 1.
Date.prototype.weekOfMonth = function() {
    var date = this.getDate();
    var result = 1;
    while (date - 7 >= 0) {
        result++;
        date -= 7;
    }
    return result;
};

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    repeatedEvery: {
        "Daily": "days",
        "Weekly": "weeks",
        "Monthly": "months",
        "Yearly": "years"
    },

    months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],

    daysInWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    daysInWeekMap: {
        'Sun': 'Sunday',
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday'
    },

    errorMsg: {
        titleRequired: "Event title is required.",
        descriptionRequired: "Event description is required."
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.participants == nextState.participants;
    },

    componentWillMount() {
        this.seconds = new Date().getTime();
    },

    componentDidMount() {
        console.log(new Date().getTime() - this.seconds);
        this.refs.eventTitle.focus();
    },

    getInitialState() {
        let now = new Date();
        console.log(now.getMinutes());
        return {
            titleError: "",
            fullDay: false,
            participants: {
                teams: [],
                users: []
            },
            fromTime: now,
            fromHour: now.getHours(),
            fromMinute: now.getMinutes(),
            toTime: now,
            toHour: now.getHours(),
            toMinute: now.getMinutes(),
            editRepeated: false,
            repeated: false,
            repeatedType: "Daily",
            repeatedFrequency: 1,
            repeatedOn: this._getInitialRepeatedOn(new Date()),
            repeatedBy: "Month",
            repeatedEndType: "Never",
            repeatedEndDate: "",
            repeatedTimes: 2,
            isPeriod: true
        };
    },

    render() {
        let styles = {
            repeated: {
                overflow: "hidden",
                transition: "all 500ms",
                opacity: this.state.editRepeated ? 1 : 0,
                width: this.state.editRepeated ? "552px" : "0",
                height: "100%"
            }
        };

        let fromHM = [];
        fromHM.push(
            <Input.RegexInput
                key="fromHour"
                pattern={/^([01]?\d|2[0-3])$/}
                floatingLabelText="Hour"
                valueLink={this.linkState("fromHour")}/>);
        fromHM.push(
            <Input.RegexInput
                key="fromMinute"
                pattern={/^([0-5]?\d)$/}
                floatingLabelText="Minute"
                valueLink={this.linkState("fromMinute")}/>);

        let toHM = [];
        toHM.push(
            <Input.RegexInput
                key="toHour"
                pattern={/^([01]?\d|2[0-3])$/}
                floatingLabelText="Hour"
                valueLink={this.linkState("toHour")}/>);
        toHM.push(
            <Input.RegexInput
                key="toMinute"
                pattern={/^([0-5]?\d)$/}
                floatingLabelText="Minute"
                valueLink={this.linkState("toMinute")}/>);

        return (
            <PerfectScroll style={{height: "100%", position: "relative"}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                    <MUI.Paper zDepth={3} className="cal-create-event">
                        <div style={{padding: 20}}>
                            <h3>Create Event</h3>

                            <MUI.TextField
                                ref="eventTitle"
                                hintText="Event Title"
                                errorText={this.state.titleError}
                                floatingLabelText="Event Title"
                                className="cal-create-event-textfield" />

                            <SmartEditor
                                multiLine={true}
                                ref="eventDescription"
                                hintText="Description"
                                errorText={this.state.descriptionError}
                                floatingLabelText="Description"
                                className="cal-create-event-textfield" />

                            <Flex.Layout horizontal justified style={{marginTop: 24, marginBottom: 24}}>
                                <label>Full Day</label>
                                <MUI.Toggle
                                    onToggle={this._onFullDayToggled}/>
                            </Flex.Layout>

                            <MUI.Tabs className="cal-create-event-tab">
                                <MUI.Tab label="Period" onActive={() => this.setState({isPeriod: true})}>
                                    <div className="tab-template-container">
                                        <Flex.Layout horizontal justified style={{marginTop: -10}}>
                                            <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                                <MUI.DatePicker
                                                    ref="fromDate"
                                                    hintText="From Date"
                                                    floatingLabelText="From"
                                                    onChange={this._onFromDateChange}
                                                    defaultDate={this.state.fromTime} />
                                                {!this.state.fullDay ? fromHM : null}
                                            </Flex.Layout>
                                            <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                                <MUI.DatePicker
                                                    ref="toDate"
                                                    hintText="To Date"
                                                    floatingLabelText="To"
                                                    onChange={this._onToDateChange}
                                                    defaultDate={this.state.fromTime} />
                                                {!this.state.fullDay ? toHM : null}
                                            </Flex.Layout>
                                        </Flex.Layout>
                                    </div>
                                </MUI.Tab>
                                <MUI.Tab label="Point" onActive={() => this.setState({isPeriod: false})}>
                                    <div className="tab-template-container">
                                        <Flex.Layout horizontal justified>
                                            <MUI.DatePicker
                                                ref="fromDate"
                                                hintText="From Date"
                                                floatingLabelText="From"
                                                defaultDate={this.state.fromTime} />
                                                {!this.state.fullDay ? fromHM : null}
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
                                <MUI.RaisedButton type="submit" label="Create Event" primary={true} onClick={this._handleSubmit} />
                            </Flex.Layout>

                        </div>
                    </MUI.Paper>
                    </form>

                    <MUI.Paper zDepth={2} style={styles.repeated} className="cal-create-event">
                        <div style={{padding: 20}}>
                            <Flex.Layout horizontal>
                                <h3>Repeat Infomation</h3>
                            </Flex.Layout>
                            {this._getRepeatedInfoContent()}
                        </div>
                    </MUI.Paper>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _onFromDateChange(e, newDate) {
        let state = {};
        state.fromTime = newDate;
        if (newDate > this.state.toTime) {
            state.toTime = newDate;
            this.refs.toDate.setDate(newDate);
        }
        this.setState(state);
    },

    _onToDateChange(e, newDate) {
        let state = {};
        state.toTime = newDate;
        if (newDate < this.state.fromTime) {
            state.fromTime = newDate;
            this.refs.fromDate.setDate(newDate);
        }
        this.setState(state);

    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;

        let refs = this.refs;

        let title = refs.eventTitle.getValue();
        let description = refs.eventDescription.getValue();

        if (title.length === 0) {
            this.setState({titleError: errorMsg.titleRequired});
            return;
        } else {
            this.setState({titleError: ""});
        }

        if (description.length === 0) {
            this.setState({descriptionError: errorMsg.descriptionRequired});
            return;
        } else {
            this.setState({descriptionError: ""});
        }

        let event = this.state;
        event.title = title;
        event.description = description;
        CalendarActions.create(event, () => this.context.router.transitionTo("event-list"));
    },

    _getRepeatedInfoContent() {
        let styles = {
            textfield: {
                textAlign: "center",
                fontSize: "0.9em"
            },
            row: {
                lineHeight: "3em"
            },
            endDate: {
                width: "50px"
            }
        };

        let weeklyRepeatOn =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Weekly"} style={styles.row}>
                <label>Repeated On:</label>
                <Selector
                    multiple
                    valueLink={this.linkState("repeatedOn")}
                    onSelectChange={this._repeatedOnChange}>
                    <span className="cal-event-repeated-item" name="Sun">Sun</span>
                    <span className="cal-event-repeated-item" name="Mon">Mon</span>
                    <span className="cal-event-repeated-item" name="Tue">Tue</span>
                    <span className="cal-event-repeated-item" name="Wed">Wed</span>
                    <span className="cal-event-repeated-item" name="Thu">Thu</span>
                    <span className="cal-event-repeated-item" name="Fri">Fri</span>
                    <span className="cal-event-repeated-item" name="Sat">Sat</span>
                </Selector>
            </Flex.Layout>;

        let monthlyRepeatBy =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Monthly"} style={styles.row}>
                <label>Repeated By:</label>
                <Selector
                    valueLink={this.linkState("repeatedBy")}>
                    <span className="cal-event-repeated-item" name="Month">Month</span>
                    <span className="cal-event-repeated-item" name="Week">Week</span>
                </Selector>
            </Flex.Layout>;

        let occurrence =
            <Flex.Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Occurrence"}>
                <Flex.Layout vertical selfCenter>
                    <label>After</label>
                </Flex.Layout>
                <MUI.TextField
                    type="text"
                    ref="repeatedTimes"
                    style={styles.textfield}
                    className="cal-event-repeated-every"
                    valueLink={this.linkState("repeatedTimes")}/>
                <Flex.Layout vertical selfCenter>
                    <label>times</label>
                </Flex.Layout>
            </Flex.Layout>;

        let endDate =
            <Flex.Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Date"}>
                <Flex.Layout vertical selfCenter>
                    <label>Ends On:</label>
                </Flex.Layout>
                <Flex.Layout vertical selfCenter>
                    <MUI.DatePicker
                        ref="repeatedEndDate"
                        defaultDate={this.state.fromTime}
                        hintText="" mode="landscape"
                        className="cal-event-repeated-end-date" />
                </Flex.Layout>
            </Flex.Layout>;

        return (
            <Flex.Layout vertical>
                <Flex.Layout horizontal justified style={styles.row}>
                    <label>Repeats:</label>
                    <Selector
                        valueLink={this.linkState("repeatedType")}
                        onSelectChange={this._repeatedTypeChange}>
                        <span className="cal-event-repeated-item" name="Daily">Daily</span>
                        <span className="cal-event-repeated-item" name="Weekly">Weekly</span>
                        <span className="cal-event-repeated-item" name="Monthly">Monthly</span>
                        <span className="cal-event-repeated-item" name="Yearly">Yearly</span>
                    </Selector>
                </Flex.Layout>

                <Flex.Layout horizontal justified style={styles.row}>
                    <Flex.Layout vertical selfCenter>
                        <label>Repeated Every:</label>
                    </Flex.Layout>
                    <div>
                        <MUI.TextField
                            type="text"
                            ref="repeatedFrequency"
                            style={styles.textfield}
                            className="cal-event-repeated-every"
                            valueLink={this.linkState("repeatedFrequency")} />
                        {this.repeatedEvery[this.state.repeatedType]}
                    </div>
                </Flex.Layout>

                {weeklyRepeatOn}

                {monthlyRepeatBy}

                <Flex.Layout horizontal justified style={styles.row}>
                    <label>Ends Way:</label>
                    <Selector
                        ref="repeatedEndType"
                        value={this.state.repeatedEndType}
                        onSelectChange={this._repeatedEndTypeChange}>
                        <span className="cal-event-repeated-item" name="Never">Never</span>
                        <span className="cal-event-repeated-item" name="Occurrence">Occurrence</span>
                        <span className="cal-event-repeated-item" name="Date">Date</span>
                    </Selector>
                </Flex.Layout>

                {occurrence}

                {endDate}

                <Flex.Layout horizonal justified style={styles.row}>
                    <label>Repeat Summary:</label>
                    <label>{this._getSummary()}</label>
                </Flex.Layout>

                <Flex.Layout horizontal justified>
                    <MUI.RaisedButton label="Cancel" onClick={this._cancelRepeatedInfo} />
                    <MUI.RaisedButton label="Confirm" secondary={true} onClick={this._confirmRepeatedInfo} />
                </Flex.Layout>
            </Flex.Layout>
        );
    },

    _cancelRepeatedInfo() {
        this.setState({editRepeated: false});
        this.refs.repeated.setToggled(this.state.repeated);
    },

    _confirmRepeatedInfo() {
        this.setState({editRepeated: false, repeated: true});
        this.refs.repeated.setToggled(true);
    },

    _getInitialRepeatedOn(fromTime) {
        let from = new Date(fromTime);
        let repeatedOn = [];
        repeatedOn.push(this.daysInWeek[from.getDay()]);
        return repeatedOn;
    },

    _getInitialRepeatedEndDate(fromTime) {
        let endDate = new Date(new Date(fromTime).getTime() + 2592000000);
        return Moment(endDate).format("MM/DD/YYYY");
    },

    _repeatedTypeChange() {
        this.refs.repeatedFrequency.focus();
    },

    _repeatedOnChange(selectedValue) {
        if (selectedValue === null || (Array.isArray(selectedValue) && selectedValue.length === 0)) {
            this.setState({repeatedOn: this._getInitialRepeatedOn()});
        }
    },

    _repeatedEndTypeChange: function(repeatedEndType) {
        console.log(repeatedEndType);
        this.setState({repeatedEndType: repeatedEndType}, () => {
            if (repeatedEndType === "Occurrence") {
                this.refs.repeatedTimes.focus();
            }
        });
    },

    _getSummary() {
        let repeatedInfo = this.state;

        if (!repeatedInfo.repeated && !repeatedInfo.editRepeated) {
            return "No Repeat";
        }
        var summary = "", frequencyOne, frequencyMultiple;
        frequencyOne = repeatedInfo.repeatedType;

        if (repeatedInfo.repeatedType == 'Daily') {
            frequencyMultiple = 'days';
        } else if (repeatedInfo.repeatedType == 'Weekly') {
            frequencyMultiple = 'weeks';
        } else if (repeatedInfo.repeatedType == 'Monthly') {
            frequencyMultiple = 'months'
        } else if (repeatedInfo.repeatedType == 'Yearly') {
            frequencyMultiple = 'years';
        }

        // Repeat event frequency summary
        if (repeatedInfo.repeatedFrequency == 1) {
            summary += frequencyOne;
        } else if (repeatedInfo.repeatedFrequency > 1) {
            summary += ("Every " + repeatedInfo.repeatedFrequency + " " + frequencyMultiple);
        } else {
            summary += frequencyOne;
        }

        var from = new Date(this.state.fromTime);

        // Repeat event days summary
        if (repeatedInfo.repeatedType == 'Weekly') {
            summary += ' on ';
            for (var i = 0; i < repeatedInfo.repeatedOn.length; i++) {
                summary += this.daysInWeekMap[repeatedInfo.repeatedOn[i]];
                if (i != repeatedInfo.repeatedOn.length - 1)
                    summary += ', ';
            }
        } else if (repeatedInfo.repeatedType == 'Monthly') {
            summary += ' on ';
            if (repeatedInfo.repeatedBy == 'Month') {
                summary += ' day ' + from.getDate();
            } else if (repeatedInfo.repeatedBy == 'Week') {
                summary += ' the ';
                var weekOfMonth = from.weekOfMonth();

                if (weekOfMonth == 1) {
                    summary += ' first ';
                } else if (weekOfMonth == 2) {
                    summary += ' second ';
                } else if (weekOfMonth == 3) {
                    summary += ' third ';
                } else if (weekOfMonth == 4) {
                    summary += ' fourth ';
                } else if (weekOfMonth == 5) {
                    summary += ' fifth ';
                }

                summary += this.daysInWeekMap[this.daysInWeek[from.getDay()]];
            }
        } else if (repeatedInfo.repeatedType === 'Yearly') {
            summary += ' on ' + this.months[from.getMonth()] + ' ' + from.getDate();
        }

        // Repeat event ends way summary
        if (repeatedInfo.repeatedEndType == 'Occurrence') {
            if (isNaN(repeatedInfo.repeatedTimes)) repeatedInfo.repeatedTimes = 1;
            else repeatedInfo.repeatedTimes = Math.floor(repeatedInfo.repeatedTimes);

            summary += ", " + repeatedInfo.repeatedTimes + " times";
        } else if (repeatedInfo.repeatedEndType == 'Date') {
            summary += ", until " + this.refs.repeatedEndDate.getDate().toDateString();
        }
        return summary;
    },

    _onFullDayToggled(e, isInputChecked) {
        if (isInputChecked) {
            this.setState({fullDay: true});
        } else {
            this.setState({fullDay: false});
        }
    },

    _onRepeatToggled(e, isInputChecked) {
        if (isInputChecked) {
            this.setState({editRepeated: true});
        } else {
            this.setState({editRepeated: false, repeated: false});
        }
    }
});
