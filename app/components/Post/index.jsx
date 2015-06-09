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
            <PostList/>
            <PostFilter/>
        </Flex.Layout>;
    }
});

module.exports = Post;
