const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const ActivityIcon = require('./ActivityIcon');
const ActivityStore = require('../../stores/ActivityStore');
const Member = require('../Member');

module.exports = React.createClass({
    componentDidMount(){
        ActivityStore.addChangeListener(this._activityChange);
        $.get(`/activity/users/${LoginStore.getUser().id}`).then(user =>{
            Object.assign(user, LoginStore.getUser);
            this.setState({
                user: user
            })
        });
    },
    componentWillUnmount() {
        ActivityStore.removeChangeListener(this._activityChange);
    },
    _activityChange(){
        this.setState({
            next: ActivityStore.nextSpeech()
        })
    },
    getInitialState() {
        return {
            next: null
        }
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        if(!this.state.user){
            return null;
        }
        return <mui.Paper style={{padding:24, width:'100%'}}>
            <Flex.Layout start justified>
                <div>
                    <Common.Display type='display3' style={{color:this.context.muiTheme.palette.primary1Color}}>{this.state.user.point}</Common.Display>
                    <Common.Display type='display3' style={{marginLeft:24}}>Points</Common.Display>
                </div>
                <mui.RaisedButton secondary={true} label="My activities"/>
            </Flex.Layout>
            {this.state.next? <div>
            <Common.Hr style={{margin: '12px 0'}}/>
            <Common.Display type='body3'>Next coming</Common.Display>
                <ListItem style={{left:-16}} secondaryText="1000" key={this.state.user.id} leftAvatar={<div><ActivityIcon type='M' month='8' day='3'/></div>}><Member.Name link={false} member={this.state.user}/></ListItem>
            </div>: undefined}
        </mui.Paper>;
    }
});