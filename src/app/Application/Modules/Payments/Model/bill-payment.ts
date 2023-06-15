export class BillPayment {
  billerName: string
  billRef: string
  nickName: string
  originalAmount: number
  updatedAmount: number
  withOutVatAmount: number
  vatAmount: number
  dueDate: Date
  status: string
  status1: string
  statusTrans: string
  billPaymentDetailsPk: number
  showSave: boolean
  addDescriptionEn: string
  addDescriptionAr: string
  applyVat: string
  partial: any
  advanced: boolean
  futureSecurityLevelsDTOList: any

  constructor(
    billPaymentDetailsPk: number,
    billerName: string,
    billRef: string,
    nickName: string,
    originalAmount: number,
    updatedAmount: number,
    withOutVatAmount: number,
    vatAmount: number,
    dueDate: Date,
    status: string,
    showSave: boolean,
    advanced: boolean,
    _addDescriptionEn: string,
    _addDescriptionAr: string,
    applyVat: string,
    partial: string,
    securiteLevels: any,
  ) {
    this.billPaymentDetailsPk = billPaymentDetailsPk
    this.billerName = billerName
    if (billRef) {
      billRef = billRef.trim()
    }
    this.billRef = billRef
    this.nickName = nickName
    this.originalAmount = originalAmount
    this.updatedAmount = updatedAmount
    this.withOutVatAmount = withOutVatAmount
    this.vatAmount = vatAmount
    if (!(dueDate.constructor.name === 'Date')) {
      this.dueDate = new Date(dueDate)
    } else {
      this.dueDate = dueDate
    }
    this.status = status
    this.advanced = advanced
    this.showSave = showSave
    this.addDescriptionEn = _addDescriptionEn
    this.addDescriptionAr = _addDescriptionAr
    this.applyVat = applyVat
    this.partial = partial
    this.futureSecurityLevelsDTOList = securiteLevels
    if (originalAmount > 0) {
      this.status = 'D'
    } else {
      if (advanced) {
        this.status = 'A'
      } else {
        this.status = 'P'
      }
    }
  }
}
