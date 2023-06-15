import { Page } from '../../Model/page'

export interface AccountDigits {
  digit1?: number
  digit2?: number
  digit3?: number
  digit4?: number
  digit5?: number
  digit13?: number
  digit14?: number
  digit15?: number
  digit16?: number
}

// tslint:disable-next-line: max-classes-per-file
export class BatchListsContainer {
  notAllowed: []
  toAuthorize: []
  toProcess: []
}

// tslint:disable-next-line: max-classes-per-file
export class ListWithSelect {
  id: number
  targetsData: TargetsData[]
}
// tslint:disable-next-line: max-classes-per-file
export class TargetList {
  targetsData: TargetsData[]
}

// tslint:disable-next-line: max-classes-per-file
export class Category {
  key: number
  value: string
}

// tslint:disable-next-line: max-classes-per-file
export class TransactionDetails {
  id: number
  merchant: string
  amount: number
  balanceAfter: number
  date: Date
  time: Date
  category: string
  channel: string
  constructor(
    _id: number,
    _merchant: string,
    _amount: number,
    _balanceAfter: number,
    _date: Date,
    _time: Date,
    _category: string,
    _channel: string,
  ) {
    this.id = _id
    this.merchant = _merchant
    this.amount = _amount
    this.balanceAfter = _balanceAfter
    this.date = _date
    this.time = _time
    this.category = _category
    this.channel = _channel
  }
}
/* tslint:disable:max-classes-per-file */
export class TableDetails {
  errorCode: number
  errorDescription: string
  errorResponse: {}
  id: number
  size?: number
  total?: number
  transactionDetails: TransactionDetails[]
  constructor(
    _id: number,
    _size: number,
    _total: number,
    _transactionDetails: TransactionDetails[],
  ) {
    this.id = _id
    this.size = _size
    this.total = _total
    this.transactionDetails = _transactionDetails
  }
}

export class ResponseTargetData {
  errorCode?: number
  errorDescription?: string
  errorResponse?: any
}

export class SearchData {
  dateFrom?: string
  dateTo?: string
  category?: string
  amountFrom?: number
  amountTo?: number
  constructor(
    _dateFrom: string,
    _dateTo: string,
    _category: string,
    _amountFrom: number,
    _amountTo: number,
  ) {
    this.dateFrom = _dateFrom
    this.dateTo = _dateTo
    this.category = _category
    this.amountFrom = _amountFrom
    this.amountTo = _amountTo
  }
}

export type RequestType = 'activate' | 'block' | 'reset' | 'payment'

export class BusinessCardSelected {
  accountNumber: string
  amount?: number
  paymentOption: string
}

export class BusinessCardsDetails {
  amountPayable: string
  availableCahs: string
  blockReason: string
  cardId: string
  cardName: string
  cardPicture: string
  payDateG: string
  payDateH: string
  securityCode: number
  spent: string
  spentAmount: number
  spentBar: number
  totalCredit: string
  totalCreditAmount: number
  amountPayableDue: string
  unbiliedAmount: string
  transactionList: TransactionDetails[]
}

export class TargetsData {
  // cardIid: number;
  id: number
  relatedAccount?: string
  cardHolderName?: string
  name: string
  accountNumber: number
  cardNumber?: number
  active: boolean
  points: number
  targetType: string
  payDateG: string
  payDateH: string
  cash: number
  limit: number
  amountPayable: number
  amountUnbilled: number
  securityCode: number
  totalCredit: number
  spent25: number
  targetName: string
  outstandingBalance: string
  remainingLimit: string
  dueBalance: string
  transactions: TransactionDetails[]

  //added
  assignee?: string
  assigneeData?: string
  cardId?: string
  status?: string
}
export class PagedData<T> {
  data: T[]
  page: Page

  constructor() {
    this.data = new Array<T>()
    this.page = new Page()
  }
}

export class Combo {
  key: number
  value: string
  constructor(_key: number, _value: string) {
    this.key = _key
    this.value = _value
  }
}

export class ResetPinModel {
  digit1: number
  digit2: number
  digit3: number
  digit4: number
  digit5: number
  digit6: number
  digit7: number
  digit8: number
  digit9: number
  digit10: number
  digit11: number
  digit12: number
  digit13: number
  digit14: number
  digit15: number
  digit16: number
  newPin1: number
  newPin2: number
  newPin3: number
  newPin4: number
  repeatNewPin1: number
  repeatNewPin2: number
  repeatNewPin3: number
  repeatNewPin4: number
  code1: number
  code2: number
  code3: number
  code4: number

  constructor(
    _digit1: number,
    _digit2: number,
    _digit3: number,
    _digit4: number,
    _digit5: number,
    _digit6: number,
    _digit7: number,
    _digit8: number,
    _digit9: number,
    _digit10: number,
    _digit11: number,
    _digit12: number,
    _digit13: number,
    _digit14: number,
    _digit15: number,
    _digit16: number,
    _newPin1: number,
    _newPin2: number,
    _newPin3: number,
    _newPin4: number,
    _repeatNewPin1: number,
    _repeatNewPin2: number,
    _repeatNewPin3: number,
    _repeatNewPin4: number,
    _code1: number,
    _code2: number,
    _code3: number,
    _code4: number,
  ) {
    this.digit1 = _digit1
    this.digit2 = _digit2
    this.digit3 = _digit3
    this.digit4 = _digit4
    this.digit5 = _digit5
    this.digit6 = _digit6
    this.digit7 = _digit7
    this.digit8 = _digit8
    this.digit9 = _digit9
    this.digit10 = _digit10
    this.digit11 = _digit11
    this.digit12 = _digit12
    this.digit13 = _digit13
    this.digit14 = _digit14
    this.digit15 = _digit15
    this.digit16 = _digit16
    this.newPin1 = _newPin1
    this.newPin2 = _newPin2
    this.newPin3 = _newPin3
    this.newPin4 = _newPin4
    this.repeatNewPin1 = _repeatNewPin1
    this.repeatNewPin2 = _repeatNewPin2
    this.repeatNewPin3 = _repeatNewPin3
    this.repeatNewPin4 = _repeatNewPin4
    this.code1 = _code1
    this.code2 = _code2
    this.code3 = _code3
    this.code4 = _code4
  }
}

