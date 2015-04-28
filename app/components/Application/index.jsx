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
                    <div>
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
                        {this.state.floatingContent.elementFactory()}
                    </div>
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
