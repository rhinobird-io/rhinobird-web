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
};
module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    mixins: [StylePropable, React.addons.PureRenderMixin],
    render() {
        if (!this.props.activity) {
            return null;
        }
        let type = typeMap[this.props.activity.category];
        let time = moment(this.props.activity.time);
        let title = this.props.activity.title;
        let user = UserStore.getUser(this.props.activity.user_id);
        let status = this.props.activity.status;
        let disabled = status === 'finished';

        let style = {
            cursor: 'pointer',
            padding: 12,
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        };
        let canvasColor = this.context.muiTheme.palette.canvasColor;
        let borderColor = 'rgba(0,0,0,0.03)';
        let disabledColor = this.context.muiTheme.palette.disabledColor;

        let titleStyle= {textOverflow:'ellipsis', overflow:'hidden'};
        if (disabled) {
            titleStyle.color = disabledColor;
        }
        let timeStyle = {};
        if(disabled) {
            timeStyle.color = disabledColor;
        }
        let rightContent = null;
        if (this.props.showStatus) {
            rightContent = status.charAt(0).toUpperCase() + status.substring(1);
        }
        else {
            let nameStyle = {marginLeft:4};
            if(disabled) {
                nameStyle.color = disabledColor;
            }
            rightContent = (<div><Member.Avatar scale={0.5} member={user}/> <Member.Name style={nameStyle} member={user}/></div>);
        }

        return <Flex.Layout style={this.mergeAndPrefix(style, this.props.style)}
                            onMouseOver={()=>this.getDOMNode().style.backgroundColor = borderColor}
                            onMouseOut={()=>this.getDOMNode().style.backgroundColor = canvasColor}
                            onClick={()=>{this.context.router.transitionTo('speech-detail', {id: this.props.activity.id})}} >
            <ActivityIcon type={type} month={time.month() + 1} day={time.date()} disabled={disabled}/>

            <Flex.Layout vertical style={{marginLeft:12, width: 0}} flex={1}>
                <Common.Display style={titleStyle} title={title}>{title}</Common.Display>
                <Common.Display type='caption' style={timeStyle}>
                    <Flex.Layout justified center>
                        <div><span className='icon-access-time'/> {time.isValid() ? time.format('HH:mm') : '--:--'}</div>
                        <Flex.Layout center onClick={this.props.showStatus ? undefined : (e)=>{e.stopPropagation()}}>
                            {rightContent}
                        </Flex.Layout>
                    </Flex.Layout>
                </Common.Display>
            </Flex.Layout>
        </Flex.Layout>

    }
});
