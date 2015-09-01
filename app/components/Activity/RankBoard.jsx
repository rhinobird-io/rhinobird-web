const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');

module.exports = React.createClass({

    getInitialState() {
        return {
            rankedUsers: []
        }
    },
    componentDidMount(){
        $.post('/activity/users/rank').then((data)=> {
            this.setState({
                rankedUsers: data.map((u)=>{
                    let user = UserStore.getUser(u.id);
                    user.point = u.point;
                    return user;
                })
            });
        });
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        return <div style={{marginLeft:48}}>
            <mui.Paper style={{padding:8}}>
                <mui.List subheader="Rank">
                    {this.state.rankedUsers.map(u=> {
                        return <Member.Link member={u}><ListItem secondaryText={u.point} key={u.id}
                                         leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={u}/>}><Member.Name
                            link={false} member={u}/></ListItem></Member.Link>
                    })}
                </mui.List>
            </mui.Paper>
        </div>;
    }
});

