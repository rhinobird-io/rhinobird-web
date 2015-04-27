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
    let data = payload.data;
    switch (payload.type) {
      case Constants.ActionTypes.LOGIN_UPDATE:
        _user = data;
        LoginStore.emitChange();
        break;
      default:
        break;
    }
  })

});

export default LoginStore;
