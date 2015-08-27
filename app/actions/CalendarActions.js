'use strict';

const AppDispatcher       = require('../dispatchers/AppDispatcher');
const CalendarStore       = require('../stores/CalendarStore');
const CalendarActionTypes = require("../constants/AppConstants").CalendarActionTypes;

require("./mockjax/events.js");

let CalendarAction =  {
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
        let event = CalendarStore.getEvent(id, repeatedNumber);
        if (event !== null) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.RECEIVE_EVENT,
                data: event
            });
        } else {
            $.get(`/platform/api/events/${id}/${repeatedNumber}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENT,
                    data: data
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    receiveByFourDays(date, success) {
        let days = new Date(date).fourDays();
        if (CalendarStore.isDaysLoaded(days)) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_VIEW
            });
        } else {
            $.get(`/platform/api/events/fourDays/${date}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENTS_BY_FOUR_DAYS,
                    data: data,
                    date: days
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    receiveByDay(date, success) {
        if (CalendarStore.isDayLoaded(date)) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_VIEW
            });
        } else {
            $.get(`/platform/api/events/day/${date}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENTS_BY_DAY,
                    data: data,
                    date: date
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    receiveByMonth(date, success) {
        if (CalendarStore.isMonthLoaded(date)) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_VIEW
            });
        } else {
            $.get(`/platform/api/events/month/${date}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENTS_BY_MONTH,
                    data: data,
                    date: date
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    receiveByCalendarMonth(date, success) {
        if (CalendarStore.isMonthLoaded(date)) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_VIEW
            });
        } else {
            $.get(`/platform/api/events/calendarMonth/${date}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENTS_BY_MONTH,
                    data: data,
                    date: date
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    receiveByWeek(date, success) {
        if (CalendarStore.isWeekLoaded(date)) {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_VIEW
            });
        } else {
            $.get(`/platform/api/events/week/${date}`).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RECEIVE_EVENTS_BY_WEEK,
                    data: data,
                    date: date
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    deleteEvent(data, success) {
        let id = data.id;
        let repeatedNumber = data.repeatedNumber;

        if (id === null || id === undefined) {
            return;
        }

        let url = `/platform/api/events/${id}`;
        if (repeatedNumber) {
            url += `/${repeatedNumber}`;
        }

        $.ajax({
            url: url,
            type: "delete"
        }).done(() => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.DELETE_EVENT,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail((e) => {
            console.log(e);
        }).always(() => {
            console.log("always");
        });
    },

    undoLastDeletion(lastDeletion, success) {
        let id = lastDeletion.id;
        let repeatedNumber = lastDeletion.repeatedNumber;
        if (id) {
            let url = `/platform/api/events/restore/${id}`;
            if (repeatedNumber) {
                url += `/${repeatedNumber}`;
            }
            $.ajax({
                url: url,
                type: "put"
            }).done(data => {
                AppDispatcher.dispatch({
                    type: CalendarActionTypes.RESTORE_DELETED_EVENT,
                    data: data
                });
                if (success && typeof success === "function") {
                    success();
                }
            }).fail((e) => {
                console.log(e);
            }).always(() => {
                console.log("always");
            });
        }
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
        let _from = new Date(event.fromDate);
        let _to = new Date(event.toDate);

        parsedEvent.title = event.title;
        parsedEvent.description = event.description;
        parsedEvent.full_day = event.fullDay;

        if (!parsedEvent.full_day) {
            _from = global.toolkits.mergeDateWithTime(_from, new Date(event.fromTime))

            if (event.isPeriod) {
                parsedEvent.period = true;
                _to = global.toolkits.mergeDateWithTime(_to, new Date(event.toTime));
            } else {
                parsedEvent.period = false;
                _to = _from;
            }
        } else {
            _from = global.toolkits.startOfDate(_from);

            if (event.isPeriod) {
                parsedEvent.period = true;
                _to = global.toolkits.endOfDate(_to);
            } else {
                parsedEvent.period = false;
                _to = _from;
            }
        }

        parsedEvent.from_time = _from.toISOString();
        parsedEvent.to_time = _to.toISOString();

        parsedEvent.participants = event.participants || { teams: [], users: [] };

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
    },

    update(event, success, fail) {
        $.ajax({
            url: `/platform/api/events/${event.id}`,
            type: "put",
            data: event
        }).done(data => {
            AppDispatcher.dispatch({
                type: CalendarActionTypes.UPDATE_EVENT,
                data: data
            });
            console.log(data);
            if (success && typeof success === "function") {
                success();
            }
        }).fail((e) => {
            console.log(e);
        }).always(() => {
        });
    }

};

module.exports = CalendarAction;
