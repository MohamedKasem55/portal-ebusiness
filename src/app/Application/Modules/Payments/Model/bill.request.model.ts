export class ModelrequestBill {
  initiationdate: Date
  accountFrom: string
  billerNameAr: string
  billerNameEn: string
  billerName: string
  billRef: number
  nickName: string
  originalAmount: number
  enteredAmount: number
  withOutVatAmount: number
  vatAmount: number
  currentLevel: string
  nextLevel: string
  status: string

  constructor(
    initiationdate: Date,
    accountFrom: string,
    billerNameAr: string,
    billerNameEn: string,
    billRef: number,
    nickName: string,
    originalAmount: number,
    enteredAmount: number,
    withOutVatAmount: number,
    vatAmount: number,
    currentLevel: string,
    nextLevel: string,
    status: string,
  ) {
    this.initiationdate = initiationdate
    this.accountFrom = accountFrom
    this.billerNameAr = billerNameAr
    this.billerNameEn = billerNameEn
    this.billRef = billRef
    this.nickName = nickName
    this.originalAmount = originalAmount
    this.enteredAmount = enteredAmount
    this.withOutVatAmount = withOutVatAmount
    this.vatAmount = vatAmount
    this.currentLevel = currentLevel
    this.nextLevel = nextLevel
    this.status = status
  }
}
