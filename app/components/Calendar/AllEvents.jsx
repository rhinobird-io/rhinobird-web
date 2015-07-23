const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Link = require('react-router').Link;
const Display = require('../Common').Display;
const MemberSelect = require('../Member').MemberSelect;
const UserStore = require('../../stores/UserStore');
const EventManagement = require('./EventManagement');
const LoginStore = require('../../stores/LoginStore');
const Colors = require('material-ui/lib/styles/colors.js');
const CalendarStore = require('../../stores/CalendarStore');
const CalendarActions = require('../../actions/CalendarActions');
const CalendarView = require('../Calendar/CommonComponents').CalendarView;
const ReactTransitionGroup = React.addons.TransitionGroup;

require('jquery.transit');
require('./style.less');

var Drawer = React.createClass({
    getInitialState: function() {
        return {
            open: false
        };
    },
    componentWillMount: function() {
        this.setState({
            open: this.props.open
        });
    },
    componentWillReceiveProps: function(props) {
        this.setState({
            open: props.open
        });
    },
    open: function() {
        this.setState({
            open: true
        });
    },
    close: function() {
        this.setState({
            open: false
        });
    },
    toggle: function() {
        this.setState({
            open: !this.state.open
        });
    },
    render: function() {
        return (
            <ReactTransitionGroup transitionName="test" component="div">
                {this.state.open && <DrawerInner key="content" className={this.props.className} start={this.props.start} style={this.props.style}>{this.props.children}</DrawerInner>}
            </ReactTransitionGroup>
        );
    }
});

