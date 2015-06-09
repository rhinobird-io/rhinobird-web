const React = require('react/addons');

const Flex = require('../Flex');
const mui = require('material-ui');
const SmartPreview = require('../SmartEditor').SmartPreview;
const PerfectScroll = require('../PerfectScroll');

const PostFilter = React.createClass({
    contextTypes:{
        router: React.PropTypes.func.isRequired
    },
    componentDidMount() {
        this.props.setTitle("Create post");
    },
    getInitialState(){
        return {
            mode: this.context.router.getCurrentPathname().endsWith('create-post')? 'create' : 'view'
        }
    },
    render() {
        return <Flex.Layout fit perfectScroll vertical center>
            <div style={{maxWidth:1024, width:'100%'}}>
                <h1 style={{margin: '24px 0'}}>New post</h1>
                <label style={{fontSize: 18}}>Title</label>
                <mui.TextField style={{width:'100%'}}/>
                <label style={{fontSize: 18}}>Body</label>
                <SmartPreview floatingLabelText='Title' style={{width:'100%'}}/>
            </div>
        </Flex.Layout>;
    }
});

module.exports = PostFilter;
