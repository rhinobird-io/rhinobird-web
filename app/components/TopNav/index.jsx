'use strict';

var React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper,
    IconButton = mui.IconButton,
    FontIcon   = mui.FontIcon;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    render: function() {
        let showMenu = (['/signin', '/signup'].indexOf(this.context.router.getCurrentPathname()) === -1);
        return <Paper className='topNav' rounded={false}>
            <mui.AppBar
                onMenuIconButtonTouchTap={this.props.onMenuIconButtonTouchTap}
                iconClassNameLeft="icon-navigation-white icon-navigation-white-ic_menu_white_24dp"
                title={this.props.title}
                showMenuIconButton={showMenu}
                zDepth={0} />
        </Paper>;
    }
});