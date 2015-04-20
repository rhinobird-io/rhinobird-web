'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

let ActionTypes = Constants.PermissionActionTypes;

export default {

  receiveTags(tags) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_TAGS,
      tags: tags
    });
  },

  addTag(tagId, tagName) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_TAG,
      tagId: tagId,
      tagName: tagName
    });
  },

  deleteTag(tagId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_TAG,
      tagId: tagId
    });
  },

  updateTag(tagId, tagName) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_TAG,
      tagId: tagId,
      tagName: tagName
    });
  },

  receivePermissions(permissions) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_PERMISSIONS,
      permissions: permissions
    });
  },

  receivePatterns(patterns) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_PATTERNS,
      patterns: patterns
    });
  },

  addPattern(patternId, form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_PATTERN,
      patternId: patternId,
      form: form
    });
  },

  updatePattern(patternId, form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_PATTERN,
      patternId: patternId,
      form: form
    });
  },

  deletePattern(patternId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_PATTERN,
      patternId: patternId
    });
  },

  receiveRoles(roles) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ROLES,
      roles: roles
    });
  },

  addRole(roleId, form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_ROLE,
      roleId: roleId,
      form: form
    });
  },

  updateRole(roleId, form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_ROLE,
      roleId: roleId,
      form: form
    });
  },

  deleteRole(roleId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_ROLE,
      roleId: roleId
    });
  },

  receiveOperators(operators) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_OPERATORS,
      operators: operators
    });
  },

  addOperator(form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_OPERATOR,
      form: form
    });
  },

  updateOperator(operatorId, form) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_OPERATOR,
      operatorId: operatorId,
      form: form
    });
  },

  deleteOperator(operatorId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_OPERATOR,
      operatorId: operatorId
    });
  }

};
