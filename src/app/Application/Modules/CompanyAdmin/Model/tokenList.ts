// token data model

export class tokenList {
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
    active: boolean,
    blocked: boolean,
    companyProfileNumber: string,
    icoNumber: string,
    lost: boolean,
    nonOperative: boolean,
    tokenSerialNumber: string,
    tokenStatus: string,
    tokenType: string,
    unassigned: boolean,
    userId: string,
    userName: string,
  ) {
    this.active = active
    this.blocked = blocked
    this.companyProfileNumber = companyProfileNumber
    this.icoNumber = icoNumber
    this.lost = lost
    this.nonOperative = nonOperative
    this.tokenSerialNumber = tokenSerialNumber
    this.tokenStatus = tokenStatus
    this.tokenType = tokenType
    this.unassigned = unassigned
    this.userId = userId
    this.userName = userName
  }
}
