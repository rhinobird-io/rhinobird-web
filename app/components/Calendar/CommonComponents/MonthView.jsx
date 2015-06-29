const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');

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

    render() {
        let {
            date,
            ...others
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
        let style = {
            width: 0,
            fontWeight: 600,
            fontSize: "1.1em",
            padding: "0.2em 0.4em",
            color: this.context.muiTheme.palette.disabledColor
        };
        let weekdaysBar = weekdays.map(d => {
            return (
                <Flex.Layout flex={1} style={style}>
                    {d}
                </Flex.Layout>
            );
        });
        return (
            <Flex.Layout horizontal stretch>
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
        console.log(weeks);
    }
});

module.exports = MonthView;