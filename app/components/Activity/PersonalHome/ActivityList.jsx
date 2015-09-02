const React = require("react");
const mui = require("material-ui");
const Common = require('../../Common');
const ActivityItem = require('../ActivityItem');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        if(!this.props.list){
            return null;
        }
        return <mui.Paper style={{padding: 12, width:'100%', marginBottom: 20, position:'relative'}}>
            <div>
                <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>{this.props.title}</Common.Display>
                {this.props.list.map(activity=>{
                    return <ActivityItem activity={activity} showStatus={this.props.showStatus}/>
                })}
            </div>
        </mui.Paper>;
    }
});

