const React                = require("react"),
      MUI                  = require("material-ui"),
      Moment               = require("moment"),
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
            events: {},
            eventRange: {},
            hasMoreNewerEvents: true,
            hasMoreOlderEvents: true
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
            events: CalendarStore.getAllEvents(),
            eventRange: CalendarStore.getEventTimeRage(),
            hasMoreNewerEvents: CalendarStore.hasMoreNewerEvents(),
            hasMoreOlderEvents: CalendarStore.hasMoreOlderEvents()
        });
    },

    _loadMoreNewerEvents() {
        let eventRange = this.state.eventRange;
        console.log(eventRange.max);
        if (eventRange.max && this.state.hasMoreNewerEvents) {
            CalendarActions.loadMoreNewerEvents(eventRange.max);
        }
    },

    _loadMoreOlderEvents() {
        let eventRange = this.state.eventRange;
        if (eventRange.min && this.state.hasMoreOlderEvents) {
            CalendarActions.loadMoreOlderEvents(eventRange.min);
        }
    },

    render: function() {
        let eventsDOM = Object.keys(this.state.events).sort().map((key, index) => {
            let direction = index % 2 === 0 ? "left" : "right";

            let dayEvents = [];
            let events = this.state.events[key];

            let dayDividerClass = "cal-event";
            if (index === 0) {
                dayDividerClass += " first";
            }

            dayEvents.push(
                <div className={dayDividerClass}>
                    <div className="cal-day-divider-label">
                        <label>{Moment(key).format("M/D")}</label>
                    </div>
                </div>
            );

            dayEvents.push(events.map((event) => {
                let contentClass = "cal-event-content " + direction;
                let eventIconClass = "cal-event-icon";
                let now = new Date();
                let fromTime = new Date(event.from_time);
                let toTime = event.to_time ? new Date(event.to_time) : fromTime;
                if (toTime < now) {
                    eventIconClass += " expired";
                } else if (now > fromTime && now < toTime) {
                    eventIconClass += " active";
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
                                        <SmartTimeDisplay
                                            relative
                                            end={event.to_time}
                                            start={event.from_time} />
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

        let noMoreOlderEvents =
            !this.state.hasMoreOlderEvents ?
                <div className="cal-event-no-more">No more events.</div> : null;

        let noMoreNewerEvents =
            !this.state.hasMoreNewerEvents ?
                <div className="cal-event-no-more">No more events.</div> : null;

        return (
            <PerfectScroll className="cal-event-list">
                <InfiniteScroll
                    lowerThreshold={100}
                    upperThreshold={100}
                    onUpperTrigger={() => this._loadMoreOlderEvents()}
                    onLowerTrigger={() => this._loadMoreNewerEvents()}
                    scrollTarget={() => this.getDOMNode()} />
                {noMoreOlderEvents}
                <div className="cal-event-wrapper">
                    {eventsDOM}
                </div>
                {noMoreNewerEvents}
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        className="add-event"
                        iconClassName="icon-add" />
                </Link>
            </PerfectScroll>
        );
    }
});
