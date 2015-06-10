const React = require('react/addons');

const Flex = require('../Flex');
const mui = require('material-ui');
const Common = require('../Common');
const {SmartDisplay} = require('../SmartEditor');
const SmartTimeDisplay = require('../SmartTimeDisplay');
const UserStore = require('../../stores/UserStore');
const Member = require('../Member');

const PostItem = React.createClass({
    contextTypes:{
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    mixins: [React.addons.PureRenderMixin],
    _goPostDetailPage(){
        this.context.router.transitionTo(`/platform/post/${this.props.post.get('id')}`);
    },
    render() {
        let post = this.props.post;
        let user = UserStore.getUser(post.get('creator_id'));
        if(post){
            return <mui.Paper style={{margin:12, flex:'1 1 320px'}}>
                <div onClick={this._goPostDetailPage} style={{backgroundColor: this.context.muiTheme.palette.primary3Color, height:200, cursor:'pointer'}}></div>
                <Flex.Layout center>
                    <Flex.Layout flex={1} vertical style={{padding: 10}}>
                        <Common.Display type='body2'
                                        style={{cursor:'pointer'}}
                                        onClick={this._goPostDetailPage}
                                        onMouseOver={(e)=>{e.target.style.textDecoration = 'underline'}}
                                        onMouseOut={(e)=>{e.target.style.textDecoration = 'none'}}>{post.get('title')}</Common.Display>
                        <Common.Display type='caption' style={{display:'flex', alignItems:'center'}}>
                            <Member.Avatar scale={0.5} member={user}/>
                            <Member.Name member={user} style={{marginLeft: 4}}/>
                            <div style={{marginLeft: 4}}>
                                <SmartTimeDisplay start={post.get('created_at')} format='MMM Do YYYY' />
                            </div>
                        </Common.Display>
                    </Flex.Layout>
                </Flex.Layout>
            </mui.Paper>;
        } else {
            return null;
        }
    }
});

module.exports = PostItem;
