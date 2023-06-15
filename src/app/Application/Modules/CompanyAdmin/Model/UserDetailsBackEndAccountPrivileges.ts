export class UserDetailsBackEndAccountPrivileges {
  beneficiariesPrivilege: boolean
  directDebitsPrivilege: boolean
  letterGuaranteesPrivilege: boolean
  payrollPrivilege: boolean
  posPrivilege: boolean
  balanceCertificatePrivilege: boolean
  billAdd: boolean
  checksPrivilege: boolean
  positivePayPrivilege: boolean
  businessCardsPrivilege: boolean
  privilegesBeneficiaries: boolean[]
  privilegesDirectDebits: boolean[]
  privilegesLetterGuarantee: boolean[]
  privilegesPayrollCards: boolean[]
  privilegesPosManagement: boolean[]
  privilegesBalanceCertificate: boolean[]
  privilegesBillAdd: boolean[]
  privilegesChecks: boolean[]
  privilegesPositivePay: boolean[]
  privilegesBusinessCards: boolean[]

  construction(
    _beneficiariesPrivilege: boolean,
    _directDebitsPrivilege: boolean,
    _letterGuaranteesPrivilege: boolean,
    _payrollPrivilege: boolean,
    _posPrivilege: boolean,
    _balanceCertificatePrivilege: boolean,
    _billAdd: boolean,
    _checksPrivilege: boolean,
    _positivePayPrivilege: boolean,
    _businessCardsPrivilege: boolean,
  ) {
    this.beneficiariesPrivilege = _beneficiariesPrivilege
    this.directDebitsPrivilege = _directDebitsPrivilege
    this.letterGuaranteesPrivilege = _letterGuaranteesPrivilege
    this.payrollPrivilege = _payrollPrivilege
    this.posPrivilege = _posPrivilege
    this.balanceCertificatePrivilege = _balanceCertificatePrivilege
    this.billAdd = _billAdd
    this.checksPrivilege = _checksPrivilege
    this.positivePayPrivilege = _positivePayPrivilege
    this.businessCardsPrivilege = _businessCardsPrivilege
  }
}
