/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { StorageService } from '../../../../core/storage/storage.service'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelStadingModel } from '../Model/standingOrder.model'

@Injectable()
export class StadingOrdersService {
  token: string
  servicesUrl: string
  currentUser

  account: any
  dateFormat = 'yyyy-MM-dd'

  element: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  /*guardar datos del formulario*/

  addform1(ModelStadi: ModelStadingModel) {
    return this.http
      .post(this.servicesUrl + '', ModelStadi)
      .pipe(catchError(this.handleError))
  }

  // ADD LOCAL STANDINORDER

  public ValidacionaddStandingOrder(
    accountNumberForm: string,
    accountNumberTo: string,
    amountType: string,
    beneficiaryAccount: string,
    beneficiaryId: string,
    bg: number,
    dateFrom: string,
    dateTo: string,
    dayMonth: any,
    name: string,
    onType1: boolean,
    onType2: boolean,
    orderType1: string,
    orderType2: string,
    ownAccountsFlag: string,
    purpose: string,
    remarks: string,
  ): Observable<any> {
    const data = {
      accountNumberForm,
      accountNumberTo,
      amountType,
      beneficiaryAccount,
      beneficiaryId,
      bg: Number(bg),
      dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
      dayMonth,
      name,
      onType1,
      onType2,
      orderType1,
      orderType2,
      ownAccountsFlag,
      purpose,
      remarks,
    }

    return this.http
      .post(this.servicesUrl + '/standingOrders/validateStandingOrder', data)
      .pipe(
        map((response: any) => {
          return response || {}
        }),
        //  .do(data => //console.log('lo que trae confirm: ' + JSON.stringify(data)))
        catchError(this.handleError),
      )
  }

  public addStandingOrder(
    accountNumberForm: string,
    accountNumberTo: string,
    amountType: string,
    beneficiaryAccount: string,
    beneficiaryId: string,
    bg: number,
    dateFrom: string,
    dateTo: string,
    dayMonth: any,
    name: string,
    onType1: boolean,
    onType2: boolean,
    orderType1: string,
    orderType2: string,
    ownAccountsFlag: string,
    purpose: string,
    remarks: string,
  ): Observable<any> {
    const data = {
      accountNumberForm,
      accountNumberTo,
      amountType,
      beneficiaryAccount,
      beneficiaryId,
      bg: Number(bg),
      dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
      dayMonth,
      name,
      onType1,
      onType2,
      orderType1,
      orderType2,
      ownAccountsFlag,
      purpose,
      remarks,
    }

    const body = JSON.stringify(data)

    //console.log("entrada alta local bene: ", body);

    return this.http
      .post(
        this.servicesUrl + '/standingOrders/processAddBatchStandingOrder',
        body,
      )
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  confirmStandingOrder2(data) {
    //

    return this.http
      .post(this.servicesUrl + '/standingOrders/confirmStandingOrder', data)
      .pipe(catchError(this.handleError))
  }

  comboAccontsStadingOder() {
    //   return this.http.get( this.servicesUrl + "/userProfile/getSARAccounts")
    //   .pipe(map((_data) => _data['listAlertsPermissionAccount']
    //     ,catchError( this.handleError ));

    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 20,
      txType: 'ECIA',
    }

    //console.log(txType);

    return (
      this.http
        .get(this.servicesUrl + '/standingOrders/expressRemittanceCardList')
        //"currency":"608
        .pipe(
          map((_data) =>
            _data['listAlertsPermissionAccount'].filter(
              (x) => x.currency === '608',
            ),
          ),
          // .do(data => //console.log('servio de combo: ' + JSON.stringify(data)))
          catchError(this.handleError),
        )
    )
  }

