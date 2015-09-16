'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import ActivityConstants from '../constants/ActivityConstants';

let _activities = [];
let _activitiesIdMap = {};

function _addSpeech(speech) {
    _activitiesIdMap[speech.id.toString()] = speech;
}
function _deleteSpeech(id) {
    delete _activitiesIdMap[id];
}

const md5 = require('blueimp-md5');
let SpeechStore = assign({}, BaseStore, {

    getSpeeches() {
        return _activities;
    },
    getSpeech(id) {
        if (_activitiesIdMap[id]) {
            return _activitiesIdMap[id];
        }
        return null;
    },
    nextSpeech(){
        let confirmedActivities = _activities.filter(a => a.status === ActivityConstants.SPEECH_STATUS.CONFIRMED);
        if (confirmedActivities.length === 0) {
            return null;
        }
        let firstAfterComing = confirmedActivities.findIndex(a => new Date(a.time) < new Date());
        if (firstAfterComing == 0) {
            return null;
        } else if (firstAfterComing == -1) {
            return confirmedActivities[confirmedActivities.length - 1];
        }
        else {
            return confirmedActivities[firstAfterComing - 1];
        }
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        let changed = true;

        switch (payload.type) {
            case Constants.ActionTypes.ACTIVITIES_UPDATE:
                _activities = data;
                break;
            case Constants.ActionTypes.RECEIVE_ACTIVITY:
                _addSpeech(data);
                break;
            case Constants.ActionTypes.CREATE_ACTIVITY:
                _addSpeech(data);
                break;
            case Constants.ActionTypes.DELETE_ACTIVITY:
                _deleteSpeech(data);
                break;
            case Constants.ActionTypes.UPDATE_ACTIVITY:
                _addSpeech(data);
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            SpeechStore.emitChange();
        }
    })

});

module.exports = SpeechStore;
