const React = require("react");
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const ActivityList = require('../PersonalHome/ActivityList');
const ActivityConstants = require('../../../constants/ActivityConstants');
const Common = require('../../Common');
const ActivityUserStore = require('../../../stores/ActivityUserStore');

module.exports = React.createClass({
    getInitialState() {
        return {
            activities: []
        }
    },

    componentDidMount(){
        if (ActivityUserStore.currentIsAdmin()) {
            $.get(`/activity/speeches?status=${ActivityConstants.SPEECH_STATUS.AUDITING},${ActivityConstants.SPEECH_STATUS.APPROVED}`).done((data)=> {
                this.setState({
                    activities: data
                });
            });
        }
    },
    render(){
        if (!ActivityUserStore.currentIsAdmin()) {
            return null;
        }
        let auditing = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.AUDITING);
        let approved = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.APPROVED).sort((a, b) => new Date(a.time) - new Date(b.time));
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
            </div>
        </PerfectScroll>
    }
});
