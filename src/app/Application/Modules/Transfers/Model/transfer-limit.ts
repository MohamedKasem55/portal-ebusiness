import { Account } from 'app/Application/Model/account'

export class TransferLimit {
  accountList: Array<Account>
  accountListTo: Array<Account>
  transferLimit: number

  constructor(_tranferLimit: number) {
    this.transferLimit = _tranferLimit
    this.accountList = []
    this.accountListTo = []
  }
}
