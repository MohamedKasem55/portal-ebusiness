// ActivityLog data model

export class ModelServiceActivityLog {
  auditLinePk: number
  operation: string
  operationLog: string
  userName: string
  userId: string
  date: string
  timeStamp: string
  status: string
  companyId: string
  userType: string

  constructor(
    _auditLinePk: number,
    _operation: string,
    _userName: string,
    _userId: string,
    _date: string,
    _timeStamp: string,
    _status: string,
    _companyId: string,
    _userType: string,
  ) {
    this.auditLinePk = _auditLinePk
    this.operation = _operation
    this.operationLog = _operation
    this.userName = _userName
    this.userId = _userId
    this.date = _date
    this.timeStamp = _timeStamp
    this.status = _status
    this.companyId = _companyId
    this.userType = _userType
  }
}
