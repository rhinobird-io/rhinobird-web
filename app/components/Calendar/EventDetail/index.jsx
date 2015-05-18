const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      PerfectScroll   = require('../../PerfectScroll'),
      Member          = require('../../Member'),
      SmartDisplay    = require('../../SmartEditor').SmartDisplay,
      UserStore       = require('../../../stores/UserStore'),
      CalendarStore   = require('../../../stores/CalendarStore'),
      CalendarActions = require('../../../actions/CalendarActions');

require('./style.less');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        if (!this.state.id) {
            let params = this.props.params;
            CalendarActions.receiveSingle(params.id, params.repeatedNumber);
        }
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    getInitialState() {
        let params = this.props.params;
        return {
            event: CalendarStore.getEvent(params.id, params.repeatedNumber),
            notFound: false
        };
    },

    render() {
        let eventContent = null;
        let event = this.state.event;
        if (this.state.notFound || this.state.event === null) {
            eventContent = <h3>Event not found</h3>
        } else {
            eventContent = [];

            eventContent.push(
                <div key="title" className="cal-event-detail-title">{event.title}</div>
            );

            let formatTime = Moment(event.from_time).format("YYYY-MM-DD hh:mm");
            if (event.period) {
                formatTime += " ~ " + Moment(event.to_time).format("YYYY-MM-DD hh:mm")
            }
            eventContent.push(
                <div key="time" className="cal-event-detail-time">{formatTime}</div>
            );

            eventContent.push(
                <SmartDisplay
                    key="description"
                    disabled
                    multiLine
                    floatingLabelText="Description"
                    value={this.state.event.description} />
            );

            eventContent.push(<br/>);

            let members = [];

            event.participants.forEach(p => {
                let u = UserStore.getUser(p.id);
                members.push(
                    <span style={{display: "inline-block", marginRight: 5}}>
                        <Flex.Layout horizontal key={"user_" + u.id} value={"user_" + u.id} index={u.name}>
                            <Flex.Layout vertical selfCenter>
                               <Member.Avatar scale={0.5} member={u} />
                            </Flex.Layout>&ensp;
                            <span style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}}>{u.name}</span>
                        </Flex.Layout>
                    </span>
                );
            });

            event.team_participants.forEach(p => {
                let t = UserStore.getTeam(p.id);
                members.push(
                    <span style={{display: "inline-block", marginRight: 5}}>
                        <Flex.Layout horizontal key={"team_" + t.id} value={"team_" + t.id} index={t.name}>
                            <Flex.Layout vertical selfCenter>
                                <span className="icon-group" style={{fontSize: "12px"}} />
                            </Flex.Layout>&ensp;
                            <span style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}}>{t.name}</span>
                        </Flex.Layout>
                    </span>
                );
            });

            eventContent.push(<div>{members}</div>);

        }
        return <PerfectScroll style={{height: "100%", position: "relative"}} className="cal-event-detail">
            <Flex.Layout horizontal centerJustified wrap>
                <MUI.Paper zDepth={3} style={{paddingTop: 20}}>
                    <Flex.Layout horizontal justified>
                        <Link to="event-list">
                            <MUI.IconButton iconClassName="icon-arrow-back" tooltip="Back"/>
                        </Link>
                        {
                            event && event.repeated ?
                                <div className="cal-event-repeated-symbol">
                                    <div>{event.repeated_number}</div>
                                </div> :
                                null
                        }
                    </Flex.Layout>
                    <div style={{padding: "0 20px 20px 20px"}}>
                        {eventContent}
                    </div>
                </MUI.Paper>
            </Flex.Layout>
        </PerfectScroll>;
    },

    _onChange() {
        let params = this.props.params;
        this.setState({
            event: CalendarStore.getEvent(params.id, params.repeatedNumber)
        });
    }
});
