'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import BaseStore from './BaseStore';
import Constants from '../constants/AppConstants';
import assign from 'object-assign';

let ActionTypes = Constants.CompanyActionTypes;

let _company = {};

let CompanyStore = assign({}, BaseStore, {

  getAll() {
    return _company;
  },
  
  dispatcherIndex: AppDispatcher.register(payload => {
    let action = payload.action;

    switch (action.type) {
      case ActionTypes.RECEIVE_ALL:
        _company = action.company;
        CompanyStore.emitChange();
        break;

      case ActionTypes.UPDATE_ANY:
        Object.keys(action.form).map(k => {
          _company[k] = action.form[k];
        });
        CompanyStore.emitChange();
        break;

      case ActionTypes.ADD_IP:
        _company.permittedIPs.push(action.ip);
        CompanyStore.emitChange();
        break;

      case ActionTypes.UPDATE_IP:
        _company.permittedIPs = _company.permittedIPs.map(ip => {
          return ip === action.oldIP ? action.newIP : ip;
        });
        CompanyStore.emitChange();
        break;

      case ActionTypes.DELETE_IP:
        _company.permittedIPs = _company.permittedIPs.filter(ip => {
          return action.ips.indexOf(ip) < 0;
        });
        CompanyStore.emitChange();
        break;

      default:
        break;
    }
  })

});

export default CompanyStore;
