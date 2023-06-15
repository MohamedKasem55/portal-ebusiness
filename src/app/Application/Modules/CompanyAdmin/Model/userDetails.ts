import { Account } from '../../../Model/account'
import { UserDetailsBackEndAccountPrivileges } from './UserDetailsBackEndAccountPrivileges'

export class UserDetails {
  backEndAccountPrivileges: UserDetailsBackEndAccountPrivileges
  blocked: boolean
  checkaccountlist: Account[]
  checksubciclist: any[]
  companyUserDetails: any
  containsCUAlertsGroup: boolean
  accountList: string[]
  oldMobile: string
  selectPrivilegeIndex: string[]
  showBillPaymentLimit: boolean
  showGovernmentPaymentLimit: boolean
  showMutualFundLimit: boolean
  showOwnAccountLimit: boolean
  unassignedHardSerialList: string[]
  unassignedSoftSerialList: string[]
  userPk: string
  errorCode: string
  errorDescription: string
  realGroup: any = {}
  vaPermissions: any
}
