'use strict';

export default {
  handleError : function(xhr, fail) {
    if (fail === undefined) return;
    if (xhr.responseJSON && xhr.responseJSON.message) {
      fail("error." + xhr.responseJSON.message);
    } else {
      fail("error." + xhr.status);
    }
  }
}
