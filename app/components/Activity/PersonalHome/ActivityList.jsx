const React = require("react");
const mui = require("material-ui");
const Common = require('../../Common');
const ActivityItem = require('../ActivityItem');
const ExpandableContainer = require('../ExpandableContainer');
const StylePropable = require('material-ui/lib/mixins/style-propable');

module.exports = React.createClass({

    mixins: [StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState() {
        return {
            list: this.props.list,
            filter: 'all'
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.filter !== this.state.filter) {
            return true;
        }
        if (nextProps.list.length !== this.props.list.length) {
            return true;
        }
        for (let i = 0; i < nextProps.list.length; i++) {
            if (nextProps.list[i].id !== this.props.list[i].id) {
                return true;
            }
        }
        return false;
    },
    render(){
        if(!this.props.list){
            return null;
        }
        let menuItems = [
            { payload: 'all', text: 'All' },
            { payload: 'auditing', text: 'Auditing' },
            { payload: 'approved', text: 'Approved' },
            { payload: 'confirmed', text: 'Confirmed' },
            { payload: 'finished', text: 'Finished' },
            { payload: 'closed', text: 'Closed' }
        ];

        return  <mui.Paper style={this.mergeAndPrefix({padding: 12, marginBottom: 24, position: 'relative'}, this.props.style)}>
                <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>{this.props.title}</Common.Display>
                {this.props.adminPage && this.props.list.length > 0 ? (<span style={{padding: '0px 9px',fontSize: '12.025px',fontWeight: 'bold',
                      color: '#ffffff',backgroundColor: '#999999',borderRadius: '9px',float: 'right'}}>
                      {this.props.list.length > 99 ? '99+' : this.props.list.length}
                </span>) : undefined}

                { this.props.showFilter ?
                    (<mui.DropDownMenu menuItems={menuItems}
                                       style={{height: 40, width: 140, position: 'absolute', top: 0, right: 0}}
                                       onChange={this._filter}/>)
                    : undefined}
                <ExpandableContainer>
                {this.state.list.map(activity=>{
                    let display = this.state.filter === 'all' || this.state.filter === activity.status.toLowerCase() ? '' : 'none';
                    return <div style={{display: display}} key={activity.id}><ActivityItem activity={activity} showStatus={this.props.showStatus}/></div>;
                })}
                </ExpandableContainer>
            </mui.Paper>;
    },
    _filter(e, selectedIndex, menuItem) {
        this.setState({
            filter: menuItem.payload.toLowerCase()
        });
    }
});
