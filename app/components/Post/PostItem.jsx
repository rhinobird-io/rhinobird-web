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
        let bgColor = muiTheme.palette.primary3Color, tags = post.get('tags'), colorBlock;
        if(tags.size > 0){
            colorBlock = tags.map(tag=><Flex.Item flex={1} key={tag.get('id')} style={{backgroundColor: tag.get('color')}}/>);
        } else{
            colorBlock = <Flex.Item flex={1} style={{backgroundColor: bgColor}}/>
        }
        if(post) {
            return <mui.Paper style={this.props.hide?{display:'none'}:{margin:12, flex:'1 1 320px', display:'flex', flexDirection:'column'}}>
                    <Flex.Layout vertical stretch onClick={this._goPostDetailPage} style={{height:200, cursor:'pointer'}}>
                        {colorBlock}
                    </Flex.Layout>
                    <Flex.Layout flex={1} vertical style={{padding: 10}} justified>
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
            </mui.Paper>;
        } else {
            return null;
        }
    }
});

module.exports = PostItem;
