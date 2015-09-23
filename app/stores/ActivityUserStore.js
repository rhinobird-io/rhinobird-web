'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import LoginStore from './LoginStore';
import ActivityConstants from '../constants/ActivityConstants';

let _users = [];

function _addUser(user) {
    _users[user.id.toString()] = user;
}
function _addUsers(users) {
    users.map(u => {
        _users[u.id.toString()] = u;
    });
}
function _updateUserPoint() {

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
    currentIsAdmin() {
        let user = this.getUser(LoginStore.getUser().id);
        if (user != null && user.role === ActivityConstants.USER_ROLE.ADMIN)
            return true;
        return false;
    },
    getUsers() {
        return _users;
    },
    getAdminIds() {
        return _users.filter(u => u.role === ActivityConstants.USER_ROLE.ADMIN).map(u => u.id);
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        let changed = true;

        switch (payload.type) {
            case Constants.ActionTypes.RECEIVE_USER:
                _addUser(data);
                break;
            case Constants.ActionTypes.RECEIVE_USERS:
                _addUsers(data);
                break;
            case Constants.ActionTypes.EXCHANGE_PRIZE:
                _users[LoginStore.getUser().id].point_available -= data.price;
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
