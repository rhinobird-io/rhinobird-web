const React = require('react');
const Moment = require('moment');

let DayHeader = React.createClass({
    propTypes: {
        date: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ])
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let styles = {
            weekDay: {
                width: 0,
                fontWeight: 600,
                fontSize: "1.1em",
                padding: "0.2em 0.4em",
                color: muiTheme.palette.disabledColor
            },
            date: {
                width: 0,
                fontSize: "3em",
                padding: "0.1em",
                lineHeight: "1.4em"
            }
        };

        let today = new Date();
        let date = this.props.date || today;
        let weekdayDOM = <div style={styles.weekDay}>{Moment(date).format("ddd")}</div>;
        let dateDOM = <div style={styles.date}>{Moment(date).format("D")}</div>;

        if (today.toDateString() === new Date(date).toDateString()) {
            styles.date.color = muiTheme.palette.accent1Color;
        }
        return (
            <div style={this.props.style}>
                {weekdayDOM}
                {dateDOM}
            </div>
        );
    }
});

module.exports = DayHeader;
