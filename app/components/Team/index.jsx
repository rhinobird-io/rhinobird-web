'use strict';

const React      = require('react'),
    mui        = require('material-ui'),
    Paper      = mui.Paper;

const Notification = require("../Notification");
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');

require("./style.less");

let TeamDisplay = React.createClass({
    render: function(){
        if(this.props.team){
            return <div>{this.props.team.name}</div>
        } else {
            return null;
        }
    }
});

module.exports = React.createClass({
    componentDidMount(){
        this.props.setTitle('Team');
        UserStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);

    },
    _userChanged(){
        this.forceUpdate();
    },
    render: function() {
        let loginUser = LoginStore.getUser();
        let teams = UserStore.getTeamsByUserId(loginUser.id);
        console.log(teams);
        return <div className='teamPage'>
            <h1>Teams</h1>
            {teams.map((t)=>{return <TeamDisplay team={t}/>})}
        </div>;
    }
});
