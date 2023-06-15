export class ModelFeedbacktBill {
  accountFrom: number
  billerName: string
  billRef: number
  enteredAmount: number
  billProcess: string
  status: string

  constructor(
    accountFrom: number,
    billerName: string,
    billRef: number,
    enteredAmount: number,
    billProcess: string,
    status: string,
  ) {
    this.accountFrom = accountFrom
    this.billerName = billerName
    this.billRef = billRef
    this.enteredAmount = enteredAmount
    this.billProcess = billProcess
    this.status = status
  }
}
