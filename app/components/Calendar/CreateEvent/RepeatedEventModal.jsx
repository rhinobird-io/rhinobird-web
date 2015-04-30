const React        = require("react"),
      MUI          = require("material-ui"),
      Layout       = require("../../Flex").Layout,
      Selector     = require("../../Select").Selector;

require("./style.less");

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

    getInitialState() {
        return {
            repeatedType: "Daily",
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

    getSummary() {
        return this.state.summary;
    },

    render() {
        let styles = {
            repeatedEvery: {
                textAlign: "center"
            }
        };

        return (
            <MUI.Dialog {...this.props} className="repeated-event-modal" ref="dialog" title="Repeated Information">
                <Layout vertical>
                    <Layout horizontal justified>
                        <label>Repeats:</label>
                        <Selector
                            valueLink={this.linkState("repeatedType")}>
                            <span className="cal-event-repeated-item" name="Daily">Daily</span>
                            <span className="cal-event-repeated-item" name="Weekly">Weekly</span>
                            <span className="cal-event-repeated-item" name="Monthly">Monthly</span>
                            <span className="cal-event-repeated-item" name="Yearly">Yearly</span>
                        </Selector>
                    </Layout>
                    <Layout horizontal justified>
                        <Layout vertical selfCenter>
                            <label>Repeated Every:</label>
                        </Layout>
                        <div>
                            <MUI.TextField
                                type="text"
                                styles={styles.repeatedEvery}
                                className="cal-event-repeated-every" />
                            {this.repeatedEvery[this.state.repeatedType]}
                        </div>
                    </Layout>
                    <Layout horizonal justified>
                        <label>Repeat Summary:</label>
                    </Layout>
                </Layout>
            </MUI.Dialog>
        );
    },

    _updateSummary() {
        let event = this.props.event;
        if (!event.repeated) {
            return 'None';
        }
        var summary = "", frequencyOne, frequencyMultiple;
        frequencyOne = event.repeated_type;

        if (event.repeated_type == 'Daily') {
            frequencyMultiple = 'days';
        } else if (event.repeated_type == 'Weekly') {
            frequencyMultiple = 'weeks';
        } else if (event.repeated_type == 'Monthly') {
            frequencyMultiple = 'months'
        } else if (event.repeated_type == 'Yearly') {
            frequencyMultiple = 'years';
        }

        // Repeat event frequency summary
        if (event.repeated_frequency == 1) {
            summary += frequencyOne;
        } else if (event.repeated_frequency > 1) {
            summary += ("Every " + event.repeated_frequency + " " + frequencyMultiple);
        } else {
            summary += frequencyOne;
        }

        var from = new Date(event.from_time);

        // Repeat event days summary
        if (event.repeated_type == 'Weekly') {
            summary += ' on ';
            for (var i = 0; i < event.repeated_on.length; i++) {
                summary += this.daysInWeekMap[event.repeated_on[i]];
                if (i != event.repeated_on.length - 1)
                    summary += ', ';
            }
        } else if (event.repeated_type == 'Monthly') {
            summary += ' on ';
            if (event.repeated_by == 'Month') {
                summary += ' day ' + from.getDate();
            } else if (event.repeated_by == 'Week') {
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
        } else if (event.repeated_type == 'Yearly') {
            summary += ' on ' + this.months[from.getMonth()] + ' ' + from.getDate();
        }

        // Repeat event ends way summary
        if (event.repeated_end_type == 'Occurence') {
            if (isNaN(event.repeated_times)) event.repeated_times = 1;
            else event.repeated_times = Math.floor(event.repeated_times);

            summary += ", " + event.repeated_times + " times";
        } else if (event.repeated_end_type == 'Date') {
            summary += ", until " + event.repeated_end_date.toDateString();
        }
        event.summary = summary;
    }

});