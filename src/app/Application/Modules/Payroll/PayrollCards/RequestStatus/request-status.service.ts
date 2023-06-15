import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class RequestStatusService {
  servicesUrl: string
  payment: any
  operation: any
  cardOnline: any
  uploadFile: any
  uploadFileRow: any

  constructor(
    private http: HttpClient,
    private config: ConfigResourceService,
    public datePipe: DatePipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getCardPaymentsList(page, rows, search): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.status) {
      data.status = search.status
    }
    if (search.name) {
      data.batchName = search.name
    }
    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/requestStatus/payment/list', body)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            for (
              let i = 0;
              i < output.batchListPayrolCardPayment.items.length;
              i++
            ) {
              output.batchListPayrolCardPayment.items[i]['currentLevel'] =
                this.getLevel(
                  output.batchListPayrolCardPayment.items[i].status,
                  output.batchListPayrolCardPayment.items[i]
                    .securityLevelsDTOList,
                )
              output.batchListPayrolCardPayment.items[i]['nextLevel'] =
                this.getNextLevel(
                  output.batchListPayrolCardPayment.items[i].status,
                  output.batchListPayrolCardPayment.items[i]
                    .securityLevelsDTOList,
                )
            }
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getUploadCardPaymentsFiles(page, rows, search): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.status) {
      data.status = search.status
    }
    if (search.name) {
      data.batchName = search.name
    }
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/uploadFile/list',
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
            for (
              let i = 0;
              i < output.batchListPayrolCardUploadFile.items.length;
              i++
            ) {
              output.batchListPayrolCardUploadFile.items[i]['currentLevel'] =
                this.getLevel(
                  output.batchListPayrolCardUploadFile.items[i].status,
                  output.batchListPayrolCardUploadFile.items[i]
                    .securityLevelsDTOList,
                )
              output.batchListPayrolCardUploadFile.items[i]['nextLevel'] =
                this.getNextLevel(
                  output.batchListPayrolCardUploadFile.items[i].status,
                  output.batchListPayrolCardUploadFile.items[i]
                    .securityLevelsDTOList,
                )
            }
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getCardOperations(page, rows, search): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows
    //console.log(search);
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.status) {
      data.status = search.status
    }
    if (search.name) {
      data.employeeName = search.name
    }
    const body = JSON.stringify(data)

    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/operation/list',
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
            for (let i = 0; i < output.listOperations.items.length; i++) {
              output.listOperations.items[i]['currentLevel'] = this.getLevel(
                output.listOperations.items[i].status,
                output.listOperations.items[i].securityLevelsDTOList,
              )
              output.listOperations.items[i]['nextLevel'] = this.getNextLevel(
                output.listOperations.items[i].status,
                output.listOperations.items[i].securityLevelsDTOList,
              )
            }
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getRequestNewCardsOnline(page, rows, search): Observable<any> {
    const data: any = {}
    data.page = page
    data.rows = rows
    if (search.dateTo) {
      data.dateTo = this.datePipe.transform(search.dateTo, 'yyyy-MM-dd')
    }
    if (search.dateFrom) {
      data.dateFrom = this.datePipe.transform(search.dateFrom, 'yyyy-MM-dd')
    }
    if (search.status) {
      data.status = search.status
    }
    if (search.name) {
      data.batchName = search.name
    }
    const body = JSON.stringify(data)

    return this.http
      .post(this.servicesUrl + '/payrollCards/requestStatus/newCard/list', body)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            for (let i = 0; i < output.batchListPayrolCard.items.length; i++) {
              output.batchListPayrolCard.items[i]['currentLevel'] =
                this.getLevel(
                  output.batchListPayrolCard.items[i].status,
                  output.batchListPayrolCard.items[i].securityLevelsDTOList,
                )
              output.batchListPayrolCard.items[i]['nextLevel'] =
                this.getNextLevel(
                  output.batchListPayrolCard.items[i].status,
                  output.batchListPayrolCard.items[i].securityLevelsDTOList,
                )
            }
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  getLevel(status: string, levels): string {
    let response = ''
    if (status != 'R') {
      for (let i = 0; i < levels.length; i++) {
        if (levels[i]['status'] == 'A' || levels[i]['status'] == 'I') {
          response += 'L' + levels[i]['level'] + ' '
        }
      }
    }
    return response
  }

  getNextLevel(status: string, levels): string {
    let response = ''
    for (let i = 0; i < levels.length; i++) {
      if (status == 'R' || levels[i]['status'] == 'P') {
        response += 'L' + levels[i]['level'] + ' '
      }
    }
    return response
  }

  public getBatchPayment(batch): Observable<any> {
    const data = {
      payrollCardsPayments: batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/payment/detail',
        data,
      )
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

  public getBatchOperation(batch): Observable<any> {
    const data = {
      payrollCardsPayments: batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/payment/detail',
        data,
      )
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

  public getBatchNewCardOnline(batch): Observable<any> {
    const data = {
      payrollCardBatch: batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/newCard/detail',
        data,
      )
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

  public getBatchUploadFile(batch): Observable<any> {
    const data = {
      payrollCardUploadBatch: batch,
    }
    return this.http
      .post(
        this.servicesUrl + '/payrollCards/requestStatus/uploadFile/detail',
        data,
      )
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

  public getBatchUploadFileDetails(batch, page, rows): Observable<any> {
    const data = {
      batch,
      rows,
      page,
    }
    return this.http
      .post(
        this.servicesUrl +
          '/payrollCards/pendingActions/uploadFiles/cardIncentive',
        data,
      )
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

  setPayment(payment) {
    this.payment = payment
  }

  getPayment() {
    const pay = this.payment
    return pay
  }

  setOperation(operation) {
    this.operation = operation
  }

  getOperation() {
    const op = this.operation
    return op
  }

  setNewCardOnline(cardOnline) {
    this.cardOnline = cardOnline
  }

  getNewCardOnline() {
    const card = this.cardOnline
    return card
  }

  setUploadFile(uploadFile) {
    this.uploadFile = uploadFile
  }

  getUploadFile() {
    const file = this.uploadFile
    return file
  }

  setUploadFileRow(uploadFile) {
    this.uploadFileRow = uploadFile
  }

  getUploadFileRow() {
    const row = this.uploadFileRow
    return row
  }
}
