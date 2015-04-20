'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

const ActionTypes = Constants.EmployeeActionTypes;

export default {

  receiveAllEmployees(employees) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ALL_EMPLOYEES,
      employees: employees
    });
  },

  addEmployee(employee) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_EMPLOYEE,
      employee: employee
    });
  },

  addFamilyMember(employeeId, familyMember) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.ADD_FAMILY_MEMBER,
      employeeId: employeeId,
      familyMember: familyMember
    });
  },

  updateEmployee(employee) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_EMPLOYEE,
      employee: employee
    });
  },

  confirmRegistration(employeeId, ids) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REGISTER_MYNUMBER,
      employeeId: employeeId,
      ids: ids
    });
  },

  updateFamilyMember(employeeId, familyMemberId, familyMember) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.UPDATE_FAMILY_MEMBER,
      employeeId: employeeId,
      familyMemberId: familyMemberId,
      familyMember: familyMember
    });
  },

  deleteEmployee(employeeId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_EMPLOYEE,
      employeeId: employeeId
    });
  },

  deleteFamilyMember(employeeId, familyMemberId) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.DELETE_FAMILY_MEMBER,
      employeeId: employeeId,
      familyMemberId: familyMemberId
    });
  },

  filterEmployees(filters) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FILTER_EMPLOYEES,
      filters: filters
    });
  }

};
