'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {
    search(query) {
        if (query === null || query.length === 0) {
            return;
        }
        $.get("/platform/api/search/" + query).done(data => {
            AppDispatcher.dispatch({
                type: Constants.SearchActionTypes.SEARCH,
                data: data
            });
        }).fail(e => {
            console.error(e);
        });

    }
};
