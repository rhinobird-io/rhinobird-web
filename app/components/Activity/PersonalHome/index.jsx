const React = require("react");
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const PersonalInfo = require('./PersonalInfo');
const ActivityList = require('./ActivityList');
const LoginStore = require('../../../stores/LoginStore');
const Moment = require("moment");

module.exports = React.createClass({
    getInitialState() {
        return {
            myActivities: [],
            attendedActivities: [],
            appliedActivities: []
        }
    },

    componentDidMount(){
        $.get(`/activity/users/${LoginStore.getUser().id}/speeches`).then((data)=> {
            this.setState({
                myActivities: data
            });
        });
        $.get(`/activity/users/${LoginStore.getUser().id}/attended_speeches`).then((data)=> {
            this.setState({
                attendedActivities: data
            });
        });
        $.get(`/activity/users/${LoginStore.getUser().id}/applied_speeches`).then((data)=> {
            this.setState({
                appliedActivities: data
            });
        });
    },
    render(){
        let urgent = this.state.myActivities.filter(a => a.status === 'approved').sort((a, b) => new Date(a.time) - new Date(b.time));
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <div style={{margin:'0 auto', maxWidth:1000}}>
                <Flex.Layout justified>
                    <Flex.Item style={{position: 'fixed', width: 192}}>
                        <PersonalInfo my={this.state.myActivities.length} attended={this.state.attendedActivities.length} applied={this.state.appliedActivities.length}/>
                    </Flex.Item>
                    <Flex.Item style={{paddingLeft: 212}} flex={1}>
                        {
                            urgent.length > 0 ?
                                (<Flex.Item flex={1}>
                                    <ActivityList title={"Waiting you to confirm"} list={urgent} showStatus={true}/>
                                </Flex.Item>) : undefined
                        }
                        {
                            this.state.myActivities.length > 0 ?
                                (<Flex.Item flex={1} id='Given'>
                                    <ActivityList title={"Given (As speaker)"} list={this.state.myActivities} showStatus={true} showFilter={true}/>
                                </Flex.Item>) : undefined
                        }
                        {
                            this.state.appliedActivities.length > 0 ?
                                (<Flex.Item flex={1} id='Applied'>
                                    <ActivityList title={"Applied (Registered as audience)"} list={this.state.appliedActivities}/>
                                </Flex.Item>) : undefined
                        }
                        {
                            this.state.attendedActivities.length > 0 ?
                                (<Flex.Item flex={1} id='Attended'>
                                    <ActivityList title={"Attended (Joint as audience)"} list={this.state.attendedActivities}/>
                                </Flex.Item>) : undefined
                        }

                    </Flex.Item>
                </Flex.Layout>
            </div>
        </PerfectScroll>
    }
});
