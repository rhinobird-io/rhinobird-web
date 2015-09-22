import $ from 'jquery';

const React = require("react");
const MUI = require("material-ui"), ListItem = MUI.ListItem;
const Flex = require("../Flex");

module.exports = React.createClass({
    getInitialState() {
        return {
            innerHeight: 0,
            containerMaxHeight: this.props.maxHeight ? this.props.maxHeight : '360px',
            arrowDirection: 'down',
            expanded: true,
            containerId: this.generateUuid()
        }
    },
    componentDidMount(){
        let node = React.findDOMNode(this);
        let nodeHeight = node.offsetHeight;
        let maxHeight = this.state.containerMaxHeight.substring(0, this.state.containerMaxHeight.length - 2);
        if ( nodeHeight > maxHeight ) {
          this.setState({showLoadMore: true});
          this.setState({expanded: false});
        }
    },
    _onClickTriangle: function(event) {
      event.preventDefault();
      if( this.state.arrowDirection == 'down'){
          this.setState({arrowDirection: 'up'});
          this.setState({expanded: true});
      } else if( this.state.arrowDirection == 'up'){
          let heightBefore = $('#'+this.state.containerId).height();
          let scrollTopBefore = $('.mainContent .ps-container').scrollTop();
          this.setState({arrowDirection: 'down'});
          this.setState({expanded: false}, function(){
            let heightAfter = $('#'+this.state.containerId).height();
            $('.mainContent .ps-container').scrollTop(scrollTopBefore - (heightBefore - heightAfter));
          });
      }
    },
    generateUuid(){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    render() {
      let triangleStyle = {
        width: 0,
        height: 0,
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderTop: this.state.arrowDirection == 'down' ? '15px solid #bdbdbd' : 'none',
        borderBottom: this.state.arrowDirection == 'up' ? '15px solid #bdbdbd' : 'none',
        margin: '0 auto',
        cursor: 'pointer',
        display: this.state.showLoadMore ? 'inline' : 'none'
      };

      let outerStyle = {
        padding: 12,
        width:'100%',
        marginBottom: 20,
        position:'relative'
      };

      let expandableStyle = {
        maxHeight: this.state.expanded ? 'none' : this.state.containerMaxHeight,
        overflow:'hidden'
      };

      return <MUI.Paper style={outerStyle} id={this.state.containerId}>
                <div style={expandableStyle}>
                  {this.props.children}
                </div>
                <Flex.Layout >
                  <div style={triangleStyle} onClick={this._onClickTriangle}>
                  </div>
                </Flex.Layout>
            </MUI.Paper>;
    }
});
