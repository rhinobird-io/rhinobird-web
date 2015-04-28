const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

import _ from 'lodash';

require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentDidMount() {

  },

  /**
   * This method will  be called after dynamic segments changed
   */
  componentWillReceiveProps() {

  },

  render() {

    var classNames = {
      'instant-message-message-item' : true,
      'instant-message-message-item-unconfirmed' : this.props.Message.messageStatus && this.props.Message.messageStatus === -1
    };

    return (
      <div className={_.keys(classNames).filter(cl=>{return classNames[cl];}).join(' ')}>
        {this.props.Message.id} - {this.props.Message.createdAt} -
        {this.props.Message.text}
      </div>
    );
  }
});