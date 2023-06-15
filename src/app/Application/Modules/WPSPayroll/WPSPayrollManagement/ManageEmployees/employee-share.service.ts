import { Injectable } from '@angular/core'

@Injectable()
export class EmployeeShareService {
  dataInit = {}
  departments = []

  getDataInit() {
    return this.dataInit
  }

  setDataInit(data) {
    this.dataInit = data
  }

  clearDataInit() {
    this.dataInit = {}
  }

  getDepartments() {
    return this.departments
  }

  setDepartments(departments) {
    this.departments = departments
  }

  clearDepartments() {
    this.departments = []
  }
}
