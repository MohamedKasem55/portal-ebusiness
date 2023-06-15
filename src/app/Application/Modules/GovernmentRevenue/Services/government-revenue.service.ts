import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { NgbDateCustomParserFormatter } from '../../../../core/alt-calendar/date-custom-parse-formatter'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { StorageService } from '../../../../core/storage/storage.service'
import { Company } from '../../../Model/company'
import { Exception } from '../../../Model/exception'
import { PagedData } from '../../../Model/paged-data'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { GovRevenueBatchDSO } from '../Model/gov-revenue-batch'

@Injectable()
export class GovernmentRevenueService extends AbstractService {
  servicesUrl: string

  private _company: Company

  private _previousPayment: any

  private _bulkUpload: any

  dateFormatter: NgbDateCustomParserFormatter

  constructor(
    public http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
    public translate: TranslateService,
  ) {
    super(http, config)
    this.servicesUrl = config.getServicesUrl().concat('/governmentRevenue/')
    this.dateFormatter = new NgbDateCustomParserFormatter()
  }

  get company() {
    if (!this._company) {
      const currentUser = JSON.parse(
        this.storageService.retrieve('currentUser'),
      )
      this._company = currentUser.company
    }
    return this._company
  }

  get previousPayment(): GovRevenueBatchDSO {
    let payment = null
    if (this._previousPayment) {
      payment = JSON.parse(this._previousPayment)
      this._previousPayment = null
    }
    return payment
  }

  get bulkUpload(): GovRevenueBatchDSO {
    let bulkUpload = null
    if (this._bulkUpload) {
      bulkUpload = JSON.parse(this._bulkUpload)
      this._previousPayment = null
    }
    return bulkUpload
  }

  set previousPayment(payment: GovRevenueBatchDSO) {
    this._previousPayment = JSON.stringify(payment)
  }

  set bulkUpload(payment: GovRevenueBatchDSO) {
    this._bulkUpload = JSON.stringify(payment)
  }

  initNewPayment(): Observable<any> {
    return this.doGet(this.servicesUrl + 'newPayment/init')
  }

  initFromPrevious(previous: GovRevenueBatchDSO): Observable<any> {
    return this.doPost(this.servicesUrl + 'previousPayment/load', {
      batch: previous,
    })
  }

  validateNewPayment(validateRequest: any): Observable<any> {
    return this.doPost(this.servicesUrl + 'newPayment/validate', validateRequest)
  }

  confirmNewPayment(values: any, requestValidate: any): Observable<any> {
    const data = {
      batch: values,
      requestValidate,
      saveCheck: true,
    }
    return this.doPost(this.servicesUrl + 'newPayment/confirm', data)
  }

  listPreviousPayments(offset, rows): Observable<PagedData<GovRevenueBatchDSO>> {
    const data = {
      page: offset + 1,
      rows,
    }
    return this.doPost(this.servicesUrl + 'previousPayment/list', data, {}, (response) => {
      const resultData = new PagedData<GovRevenueBatchDSO>()
      const output = response.govRevPrevious;
      resultData.page.pageNumber = offset;
      resultData.page.pageSize = rows;
      resultData.page.size = output.size;
      resultData.page.totalElements = output.total;
      resultData.page.totalPages = Math.ceil(resultData.page.totalElements / resultData.page.pageSize)
      resultData.data = output.items
      return resultData;
    }) as Observable<PagedData<GovRevenueBatchDSO>>

  }

  listRequestStatus(page, rows): Observable<any> {
    const data = {
      page,
      rows,
    }

    return this.doPost(this.servicesUrl + 'requestStatus/list', data, {}, (response) => {
      const resultData = new PagedData<any>()
      const output = response.govRevPrevious
      resultData.page.pageNumber = page
      resultData.page.pageSize = rows
      resultData.page.size = output.size
      resultData.page.totalElements = output.total
      resultData.page.totalPages = Math.ceil(
        resultData.page.totalElements / resultData.page.pageSize,
      )
      resultData.data = output.items
      return resultData
    })
  }

  detailRequestStatus(previous: GovRevenueBatchDSO): Observable<any> {
    return this.doPost(this.servicesUrl + 'individualPayment/details', {
      batchPk: previous.batchPk,
    })
  }

  detailFileRequestStatus(batch: GovRevenueBatchDSO): Observable<any> {
    return this.doPost(this.servicesUrl + 'file/details', {
      batchPk: batch.batchPk,
    })
  }

  initiateRequestStatus(initiateRequest: any): Observable<any> {
    return this.doPost(this.servicesUrl + 'requestStatus/validate', initiateRequest)
  }

  reInitiateRequestStatus(value: any, requestValidate: any): Observable<any> {
    const data = {
      batch: value,
      requestValidate,
      saveCheck: true,
    }
    return this.doPost(this.servicesUrl + 'requestStatus/reInitiate', data)
  }

  deleteRequestStatus(requestDelete: any): Observable<any> {
    return this.doPost(this.servicesUrl + 'requestStatus/delete', requestDelete)
  }

  getDepositorsByChapter(chapter: String): Observable<any> {
    const params = {
      chapter
    }
    return this.http.post(this.servicesUrl.concat('newPayment/filteredDepositors'), params)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return new Exception(response.errorCode, response.errorDescription)
          } else {
            return response
          }
        }),
        catchError(this.handleError),
      )
  }
}
