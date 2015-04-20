const keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    ADD_TASK: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAIL: null
  }),

  EmployeeActionTypes: keyMirror({
    RECEIVE_ALL_EMPLOYEES: null,
    ADD_EMPLOYEE: null,
    ADD_FAMILY_MEMBER: null,
    UPDATE_EMPLOYEE: null,
    UPDATE_FAMILY_MEMBER: null,
    DELETE_EMPLOYEE: null,
    DELETE_FAMILY_MEMBER: null,
    FILTER_EMPLOYEES: null,
    REGISTER_MYNUMBER: null
  }),

  PermissionActionTypes: keyMirror({
    RECEIVE_PERMISSIONS: null,
    RECEIVE_PATTERNS: null,
    RECEIVE_TAGS: null,
    RECEIVE_ROLES: null,
    RECEIVE_OPERATORS: null,
    ADD_PATTERN: null,
    ADD_ROLE: null,
    ADD_TAG: null,
    ADD_OPERATOR: null,
    UPDATE_PATTERN: null,
    UPDATE_TAG: null,
    UPDATE_ROLE: null,
    UPDATE_OPERATOR: null,
    DELETE_PATTERN: null,
    DELETE_TAG: null,
    DELETE_ROLE: null,
    DELETE_OPERATOR: null
  }),
  
  CompanyActionTypes: keyMirror({
    RECEIVE_ALL: null,
    UPDATE_ANY: null,
    ADD_IP: null,
    UPDATE_IP: null,
    DELETE_IP: null,
    CONNECT_MKS: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
