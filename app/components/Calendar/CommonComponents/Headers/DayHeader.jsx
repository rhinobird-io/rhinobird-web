const React = require('react');
const Moment = require('moment');

let DayHeader = React.createClass({
    propTypes: {
        date: React.PropTypes.object
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let styles = {
            weekDay: {
                width: 30,
                fontWeight: 600,
                fontSize: "1.1em",
                padding: "0.2em 0.4em",
                color: this.context.muiTheme.palette.disabledColor
            },
            date: {
                width: 30,
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
            styles.date.color = this.context.muiTheme.palette.accent1Color;
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
