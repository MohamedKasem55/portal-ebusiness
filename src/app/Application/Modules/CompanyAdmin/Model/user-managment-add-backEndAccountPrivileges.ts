export class backEndAccountPrivilegesModel {
  privilegesBeneficiaries: [boolean]
  privilegesDirectDebits: [boolean]
  privilegesPayrollCards: [boolean]

  constructor(
    privilegesBeneficiaries: [boolean],
    privilegesDirectDebits: [boolean],
    privilegesPayrollCards: [boolean],
  ) {
    this.privilegesBeneficiaries = privilegesBeneficiaries
    this.privilegesDirectDebits = privilegesDirectDebits
    this.privilegesPayrollCards = privilegesPayrollCards
  }
}
