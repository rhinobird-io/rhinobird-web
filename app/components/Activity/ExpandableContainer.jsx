import $ from 'jquery';
const React = require("react");
const StylePropable = require('material-ui/lib/mixins/style-propable');

module.exports = React.createClass({
    mixins: [StylePropable],
    getInitialState() {
        return {
            containerMaxHeight: this.props.maxHeight || '320px',
            arrowDirection: 'down',
            expanded: true,
            containerId: this.generateUuid()
        }
    },
    componentDidMount(){
        let node = React.findDOMNode(this);
        let nodeHeight = node.scrollHeight;
        let maxHeight = this.state.containerMaxHeight.substring(0, this.state.containerMaxHeight.length - 2);
        if ( nodeHeight > maxHeight ) {
          this.setState({
              showLoadMore: true,
              expanded: false
          });
        } else {
            this.setState({showLoadMore: false});
        }
    },
    componentWillReceiveProps() {
        this.setState({
            expanded: false,
            arrowDirection: 'down'
        });
    },
    componentDidUpdate() {
        let node = React.findDOMNode(this);
        let nodeHeight = node.scrollHeight;
        let maxHeight = this.state.containerMaxHeight.substring(0, this.state.containerMaxHeight.length - 2);
        if ( nodeHeight > maxHeight ) {
            this.refs.dataRegion.getDOMNode().style.overflow = 'hidden';
            this.refs.expandRegion.getDOMNode().style.display = 'inline';
        } else {
            this.refs.dataRegion.getDOMNode().style.overflow = '';
            this.refs.expandRegion.getDOMNode().style.display = 'none';
        }
    },
    _onClickTriangle: function(event) {
      event.preventDefault();
      if( this.state.arrowDirection == 'down'){
          this.setState({
              arrowDirection: 'up',
              expanded: true
          });
      } else if( this.state.arrowDirection == 'up'){
          let heightBefore = $('#'+this.state.containerId).height();
          let scrollTopBefore = $('.mainContent .ps-container').scrollTop();
          this.setState({
              arrowDirection: 'down',
              expanded: false
          }, function(){
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
            borderTop: this.state.arrowDirection == 'down' ? '12px solid #bdbdbd' : 'none',
            borderBottom: this.state.arrowDirection == 'up' ? '12px solid #bdbdbd' : 'none',
            margin: '0 auto'
        };
        let expandMoreStyle = {
            cursor: 'pointer',
            display: this.state.showLoadMore ? 'inline' : 'none'
        };

        let outerStyle = {
            width:'100%',
            position:'relative'
        };

        let expandableStyle = {
            maxHeight: this.state.expanded ? 'none' : this.state.containerMaxHeight
        };

        return <div style={this.mergeAndPrefix(outerStyle, this.props.style)} id={this.state.containerId}>
                <div ref="dataRegion" style={expandableStyle}>
                  {this.props.children}
                </div>
                <div ref="expandRegion" style={expandMoreStyle} onClick={this._onClickTriangle}>
                  <div style={triangleStyle}/>
                </div>
            </div>;
    }
});
