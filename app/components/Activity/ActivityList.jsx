const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');
const ActivityStore = require('../../stores/ActivityStore');
const ActivityItem = require('./ActivityItem');
const Link = require('react-router').Link;

module.exports = React.createClass({
    getInitialState(){
        return {

        };
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    componentDidMount(){
        ActivityStore.addChangeListener(this._activityChange);
    },
    componentWillUnmount() {
        ActivityStore.removeChangeListener(this._activityChange);
    },
    _activityChange(){
        this.setState({
            list: ActivityStore.getSpeeches()
        })
    },
    render(){
        if(!this.state.list){
            return null;
        }
        return <mui.Paper style={{padding:12, width:'100%', marginTop:48, position:'relative'}}>
            <div>
                <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>Activities</Common.Display>
                {this.state.list.map(activity=>{
                    return <ActivityItem activity={activity} disabled={activity.status==='finished'}/>
                })}
            </div>
            <Link to="create-speech"><mui.FloatingActionButton iconClassName='icon-add' mini={true} style={{position:'absolute', top:12, right: 24}}/></Link>
        </mui.Paper>;
    }
});
