const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const injectTapEventPlugin = require("react-tap-event-plugin");
const Flex = require('../Flex');
const ThemeManager = require('material-ui/lib/styles/theme-manager')();
const Colors = require('material-ui/lib/styles/colors');
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

require("./style.less");

const mui = require('material-ui');
const Dom = require('material-ui').Utils.Dom;
const ClickAwayable = mui.Mixins.ClickAwayable;
const TopNav = require('../TopNav');
const SideNav = require('../SideNav');
const FloatingContentStore = require('../../stores/FloatingContentStore');
const MessageStore = require('../../stores/MessageStore');
const ImConstants = require('../../constants/IMConstants');
const PerfectScroll = require('../PerfectScroll');
const SearchEverywhere = require('../SearchEverywhere');
const Redirect = require('../../stores/Redirect');

const closeButton = <mui.IconButton iconClassName="icon-close"/>;

let FloatingContent = React.createClass({
    mixins: [ClickAwayable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let {
            title,
            content,
            onClose
        } = this.props;

        return <mui.Paper className='floatingContent'
                          zDepth={1}>
            <Flex.Layout className='header' style={{backgroundColor: this.context.muiTheme.palette.borderColor}} justified center>
                <div className='title'>{title}</div>
                <mui.IconButton iconClassName='icon-close' onClick={onClose}/>
            </Flex.Layout>
            <PerfectScroll style={{position:'absolute', top:60, bottom:0, right:0, left: 0}}>
                {content}
            </PerfectScroll>
        </mui.Paper>;
    }
});

let Application = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            title: '',
            showFloatingContent: false,
            floatingContent: FloatingContentStore.getFloatingContent()
        }
    },

    componentDidMount() {
        FloatingContentStore.addChangeListener(this._floatingContentChanged);
        this.getDOMNode().addEventListener("click", this._clickListener);
        //window.addEventListener("keydown", this._keyDownListener);
        Redirect.addRedirectListener(this._onRequestRedirect);
        MessageStore.on(ImConstants.EVENTS.REQUEST_REDIRECT, this._onRequestRedirect);
    },

    componentWillUnmount() {
        FloatingContentStore.removeChangeListener(this._floatingContentChanged);;
        this.getDOMNode().removeEventListener("click", this._clickListener);
        //window.removeEventListener("keydown", this._keyDownListener);

        Redirect.removeRedirectListener(this._onRequestRedirect);
        MessageStore.removeListener(ImConstants.EVENTS.REQUEST_REDIRECT, this._onRequestRedirect);
    },

    render() {
        return <mui.AppCanvas predefinedLayout={1}>
            <TopNav onLeftIconButtonTouchTap={this._onMenuIconButtonTouch} title={this.state.title}/>
            <SideNav ref='sideNav'/>

            <div style={{color: ThemeManager.getCurrentTheme().palette.textColor}} className={this.state.showFloatingContent? 'mainContainer floating' : 'mainContainer'}>
                <FloatingContent
                    ref="floatingContent"
                    title={this.state.floatingContent.title}
                    content={this.state.floatingContent.elementFactory()}
                    onClose={() => this.setState({ showFloatingContent: false })}/>
                <div className='mainContent'>
                    <RouteHandler setTitle={this._setTitle} showFloatingContent={this._showFloatingContent}/>
                </div>
            </div>

            <SearchEverywhere ref="search"/>
        </mui.AppCanvas>;
    },

    _setTitle(title) {
        this.setState({
            title: title
        });
    },

    _clickListener(e) {
        let p = this.refs.floatingContent;
        if (p && this.state.showFloatingContent && !Dom.isDescendant(p.getDOMNode(), e.target)) {
            this.setState({showFloatingContent: false})
        }
    },

    _floatingContentChanged(){
        let content = FloatingContentStore.getFloatingContent();
        this.getDOMNode().removeEventListener("click", this._clickListener);
        this.setState({
            floatingContent: content,
            showFloatingContent: content.showFloatingContent
        }, () => this.getDOMNode().addEventListener("click", this._clickListener));
    },

    _onMenuIconButtonTouch() {
        this.refs.sideNav.toggle();
    },

    lastTimestamp: 0,

    lastKeyCode: -1,

    _keyDownListener(e) {
        let keyCode = e.keyCode;
        let time = new Date().getTime();

        if (keyCode === 16 && keyCode === this.lastKeyCode && time - this.lastTimestamp <= 500) {
            this.refs.search.open();
        } else if (keyCode === 27) {
            this.refs.search.close();
        }

        this.lastKeyCode = keyCode;
        this.lastTimestamp = time;
    },

    _onRequestRedirect(path) {
        this.context.router.transitionTo(path);
    }
});

// Get weekdays of the week of this date
Date.prototype.weekDays = function() {
    let result = [];
    let weekStartDay = new Date(this);
    weekStartDay.setDate(this.getDate() - this.getDay());
    for (let i = 0; i <= 6; i++) {
        let day = new Date(weekStartDay);
        day.setDate(weekStartDay.getDate() + i);
        result.push(day);
    }
    return result;
};

// Four days from this date
Date.prototype.fourDays = function() {
    let days = [];
    for (let i = 0; i <= 3; i++) {
        let day = new Date(this);
        day.setDate(this.getDate() + i);
        days.push(day);
    }
    return days;
};

// Return the time elapse of a day in seconds
Date.prototype.elapsedPercentageOfDay = function() {
    let seconds = 3600 * this.getHours() + 60 * this.getMinutes() + this.getSeconds();
    return seconds / 86400;
};

module.exports = Application;
