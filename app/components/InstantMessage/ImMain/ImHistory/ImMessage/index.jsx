const React = require("react/addons");
const RouteHandler = require("react-router").RouteHandler;

const Member = require("../../../../Member");
const {Avatar, Name} = Member;
const Flex = require("../../../../Flex"), Layout = Flex.Layout, Item = Flex.Item;
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

  render() {

    return (
      <div className='instant-message-message-item'>
        <Layout horizontal>
          <div className="avatar-wrapper">
            <Avatar scale={1.6} member={UserStore.getUser(this.props.messages[0].userId)} />
          </div>
          <Layout vertical flex={1}>
            <Layout horizontal justified>
              <div className="name"><Name member={UserStore.getUser(this.props.messages[0].userId)} /></div>
              <div className="time"><SmartTimeDisplay start={this.props.messages[0].createdAt} relative /></div>
            </Layout>
            {this.props.messages.map(msg=>{
              return <SmartDisplay key={msg.id} value={msg.text}></SmartDisplay>
            })}
          </Layout>
        </Layout>
      </div>
    );
  }
});