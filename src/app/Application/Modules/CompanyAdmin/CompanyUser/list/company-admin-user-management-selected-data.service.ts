import { Injectable } from '@angular/core'

@Injectable()
export class CompanyAdminUserManagementSelectedDataService {
  selectedUser: any = null

  form: any

  userData: any = null

  constructor() {}

  getSelectedUser() {
    return this.selectedUser
  }

  setSelectedUser(selectedUser) {
    this.selectedUser = selectedUser
  }

  getFormData() {
    return this.userData
  }

  setFormData(data) {
    this.userData = data
  }

  getForm() {
    return this.form
  }

  setForm(form) {
    this.form = form
  }

  clear() {
    this.selectedUser = null
    this.userData = null
    this.form = null
  }
}
