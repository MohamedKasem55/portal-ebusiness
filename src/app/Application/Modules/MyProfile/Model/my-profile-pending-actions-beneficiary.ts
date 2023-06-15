export class ModelServiceBeneficiary {
  initiationDate: string
  name: string
  account: string
  bank: string
  category: string
  email: string

  constructor(
    _initiationDate,
    _name: string,
    _account: string,
    _bank: string,
    _category: string,
    _email: string,
  ) {
    this.initiationDate = _initiationDate
    this.name = _name
    this.account = _account
    this.bank = _bank
    this.category = _category
    this.email = _email
  }
}
