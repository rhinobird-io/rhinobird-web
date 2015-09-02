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

    receiveSpeech(id) {
        let speech = ActivityStore.getSpeech(id);
        if (speech !== null) {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_ACTIVITY,
                data: speech
            });
        } else {
            let _random = function(n) {
                return Math.floor((Math.random() * n));
            };

            let me = LoginStore.getUser();
            let speaker = me;

            let speeches = ActivityStore.getSpeeches();
            let hit = speeches.find(e => e.id === Number(id));
            if (hit && hit !== null) {
                speaker = UserStore.getUser(hit.user_id);
            } else {
                let users = UserStore.getUsersArray();
                speaker = users[_random(users.length)];
            }

            speech = {
                id: id,
                title: "Hello Speech",
                speaker: speaker,
                status: 0,
                viewerRole: me.id == speaker.id ? 2 : 1 + 2 * _random(2),
                description: "No description",
                category: 1,
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
