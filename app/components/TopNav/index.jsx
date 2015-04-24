'use strict';

var React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper,
    IconButton = mui.IconButton,
    FontIcon   = mui.FontIcon;

require("./style.less");
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    render: function() {
        let mainPage = (['/signin', '/signup'].indexOf(this.context.router.getCurrentPathname()) === -1);
        let rightElement = <div className="top-nav-right">
                <mui.IconButton iconClassName="icon-notifications"></mui.IconButton>
            </div>;
        return <Paper className='topNav' rounded={false}>
            <mui.AppBar
                onMenuIconButtonTouchTap={this.props.onMenuIconButtonTouchTap}
                iconClassNameLeft="icon-menu"
                title={this.props.title}
                showMenuIconButton={mainPage}
                iconElementRight={rightElement}
                zDepth={0} />
        </Paper>;
    }
});