export default (() => {

  if (!$.mockjax) return false;
  const API = "/platform/api";

  $.mockjax({
    url: API + "/users/*/notifications",
    type: "GET",
    responseText: [
        {
          "checked": true,
          "content": "Invited you to the event Test vity meeting",
          "created_at": "2015-03-04T02:32:39.620Z",
          "from_user_id": 1,
          "id": 131,
          "updated_at": "2015-03-06T02:47:16.037Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "You have created an event This is cool",
          "created_at": "2015-03-03T06:31:02.820Z",
          "from_user_id": 4,
          "id": 127,
          "updated_at": "2015-03-06T02:47:18.828Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event Team Work project review & planning",
          "created_at": "2015-03-03T06:23:02.365Z",
          "from_user_id": 1,
          "id": 122,
          "updated_at": "2015-03-06T02:47:18.878Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Your event Test notification will start in ten minutes.",
          "created_at": "2015-03-03T06:13:25.125Z",
          "from_user_id": 4,
          "id": 114,
          "updated_at": "2015-03-06T02:47:18.915Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event tn",
          "created_at": "2015-03-03T06:12:12.199Z",
          "from_user_id": 1,
          "id": 106,
          "updated_at": "2015-03-06T02:47:18.964Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event Test notification",
          "created_at": "2015-03-03T06:08:56.815Z",
          "from_user_id": 1,
          "id": 98,
          "updated_at": "2015-03-06T02:48:03.276Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "You have created an event Mar 03 by wiza",
          "created_at": "2015-03-03T05:43:48.152Z",
          "from_user_id": 4,
          "id": 94,
          "updated_at": "2015-03-06T02:48:03.301Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event Test notification",
          "created_at": "2015-03-02T09:20:13.186Z",
          "from_user_id": 1,
          "id": 76,
          "updated_at": "2015-03-09T10:36:59.011Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event Test",
          "created_at": "2015-03-02T02:42:39.273Z",
          "from_user_id": 1,
          "id": 66,
          "updated_at": "2015-03-09T10:36:59.051Z",
          "url": null,
          "user_id": 4
        },
        {
          "checked": true,
          "content": "Invited you to the event Test",
          "created_at": "2015-03-02T02:35:48.558Z",
          "from_user_id": 1,
          "id": 57,
          "updated_at": "2015-03-09T10:36:59.076Z",
          "url": null,
          "user_id": 4
        }
    ]
  });

})();
