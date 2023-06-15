export class ModelStatement {
  amount: string
  balance: string
  channelType: string
  date: Date
  description: string
  hijraDate: Date
  hijraDayText: string
  hijraMonthText: string
  occDayText: string
  occMonthText: string
  remarks: string
  time: Date
  dateGroup: string
  txCode: string
  txId: string
  weekDay: string

  constructor(
    _amount: string,
    _balance: string,
    _channelType: string,
    _date: Date,
    _description: string,
    _hijraDate: Date,
    _hijraDayText: string,
    _hijraMonthText: string,
    _occDayText: string,
    _occMonthText: string,
    _remarks: string,
    _time: Date,
    _dateGroup: string,
    _txCode: string,
    _txId: string,
    _weekDay: string,
  ) {
    this.amount = _amount
    this.balance = _balance
    this.channelType = _channelType
    this.date = _date
    this.description = _description
    this.hijraDate = _hijraDate
    this.hijraDayText = _hijraDayText
    this.hijraMonthText = _hijraMonthText
    this.occDayText = _occDayText
    this.occMonthText = _occMonthText
    this.remarks = _remarks
    this.time = _time
    this.dateGroup = _dateGroup
    this.txCode = _txCode
    this.txId = _txId
    this.weekDay = _weekDay
  }
}
