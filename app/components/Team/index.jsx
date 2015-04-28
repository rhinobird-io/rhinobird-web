'use strict';

const React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper;

const Notification = require("../Notification");

require("./style.less");
module.exports = React.createClass({
    componentDidMount(){
        this.props.setTitle('Team');
    },
    render: function() {
        return <div className='teamPage'>
            <h1>Teams</h1>
        </div>;
    }
});
