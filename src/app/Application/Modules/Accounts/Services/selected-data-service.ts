import { Injectable } from '@angular/core'
import { Account } from '../../../Model/account'

@Injectable()
export class SelectedDataService {
  data: any = null
  form: any
  currentAccount: Account
  customerName = ''
  allTerminalsSearch = false

  private _availableAccounts: Account[] = []

  getData() {
    return this.data
  }

  setData(_data) {
    this.data = _data
  }

  getForm() {
    return this.form
  }

  setForm(form) {
    this.form = form
  }

  setCustomerName(name) {
    this.customerName = name
  }

  getCustomerName() {
    return this.customerName
  }

  setModelServiceCurrentAccount(form) {
    this.currentAccount = form
  }

  getModelServiceCurrentAccount() {
    return this.currentAccount
  }

  clearModelServiceCurrentAccount() {
    this.currentAccount = null
  }

  clear() {
    this.data = null
    this.form = null
  }

  public setAvailableAccounts(accounts: Account[]): void {
    this._availableAccounts = []
    accounts.forEach((acc) => this._availableAccounts.push(acc))
  }

  public getAvailableAccounts(): Account[] {
    return this._availableAccounts
  }
}
