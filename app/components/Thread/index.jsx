const React = require('react/addons');

const StylePropable = require('material-ui/lib/mixins/style-propable');
const {SmartEditor, SmartDisplay} = require('../SmartEditor');
const {Avatar, Name} = require('../Member');
const Flex = require('../Flex');
const UserStore = require('../../stores/UserStore');
const Common = require('../Common');

const Thread = React.createClass({
    mixins: [StylePropable, React.addons.LinkedStateMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    propTypes: {
        threadKey: React.PropTypes.string.isRequired
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
            setInterval(()=>{this._getComments(key)}, 10000);
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

    _handleKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            $.post('/comment/comments', {key: this.props.threadKey, body:this.state.comment}).then(()=>{
                this._getComments(this.props.threadKey);
                this.setState({
                    comment: ''
                });
                this.forceUpdate();
            });
            e.preventDefault();
        }
    },
    render() {
        let color = this.context.muiTheme.palette.accent1Color;
        let {children, threadKey, ...other} = this.props;
        return <div {...other}>
            {this.comments.map(c => <div style={{padding: "6px 0"}}><Flex.Layout>
                <div style={{paddingTop:2.5}}>
                    <Avatar member={UserStore.getUser(c.user)}/>
                </div>
                <Flex.Layout vertical style={{marginLeft:12}}>
                    <div>
                        <Name member={UserStore.getUser(c.user)}></Name>
                    </div>
                    <SmartDisplay value={c.body} key={c.cid}/>
                </Flex.Layout>
            </Flex.Layout><Common.Hr style={{marginTop: 6}}/></div>)}
            <SmartEditor floatingLabelText="New comment" onKeyDown={this._handleKeyDown} multiLine valueLink={this.linkState('comment')}/>
        </div>;
    }
});

module.exports = Thread;
