export class ModelRequestBeneficiaries {
  initiationdate = ''
  beneficiaryName = ''
  beneficiaryType = ''
  bankName = ''
  account = ''
  country = ''
  currentlevel = ''
  nextlevel = ''
  status = ''

  constructor(
    _initiationdate = '',
    _beneficiaryName = '',
    _beneficiaryType = '',
    _bankName = '',
    _account = '',
    _country = '',
    _currencylevel = '',
    _nextlevel = '',
    _status = '',
  ) {
    this.initiationdate = _initiationdate
    this.beneficiaryName = _beneficiaryName
    this.beneficiaryType = _beneficiaryType
    this.bankName = _bankName
    this.account = _account
    this.country = _country
    this.currentlevel = _currencylevel
    this.nextlevel = _nextlevel
    this.status = _status
  }
}
