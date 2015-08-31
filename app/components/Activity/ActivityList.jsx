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
        return <mui.Paper style={{padding:8, width:'100%', marginTop:48, position:'relative'}}>
            <mui.List subheader="Activities">
                {UserStore.getUsersArray().slice(0,10).map(u=>{
                    return <ListItem secondaryText="1000" key={u.id} leftAvatar={<div><ActivityIcon type='L' month='7' day='21'/></div>}><Member.Name link={false} member={u}/></ListItem>
                })}
            </mui.List>
            <mui.FloatingActionButton iconClassName='icon-add' mini={true} style={{position:'absolute', top:12, right: 24}}/>
        </mui.Paper>;
    }
});

