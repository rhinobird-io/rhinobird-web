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
const ResourceInfo = require('./ResourceInfo');
const PerfectScroll = require('../PerfectScroll');
const ResourceStore = require('../../stores/ResourceStore');

require("./style.less");

let ResourceDetailContent = React.createClass({
    propTypes: {
        resource: React.PropTypes.object
    },

    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
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
            activeRange: null,
            view: this.props.view
        }
    },
    componentDidMount() {
        if (this.state.view === 'detail')
            this._toggleResourceInfo();
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
                color: this.context.muiTheme.palette.canvasColor,
                backgroundColor: this.context.muiTheme.palette.primary1Color,
                whiteSpace:'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden'
            }
        };
        let dialogActions = [
            <MUI.FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleDeleteDialogCancel}/>,
            <MUI.FlatButton
                label="Delete"
                primary={true}
                onTouchTap={this._handleDeleteDialogSubmit}/>
        ];
        let actions = (<Flex.Layout flex={1} center horizontal style={styles.action}>{resource.name}
                        <Flex.Layout endJustified flex={1} center horizontal>
                            <MUI.IconButton ref="showDetails" onClick={this._toggleResourceInfo} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-details" />
                            <MUI.IconButton ref="showCalendar" onClick={this._toggleResourceInfo} style={{display: 'none'}} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-event-note"/>

                            {LoginStore.getUser() && LoginStore.getUser().id === resource.userId ?
                                <div>
                                    <MUI.IconButton onClick={this._editResource} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-edit"/>
                                    <MUI.IconButton onClick={this._deleteResource} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-delete"/>
                                    <MUI.Dialog actions={dialogActions} title="Deleting Resource" ref='deleteDialog'>
                                    Are you sure to delete this resource?
                                    </MUI.Dialog>
                                </div>
                                : ''
                            }

                        </Flex.Layout>
                </Flex.Layout>);
        return (
            <Flex.Layout vertical style={{height: "100%"}}>
                {actions}
                <ResourceInfo ref="resourceInfo" resource={resource}/>
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    data={resource.resourceBookings}
                    views={['day', 'week', 'fourDays']}
                    rangeContent={this._rangeContent}
                    awayExceptions={() => this.refs.resourceBooking.getDOMNode()}
                    onRangeCreate={this._showResourceBookingPopup}
                    onRangeCancel={this._dismissResourceBookingPopup}
                    onRangeClicked={this._showUpdateResourceBookingPopup} />
                {this._getCreateResourceBookingPopup()}
                {this._getUpdateResourceBookingPopup()}
                <MUI.Snackbar ref="bookingSuccess" message={`Booking ${resource.name} successfully`} />
                <MUI.Snackbar ref="deleteBookingSuccess" message={`Delete booking of ${resource.name} successfully`} />
                <MUI.Snackbar ref="updateBookingSuccess" message={`Update booking of ${resource.name} successfully`} />

            </Flex.Layout>
        );
    },

    _rangeContent(range) {
        let userId = range.userId;
        let user = UserStore.getUser(userId);
        let styles = {
            wrapper: {
                height: "100%",
                padding: "4px 6px"
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
                styles.wrapper.backgroundColor = muiTheme.palette.accent3Color;
                styles.wrapper.border = "1px solid " + muiTheme.palette.accent1Color;
                innerContent.push(<div>Booked By You</div>)
            } else {
                styles.wrapper.backgroundColor = muiTheme.palette.primary3Color;
                styles.wrapper.border = "1px solid " + muiTheme.palette.primary1Color;
                innerContent.push(<Flex.Layout key="member" flex={1} horizontal end selfEnd>
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
        let createResourceBookPopupPos = this.state.createResourceBookPopupPos;
        let selfAlignOrigin = "lt",
            relatedAlignOrigin = "rt";
        if (createResourceBookPopupPos === "r") {
            className += " right";
        } else if (createResourceBookPopupPos === "l") {
            className += " left";
        } else if (createResourceBookPopupPos === "t") {
            className += " top";
            selfAlignOrigin = "lb";
            relatedAlignOrigin = "lt";
        } else if (createResourceBookPopupPos === "b") {
            className += " bottom";
            selfAlignOrigin = "lt";
            relatedAlignOrigin = "lb";
        }
        return (
            <Popup
                noScrollX
                noScrollY
                position="none"
                ref="resourceBooking"
                selfAlignOrigin={selfAlignOrigin}
                relatedAlignOrigin={relatedAlignOrigin}
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
                            dismissCreateNewRange()}>Close</MUI.FlatButton>
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

        let updateResourceBookPopupPos = this.state.updateResourceBookPopupPos;
        let selfAlignOrigin = "lt",
            relatedAlignOrigin = "rt";
        if (updateResourceBookPopupPos === "r") {
            className += " right";
        } else if (updateResourceBookPopupPos === "l") {
            className += " left";
        } else if (updateResourceBookPopupPos === "t") {
            className += " top";
            selfAlignOrigin = "lb";
            relatedAlignOrigin = "lt";
        } else if (updateResourceBookPopupPos === "b") {
            className += " bottom";
            selfAlignOrigin = "lt";
            relatedAlignOrigin = "lb";
        }
        return (
            <Popup
                noScrollX
                noScrollY
                position="none"
                ref="updateResourceBooking"
                selfAlignOrigin={selfAlignOrigin}
                relatedAlignOrigin={relatedAlignOrigin}
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
                        <MUI.FlatButton secondary onClick={() => this.refs.updateResourceBooking.dismiss()}>Close</MUI.FlatButton>
                        <MUI.FlatButton secondary onClick={() => this._updateResourceBook()}>Update</MUI.FlatButton>
                        <MUI.FlatButton primary onClick={this._deleteResourceBook}>Delete</MUI.FlatButton>
                    </Flex.Layout>
                </div>
            </Popup>
        );
    },

    _bookResource() {
        let id = this.props.resource.id;
        let fromTime = this.refs.fromTime.getTime();
        let toTime = this.refs.toTime.getTime();
        ResourceActions.bookResource(id, fromTime, toTime, () => {
            this.refs.bookingSuccess.show();
            setTimeout(this.refs.bookingSuccess.dismiss, 2000);
            this.refs.calendar.dismissCreateNewRange();
        });
    },

    _deleteResourceBook() {
        ResourceActions.deleteResourceBook(this.props.resource.id, this.state.activeRange.id, () => {
            this.refs.updateResourceBooking.dismiss();
            this.refs.deleteBookingSuccess.show();
        });
    },

    _updateResourceBook() {
        ResourceActions.updateResourceBook(this.props.resource.id,
            this.state.activeRange.id,
            this.refs.bookFromTime.getTime(),
            this.refs.bookToTime.getTime(),
            () => {
            this.refs.updateResourceBooking.dismiss();
            this.refs.updateBookingSuccess.show();
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
            top: rect.top - (224 - rect.height) / 2,
            height: rect.height
        };

        let popupNode = resourceBooking.getDOMNode();
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
            createResourceBookPopupPos: position
        }, () => {
            resourceBooking.setRelatedTo(newRect);
            resourceBooking.show();

            this.refs.toTime.setTime(range.toTime);
            this.refs.fromTime.setTime(range.fromTime);
        });
    },

    _showUpdateResourceBookingPopup(rect, range) {
        if (range.userId != LoginStore.getUser().id) {
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
            top: rect.top - (224 - rect.height) / 2,
            height: rect.height
        };
        
        let popupNode = updateResourceBooking.getDOMNode();
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
            activeRange: range,
            updateResourceBookPopupPos: position
        }, () => {
            updateResourceBooking.setRelatedTo(newRect);
            updateResourceBooking.show();

            this.refs.bookToTime.setTime(new Date(range.toTime));
            this.refs.bookFromTime.setTime(new Date(range.fromTime));
        });
    },

    _deleteResource() {
        this.refs.deleteDialog.show();
    },

    _editResource() {
        this.context.router.transitionTo("edit-resource", {id: this.props.resource.id}, {origin: 'detail'});
    },

    _handleDeleteDialogCancel() {
        this.refs.deleteDialog.dismiss();
    },

    _handleDeleteDialogSubmit() {
        ResourceActions.deleteResource(this.props.resource.id, () => {
            this.context.router.transitionTo("resources");
        });
    },

    _toggleResourceInfo() {
        this.refs.resourceInfo.toggle();
        $(this.refs.calendar.getDOMNode()).toggle();
        $(this.refs.showCalendar.getDOMNode()).toggle();
        $(this.refs.showDetails.getDOMNode()).toggle();
    }

});

module.exports = ResourceDetailContent;