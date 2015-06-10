const React = require('react/addons');

const Flex = require('../Flex');
const Immutable = require('immutable');
const PerfectScroll = require('../PerfectScroll');
const InfiniteScroll = require('../InfiniteScroll');
const Common = require('../Common');
const Link = require("react-router").Link;
const mui = require('material-ui');
const PostItem = require('./PostItem');

const PostList = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState(){
        return {
            posts: Immutable.List(),
            noMore: false
        }
    },
    componentWillMount(){
        $.get(`/post/v1/posts`).then((data)=> {
            this.setState({
                posts: Immutable.fromJS(data)
            })
        });
    },
    render: function () {
        let posts = this.state.posts;
        return <PerfectScroll style={{padding:24, flex:1, position:'relative'}}>
            <InfiniteScroll lowerThreshold={this.state.noMore? undefined : 300} onLowerTrigger={()=>{
                let lastId = this.state.posts.last().get('id');
                $.get(`/post/v1/posts?before=${lastId}`).then((data)=> {
                    if(data.length === 0) {
                        this.setState({
                            noMore: true
                        })
                    } else {
                        this.setState({
                            posts: this.state.posts.concat(Immutable.fromJS(data))
                        });
                    }
                });
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
            {posts.size > 0 ? <Flex.Layout wrap>
                {posts.map((post, index)=> {
                return <PostItem key={index} post={post}/>
            })}</Flex.Layout> :<div style={{marginTop: 100}}>
                <h1 style={{textAlign: "center", margin:24}}>No post yet</h1>
                <h2 style={{textAlign: "center"}}>Start to create posts now!</h2>
            </div>}
            {this.state.noMore? <div style={{textAlign:'center'}}>No more posts</div>: undefined}
            <Link to='/platform/create-post'>
                <mui.FloatingActionButton style={{position:'fixed', right: 224, bottom: 24, zIndex:100}} iconClassName="icon-create"/>
            </Link>
        </PerfectScroll>;
    }
});

module.exports = PostList;
