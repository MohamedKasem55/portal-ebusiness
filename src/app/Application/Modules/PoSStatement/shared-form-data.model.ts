export class FormData {
  accounts: any[] = []
  chequeBookType: string[] = []
  account = ''
  chequeType: string

  deleteData() {
    this.accounts = [{}]
    this.chequeBookType = []
    this.account = ''
    this.chequeType = ''
  }
}
