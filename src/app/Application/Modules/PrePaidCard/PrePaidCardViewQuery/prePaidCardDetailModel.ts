import { GenericResponse } from 'app/Application/Model/app.response'

export interface PrepaidCardDetails {
  accountNumber: string
  balanceAmount: number
  balanceCurrency: string
  cardLimitAmount: number
  cardLimitCurrency: string
  cardNumber: string
  cashBalanceAmount: number
  cashBalanceCurrency: string
  statementAmount: number
  statementCurrency: string
}

export interface TransactionItem {
  acquiredReferenceNumber: string
  amount: number
  authorizationAmount: number
  authorizationCurrency: string
  authorizationId: string
  authorizationSign: string
  authorizationStatus: string
  billingAmount: number
  billingCurrency: string
  channelId: string
  currency: string
  date: Date
  description: string
  hijraDate: Date
  loadDate: Date
  merchantCity: string
  merchantCountry: string
  merchantId: string
  merchantName: string
  merchantType: string
  postingDate: Date
  reasonCode: string
  refNum: string
  remarks: string
  settlementAmount: number
  settlementCurrency: number
  status: string
  statusDescription: string
  stmtSeqNum: string
  time: Date
  title: string
  type: string
  typeDescription: string
}

export interface TransactionList {
  items: TransactionItem[]
  size?: number
  total?: number
}

export interface PrepaidCardDetailResponse extends GenericResponse {
  prepaidCardDetails: PrepaidCardDetails
  transactionsList: TransactionList
}

export class PrepaidCardDetailRequest {
  cardSeqNumber?: string
  amountFrom?: number
  amountTo?: number
  dateFrom?: Date
  dateTo?: Date
  category?: string
  page?: number
  rows?: number
  stmtDate?: string
  stmtSeqNu?: string
  trxnCod?: string
  trxnTyp?: string
}

export interface PrepaidCardsStatementsItem {
  amount: number
  currency: string
  merchantName: string
  postDate: Date
  prtKey: string
  refNum: string
  remarks: string
  settlementAmount: number
  settlementCurrency: string
  title: string
  type: string
  typeDesc: string
}

export interface PrepaidCardStatementsResponse extends GenericResponse {
  alrajhiCreditCardsStatement: AlrajhiCreditCardsStatement
  // prepaidCardDetails: PrepaidCardDetails;
  // prepaidCardsStatementsList: PrepaidCardsStatementsItem[];
}

export interface AlrajhiCreditCardsStatement {
  alrajhiCreditCardStmtList: TransactionList
  alrajhiCreditCardsStatementsDetails: PrepaidCardDetails
}
export class PrepaidCardsDetailsRequest {
  amountFrom?: number
  amountTo?: number
  dateFrom?: Date
  dateTo?: Date
  cardSeqNumber: string
  page: number
  rows: number
  category?: string
}
