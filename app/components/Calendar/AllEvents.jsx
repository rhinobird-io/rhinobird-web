const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Link = require('react-router').Link;
const Display = require('../Common').Display;
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const Colors = require('material-ui/lib/styles/colors.js');
const CalendarStore = require('../../stores/CalendarStore');
const CalendarActions = require('../../actions/CalendarActions');
const CalendarView = require('../Calendar/CommonComponents').CalendarView;

require('./style.less');

let AllEvents = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        this._fetchEvents(this.refs.calendar.getDate(), this.refs.calendar.getViewType());
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    getInitialState() {
        return {
            events: [],
            createEventPopupPos: 'r'
        }
    },

    render() {
        return (
            <Flex.Layout vertical style={{height: "100%", WebkitUserSelect: "none", userSelect: "none"}}>
                <CalendarView
                    ref="calendar"
                    withAllDay={true}
                    date={new Date()}
                    exclusive={false}
                    data={this.state.normalEvents}
                    rangeContent={this._rangeContent}
                    allDayData={this.state.allDayEvents}
                    onDateChange={this._handleDateChange}
                    onViewTypeChange={this._handleViewTypeChange}
                    monthRangeContent={this._monthRangeContent}
                    onRangeCreate={this._showCreateEventPopup}
                    onRangeClicked={this._showEventDetailPopup}
                    onRangeCancel={this._dismissCreateEventPopup}
                    allDayRangeContent={this._allDayRangeContent}
                    awayExceptions={() => this.refs.createEventPopup.getDOMNode()} />
                {this._getCreateEventPopup()}
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        style={{position: "fixed", bottom: 24, right: 24}}
                        iconClassName="icon-add" />
                </Link>
            </Flex.Layout>
        )
    },

    _fetchEvents(date, viewType) {
        if (viewType === "week") {
            CalendarActions.receiveByWeek(date);
        } else if (viewType === "month") {
            CalendarActions.receiveByMonth(date);
        } else if (viewType === "day") {
            CalendarActions.receiveByDay(date);
        } else if (viewType === "fourDays") {

        }
    },

    _handleViewTypeChange(date, viewType) {
        this._fetchEvents(date, viewType);
    },

    _handleDateChange(date, viewType) {
        this._fetchEvents(date, viewType);
    },

    _onChange() {
        let viewType = this.refs.calendar.getViewType();
        let events = [];
        let date = this.refs.calendar.getDate();
        console.log(viewType);
        if (viewType === "week") {
            events = CalendarStore.getEventsByWeek(date);
        } else if (viewType === "month") {
            events = CalendarStore.getEventsByCalendarMonth(date);
        } else if (viewType === "day") {
            events = CalendarStore.getEventsByDay(date);
        } else if (viewType === "fourDays") {
            events = CalendarStore.getEventsByFourDays(date);
        }

        let normalEvents = [];
        let allDayEvents = [];
        events.forEach(event => {
            if (event.full_day) {
                allDayEvents.push(event);
            } else {
                normalEvents.push(event);
            }
        });
        this.setState({
            allDayEvents: allDayEvents,
            normalEvents: normalEvents
        })
    },

    _allDayRangeContent(range) {
        let style = {
            height: "100%",
            width: "100%",
            padding: "0 4px",
            backgroundColor: Colors.pink100
        };
        return (
            <Flex.Layout center style={style}>{range.title}</Flex.Layout>
        );
    },

    _monthRangeContent(range) {
        return <div>{range.title}</div>;
    },

    _rangeContent(range) {
        let creatorId = range.creator_id;
        let user = UserStore.getUser(creatorId);
        let styles = {
            wrapper: {
                height: "100%",
                padding: "0 4px"
            },
            timeRange: {
                fontSize: "0.8em",
                fontWeight: 500
            }
        };

        let innerContent = [];
        let timeRange = `${Moment(range.from_time || range.fromTime).format("h:mm a")} ~ ${Moment(range.to_time || range.toTime).format("h:mm a")}`;

        innerContent.push(<div key="range" style={styles.timeRange}>{timeRange}</div>);

        let now = new Date();
        let toTime = new Date(range.to_time);
        if (user) {
            if (LoginStore.getUser().id === creatorId) {
                let background = null;
                if (toTime < now) {
                    background = Colors.pink100;
                } else {
                    background = this.context.muiTheme.palette.accent3Color;
                }
                styles.wrapper.backgroundColor = background;
                //styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.accent2Color;
                innerContent.push(<div>{range.title}</div>)
            } else {
                let background = null;
                if (toTime < now) {
                    background = Colors.cyan100;
                } else {
                    background = this.context.muiTheme.palette.primary1Color;
                }
                styles.wrapper.backgroundColor = background;
                //styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.primary2Color;

            }
        }

        return (
            <Flex.Layout vertical style={styles.wrapper}>
                {innerContent}
            </Flex.Layout>
        );
    },

    _getCreateEventPopup() {
        let className = "event-popup";
        let createEventPopupPos = this.state.createEventPopupPos;
        let selfAlignOrigin = "lt",
            relatedAlignOrigin = "rt";
        if (createEventPopupPos === "r") {
            className += " right";
        } else if (createEventPopupPos === "l") {
            className += " left";
        } else if (createEventPopupPos === "t") {
            className += " top";
            selfAlignOrigin = "lb";
            relatedAlignOrigin = "lt";
        } else if (createEventPopupPos === "b") {
            className += " bottom";
            selfAlignOrigin = "lt";
            relatedAlignOrigin = "lb";
        }

        return (
            <Popup
                position="none"
                ref="createEventPopup"
                selfAlignOrigin={selfAlignOrigin}
                relatedAlignOrigin={relatedAlignOrigin}
                className={className}
                style={{overflow: "visible !important"}}>
                <div style={{minWidth: 250}}>
                    <h3 style={{padding: "24px 24px 20px 24px"}}>
                        <Display type="headline">Create </Display>
                    </h3>
                </div>
            </Popup>
        );
    },

    _showCreateEventPopup(rect, range) {
        let createEventPopup = this.refs.createEventPopup;
        let position = 'r';

        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top,
            height: rect.height
        };

        let popupNode = createEventPopup.getDOMNode();
        if (popupNode.clientWidth < window.innerWidth - rect.right) {
            position = 'r';
            newRect.top = rect.top - (createEventPopup.getDOMNode().clientHeight - rect.height) / 2;
        } else if (popupNode.clientWidth < rect.left) {
            position = 'l';
            newRect.width = rect.width;
            newRect.left = rect.left - 10;
            newRect.top = rect.top - (createEventPopup.getDOMNode().clientHeight - rect.height) / 2;
        } else if (popupNode.clientHeight < rect.top) {
            position = 't';
            newRect.top = rect.top - 10;
            newRect.left = rect.left + (newRect.width - popupNode.clientWidth) / 2;
        } else if (popupNode.clientHeight < window.innerHeight - rect.bottom) {
            position = 'b';
            newRect.height = rect.height + 10;
            newRect.left = rect.left + (newRect.width - popupNode.clientWidth) / 2;
        }

        console.log(position);
        this.setState({
            createEventPopupPos: position
        }, () => {
            createEventPopup.setRelatedTo(newRect);
            createEventPopup.show();
        });
    },

    _dismissCreateEventPopup() {
        this.refs.createEventPopup.dismiss();
    },

    _showEventDetailPopup(rect, range) {
        if (range.userId !== LoginStore.getUser().id) {
            return;
        }
    }
});

module.exports = AllEvents;
