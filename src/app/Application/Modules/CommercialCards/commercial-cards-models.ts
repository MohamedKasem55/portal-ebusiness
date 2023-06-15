// import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ErrorResponse } from 'app/Application/Model/welcome'

export class BusinessCardsDetails {
  cardNum: string
  dateG: string
  dateH: string
  cardSeqNum: string
  crLimit: number
  stmtAmt: number
  availableBal: number
  availableCash: number
  playableAmt: number
  pmtDueDate: string
  unbilledAmt: number
  totalAmt: number
  cardStatus: string
  accountsItemList: AccountsItemList[]
  authStatus: string
}

// tslint:disable-next-line: max-classes-per-file
export class AccountsItemList {
  authStatus: string
  availableBalance: number
  availableCash: number
  cardAccountNumber: string
  cardAccountSeqNumber: string
  currency: string
  limit: number
}

export interface BusinessDetailAndList {
  details?: BusinessCardsDetailsResponse
  list: BusinessCardsListItems
}

// tslint:disable-next-line: max-classes-per-file
export class BusinessCardsListArray {
  businessCardsList: BusinessCardsListItems[]
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

// tslint:disable-next-line: max-classes-per-file
export class BatchListsContainer {
  notAllowed: []
  toAuthorize: []
  toProcess: []
}

// tslint:disable-next-line: max-classes-per-file
export class RequestValidate {
  challengeNumber?: string
  challengeResponse?: string
  otp?: string
  password?: string
}

// tslint:disable-next-line: max-classes-per-file
export class AccountItem {
  authStatus: string
  availableBalance: number
  availableCash: number
  cardAccountNumber: string
  cardAccountSeqNumber: string
  currency: string
  limit: number
}

// tslint:disable-next-line: max-classes-per-file
export class BusinessCardSelected {
  accountItem: AccountItem
  accountNumber: string
  amount?: number
  paymentOption: string
  constructor() {
    this.accountItem = new AccountItem()
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BusinessCardsDetailsRequest {
  amountFrom?: number
  amountTo?: number
  authDateFrom?: Date
  authDateTo?: Date
  cardSeqNumber: string
  cardNumber?: string
  details: boolean
  page: number
  rows: number
  trxnCode?: string
  trxnType?: string
  category?: string
}
// tslint:disable-next-line: max-classes-per-file
export interface BusinessCardsDetailsResponse {
  businessCardsDetails: BusinessCardsDetails
  generateChallengeAndOTP: ResponseGenerateChallenge
  transactionList: {
    items: TransactionItem[]
    size: number
    total: number
  }
  errorResponse: ErrorResponse
  errorCode: string
  errorDescription: string
}
// tslint:disable-next-line: max-classes-per-file
export interface TransactionItem {
  amount: number
  currency: string
  acquiredReferenceNumber: string
  authorizationAmount: number
  authorizationCurrency: string
  authorizationId: string
  authorizationSign: string
  authorizationStatus: string
  billingAmount: number
  billingCurrency: string
  channelId: string
  date: Date
  description: string
  hijraDate: string
  loadDate: string
  merchantCity: string
  merchantCountry: string
  merchantId: string
  merchantName: string
  merchantType: string
  postingDate: string
  reasonCode: string
  refNum: string
  remarks: string
  settlementAmount: number
  settlementCurrency: string
  status: string
  statusDescription: string
  stmtSeqNum: string
  time: string
  title: string
  type: string
  typeDescription: string
}
// tslint:disable-next-line: max-classes-per-file
export interface AccountsItem {
  authStatus: string
  availableBalance: number
  availableCash: number
  cardAccountNumber: string
  cardAccountSeqNumber: string
  currency: string
  limit: number
}

export interface BusinessCardsList {
  items: BusinessCardsListItems[]
  size: number
  total: number
  id?: number
}
// tslint:disable-next-line: max-classes-per-file
export class BusinessCardsListItems {
  addressSeqNumber: string
  applePayStatus: string
  availableCash: number
  availableCredit: number
  cardAccount: string
  cardCurrency: string
  cardExpDate: string
  cardFullStatus: string
  cardIcon: string
  cardIndicator: string
  cardNickName: string
  cardNumber: string
  cardSeqNumber: string
  cardStatus: string
  cashLimit: number
  consumedLimit: number
  crLimit: number
  creditCardType: string
  dueAmount: number
  dueDate: string
  embossingName: string
  estatementFlg: true
  favouriteFlg: true
  firstName: string
  lastDeactiveDate: string
  lastName: string
  minDueAmount: number
  payPalFlg: true
  prodCode: string
  prodDesc: string
  rewardPoints: number
  showStatusFlg: string
  sibAccountNumber: string
  sortCode: string
  stmtAmt: number
  totalAmt: number
  unbilledAmt: number
}
