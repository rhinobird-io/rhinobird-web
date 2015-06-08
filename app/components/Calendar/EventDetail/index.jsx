const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      PerfectScroll   = require('../../PerfectScroll'),
      Member          = require('../../Member'),
      SmartDisplay    = require('../../SmartEditor').SmartDisplay,
      UserStore       = require('../../../stores/UserStore'),
      LoginStore      = require('../../../stores/LoginStore'),
      CalendarStore   = require('../../../stores/CalendarStore'),
      CalendarActions = require('../../../actions/CalendarActions'),
      RouterLink      = require('../../Common').RouterLink,
      Thread          = require('../../Thread');

const EventDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired,
        muiTheme: React.PropTypes.object
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
            notFound: false,
            threadKey: `/platform/calendar/events/${params.id}/${params.repeatedNumber}`
        };
    },

    render() {
        let styles = {
            eventTitle: {
                fontSize: "2em",
                lineHeight: "1.2em",
                marginBottom: "0.2em",
                wordBreak: "break-all"
            },
            eventTime: {
                fontSize: "1em",
                color: "rgba(0, 0, 0, .6)"
            },
            repeatSymbol: {
                width: "64px",
                height: "64px",
                color: "white",
                right: "-32px",
                bottom: "-32px",
                position: "absolute",
                borderRadius: "50%",
                textAlign: "left",
                backgroundColor: this.context.muiTheme.palette.accent1Color
            },
            repeatSymbolInner: {
                width: "50%",
                height: "50%",
                marginLeft: "3px",
                fontSize: "1.1em",
                verticalAlign: "baseline",
                lineHeight: "34px",
                textAlign: "center"
            },
            deleteButton: {
                color: this.context.muiTheme.palette.accent1Color
            }
        };

        let eventActions = null;
        let eventContent = null;
        let eventComment = null;
        let event = this.state.event;

        if (this.state.notFound || event === null || event === undefined) {
            eventContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Event not found</h3>
        } else {
            let deleteEvent = LoginStore.getUser().id === event.creator_id ?
                <MUI.IconButton
                    iconStyle={styles.deleteButton}
                    iconClassName="icon-delete"
                    onClick={this._onEventDelete} /> : null;

            eventActions = <Flex.Layout horizontal justified>
                <RouterLink to="event-list">
                    <MUI.IconButton iconClassName="icon-arrow-back" title="Back to List"/>
                </RouterLink>
                {deleteEvent}
                {
                    event && event.repeated ?
                        <div style={styles.repeatSymbol}>
                            <div style={styles.repeatSymbolInner}>{event.repeated_number}</div>
                        </div> :
                        null
                }
            </Flex.Layout>;

            eventContent = [];

            eventContent.push(
                <div key="title" style={styles.eventTitle}>{event.title}</div>
            );

            let format;
            if (event.full_day) {
                format = "YYYY-MM-DD";
            } else {
                format = "YYYY-MM-DD HH:mm";
            }

            let formattedFrom = Moment(event.from_time).format(format);
            let formattedTo = Moment(event.to_time).format(format);

            let formatTime = formattedFrom;
            if (event.period && formattedFrom !== formattedTo) {
                formatTime += " ~ " + Moment(event.to_time).format(format)
            }
            eventContent.push(
                <div key="time" style={styles.eventTime}>{formatTime}</div>
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
                        <Flex.Layout horizontal selfCenter value={"user_" + u.id} index={u.name}>
                            <Flex.Layout vertical selfCenter>
                               <Member.Avatar scale={0.5} member={u} />
                            </Flex.Layout> &ensp;
                            <Member.Name style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}} member={u}></Member.Name>
                        </Flex.Layout>
                    </span>
                );
            });

            event.team_participants.forEach(p => {
                let t = UserStore.getTeam(p.id);
                members.push(
                    <span key={"team_" + t.id} style={{display: "inline-block", marginRight: 5}}>
                        <Flex.Layout horizontal value={"team_" + t.id} index={t.name}>
                            <Flex.Layout vertical selfCenter>
                                <span className="icon-group" style={{fontSize: "12px"}} />
                            </Flex.Layout>&ensp;
                            <span style={{width: "100px", overflow: "hidden", textOverflow: "ellipsis"}}>{t.name}</span>
                        </Flex.Layout>
                    </span>
                );
            });
            eventContent.push(<div key="members">{members}</div>);

            eventComment = [];
            eventComment.push(<h2 key="commentTitle" style={{marginTop: 24}}>Comments</h2>);
            eventComment.push(
                <Thread threadKey={this.state.threadKey} threadTitle={`Event ${this.state.event.title}`}
                        participants={{users: this.state.event.participants, teams: this.state.event.team_participants}} />);

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

        return (
            <PerfectScroll style={{height: "100%", position: "relative", margin: "0 auto", padding: 20}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <MUI.Paper zDepth={3} style={{position: "relative", width: 600, padding: "12px 0", overflow: "hidden"}}>
                        {eventActions}
                        <div style={{padding: "0 20px"}}>
                            {eventContent}
                            {eventComment}
                        </div>
                        {confirmDeleteDialog}
                    </MUI.Paper>
                </Flex.Layout>
            </PerfectScroll>
        );
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
                CalendarActions.deleteNoRepeatEvent(this.state.event.id, () => this.context.router.transitionTo("event-list"));
            }
        }
    }
});

module.exports = EventDetail;
