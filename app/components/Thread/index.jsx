const React = require('react/addons');

const StylePropable = require('material-ui/lib/mixins/style-propable');
const {SmartEditor, SmartDisplay} = require('../SmartEditor');
const {Avatar, Name} = require('../Member');
const Flex = require('../Flex');
const UserStore = require('../../stores/UserStore');
const Common = require('../Common');
const SmartTimeDisplay = require('../SmartTimeDisplay');
const mui = require('material-ui');
const md = require('../SmartEditor/markdown');
const LoginStore = require('../../stores/LoginStore');

const Comment = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    propTypes:{
        onReply: React.PropTypes.func.isRequired
    },
    getInitialState(){
        return {}
    },
    mixins: [React.addons.PureRenderMixin],
    render() {
        let c = this.props.comment;
        return <div style={{paddingBottom: 12}} id={`rb_comment_${c.cid}`}><Flex.Layout>
            <div style={{paddingTop:2.5}}>
                <Avatar member={UserStore.getUser(c.user)}/>
            </div>
            <Flex.Layout flex={1} vertical style={{marginLeft:12}}>
                <Flex.Layout>
                    <Name member={UserStore.getUser(c.user)}></Name>
                    <div style={{marginLeft:12}}>
                        <SmartTimeDisplay start={c.time} relative/>
                    </div>
                </Flex.Layout>
                <SmartDisplay value={c.body} key={c.cid}/>
            </Flex.Layout>
            <mui.IconButton onMouseOver={()=>{this.setState({mouseOver: true})}}
                            onMouseOut={()=>{this.setState({mouseOver: false})}}
                            iconStyle={{color:this.state.mouseOver? this.context.muiTheme.palette.textColor:this.context.muiTheme.palette.borderColor}}
                            iconClassName='icon-reply' onClick={this.props.onReply.bind(null, c)}/>
        </Flex.Layout><Common.Hr style={{marginTop: 6}}/></div>;
    }
});
const Thread = React.createClass({
    mixins: [StylePropable, React.addons.LinkedStateMixin],
    propTypes: {
        threadKey: React.PropTypes.string.isRequired,
        threadTitle: React.PropTypes.string.isRequired
    },
    getInitialState(){
        return {
            comment: ''
        };
    },
    comments:[],
    shouldComponentUpdate(){
        return false;
    },
    _getComments(key, newThread) {
        let since = undefined;
        if(this.comments.length > 0){
            since = this.comments[this.comments.length - 1].cid;
        }
        $.get('/comment/threads', $.param({key: key, since: since}), (comments)=> {
            this.comments = this.comments.concat(comments);
            this.forceUpdate();
        });
        if(newThread){
            this.timer= setInterval(()=>{this._getComments(key)}, 10000);
        }
    },
    componentDidMount() {
        this.comments = [];
        if (this.props.threadKey) {
            this._getComments(this.props.threadKey, true);
        }
    },
    componentWillUnmount(){
        if(this.timer) {
            clearInterval(this.timer);
        }
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.threadKey !== this.props.threadKey) {
            if(this.timer) {
                clearInterval(this.timer);
            }
            this.comments = [];
            this._getComments(nextProps.threadKey, true);
        }
    },

    _sendNotifications(comment, c){
        let env = {atMembers: []};
        md.parse(comment, env);
        let memberIds = Array.from(new Set(env.atMembers).values()).map(m => UserStore.getUserByName(m).id);
        let idx = memberIds.indexOf(LoginStore.getUser().id);
        if(idx > -1) {
            memberIds.splice(idx, 1);
        }
        if(memberIds.length > 0) {
            $.post('/platform/api/users/notifications', {
                    users: memberIds,
                    content: {
                        content: `Mentioned you in comment of ${this.props.threadTitle}`
                    },
                    email_subject: `[RhinoBird] ${LoginStore.getUser().realname} mentioned you in comment`,
                    email_body: `${LoginStore.getUser().realname} mentioned you in comment of <a href="${window.location.href.split('#')[0]}">${this.props.threadTitle}</a>
                    <br/><br/> ${comment}`,
                    url: `window.location.pathname#${c.cid}`
                }
            );
        }
        if (this.props.participants){
            let userIds = this.props.participants.users.map(u => u.id);
            let idx = userIds.indexOf(LoginStore.getUser().id);
            if(idx > -1) {
                userIds.splice(idx, 1);
            }
            let teamIds = (this.props.participants.teams || []).map(t => t.id);
            $.post('/platform/api/users/notifications', {
                    users: userIds,
                    teams: teamIds,
                    content: {
                        content: `New comment of ${this.props.threadTitle}`
                    },
                    email_subject: `[RhinoBird] ${LoginStore.getUser().realname} posted new comment`,
                    email_body: `${LoginStore.getUser().realname} posted new comment of <a href="${window.location.href.split('#')[0]}">${this.props.threadTitle}</a>
                    <br/><br/> ${comment}`,
                    url: `window.location.pathname#${c.cid}`
                }
            );
        }
    },
    _handleKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            $.post('/comment/comments', {key: this.props.threadKey, body:this.state.comment}).then((c)=>{
                this._getComments(this.props.threadKey);
                let comment = this.state.comment;
                this.setState({
                    comment: ''
                });
                this.forceUpdate();
                this._sendNotifications(comment, c);
            });
            e.preventDefault();
        }
    },
    _reply(c){
        let name = UserStore.getUser(c.user).name;
        this.setState({
            comment: `@${name} `
        });
        this.forceUpdate();
        this.refs.commentBox.focus();
    },
    render() {
        let {children, threadKey, ...other} = this.props;
        return <div {...other}>
            {this.comments.map(c => <Comment onReply={this._reply} comment={c}/>)}
            <SmartEditor ref='commentBox' floatingLabelText="New comment" onKeyDown={this._handleKeyDown} multiLine valueLink={this.linkState('comment')}/>
        </div>;
    }
});

module.exports = Thread;
