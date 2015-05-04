const React                = require("react"),
      MUI                  = require("material-ui"),
      Layout               = require("../../Flex").Layout,
      Link                 = require("react-router").Link,
      Select               = require("../../Select").Select,
      SmartTimeDisplay     = require("../../SmartTimeDisplay"),
      CalendarStore        = require("../../../stores/CalendarStore"),
      CalendarActions      = require("../../../actions/CalendarActions"),
      PerfectScroll        = require('../../PerfectScroll'),
      InfiniteScroll       = require('../../InfiniteScroll');

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

    _loadMoreNewerEvents() {
        CalendarActions.loadMoreNewerEvents();
    },

    _loadMoreOlderEvents() {
        CalendarActions.loadMoreOlderEvents();
    },

    render: function() {
        let eventsDOM = Object.keys(this.state.events).sort().map((key, index) => {
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
                    eventIconClass += " <active></active>";
                }

                return (
                    <div className="cal-event">
                        <div className="cal-event-icon-wrapper">
                            <div className={eventIconClass}>
                                <MUI.FontIcon className="icon-event"/>
                            </div>
                        </div>
                        <div className={contentClass}>
                            <div className="cal-event-content-inner">
                                <div className="cal-event-title">
                                    <Layout horizontal justified>
                                        <span>{event.title}</span>
                                        <span title="Event Members" className="cal-event-member icon-group"></span>
                                    </Layout>
                                    <div className="cal-event-time">
                                        <SmartTimeDisplay start={event.from_time} end={event.to_time} relative />
                                    </div>
                                </div>
                                <div className="cal-event-detail">
                                    {event.description}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }));
            return dayEvents;
        });
        return (
            <PerfectScroll className="cal-event-list">
                <div className="cal-event-wrapper">
                    <InfiniteScroll
                        lowerThreshold={10}
                        upperThreshold={10}
                        onUpperTrigger={() => this._loadMoreOlderEvents()}
                        onLowerTrigger={() => this._loadMoreNewerEvents()}
                        scrollTarget={() => this.getDOMNode().parentNode} />
                    {eventsDOM}
                </div>
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        className="add-event"
                        iconClassName="icon-add"/>
                </Link>
            </PerfectScroll>
        );
    }
});
