export class ValidTransfer {
  amount2: number
  currency1: string
  currency2: string
  date: string
  exchangeRate: number

  constructor(
    _amount2: number,
    _currency1: string,
    _currency2: string,
    _date: string,
    _exchangeRate: number,
  ) {
    this.amount2 = _amount2
    this.currency1 = _currency1
    this.currency2 = _currency2
    this.date = _date
    this.exchangeRate = _exchangeRate
  }
}
