const React = require('react');
const Flex = require('../Flex');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Display = require('../Common').Display;
const UserStore = require('../../stores/UserStore');
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
            updateResourceBookPopupPos: "r"
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
            </Flex.Layout>
        );
    },

    _rangeContent(range) {

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
                            floatingLabelText="From Time" />
                        <MUI.TimePicker
                            style={{marginTop: -24}}
                            format="ampm"
                            ref="toTime"
                            hintText="To Time"
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
                        <MUI.FlatButton secondary>Cancel</MUI.FlatButton>
                        <MUI.FlatButton secondary>Update</MUI.FlatButton>
                        <MUI.FlatButton primary>Delete</MUI.FlatButton>
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
        let updateResourceBooking = this.refs.updateResourceBooking;
        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top - (updateResourceBooking.getDOMNode().clientHeight - rect.height) / 2,
            height: rect.height
        };

        updateResourceBooking.setRelatedTo(newRect);
        updateResourceBooking.show();

        this.refs.bookToTime.setTime(new Date(range.toTime));
        this.refs.bookFromTime.setTime(new Date(range.fromTime));
    }
});

module.exports = ResourceDetailContent;