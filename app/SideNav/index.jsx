'use strict';

var React   = require('react'),
    Router  = require('react-router'),
    mui     = require('material-ui'),
    LeftNav = mui.LeftNav;

require('./style.less');
let header = <div className="header">RhinoBird</div>;

module.exports = React.createClass({

    mixins: [Router.Navigation, Router.State],

    render: function() {
        var menuItems = [
            {route: 'home', text: 'Home'},
            {route: 'readme', text: 'Readme'}
        ];

        return <LeftNav
            className='sideNav'
            ref='leftNav'
            header={header}
            menuItems={menuItems}
            docked={false}
            onChange={this._onLeftNavChange} />;
    },

    toggle: function() {
        this.refs.leftNav.toggle();
    },

    _onLeftNavChange: function(e, key, payload) {
        this.transitionTo(payload.route);
        this.props.onLeftNavChange(payload.text);
    }
});