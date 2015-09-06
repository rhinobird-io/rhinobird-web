'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import ActivityStore from '../stores/ActivityStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';

export default {

    updateActivities(data) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.ACTIVITIES_UPDATE,
            data: data
        });
    },

    receiveSpeech(id, success, fail) {
        $.get(`/activity/speeches/${id}`).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_ACTIVITY,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
            fail(e)
        });
    }
};
