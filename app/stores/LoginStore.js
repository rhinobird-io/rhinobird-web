'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _user = null;

const md5 = require('blueimp-md5');
let LoginStore = assign({}, BaseStore, {

  getUser() {
    return _user;
  },
  dispatcherIndex: AppDispatcher.register(function (payload) {
    let data = payload.data;
    switch (payload.type) {
      case Constants.ActionTypes.LOGIN_UPDATE:
        _user = data;
        if(_user) {
          _user.emailMd5 = _user.emailMd5 || md5(_user.email);
        }
        LoginStore.emitChange();
        break;
      default:
        break;
    }
  })

});

module.exports = LoginStore;
