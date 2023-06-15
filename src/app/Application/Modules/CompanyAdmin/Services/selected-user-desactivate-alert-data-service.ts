import { Injectable } from '@angular/core'

@Injectable()
export class SelectedUserDesactivateAlertDataService {
  users: any
  account: any
  datos: any

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
  clear() {
    this.datos = null
    this.users = null
    this.account = null
  }
}
