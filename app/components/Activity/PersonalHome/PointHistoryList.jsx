const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const PointItem = require('../PointItem');
const Common = require('../../Common');
const ExpandableContainer = require('../ExpandableContainer');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState() {
        return {
            list: this.props.list
        }
    },
    render(){
        if(!this.props.list){
            return null;
        }

        return <ExpandableContainer>
                  <div>
                      <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>Point History</Common.Display>
                        {this.props.list.map(item => {
                            return <PointItem key={item.id} item={item}/>
                        })}
                  </div>
            </ExpandableContainer>;
    }
});
