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
            times.push(<div style={styles.time} key={`${i}am`}>{`${i} AM`}</div>);
        }
        times.push(<div style={styles.time} key="12pm">{'12 PM'}</div>);
        for (let i = 1; i < 12; i++) {
            times.push(<div style={styles.time} key={`${i}pm`}>{`${i} PM`}</div>);
        }

        return (
            <div style={this.props.style}>
                {times}
            </div>
        );
    }
});

module.exports = TimeBar;