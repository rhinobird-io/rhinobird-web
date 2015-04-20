'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

let ActionTypes = Constants.CompanyActionTypes;

export default {

  receiveAll(company) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ALL,
      company: company
    });
  },

  updateAny(form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_ANY,
      form: form
    });
  },

  addIP(ip) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_IP,
      ip: ip
    });
  },

  updateIP(newIP, oldIP) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_IP,
      newIP: newIP,
      oldIP: oldIP
    });
  },

  deleteIP(ips) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_IP,
      ips: ips
    });
  }

};
