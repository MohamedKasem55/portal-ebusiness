import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../../Application/Model/exception'
import { Page } from '../../../../../Application/Model/page'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class PayrollCardsService {
  private servicesUrl: string
  tableSelectedRowsOperations = []
  tableSelectedRowsPayments = []
  tableSelectedRowsUploadFiles = []
  tableSelectedRowsNewCards = []

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }

    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  operationsGetList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/operations/list',
        body,
      )
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

  paymentsGetList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/payments/list',
        body,
      )
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

  uploadFilesGetList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/uploadFiles/list',
        body,
      )
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

  uploadFilesUserGetList(batch, pageNumber, rows): Observable<any> {
    const data: any = {}
    data.batch = batch
    data.page = pageNumber
    data.rows = rows
    const req = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl +
          '/payrollCards/pendingActions/uploadFiles/cardIncentive',
        req,
      )
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.cardIncentivesList.size
            page.totalElements = output.cardIncentivesList.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            pagedData.data = output.cardIncentivesList.items
            pagedData['layout'] = output.companyLayout
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  newCardGetList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/newCard/list',
        body,
      )
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

  operationsValidate(batch) {
    const data: any = {}
    data.selectedOperations = batch

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/operations/validate',
        body,
      )
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

  paymentsValidate(batch) {
    const data: any = {}
    data.payrollCardsPaymentsList = batch

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/payments/validate',
        body,
      )
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
  uploadFilesValidate(batch) {
    const data: any = {}
    data.batchList = batch
    // data.type = 'AuthorizeAction';

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/uploadFiles/validate',
        body,
      )
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
  newCardValidate(batch) {
    const data: any = {}
    data.payrollCardBatchList = batch

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/newCard/validate',
        body,
      )
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

  operationsAproveConfirm(batch, requestValidate) {
    const data: any = {}
    data.batchListsContainerDTO = batch.batchListsContainerDTO
    data.cardsFeesInquiryDTO = batch.cardsFeesInquiryDTO
    data.incentiveInstitutions = null
    data.requestValidate = requestValidate

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/operations/confirm',
        body,
      )
      .pipe(
        map((response: any, index: number) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
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
  paymentsAproveConfirm(batch, requestValidate) {
    const data: any = {}

    data.listNewPayments = null // (Array[NewPayments], optional),
    data.batchList = batch.batchList // (PayrollCardsPaymentsDSO, optional),
    data.cardsFeesInquiryDTO = batch.cardsFeesInquiryDTO // (PayrollCardsFeesInquiryOutTXDTO, optional),
    data.totalAmount = batch.totalAmount // (number, optional),
    data.totalPayments = batch.totalPayments // (integer, optional),
    data.validatePayments = requestValidate // (RequestValidatePayments, optional)

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/payments/confirm',
        body,
      )
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
  uploadFilesAproveConfirm(batch, requestValidate) {
    const data: any = {}

    data.batchList = batch.batchList
    data.requestValidate = requestValidate

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/uploadFiles/confirm',
        body,
      )
      .pipe(
        map((response: any, index: number) => {
          const output = response
          let result: any
          if (output.errorCode !== '0') {
            result = {}
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
  newCardAproveConfirm(batch, requestValidate) {
    const data: any = {}

    data.batchList = batch.payrollCardBatchList
    data.requestValidate = requestValidate
    data.incentiveInstitutions = null

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/newCard/confirm',
        body,
      )
      .pipe(
        map((response: any, index: number) => {
          const output = response
          let result: any

          if (output.errorCode !== '0') {
            result = {}
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

  operationsRejectConfirm(batch) {
    const data: any = {}
    data.batchListsContainerDTO = batch.batchListsContainerDTO
    data.rejectionReason = batch.rejectionReason

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/operations/refuse',
        body,
      )
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
  paymentsRejectConfirm(batch) {
    const data: any = {}
    const batchList = batch.batchList.toAuthorize.concat(
      batch.batchList.toProcess,
    )
    data.batchList = batchList
    data.rejectionReason = batch.rejectionReason // (string, mandatory)

    const body = JSON.stringify(data)
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/payments/refuse',
        body,
      )
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
  uploadFilesRejectConfirm(batch) {
    const data: any = {}
    // data.batchList = batch.batchList.toProcess; // (PayrollCardUploadBatchDSO, optional),
    data.rejectionReason = batch.rejectionReason // (string, mandatory)
    const batchList = batch.batchList.toAuthorize.concat(
      batch.batchList.toProcess,
    )
    data.batchList = batchList

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/uploadFiles/refuse',
        body,
      )
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
  newCardRejectConfirm(batch) {
    const data: any = {}
    const batchList = batch.payrollCardBatchList.toAuthorize.concat(
      batch.payrollCardBatchList.toProcess,
    )
    data.batchList = batchList // (PayrollCardBatchDSO, optional),
    data.rejectionReason = batch.rejectionReason // (string, mandatory)

    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/pendingActions/newCard/refuse',
        body,
      )
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

  //Conseguir rol de usuario (payrollCardsLayout)
  getUserRol(): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/payrollCards/getInstitution')
      .pipe(
        map((response: any) => {
          let result: any = {}
          const json = response

          if (json.errorCode && json.errorCode === '0') {
            result = json
            result.error = false
          } else {
            result.error = true
            result.errorCode = json.errorCode
            result.errorDescription = json.errorDescription
          }

          return result
        }),
        catchError((res) => {
          const result: any = {}
          result.error = true
          result.errorCode = -1
          result.errorDescription = result.errorDescription

          return of(result)
        }),
      )
  }
}
