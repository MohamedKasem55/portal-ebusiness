import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class RequestReactivateService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public reIinitiateRajhi(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newEmail
    // dataBatch['accountNumber'] = dataBatch.beneficiaryAccount;
    const data = {
      batchBeneficiary: dataBatch,
      email: batch.newEmail,
    }
    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/within/initiate',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public saveRajhi(batch, requestValidate): Observable<any> {
    // batch['accountNumber'] = batch.beneficiaryAccount;
    const data = {
      batchBeneficiary: batch,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/beneficiaries/requestStatus/within/save', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public deleteRajhi(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newEmail
    const data = {
      batchBeneficiary: dataBatch,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/beneficiaries/requestStatus/within/delete', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public reIinitiateLocal(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newBanckCode
    delete dataBatch.newBeneficiaryAccount
    delete dataBatch.newBeneficiaryFirstName
    delete dataBatch.newEmail
    delete dataBatch.newPhoneNumber

    const data = {
      batchBeneficiary: dataBatch,
      bankCode: batch.newBankCode,
      beneficiaryAccount: batch.newBeneficiaryAccount,
      beneficiaryFirstName: batch.newBeneficiaryFirstName,
      email: batch.newEmail,
      phoneNumber: batch.newPhoneNumber,
    }
    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/local/initiate',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public saveLocal(batch, requestValidate): Observable<any> {
    const data = {
      batchBeneficiary: batch,
      requestValidate,
    }

    return this.http
      .post(this.servicesUrl + '/beneficiaries/requestStatus/local/save', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public deleteLocal(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newBanckCode
    delete dataBatch.newBeneficiaryAccount
    delete dataBatch.newBeneficiaryFirstName
    delete dataBatch.newEmail
    delete dataBatch.newPhoneNumber
    const data = {
      batchBeneficiary: dataBatch,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/beneficiaries/requestStatus/local/delete', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public reIinitiateInternational(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newAddressLine1
    delete dataBatch.newAddressLine2
    delete dataBatch.newAddressPostalCode
    delete dataBatch.newAddressRegion
    delete dataBatch.newBankAddress
    delete dataBatch.newBankName
    delete dataBatch.newBeneficiaryAccount
    delete dataBatch.newBeneficiaryCategory
    delete dataBatch.newBranchAddress
    delete dataBatch.newBranchSwiftCode
    delete dataBatch.newBranchName
    delete dataBatch.newCityState
    delete dataBatch.newCountryCode
    delete dataBatch.newCountryIssue
    delete dataBatch.newCountryNameEnglish
    delete dataBatch.newCurrency
    delete dataBatch.newDateBirth
    delete dataBatch.newDocumentSortCode
    delete dataBatch.newEmail
    delete dataBatch.newFirstName
    delete dataBatch.newIdNumber
    delete dataBatch.newIdType
    delete dataBatch.newIssueAt
    delete dataBatch.newIssueDate
    delete dataBatch.newLastName
    delete dataBatch.newMiddleName
    delete dataBatch.newMobileNo
    delete dataBatch.newNationality
    delete dataBatch.newPlaceBirth
    delete dataBatch.newPobox
    delete dataBatch.newSecondName
    delete dataBatch.newShortCode
    delete dataBatch.newStreetNo
    delete dataBatch.newSwiftCode
    delete dataBatch.newTelephoneNo
    delete dataBatch.newTelephoneNoArea
    delete dataBatch.newTelephoneNoExtension
    delete dataBatch.newTelephoneNoPrefix
    const data = {
      batchBeneficiary: batch,
      addressLine1: batch.newAddressLine1,
      addressLine2: batch.newAddressLine2,
      addressPostalCode: batch.newAddressPostalCode,
      addressRegion: batch.newAddressRegion,
      bankAddress: batch.newBankAddress,
      bankName: batch.newBankName,
      beneficiaryAccount: batch.newBeneficiaryAccount,
      beneficiaryCategory: batch.newBeneficiaryCategory,
      branchAddress: batch.newBranchAddress,
      branchCode: batch.newBranchSwiftCode,
      branchName: batch.newBranchName,
      cityState: batch.newCityState,
      countryCode: batch.newCountryCode,
      countryIssue: batch.newCountryIssue,
      countryNameEnglish: batch.newCountryNameEnglish,
      currency: batch.newCurrency,
      dateBirth: batch.newDateBirth,
      documentSortCode: batch.newDocumentSortCode,
      email: batch.newEmail,
      firstName: batch.newFirstName,
      idNumber: batch.newIdNumber,
      idType: batch.newIdType,
      issueAt: batch.newIssueAt,
      issueDate: batch.newIssueDate,
      lastName: batch.newLastName,
      middleName: batch.newMiddleName,
      mobileNo: batch.newMobileNo,
      nationality: batch.newNationality,
      placeBirth: batch.newPlaceBirth,
      pobox: batch.newPobox,
      secondName: batch.newSecondName,
      shortCode: batch.newShortCode,
      streetNo: batch.newStreetNo,
      swiftCode: batch.newSwiftCode,
      telephoneNo: batch.newTelephoneNo,
      telephoneNoArea: batch.newTelephoneNoArea,
      telephoneNoExtension: batch.newTelephoneNoExtension,
      telephoneNoPrefix: batch.newTelephoneNoPrefix,
    }
    return this.http
      .post(
        this.servicesUrl +
          '/beneficiaries/requestStatus/international/initiate',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public saveInternational(batch, requestValidate): Observable<any> {
    const data = {
      batchBeneficiary: batch,
      requestValidate,
    }

    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/requestStatus/international/save',
        data,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public deleteInternational(batch): Observable<any> {
    const dataBatch = Object.assign({}, batch)
    delete dataBatch.beneficiaryType
    delete dataBatch.newAddressLine1
    delete dataBatch.newAddressLine2
    delete dataBatch.newAddressPostalCode
    delete dataBatch.newAddressRegion
    delete dataBatch.newBankAddress
    delete dataBatch.newBankName
    delete dataBatch.newBeneficiaryAccount
    delete dataBatch.newBeneficiaryCategory
    delete dataBatch.newBranchAddress
    delete dataBatch.newBranchSwiftCode
    delete dataBatch.newBranchName
    delete dataBatch.newCityState
    delete dataBatch.newCountryCode
    delete dataBatch.newCountryIssue
    delete dataBatch.newCountryNameEnglish
    delete dataBatch.newCurrency
    delete dataBatch.newDateBirth
    delete dataBatch.newDocumentSortCode
    delete dataBatch.newEmail
    delete dataBatch.newFirstName
    delete dataBatch.newIdNumber
    delete dataBatch.newIdType
    delete dataBatch.newIssueAt
    delete dataBatch.newIssueDate
    delete dataBatch.newLastName
    delete dataBatch.newMiddleName
    delete dataBatch.newMobileNo
    delete dataBatch.newNationality
    delete dataBatch.newPlaceBirth
    delete dataBatch.newPobox
    delete dataBatch.newSecondName
    delete dataBatch.newShortCode
    delete dataBatch.newStreetNo
    delete dataBatch.newSwiftCode
    delete dataBatch.newTelephoneNo
    delete dataBatch.newTelephoneNoArea
    delete dataBatch.newTelephoneNoExtension
    delete dataBatch.newTelephoneNoPrefix

    const data = {
      batchBeneficiary: dataBatch,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(
        this.servicesUrl + '/beneficiaries/requestStatus/international/delete',
        { params: _param },
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }
}
