"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").CalendarActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _events = {};

function _formatDate(date) {
    let d = new Date(date);
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString();
    var dd  = d.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}


let CalendarStore = assign({}, BaseStore, {

    getAllEvents() {
        return _events;
    },


    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        console.log(type)
        switch (type) {
            case ActionTypes.RECEIVE_EVENTS:
                for (let i = 0; i < data.length; i++) {
                    let dateFormat = _formatDate(data[i].from_time);
                    if (!_events[dateFormat]) {
                        _events[dateFormat] = [];
                    }
                    _events[dateFormat].push(data[i]);
                }
                break;

            default:
                break;
        }

        CalendarStore.emitChange();
    })

});

export default CalendarStore;
