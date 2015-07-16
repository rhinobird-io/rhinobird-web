const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Thread = require('../Thread');
const Display = require('../Common').Display;
const PerfectScroll = require('../PerfectScroll');
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const CalendarActions = require('../../actions/CalendarActions');
const {Avatar, Name, Member, MemberSelect} = require('../Member');
const {SmartEditor, SmartDisplay} = require('../SmartEditor');
const StylePropable = require('material-ui/lib/mixins/style-propable');

let EventManagement = React.createClass({
    mixins: [StylePropable, React.addons.LinkedStateMixin],
    propTypes: {
        event: React.PropTypes.object,
        onEditClick: React.PropTypes.func,
        onUpdateSuccess: React.PropTypes.func,
        type: React.PropTypes.oneOf(["view", "update", "create"])
    },

    getDefaultProps() {
        return {
            event: {},
            type: "view"
        }
    },

    getInitialState() {
        let event = this.props.event || {};
        event.members = {
            teams: event.team_participants.map(t => t.id) || [],
            users: event.participants.map(u => u.id) ||[]
        };
        console.log(event.members);
        console.log(event.participants);
        return event;
    },

    render() {
        let {
            type
        } = this.props;

        let styles = {
            eventTitle: {
                position: "relative",
                overflow: "hidden",
                fontSize: "2em",
                wordBreak: "break-all",
                padding: "0.4em 0.8em",
                marginTop: -1,
                height: "3em",
                color: muiTheme.palette.canvasColor
            },
            eventAction: {
                height: 120,
                padding: 6,
                backgroundColor: muiTheme.palette.primary1Color
            },
            eventInfo: {
                fontSize: "1em"
            },
            eventSchedule: {
            },
            eventDetailItem: {
                fontSize: "1em",
                padding: "1em 0"
            },
            eventDetailIcon: {
                minWidth: 24,
                marginRight: 24
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
                backgroundColor: muiTheme.palette.accent1Color
            },
            repeatSymbolInner: {
                width: "50%",
                height: "50%",
                marginLeft: "3px",
                fontSize: "14px",
                verticalAlign: "baseline",
                lineHeight: "34px",
                textAlign: "center"
            },
            deleteButton: {
                color: muiTheme.palette.canvasColor
            }
        };

        let eventTitle = null;
        let eventActions = null;
        let eventContent = null;
        let eventComment = null;
        let event = this.state;

        if (this.state.notFound || event === null || event === undefined) {
            eventContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Event not found</h3>
        } else {
            let deleteEvent = LoginStore.getUser().id === event.creator_id ?
                <MUI.IconButton
                    iconStyle={styles.deleteButton}
                    iconClassName="icon-delete"
                    onClick={this._onEventDelete} /> : null;
            let editEvent = <MUI.IconButton
                    iconStyle={styles.deleteButton}
                    iconClassName="icon-edit"
                    onClick={this._handleEditClick} />;

            eventActions = null;
            eventContent = [];

            if (type === "view") {
                eventActions = (
                    <Flex.Layout horizontal endJustified style={styles.eventAction}>
                        {deleteEvent}
                        {LoginStore.getUser().id === event.creator_id && editEvent}
                    </Flex.Layout>
                );

                styles.eventTitle.backgroundColor = muiTheme.palette.primary1Color;
                eventTitle = (
                    <Flex.Layout vertical  key="title" endJustified style={styles.eventTitle}>
                        <span>{event.title}</span>
                        {
                            event && event.repeated ?
                                <div style={styles.repeatSymbol}>
                                    <div style={styles.repeatSymbolInner}>{event.repeated_number}</div>
                                </div> :
                                null
                        }
                    </Flex.Layout>
                );
            } else if (type === "update" || type === "edit") {
                eventActions = (
                    <Flex.Layout horizontal endJustified style={styles.eventAction}>
                        <MUI.IconButton
                            iconStyle={styles.deleteButton}
                            iconClassName="icon-save"
                            onClick={this._handleEventSave}/>
                    </Flex.Layout>
                );

                eventContent.push(
                    <Flex.Layout vertical  key="title">
                        <MUI.TextField ref="title" defaultValue={event.title} fullWidth floatingLabelText="title" />
                    </Flex.Layout>
                );
            }

            if (type === "view") {
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

                // Event Schedule
                eventContent.push(
                    <Flex.Layout horizontal key="schedule" style={this.mergeStyles(styles.eventDetailItem, styles.eventSchedule)}>
                        <Flex.Layout center style={styles.eventDetailIcon}><MUI.FontIcon className="icon-schedule"/></Flex.Layout>
                        <Flex.Layout center>{formatTime}</Flex.Layout>
                    </Flex.Layout>
                );

                // Event Description
                eventContent.push(
                    <Flex.Layout horizontal key="description" style={styles.eventDetailItem}>
                        <Flex.Layout center style={styles.eventDetailIcon}><MUI.FontIcon className="icon-details"/></Flex.Layout>
                        <Flex.Layout center>
                            <SmartDisplay
                                key="description"
                                disabled
                                multiLine
                                floatingLabelText="Description"
                                value={event.description || "Empty"} />
                        </Flex.Layout>
                    </Flex.Layout>
                );

                // Event participants
                let participants = [];
                let teamParticipants = [];
                event.participants.forEach(p => {
                    let u = UserStore.getUser(p.id);
                    participants.push(
                        <Flex.Layout horizontal center key={"user_" + u.id} style={{marginBottom: 16, marginRight: 16}}>
                            <Avatar scale={1.0} member={u} style={{borderRadius: "0%"}} />
                            <Name style={{marginLeft: 6, width: 80, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} member={u}></Name>
                        </Flex.Layout>
                    );
                });

                event.team_participants.forEach(p => {
                    let t = UserStore.getTeam(p.id);
                    teamParticipants.push(
                        <Flex.Layout horizontal center key={"team_" + t.id} style={{marginBottom: 16, marginRight: 16}}>
                            <Flex.Layout>
                                <MUI.FontIcon className="icon-group" style={{borderRadius: "0%"}} />
                            </Flex.Layout>
                            <span title={t.name} style={{marginLeft: 6, width: 80, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{t.name}</span>
                        </Flex.Layout>
                    );
                });

                // Event Participants
                eventContent.push(
                    <Flex.Layout horizontal key="participants" style={styles.eventDetailItem}>
                        <Flex.Layout startJustified style={styles.eventDetailIcon}>
                            <MUI.FontIcon className="icon-person"/>
                        </Flex.Layout>
                        <Flex.Layout horizontal center wrap>
                            {participants}
                            {teamParticipants}
                        </Flex.Layout>
                    </Flex.Layout>
                );

                eventComment = [];
                let threadKey =  `/platform/calendar/events/${event.id}/${event.repeatedNumber}`;
                eventComment.push(
                    <Flex.Layout horizontal key="comments" style={styles.eventDetailItem}>
                        <Flex.Layout startJustified style={styles.eventDetailIcon}>
                            <MUI.FontIcon className="icon-comment"/>
                        </Flex.Layout>
                        <Flex.Layout vertical startJustified flex={1}>
                            <Thread style={{width: "100%"}} threadKey={threadKey} threadTitle={`Event ${event.title}`}
                                    participants={{users: event.participants, teams: event.team_participants}} />
                        </Flex.Layout>
                    </Flex.Layout>
                );
            } else if (type === "update" || type === "create") {
                eventContent.push(
                    <SmartEditor
                        key="description"
                        ref="description"
                        defaultValue={event.description || ""}
                        fullWidth multiLine floatingLabelText="description" />
                );

                eventContent.push(
                    <Flex.Layout key="switcher" horizontal stretch style={{marginTop: 10}}>
                        <Flex.Layout flex={1}>
                            <MUI.Checkbox ref="period" defaultChecked={event.period} onCheck={this._handlePeriodChange} name="Period" label="Period" />
                        </Flex.Layout>
                        <Flex.Layout flex={1}>
                            <MUI.Checkbox ref="full_day" defaultChecked={event.full_day} onCheck={this._handleAllDayChange}  name="All Day" label="All Day" />
                        </Flex.Layout>
                        <Flex.Layout flex={1}>
                            <MUI.Checkbox ref="repeated" name="Repeated" label="Repeated" />
                        </Flex.Layout>
                    </Flex.Layout>
                );

                eventContent.push(
                    <Flex.Layout key="fromTime" horizontal justified>
                        <MUI.DatePicker
                            ref="from_date"
                            style={{width: "100%"}}
                            floatingLabelText="From"
                            defaultDate={new Date(event.from_time)} />
                        {!event.full_day &&
                            <MUI.TimePicker ref="from_time" style={{width: "auto"}} floatingLabelText=" " defaultTime={new Date(event.from_time)}/>}
                    </Flex.Layout>
                );

                if (event.period) {
                    eventContent.push(
                        <Flex.Layout key="toTime" horizontal justified style={{marginTop: -10}}>
                            <MUI.DatePicker
                                ref="to_date"
                                style={{width: "100%"}}
                                floatingLabelText="To"
                                defaultDate={new Date(event.to_time)} />
                            {!event.full_day &&
                                <MUI.TimePicker ref="to_time" style={{width: "auto"}} floatingLabelText=" " defaultTime={new Date(event.to_time)}/>}
                        </Flex.Layout>
                    );
                }

                eventContent.push(
                    <MemberSelect
                        hintText="Participants"
                        floatingLabelText="Participants"
                        valueLink={this.linkState('members')}
                        style={{width: "100%"}} />
                );
            }
        }
        return (
            <Flex.Layout vertical style={{width: "100%", height:"100%", background: "white"}}>
                {eventActions}
                {eventTitle}
                <PerfectScroll style={{position: "relative", padding: "0.6em 1.6em", height: "100%"}}>
                    {eventContent}
                    {eventComment}
                </PerfectScroll>
                <MUI.Snackbar ref="createEventSuccess" message={`Create event successfully.`} />
            </Flex.Layout>
        );
    },

    _handleEditClick() {
        if (this.props.onEditClick) {
            this.props.onEditClick();
        }
    },

    _handleAllDayChange(e, checked) {
        this.setState({
            full_day: checked
        });
    },

    _handlePeriodChange(e, checked) {
        this.setState({
            period: checked
        });
    },

    _handleEventSave() {
        let refs = this.refs;
        let title = refs.title.getValue();
        let description = refs.description.getValue();
        let period = refs.period.isChecked();
        let full_day = refs.full_day.isChecked();
        let from_time = !full_day ?
            global.toolkits.mergeDateWithTime(refs.from_date.getDate(), refs.from_time.getTime()) :
            global.toolkits.startOfDate(refs.from_date.getDate());
        let to_time = !period ? from_time :
            (!full_day ?
                global.toolkits.mergeDateWithTime(refs.to_date.getDate(), refs.to_time.getTime()) :
                global.toolkits.endOfDate(refs.to_date.getDate()));
        console.log(this.state.members);
        CalendarActions.update({
            id: this.props.event.id,
            title: title,
            description: description,
            period: period,
            full_day: full_day,
            from_time: from_time,
            to_time: to_time,
            participants: this.state.members
        }, this.props.onUpdateSuccess);
    }
});

module.exports = EventManagement;