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
    },

    create(event, success, fail) {
        let parsedEvent = {};
        parsedEvent.title = event.title;
        parsedEvent.description = event.description;
        console.log(event.fromTime);
        parsedEvent.from_time = new Date(event.fromTime).toISOString();
        parsedEvent.to_time = new Date(event.toTime).toISOString();
        parsedEvent.full_day = event.fullDay;
        parsedEvent.participants = {users: [], teams: []};
        $.post("/platform/api/events", parsedEvent).done(data => {
            console.log(data);
            AppDispatcher.dispatch({
                type: CalendarActionTypes.CREATE_EVENT,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    }

};
