const React        = require("react"),
      MUI          = require("material-ui"),
      Layout       = require("../../Flex").Layout,
      Selector     = require("../../Select").Selector;

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
}

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        event: React.PropTypes.object.isRequired
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

    getInitialState() {
        return {
            repeatedType: "Daily",
            repeatedFrequency: 1,
            repeatedOn: this._getInitialRepeatedOn(),
            repeatedBy: "Month",
            repeatedEndType: "Never",
            repeatedEndDate: new Date(),
            repeatedTimes: 1,
            summary: ""
        };
    },

    getValueLink(props) {
        return props.valueLink || {
            value: props.value,
            requestChange: props.onChange
        };
    },

    show() {
        this.refs.dialog.show();
    },

    render() {
        let styles = {
            textfield: {
                textAlign: "center"
            },
            row: {
                lineHeight: "3em"
            }
        };

        let weeklyRepeatOn =
            <Layout horizontal justified hidden={this.state.repeatedType !== "Weekly"} style={styles.row}>
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
            </Layout>;

        let monthlyRepeatBy =
            <Layout horizontal justified hidden={this.state.repeatedType !== "Monthly"} style={styles.row}>
                <label>Repeated By:</label>
                <Selector
                    valueLink={this.linkState("repeatedBy")}>
                    <span className="cal-event-repeated-item" name="Month">Month</span>
                    <span className="cal-event-repeated-item" name="Week">Week</span>
                </Selector>
            </Layout>;

        let occurrence =
            <Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Occurrence"}>
                <Layout vertical selfCenter>
                    <label>After</label>
                </Layout>
                <MUI.TextField
                    type="text"
                    ref="repeatedTimes"
                    styles={styles.textfield}
                    className="cal-event-repeated-every"
                    valueLink={this.linkState("repeatedTimes")}/>
                <Layout vertical selfCenter>
                    <label>times</label>
                </Layout>
            </Layout>;

        let endDate =
            <Layout horizontal selfEnd hidden={this.state.repeatedEndType !== "Date"}>
                <Layout vertical selfCenter>
                    <label>Ends On:</label>
                </Layout>
                <MUI.DatePicker hintText="From Date" valueLink={this.linkState("repeatedEndDate")} />
            </Layout>;

        return (
            <MUI.Dialog {...this.props} className="repeated-event-modal" ref="dialog" title="Repeated Information">
                <Layout vertical>
                    <Layout horizontal justified style={styles.row}>
                        <label>Repeats:</label>
                        <Selector
                            valueLink={this.linkState("repeatedType")}
                            onSelectChange={this._repeatedTypeChange}>
                            <span className="cal-event-repeated-item" name="Daily">Daily</span>
                            <span className="cal-event-repeated-item" name="Weekly">Weekly</span>
                            <span className="cal-event-repeated-item" name="Monthly">Monthly</span>
                            <span className="cal-event-repeated-item" name="Yearly">Yearly</span>
                        </Selector>
                    </Layout>
                    <Layout horizontal justified style={styles.row}>
                        <Layout vertical selfCenter>
                            <label>Repeated Every:</label>
                        </Layout>
                        <div>
                            <MUI.TextField
                                type="text"
                                ref="repeatedFrequency"
                                styles={styles.textfield}
                                className="cal-event-repeated-every"
                                valueLink={this.linkState("repeatedFrequency")} />
                            {this.repeatedEvery[this.state.repeatedType]}
                        </div>
                    </Layout>
                    {weeklyRepeatOn}
                    {monthlyRepeatBy}
                    <Layout horizontal justified style={styles.row}>
                        <label>Ends Way:</label>
                        <Selector
                            ref="repeatedEndType"
                            valueLink={this.linkState("repeatedEndType")}
                            onSelectChange={this._repeatedEndTypeChange}>
                            <span className="cal-event-repeated-item" name="Never">Never</span>
                            <span className="cal-event-repeated-item" name="Occurrence">Occurrence</span>
                            <span className="cal-event-repeated-item" name="Date">Date</span>
                        </Selector>
                    </Layout>
                    {occurrence}
                    {endDate}
                    <Layout horizonal justified style={styles.row}>
                        <label>Repeat Summary:</label>
                        <label>{this._getSummary()}</label>
                    </Layout>
                </Layout>
            </MUI.Dialog>
        );
    },

    _getInitialRepeatedOn() {
        let from = new Date(this.props.event.fromTime);
        let repeatedOn = [];
        repeatedOn.push(this.daysInWeek[from.getDay()]);
        return repeatedOn;
    },

    _repeatedTypeChange() {
        this.refs.repeatedFrequency.focus();
    },

    _repeatedOnChange(selectedValue) {
        if (selectedValue === null || (Array.isArray(selectedValue) && selectedValue.length === 0)) {
            this.setState({repeatedOn: this._getInitialRepeatedOn()});
        }
    },

    _repeatedEndTypeChange(repeatedEndType) {
        if (repeatedEndType === "Occurrence") {
            this.refs.repeatedTimes.focus();
        }
    },

    _getSummary() {
        let event = this.props.event;
        let repeatedInfo = this.state;

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

        var from = new Date(event.fromTime);

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
            if (isNaN(event.repeatedTimes)) repeatedInfo.repeatedTimes = 1;
            else repeatedInfo.repeatedTimes = Math.floor(repeatedInfo.repeatedTimes);

            summary += ", " + repeatedInfo.repeatedTimes + " times";
        } else if (repeatedInfo.repeatedEndType == 'Date') {
            summary += ", until " + repeatedInfo.repeatedEndDate.toDateString();
        }
        return summary;
    }

});