  combostandingordenPurpose() {
    const data = { name: 'purposeType' }

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
      map((r) => {
        const result = []

        const json = r['props']

        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            const value = json[key]
            result.push({ key, value })
          }
        }
        return result
      }),
      catchError(this.handleError),
    )
  }

  getBeneficiaries(accountNumber) {
    const url =
      this.servicesUrl + '/standingOrders/beneficiaryList/' + accountNumber
    return this.http.get(url)
  }

  // getBeneficiaries(accountNumber) {
  //   const url =
  //     this.servicesUrl + '/standingOrders/beneficiaryList/' + accountNumber;
  //   return this.http.get(url).pipe(
  //     map(data => data['beneficiaryList'].filter(x => x.type === '02')),
  //     // .do(data => //console.log('servicios beneficiaries saad: ' + JSON.stringify(data)))
  //     catchError(this.handleError)
  //   );
  // }
  //
  // getBeneficiariesASad(accountNumber) {
  //   return this.http
  //     .get(
  //       this.servicesUrl + '/standingOrders/beneficiaryList/' + accountNumber
  //     )
  //
  //     .pipe(
  //       map(data => data['beneficiaryList'].filter(x => x.type === '01')),
  //       //   .do(data => //console.log('servicios beneficiaries saad: ' + JSON.stringify(data)))
  //       catchError(this.handleError)
  //     );
  // }

  ////********************Desde Aqui**************************///

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    //console.log("Local beni error: ", error);

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

  public getResults(accountNumber, size): Observable<any> {
    const data = {}
    const body = JSON.stringify(data)
    return this.http
      .post(
        this.servicesUrl + '/standingOrders/standingOrderList/' + accountNumber,
        body,
      )
      .pipe(
        map((response: any) => {
          const output = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              output.errorCode,
              output.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            const standings = output.standingOrderList
            const pagedData = new PagedData<ModelStadingModel>()
            const pageObject = new Page()
            pageObject.pageSize = size
            pagedData.page = pageObject
            pagedData.data = standings
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public validate(select: any) {
    const data = {
      amount: select.amount,
      amountOption: select.amountOption,
      dateMounth: select.dayOfMonth,
      dateFrom: this.dateFormatPipe.transform(select.dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(select.dateTo, this.dateFormat),
      standingOrderDetail: select,
    }
    data.standingOrderDetail.dateFrom = this.dateFormatPipe.transform(
      select.dateFrom,
      this.dateFormat,
    )
    data.standingOrderDetail.dateTo = this.dateFormatPipe.transform(
      select.dateTo,
      this.dateFormat,
    )

    //
    return this.http
      .post(this.servicesUrl + '/standingOrders/modify/validate', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmModify(standing): Observable<any> {
    const data = {
      requestValidate: {
        challengeNumber: standing.requestValidate,
      },
      standingOrderBatch: standing.standingOrderBatch,
    }

    return this.http
      .post(this.servicesUrl + '/standingOrders/modify/confirm', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
              response.generateChallengeAndOTP,
            )
            return exception
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public validateDelete(select: any) {
    const data = {
      standingOrderDetail: select,
    }
    const body = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/standingOrders/delete/validate', body)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public confirmDelete(standing): Observable<any> {
    //console.log(standing);
    const data = {
      requestValidate: {
        challengeNumber:
          standing.generateChallengeAndOTP &&
          'CHALLENGE' == standing.generateChallengeAndOTP.typeAuthentication
            ? standing.requestValidate.challengeNumber
            : '',
        challengeResponse:
          standing.generateChallengeAndOTP &&
          'CHALLENGE' == standing.generateChallengeAndOTP.typeAuthentication
            ? standing.requestValidate.challengeResponse
            : '',
        otp:
          standing.generateChallengeAndOTP &&
          'OTP' == standing.generateChallengeAndOTP.typeAuthentication
            ? standing.requestValidate.otp
            : '',
        password:
          standing.generateChallengeAndOTP &&
          'STATIC' == standing.generateChallengeAndOTP.typeAuthentication
            ? standing.requestValidate.password
            : '',
      },
      standingOrderBatch: standing.standingOrderBatch,
    }

    const body = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/standingOrders/delete/confirm', body)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
              response.generateChallengeAndOTP,
            )
            return exception
          } else {
            const output = response
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public setAccount(_account) {
    this.account = _account
  }

  public getAccount(): any {
    return this.account
  }

  getList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/standingOrders/requestStatus/list', data)
      .pipe(
        map((response: any, index: number) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
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

  public getBatch(batch): Observable<any> {
    const data = {
      standingOrderBatch: batch,
    }
    return this.http
      .post(this.servicesUrl + '/standingOrders/requestStatus/getBatch', data)
      .pipe(
        map((response: any) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
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

  getElement() {
    return this.element
  }

  setElement(element) {
    this.element = element
  }
}
