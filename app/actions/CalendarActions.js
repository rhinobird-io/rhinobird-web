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
            console.log(data);
        }).fail(e => {
            console.log(data);
            console.error(e);
        });
    }
};
