export class ModelServicePayrolls {
  employeeNumber: string
  employeeName: string
  civilianId: string
  bank: string
  account: string
  salary: string

  constructor(
    _employeeNumber: string,
    _employeeName: string,
    _civilianId: string,
    _bank: string,
    _account: string,
    _salary: string,
  ) {
    this.employeeNumber = _employeeNumber
    this.employeeName = _employeeName
    this.civilianId = _civilianId
    this.bank = _bank
    this.account = _account
    this.salary = _salary
  }
}
