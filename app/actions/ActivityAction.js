'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';

export default {

    updateActivities(data) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.ACTIVITIES_UPDATE,
            data: data
        });
    }
};
