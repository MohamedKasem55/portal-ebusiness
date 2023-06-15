export class TokenStatus {
  active: boolean
  blocked: boolean
  companyProfileNumber: string
  icoNumber: string
  lost: boolean
  nonOperative: boolean
  tokenSerialNumber: string
  tokenStatus: string
  tokenType: string
  unassigned: boolean
  userId: string
  userName: string

  constructor(
    _active: boolean,
    _blocked: boolean,
    _companyProfileNumber: string,
    _icoNumber: string,
    _lost: boolean,
    _nonOperative: boolean,
    _tokenSerialNumber: string,
    _tokenStatus: string,
    _tokenType: string,
    _unassigned: boolean,
    _userId: string,
    _userName: string,
  ) {
    this.active = _active
    this.blocked = _blocked
    this.companyProfileNumber = _companyProfileNumber
    this.icoNumber = _icoNumber
    this.lost = _lost
    this.nonOperative = _nonOperative
    this.tokenSerialNumber = _tokenSerialNumber
    this.tokenStatus = _tokenStatus
    this.tokenType = _tokenType
    this.unassigned = _unassigned
    this.userId = _userId
    this.userName = _userName
  }
}
