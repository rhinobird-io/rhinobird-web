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

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentDidMount() {

  },

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.messages !== this.props.messages;
  },
  render() {
    return (
      <div className='instant-message-message-item'>
        <Layout horizontal>
          <div className="avatar-wrapper" style={{flexShrink: 0}}>
            <Avatar scale={1.6} member={UserStore.getUser(this.props.messages.first().userId)} />
          </div>
          <Layout vertical flex={1} style={{minWidth:0}}>
            <Layout horizontal justified style={{marginBottom:8}}>
              <div className="name"><Name member={UserStore.getUser(this.props.messages.first().userId)} /></div>
              <div className="time"><SmartTimeDisplay start={this.props.messages.first().createdAt} relative /></div>
            </Layout>
            {this.props.messages.map(msg=>{
              return <SmartDisplay key={msg.id} value={msg.text} onLinkPreviewWillUpdate={this.props.onLinkPreviewWillUpdate}
                                   onLinkPreviewDidUpdate={this.props.onLinkPreviewDidUpdate}></SmartDisplay>
            })}
          </Layout>
        </Layout>
      </div>
    );
  }
});