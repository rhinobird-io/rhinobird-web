const React = require('react');
const CalendarStore = require("../../../stores/CalendarStore");
const CalendarActions = require("../../../actions/CalendarActions");
const Moment = require('moment');

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
        style.left = 0;
        style.right = 10;
        //style.borderRadius = 2;

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
            console.log(style);
        }
        return (
            <div style={style} {...other}>
                <div>{`${Moment(event.from_time).format("hh:mm")}~${Moment(event.to_time).format("hh:mm")}`}</div>
                <div>{event.title}</div>
            </div>
        );
    }
});

let DayView = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        date: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ])
    },

    getInitialState() {
        return {
            events: []
        }
    },

    componentDidMount() {
        CalendarActions.receive();
        CalendarStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    render() {
        let {
            style,
            date
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
            },
            nowBar: {
                position: "absolute",
                height: 2,
                overflow: "hidden",
                width: "100%",
                backgroundColor: this.context.muiTheme.palette.accent1Color
            }
        };

        let times = [];

        for (let i = 0; i < 24; i++) {
            times.push(<div key={i + "t"} style={styles.top}></div>);
            times.push(<div key={i + "b"} style={styles.bottom}></div>);
        }

        let eventsRect = (this.state.events || []).map(event => {
            return (
                <EventRect event={event}/>
            );
        });

        let now = new Date();
        let nowBar = null;
        if (now.toDateString() === new Date(date).toDateString()) {
            let time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            console.log(time);
            styles.nowBar.top = `${(time / 864)}%`;
            nowBar = <div style={styles.nowBar}></div>
        }

        return (
            <div style={style}>
                {times}
                {nowBar}
                {eventsRect}
            </div>
        );
    },


    _onChange() {
        this.setState({
            events: CalendarStore.getByDate(this.props.date)
        });
    }
});

module.exports = DayView;