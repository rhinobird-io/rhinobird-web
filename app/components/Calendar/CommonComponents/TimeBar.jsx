const React = require('react');

let TimeBar = React.createClass({
    render() {
        let styles = {
            time: {
                height: 60,
                fontSize: "0.9em",
                lineHeight: "120px",
                textAlign: "right",
                boxSizing: "border-box"
            }
        };
        let times = [];

        for (let i = 1; i <= 11; i++) {
            times.push(<div style={styles.time}>{`${i} AM`}</div>);
        }
        times.push(<div style={styles.time}>{'12 PM'}</div>);
        for (let i = 1; i < 12; i++) {
            times.push(<div style={styles.time}>{`${i} PM`}</div>);
        }

        return (
            <div style={this.props.style}>
                {times}
            </div>
        );
    }
});

module.exports = TimeBar;