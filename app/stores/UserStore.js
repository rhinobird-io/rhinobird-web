'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import _ from 'lodash';

if ($.mockjax) {
    $.mockjax({
        url: '/api/teams_users',
        type: 'GET',
        responseText: [
          {
            id : 1,
            name : 'team1',
            created_at : Date.now(),
            updated_at : Date.now(),
            hash : '@team1',
            users : [
              {
                id: '1',
                name: 'tomcat',
                realname: 'Tom Cat',
                hash: 'a'
              }, {
                id: '2',
                name: 'atomcat',
                realname: 'Jerry Kitty',
                hash: 'b'
              }, {
                id: '3',
                name: 'xtomcat',
                realname: 'Some Body',
                hash: 'c'
              }, {
                id: '4',
                name: 'btomcat',
                realname: '无名',
                hash: 'd'
              }]
          }
          , {
            id : 2,
            name : 'team2',
            created_at : Date.now(),
            updated_at : Date.now(),
            hash : '@team2',
            users : [
              {
                id: '1',
                name: 'tomcat',
                realname: 'Tom Cat',
                hash: 'a'
              }, {
                id: '2',
                name: 'atomcat',
                realname: 'Jerry Kitty',
                hash: 'b'
              }, {
                id: '3',
                name: 'xtomcat',
                realname: 'Some Body',
                hash: 'c'
              }]
          }
        ]
    });
}

// key: teamId, value: users, all the teams should be
let _teams_users = {};
// key: userId, value: teams
let _users_teams = {};

// key, teamId or teamhash
let _teams = {};
//
let _users = {};



let UserStore = assign({}, BaseStore, {

  /**
   * get all teams of current user can see
   * @returns {*}
   */
    getTeamsMap() {
      return _teams;
    },

    getTeamsArray() {
      var _tmp = {};
      return _.values(_teams).filter( _team => {
        if (_tmp[_team.id]) {
          return false;
        }
        _tmp[_team.id] = _team;
        return true;
      });
    },

  /**
   * get all users current user can see among all teams
   * @returns {*}
   */
    getUsersMap() {
      return _users;
    },

    getUsersArray() {
      var _tmp = {};
      return _.values(_users).filter( _user => {
        if (_tmp[_user.id]) {
          return false;
        }
        _tmp[_user.id] = _user;
        return true;
      });
    },

    getUsersByTeamId(teamId) {
      return _teams_users[teamId]?_teams_users[teamId]:[];
    },

    getTeamsByUserId(userId) {
      return _users_teams[userId]?_users_teams[userId]:[];
    },

    getChannelFromHash(channelHash) {
      return _teams[channelHash];
    },

  /**
   * @deprecated
   * @returns {*}
   */
    getTeamsUsers() {
        return _teams_users;
    },
    getUser(id){
        return _teams_users[id];
    },
    getUserByName(name){
        if(_teams_users){
            return _teams_users['1'];
        }
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let action = payload.action;
        switch (action.type) {
            case Constants.ActionTypes.LOGIN_UPDATE:
                $.get('/api/teams_users').then((data)=> {
                  let tmp = buildIndex(data);
                  _teams_users = tmp._teams_users;
                  _users_teams = tmp._users_teams;
                  _teams = tmp._teams;
                  _users = tmp._users;
                  UserStore.emitChange();
                });
                break;
            default:
                break;
        }
    })

});

function buildIndex(teams_users) {
  var _teams_users = {};
  var _users_teams = {};
  var _teams = {};
  var _users = {};
  teams_users.forEach(team => {
    // build _teams_users
    _teams_users[team.id] = team.users;

    // build _users_teams and _users
    team.users.forEach(user => {
      _users_teams[user.id] = _users_teams[user.id]?_users_teams[user.id].push(team) : [team,];
      _users[user.id] = user;
    });

    // build teams
    _teams[team.id] = team;
    _teams[team.hash] = team;
  });

  return {
    _teams_users : _teams_users,
    _users_teams : _users_teams,
    _users : _users,
    _teams : _teams
  }
}

export default UserStore;
