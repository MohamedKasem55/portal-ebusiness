// Imports
import { HttpClient } from '@angular/common/http'
import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { SessionStorageService } from 'ngx-webstorage'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../Common/Services/static.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  templateUrl: '../View/my-profile-operation-detail.component.html',
  styleUrls: ['../View/my-profile-operation-detail.component.scss'],
})

// Component class implementing OnInit
export class MyProfileOperationDetail
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  subscriptions: Subscription[] = []

  _firstChange = true

  public operationId
  public servicesUrl

  formModel: FormGroup
  formConfig: any[]
  detailsData: any

  constructor(
    private _sessionStorage: SessionStorageService,
    public _config: ConfigResourceService,
    private _http: HttpClient,
    public staticService: StaticService,
    public translate: TranslateService,
    public fb: FormBuilder,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
    public router: Router,
  ) {
    super()
    this.servicesUrl = _config.getServicesUrl()
    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
    this.refreshData()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  refreshData() {
    this.operationId = +sessionStorage.getItem('auditLinePk')

    if (!this.operationId) {
      this.back()
      return false
    }
    new DateFormatPipe(this.injector, this.locale).transform(
      new Date(),
      'dd/MM/yyyy',
    )
    new ModelPipe(this.injector).transform('userType', null)

    const body = {
      auditPk: this.operationId,
      order: 'string',
      orderType: 'string',
      page: 1,
      rows: 1,
    }

    this._http
      .post(this.servicesUrl + '/audit/detail', body)
      .subscribe((result) => {
        //console.log('details response: ', res);
        this.detailsData = result
        this.formConfig = this.getFormConfig(this.detailsData.auditReport)
      })
  }

  disableFormModel() {
    this.formModel.disable()
  }

  back() {
    this.router.navigate(['/myprofile/activityLogs'])
  }

  getFormConfig(detailData) {
    const config = []

    config.push({
      key: 'userName',
      title: 'User Name',
      translate: 'userName',
      type: 'text',
      required: false,
      default: detailData.userName,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'userId',
      title: 'userId',
      translate: 'userId',
      type: 'text',
      required: false,
      default: detailData.userId,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'companyId',
      title: 'Company',
      translate: 'organizationId',
      type: 'text',
      required: false,
      default: detailData.companyId,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'userType',
      title: 'UserType',
      translate: 'userType',
      type: 'text',
      required: false,
      default: new ModelPipe(this.injector).transform(
        'userType',
        detailData.userType,
      ),
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'operationLog',
      title: 'Operation Log',
      translate: 'operation',
      type: 'text',
      required: false,
      default: new ModelPipe(this.injector).transform(
        'activityOperationLog',
        detailData.operation,
      ),
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'date',
      title: 'Date',
      translate: 'date',
      type: 'date',
      required: false,
      default: detailData.timeStamp
        ? new DateFormatPipe(this.injector, this.locale).transform(
            detailData.timeStamp,
            'dd/MM/yyyy',
          )
        : null,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'time',
      title: 'Time',
      translate: 'time',
      type: 'text',
      required: false,
      default: detailData.timeStamp
        ? detailData.timeStamp.substring(11, 19)
        : null,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'status',
      title: 'Status',
      translate: 'status',
      type: 'text',
      required: false,
      default: this.getTranslatedStatus(
        detailData.status,
        null,
        null,
        null,
        null,
      ),
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return config
  }

  getPipeType(value) {
    if (value.indexOf('/') !== -1) {
      return value.substring(value.indexOf('/') + 1, value.lastIndexOf('$'))
    } else {
      return value.substring(value.indexOf('.') + 1, value.lastIndexOf('$'))
    }
  }

  checkCoding(value) {
    if (value[0] === '$' || value.indexOf('auditReports') === 0) {
      return true
    } else {
      return false
    }
  }

  getValue(value) {
    return value.substring(value.lastIndexOf('$') + 1)
  }

  getCodeValue(value) {
    if (value && value.indexOf('auditReports.') == 0) {
      return value.substring('auditReports.'+value.indexOf('.') + 1)
    }
    return value
  }

  getTranslatedStatus(actualValue, actualDataKey, row, injector, _locale) {
    switch (actualValue) {
      case 'A':
        return this.translate.instant('public.approve')
        break
      case 'R':
        return this.translate.instant('public.reject')
        break
      case 'I':
        return this.translate.instant('public.initialize')
        break
    }
    return actualValue
  }
}
