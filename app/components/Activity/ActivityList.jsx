const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const Flex = require("../Flex");
const Common = require('../Common');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');
const Member = require('../Member');
const ActivityStore = require('../../stores/ActivityStore');
const ActivityItem = require('./ActivityItem');

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
                <Common.Display type='body3' style={{marginLeft:12}}>Activities</Common.Display>
                {this.state.list.map(activity=>{
                    return <ActivityItem activity={activity}/>
                })}
            </div>
            <mui.FloatingActionButton iconClassName='icon-add' mini={true} style={{position:'absolute', top:12, right: 24}}/>
        </mui.Paper>;
    }
});

