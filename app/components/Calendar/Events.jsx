const React = require('react');
const CalendarStore = require("../../stores/CalendarStore");
const CalendarActions = require("../../actions/CalendarActions");
const DayView = require('./EventViews/DayView');

let TimeBar = React.createClass({
    getDefaultProps() {

    },

    render() {
        let styles = {
            time: {
                height: 40,
                paddingRight: 5,
                lineHeight: "40px",
                textAlign: "right",
                boxSizing: "border-box",
                borderTop: "1px solid lightgray"
            }
        };
        let times = [];

        for (let i = 0; i <= 12; i++) {
            times.push(<div style={styles.time}>{`${i} am`}</div>);
        }
        for (let i = 1; i < 12; i++) {
            times.push(<div style={styles.time}>{`${i} pm`}</div>);
        }

        return (
            <div style={this.props.style}>
                {times}
            </div>
        );
    }
});

let Events = React.createClass({
    render() {
        return (
            <div style={{height: "100%", overflow: "auto"}}>
                <table cellspacing="0" cellpadding="0" style={{width: "100%", borderSpacing: 0}}>
                    <tbody>
                        <tr>
                            <td style={{width: 60, padding: 0}}>
                                <TimeBar />
                            </td>
                            <td style={{padding: 0}}>
                                <DayView date={"2015-06-03"}/>
                            </td>
                            <td style={{padding: 0}}>
                                <DayView date={"2015-06-04"}/>
                            </td>
                            <td style={{padding: 0}}>
                                <DayView date={"2015-06-05"}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = Events;