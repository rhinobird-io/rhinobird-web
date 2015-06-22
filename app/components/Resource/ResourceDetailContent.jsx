const React = require('react');
const Flex = require('../Flex');
const Popup = require('../Popup');
const MUI = require('material-ui');
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
                    onRectCancel={this._dismissResourceBookingPopup}>
                </CalendarView>
                <Popup
                    position="none"
                    ref="resourceBooking"
                    selfAlignOrigin="lt"
                    relatedAlignOrigin="rt"
                    className="resource-booking-popup"
                    onMouseDown={(e) => console.log(e.target)}
                    style={{overflow: "visible !important"}}>
                    <div style={{padding: 12, minWidth: 250}}>
                        <h3>Confirm Booking</h3>
                        <div style={{padding: 4}}>
                            <MUI.TimePicker
                                style={{marginTop: -20}}
                                format="ampm"
                                ref="fromTime"
                                hintText="From Time"
                                floatingLabelText="From Time" />
                            <MUI.TimePicker
                                style={{marginTop: -20}}
                                format="ampm"
                                ref="toTime"
                                hintText="To Time"
                                floatingLabelText="To Time" />
                            <Flex.Layout horizontal endJustified>
                                <MUI.FlatButton>Cancel</MUI.FlatButton>
                                <MUI.FlatButton primary>Create</MUI.FlatButton>
                            </Flex.Layout>
                        </div>
                    </div>
                </Popup>
            </Flex.Layout>
        );
    },

    _dismissResourceBookingPopup() {
        this.refs.resourceBooking.dismiss();
    },

    _showResourceBookingPopup(rect) {
        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top,
            height: rect.height
        }
        this.refs.resourceBooking.setRelatedTo(newRect);
        this.refs.resourceBooking.show();
    }
});

module.exports = ResourceDetailContent;