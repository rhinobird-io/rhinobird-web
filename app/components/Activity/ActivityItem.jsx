const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');
const moment = require('moment');
const StylePropable = require('material-ui/lib/mixins/style-propable');


const typeMap = {
    'monthly': 'M',
    'weekly': 'L'
}
module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    mixins: [StylePropable],
    render() {
        if (!this.props.activity) {
            return null;
        }
        let type = typeMap[this.props.activity.category];
        let time = moment(this.props.activity.time);
        let title = this.props.activity.title;
        let user = UserStore.getUser(this.props.activity.user_id);

        let style = {
            cursor: 'pointer',
            padding: 12,
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        };
        let canvasColor = this.context.muiTheme.palette.canvasColor;
        let borderColor = 'rgba(0,0,0,0.03)';
        return <Flex.Layout style={this.mergeAndPrefix(style, this.props.style)}
                            onMouseOver={()=>this.getDOMNode().style.backgroundColor = borderColor}
                            onMouseOut={()=>this.getDOMNode().style.backgroundColor = canvasColor}>
            <ActivityIcon type={type} month={time.month() + 1} day={time.date()}/>

            <Flex.Layout vertical style={{marginLeft:12}} flex={1}>
                <Common.Display>{title}</Common.Display>
                <Common.Display type='caption'>
                    <Flex.Layout justified center>
                        <div><span className='icon-access-time'/> {time.format('h:mm')}</div>
                        <Flex.Layout center><Member.Avatar scale={0.5} member={user}/> <Member.Name style={{marginLeft:4}} member={user}/></Flex.Layout>
                    </Flex.Layout>
                </Common.Display>
            </Flex.Layout>
        </Flex.Layout>

    }
});

