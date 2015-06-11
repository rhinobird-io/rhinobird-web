const React = require('react/addons');

const Flex = require('../Flex');
const mui = require('material-ui');
const Common = require('../Common');
const PerfectScroll = require('../PerfectScroll');

const PostFilter = React.createClass({
    getInitialState(){
        $.get('/post/v1/tags').then((data)=>{
            this.setState({
                tags: data
            });
            this.forceUpdate();
        });
        return {
            tags:[]
        }
    },
    shouldComponentUpdate(){
        return false;
    },
    _onCheck(tag, e, checked){
        tag.checked = checked;
        if (this.props.onFilter){
            this.props.onFilter(this.state.tags);
        }
    },
    render() {
        return <mui.Paper style={{width:'200px', padding: 12, display:'flex', flexDirection:'column'}}>
            <Common.Display type='title'>Tags</Common.Display>
            <PerfectScroll noScrollX style={{marginTop:12, flex:1, position:'relative'}}>
                {this.state.tags.map(t=>
                    <Flex.Layout center key={t.id} style={{width:'100%'}}>
                        <mui.Checkbox style={{width:150}} label={t.name} onCheck={this._onCheck.bind(this, t)}/>
                        <div style={{width:16, height:16, backgroundColor: t.color}}></div>
                    </Flex.Layout>
                )}
            </PerfectScroll>
        </mui.Paper>;
    }
});

module.exports = PostFilter;
