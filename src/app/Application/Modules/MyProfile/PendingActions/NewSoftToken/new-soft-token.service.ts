import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Observable } from 'rxjs'
import { NavigationEnd, Router } from '@angular/router'
import { CurrencyPipe, DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'
import { PendingActionsUtilityService } from 'app/Application/Modules/Common/Components/PendingActions/pending-actions-utility.service'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { map } from 'rxjs/internal/operators/map'
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe'

@Injectable()
export class NewSoftTokenService extends PendingActionsUtilityService {

  actionsDisabled = false
  private previousUrl: string
  private currentUrl: string
  private _fieldsConfigForSearchForm: any[] = []

  private _fieldsConfigForList: any[] = [
    {
      key: 'tokenNumber',
      propName: 'tokenNumber',
      propValue: (row, service, combosData) => row.tokenNumber,
      translate: 'numSoftToken',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
      export_column_width: 30,
    },
    {
      key: 'accountNumber',
      propName: 'account',
      propValue: (row, service, combosData) => row.accountNumber,
      translate: 'account',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
      export_column_width: 110,
    },
    {
      key: 'totalAmount',
      propName: 'totalAmount',
      propValue: (row, service, combosData) => {
        return this.currencyPipe.transform(row.totalAmount, ' SAR ')
      },
      translate: 'tokenAmount',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      errors: '',
      export: true,
      export_column_width: 70,
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
      export_column_width: 100,
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
      transformFn: (actualValue, actualDataKey, row, injector, _locale) => row.securityLevelsDTOList[0]?.updater,
      export: true,
      exportKey: 'initiatedByExport',
      translate: 'initiatedBy',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      widget_container_class: 'col-xs-12 col-sm-2',
      export_column_width: 80,
      column_width: 130,
      errors: '',
    },
    {
      key: 'status',
      propName: 'status',
      propValue: (row, service, combosData) => {
        return new StatusPipe(this.injector).transform(row.status)
      },
      translate: 'status',
      link_to_detail: false,
      parent_div_class: 'col-xs-6',
      export: true,
      export_column_width: 'auto',
      append_next_column: false
    },
  ]

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    protected translateService: TranslateService,
    public currencyPipe: CurrencyPipe,
    private router: Router,
    public datePipe: DatePipe,
    protected injector: Injector,
    @Inject(LOCALE_ID) protected locale: string,
  ) {
    super(http, config, injector, locale)
    this.actionsDisabled = false

    this.currentUrl = this.router.url
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl
        this.currentUrl = event.url
      }
    })
  }

  public getPreviousUrl() {
    return this.previousUrl
  }

  /**
   * Returns translation prefix for i18n texts
   */
  public getTranslatePrefix(): string {
    return 'companyAdmin.token'
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
      'PendingActionUsersAdd',//CAMBIAR //PendingActionOrderSoftToken
      [],
      ['CompanyAdmins'],
    )
  }

  isRefuseAllowed(): boolean {
    return this.authenticationService.activateOption(
      'PendingActionUsersAdd',//CAMBIAR //PendingActionOrderSoftToken
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
      this.servicesUrl + '/managementToken/pendingActions/list',
      params).pipe(map((response) => {
        if (response['errorCode'] == '0') {
        }
        return response
      }),
      )
  }

  /**
   * Returns the value of list from body response of API call
   *
   * @param _body
   */
  protected getOutputFromRequestedData(_body) {
    return _body.pendingSoftTokenBatchList;
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
   *
   * @param values
   */
  protected createValidateRequest(values: any): Observable<any> {
    //CAMBIAR
    const params = {
      tokenManagementBatchList: values.items,
    }
    return this.http.post(
      this.servicesUrl + '/managementToken/pendingActions/validate',
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
      batchList: {
        toProcess: values['items']
      },
      requestValidate: values.requestValidate,
    }
    return this.http.post(
      this.servicesUrl + '/managementToken/pendingActions/confirm',
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
    //CAMBIAR
    values.items.forEach(item => {
      item.rejectedReason = values.rejectedReason
    })
    const params = {
      rejectReason: values.rejectedReason,
      tokenManagementBatchList: values.items,
    }
    return this.http.post(
      this.servicesUrl + '/managementToken/pendingActions/refuse',
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
    return this.translate(this.getTranslatePrefix() + '.requestSoftToken')
  }

  public showExportButtons() {
    return true
  }

  public getCombosKeys(): any[] {
    return ['countryName', 'processStatus', 'process', 'bankCode']
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