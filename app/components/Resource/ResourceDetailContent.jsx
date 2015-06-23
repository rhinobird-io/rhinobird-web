const React = require('react');
const Flex = require('../Flex');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Display = require('../Common').Display;
const WeekView = require('../Calendar/CommonComponents').WeekView;
const CalendarView = require('../Calendar/CommonComponents').CalendarView;

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
        return {}
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
            <Flex.Layout vertical style={{height: "100%"}}>
                {actions}
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    data={resource.resourceBookings}
                    awayExceptions={() => this.refs.resourceBooking.getDOMNode()}
                    onRectCreate={this._showResourceBookingPopup}
                    onRectCancel={this._dismissResourceBookingPopup} />
                <Popup
                    position="none"
                    ref="resourceBooking"
                    selfAlignOrigin="lt"
                    relatedAlignOrigin="rt"
                    className="resource-booking-popup"
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
                            <MUI.FlatButton secondary onClick={() => console.log("cancel")}>Cancel</MUI.FlatButton>
                            <MUI.FlatButton secondary>Create</MUI.FlatButton>
                        </Flex.Layout>
                    </div>
                </Popup>
            </Flex.Layout>
        );
    },

    _dismissResourceBookingPopup() {
        this.refs.resourceBooking.dismiss();
    },

    _showResourceBookingPopup(rect, range) {
        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top - (this.refs.resourceBooking.getDOMNode().clientHeight - rect.height) / 2,
            height: rect.height
        };

        let resourceBooking = this.refs.resourceBooking;

        resourceBooking.setRelatedTo(newRect);
        resourceBooking.show();

        this.refs.toTime.setTime(range.toTime);
        this.refs.fromTime.setTime(range.fromTime);
    }
});

module.exports = ResourceDetailContent;