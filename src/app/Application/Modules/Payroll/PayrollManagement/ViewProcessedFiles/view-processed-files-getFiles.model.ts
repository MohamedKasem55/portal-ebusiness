export class ModelViewProcessedGetFiles {
  type = ''
  fileName = ''
  paymentDate = ''

  constructor(_type = '', _fileName = '', _paymentDate = '') {
    this.type = _type
    this.fileName = _fileName
    this.paymentDate = _paymentDate
  }
}
