import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StatusPipe } from '../../../../../Components/common/Pipes/status-pipe'
import { Exception } from '../../../../../Model/exception'
import { PendingActionsUtilityService } from '../../../../Common/Components/PendingActions/pending-actions-utility.service'
import { UserDetails } from '../../../../CompanyAdmin/Model/userDetails'

@Injectable()
export class UserManagementPendingActionService extends PendingActionsUtilityService {
  actionsDisabled = false

  private _fieldsConfigForSearchForm: any[] = [
    {
      // "key": "companyProfile",
      // "title": "companyProfile",
      // "translate": "companyProfileNumber",
      // "type": "text",
      // "required": false,
      // "default": "",
      // "validators": [],
      // "widget": "",
      // "widget_container_class": "col-xs-12 col-sm-3",
      // "widget_container_init_row": false,
      // "widget_container_end_row": false,
    },
  ]

  private _fieldsConfigForList: any[] = [
    {
      key: 'userId',
      propName: 'userId',
      propValue: (row, service, combosData) => row.userId,
      translate: 'userId',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      export: true,
    },
    {
      key: 'userName',
      propName: 'userName',
      propValue: (row, service, combosData) => row.userName, //TODO get comissionString
      translate: 'userName',
      link_to_detail: true,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
    {
      key: 'status',
      propName: 'status',
      propValue: (row, service, combosData) => {
        return this.statusPipe.transform(row.status)
      }, //TODO get comissionString
      translate: 'status',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
    {
      key: 'typeOperation',
      propName: 'typeOperation',
      propValue: (row, service, combosData) => {
        if (combosData['process'] === undefined) {
          return ''
        }
        const val = combosData['process'].find((elem) => {
          return elem['key'] == row.typeOperation
        })
        return val ? val['value'] : row.typeOperation
      },
      translate: 'typeOperation',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
    {
      key: 'type',
      propName: 'type',
      propValue: (row, service, combosData) => {
        if (combosData['batchTypes'] === undefined) {
          return ''
        }
        const val = combosData['batchTypes'].find((elem) => {
          return elem['key'] === row.type
        })
        return val ? val['value'] : row.type
      },
      translate: 'type',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
    {
      key: 'initiationDate',
      propName: 'initiationDate',
      propValue: (row, service, combosData) => {
        return new DateFormatPipe(this.injector, this.locale).transform(
          row.initiationDate,
          'dd/MM/yyyy HH:mm:ss',

        )
      },
      translate: 'initiationDate',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
    {
      key: 'initiatedBy',
      propName: 'initiatedBy',
      propValue: (row, service, combosData) => {
        const initiatedBy = row['securityLevelsDTOList'].find((elem) => {
          return +elem['level'] === 1
        })
        return initiatedBy ? initiatedBy['updater'] : ''
      },
      translate: 'initiatedBy',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
    },
  ]

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    protected translateService: TranslateService,
    public statusPipe: StatusPipe,
    public datePipe: DatePipe,
    protected injector: Injector,
    @Inject(LOCALE_ID) protected locale: string,
  ) {
    super(http, config, injector, locale)
    this.actionsDisabled = false
  }

  /**
   * Returns translation prefix for i18n texts
   */
  public getTranslatePrefix(): string {
    return 'userManagement'
  }

  /**
   * Returns search form fields definitions for filter results
   */
  public getFieldsConfigForSearchForm(): any[] {
    return this._fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    return this._fieldsConfigForList
  }

  isApproveAllowed(): boolean {
    return this.authenticationService.activateOption(
      'PendingActionUsersAdd',
      [],
      ['CompanyAdmins'],
    )
  }

  isRefuseAllowed(): boolean {
    return this.authenticationService.activateOption(
      'PendingActionUsersAdd',
      [],
      ['CompanyAdmins'],
    )
  }

  /**
   * Configure params for search and make a request API for list results
   *
   * @param criteria
   * @param order
   * @param orderType
   * @param page
   * @param rows
   */
  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    // {

    //     "status": "string",
    //     "type": "string"
    // }

    const params = {
      // dynamic filters
      // // fixed filters
      // "type": criteria.type != '' ? criteria.type : null,
      // "status": criteria.status != '' ? criteria.status : null,
      page: page,
      rows: rows,
      // / "search": true,
    }

    return this.http.post(
      this.servicesUrl + '/userManagement/pendingActions/list',
      params,
    )
  }

  /**
   * Returns the value of list from body response of API call
   *
   * @param _body
   */
  protected getOutputFromRequestedData(_body) {
    return _body.pendingUserBatchList
  }

  /**
   * Returns value for consider unique validations on select items in list results
   *
   * @param row
   */
  public getId(row) {
    return row['batchPk']
  }

  /**
   * Get row data details for show information about a pending action
   *
   * @param values
   */
  protected createDetailsRequest(values: any): Observable<any> {
    const data = {}
    return this.http
      .get(
        this.servicesUrl +
        '/userManagement/pendingActions/details/' +
        values.batchPk,
        data,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            let resp: UserDetails
            resp = response
            resp.realGroup = {
              groupListOthers: [],
              groupListPayments: [],
              groupListTransfers: [],
              groupListBills: [],
              groupListCheckBook: [],
              groupListAramcoPayments: [],
              groupListBusinessCards: [],
              groupListPrePaidCards: [],
              // this.combosData['tokens'].push(this.data.unassignedHardSerialList)
              // this.combosData['tokens'].push(this.data.unassignedSoftSerialList)
              // this._checkForVaPermissions()

              // this.createGroupsFormIfNotExists(this.form, this.data)
              // this.setFormData(this.data, this.form)
              // this.disabledControl(this.form)
            }
            return resp
          }
        }),
        catchError(this.handleError),
      )

    // this.service.pendingDetailsUser(this.user.batchPk).subscribe(response => {
    //   if (
    //       response.hasOwnProperty('error') &&
    //       (<any>response).error instanceof Exception
    //   ) {
    //     const res = <any>response
    //
    //     this.messageError['code'] = res.error.errorCode
    //     this.messageError['description'] = res.error.errorDescription
    //   } else {
    //     this.messageError = {}
    //     this.data = response['user']
    //
    //   }
    // })
  }

