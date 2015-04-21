'use strict';

const React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    LeftNav = mui.LeftNav,
    LoginStore = require('../../stores/LoginStore'),
    LoginAction = require('../../actions/LoginAction'),
    FontIcon = mui.FontIcon,
    DropDownIcon = mui.DropDownIcon,
    Member = require('../Member');

require('./style.less');

module.exports = React.createClass({

    contextTypes: {
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
                payload: '1', text: 'Profile', action: ()=> {
                this.context.router.transitionTo('/profile');
            }
            },
            {
                payload: '2', text: 'Logout', action: ()=> {
                $.post('/api/logout').then(()=>{
                    LoginAction.updateLogin(undefined);
                    this.context.router.transitionTo('/signin');
                })
            }
            }
        ];
        let header = <div className='header'>
            <Member member={this.state.user}/>
            <DropDownIcon
                onChange={(e, key, payload)=> {
                    this.refs.leftNav.close();
                    payload.action();
                }}
                className="headerDropdown"
                iconClassName="icon-navigation-white icon-navigation-white-ic_expand_more_white_24dp"
                menuItems={iconMenuItems} />
        </div>;
        var menuItems = [
            {route: 'home', text: 'Home'},
            {route: 'readme', text: 'Readme'},
            {route: 'calendar', text: 'Calendar'}
        ];

        return <LeftNav
            className='sideNav'
            ref='leftNav'
            header={header}
            menuItems={menuItems}
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