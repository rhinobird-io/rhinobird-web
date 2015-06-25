'use strict';

const React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    LeftNav = mui.LeftNav,
    LoginStore = require('../../stores/LoginStore'),
    LoginAction = require('../../actions/LoginAction'),
    FontIcon = mui.FontIcon,
    DropDownIcon = mui.DropDownIcon,
    Member = require('../Member'),
    Flex = require('../Flex'),
    DropDownAny = require('../DropDownAny'),
    PopupSelect = require('../Select').PopupSelect;

require('./style.less');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            user: LoginStore.getUser()
        };
    },
    componentDidMount() {
        LoginStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount() {
        LoginStore.removeChangeListener(this._userChanged);
    },
    _userChanged() {
        this.setState({
            user: LoginStore.getUser()
        });
    },
    render: function () {
        let iconMenuItems = [
            {
                payload: '1', text: 'Profile', iconClassName:'icon-person', action: ()=> {
                this.context.router.transitionTo('/platform/profile');
            }
            },
            {
                payload: '2', text: 'Logout', iconClassName:'icon-exit-to-app', action: ()=> {

            }
            }
        ];

        let control = <mui.IconButton iconStyle={{color: this.context.muiTheme.palette.canvasColor}}
                                  iconClassName="icon-expand-more"/>;
        let menus = [];
        menus.push(<mui.MenuItem onTouchTap={() => {
            this.context.router.transitionTo('/platform/profile');
            this.refs.dropdown.dismiss();
            this.toggle();
        }}>
            <Flex.Layout horizontal  style={{paddingRight: 36}}>
                <Flex.Layout vertical selfCenter style={{marginRight: 24}}>
                    <mui.FontIcon className="icon-person"/>
                </Flex.Layout>
                <span>Profile</span>
            </Flex.Layout>
        </mui.MenuItem>);
        menus.push(<mui.MenuItem onTouchTap={() => {
            document.cookie = 'Auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            LoginAction.updateLogin(undefined);
            this.context.router.transitionTo('/platform/signin');
            //TODO logout

            this.refs.dropdown.dismiss();
            this.toggle();
            $.post('/api/logout').then(()=>{
            })
        }}>
            <Flex.Layout horizontal style={{paddingRight: 36}}>
                <Flex.Layout vertical selfCenter style={{marginRight: 24}}>
                    <mui.FontIcon className="icon-exit-to-app"/>
                </Flex.Layout>
                <span>Logout</span>
            </Flex.Layout>
        </mui.MenuItem>);

        let header = <Flex.Layout horizontal center justified className='header'>
            <Flex.Layout horizontal center className='member-info'>
                <Member.Avatar scale={1.5} member={this.state.user} link={false}/>
                <Member.Name member={this.state.user} link={false} />
            </Flex.Layout>
            <Flex.Layout vertical centerJustified>
                <DropDownAny ref="dropdown" control={control} menu={menus} menuClasses={'notification-menu'}
                             onClickAway={this._onClickAway}/>
            </Flex.Layout>
        </Flex.Layout>;
        var menuItems = [
            {route: '/platform/dashboard', iconClassName: 'icon-dashboard', text: 'Dashboard'},
            {route: '/platform/calendar', iconClassName: 'icon-event-note', text: 'Calendar'},
            {route: '/platform/team', iconClassName: 'icon-group', text: 'Team'},
            {route: '/platform/im/talk/default', iconClassName: 'icon-message', text: 'Instant Message'},
            {route: '/platform/post', iconClassName: 'icon-forum', text: 'Post'}
        ];

        return <LeftNav
            className='sideNav'
            ref='leftNav'
            header={header}
            menuItems={menuItems}
            style={{overflow: "visible"}}
            docked={false}
            onChange={this._onLeftNavChange} />;
    },

    toggle: function () {
        this.refs.leftNav.toggle();
    },

    _onLeftNavChange: function (e, key, payload) {
        this.context.router.transitionTo(payload.route);
    }
});