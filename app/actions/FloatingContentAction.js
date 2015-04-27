'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {

    updateFloatingContent(content) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.FLOATING_CONTENT_UPDATE,
            floatingContent: content
        });
    }
};
