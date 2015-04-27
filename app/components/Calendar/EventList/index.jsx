const React                = require("react"),
      MUI                  = require("material-ui"),
      Link                 = require("react-router").Link,
      Select               = require("../../Select").Select,
      SmartTimeDisplay     = require("../../SmartTimeDisplay"),
      FontIcon             = MUI.FontIcon,
      FloatingActionButton = MUI.FloatingActionButton,
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
            let events = this.state.events[key];
            return events.map((event) => {
                let direction = index % 2 === 0 ? "left" : "right";
                let contentClass = "event-content " + direction;
                return (
                    <div className="event">
                        <div className="event-icon-wrapper">
                            <div className="event-icon">
                                <FontIcon className="icon-event"/>
                            </div>
                        </div>
                        <div className={contentClass}>
                            <div className="event-title">{event.title}</div>
                            <div className="event-time"><SmartTimeDisplay start={event.from_time} end={event.to_time} relative /></div>
                        </div>
                    </div>
                );
            });
        });
        return (
            <div>
                <div className="event-wrapper">
                    {eventsDOM}
                </div>
                <Link to="create-event">
                    <FloatingActionButton
                        className="add-event"
                        iconClassName="icon-add"/>
                </Link>
            </div>
        );
    }
});
