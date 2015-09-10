const React = require("react");
const mui = require("material-ui");
const Common = require('../../Common');
const ActivityItem = require('../ActivityItem');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState() {
        return {
            list: this.props.list,
            filtered: this.props.list
        }
    },
    render(){
        if(!this.props.list){
            return null;
        }
        let menuItems = [
            { payload: 'all', text: 'All' },
            { payload: 'new', text: 'New' },
            { payload: 'auditing', text: 'Auditing' },
            { payload: 'approved', text: 'Approved' },
            { payload: 'confirmed', text: 'Confirmed' },
            { payload: 'finished', text: 'Finished' },
            { payload: 'closed', text: 'Closed' }
        ];

        return <mui.Paper style={{padding: 12, width:'100%', marginBottom: 20, position:'relative'}}>
            <div>
                <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>{this.props.title}</Common.Display>
                { this.props.showFilter ?
                    (<mui.DropDownMenu menuItems={menuItems}
                                       style={{height: 40, width: 140, float: 'right'}}
                                       onChange={this._filter}/>)
                    : undefined}
                {this.state.filtered.map(activity=>{
                    return <ActivityItem activity={activity} showStatus={this.props.showStatus}/>
                })}
            </div>
        </mui.Paper>;
    },
    _filter(e, selectedIndex, menuItem) {
        let temp = [];
        this.state.list.map(activity => {
            if (menuItem.payload.toLowerCase() === 'all' || activity.status.toLowerCase() === menuItem.payload.toLowerCase())
                temp.push(activity);
        });
        this.setState({
            filtered: temp
        });
    }
});

