import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PrepaidCardsService {
  private servicesUrl: string
  baseRoute = '/prepaidCards/pending/'
  baseRouteReplace = '/prepaidCards/replace/pending/'

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPending(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    // pending commercialCards list
    return this.http
      .post(this.servicesUrl + this.baseRoute + 'list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response
          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public getPendingReplace(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + this.baseRouteReplace + 'list', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}
          const output = response
          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeValidate(pendingCommercialCardsList): Observable<any> {
    const data: any = {}
    data.batchList = pendingCommercialCardsList

    return this.http
      .post(this.servicesUrl + this.baseRoute + 'validate', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeValidateReplace(
    pendingPrepaidCardReplaceList,
  ): Observable<any> {
    const data: any = {}
    data.batchList = pendingPrepaidCardReplaceList

    return this.http
      .post(this.servicesUrl + this.baseRouteReplace + 'validate', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeConfirm(batchList, requestValidate): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate

    return this.http
      .post(this.servicesUrl + this.baseRoute + 'confirm', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeConfirmReplace(batchList, requestValidate): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.requestValidate = requestValidate
    console.log('data: ', data)
    return this.http
      .post(this.servicesUrl + this.baseRouteReplace + 'confirm', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}
          const output = response
          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public refuseConfirm(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectReason = rejectReason

    return this.http
      .post(this.servicesUrl + this.baseRoute + 'refuse', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public refuseConfirmReplace(batchList, rejectReason): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.rejectReason = rejectReason

    return this.http
      .post(this.servicesUrl + this.baseRouteReplace + 'refuse', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }
}
