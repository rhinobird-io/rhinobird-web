'use strict';

var React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper,
    Flex       = require('../Flex');

const Notification = require("../Notification");

require("./style.less");
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    render: function() {
        let mainPage = (['/platform/signin', '/platform/signup'].indexOf(this.context.router.getCurrentPathname()) === -1);
        let rightElement = mainPage ? <Flex.Layout reverse className="top-nav-right"><Notification /></Flex.Layout> : undefined;
        return <Paper className='topNav' rounded={false}>
            <mui.AppBar
                onLeftIconButtonTouchTap={this.props.onLeftIconButtonTouchTap}
                iconClassNameLeft="icon-menu"
                title={this.props.title}
                showMenuIconButton={mainPage}
                iconElementRight={rightElement}
                zDepth={0} />
        </Paper>;
    }
});
