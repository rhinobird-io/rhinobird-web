'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

const ActionTypes = Constants.EmployeeActionTypes;

let _employees = [];
let _filters = {};

function matchFilters(employee) {
  let result = true;
  for (let k in _filters) {
    result = result && (employee[k] === _filters[k]);
  }
  return result;
}

let EmployeeStore = assign({}, BaseStore, {

  getFamilyByID(id, filtered) {
    let result = [];
    let employee = _employees.filter(u => u.id === id)[0];
    if (!filtered || matchFilters(employee)) {
      result.push(employee);
    }
    let family = employee.family;
    for (let i = 0; i < family.length; i++) {
      if (!filtered || matchFilters(family[i])) {
        result.push(family[i]);
      }
    }
    return result;
  },

  getAll(filtered) {
    if (filtered) {
      let result = [];
      for (let i = 0; i < _employees.length; i++) {
        let provider = true;
        if (matchFilters(_employees[i])) {
          _employees[i]._provider = _employees[i];
          provider = false;
          result.push(_employees[i]);
        }
        let family = _employees[i].family;
        for (let j = 0; j < family.length; j++) {
          if (matchFilters(family[j])) {
            if (provider) {
              family[j]._provider = _employees[i];
              provider = false;
            } else {
              delete family[j]._provider;
            }
            result.push(family[j]);
          }
        }
      }
      return result;
    } else {
      return _employees;
    }
  }, 

  dispatcherIndex: AppDispatcher.register(payload => {
    let action = payload.action;
    switch (action.type) {
      case ActionTypes.RECEIVE_ALL_EMPLOYEES:
        _employees = action.employees;
        EmployeeStore.emitChange();
        break;
      
      case ActionTypes.ADD_EMPLOYEE:
        _employees.push(action.employee);
        EmployeeStore.emitChange();
        break;
      
      case ActionTypes.ADD_FAMILY_MEMBER:
        _employees.forEach(function(u) {
          if (u.id === action.employeeId) {
            u.family.push(action.familyMember);
          }
        });
        EmployeeStore.emitChange();
        break;
      
      case ActionTypes.UPDATE_EMPLOYEE:
        for (let i = 0; i < _employees.length; i++) {
          if (_employees[i].id === action.employee.id) {
            _employees[i] = action.employee;
            break;
          }
        }
        EmployeeStore.emitChange();
        break;

      case ActionTypes.UPDATE_FAMILY_MEMBER:
        for (let i = 0; i < _employees.length; i++) {
          let updated = false;
          if (_employees[i].id === action.employeeId) {
            for (let j = 0; j < _employees[i].family.length; j++) {
              if (_employees[i].family[j].id === action.familyMemberId) {
                _employees[i].family[j] = action.familyMember;
                updated = true;
                break;
              }
            }
          }
          if (updated) {
            break;
          }
        }
        EmployeeStore.emitChange();
        break;

      case ActionTypes.DELETE_EMPLOYEE:
        for (let i = 0; i < _employees.length; i++) {
          if (_employees[i].id === action.employeeId) {
            _employees.splice(i, 1);
            break;
          }
        }
        EmployeeStore.emitChange();
        break;
      
      case ActionTypes.DELETE_FAMILY_MEMBER:
        for (let i = 0; i < _employees.length; i++) {
          let deleted = false;
          if (_employees[i].id === action.employeeId) {
            for (let j = 0; j < _employees[i].family.length; j++) {
              if (_employees[i].family[j].id === action.familyMemberId) {
                _employees[i].family.splice(j, 1);
                deleted = true;
                break;
              }
            }
          }
          if (deleted) {
            break;
          }
        }
        EmployeeStore.emitChange();
        break;
      
      case ActionTypes.REGISTER_MYNUMBER:
        let ids = action.ids;
        let employee = _employees.filter(u => u.id === action.employeeId)[0];
        for (let i = 0; i < ids.length; i++) {
          if (ids[i] === employee.id) {
            employee.mynumberRegistered = true;
          } else {
            employee.family.filter(u => u.id === ids[i])[0].mynumberRegistered = true;
          }
        }
        EmployeeStore.emitChange();
        break;

      case ActionTypes.FILTER_EMPLOYEES:
        _filters = action.filters;
        EmployeeStore.emitChange();
        break;

      default:
        break;
    }
  })

});

export default EmployeeStore;