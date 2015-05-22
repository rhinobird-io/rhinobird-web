'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants.js';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';
import MessageStore from './MessageStore';
import assign from 'object-assign';
import _ from 'lodash';

let _onlineList = {};

let OnlineStore = assign({}, BaseStore, {

    setOnlineList : (onlineList)=> {
        _onlineList = onlineList;
        Object.keys(onlineList).forEach((onlineUserId) => {
            OnlineStore.emit(IMConstants.EVENTS.USER_ONLINE_PREFIX + onlineUserId, { online : true});
        });
        OnlineStore.emitChange();
    },

    isOnline : (userId) => {
        return _onlineList[userId]?true:false;
    },

    userJoin : (userStatus) => {
        _onlineList[userStatus.userId] = userStatus.channelId;
        OnlineStore.emit(IMConstants.EVENTS.USER_ONLINE_PREFIX + userStatus.userId, { online : true});
        OnlineStore.emitChange();
    },

    userLeft : (userStatus) => {
        delete _onlineList[userStatus.userId];
        OnlineStore.emit(IMConstants.EVENTS.USER_ONLINE_PREFIX + userStatus.userId, { online : false});
        OnlineStore.emitChange();
    },

    getOnlineList : ()=> { return _onlineList; },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            default:
                break;
        }
    })

});

export default OnlineStore;
