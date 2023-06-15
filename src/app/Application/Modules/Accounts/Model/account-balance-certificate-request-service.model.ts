export class ModelServiceBalanceCertificateRequest {
  balanceCertificatePk: string
  company: string
  city: string
  postalCode: string
  requestDate: string
  account: string
  cic: string
  processDate: string

  constructor(
    _balanceCertificatePk: string,
    _company: string,
    _city: string,
    _postalCode: string,
    _requestDate: string,
    _account: string,
    _cic: string,
    _processDate: string,
  ) {
    this.balanceCertificatePk = _balanceCertificatePk
    this.company = _company
    this.city = _city
    this.postalCode = _postalCode
    this.requestDate = _requestDate
    this.account = _account
    this.cic = _cic
    this.processDate = _processDate
  }
}
