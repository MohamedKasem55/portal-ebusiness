export class CompanyUser {
  userId: string
  userName: string
  empRef: string
  saudiId: string
  mobileNumber: string
  department: string
  userImage: string

  constructor(
    userId: string,
    userName: string,
    empRef: string,
    saudiId: string,
    mobileNumber: string,
    department: string,
    userImage: string,
  ) {
    this.userId = userId
    this.userName = userName
    this.empRef = empRef
    this.saudiId = saudiId
    this.mobileNumber = mobileNumber
    this.department = department
    this.userImage = userImage
  }
}
