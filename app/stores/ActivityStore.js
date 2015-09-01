'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import UserStore from '../stores/UserStore';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _activities = [];
let speechMap = {
    '1': {
        id: 1,
        title: "Hello Speech",
        speaker: UserStore.getUsersArray()[0],
        state: Math.floor((Math.random() * 4) + 1),
        description: "No description",
        date: new Date(),
        time: new Date(),
        hours: '1',
        minutes: '0',
        audiences: Math.floor((Math.random() * 30) + 1)
    }
};

const md5 = require('blueimp-md5');
let SpeechStore = assign({}, BaseStore, {

    getSpeeches() {
        return _activities;
    },
    getSpeech(id) {
        return speechMap[id];
    },
    nextSpeech(){
        let firstAfterComing = _activities.findIndex(a => new Date(a.time) < new Date());
        if (firstAfterComing == 0) {
            return null;
        } else if (firstAfterComing == -1) {
            return _activities[_activities.length - 1];
        }
        else {
            return _activities[firstAfterComing - 1];
        }
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        switch (payload.type) {
            case Constants.ActionTypes.ACTIVITIES_UPDATE:
                _activities = data;
                SpeechStore.emitChange();
                break;
            default:
                break;
        }
    })

});

module.exports = SpeechStore;
