'use strict';

const React = require('react'),
    mui = require('material-ui'),
    Paper = mui.Paper;

const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const Flex = require('../Flex');
const Member = require('../Member');

require("./style.less");

let TeamDisplay = React.createClass({
    render: function () {
        if (this.props.team) {
            return <div className='paper-outer-container'>
                <Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <Flex.Layout center className='mui-font-style-title'>
                            <mui.FontIcon className='icon-group'/>
                            <div style={{marginLeft: 8}}>{this.props.team.name}</div>
                        </Flex.Layout>
                        <Flex.Layout wrap>
                            {this.props.team.users.map((user)=> {
                                return <div style={{margin: 6}}>
                                    <Member.Avatar member={user}/>
                                    <Member.Name style={{marginLeft: 4}} member={user}/>
                                </div>;
                            })}
                        </Flex.Layout>
                    </div>
                </Paper>
            </div>
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
    render: function () {
        let loginUser = LoginStore.getUser();
        let teams = UserStore.getTeamsByUserId(loginUser.id);
        return <Flex.Layout perfectScroll fit centerJustified wrap className='teamPage'>
            {teams.map((t)=> {
                return <TeamDisplay team={t}/>
            })}
        </Flex.Layout>;
    }
});
