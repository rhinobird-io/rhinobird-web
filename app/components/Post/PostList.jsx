const React = require('react/addons');

const Flex = require('../Flex');
const Immutable = require('immutable');
const PerfectScroll = require('../PerfectScroll');
const InfiniteScroll = require('../InfiniteScroll');
const Common = require('../Common');
const Link = require("react-router").Link;
const mui = require('material-ui');
const PostItem = require('./PostItem');

function intersect_safe(a, b)
{
    var ai = 0, bi = 0;
    var result = [];

    while( ai < a.length && bi < b.length ){
        if      (a[ai] < b[bi] ){ ai++; }
        else if (a[ai] > b[bi] ){ bi++; }
        else /* they're equal */
        {
            result.push(ai);
            ai++;
            bi++;
        }
    }

    return result;
}

const PostList = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState(){
        return {
            noMore: false,
            tags: []
        }
    },
    componentWillMount(){
        $.get(`/post/v1/posts`).then((data)=> {
            this.setState({
                posts: Immutable.fromJS(data)
            })
        });
    },
    componentDidUpdate(){
        if(this.filtering){
            var node = this.getDOMNode();
            node.scrollTop = 0;
            this.filtering = false;
        }
    },
    filter(tags) {
        tags = tags.filter(t=>t.checked).map(t=>t.id);
        this.filtering = true;
        this.showingCount = this.state.posts.filter((post)=> {
            return tags.length>0 && intersect_safe(tags, post.get('tags').map(t=>t.get('id')).toArray()).length !== 0;
        }).length;
        if(this.showingCount < 20 && !this.state.noMore) {
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
        }
        this.setState({
            tags: tags
        });
    },
    render: function () {
        let posts = this.state.posts;
        let tags = this.state.tags;
        let content;
        if (!posts){
            content = undefined;
        } else if(posts.size > 0){
            content = <Flex.Layout wrap>
                {posts.map((post, index)=> {
                    return <PostItem key={index} post={post} hide={tags.length>0 && intersect_safe(tags, post.get('tags').map(t=>t.get('id')).toArray()).length === 0}/>
                })}</Flex.Layout>;
        } else {
            content = <div style={{marginTop: 100}}>
                <h1 style={{textAlign: "center", margin:24}}>No post yet</h1>
                <h2 style={{textAlign: "center"}}>Start to create posts now!</h2>
            </div>;
        }
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
            {content}
            {this.state.noMore? <div style={{textAlign:'center'}}>No more posts</div>: undefined}
            <Link to='/platform/create-post'>
                <mui.FloatingActionButton style={{position:'fixed', right: 224, bottom: 24, zIndex:100}} iconClassName="icon-create"/>
            </Link>
        </PerfectScroll>;
    }
});

module.exports = PostList;
