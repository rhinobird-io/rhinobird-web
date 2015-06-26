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
        this.refs.title.focus();
    },

    getInitialState() {
        let fromDate = new Date();
        let toDate = new Date(fromDate);
        toDate.setHours(toDate.getHours() + 1);

        return {
            titleError: "",
            fullDay: false,
            participants: {
                teams: [],
                users: []
            },
            fromDate: fromDate,
            fromTime: fromDate,
            toDate: toDate,
            toTime: toDate,
            editRepeated: false,
            repeated: false,
            repeatedType: "Daily",
            repeatedFrequency: 1,
            repeatedOn: this._getInitialRepeatedOn(new Date()),
            repeatedBy: "Month",
            repeatedEndType: "Never",
            repeatedEndDate: new Date(),
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
                height: "100%",
                margin: 20
            },
            inner: {
                width: 600,
                padding: 0,
                margin: 20
            },
            picker: {
                width: "auto !important"
            }
        };

        let fromTime = <MUI.TimePicker
            format="ampm"
            ref="fromTime"
            hintText="From Time"
            style={styles.picker}
            defaultDate={this.state.fromTime}
            defaultTime={this.state.fromTime}
            onChange={this._onFromTimeChange}
            floatingLabelText="From Time" />

        let toTime = <MUI.TimePicker
            format="ampm"
            ref="toTime"
            hintText="To Time"
            style={styles.picker}
            defaultDate={this.state.toTime}
            defaultTime={this.state.toTime}
            onChange={this._onToTimeChange}
            floatingLabelText="To Time" />

        return (
            <PerfectScroll style={{height: "100%", position: "relative"}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                    <MUI.Paper zDepth={3} style={styles.inner}>
                        <div style={{padding: 20}}>
                            <h3 style={{marginBottom: 0}}>Create Event</h3>

                            <MUI.TextField
                                ref="title"
                                hintText="Event Title"
                                errorText={this.state.titleError}
                                floatingLabelText="Event Title"
                                style={{width: "100%"}} />

                            <SmartEditor
                                multiLine={true}
                                ref="description"
                                hintText="Description"
                                errorText={this.state.descriptionError}
                                floatingLabelText="Description"
                                style={{width: "100%"}} />

                            <Flex.Layout horizontal justified style={{marginTop: 24, marginBottom: 24}}>
                                <MUI.Toggle
                                    label="Full Day"
                                    onToggle={this._onFullDayToggled}/>
                            </Flex.Layout>

                            <MUI.Tabs>
                                <MUI.Tab label="Period" onActive={() => this.setState({isPeriod: true})}>
                                    <div className="tab-template-container">
                                        <Flex.Layout horizontal justified style={{marginTop: -10}}>
                                            <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                                {this.state.isPeriod ? <MUI.DatePicker
                                                    ref="fromDate"
                                                    hintText="From Date"
                                                    style={styles.picker}
                                                    floatingLabelText="From Date"
                                                    onChange={this._onFromDateChange}
                                                    defaultDate={this.state.fromDate} /> : null}
                                                {!this.state.fullDay ? fromTime : null}
                                            </Flex.Layout>
                                            <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                                <MUI.DatePicker
                                                    ref="toDate"
                                                    hintText="To Date"
                                                    style={styles.picker}
                                                    floatingLabelText="To Date"
                                                    onChange={this._onToDateChange}
                                                    defaultDate={this.state.fromDate} />
                                                {!this.state.fullDay ? toTime : null}
                                            </Flex.Layout>
                                        </Flex.Layout>
                                    </div>
                                </MUI.Tab>
                                <MUI.Tab label="Point" onActive={() => this.setState({isPeriod: false})}>
                                    <div className="tab-template-container">
                                        <Flex.Layout horizontal justified style={{marginTop: -10}}>
                                            {!this.state.isPeriod ? <MUI.DatePicker
                                                ref="fromDate"
                                                hintText="From Date"
                                                style={styles.picker}
                                                floatingLabelText="From Date"
                                                onChange={this._onFromDateChange}
                                                defaultDate={this.state.fromDate} /> : null}
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
                                        <label title={this._getSummary()} style={{maxWidth: 240}}>
                                            {this._getSummary()}
                                        </label>
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
                                style={{width: "100%"}}
                                valueLink={this.linkState("participants")} />

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
                                <h3>Repeat Information</h3>
                            </Flex.Layout>
                            {this._getRepeatedInfoContent()}
                        </div>
                    </MUI.Paper>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _onFromDateChange(e, newDate) {
        if (newDate > this.refs.toDate.getDate()) {
            this.refs.toDate.setDate(newDate);
        }
        console.log(this.refs.fromDate.getDate());
        console.log(newDate);
        if (newDate.toDateString() === this.refs.toDate.getDate().toDateString()) {
            if (this.refs.fromTime.getTime().toTimeString() > this.refs.toTime.getTime().toTimeString()) {
                this.refs.toTime.setTime(this.refs.fromTime.getTime());
            }
        }
    },

    _onFromTimeChange(e, newTime) {
        if (newTime > this.refs.toTime.getTime()) {
            this.refs.toTime.setTime(newTime);
        }
    },

    _onToTimeChange(e, newTime) {
        if (newTime < this.refs.fromTime.getTime()) {
            this.refs.fromTime.setTime(newTime);
        }
    },

    _onToDateChange(e, newDate) {
        if (newDate < this.refs.fromDate.getDate()) {
            this.refs.fromDate.setDate(newDate);
        }
        if (newDate.toDateString() === this.refs.fromDate.getDate().toDateString()) {
            if (this.refs.fromTime.getTime().toTimeString() > this.refs.toTime.getTime().toTimeString()) {
                this.refs.fromTime.setTime(this.refs.toTime.getTime());
            }
        }
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;

        let refs = this.refs;

        let title = refs.title.getValue();
        let description = refs.description.getValue();

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
        event.fromDate = this.refs.fromDate.getDate();
        event.toDate = this.refs.toDate ? this.refs.toDate.getDate() : new Date();
        event.fromTime = this.refs.fromTime ? this.refs.fromTime.getTime() : event.fromDate;
        event.toTime = this.refs.toTime ? this.refs.toTime.getTime() : event.toDate;

        CalendarActions.create(event, () => this.context.router.transitionTo("event-list"));
    },

    _getRepeatedInfoContent() {
        let styles = {
            textfield: {
                textAlign: "center",
                fontSize: "0.9em",
                width: 40
            },
            row: {
                lineHeight: "3em"
            },
            endDate: {
                width: "50px"
            }
        };

        let weeklyRepeats = this.daysInWeek.map(day => <span name={day}>{day}</span>);
        let weeklyRepeatOn =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Weekly"} style={styles.row}>
                <Flex.Layout>Repeated On:</Flex.Layout>
                <Flex.Layout>
                    <Selector
                        multiple
                        valueLink={this.linkState("repeatedOn")}
                        onSelectChange={this._repeatedOnChange}>
                        {weeklyRepeats}
                    </Selector>
                </Flex.Layout>
            </Flex.Layout>;

        let monthlyRepeatBy =
            <Flex.Layout horizontal justified hidden={this.state.repeatedType !== "Monthly"} style={styles.row}>
                <label>Repeated By:</label>
                <Flex.Layout>
                    <Selector
                        valueLink={this.linkState("repeatedBy")}>
                        <span className="cal-event-repeated-item" name="Month">Day of The Month</span>
                        <span className="cal-event-repeated-item" name="Week">Day of The Week</span>
                    </Selector>
                </Flex.Layout>
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
                        style={{width: 120}}
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
                    <Flex.Layout flex={1} style={{whiteSpace: "nowrap", minWidth: 120}}>Repeat Summary:</Flex.Layout>
                    <Flex.Layout>{this._getSummary()}</Flex.Layout>
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
