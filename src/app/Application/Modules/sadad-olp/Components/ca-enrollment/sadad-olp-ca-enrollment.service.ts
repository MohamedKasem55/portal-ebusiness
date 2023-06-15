import { Injectable } from '@angular/core'
import { AbstractService } from '../../../Common/Services/Abstract/abstract.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { BehaviorSubject, Observable } from 'rxjs'
import { DatePipe } from '@angular/common'

@Injectable()
export class SadadOlpCaEnrollmentService extends AbstractService {
  data: any = null
  comboData: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  serviceActiveOperation = 'ACTIVE_OLP_SERVICE'
  serviceDisableOperation = 'DISABLE_OLP_SERVICE'
  serviceUpdateDataOperation = 'UPDATE_OLP_SERVICE_DATA'
  operation: any = ''
  refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  //TODO this must be improved
  MERCHANT_STATUS_REGISTERED = '1'
  MERCHANT_STATUS_TESTING = '2'
  MERCHANT_STATUS_ACTIVE = '3'
  MERCHANT_STATUS_BLACKLISTED = '4'
  MERCHANT_STATUS_ONHOLD = '5'
  MERCHANT_STATUS_CLOSED = '6'
  MERCHANT_STATUS_DISABLED = '7'
  MERCHANT_STATUS_PENDING_APPROVAL = '101'
  MERCHANT_STATUS_APPROVED = '102'
  MERCHANT_STATUS_REJECTED = '103'

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    private datePipe: DatePipe,
  ) {
    super(http, config)
  }

  public detailsCAEnrollment(): Observable<any> {
    return this.http.get(this.servicesUrl + '/sadadolp/admin/initiate')
  }

  setComboData(value) {
    this.comboData.next(value)
  }

  getComboData() {
    return this.comboData.asObservable()
  }

  public confirmUpdateSerivceOlpData(values: any): Observable<any> {
    values['brandName'] = this.data.sadadOlpMerchantDetails.brandName
      ? this.data.sadadOlpMerchantDetails.brandName
      : ''
    values['currency'] = this.data.sadadOlpMerchantDetails.currency
      ? this.data.sadadOlpMerchantDetails.currency
      : ''
    values['failureResponseURL'] = this.data.sadadOlpMerchantDetails
      .failureResponseURL
      ? this.data.sadadOlpMerchantDetails.failureResponseURL
      : ''
    values['products'] = this.data.sadadOlpMerchantDetails.products
      ? this.data.sadadOlpMerchantDetails.products
      : ''
    values['remarks'] = this.data.sadadOlpMerchantDetails.remarks
      ? this.data.sadadOlpMerchantDetails.remarks
      : ''
    values['successResponseUrl'] = this.data.sadadOlpMerchantDetails
      .successResponseUrl
      ? this.data.sadadOlpMerchantDetails.successResponseUrl
      : ''
    values['webSiteUrl'] = this.data.sadadOlpMerchantDetails.webSiteUrl
      ? this.data.sadadOlpMerchantDetails.webSiteUrl
      : ''
    values['testFailureResponseUrl'] = ''
    values['testSuccessResponseUrl'] = ''

    const param = values
    param['sadadOLPMerchantDetails'] = this.data.sadadOlpMerchantDetails

    return this.http.post(
      this.servicesUrl + '/sadadolp/admin/updateDetails/confirm',
      param,
    )
  }

  public confirmChangeSerivceOLPStatus(
    dateFrom,
    dateTo,
    action,
  ): Observable<any> {
    const fdate = this.datePipe.transform(dateFrom, 'yyyy-MM-dd')
    const tdate = this.datePipe.transform(dateTo, 'yyyy-MM-dd')

    let newStatus = ''
    if (action == this.serviceActiveOperation) {
      newStatus = this.MERCHANT_STATUS_ACTIVE
    } else if (action == this.serviceDisableOperation) {
      newStatus = this.MERCHANT_STATUS_DISABLED
    }
    const param = {
      dateFrom: fdate,
      dateTo: tdate,
      newStatus: newStatus,
      sadadOLPMerchantDetails: this.data.sadadOlpMerchantDetails,
    }
    return this.http.post(
      this.servicesUrl + '/sadadolp/admin/updateMerchantStatus',
      param,
    )
  }
}
