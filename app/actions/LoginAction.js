'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {

  updateLogin(user) {
    AppDispatcher.handleServerAction({
      type: Constants.ActionTypes.LOGIN_UPDATE,
      user: user
    });
  }
};
