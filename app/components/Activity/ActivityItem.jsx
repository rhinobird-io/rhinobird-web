const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');
const moment = require('moment');


const typeMap = {
    'monthly': 'M',
    'weekly': 'L'
}
module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        if (!this.props.activity) {
            return null;
        }
        let type = typeMap[this.props.activity.category];
        let time = moment(this.props.activity.time);
        let title = this.props.activity.title;
        let user = UserStore.getUser(this.props.activity.user_id);
        return <Flex.Layout style={this.props.style}>
            <ActivityIcon type={type} month={time.month() + 1} day={time.date()}/>

            <Flex.Layout vertical style={{marginLeft:12}} flex={1}>
                <Common.Display>{title}</Common.Display>
                <Common.Display type='caption'>
                    <Flex.Layout justified center>
                        <div>at {time.format('h:mm')}</div>
                        <Flex.Layout center><Member.Avatar scale={0.5} member={user}/> <Member.Name style={{marginLeft:4}} member={user}/></Flex.Layout>
                    </Flex.Layout>
                </Common.Display>
            </Flex.Layout>
        </Flex.Layout>

    }
});