export class ActivateCardModel {
  digit1: number
  digit2: number
  digit3: number
  digit4: number
  digit5: number
  digit6: number
  digit7: number
  digit8: number
  digit9: number
  digit10: number
  digit11: number
  digit12: number
  digit13: number
  digit14: number
  digit15: number
  digit16: number
  newPin1: number
  newPin2: number
  newPin3: number
  newPin4: number
  repeatNewPin1: number
  repeatNewPin2: number
  repeatNewPin3: number
  repeatNewPin4: number
  code1: number
  code2: number
  code3: number
  code4: number

  constructor(
    _digit1: number,
    _digit2: number,
    _digit3: number,
    _digit4: number,
    _digit5: number,
    _digit6: number,
    _digit7: number,
    _digit8: number,
    _digit9: number,
    _digit10: number,
    _digit11: number,
    _digit12: number,
    _digit13: number,
    _digit14: number,
    _digit15: number,
    _digit16: number,
    _newPin1: number,
    _newPin2: number,
    _newPin3: number,
    _newPin4: number,
    _repeatNewPin1: number,
    _repeatNewPin2: number,
    _repeatNewPin3: number,
    _repeatNewPin4: number,
    _code1: number,
    _code2: number,
    _code3: number,
    _code4: number,
  ) {
    this.digit1 = _digit1
    this.digit2 = _digit2
    this.digit3 = _digit3
    this.digit4 = _digit4
    this.digit5 = _digit5
    this.digit6 = _digit6
    this.digit7 = _digit7
    this.digit8 = _digit8
    this.digit9 = _digit9
    this.digit10 = _digit10
    this.digit11 = _digit11
    this.digit12 = _digit12
    this.digit13 = _digit13
    this.digit14 = _digit14
    this.digit15 = _digit15
    this.digit16 = _digit16
    this.newPin1 = _newPin1
    this.newPin2 = _newPin2
    this.newPin3 = _newPin3
    this.newPin4 = _newPin4
    this.repeatNewPin1 = _repeatNewPin1
    this.repeatNewPin2 = _repeatNewPin2
    this.repeatNewPin3 = _repeatNewPin3
    this.repeatNewPin4 = _repeatNewPin4
    this.code1 = _code1
    this.code2 = _code2
    this.code3 = _code3
    this.code4 = _code4
  }
}

export class CardPaymentModel {
  account: number
  paymentType: string
  amount: number
  cardHolderName: string
  cardNumber: number
  relatedAccount: number
  code1: number
  code2: number
  code3: number
  code4: number

  constructor(
    _account: number,
    _paymentType: string,
    _amount: number,
    _cardHolderName: string,
    _cardNumber: number,
    _relatedAccount: number,
    _code1: number,
    _code2: number,
    _code3: number,
    _code4: number,
  ) {
    this.account = _account
    this.paymentType = _paymentType
    this.amount = _amount
    this.cardHolderName = _cardHolderName
    this.cardNumber = _cardNumber
    this.relatedAccount = _relatedAccount
    this.code1 = _code1
    this.code2 = _code2
    this.code3 = _code3
    this.code4 = _code4
  }
}
export class BlockCardsModel {
  digit1: number
  digit2: number
  digit3: number
  digit4: number
  digit5: number
  digit6: number
  digit7: number
  digit8: number
  digit9: number
  digit10: number
  digit11: number
  digit12: number
  digit13: number
  digit14: number
  digit15: number
  digit16: number
  code1: number
  code2: number
  code3: number
  code4: number
  account21: number

  constructor(
    _digit1: number,
    _digit2: number,
    _digit3: number,
    _digit4: number,
    _digit5: number,
    _digit6: number,
    _digit7: number,
    _digit8: number,
    _digit9: number,
    _digit10: number,
    _digit11: number,
    _digit12: number,
    _digit13: number,
    _digit14: number,
    _digit15: number,
    _digit16: number,
    _code1: number,
    _code2: number,
    _code3: number,
    _code4: number,
    _account21: number,
  ) {
    this.digit1 = _digit1
    this.digit2 = _digit2
    this.digit3 = _digit3
    this.digit4 = _digit4
    this.digit5 = _digit5
    this.digit6 = _digit6
    this.digit7 = _digit7
    this.digit8 = _digit8
    this.digit9 = _digit9
    this.digit10 = _digit10
    this.digit11 = _digit11
    this.digit12 = _digit12
    this.digit13 = _digit13
    this.digit14 = _digit14
    this.digit15 = _digit15
    this.digit16 = _digit16
    this.code1 = _code1
    this.code2 = _code2
    this.code3 = _code3
    this.code4 = _code4
    this.account21 = _account21
  }
}
/* tslint:disable:max-classes-per-file */
export class DataList {
  accountSix?: string
  pinNumber?: string
  codeOTP?: string
  creditCardNumber?: string
  constructor(
    _accountNumber: string,
    _accountSix: string,
    _pinNumber: string,
    _codeOTP: string,
    creditCardNumber: string,
  ) {
    ;(this.accountSix = _accountSix),
      (this.codeOTP = _codeOTP),
      (this.pinNumber = _pinNumber),
      (this.creditCardNumber = creditCardNumber)
  }
}
