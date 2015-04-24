'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import Util from '../util.jsx';
import async from 'async';

if ($.mockjax) {
  $.mockjax({
    url: '/platform/users/1/teams',
    type: 'GET',
    responseText: [{
      id: '1',
      name: 'team 1',
      hash : '@team1'
    }, {
      id: '2',
      name: 'team 2',
      hash : '@team2'
    }]
  });

  $.mockjax({
    url: '/platform/teams/1/users',
    type: 'GET',
    responseText: {
      '1': {
        id: '1',
        name: 'tomcat',
        realname: 'Tom Cat',
        hash: 'a'
      },

      '2': {
        id: '2',
        name: 'atomcat',
        realname: 'Jerry Kitty',
        hash: 'b'
      },

      '3': {
        id: '3',
        name: 'xtomcat',
        realname: 'Some Body',
        hash: 'c'
      },

      '4': {
        id: '4',
        name: 'btomcat',
        realname: '无名',
        hash: 'd'
      }
    }
  });
}

export default {
  getAllChannels(user) {
    return $.get('/platform/users/' + user.id + '/teams')
      .done(teams => {
        AppDispatcher.handleServerAction({
          type: Constants.ChannelActionTypes.RECEIVE_ALL,
          user : {
            id : user.id
          },
          teams : {
            publicGroupChannels : teams,
            privateGroupChannels : [],
            directMessageChannels : []
          }
        });
      }).fail(Util.handleError);

  }
};
