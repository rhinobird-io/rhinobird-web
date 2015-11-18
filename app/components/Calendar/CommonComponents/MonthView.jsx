import uuid from 'node-uuid';
const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');
const assign = require("object-assign");
const PerfectScroll = require('../../PerfectScroll');

let MonthView = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        date: React.PropTypes.object,
        onRangeClicked: React.PropTypes.func,
        monthRangeContent: React.PropTypes.func
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
                padding: "0 1em",
                position: "relative",
                borderTop: "1px solid " + muiTheme.palette.borderColor
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
                borderBottom: `1px solid ${muiTheme.palette.borderColor}`
            },
            inner: {
                width: 0,
                fontWeight: 600,
                fontSize: "1.1em",
                padding: "0.2em 0.4em",
                color: muiTheme.palette.disabledColor
            }
        };
        let weekdaysBar = weekdays.map(d => {
            return (
                <Flex.Layout key={d} flex={1} style={styles.inner}>
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
            start.setDate(start.getDate() + 7 - start.getDay());
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
                borderBottom: `1px solid ${muiTheme.palette.borderColor}`,
                borderRight: `1px solid ${muiTheme.palette.borderColor}`
            },
            dayHeader: {
                padding: 2,
                minHeight: 24,
                fontSize: "1.2em"
            },
            rangeOuter: {
                minHeight: 24,
                padding: 2,
                overflow: "hidden",
                cursor: "pointer"
            },
            rangeInner: {
                padding: "0 4px",
                backgroundColor: muiTheme.palette.primary3Color
            }
        };
        let weekdays = date.weekDays();
        let weekContent = weekdays.map((d, index) => {
            let dayRanges = this.state.allRanges[Moment(d).format("YYYY-MM-DD")] || [];

            let dayContents = dayRanges.map(dayRange => {
                let dayContent = null;
                if (this.props.monthRangeContent) {
                    dayContent = this.props.monthRangeContent(dayRange);
                }
                let ref = uuid();
                return (
                    <div key={ref} ref={ref} style={styles.rangeOuter}
                         onClick={() => this._handleRangeClick(ref, dayRange)}>
                        <div style={styles.rangeInner}>
                            {dayContent}
                        </div>
                    </div>
                );
            });

            let outStyle = {};
            assign(outStyle, styles.outer);

            let today = Moment(new Date()).format("YYYY-MM-DD");
            let dayFormat = Moment(d).format("YYYY-MM-DD");
            if (index === 0) {
                outStyle.borderLeft = `1px solid ${muiTheme.palette.borderColor}`;
                if (today === dayFormat) {
                    outStyle.borderLeft = `1px solid ${muiTheme.palette.accent1Color}`;
                }
            }
            let yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (Moment(yesterday).format("YYYY-MM-DD") === dayFormat) {
                outStyle.borderRight = `1px solid ${muiTheme.palette.accent1Color}`;
            }
            let sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (Moment(sevenDaysAgo).format("YYYY-MM-DD") === dayFormat) {
                outStyle.borderBottom = `1px solid ${muiTheme.palette.accent1Color}`;
            }
            if (Moment(d).format("YYYY-MM-DD") === today) {
                outStyle.borderRight = `1px solid ${muiTheme.palette.accent1Color}`;
                outStyle.borderBottom = `1px solid ${muiTheme.palette.accent1Color}`;
                //outStyle.backgroundColor = `${muiTheme.palette.accent3Color}`;
            }
            return (
                <Flex.Layout key={`day_${index}`} ref={`day_${index}`} vertical flex={1} style={outStyle}>
                    <div style={styles.dayHeader}>{d.getDate()}</div>
                    <Flex.Layout vertical flex={1} style={{height: 0, width: "100%"}}>
                        {dayContents}
                    </Flex.Layout>
                </Flex.Layout>
            )
        });

        return (
            <Flex.Layout key={date} flex={1} horizontal stretch style={{minHeight: 100}}>
                {weekContent}
            </Flex.Layout>
        );
    },

    _handleRangeClick(rangeRef, rangeData) {
        if (this.props.onRangeClicked && typeof this.props.onRangeClicked === "function") {
            let rect = this.refs[rangeRef].getDOMNode().getBoundingClientRect();
            this.props.onRangeClicked(rect, rangeData);
        }
    }
});

module.exports = MonthView;