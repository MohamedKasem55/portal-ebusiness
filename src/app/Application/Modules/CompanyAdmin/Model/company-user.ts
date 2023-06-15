import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Injector } from '@angular/core'

export class CompanyUser {
  userId: string
  userName: string
  empRef: string
  idIqama: string
  mobile: string
  department: string
  status: string
  id: string
  userImage: string
  type: string
  createdBy: string
  createdDate: Date | null
  expiryDate: Date | null
  injector: Injector
  typeExport: string

  constructor(
    userId: string,
    userName: string,
    empRef: string,
    idIqama: string,
    mobile: string,
    status: string,
    _id: string,
    _department: string,
    userImage: string,
    userType: string,
    createdBy: string,
    createdDate: Date,
    expiryDate: Date,
  ) {
    this.userId = userId
    this.userName = userName
    this.empRef = empRef
    this.idIqama = idIqama
    this.mobile = mobile
    this.status = status
    this.id = _id
    this.department = _department
    this.userImage = userImage
    this.type = userType
    this.createdBy = createdBy
    this.createdDate = createdDate
    this.expiryDate = expiryDate
  }

  get createdDateExport() {
    if (this.createdDate instanceof Date) {
      return new DateFormatPipe(this.injector).transform(
        this.createdDate,
        'dd-mm-yyyy',
      )
    }

    return ''
  }

  setInjector(injector: Injector) {
    this.injector = injector
  }

  get expiryDateExport() {
    if (this.expiryDate instanceof Date) {
      return new DateFormatPipe(this.injector).transform(
        this.expiryDate,
        'dd-mm-yyyy',
      )
    }

    return ''
  }
}
