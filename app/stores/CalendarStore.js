"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").CalendarActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _eventsIdMap = {};
let _events = {};
let _eventRange = {};
let _hasMoreNewerEvents = true;
let _hasMoreOlderEvents = true;
let _hasReceived = false;
let _newCreated = null;

function _addEvent(event, type) {
    let dateFormat = _formatDate(event.from_time);
    if (!_events[dateFormat]) {
        _events[dateFormat] = [];
    }

    if (!_eventsIdMap[event.id.toString()] || !_eventsIdMap[event.id.toString()][event.repeated_number.toString()]) {
        _events[dateFormat].push(event);
        if (!_eventsIdMap[event.id.toString()]) {
            _eventsIdMap[event.id.toString()] = {};
        }
        _eventsIdMap[event.id.toString()][event.repeated_number.toString()] = event;
    }

    if (type && type === ActionTypes.CREATE_EVENT) {
        _newCreated = event.id.toString();
        setTimeout(() => {
            _newCreated = null;
            CalendarStore.emitChange();
        }, 2000);
        return;
    }

    if (_eventRange.min === undefined) {
        _eventRange.min = event.from_time;
    } else if (event.from_time < _eventRange.min) {
        _eventRange.min = event.from_time;
    }

    if (_eventRange.max === undefined) {
        _eventRange.max = event.from_time;
    } else if (event.from_time > _eventRange.max) {
        _eventRange.max = event.from_time;
    }
}

function _addEvents(events) {
    for (let i = 0; i < events.length; i++) {
        _addEvent(events[i]);
    }
}

function _formatDate(date) {
    let d = new Date(date);
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString();
    var dd  = d.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

function _sortByFromTime(e1, e2) {
    let e1FromTime = new Date(e1.from_time);
    let e2FromTime = new Date(e2.from_time);
    if (e1FromTime > e2FromTime) return 1;
    else if (e1FromTime < e2FromTime) return -1;
    return 0;
}

let CalendarStore = assign({}, BaseStore, {
    getEvent(eventId, repeatedNumber) {
        if (_eventsIdMap[eventId]) {
            return _eventsIdMap[eventId][repeatedNumber];
        }
        return null;
    },

    getAllEvents() {
        return _events;
    },

    getEventTimeRange() {
        return _eventRange;
    },

    getNewCreated() {
        return _newCreated;
    },

    hasMoreNewerEvents() {
        return _hasMoreNewerEvents;
    },

    hasMoreOlderEvents() {
        return _hasMoreOlderEvents;
    },

    hasReceived() {
        return _hasReceived;
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        let changed = true;

        switch (type) {
            case ActionTypes.CREATE_EVENT:
                _addEvent(data, ActionTypes.CREATE_EVENT);
                break;
            case ActionTypes.RECEIVE_EVENT:
                _addEvent(data);
                break;
            case ActionTypes.RECEIVE_EVENTS:
                _events = {};
                _addEvents(data);
                let keys = Object.keys(_events);
                if (keys.length === 0) {
                    _hasMoreNewerEvents = false;
                    _hasMoreOlderEvents = false;
                } else {

                }
                _hasReceived = true;
                break;
            case ActionTypes.LOAD_MORE_NEWER_EVENTS:
                _addEvents(data);
                if (data.length === 0) {
                    _hasMoreNewerEvents = false;
                }
                break;
            case ActionTypes.LOAD_MORE_OLDER_EVENTS:
                _addEvents(data);
                if (data.length === 0) {
                    _hasMoreOlderEvents = false;
                }
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            CalendarStore.emitChange();
        }
    })

});

export default CalendarStore;
