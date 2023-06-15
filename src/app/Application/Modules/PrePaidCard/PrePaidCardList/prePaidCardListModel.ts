import { GenericResponse } from 'app/Application/Model/app.response'

export interface PrepaidCardItem {
  cardNumber?: string
  cardSequence?: string
  stmtStatusFlag?: string
  sibAccountNumber?: string
  addressSeqNumber?: string
  applePayStatus?: string
  availableCash?: number
  availableCredit?: number
  cardAccount?: string
  cardCurrency?: string
  cardExpDate?: string
  cardFullStatus?: string
  cardIcon?: string
  cardIndicator?: string
  cardNickName?: string
  cardSeqNumber?: string
  cardStatus?: string
  cashLimit?: number
  consumedLimit?: number
  crLimit?: number
  creditCardType?: string
  dueAmount?: number
  dueDate?: string
  embossingName?: string
  estatementFlg?: boolean
  favouriteFlg?: boolean
  firstName?: string
  lastDeactiveDate?: string
  lastName?: string
  minDueAmount?: number
  payPalFlg?: boolean
  prodCode?: string
  prodDesc?: string
  rewardPoints?: number
  showStatusFlg?: string
  sortCode?: string
  stmtAmt?: number
  totalAmt?: number
  unbilledAmt?: number
}

export interface PrepaidCardListResponse extends GenericResponse {
  prepaidCardsList: PrepaidCardItem[]
}