var DrawerInner = React.createClass({
    componentWillEnter: function(cb) {
        var $el = $(this.getDOMNode());
        let startPos = this.props.start;
        $el.stop(true).css(startPos).animate({height:600,width:500,position:"fixed",top:"50%", marginTop:-300,left:"50%",marginLeft:-250}, 250, cb);
    },

    componentWillLeave: function(cb) {
        var $el = $(this.getDOMNode());
        let startPos = this.props.start;
        startPos.position = "fixed";
        startPos.marginTop = 0;
        startPos.marginLeft = 0;

        $el.stop(true).css({height:600,width:500,position:"fixed",top:"50%", marginTop:-300,left:"50%",marginLeft:-250}).animate(startPos, 250, cb);
    },

    render: function() {
        return (
            <div className={this.props.className} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
});

let STATUS_NORMAL = 0;
let STATUS_EVENT_VIEW = 1;
let STATUS_EVENT_UPDATE = 2;
let STATUS_EVENT_CREATE = 3;

let AllEvents = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

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
            members: {
                users: [],
                teams: []
            },
            status: STATUS_NORMAL,
            showUpdatePopup: false,
            showDetailPopup: false,
            showCreatePopup: false,
            createEventPopupPos: 'r',
            showDetailAnimationStart: null
        }
    },

    render() {
        let drawerClass = "drawer";
        if (this.state.status === STATUS_EVENT_UPDATE) {
            //drawerClass += " rotateZ";
        }
        return (
            <Flex.Layout vertical style={{height: "100%"}}>
                <CalendarView
                    ref="calendar"
                    withAllDay={true}
                    date={new Date()}
                    exclusive={false}
                    data={this.state.normalEvents}
                    rangeContent={this._rangeContent}
                    allDayData={this.state.allDayEvents}
                    onDateChange={this._handleDateChange}
                    crossDayData={this.state.crossDayEvents}
                    onViewTypeChange={this._handleViewTypeChange}
                    monthRangeContent={this._monthRangeContent}
                    onRangeCreate={this._showCreateEventPopup}
                    onRangeClicked={this._showEventDetailPopup}
                    onRangeCancel={this._dismissCreateEventPopup}
                    allDayRangeContent={this._allDayRangeContent}
                    awayExceptions={() => this.refs.createEventPopup.getDOMNode()} />
                {this._getCreateEventPopup()}
                {this.state.status !== STATUS_NORMAL && <div className="backdrop" onClick={this._dismissEventDetailPopup}></div>}
                <Drawer
                    ref="drawer"
                    className={drawerClass}
                    start={this.state.showDetailAnimationStart}
                    open={(this.state.status !== STATUS_NORMAL)}
                    style={{zIndex: 1001, position: "fixed", top: 0, left: 0}}>
                    {this.state.status !== STATUS_NORMAL && this._getEventManagementPopup(this.state.currentShownEvent)}
                </Drawer>
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        style={{position: "fixed", bottom: 24, right: 24}}
                        iconClassName="icon-add" />
                </Link>

                <MUI.Snackbar ref="updateEventSuccess" message={`The event has been updated.`} />
            </Flex.Layout>
        )
    },

    _fetchEvents(date, viewType) {
        console.log("viewType " + viewType);
        console.log("date " + date);
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
        let crossDayEvents = [];
        events.forEach(event => {
            let to = new Date(event.to_time);
            let from = new Date(event.from_time);
            if (to.toDateString() === from.toDateString()) {
                if (event.full_day) {
                    allDayEvents.push(event);
                } else {
                    normalEvents.push(event);
                }
            } else {
                crossDayEvents.push(event);
            }
        });

        this.setState({
            allDayEvents: allDayEvents,
            normalEvents: normalEvents,
            crossDayEvents: crossDayEvents
        });
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
                padding: "0 4px",
                fontSize: "0.8em"
            },
            timeRange: {
                fontWeight: 500
            }
        };

        let innerContent = [];
        let timeRange = `${Moment(range.from_time || range.fromTime).format("h:mm a")} ~ ${Moment(range.to_time || range.toTime).format("h:mm a")}`;

        innerContent.push(<div key="range" style={styles.timeRange}>{timeRange}</div>);
		innerContent.push(<div>{range.title}</div>)

        let now = new Date();
        let toTime = new Date(range.to_time);
        if (user) {
            if (LoginStore.getUser().id === creatorId) {
                let background = null;
                if (toTime < now) {
                    background = Colors.pink100;
                } else {
                    background = muiTheme.palette.accent3Color;
                }
                styles.wrapper.backgroundColor = background;
                //styles.wrapper.border = "1px solid " + muiTheme.palette.accent2Color;
            } else {
                let background = null;
                if (toTime < now) {
                    background = Colors.cyan100;
                } else {
                    background = muiTheme.palette.primary1Color;
                }
                styles.wrapper.backgroundColor = background;
                styles.wrapper.border = "1px solid " + muiTheme.palette.primary2Color;
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
                style={{overflow: "visible !important", width: "320px"}}>
                <div style={{padding: "12px 16px"}}>
                    <Flex.Layout horizontal justified>
                        <MUI.TimePicker
                            style={{width: 100}}
                            format="ampm"
                            ref="fromTime"
                            hintText="From Time"
                            floatingLabelText="From Time" />
                        <MUI.TimePicker
                            style={{width: 100}}
                            format="ampm"
                            ref="toTime"
                            hintText="To Time"
                            floatingLabelText="To Time" />
                    </Flex.Layout>
                    <MUI.TextField errorText={this.state.titleError} hintText="Title" ref="title" floatingLabelText="Title" fullWidth />
                    <MemberSelect
                        ref="participants"
                        hintText="Participants"
                        floatingLabelText="Participants"
                        valueLink={this.linkState('members')}
                        style={{width: "100%"}} />
                    <Flex.Layout style={{padding: "8px 8px 0px 24px"}} horizontal endJustified>
                        <MUI.FlatButton secondary onClick={() => this.refs.calendar.dismissCreateNewRange()}>Close</MUI.FlatButton>
                        <MUI.FlatButton primary>Edit</MUI.FlatButton>
                        <MUI.FlatButton secondary onClick={this._createEvent}>Create</MUI.FlatButton>
                    </Flex.Layout>
                </div>
            </Popup>
        );
    },

    _createEvent(e) {
        e.preventDefault();
        let refs = this.refs;

        let title = refs.title.getValue();
        let event = {};
        event.title = title;

        if (title.length === 0) {
            this.setState({titleError: "Event title is required."});
            return;
        } else {
            this.setState({titleError: ""});
        }
        event.fromTime = this.refs.fromTime.getTime();
        event.toTime = this.refs.toTime.getTime();
        event.fromDate = event.fromTime;
        event.toDate = event.toTime;
        event.isPeriod = true;
        event.participants = this.state.members;
        
        CalendarActions.create(event, () => {
            this.refs.createEventPopup.dismiss();
            this.refs.calendar.dismissCreateNewRange();
        });
    },

    _getEventManagementPopup(event) {
        let status = this.state.status;
        let type = "";
        if (status === STATUS_EVENT_CREATE) {
            type = "create";
        } else if (status === STATUS_EVENT_VIEW) {
            type = "view";
        } else if (status === STATUS_EVENT_UPDATE) {
            type = "update";
        }
        return (
            <div key="detailPopup" ref="eventManagement" style={{zIndex:1001, height: "100%"}}>
                <EventManagement
                    type={type}
                    event={event}
                    onEditClick={this._handleEventDetailEditClick}
                    onUpdateSuccess={this._handleEventUpdateSuccess} />
            </div>
        );
    },

    _handleEventUpdateSuccess() {
        this.refs.updateEventSuccess.show();
        this._dismissEventDetailPopup();
    },

    _handleEventDetailEditClick() {
        $(this.refs.eventManagement.getDOMNode()).transition({
            transform: "rotateY(180deg)"
        }, 600, () => {
            $(this.refs.eventManagement.getDOMNode()).transition({
                transform: "initial"
            }, 750);
        });
        this.setState({
            status: STATUS_EVENT_UPDATE
        });

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
        if (popupNode.clientWidth < window.innerWidth - rect.right - 10) {
            position = 'r';
            newRect.top = rect.top - (188 - rect.height) / 2;
        } else if (popupNode.clientWidth < rect.left) {
            position = 'l';
            newRect.width = rect.width;
            newRect.left = rect.left - 10;
            newRect.top = rect.top - (188 - rect.height) / 2;
        } else if (popupNode.clientHeight < rect.top) {
            position = 't';
            newRect.top = rect.top - 10;
            newRect.left = rect.left + (newRect.width - popupNode.clientWidth) / 2;
        } else if (popupNode.clientHeight < window.innerHeight - rect.bottom) {
            position = 'b';
            newRect.height = rect.height + 10;
            newRect.left = rect.left + (newRect.width - popupNode.clientWidth) / 2;
        }

        this.setState({
            createEventPopupPos: position
        }, () => {
            this.refs.toTime.setTime(range.toTime);
            this.refs.fromTime.setTime(range.fromTime);
            createEventPopup.setRelatedTo(newRect);
            createEventPopup.show();
        });
    },

    _dismissCreateEventPopup() {
        this.refs.createEventPopup.dismiss();
    },

    _showEventDetailPopup(rect, range) {
        if (range.userId !== LoginStore.getUser().id) {
            //return;
        }
        this.setState({
            showDetailAnimationStart: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            },
            currentShownEvent: range,
            status: STATUS_EVENT_VIEW
        });
    },

    _dismissEventDetailPopup() {
        this.setState({
            status: STATUS_NORMAL
        });
    }
});

module.exports = AllEvents;
