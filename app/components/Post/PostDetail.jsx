const React = require('react/addons');

const Flex = require('../Flex');
const mui = require('material-ui');
const {SmartEditor, SmartDisplay} = require('../SmartEditor');
const PerfectScroll = require('../PerfectScroll');
const Common = require('../Common');
const {Tabs, Tab} = mui;
const LoginStore = require('../../stores/LoginStore');
const Thread = require('../Thread');
const UserStore = require('../../stores/UserStore');
const Member = require('../Member');
const SmartTimeDisplay = require('../SmartTimeDisplay');


const Editor = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState(){
        return {
            title: this.props.title,
            body: this.props.body
        };
    },
    getValue(){
        return this.state;
    },
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    render(){
        return <PerfectScroll
            style={{position:'absolute', bottom:0, left:0, right:0, top: 48, maxWidth: 1024, padding:24, margin:'0 auto',display:'flex', flexDirection:'column'}}>
            <label style={{fontSize: 16, color: 'rgba(0,0,0,0.5)'}}>Title</label>
            <mui.TextField ref='textField' valueLink={this.linkState('title')} style={{width: '100%'}}/>
            <label style={{fontSize: 16, marginTop: 12,display:'block', color: 'rgba(0,0,0,0.5)'}}>Body</label>
            <SmartEditor ref="editor" valueLink={this.linkState('body')} multiLine/>
        </PerfectScroll>;
    }
});
const PostDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    mixins: [React.addons.LinkedStateMixin],
    componentDidMount() {
        this.props.setTitle("Post");
    },
    shouldComponentUpdate(){
        return false;
    },
    getInitialState(){
        let path = this.context.router.getCurrentPathname(), mode = 'view';
        if (path.endsWith('create-post')) {
            mode = 'create';
        } else {
            $.get(`/post/v1/posts/${this.props.params.id}`).then((data)=>{
                data.body = data.body || '';
                this.setState(data);
                this.forceUpdate();
            })
        }
        return {
            mode: mode,
            body: '',
            title: ''
        }
    },
    _preview(){
        let value = this.refs.editor.getValue();
        this.setState(value);
        this.forceUpdate();
    },
    render() {
        switch (this.state.mode) {
            case 'view':
                let user = UserStore.getUser(this.state.creator_id);
                return <div style={{position:'relative', height:'100%', maxWidth: 1024, padding:24, margin:'0 auto'}}>
                    <PerfectScroll noScrollX style={{height: '100%'}}>
                    <Common.Display type='headline' style={{marginBottom:12}}>{this.state.title}</Common.Display>
                    <SmartDisplay value={this.state.body}/>
                    <Common.Display type='caption' style={{display:'flex', alignItems:'center', justifyContent:'flex-end', margin:'24px 0'}}>
                        <Member.Avatar scale={0.5} member={user}/>
                        <Member.Name member={user} style={{marginLeft: 4}}/>
                        <div style={{marginLeft: 4}}>
                            <SmartTimeDisplay start={this.state.created_at} format='MMM Do YYYY' />
                        </div>
                    </Common.Display>
                    <Common.Display type='title' style={{marginTop:24}}>Comments</Common.Display>
                    <Thread threadKey={this.context.router.getCurrentPathname()} threadTitle={`Post ${this.state.title}`}
                                participants={{users: [LoginStore.getUser().id]}}/>
                </PerfectScroll>
                    {LoginStore.getUser().id === this.state.creator_id? <mui.FloatingActionButton onClick={this._editPost}
                                                                                        style={{position:'absolute', right: 24, bottom: 24}}
                                                                                        iconClassName="icon-edit"/>: undefined}

                </div>;
            case 'create':
            case 'edit':
                return <div>
                    <Tabs style={{width:'100%', zIndex: 9, position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <Tab label="EDIT">
                            <Editor ref='editor' title={this.state.title} body={this.state.body}/>
                        </Tab>
                        <Tab label="PREVIEW" onActive={this._preview}>
                            <PerfectScroll
                                style={{position:'absolute', bottom:0, left:0, right:0, top: 48,  maxWidth: 1024, padding:24, margin:'0 auto'}}>
                                <Common.Display type='headline' style={{marginBottom:12}}>{this.state.title}</Common.Display>
                                <SmartDisplay value={this.state.body}/>
                            </PerfectScroll>
                        </Tab>
                    </Tabs>

                    <div style={{position:'absolute', left:0, right: 0, bottom: 0, zIndex:100}}>
                        <div style={{position:'relative',margin:'0 auto', maxWidth: 1024}}>
                            <mui.FloatingActionButton onClick={this._savePost}
                                                      style={{position:'absolute', right: 24, bottom: 24}}
                                                      iconClassName="icon-save"/>
                        </div>
                    </div>
                </div>;
            default:
                return null;
        }
    },
    _savePost(){
        let post = this.refs.editor.getValue();
        if(this.state.mode === 'edit'){
            $.ajax({
                url: `/post/v1/posts/${this.state.id}`,
                method: 'PUT',
                data: post
            }).then(()=>{
                post.mode = 'view';
                this.setState(post);
                this.forceUpdate();
            })
        } else {
            $.post(`/post/v1/posts`,post).then((data)=>{
                this.context.router.transitionTo(`/platform/post/${data.id}`);
                data.mode = 'view';
                data.body = data.body || '';
                this.setState(data);
                this.forceUpdate();
            });
        }
    },
    _editPost(){
        this.setState({mode: 'edit'});
        this.forceUpdate();
    }
});

module.exports = PostDetail;
