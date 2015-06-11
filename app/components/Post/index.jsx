const React = require('react/addons');

const Flex = require('../Flex');
const PostList = require('./PostList');
const PostFilter = require('./PostFilter');

const Post = React.createClass({
    shouldComponentUpdate(){
        return false;
    },
    componentDidMount() {
        this.props.setTitle("Post");
    },
    render() {
        return <Flex.Layout stretch fit>
            <PostList ref='postlist'/>
            <PostFilter onFilter={this._onFilter}/>
        </Flex.Layout>;
    },
    _onFilter(tags){
        this.refs.postlist.filter(tags);
    }
});

module.exports = Post;
