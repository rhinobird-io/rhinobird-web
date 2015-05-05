'use strict';

const AppDispatcher       = require('../dispatchers/AppDispatcher');
const CalendarActionTypes = require("../constants/AppConstants").CalendarActionTypes;

require("./mockjax/events.js");

export default {
    receive() {
        $.get("/platform/api/events").done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.RECEIVE_EVENTS,
                data: data
            });
        }).fail(e => {
            console.error(e);
        });
    },

    loadMoreOlderEvents(time, success, error) {
        $.get("/platform/api/events/before/" + time).done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.LOAD_MORE_OLDER_EVENTS,
                data: data
            });
        }).fail(e => {
            console.error(e);
        });
    },

    loadMoreNewerEvents(time, success, error) {
        $.get("/platform/api/events/after/" + time).done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.LOAD_MORE_NEWER_EVENTS,
                data: data
            });
        }).fail(e => {
            console.error(e);
        });
    }

};
