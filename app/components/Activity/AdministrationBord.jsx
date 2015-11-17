const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const ActivityStore = require('../../stores/ActivityStore');
const ActivityUserStore = require('../../stores/ActivityUserStore');
const Member = require('../Member');
const ActivityItem = require('./ActivityItem');
const Link = require('react-router').Link;
const ActivityConstants = require('../../constants/ActivityConstants');
const ActivityAction = require('../../actions/ActivityAction');

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
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
        let approved = this.state.activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.APPROVED).sort((a, b) => new Date(a.time) - new Date(b.time));
        return <mui.Paper style={{padding:12, width:'100%', marginBottom: 48}}>
            <Flex.Layout start justified style={{marginLeft:12}}>
                <Flex.Layout vertical center>
                    <Common.Display type='display1' style={{color:this.context.muiTheme.palette.primary1Color}}>{auditing.length}</Common.Display>
                    <Common.Display type='body3'>Waiting you to approve</Common.Display>
                </Flex.Layout>
                <Flex.Layout vertical center>
                    <Common.Display type='display1' style={{color:this.context.muiTheme.palette.primary1Color}}>{approved.length}</Common.Display>
                    <Common.Display type='body3'>Waiting speakers to confirm</Common.Display>
                </Flex.Layout>
                <Link to='administration'><mui.RaisedButton secondary={true} label="Administration"/></Link>
            </Flex.Layout>
        </mui.Paper>;
    }
});