import { Account } from 'app/Application/Model/account'
import { WithinTransferBatch } from './withinTransferBatch'

export class TransferInit {
  batch: WithinTransferBatch
  errorCode: string
  errorDescription: string
  listAccount: Account[]
}
