'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
if ($.mockjax) {
    $.mockjax({
        url: '/api/teams_users',
        type: 'GET',
        responseText: {'1':{
            id: '1',
            name: 'tomcat',
            realname: 'Tom Cat',
            hash: 'a'
        }, '2': {
            id: '2',
            name: 'atomcat',
            realname: 'Jerry Kitty',
            hash: 'b'
        }, '3': {
            id: '3',
            name: 'xtomcat',
            realname: 'Some Body',
            hash: 'c'
        }, '4': {
            id: '4',
            name: 'btomcat',
            realname: '无名',
            hash: 'd'
        }}
    });
}

let _teams_users;


let UserStore = assign({}, BaseStore, {

    getTeamsUsers() {
        return _teams_users;
    },
    getUser(id){
        return _teams_users[id];
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        switch (payload.type) {
            case Constants.ActionTypes.LOGIN_UPDATE:
                $.get('/api/teams_users').then((data)=> {
                    _teams_users = data;
                    UserStore.emitChange();
                });
                break;
            default:
                break;
        }
    })

});

export default UserStore;
