const React                = require("react"),
      MUI                  = require("material-ui"),
      Moment               = require("moment"),
      Flex                 = require("../../Flex"),
      Link                 = require("react-router").Link,
      DropDownAny          = require("../../DropDownAny"),
      Select               = require("../../Select").Select,
      Avatar               = require("../../Member").Avatar,
      SmartTimeDisplay     = require("../../SmartTimeDisplay"),
      CalendarStore        = require("../../../stores/CalendarStore"),
      CalendarActions      = require("../../../actions/CalendarActions"),
      UserStore            = require("../../../stores/UserStore"),
      PerfectScroll        = require('../../PerfectScroll'),
      InfiniteScroll       = require('../../InfiniteScroll');

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            events: CalendarStore.getAllEvents() || {},
            eventRange: CalendarStore.getEventTimeRange(),
            hasReceived: CalendarStore.hasReceived(),
            hasMoreNewerEvents: CalendarStore.hasMoreNewerEvents(),
            hasMoreOlderEvents: CalendarStore.hasMoreOlderEvents(),
            newCreated: CalendarStore.getNewCreated()
        }
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        if (!this.state.hasReceived) {
            let container = this.getDOMNode();
            CalendarActions.receive(() => container.scrollTop = (container.scrollHeight - container.clientHeight) / 2);
        }

        if (this.refs.newCreated) {
            let self = this.getDOMNode();
            let newCreated = this.refs.newCreated.getDOMNode();
            let offsetTop = 0, offsetParent = newCreated;
            while (offsetParent !== self && offsetParent !== null) {
                offsetTop += offsetParent.offsetTop;
                offsetParent = offsetParent.offsetParent;
            }
            self.scrollTop = offsetTop + newCreated.offsetHeight - self.offsetHeight + 20;
        }
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAllEvents(),
            eventRange: CalendarStore.getEventTimeRange(),
            hasReceived: CalendarStore.hasReceived(),
            hasMoreNewerEvents: CalendarStore.hasMoreNewerEvents(),
            hasMoreOlderEvents: CalendarStore.hasMoreOlderEvents(),
            newCreated: CalendarStore.getNewCreated()
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

            let container = this.getDOMNode();
            let oldScrollHeight = container.scrollHeight;
            CalendarActions.loadMoreOlderEvents(eventRange.min, () => container.scrollTop = container.scrollHeight - oldScrollHeight);
        }
    },

    render: function() {
        let eventKeys = Object.keys(this.state.events).sort();
        let eventsDOM = eventKeys.map((key, index) => {
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
                        <span>{Moment.weekdaysShort()[Moment(key).day()]}</span>
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

                let ref = event.id.toString() === this.state.newCreated ? "newCreated" : undefined;
                let contentInnerClass = "cal-event-content-inner";
                if (event.id.toString() === this.state.newCreated) {
                    contentInnerClass += " highlight";
                }

                let control = <span title="Event Members" className="cal-event-member icon-group"></span>;
                let menu = event.participants.map((p) => {
                    let u = UserStore.getUser(p.id);
                    return <Flex.Layout key={u.id} horizontal>
                        <Avatar member={u} style={{borderRadius: "50%"}} /> &ensp;&ensp;
                        <span style={{fontWeight: 500}}>{u.name}</span>
                    </Flex.Layout>;
                });

                let teamMenu = event.team_participants.map(t => {
                    let t = UserStore.getTeam(t.id);
                    return <Flex.Layout key={t.id} horizontal>
                        <Avatar member={t} style={{borderRadius: "50%"}} /> &ensp;&ensp;
                        <span style={{fontWeight: 500}}>{t.name}</span>
                    </Flex.Layout>;
                });

                if (menu.length === 0) {
                    menu = teamMenu;
                } else if (teamMenu.length !== 0) {
                    //menu = menu.concat(<hr style={{margin: 4}}/>);
                    menu = menu.concat(teamMenu);
                }
                return (
                    <div ref={ref} className="cal-event">
                        <div className={eventIconClass}>
                            <span style={{fontSize: 20}} className="icon-event"></span>
                        </div>

                        <div className={contentClass}>
                            <div className={contentInnerClass}>
                                <div className="cal-event-title">
                                    <Flex.Layout horizontal justified>
                                        <Link to="event-detail" params={{ id: event.id, repeatedNumber: event.repeated_number }}>
                                            <span title={event.title}>{event.title}</span>
                                        </Link>
                                        <DropDownAny ref="dropdown" control={control} menu={menu} />
                                    </Flex.Layout>
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

        let emptyMessage = "";

        if (this.state.hasMoreOlderEvents || this.state.hasMoreNewerEvents) {
            emptyMessage = "Loading";
        } else {
            emptyMessage = "Empty Calendar";
        }

        let emptyMessageDOM =
            <div style={{textAlign: "center", fontSize: "3em", marginTop: "10%"}}>
                {emptyMessage}
            </div>;

        let noMoreOlderEvents =
            !this.state.hasMoreOlderEvents && eventsDOM.length !== 0 ?
                <div className="cal-event-no-more">No more events</div> : null;

        let noMoreNewerEvents =
            !this.state.hasMoreNewerEvents && eventsDOM.length !== 0 ?
                <div className="cal-event-no-more">No more events</div> : null;

        return (
            <PerfectScroll className="cal-event-list">
                <InfiniteScroll
                    lowerThreshold={5}
                    upperThreshold={5}
                    onUpperTrigger={() => this._loadMoreOlderEvents()}
                    onLowerTrigger={() => this._loadMoreNewerEvents()}
                    scrollTarget={() => {return this.getDOMNode();}} />
                {noMoreOlderEvents}
                {
                    eventsDOM.length > 0 ?
                        <div className="cal-event-wrapper">
                            {eventsDOM}
                        </div> :
                        emptyMessageDOM
                }
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