  /**
   *
   * @param values
   */
  protected createValidateRequest(values: any): Observable<any> {
    const params = {
      userBatchList: values.items,
    }
    return this.http.post(
      this.servicesUrl + '/userManagement/pendingActions/validate',
      params,
    )
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    return this.createValidateRequest(values)
  }

  /**
   * Aprove pending actions
   *
   * @param values
   */
  protected createConfirmRequest(values: any): Observable<any> {
    const params = {
      requestValidate: values.requestValidate,
      userBatchList: values.validationData.userBatchList,
    }
    //console.log("Confirm request data", params);
    return this.http.post(
      this.servicesUrl + '/userManagement/pendingActions/confirm',
      params,
    )
  }

  /**
   *
   */
  public getTableFixedFieldsNames() {
    return []
  }

  /**
   * Refuse pending Actions
   * @param values
   */
  protected createRefuseRequest(values: any): Observable<any> {
    const params = {
      rejectReason: values.rejectedReason,
      userBatchList: values.items,
    }
    return this.http.post(
      this.servicesUrl + '/userManagement/pendingActions/refuse',
      params,
    )
  }

  translate(key): string {
    return this.translateService.instant(key)
  }

  public showRejectReason() {
    return true
  }

  public showStepWizard(): boolean {
    return this.isApproveAllowed() && this.isRefuseAllowed()
  }

  public isDisabled(): boolean {
    return this.actionsDisabled
  }

  public getExportHeader() {
    return this.translate(this.getTranslatePrefix() + '.title')
  }

  public showExportButtons() {
    return true
  }

  public getCombosKeys(): any[] {
    return ['batchTypes']
  }
  protected getExportableOutputFromRequestedData(_body): any {
    const output = this.getOutputFromRequestedData(_body)

    if (output.items) {
      const fixedFieldNames = this.getTableFixedFieldsNames()
      output.items.forEach((row) => {
        this.reCalculateFixedFieldValue(row)
      })
    }
    output['items'].sort((a, b) => {
      return a['initiationDate'] > b['initiationDate'] ? -1 : b['initiationDate'] > a['initiationDate'] ? 1 : 0
    })
    return output
  }
}
