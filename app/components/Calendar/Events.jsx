const React = require('react');
const CalendarStore = require("../../stores/CalendarStore");
const CalendarActions = require("../../actions/CalendarActions");
const DayView = require('./EventViews/DayView');
const Moment = require('moment');
const Flex = require('../Flex');
const PerfectScroll = require('../PerfectScroll');
const TimeBar = require('../Calendar/CommonComponents').TimeBar;
const DaysHeader = require('../Calendar/CommonComponents').DaysHeader;

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
                color: muiTheme.palette.textColor,
                backgroundColor: muiTheme.palette.primary1Color,
                border: "1px solid " + muiTheme.palette.primary2Color
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
        this.refs.content.getDOMNode().style.top = this.refs.header.getDOMNode().offsetHeight + "px";
        this._scrollToNow();
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
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + muiTheme.palette.borderColor
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

            dateBars = <DaysHeader dates={days} />

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
                        <div style={{width: 60, borderBottom: "1px solid " + muiTheme.palette.borderColor}}></div>
                        {dateBars}
                    </Flex.Layout>
                    <Flex.Layout horizontal>
                        <Flex.Layout center style={{width: 60}}></Flex.Layout>
                        <Flex.Layout flex={1} stretch>{fullDayEvents}</Flex.Layout>
                    </Flex.Layout>
                </Flex.Layout>
                <PerfectScroll ref="content" style={{bottom: 0, left: 0, right: 0, position: "absolute", borderTop: "1px solid " + muiTheme.palette.borderColor}} alwaysVisible>
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