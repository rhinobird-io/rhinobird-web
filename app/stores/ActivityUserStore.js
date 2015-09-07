'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import LoginStore from './LoginStore';

let _users = [];

function _addUser(user) {
    _users[user.id.toString()] = user;
}

let ActivityUserStore= assign({}, BaseStore, {
    getUser(id) {
        if (_users[id]) {
            return _users[id];
        }
        return null;
    },
    getCurrentUser() {
        return this.getUser(LoginStore.getUser().id);
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        let changed = true;

        switch (payload.type) {
            case Constants.ActionTypes.RECEIVE_USER:
                _addUser(data);
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            ActivityUserStore.emitChange();
        }
    })

});

module.exports = ActivityUserStore;
