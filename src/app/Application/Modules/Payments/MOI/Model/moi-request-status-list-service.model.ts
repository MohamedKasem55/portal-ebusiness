export class ModelServiceMoiRequestStatusList {
  initiationDate = ''
  serviceType = ''
  beneficiaryName = ''
  amount = ''
  fees = ''
  status = ''

  constructor(
    _initiationDate = '',
    _serviceType = '',
    _beneficiaryName = '',
    _amount = '',
    _fees = '',
    _status = '',
  ) {
    this.initiationDate = _initiationDate
    this.serviceType = _serviceType
    this.beneficiaryName = _beneficiaryName
    this.amount = _amount
    this.fees = _fees
    this.status = _status
  }
}
