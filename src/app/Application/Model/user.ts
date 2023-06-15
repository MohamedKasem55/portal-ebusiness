import { Dictionary } from './dictionary'
export class User {
  lastLogon: string
  sessionInfo: any
  offset: number
  max: any
  order: any
  orderType: string
  companyPk: number
  userPk: number
  userId: string
  blocked: number
  firstLogin: boolean
  password: string
  tries: number
  maxTries: number
  userName: string
  status: string
  type: string
  idIqama: string
  department: string
  address: string
  phone: string
  mobile: string
  email: string
  nationality: string
  expiryDate: string
  issuingPlace: string
  active: string
  authenticationMethod: string
  groups: Dictionary<boolean>
  tutorialDone: boolean

  constructor() {
    this.groups = new Dictionary<boolean>()
  }
}
