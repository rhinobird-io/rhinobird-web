const React = require("react");
const Moment = require('moment');
const mui = require("material-ui");
const DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const ActivityList = require('../PersonalHome/ActivityList');
const ActivityItem = require('../ActivityItem');
const ExpandableContainer = require('../ExpandableContainer');
const ActivityConstants = require('../../../constants/ActivityConstants');
const Common = require('../../Common');
const Member = require('../../Member');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const UserStore = require('../../../stores/UserStore');
const ActivityStore = require('../../../stores/ActivityStore');

const dateformat = 'YYYY-MM-DD'
const endDate = new Date()
const startDate = new Date()
startDate.setFullYear(endDate.getFullYear() - 1)

function MemberList(props) {
    return (
        <Flex.Item flex={1}>
            <mui.Paper style={{padding:12, marginBottom: 12, width:'100%', position:'relative'}}>
                <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>{props.title}</Common.Display>
                {
                    props.list.length > 0 ? 
                    <ExpandableContainer>
                    {
                        props.list.map(i => 
                            <Member.Link member={i} key={i.user_id}>
                                <mui.ListItem secondaryText={i.total.toString()} leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={i}/>}>
                                    <Member.Name link={false} member={i} />
                                </mui.ListItem>
                            </Member.Link>
                        )
                    }
                    </ExpandableContainer> : <div style={{marginLeft:12}}>{props.emptyTitle}</div>
                }
            </mui.Paper>
        </Flex.Item>
    )
}

module.exports = React.createClass({
    getInitialState() {
        return {
            startDate: Moment(startDate).format(dateformat),
            endDate: Moment(endDate).format(dateformat),
            activities: [],
            mostPopularActivities: [],
            speakersMostAttendances: [],
            audiencesMostAttendances: [],
            usersMostPoints: []
        }
    },
    updatePrizeView_() {
        const startDate = this.state.startDate
        const endDate = this.state.endDate
        $.get(`/activity/attendances/mostPopularSpeech?start_at=${startDate}&end_at=${endDate}&limit=4`).then((data)=> {
            this.setState({
                mostPopularActivities: data.map(d => {
                    let activity = ActivityStore.getSpeeches().find(a => a.id === d.speech_id)
                    Object.assign(d, activity)
                    return d
                })
            });
        });

        $.get(`/activity/attendances/mostAttendance?start_at=${startDate}&end_at=${endDate}&limit=4`).then((data)=> {
            this.setState({
                audiencesMostAttendances: data.map(u => {
                    let user = UserStore.getUser(u.user_id)
                    Object.assign(u, user)
                    u.total = u.attendance_total
                    return u
                })
            });
        });

        $.get(`/activity/attendances/mostAttendance?start_at=${startDate}&end_at=${endDate}&role=speaker&limit=4`).then((data)=> {
            this.setState({
                speakersMostAttendances: data.map(u => {
                    let user = UserStore.getUser(u.user_id)
                    Object.assign(u, user)
                    u.total = u.attendance_total
                    return u
                })
            });
        });

        $.get(`/activity/attendances/points?start_at=${startDate}&end_at=${endDate}&limit=4`).then((data)=> {
            this.setState({
                usersMostPoints: data.map(u => {
                    let user = UserStore.getUser(u.user_id)
                    Object.assign(u, user)
                    u.total = u.point_total
                    return u
                })
            });
        });
    },
    componentDidMount(){
        if (ActivityUserStore.currentIsAdmin()) {
            $.get(`/activity/speeches?status=${ActivityConstants.SPEECH_STATUS.AUDITING},${ActivityConstants.SPEECH_STATUS.APPROVED}`).done((data)=> {
                this.setState({
                    activities: data
                });
            });

            this.updatePrizeView_()
        }
    },
    render(){
        if (!ActivityUserStore.currentIsAdmin()) {
            return null;
        }
        let auditing = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.AUDITING);
        let approved = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.APPROVED).sort((a, b) => new Date(a.time) - new Date(b.time));

        let mostPopularActivities = this.state.mostPopularActivities;
        let speakersMostAttendances = this.state.speakersMostAttendances;
        let audiencesMostAttendances = this.state.audiencesMostAttendances;
        let usersMostPoints = this.state.usersMostPoints;
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <div style={{margin:'0 auto', maxWidth: '80%'}}>
                <Flex.Layout vertical style={{padding: "24px 0px"}}>
                    <Common.Display type="headline">Administration</Common.Display>
                </Flex.Layout>

                <Flex.Layout horizontal justified start>
                    {
                        auditing.length > 0 ?
                            <ActivityList style={{marginRight: 48, flex: 1}} title={"Waiting you to approve"} list={auditing} adminPage={true} />
                            : undefined
                    }
                    {
                        approved.length > 0 ?
                            <ActivityList title={"Waiting speakers to confirm"} style={{flex: 1}} list={approved} adminPage={true}/>
                            : undefined
                    }
                    {
                        auditing.length === 0 && approved.length === 0 ? <div>No applications</div> : undefined
                    }
                </Flex.Layout>

                <Flex.Layout flex={1} style={{padding: "24px 0px"}}>
                    <Common.Display type="headline">Prize: </Common.Display>
                    <Common.Display type="headline">{this.state.startDate}</Common.Display>
                    <mui.IconButton
                        iconClassName="icon-event"
                        onClick={() => this.refs.startDatePicker.show()}/>
                    <Common.Display type="headline"> ~ </Common.Display>
                    <Common.Display type="headline">{this.state.endDate}</Common.Display>
                    <mui.IconButton
                        iconClassName="icon-event"
                        onClick={() => this.refs.endDatePicker.show()}/>
                    <mui.RaisedButton secondary={true} label="Search" onClick={this.updatePrizeView_}/>
                </Flex.Layout>
                <Flex.Layout vertical justified>
                    <Flex.Item flex={1}>
                        <mui.Paper style={{padding:12, marginBottom: 12, width:'100%', position:'relative'}}>
                            <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>Most Popular Speech</Common.Display>
                            {
                                mostPopularActivities.length > 0 ?
                                    <div>
                                        {
                                            mostPopularActivities.map(a => {
                                                return (
                                                    <div>
                                                        <ActivityItem key={'most-popular-activity-'+a.id} activity={a}/>
                                                        <span style={{padding:12}}>Total of audiences attending: {a.audience_total}</span>
                                                        <hr/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> : <div style={{marginLeft:12}}>No speech</div>
                            }
                        </mui.Paper>
                    </Flex.Item>
                    <MemberList
                        title="Most Hard-Working Speaker"
                        emptyTitle="No speaker"
                        list={speakersMostAttendances}/>
                    <MemberList
                        title="Most Hard-Working Audience"
                        emptyTitle="No audience"
                        list={audiencesMostAttendances}/>
                    <MemberList
                        title="Most Points User"
                        emptyTitle="No user"
                        list={usersMostPoints}/>
                    <DatePickerDialog
                        ref="startDatePicker"
                        initialDate={startDate}
                        showYearSelector={true}
                        onAccept={d => this.setState({startDate: Moment(d).format(dateformat)})}/>
                    <DatePickerDialog
                        ref="endDatePicker"
                        initialDate={endDate}
                        showYearSelector={true}
                        onAccept={d => this.setState({endDate: Moment(d).format(dateformat)})}/>
                </Flex.Layout>
                
            </div>
        </PerfectScroll>
    }
});
