const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');
const moment = require('moment');

module.exports = React.createClass({

    getInitialState() {
        return {
            rankedUsers: []
        }
    },
    componentDidMount(){
        $.get(`/activity/attendances/points?start_at=${this.getStartDate()}`).then((data)=> {
            this.setState({
                rankedUsers: data.map((a)=>{
                    let u = Object.assign(a, {id: a.user_id});
                    let user = UserStore.getUser(u.id);
                    Object.assign(u, user);
                    return u;
                })
            });
        });
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getStartDate(){
        return moment().subtract(90, 'days').format('YYYY-MM-DD');
    },
    render(){
        return <div style={{marginLeft:48}}>
            <mui.Paper style={{padding:8}}>
                <mui.List subheader={`Rank (from ${this.getStartDate()})`}>
                    {this.state.rankedUsers.map(u=> {
                        return <Member.Link member={u} key={u.id}><ListItem secondaryText={u.point_total.toString()}
                                         leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={u}/>}><Member.Name
                            link={false} member={u}/></ListItem></Member.Link>
                    })}
                </mui.List>
            </mui.Paper>
        </div>;
    }
});
