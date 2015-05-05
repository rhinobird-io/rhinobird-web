const React = require("react/addons");
const RouteHandler = require("react-router").RouteHandler;

const Member = require("../../../../Member");
const {Avatar, Name} = Member;
const Layout = require("../../../../Flex").Layout;
const SmartTimeDisplay = require("../../../../SmartTimeDisplay");
const SmartDisplay = require("../../../../SmartEditor/SmartDisplay");

import UserStore from '../../../../../stores/UserStore';
import _ from 'lodash';

require('./style.less');
module.exports = React.createClass({

  mixins: [React.addons.PureRenderMixin],
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
        <Layout horizontal>
          <div className="avatar-wrapper">
            <Avatar scale={1.6} member={UserStore.getUser(this.props.Message.userId)} />
          </div>
          <Layout vertical flex={1}>
            <Layout horizontal justified>
              <div className="name"><Name member={UserStore.getUser(this.props.Message.userId)} /></div>
              <div className="time"><SmartTimeDisplay start={this.props.Message.createdAt} relative /></div>
            </Layout>
            <SmartDisplay value={this.props.Message.text + '' + this.props.Message.id}></SmartDisplay>
          </Layout>
        </Layout>
      </div>
    );
  }
});