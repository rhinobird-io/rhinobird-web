'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import assign from 'object-assign';
import _ from 'lodash';

let _currentChannel;

let ChannelStore = assign({}, BaseStore, {

  getCurrentChannel() {
    return _currentChannel;
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let action = payload.action;
    switch (action.type) {
      case Constants.ChannelActionTypes.CHANGE_CHANNEL:
        _currentChannel = UserStore.getChannelFromHash(action.channelHash);
        ChannelStore.emitChange();
        break;
      default:
        break;
    }
  })

});



export default ChannelStore;
