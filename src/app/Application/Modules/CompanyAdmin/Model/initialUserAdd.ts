import { Account } from '../../../Model/account'
import { UserDetailsBackEndAccountPrivileges } from './UserDetailsBackEndAccountPrivileges'

export class InitialUserAdd {
  accountList: Array<Account>
  backEndAccountPrivileges: UserDetailsBackEndAccountPrivileges
  canAddMuqeemUsers: string
  errorCode: string
  errorDescription: string
  groupList: any[]
  groupListBills: any[]
  groupListCM: any[]
  groupListCheckBook: any[]
  groupListCrossCurrencyPrivilege: any[]
  groupListMuqeem: any[]
  groupListOthers: any[]
  groupListPayments: any[]
  groupListTransfers: any[]
  groupListAramcoPayments: any[]
  groupListBusinessCards: any[]
  groupListPrePaidCards: any[]
  nameAuthenticationMethod: string
  unassignedHardSerialList: Array<string>
  unassignedSoftSerialList: Array<string>
  vaPermissions: string[]

  realGroup: any

  constructor(
    _accountList: Array<Account>,
    _backEndAccountPrivileges: UserDetailsBackEndAccountPrivileges,
    _canAddMuqeemUsers: string,
    _errorCode: string,
    _errorDescription: string,
    _groupList: any[],
    _groupListBills: any[],
    _groupListCM: any[],
    _groupListCheckBook: any[],
    _groupListCrossCurrencyPrivilege: any[],
    _groupListMuqeem: any[],
    _groupListOthers: any[],
    _groupListPayments: any[],
    _groupListTransfers: any[],
    _groupListAramcoPayments: any[],
    _groupListBusinessCards: any[],
    _groupListPrePaidCards: any[],
    _nameAuthenticationMethod: string,
    _unassignedHardSerialList: Array<string>,
    _unassignedSoftSerialList: Array<string>,
    _vaPermissions: string[],
  ) {
    this.accountList = _accountList
    this.backEndAccountPrivileges = _backEndAccountPrivileges
    this.canAddMuqeemUsers = _canAddMuqeemUsers
    this.errorCode = _errorCode
    this.errorDescription = _errorDescription
    this.groupList = _groupList
    this.groupListBills = _groupListBills
    this.groupListCM = _groupListCM
    this.groupListCheckBook = _groupListCheckBook
    this.groupListCrossCurrencyPrivilege = _groupListCrossCurrencyPrivilege
    this.groupListMuqeem = _groupListMuqeem
    this.groupListOthers = _groupListOthers
    this.groupListPayments = _groupListPayments
    this.groupListTransfers = _groupListTransfers
    this.groupListAramcoPayments = _groupListAramcoPayments
    this.groupListBusinessCards = _groupListBusinessCards
    this.groupListPrePaidCards = _groupListPrePaidCards
    this.nameAuthenticationMethod = _nameAuthenticationMethod
    this.unassignedHardSerialList = _unassignedHardSerialList
    this.unassignedSoftSerialList = _unassignedSoftSerialList
    this.realGroup = {
      groupListOthers: [],
      groupListPayments: [],
      groupListTransfers: [],
      groupListBills: [],
      groupListCheckBook: [],
      groupListAramcoPayments: [],
      groupListBusinessCards: [],
      groupListPrePaidCards: [],
    }
    this.vaPermissions = _vaPermissions
  }
}
