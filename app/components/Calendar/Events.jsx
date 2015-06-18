const React = require('react');
const CalendarStore = require("../../stores/CalendarStore");
const CalendarActions = require("../../actions/CalendarActions");
const DayView = require('./EventViews/DayView');
const Moment = require('moment');
const Flex = require('../Flex');
const PerfectScroll = require('../PerfectScroll');

// Get weekdays of the week of this date
Date.prototype.weekDays = function() {
    let result = [];
    let weekStartDay = new Date(this);
    weekStartDay.setDate(this.getDate() - this.getDay());
    for (let i = 0; i <= 6; i++) {
        let day = new Date(weekStartDay);
        day.setDate(weekStartDay.getDate() + i);
        result.push(day);
    }
    return result;
};

// Four days from this date
Date.prototype.fourDays = function() {
    let days = [];
    for (let i = 0; i <= 3; i++) {
        let day = new Date(this);
        day.setDate(this.getDate() + i);
        days.push(day);
    }
    return days;
};

Date.prototype.elapsedPercentageOfDay = function() {
    let seconds = 3600 * this.getHours() + 60 * this.getMinutes() + this.getSeconds();
    return seconds / 86400;
};

let TimeBar = React.createClass({
    render() {
        let styles = {
            time: {
                height: 60,
                lineHeight: "120px",
                textAlign: "right",
                boxSizing: "border-box"
            }
        };
        let times = [];

        for (let i = 1; i <= 11; i++) {
            times.push(<div style={styles.time}>{`${i}a`}</div>);
        }
        times.push(<div style={styles.time}>{'12p'}</div>);
        for (let i = 1; i < 12; i++) {
            times.push(<div style={styles.time}>{`${i}p`}</div>);
        }

        return (
            <div style={this.props.style}>
                {times}
            </div>
        );
    }
});

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
                fontSize: "1.1em",
                padding: "0.2em 0.4em",
                fontWeight: 600,
                color: this.context.muiTheme.palette.disabledColor
            },
            date: {
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

let AllDayEvents = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        events: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render() {
        let styles = {
            allDayEvent: {
                padding: 2,
                margin: 2,
                color: this.context.muiTheme.palette.textColor,
                backgroundColor: this.context.muiTheme.palette.primary1Color,
                border: "1px solid " + this.context.muiTheme.palette.primary2Color
            }
        };

        let {
            events,
            ...others
        } = this.props;

        let content = events.map((e) => (
            <div style={styles.allDayEvent}>{e.title}</div>
        ));

        return (
            <Flex.Layout vertical style={this.props.style}>
                {content}
            </Flex.Layout>
        );
    }
});

let Events = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getInitialState() {
        return {
            viewType: "week",
            date: new Date(),
            events: []
        }
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        this._scrollToNow();
        this.refs.content.getDOMNode().style.top = this.refs.header.getDOMNode().offsetHeight + "px";
    },

    componentDidUpdate() {
        this.refs.content.getDOMNode().style.top = this.refs.header.getDOMNode().offsetHeight + "px";
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    render() {
        let {
        } = this.props;

        let styles = {
            timeBar: {
                width: 60,
                paddingRight: 10
            },
            dayHeader: {
                padding: "0.2em 0.5em",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor,
                borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor
            },
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        let date = this.state.date ? this.state.date : new Date();

        // Date Bar
        let dateBars = null;
        let days = [];
        let dayContents = [];
        let fullDayEvents = [];

        switch (this.state.viewType) {
            case "day":
                days.push(date);
                break;
            case "week":
                days = date.weekDays();
                break;
            case "4days":
                days = date.fourDays();
                break;
            case "month":
                break;
        }

        if (this.state.viewType !== "month") {
            dayContents = days.map(d => (
                <Flex.Layout flex={1} style={styles.dayContent} >
                    <DayView date={Moment(d).format("YYYY-MM-DD")} />
                </Flex.Layout>
            ));

            dateBars = days.map(d => (
                <Flex.Layout flex={1} vertical style={styles.dayHeader}>
                    <DayHeader date={Moment(d).format("YYYY-MM-DD")} />
                </Flex.Layout>
            ));

            fullDayEvents = days.map(d => (
                <Flex.Layout flex={1} style={styles.dayContent}>
                    <AllDayEvents style={{width: "100%"}} events={CalendarStore.getAllDayEventsByDate(d)}/>
                </Flex.Layout>
            ));
        }

        let eventTable = (
            <Flex.Layout horitonzal>
                <TimeBar style={styles.timeBar}/>
                <Flex.Layout flex={1} stretch>
                    {dayContents}
                </Flex.Layout>
            </Flex.Layout>
        );

        return (
            <div style={{height: "100%", overflow: "auto"}}>
                <Flex.Layout ref="header" vertical>
                    <Flex.Layout horizontal>
                        <div style={{width: 60, borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor}}></div>
                        <Flex.Layout flex={1} stretch>{dateBars}</Flex.Layout>
                    </Flex.Layout>
                    <Flex.Layout horizontal>
                        <Flex.Layout center style={{width: 60}}></Flex.Layout>
                        <Flex.Layout flex={1} stretch>{fullDayEvents}</Flex.Layout>
                    </Flex.Layout>
                </Flex.Layout>
                <PerfectScroll ref="content" style={{bottom: 0, left: 0, right: 0, position: "absolute", borderTop: "1px solid " + this.context.muiTheme.palette.borderColor}} alwaysVisible>
                    {eventTable}
                </PerfectScroll>
            </div>
        );
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAllEvents()
        });
    },

    _scrollToNow() {
        let content = this.refs.content.getDOMNode();
        let scrollHeight = content.scrollHeight;
        let clientHeight = content.clientHeight;
        let elapsed = new Date().elapsedPercentageOfDay();
        let offsetTop = elapsed * scrollHeight;

        let scrollTop =  offsetTop - clientHeight / 2;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        content.scrollTop = scrollTop;
    }
});

module.exports = Events;