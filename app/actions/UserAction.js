'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {

    updateUserData() {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.USER_UPDATE
        });
    }
};
