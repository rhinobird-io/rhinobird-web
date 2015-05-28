let React = require('react');
let CalendarStore = require("../../stores/CalendarStore");
let CalendarActions = require("../../actions/CalendarActions");

let EventRect = React.createClass({
    getInitialState() {
        return {
        };
    },

    render() {
        let {
            style,
            event,
            ...other
        } = this.props;

        if (!style) {
            style = {};
        }

        style.position = "absolute";
        style.border = "1px solid rgb(33, 150, 243)";
        style.background = "rgba(33, 150, 243, .7)";
        style.left = 10;
        style.right = 10;
        style.borderRadius = 2;

        if (event) {
            let fromTime = new Date(event.from_time);
            let toTime = new Date(event.to_time);

            let time = fromTime.getHours() * 3600 + fromTime.getMinutes() * 60 + fromTime.getSeconds();
            let range = (toTime - fromTime) / 1000;

            let top = `${time / 864}%`;
            let height = `${range / 864}%`;
            let minHeight = "20px";

            style.top = top;
            style.height = height;
            style.minHeight = minHeight;
        }
        return (
            <div style={style} {...other}>
                <div>{`${event.from_time}~${event.to_time}`}</div>
                <div>{event.title}</div>
            </div>
        );
    }
});

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

let DayBar = React.createClass({
    getInitialState() {
        return {

        }
    },

    render() {
        let {
            style,
            events
        } = this.props;

        if (!style) {
            style = {};
        }
        style.position = "relative";
        style.borderRight = "1px solid lightgray";

        let styles = {
            top: {
                height: 20,
                borderTop: "1px solid lightgray"
            },
            bottom: {
                height: 20,
                borderTop: "1px dashed lightgray"
            }
        };

        let times = [];

        for (let i = 0; i < 24; i++) {
            times.push(<div key={i + "t"} style={styles.top}></div>);
            times.push(<div key={i + "b"} style={styles.bottom}></div>);
        }

        let eventsRect = (events || []).map(event => {
            return (
                <EventRect event={event}/>
            );
        });
        console.log(eventsRect);
        return (
            <div style={style}>
                {times}
                {eventsRect.slice(0, 1)}
            </div>
        );
    }
});

let Events = React.createClass({
    getInitialState() {
        return {
            events: CalendarStore.getAllEvents()
        }
    },

    componentDidMount() {
        CalendarActions.receive();
        CalendarStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        CalendarStore.reset();
        CalendarStore.removeChangeListener(this._onChange);
    },

    render() {
        return (
            <div style={{height: "100%", overflow: "auto"}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <td style={{width: 60}}>
                                <TimeBar />
                            </td>
                            <td>
                                <DayBar events={this.state.events["2015-05-28"]}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAllEvents()
        });
    }
});

module.exports = Events;