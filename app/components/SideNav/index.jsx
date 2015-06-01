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
    PopupSelect = require('../Select').PopupSelect;

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
                payload: '1', text: 'Profile', iconClassName:'icon-person', action: ()=> {
                this.context.router.transitionTo('/platform/profile');
            }
            },
            {
                payload: '2', text: 'Logout', iconClassName:'icon-exit-to-app', action: ()=> {
                document.cookie = 'Auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                LoginAction.updateLogin(undefined);
                this.context.router.transitionTo('/platform/signin');
                //TODO logout
                $.post('/api/logout').then(()=>{
                })
            }
            }
        ];
        let header = <Flex.Layout center justified className='header'>
            <div className='member-info'>
                <Member.Avatar scale={1.5} member={this.state.user} link={false}/>
                <Member.Name member={this.state.user} link={false} />
            </div>
            <mui.FontIcon ref="expand" onClick={() => this.refs.popup.show()} style={{color: "white", cursor: "pointer"}} className="icon-expand-more"/>
            <PopupSelect ref="popup" relatedTo={() => this.refs.expand} clickAwayToDismiss>
                <div value="hahaha">Halalal123123asdfasdf</div>
            </PopupSelect>
        </Flex.Layout>;
        var menuItems = [
            {route: '/platform/dashboard', iconClassName: 'icon-dashboard', text: 'Dashboard'},
            {route: '/platform/calendar', iconClassName: 'icon-event-note', text: 'Calendar'},
            {route: '/platform/team', iconClassName: 'icon-group', text: 'Team'},
            {route: '/platform/im/talk/default', iconClassName: 'icon-message', text: 'Instant Message'}
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