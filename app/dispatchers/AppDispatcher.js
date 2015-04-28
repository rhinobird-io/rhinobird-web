'use strict';
const Dispatcher = require('flux').Dispatcher;
const Constants = require('../constants/AppConstants');
const assign = require('object-assign');

let AppDispatcher = assign(new Dispatcher(), {

});

module.exports = AppDispatcher;
