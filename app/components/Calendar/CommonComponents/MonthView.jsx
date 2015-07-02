const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');
const PerfectScroll = require('../../PerfectScroll');

let MonthView = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        date: React.PropTypes.object
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

        }
    },

    render() {
        let {
            date,
            data
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
        let style = {
            width: 0,
            padding: "0.2em 0.5em",
            borderTop: `1px solid ${this.context.muiTheme.palette.borderColor}`,
            borderRight: `1px solid ${this.context.muiTheme.palette.borderColor}`
        };
        let weekdays = date.weekDays();
        let weekContent = weekdays.map(d => (
           <Flex.Layout flex={1} style={style}>
               {d.getDate()}
           </Flex.Layout>
        ));
        return (
            <Flex.Layout flex={1} horizontal stretch style={{minHeight: 100}}>
                {weekContent}
            </Flex.Layout>
        );
    }
});

module.exports = MonthView;