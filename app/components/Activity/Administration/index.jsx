const React = require("react");
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const ActivityList = require('../PersonalHome/ActivityList');
const ActivityConstants = require('../../../constants/ActivityConstants');

module.exports = React.createClass({
    getInitialState() {
        return {
            activities: []
        }
    },

    componentDidMount(){
        $.get(`/activity/speeches?status=${ActivityConstants.SPEECH_STATUS.AUDITING}`).done((data)=> {
            this.setState({
                activities: data
            });
        });
    },
    render(){
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <div style={{margin:'0 auto', maxWidth:1000}}>
                <Flex.Layout justified>
                    {this.state.activities.length > 0 ?
                            <ActivityList title={"Auditing Activities"} list={this.state.activities}/>
                                : undefined}
                </Flex.Layout>
            </div>
        </PerfectScroll>
    }
});

