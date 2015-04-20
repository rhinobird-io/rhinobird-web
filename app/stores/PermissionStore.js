'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

const ActionTypes = Constants.PermissionActionTypes;

let _operators = {};
let _patterns = {};
let _permissions = [];
let _roles = {};
let _tags = {};

let PermissionStore = assign({}, BaseStore, {

  getOperators() { return _operators; },

  getPatterns() { return _patterns; },

  getPermissions() { return _permissions; },

  getRoles() { return _roles; },

  getTags() { return _tags; },

  dispatcherIndex: AppDispatcher.register(payload => {
    let action = payload.action;
    switch (action.type) {

      case ActionTypes.RECEIVE_TAGS:
        _tags = {};
        action.tags.map(tag => {
          _tags[tag.id] = tag;
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.ADD_TAG:
        _tags[action.tagId] = {
          id: action.tagId,
          name: action.tagName
        };
        PermissionStore.emitChange();
        break;

      case ActionTypes.DELETE_TAG:
        delete _tags[action.tagId];
        PermissionStore.emitChange();
        break;

      case ActionTypes.UPDATE_TAG:
        _tags[action.tagId].name = action.tagName; 
        PermissionStore.emitChange();
        break;

      case ActionTypes.RECEIVE_PERMISSIONS:
        _permissions = action.permissions;
        PermissionStore.emitChange();
        break;

      case ActionTypes.RECEIVE_PATTERNS:
        _patterns = {};
        action.patterns.map(pattern => {
          _patterns[pattern.id] = pattern;
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.ADD_PATTERN:
        let patternId = action.patternId;
        _patterns[patternId] = action.form;
        _patterns[patternId].id = patternId;
        PermissionStore.emitChange();
        break;

      case ActionTypes.UPDATE_PATTERN:
        Object.keys(action.form).map(k => {
          _patterns[action.patternId][k] = action.form[k];
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.DELETE_PATTERN:
        delete _patterns[action.patternId];
        PermissionStore.emitChange();
        break;

      case ActionTypes.RECEIVE_ROLES:
        _roles = {};
        action.roles.map(role => {
          _roles[role.id] = role;
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.ADD_ROLE:
        let roleId = action.roleId;
        _roles[roleId] = action.form;
        _roles[roleId].id = roleId;
        PermissionStore.emitChange();
        break;

      case ActionTypes.UPDATE_ROLE:
        console.log(action.roleId);
        Object.keys(action.form).map(k => {
          _roles[action.roleId][k] = action.form[k];
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.DELETE_ROLE:
        delete _roles[action.roleId];
        PermissionStore.emitChange();
        break;

      case ActionTypes.RECEIVE_OPERATORS:
        _operators = {};
        action.operators.map(operator => {
          _operators[operator.id] = operator;
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.ADD_OPERATOR:
        _operators[action.form.id] = action.form;
        PermissionStore.emitChange();
        break;

      case ActionTypes.UPDATE_OPERATOR:
        Object.keys(action.form).map(k => {
          _operators[action.operatorId][k] = action.form[k];
        });
        PermissionStore.emitChange();
        break;

      case ActionTypes.DELETE_OPERATOR:
        delete _operators[action.operatorId];
        PermissionStore.emitChange();
        break;

      default:
        break;
    }
  })

});

export default PermissionStore;
