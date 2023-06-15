import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AppService } from '../../../../core/service/app.service'
import { AppResponse } from '../../../Model/app.response'

@Injectable()
export class OrganizationDetailsService extends AppService {
  private servicesUrl: string

  constructor(private http: HttpClient, config: ConfigResourceService) {
    super()
    this.servicesUrl = config.getServicesUrl().concat('/companyDetails/')
  }

  getPersonalDetails(): Observable<PersonalDetailsDTO> {
    return this.http.get<CompanyDetailsResponse>(this.servicesUrl + 'get').pipe(
      map((response: CompanyDetailsResponse) => {
        let personalDetails: PersonalDetailsDTO = new PersonalDetailsDTO()
        if (response.errorCode != '-1') {
          personalDetails = response.personalDetails
        }
        return personalDetails
      }),
      catchError(this.handleError),
    )
  }

  updatePersonalDetails(
    detailsUpdate: CompanyDetailsUpdate,
  ): Observable<AppResponse> {
    if (!detailsUpdate.selectedProperty) {
      detailsUpdate.selectedProperty = 'personalDetailsMail'
    }

    const data = {}
    const keys = Object.keys(detailsUpdate)
    keys.forEach((key) => {
      if (detailsUpdate[key] != null && detailsUpdate[key] != '') {
        data[key] = detailsUpdate[key]
      }
    })

    return this.http
      .post<AppResponse>(this.servicesUrl + 'update', data)
      .pipe(catchError(this.handleError))
  }
}

export class CompanyDetailsResponse extends AppResponse {
  personalDetails: PersonalDetailsDTO
}

export class PostalAddress {
  city: number
  country = ''
  countryAlpha = ''
  countryName = ''
  poBox = ''
  region: number
  state = ''
  street = ''
  zipCode = ''
}

export class PersonalDetailsMail {
  emailAddress = ''
  recepFlag = ''
  type = ''
}

export class PersonalDetailsMobile {
  areaCode = ''
  interCode = ''
  recepFlag = ''
  type = ''
  unvalidatednumber = ''
}

export class PersonalDetailsPhone {
  extension = ''
  interCode = ''
  number = ''
  recepFlag = ''
  type = ''
  unvalidatedareaCode = ''
}
export class PersonalDetailVariableData {
  personalDetailsEmpty: any
  personalDetailsFax: PersonalDetailsPhone
  personalDetailsMail: PersonalDetailsMail
  personalDetailsMobile: PersonalDetailsMobile
  personalDetailsPhone: PersonalDetailsPhone
  personalDetailsWPhone: PersonalDetailsPhone
  selected = ''

  constructor() {
    this.personalDetailsMail = new PersonalDetailsMail()
    this.personalDetailsMobile = new PersonalDetailsMobile()
    this.personalDetailsPhone = new PersonalDetailsPhone()
    this.personalDetailsWPhone = new PersonalDetailsPhone()
    this.personalDetailsFax = new PersonalDetailsPhone()
  }
}
export class Customer {
  customerFamilyName = ''
  customerId = ''
  customerName = ''
  customerType: number
  honorificTitle = ''
  issuanceDate = ''
  issuancePlace = ''
  language: number
  variableData: PersonalDetailVariableData

  constructor() {
    this.variableData = new PersonalDetailVariableData()
  }
}

export class PersonalDetailsDTO {
  address: PostalAddress
  customerDetails: Customer
  profileNumber = ''

  constructor() {
    this.address = new PostalAddress()
    this.customerDetails = new Customer()
  }
}

export class CompanyDetailsUpdate {
  email: string
  fax: string
  faxAreaCode: string
  faxExtension: string
  mobileNumber: string
  phoneNumber: string
  phoneNumberAreaCode: string
  phoneNumberExtension: string
  selectedProperty: string
  workNumber: string
  workNumberAreaCode: string
  workNumberExtension: string

  constructor(init?: Partial<CompanyDetailsUpdate>) {
    Object.assign(this, init)
  }
}
