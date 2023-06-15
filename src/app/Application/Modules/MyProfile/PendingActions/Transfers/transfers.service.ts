import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class TransfersService {
  servicesUrl: string
  tableSelected: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getList(page, rows): Observable<any> {
    const data: any = {}
    data.page = page
    data.pending = true
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/transfers/batch/list', data)
      .pipe(
        map((response: any) => {
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

  public validate(batchList, segment): Observable<any> {
    const data: any = {}
    data.batchList = batchList
    data.segment = segment

    return this.http
      .post(this.servicesUrl + '/transfers/pendingActions/validate', data)
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

  public refuse(batchTransfersList, reason): Observable<any> {
    const data: any = {}
    data.batchTransfers = batchTransfersList
    data.reason = reason

    return this.http
      .post(this.servicesUrl + '/transfers/pendingActions/refuse', data)
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

  public confirm(
    batchListWithinContainer,
    batchListOwnContainer,
    batchListLocalContainer,
    batchListInternationalContainer,
    requestValidate,
  ): Observable<any> {
    const data: any = {}
    data.batchListAlrajhi = batchListWithinContainer
    data.batchListOwn = batchListOwnContainer
    data.batchListInternational = batchListInternationalContainer
    data.batchListLocal = batchListLocalContainer
    data.requestValidate = requestValidate
    console.log(data)
    return this.http
      .post(this.servicesUrl + '/transfers/pendingActions/confirm', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
            if (output.errorCode === '-3') {
              result.generateChallengeAndOTP = output.generateChallengeAndOTP
            }
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  setSelected(selected) {
    // ('set transfer selected');
    this.tableSelected.next(selected)
  }

  get getSelected() {
    return this.tableSelected.asObservable()
  }
}
