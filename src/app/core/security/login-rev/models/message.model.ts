export interface MessageModel {
  messagePk: number
  englishMessage: string
  arabicMessage: string
  englishHyperlink: string
  arabicHyperlink: string
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTeo: string
  createionDate: string
  hits: number
  defaultMsg: string
  frequency: string
  name: string
  display: string
  internalInfo: boolean
  externalInfo: boolean
  externalClosable: boolean
}
