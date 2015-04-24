'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
let _user;

let LoginStore = assign({}, BaseStore, {

  getUser() {
    return _user;
  },
  dispatcherIndex: AppDispatcher.register(function (payload) {
    let action = payload.action;
    switch (action.type) {
      case Constants.ActionTypes.LOGIN_UPDATE:
        _user = payload.action.user;
        LoginStore.emitChange();
        break;
      default:
        break;
    }
  })

});

export default LoginStore;
