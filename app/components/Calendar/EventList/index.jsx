const React                = require("react"),
      MUI                  = require("material-ui"),
      Link                 = require("react-router").Link,
      Select               = require("../../Select").Select,
      SmartTimeDisplay     = require("../../SmartTimeDisplay"),
      FontIcon             = MUI.FontIcon,
      CalendarStore        = require("../../../stores/CalendarStore"),
      CalendarActions      = require("../../../actions/CalendarActions");

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            events: []
        }
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        CalendarActions.receive();
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAllEvents()
        });
    },

    render: function() {
        let eventsDOM = Object.keys(this.state.events).map((key, index) => {
            let direction = index % 2 === 0 ? "left" : "right";
            let dayEvents = [];
            let events = this.state.events[key];
            let dayDividerLabelClassName = "cal-day-divider-label " + direction;
            dayEvents.push(
                <div className="cal-day-divider">
                    <div className={dayDividerLabelClassName}>
                        <hr/>
                        <div className="cal-day-divider-label-content">{new Date(key).toDateString()}</div>
                    </div>
                </div>
            );
            dayEvents.push(events.map((event) => {
                let contentClass = "cal-event-content " + direction;
                let eventIconClass = "cal-event-icon";
                let now = new Date();
                let fromTime = new Date(event.from_time);
                let toTime = new Date(event.to_time);
                if (toTime < now) {
                    eventIconClass += " expired";
                } else if (now > fromTime && now < toTime) {
                    eventIconClass += " active";
                }
                return (
                    <div className="cal-event">
                        <div className="cal-event-icon-wrapper">
                            <div className={eventIconClass}>
                                <FontIcon className="icon-event"/>
                            </div>
                        </div>
                        <div className={contentClass}>
                            <div className="cal-event-title">{event.title}</div>
                            <div className="cal-event-time"><SmartTimeDisplay start={event.from_time} end={event.to_time} relative /></div>
                        </div>
                    </div>
                );
            }));
            return dayEvents;
        });
        return (
            <div>
                <div className="cal-event-wrapper">
                    {eventsDOM}
                </div>
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        className="add-event"
                        iconClassName="icon-add"/>
                </Link>
            </div>
        );
    }
});
