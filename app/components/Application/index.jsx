var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var injectTapEventPlugin = require("react-tap-event-plugin");
const Flex = require('../Flex');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

require("./style.less");

var mui = require('material-ui');
const TopNav = require('../TopNav');
const SideNav = require('../SideNav');
const FloatingContentStore = require('../../stores/FloatingContentStore');
const PerfectScroll = require('../PerfectScroll');

const closeButton = <mui.IconButton iconClassName="icon-close"/>;
var Application = React.createClass({
    getInitialState() {
        return {
            title: '',
            showFloatingContent: false,
            floatingContent: FloatingContentStore.getFloatingContent()
        }
    },
    componentDidMount() {
        FloatingContentStore.addChangeListener(this._floatingContentChanged);
    },
    componentWillUnmount() {
        FloatingContentStore.removeChangeListener(this._floatingContentChanged);
    },
    render() {
        return <div>
            <SideNav ref='sideNav'/>

            <div className={this.state.showFloatingContent? 'mainContainer floating' : 'mainContainer'}>
                <mui.Paper className='floatingContent'
                           zDepth={1}>
                    <Flex.Layout className='header' justified center>
                        <div className='title'>{this.state.floatingContent.title}</div>
                        <div className='right'>
                            <mui.IconButton className='icon-close' onClick={()=>{
                                this.setState({
                                    showFloatingContent: false
                                })
                            }}/>
                        </div>
                    </Flex.Layout>
                    <PerfectScroll styles={{position:'absolute', top:60, bottom:0, right:0, left: 0}}>
                    {this.state.floatingContent.elementFactory()}
                    </PerfectScroll>
                </mui.Paper>
                <div className='mainContent'>
                    <RouteHandler setTitle={this._setTitle} showFloatingContent={this._showFloatingContent}/>
                </div>
            </div>
            <TopNav onMenuIconButtonTouchTap={this._onMenuIconButtonTouch} title={this.state.title}/>
        </div>;
    },
    _setTitle(title) {
        this.setState({
            title: title
        });
    },
    _floatingContentChanged(){
        let content = FloatingContentStore.getFloatingContent();
        this.setState({
            floatingContent: content,
            showFloatingContent: content.showFloatingContent
        })
    },
    _onMenuIconButtonTouch() {
        this.refs.sideNav.toggle();
    }
});
module.exports = Application;
