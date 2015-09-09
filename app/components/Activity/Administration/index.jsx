const React = require("react");
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const ActivityList = require('../PersonalHome/ActivityList');
const ActivityConstants = require('../../../constants/ActivityConstants');
const Common = require('../../Common');

module.exports = React.createClass({
    getInitialState() {
        return {
            activities: []
        }
    },

    componentDidMount(){
        $.get(`/activity/speeches?status=${ActivityConstants.SPEECH_STATUS.AUDITING},${ActivityConstants.SPEECH_STATUS.APPROVED}`).done((data)=> {
            this.setState({
                activities: data
            });
        });
    },
    render(){
        let auditing = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.AUDITING);
        let approved = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.APPROVED);
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <div style={{margin:'0 auto', maxWidth: '80%'}}>
                <Flex.Layout vertical style={{padding: "24px 0px"}}>
                    <Common.Display type="headline">Welcome administrator</Common.Display>
                    <Common.Display type="headline">{auditing.length} activities are waiting for you to approve.</Common.Display>
                    <Common.Display type="headline">{approved.length} activities are waiting for their speakers to confirm.</Common.Display>
                </Flex.Layout>

                <Flex.Layout horizontal justified>
                    {
                        auditing.length > 0 ?
                            <Flex.Layout horizontal flex={1} style={{paddingRight: 48, maxWidth: `${approved.length > 0 ? '50%' : '100%'}`}}><ActivityList title={"Waiting for you to approve"} list={auditing} /></Flex.Layout>
                            : undefined
                    }
                    {
                        approved.length > 0 ?
                            <Flex.Layout horizontal flex={1} style={{maxWidth: `${auditing.length > 0 ? '50%' : '100%'}`}}><ActivityList title={"Waiting for speakers to confirm"} list={approved}/></Flex.Layout>
                            : undefined
                    }
                </Flex.Layout>
            </div>
        </PerfectScroll>
    }
});

