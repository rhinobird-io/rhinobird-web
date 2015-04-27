import uuid from 'node-uuid';

export default (() => {

  if (!$.mockjax) return false;
  const API = "/platform/api";
  var first = 60;
  $.mockjax({
    url: '/api/channels/1/messages?beforeId=-1&limit=20',
    type: 'GET',
    responseText: [{
      id: '' + (first - 1),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 2),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 3),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 4),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 5),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 6),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 7),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 8),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 9),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 10),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 11),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 12),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 13),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 14),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 15),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 16),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 17),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 18),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 19),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }, {
      id: '' + (first - 20),
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }]
  });

  $.mockjax({
    url: '/api/channels/2/messages?beforeId=-1&limit=20',
    type: 'GET',
    responseText: []
  });

})();
