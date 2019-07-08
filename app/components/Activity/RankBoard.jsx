const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()
const period = Math.floor(currentMonth / 3)
const startIndex = period*3
const endIndex = period*3+2

module.exports = React.createClass({

    getInitialState() {
        return {
            rankedUsers: []
        }
    },
    componentDidMount(){
        const startDate = `${currentYear}-${startIndex+1 >= 10 ? startIndex+1 : '0'+(startIndex+1).toString()}-00`
        const endDate = `${currentYear}-${endIndex+1 >= 10 ? endIndex+1 : '0'+(endIndex+1).toString()}-00`

        $.get(`/activity/attendances/points?start_at=${startDate}&end_at=${endDate}`).then((data)=> {
            this.setState({
                rankedUsers: data.map((u)=>{
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
    render(){
        return <div style={{marginLeft:48}}>
            <mui.Paper style={{padding:8}}>
                <mui.List subheader={`Rank (${monthNames[startIndex]} ~ ${monthNames[endIndex]})`}>
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
