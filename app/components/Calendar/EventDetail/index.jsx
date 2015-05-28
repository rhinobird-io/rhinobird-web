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
      LoginStore      = require('../../../stores/LoginStore'),
      CalendarStore   = require('../../../stores/CalendarStore'),
      CalendarActions = require('../../../actions/CalendarActions');

require('./style.less');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

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
        let eventActions = null;
        let eventContent = null;
        let event = this.state.event;
        if (this.state.notFound || event === null || event === undefined) {
            eventContent = <h3 style={{textAlign: "center"}}>Event not found</h3>
        } else {
            let deleteEvent = LoginStore.getUser().id === event.creator_id ?
                <MUI.IconButton iconClassName="icon-delete" onClick={this._onEventDelete}/> : null;

            eventActions = <Flex.Layout horizontal justified>
                <Link to="event-list">
                    <MUI.IconButton iconClassName="icon-arrow-back" tooltip="Back"/>
                </Link>
                {deleteEvent}
                {
                    event && event.repeated ?
                        <div className="cal-event-repeated-symbol">
                            <div>{event.repeated_number}</div>
                        </div> :
                        null
                }
            </Flex.Layout>;

            eventContent = [];

            eventContent.push(
                <div key="title" className="cal-event-detail-title">{event.title}</div>
            );

            let formatTime = Moment(event.from_time).format("YYYY-MM-DD HH:mm");
            if (event.period) {
                formatTime += " ~ " + Moment(event.to_time).format("YYYY-MM-DD HH:mm")
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

            eventContent.push(<br key="br"/>);

            let members = [];

            event.participants.forEach(p => {
                let u = UserStore.getUser(p.id);
                members.push(
                    <span key={"user_" + u.id} style={{display: "inline-block", marginRight: 5}}>
                        <Flex.Layout horizontal value={"user_" + u.id} index={u.name}>
                            <Flex.Layout vertical selfCenter>
                               <Member.Avatar scale={0.5} member={u} />
                            </Flex.Layout>&ensp;
                            <Member.Name style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}} member={u}></Member.Name>
                        </Flex.Layout>
                    </span>
                );
            });

            event.team_participants.forEach(p => {
                let t = UserStore.getTeam(p.id);
                members.push(
                    <span key={"team_" + t.id} style={{display: "inline-block", marginRight: 5}}>
                        <Flex.Layout horizontal  value={"team_" + t.id} index={t.name}>
                            <Flex.Layout vertical selfCenter>
                                <span className="icon-group" style={{fontSize: "12px"}} />
                            </Flex.Layout>&ensp;
                            <span style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}}>{t.name}</span>
                        </Flex.Layout>
                    </span>
                );
            });

            eventContent.push(<div key="members">{members}</div>);

        }

        let confirmDeleteDialog = null;

        if (this.state.event && this.state.event.repeated) {
            var dialogActions = [
                {text: "Cancel"},
                <MUI.FlatButton
                    label="All events in the series"
                    primary={true}
                    onTouchTap={() => CalendarActions.deleteEvent({id: this.state.event.id}, () => this.context.router.transitionTo("event-list"))} />,
                <MUI.FlatButton
                    label="Only this instance"
                    primary={true}
                    onTouchTap={() => CalendarActions.deleteEvent({id: this.state.event.id, repeatedNumber: this.state.event.repeated_number}, () => this.context.router.transitionTo("event-list"))} />

            ];
            confirmDeleteDialog = <MUI.Dialog
                ref="deleteConfirmDialog"
                title="Deleting recurring event"
                actions={dialogActions}>
                <p style={{margin: 0}}>Would you like to delete only this event or all events in the series?</p>
            </MUI.Dialog>
        }
        return <PerfectScroll style={{height: "100%", position: "relative"}} className="cal-event-detail">
            <Flex.Layout horizontal centerJustified wrap>
                <MUI.Paper zDepth={3} style={{paddingTop: 20}}>
                    {eventActions}
                    <div style={{padding: "0 20px 20px 20px"}}>
                        {eventContent}
                    </div>
                    {confirmDeleteDialog}
                </MUI.Paper>
            </Flex.Layout>

        </PerfectScroll>;
    },

    _onChange() {
        let params = this.props.params;
        this.setState({
            event: CalendarStore.getEvent(params.id, params.repeatedNumber)
        });
    },

    _onEventDelete() {
        if (this.state.event.repeated) {
            this.refs.deleteConfirmDialog.show();
        } else {
            if (confirm("Are you sure to delete this event?")) {
                CalendarActions.deleteEvent({id: this.state.event.id}, () => this.context.router.transitionTo("event-list"));
            }
        }
    }
});
