const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        let u = UserStore.getUser(1);
        return <mui.Paper style={{padding:24, width:'100%'}}>
            <Flex.Layout start justified>
                <div>
                    <Common.Display type='display3' style={{color:this.context.muiTheme.palette.primary1Color}}>325</Common.Display>
                    <Common.Display type='display3' style={{marginLeft:24}}>Points</Common.Display>
                </div>
                <mui.RaisedButton secondary={true} label="My activities"/>
            </Flex.Layout>
            <Common.Hr style={{margin: '12px 0'}}/>
            <Common.Display type='body3'>Next coming</Common.Display>
            <ListItem style={{left:-16}} secondaryText="1000" key={u.id} leftAvatar={<div><ActivityIcon type='M' month='8' day='3'/></div>}><Member.Name link={false} member={u}/></ListItem>
        </mui.Paper>;
    }
});