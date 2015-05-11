'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import _ from 'lodash';

if ($.mockjax) {
    $.mockjax({
        url: '/platform/api/teams_users',
        type: 'GET',
        responseText: [
            {
                id: 1,
                name: 'team1',
                created_at: Date.now(),
                updated_at: Date.now(),
                users: [
                    {
                        id: '1',
                        name: 'tomcat',
                        email: 'tom@cat.pet',
                        realname: 'Tom Cat',
                    }, {
                        id: '2',
                        name: 'atomcat',
                        email: 'tom@cat.pet',
                        realname: 'Jerry Kitty',
                    }, {
                        id: '3',
                        name: 'xtomcat',
                        email: 'tom@cat.pet',
                        realname: 'Some Body',
                    }, {
                        id: '4',
                        name: 'btomcat',
                        email: 'tom@cat.pet',
                        realname: '无名',
                    }]
            }
            , {
                id: 2,
                name: 'team2',
                created_at: Date.now(),
                updated_at: Date.now(),
                users: [
                    {
                        id: '1',
                        name: 'tomcat',
                        email: 'tom@cat.pet',
                        realname: 'Tom Cat',
                    }, {
                        id: '2',
                        name: 'atomcat',
                        email: 'tom@cat.pet',
                        realname: 'Jerry Kitty',
                    }, {
                        id: '3',
                        email: 'tom@cat.pet',
                        name: 'xtomcat',
                        realname: 'Some Body',
                    }]
            }
        ]
    });
}

// key: teamId, value: users, all the teams should be
let _teams_users = {};
// key: userId, value: teams
let _users_teams = {};

// key, teamId
let _teams = {};
//
let _users = {};

let _username_users = {};

let UserStore = assign({}, BaseStore, {

    /**
     * get all teams of current user can see
     * @returns {*}
     */
        getTeamsMap() {
        return _teams;
    },

    getTeamsArray() {
        return Object.values(_teams);
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
        return _.values(_users).filter(_user => {
            if (_tmp[_user.id]) {
                return false;
            }
            _tmp[_user.id] = _user;
            return true;
        });
    },

    getUsersByTeamId(teamId, includeSub) {
        let team = _teams[teamId];
        let result = new Set(team.users || []);
        if (!includeSub) {
            return Array.from(result);
        }
        team.teams.forEach(team => {
            let subResult = this.getUsersByTeamId(team.id, true);
            result = new Set([...result, ...subResult]);
        })
        return Array.from(result);
    },

    getTeamsByUserId(userId) {
        return _users_teams[userId] ? _users_teams[userId] : [];
    },

    getTeam(id) {
        return _teams[id];
    },

    /**
     * @deprecated
     * @returns {*}
     */
        getTeamsUsers() {
        return _teams_users;
    },
    getUser(id){
        return _users[id];
    },
    getUserByName(name){
        return _username_users[name];
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ActionTypes.LOGIN_UPDATE:
            case Constants.ActionTypes.USER_UPDATE:
                $.get('/platform/api/teams_users').then((data)=> {
                    let tmp = buildIndex(data);
                    _teams_users = tmp._teams_users;
                    _users_teams = tmp._users_teams;
                    _teams = tmp._teams;
                    _users = tmp._users;
                    _username_users = tmp._username_users;
                    UserStore.emitChange();
                });
                break;
            default:
                break;
        }
    })

});

const md5 = require('blueimp-md5');

function _setTeamLevel(team) {
    if (team.level) {
        return team.level;
    }
    else if (team.teams.length === 0) {
        team.level = 1;
        return 1;
    } else {
        let level = Math.max.apply(null, team.teams.map(t => _setTeamLevel(t))) + 1;
        team.level = level;
        return level;
    }
}
function buildIndex(teams_users) {
    var _teams_users = {};
    var _users_teams = {};
    var _teams = {};
    var _users = {};
    var _username_users = {};
    teams_users.forEach(team => {
        let linkedUsers = [];
        // build _users_teams and _users
        team.users.forEach(user => {
            _users_teams[user.id] = _users_teams[user.id] || [];
            _users_teams[user.id].push(team);
            user = _users[user.id] || user;
            user.emailMd5 = user.emailMd5 || md5(user.email);

            //Avoid duplicated user
            linkedUsers.push(user);

            user.teams = user.teams || [];
            user.teams.push(team);
            _users[user.id] = user;
            _username_users[user.name] = user;
        });
        //Avoid duplicated user
        team.users = linkedUsers;
        team.parentTeams = [];

        // build teams
        _teams[team.id] = team;
    });
    Object.values(_teams).forEach(team => {
        team.teams = team.teams.map(sub_team_id => {
            _teams[sub_team_id].parentTeams.push(team);
            return _teams[sub_team_id];
        });
    });

    //Calculate team level
    Object.values(_teams).forEach(team => {
        _setTeamLevel(team);
    });


    return {
        _teams_users: _teams_users,
        _users_teams: _users_teams,
        _users: _users,
        _teams: _teams,
        _username_users: _username_users
    }
}

export default UserStore;
