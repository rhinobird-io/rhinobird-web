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
    shouldComponentUpdate(nextProps, nextState) {
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

        return <mui.Paper style={{padding: 12}}>
                      <Common.Display type='body3' style={{marginLeft:12, marginBottom:18}}>Point History</Common.Display>
                      <ExpandableContainer>
                        {this.props.list.map(item => {
                            return <PointItem key={item.id} item={item}/>
                        })}

                      </ExpandableContainer>
                  </mui.Paper>;
    }
});
