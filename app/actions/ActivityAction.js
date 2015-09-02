'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import ActivityStore from '../stores/ActivityStore';
import UserStore from '../stores/UserStore';

export default {

    updateActivities(data) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.ACTIVITIES_UPDATE,
            data: data
        });
    },

    receiveSpeech(id) {
        let speech = ActivityStore.getSpeech(id);
        if (speech !== null) {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_ACTIVITY,
                data: speech
            });
        } else {
            speech = {
                id: id,
                title: "Hello Speech",
                speaker: UserStore.getUsersArray()[0],
                state: Math.floor((Math.random() * 4) + 1),
                viewerRole: Math.floor((Math.random() * 3) + 1),
                description: "No description",
                date: new Date(),
                time: new Date(),
                hours: '1',
                minutes: '0',
                audiences: Math.floor((Math.random() * 30) + 1)
            };
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_ACTIVITY,
                data: speech
            });
        }
    }
};
