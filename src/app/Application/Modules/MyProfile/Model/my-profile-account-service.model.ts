export class ModelServiceAccount {
  account15Length: string
  account17Length: string
  accountPk: string
  alias: string
  availableBalance: number
  availableSarBalance: number
  branchName: string
  branchid: string
  checkDigit: string
  code000: string
  companyPk: number
  currency: string
  erNumber: string
  exchangeRate: string
  fullAccountNumber: string
  ibanNumber: string
  inquiry: boolean
  ledgerBalance: number
  modified: boolean
  numberAccount: string
  payment: boolean
  status: string
  txAccountString: string
  typeAccount: string
  typeFunction: string
  unclearedBalance: number

  constructor(
    _account15Length: string,
    _account17Length: string,
    _accountPk: string,
    _alias: string,
    _availableBalance: number,
    _availableSarBalance: number,
    _branchName: string,
    _branchid: string,
    _checkDigit: string,
    _code000: string,
    _companyPk: number,
    _currency: string,
    _erNumber: string,
    _exchangeRate: string,
    _fullAccountNumber: string,
    _ibanNumber: string,
    _inquiry: boolean,
    _ledgerBalance: number,
    _modified: boolean,
    _numberAccount: string,
    _payment: boolean,
    _status: string,
    _txAccountString: string,
    _typeAccount: string,
    _typeFunction: string,
    _unclearedBalance: number,
  ) {
    this.account15Length = _account15Length
    this.account17Length = _account17Length
    this.accountPk = _accountPk
    this.alias = _alias
    this.availableBalance = _availableBalance
    this.availableSarBalance = _availableSarBalance
    this.branchName = _branchName
    this.branchid = _branchid
    this.checkDigit = _checkDigit
    this.code000 = _code000
    this.companyPk = _companyPk
    this.currency = _currency
    this.erNumber = _erNumber
    this.exchangeRate = _exchangeRate
    this.fullAccountNumber = _fullAccountNumber
    this.ibanNumber = _ibanNumber
    this.inquiry = _inquiry
    this.ledgerBalance = _ledgerBalance
    this.modified = _modified
    this.numberAccount = _numberAccount
    this.payment = _payment
    this.status = _status
    this.txAccountString = _txAccountString
    this.typeAccount = _typeAccount
    this.typeFunction = _typeFunction
    this.unclearedBalance = _unclearedBalance
  }
}
