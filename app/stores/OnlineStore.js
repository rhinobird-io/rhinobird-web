'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';
import MessageStore from './MessageStore';
import assign from 'object-assign';
import _ from 'lodash';

let _onlineList;

let SocketStore = assign({}, BaseStore, {

    setOnlineList : (onlineList)=> {
        _onlineList = onlineList;
        SocketStore.emitChange();
    },

    userJoin : (userStatus) => {
        _onlineList[userStatus.userId] = userStatus.channelId;
        SocketStore.emitChange();
    },

    userLeft : (userStatus) => {
        delete _onlineList[userStatus.userId];
        SocketStore.emitChange();
    },

    getOnlineList : ()=> { return _onlineList; },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            default:
                break;
        }
    })

});

export default SocketStore;
