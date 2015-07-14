const React = require('react');
const Flex = require('../../Flex');
const MUI = require('material-ui');
const StylePropable = require('material-ui/lib/mixins/style-propable');
const Resizable = require('../../Mixins').Resizable;

let DayView = React.createClass({
    mixins: [StylePropable],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        date: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        objects: React.PropTypes.array,
        allowCover: React.PropTypes.bool,
        rectContent: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            allowCover: true
        }
    },

    getInitialState() {
        return {
        }
    },

    render() {
        let {
            style,
            date
        } = this.props;

        if (!style) {
            style = {};
        }
        style.WebkitUserSelect = "none";
        style.userSelect = "none";
        style.width = "100%";
        style.position = "relative";

        let styles = {
            top: {
                width: "100%",
                height: 30,
                borderBottom: "1px dashed " + this.context.muiTheme.palette.borderColor
            },
            bottom: {
                width: "100%",
                height: 30,
                borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor
            },
            nowBar: {
                position: "absolute",
                height: 2,
                zIndex: 10,
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

        let events = {};
        (this.state.events || []).forEach(e => {
            let fromTime = new Date(e.from_time);
            let key = Moment(fromTime).format("HH:mm");
            if (!events[key]) {
                events[key] = [];
            }
            events[key].push(e);
        });

        let eventsRect = Object.keys(events).map(key => {
            let es = events[key];
            let percent = 100 / es.length;
            let results = es.map(e => <EventRect event={e} style={{width: "100%"}}/>);
            return (
                {results}
            )
        });

        if (this.state.newEvent) {
            eventsRect.push(<EventRect onClick={() => this.setState({newEvent: null})} event={this.state.newEvent} style={{width: "100%"}}/>)
        }
        let now = new Date();
        let nowBar = null;
        if (now.toDateString() === new Date(date).toDateString()) {
            let time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            styles.nowBar.top = `${(time / 864)}%`;
            nowBar = <div style={styles.nowBar}></div>
        }

        return (
            <div vertical style={style}
                 onMouseUp={this._handleMouseUp}
                 onMouseMove={this._handleMouseMove}
                 onMouseDown={this._handleMouseDown}>
                {times}
                {nowBar}
                {eventsRect}
            </div>
        );
    },

    _handleMouseDown(e) {
        console.log(e);
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        this.startPosY = e.clientY - rect.top;
        this.mouseDown = true;
    },

    _handleMouseMove(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        let endPosY = e.clientY - rect.top;
        if (this.mouseDown) {
            let date = new Date(this.props.date);
            let fromSeconds = (this.startPosY / rect.height) * 86400;
            let toSeconds = (endPosY / rect.height) * 86400;
            let fromTime = new Date(date);

            let fromHour = Math.floor(fromSeconds / 3600);
            let fromMinute = Math.floor((fromSeconds - fromHour * 3600) / 60);

            fromTime.setHours(fromHour);
            fromTime.setMinutes(fromMinute)

            let toTime = new Date(date);

            let toHour = Math.floor(toSeconds / 3600);
            let toMinute = Math.floor((toSeconds - toHour * 3600) / 60);

            toTime.setHours(toHour);
            toTime.setMinutes(toMinute);

            let newEvent = {from_time: fromTime, to_time: toTime};
            this.setState({newEvent: newEvent})
        }
    },

    _handleMouseUp(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        let endPosY = e.clientY - rect.top;
        if (this.mouseDown) {
            let date = new Date(this.props.date);
            let fromSeconds = (this.startPosY / rect.height) * 86400;
            let toSeconds = (endPosY / rect.height) * 86400;
            let fromTime = new Date(date);

            let fromHour = Math.floor(fromSeconds / 3600);
            let fromMinute = Math.floor((fromSeconds - fromHour * 3600) / 60);

            fromTime.setHours(fromHour);
            fromTime.setMinutes(fromMinute)

            let toTime = new Date(date);

            let toHour = Math.floor(toSeconds / 3600);
            let toMinute = Math.floor((toSeconds - toHour * 3600) / 60);
            toTime.setHours(toHour);
            toTime.setMinutes(toMinute);

            let newEvent = {from_time: fromTime, to_time: toTime};
            this.setState({newEvent: newEvent})
        }

        this.mouseDown = false;
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getByDate(this.props.date).filter((e) => !e.full_day)
        });
    }
});

module.exports = DayView;