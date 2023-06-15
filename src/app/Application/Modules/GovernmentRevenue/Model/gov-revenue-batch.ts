import { DepositorOriginator } from './depositor-originator'
import { RevenueAccount } from './revenue-account'
import { GovRevenueFileSubAccounts } from './sub-accounts'

export class GovRevenueBatchDSO {
  batchPk: number
  accountNumber: string
  amount: number
  beneficiaryBank: string
  bankReference: number
  beneficiaryOriginator: DepositorOriginator
  depositorOriginator: DepositorOriginator
  details: RevenueDetail[]
  subAccounts: GovRevenueFileSubAccounts[]
  finClosingYear: string
  letterNumber: string
  letterPeriodFrom: string
  letterPeriodTo: string
  totalAmount: number
  valueDate: string
  reference: string
  status: string
  rejectedReason: string
  govRevenueDetailPk: number
  detailAmount: number
  detailRecordCount: number

}

export class RevenueDetail {
  amount: number
  revenueAccount: RevenueAccount
}
