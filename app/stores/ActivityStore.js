'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _activities = [];

const md5 = require('blueimp-md5');
let SpeechStore = assign({}, BaseStore, {

    getSpeeches() {
        return _activities;
    },
    nextSpeech(){
        let firstAfterComing = _activities.findIndex(a => new Date(a.time) < new Date());
        if (firstAfterComing == 0) {
            return null;
        } else {
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
