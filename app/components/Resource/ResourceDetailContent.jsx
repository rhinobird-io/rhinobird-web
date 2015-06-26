const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Member = require('../Member');
const Display = require('../Common').Display;
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const WeekView = require('../Calendar/CommonComponents').WeekView;
const CalendarView = require('../Calendar/CommonComponents').CalendarView;
const ResourceActions = require('../../actions/ResourceActions');
require("./style.less");

let ResourceDetailContent = React.createClass({
    propTypes: {
        resource: React.PropTypes.object
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            resource: {}
        }
    },

    getInitialState() {
        return {
            createResourceBookPopupPos: "r",
            updateResourceBookPopupPos: "r",
            activeRange: null
        }
    },

    render() {
        let {
            resource
        } = this.props;

        let styles = {
            action: {
                fontSize: "2em",
                padding: 12,
                minHeight: 60,
                maxHeight: 60,
                backgroundColor: this.context.muiTheme.palette.primary1Color
            }
        };

        let actions = <Flex.Layout flex={1} center horizontal style={styles.action}>{resource.name}</Flex.Layout>;
        return (
            <Flex.Layout vertical style={{height: "100%", WebkitUserSelect: "none", userSelect: "none"}}>
                {actions}
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    data={resource.resourceBookings}
                    rangeContent={this._rangeContent}
                    awayExceptions={() => this.refs.resourceBooking.getDOMNode()}
                    onRangeCreate={this._showResourceBookingPopup}
                    onRangeCancel={this._dismissResourceBookingPopup}
                    onRangeClicked={this._showUpdateResourceBookingPopup} />
                {this._getCreateResourceBookingPopup()}
                {this._getUpdateResourceBookingPopup()}
                <MUI.Snackbar ref="bookingSuccess" message={`Booking ${resource.name} successfully`} />
                <MUI.Snackbar ref="deleteBookingSuccess" message={`Delete booking of ${resource.name} successfully`} />
            </Flex.Layout>
        );
    },

    _rangeContent(range) {
        let userId = range.userId;
        let user = UserStore.getUser(userId);
        let styles = {
            wrapper: {
                height: "100%",
                padding: 6
            },
            timeRange: {
                fontSize: "0.8em",
                fontWeight: 500
            }
        };

        let innerContent = [];
        let timeRange = `${Moment(range.fromTime).format("h:mm a")} ~ ${Moment(range.toTime).format("h:mm a")}`;

        innerContent.push(<div key="range" style={styles.timeRange}>{timeRange}</div>);

        if (user) {
            if (LoginStore.getUser().id === userId) {
                styles.wrapper.backgroundColor = this.context.muiTheme.palette.accent3Color;
                styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.accent1Color;
                innerContent.push(<div>Booked By You</div>)
            } else {
                styles.wrapper.backgroundColor = this.context.muiTheme.palette.primary3Color;
                styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.primary1Color;
                innerContent.push(<Flex.Layout key="member" flex={1} horizontal end>
                    <Member.Avatar member={user} style={{minWidth: 24, marginRight: 6}}/>
                    <div>{user.realname}</div>
                </Flex.Layout>);
            }
        }

        return (
            <Flex.Layout vertical style={styles.wrapper}>
                {innerContent}
            </Flex.Layout>
        );
    },

    _getCreateResourceBookingPopup() {
        let className = "resource-booking-popup";
        if (this.state.createResourceBookPopupPos === 'r') {
            className += " right";
        } else {
            className += " left";
        }
        return (
            <Popup
                position="none"
                ref="resourceBooking"
                selfAlignOrigin="lt"
                relatedAlignOrigin="rt"
                className={className}
                onMouseDown={(e) => console.log(e.target)}
                style={{overflow: "visible !important"}}>
                <div style={{minWidth: 250}}>
                    <h3 style={{padding: "24px 24px 20px 24px"}}><Display type="headline">Confirm Booking</Display></h3>
                    <div style={{padding: "0 24px"}}>
                        <MUI.TimePicker
                            style={{marginTop: -24, zIndex: 1}}
                            format="ampm"
                            ref="fromTime"
                            hintText="From Time"
                            onChange={(e, v) => this._handleResourceBookingFromTimeChange(v)}
                            floatingLabelText="From Time" />
                        <MUI.TimePicker
                            style={{marginTop: -24}}
                            format="ampm"
                            ref="toTime"
                            hintText="To Time"
                            onChange={(e, v) => this._handleResourceBookingToTimeChange(v)}
                            floatingLabelText="To Time" />
                    </div>
                    <Flex.Layout style={{padding: "8px 8px 8px 24px"}} horizontal endJustified>
                        <MUI.FlatButton secondary onClick={() => this.refs.calendar.
                            dismissCreateNewRange()}>Cancel</MUI.FlatButton>
                        <MUI.FlatButton secondary onClick={() => this._bookResource()}>Book</MUI.FlatButton>
                    </Flex.Layout>
                </div>
            </Popup>
        );
    },

    _handleResourceBookingFromTimeChange(v) {
        let fromTime = v;
        let toTime = this.refs.toTime.getTime();
        if (toTime < fromTime) {
            toTime = fromTime;
        }
        this.refs.calendar.updateNewRange({
            toTime: toTime,
            fromTime: fromTime
        });
    },

    _handleResourceBookingToTimeChange(v) {
        let toTime = v;
        let fromTime = this.refs.fromTime.getTime();
        if (toTime < fromTime) {
            toTime = fromTime;
        }
        this.refs.calendar.updateNewRange({
            toTime: toTime,
            fromTime: fromTime
        });
    },

    _getUpdateResourceBookingPopup() {
        let className = "resource-booking-popup";
        if (this.state.updateResourceBookPopupPos === 'r') {
            className += " right";
        } else {
            className += " left";
        }

        return (
            <Popup
                position="none"
                ref="updateResourceBooking"
                selfAlignOrigin="lt"
                relatedAlignOrigin="rt"
                className={className}
                style={{overflow: "visible !important"}}>
                <div style={{minWidth: 250}}>
                    <h3 style={{padding: "24px 24px 20px 24px"}}>
                        <Display type="headline">Update Booking</Display>
                    </h3>
                    <div style={{padding: "0 24px"}}>
                        <MUI.TimePicker
                            style={{marginTop: -24, zIndex: 1}}
                            format="ampm"
                            ref="bookFromTime"
                            hintText="From Time"
                            floatingLabelText="From Time" />
                        <MUI.TimePicker
                            style={{marginTop: -24}}
                            format="ampm"
                            ref="bookToTime"
                            hintText="To Time"
                            floatingLabelText="To Time" />
                    </div>
                    <Flex.Layout style={{padding: "8px 8px 8px 24px"}} horizontal endJustified>
                        <MUI.FlatButton secondary onClick={() => this.refs.updateResourceBooking.dismiss()}>Cancel</MUI.FlatButton>
                        <MUI.FlatButton secondary>Update</MUI.FlatButton>
                        <MUI.FlatButton primary onClick={this._deleteResourceBook}>Delete</MUI.FlatButton>
                    </Flex.Layout>
                </div>
            </Popup>
        );
    },

    _bookResource() {
        let id = this.props.resource._id;
        let fromTime = this.refs.fromTime.getTime();
        let toTime = this.refs.toTime.getTime();
        ResourceActions.bookResource(id, fromTime, toTime, () => {
            this.refs.bookingSuccess.show();
            setTimeout(this.refs.bookingSuccess.dismiss, 2000);
            this.refs.calendar.dismissCreateNewRange();
        });
    },

    _deleteResourceBook() {
        ResourceActions.deleteResourceBook(this.props.resource._id, this.state.activeRange._id, () => {
            this.refs.updateResourceBooking.dismiss();
            this.refs.deleteBookingSuccess.show();
        });
    },

    _dismissResourceBookingPopup() {
        this.refs.resourceBooking.dismiss();
    },

    _showResourceBookingPopup(rect, range) {
        let resourceBooking = this.refs.resourceBooking;
        let position = 'r';

        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top - (resourceBooking.getDOMNode().clientHeight - rect.height) / 2,
            height: rect.height
        };

        if (resourceBooking.getDOMNode().clientWidth > window.innerWidth - rect.right) {
            position = 'l';
            newRect.width = rect.width;
            newRect.left = rect.left - 10;
        }

        this.setState({
            createResourceBookPopupPos: position
        }, () => {
            resourceBooking.setRelatedTo(newRect);
            resourceBooking.show();

            this.refs.toTime.setTime(range.toTime);
            this.refs.fromTime.setTime(range.fromTime);
        });
    },

    _showUpdateResourceBookingPopup(rect, range) {
        if (range.userId !== LoginStore.getUser().id) {
            return;
        }
        let updateResourceBooking = this.refs.updateResourceBooking;

        if (updateResourceBooking.isShown()) {
            return;
        }
        let position = 'r';

        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top - (updateResourceBooking.getDOMNode().clientHeight - rect.height) / 2,
            height: rect.height
        };

        if (updateResourceBooking.getDOMNode().clientWidth > window.innerWidth - rect.right) {
            position = 'l';
            newRect.width = rect.width;
            newRect.left = rect.left - 10;
        }

        this.setState({
            activeRange: range,
            updateResourceBookPopupPos: position
        }, () => {
            updateResourceBooking.setRelatedTo(newRect);
            updateResourceBooking.show();

            this.refs.bookToTime.setTime(new Date(range.toTime));
            this.refs.bookFromTime.setTime(new Date(range.fromTime));
        });
    }
});

module.exports = ResourceDetailContent;