'use strict';

const AppDispatcher       = require('../dispatchers/AppDispatcher');
const CalendarActionTypes = require("../constants/AppConstants").CalendarActionTypes;

require("./mockjax/events.js");

export default {
    receive(success) {
        $.get("/platform/api/events").done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.RECEIVE_EVENTS,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    },

    receiveSingle(id, repeatedNumber) {
        $.get("/platform/api/events/" + id + "/" + repeatedNumber).done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.RECEIVE_EVENT,
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
            if (success && typeof success === "function") {
                success();
            }
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
            if (e.status == 404) {

            }
        });
    },

    create(event, success, fail) {
        let parsedEvent = {};
        let fromTime = new Date(event.fromTime);
        let toTime = new Date(event.toTime);

        parsedEvent.title = event.title;
        parsedEvent.description = event.description;
        parsedEvent.full_day = event.fullDay;

        if (!parsedEvent.full_day) {
            fromTime.setHours(event.fromHour);
            fromTime.setMinutes(event.fromMinute);
        }

        if (event.isPeriod) {
            parsedEvent.period = true;
            toTime.setHours(event.toHour);
            toTime.setMinutes(event.toMinute);
        } else {
            parsedEvent.period = false;
            toTime = fromTime;
        }

        parsedEvent.from_time = fromTime.toISOString();
        parsedEvent.to_time = toTime.toISOString();

        parsedEvent.participants = event.participants;
        if (event.repeated) {
            parsedEvent.repeated = true;
            parsedEvent.repeated_type = event.repeatedType;
            parsedEvent.repeated_frequency = event.repeatedFrequency;
            parsedEvent.repeated_on = event.repeatedOn;
            parsedEvent.repeated_by = event.repeatedBy;
            parsedEvent.repeated_times = event.repeatedTimes;
            parsedEvent.repeated_end_type = event.repeatedEndType;
            parsedEvent.repeated_end_date = event.repeatedEndDate;

        } else {
            parsedEvent.repeated = false;
        }
        $.post("/platform/api/events", parsedEvent).done(data => {
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
