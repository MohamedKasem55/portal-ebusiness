export interface AccountComboList {
  key: string
  value: any
}

export interface ErrorResponse {
  arabicMessage: string
  code: string
  description: string
  englishMessage: string
}

export interface ResponseComboAccounts {
  accountComboList: AccountComboList[]
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
}

export interface RequestAccountsList {
  order: string
  orderType: string
  page: number
  rows: number
  txType: string
}

export interface RequestSearchStatement {
  accountNumber: string
  amountFrom: string
  amountTo: string
  billType: string
  dateFrom: string
  dateTo: string
  filterBy: string
  govPay: string
  govPayType: string
  page: number
  rows: number
  statementsOrder: number
  typeTransaction: number
}

export interface RequestStaticList {
  names: string[]
}

export interface StaticsModelDTO {
  key: string
  location: string
  name: string
  props: any[]
}
