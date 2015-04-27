'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {

  updateLogin(user) {
    AppDispatcher.dispatch({
      type: Constants.ActionTypes.LOGIN_UPDATE,
      data: user
    });
  }
};
