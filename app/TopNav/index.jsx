'use strict';

var React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper,
    IconButton = mui.IconButton,
    FontIcon   = mui.FontIcon;

module.exports = React.createClass({
    render: function() {
        return <Paper className='topNav' rounded={false}>
            <mui.AppBar
                iconClassNameLeft="icon-navigation-black icon-navigation-black-ic_menu_black_24dp"
                title='RhinoBird'
                zDepth={0} />
        </Paper>;
    }
});