import { Injectable } from '@angular/core'

@Injectable()
export class SelectedUserRenewalAlertDataService {
  users: any
  account: any
  datos: any
  confirm: any

  getUsers() {
    return this.users
  }

  setUsers(_users) {
    this.users = _users
  }

  setAccount(_account) {
    this.account = _account
  }

  getAccount() {
    return this.account
  }

  getDatos() {
    return this.datos
  }

  setDatos(_datos) {
    this.datos = _datos
  }

  getConfirm() {
    return this.confirm
  }

  setConfirm(_confirm) {
    this.confirm = _confirm
  }

  clear() {
    this.datos = null
    this.users = null
    this.account = null
    this.confirm = null
  }
}
