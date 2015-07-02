const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');
const PerfectScroll = require('../../PerfectScroll');

let MonthView = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        date: React.PropTypes.object,
        rangeContent: React.PropTypes.func
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            date: new Date(),
            data: []
        }
    },

    getInitialState() {
        return {
            allRanges: this._parseData(this.props.data || [])
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                allRanges: this._parseData(nextProps.data || [])
            });
        }
    },

    render() {
        let {
            date,
        } = this.props;

        let styles = {
            wrapper: {
                padding: "0.5em 1em",
                position: "relative",
                borderTop: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        return (
            <Flex.Layout flex={1} vertical style={styles.wrapper}>
                {this._getWeekDaysBar()}
                {this._getMonthContent(date)}
            </Flex.Layout>
        )
    },

    _parseData(data) {
        let result = {};
        data.forEach(item => {
            let format = Moment(item.from_time).format("YYYY-MM-DD");
            if (!result[format]) {
                result[format] = [];
            }
            result[format].push(item);
        });
        return result;
    },

    _getWeekDaysBar() {
        let weekdays = Moment.weekdaysShort();
        let styles = {
            outer: {
                paddingBottom: 10
            },
            inner: {
                width: 0,
                fontWeight: 600,
                fontSize: "1.1em",
                padding: "0.2em 0.4em",
                color: this.context.muiTheme.palette.disabledColor
            }
        };
        let weekdaysBar = weekdays.map(d => {
            return (
                <Flex.Layout flex={1} style={styles.inner}>
                    {d}
                </Flex.Layout>
            );
        });
        return (
            <Flex.Layout horizontal stretch style={styles.outer}>
                {weekdaysBar}
            </Flex.Layout>
        )
    },

    _getMonthContent(date) {
        let start = new Date(date);
        start.setDate(1);
        let month = start.getMonth();

        let weeks = [];
        while (month === start.getMonth()) {
            weeks.push(new Date(start));
            start.setDate(start.getDate() + 7);
        }

        let contents = weeks.map(w => this._getWeekContent(w));
        return (
            <Flex.Layout flex={1}  style={{position: "relative"}}>
                <PerfectScroll style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                    <Flex.Layout vertical stretch style={{height: "100%"}}>
                        {contents}
                    </Flex.Layout>
                </PerfectScroll>
            </Flex.Layout>
        )
    },

    _getWeekContent(date) {
        let styles = {
            outer: {
                width: 0,
                minHeight: 0,
                overflow: "hidden",
                padding: "0.2em 0.5em",
                borderTop: `1px solid ${this.context.muiTheme.palette.borderColor}`,
                borderRight: `1px solid ${this.context.muiTheme.palette.borderColor}`
            },
            dayHeader: {
                padding: 2,
                minHeight: 24,
                fontSize: "1.2em"
            },
            rangeOuter: {
                minHeight: 24,
                padding: 2
            },
            rangeInner: {
                backgroundColor: this.context.muiTheme.palette.primary3Color
            }

        };
        let weekdays = date.weekDays();
        let weekContent = weekdays.map(d => {
            let dayRanges = this.state.allRanges[Moment(d).format("YYYY-MM-DD")] || [];

            let dayContents = dayRanges.map(dayRange => {
                let dayContent = null;
                return (
                    <div style={styles.rangeOuter}>
                        <div style={styles.rangeInner}>
                            123123123
                        </div>
                    </div>
                );
            });

            return (
                <Flex.Layout vertical flex={1} style={styles.outer}>
                    <div style={styles.dayHeader}>{d.getDate()}</div>
                    <Flex.Layout style={{height: 0}} vertical>
                        {dayContents}
                    </Flex.Layout>
                </Flex.Layout>
            )
        });

        return (
            <Flex.Layout flex={1} horizontal stretch style={{minHeight: 100}}>
                {weekContent}
            </Flex.Layout>
        );
    }
});

module.exports = MonthView;