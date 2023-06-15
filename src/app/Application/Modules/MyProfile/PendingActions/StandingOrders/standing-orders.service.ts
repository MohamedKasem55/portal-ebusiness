import { Injectable, Injector } from '@angular/core'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../../Components/common/Pipes/getLevels-pipe'
import { OperationPipe } from '../../../../Components/common/Pipes/operation.pipe'
import { TranslateService } from '@ngx-translate/core'
import { ModelPipe } from '../../../../Components/common/Pipes/model-pipe'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class StandingOrdersService {
  private servicesUrl: string
  tableSelectedObs: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    public injector: Injector,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getList(page, rows) {
    const data: any = {}
    data.page = page
    data.rows = rows

    return this.http
      .post(this.servicesUrl + '/standingOrders/pendingActions/getList', data)
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
            this.processItemsLevels(result.pendingStandingOrderList.items)
            result.error = false
          }
          return result
        }),
      )
  }

  authorizeValidate(list) {
    const data: any = {}
    data.batchSetAuth = list

    return this.http
      .post(
        this.servicesUrl + '/standingOrders/pendingActions/authorizeValidate',
        data,
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
            this.processItemsLevels(result.authorizationPermission.toProcess)
            this.processItemsLevels(result.authorizationPermission.toAuthorize)
            result.error = false
          }
          return result
        }),
      )
  }

  refuseValidate(list) {
    const data: any = {}
    data.batchSetRefuse = list

    return this.http
      .post(
        this.servicesUrl + '/standingOrders/pendingActions/refuseValidate',
        data,
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
            this.processItemsLevels(result.authorizationPermission.toProcess)
            this.processItemsLevels(result.authorizationPermission.toAuthorize)
            result.error = false
          }
          return result
        }),
      )
  }

  authorizeConfirm(batchListStandingOrders, requestValidate) {
    const data: any = {}
    data.batchListStandingOrders = batchListStandingOrders
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + '/standingOrders/pendingActions/authorizeConfirm',
        data,
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

  refuseConfirm(list, reject) {
    const data: any = {}
    data.batchStandingRefuses = list['authorizationPermission']['toProcess']
    data.reason = reject

    return this.http
      .post(
        this.servicesUrl + '/standingOrders/pendingActions/refuseConfirm',
        data,
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

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'nextStatus',
        )
        item['purposeExport'] = new ModelPipe(this.injector).transform(
          'purposeType',
          item.purpose,
        )
        item['amountTypeExport'] = this.translate.instant(
          item.amountType == 0
            ? 'standingOrder.amountLbl'
            : 'standingOrder.minimumBalanceLbl',
        )
        item['paymentTypeExport'] = this.translate.instant(
          'standingOrder.paymentType',
          {
            value: item.paymentType,
          },
        )
        item['optionExport'] = new OperationPipe(this.translate).transform(
          item.option,
        )
      })
    }
  }
  setTableSelected(selected) {
    this.tableSelectedObs.next(selected)
  }

  get getTableSelected() {
    return this.tableSelectedObs.asObservable()
  }
}
