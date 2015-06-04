'use strict';

const assign = require('object-assign');
const EventEmitter = require('events').EventEmitter;

const REDIRECT_EVENT = 'redirect';

module.exports = assign({}, EventEmitter.prototype, {
    addRedirectListener(callback) {
        this.on(REDIRECT_EVENT, callback);
    },

    removeRedirectListener(callback) {
        this.removeListener(REDIRECT_EVENT, callback);
    },

    emitRedirect(path) {
        this.emit(REDIRECT_EVENT, path);
    }
});
