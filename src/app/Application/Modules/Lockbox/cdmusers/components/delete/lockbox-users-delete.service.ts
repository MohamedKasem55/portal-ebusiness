import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AbstractActionModifyService } from '../../../../Common/Services/Abstract/abstract-action-modify.service'
import { Validators } from '@angular/forms'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'

@Injectable()
export class LockboxUsersDeleteService extends AbstractActionModifyService {
  validateResponse: any

  constructor(
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(http, config)
  }

  public configureDeleteFormModel(detailsData) {
    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'userId',
      title: 'userId',
      translate: 'userId',
      type: 'text',
      required: false,
      default: detailsData.userId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'arabicName',
      title: 'arabicName',
      translate: 'arabicName',
      type: 'text',
      required: false,
      default: detailsData.arabicName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      readonly: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'englishName',
      title: 'englishName',
      translate: 'englishName',
      type: 'text',
      required: false,
      default: detailsData.englishName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      readonly: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'role',
      title: 'role',
      translate: 'role',
      type: 'select',
      required: false,
      default: detailsData.role,
      validators: [],
      select_combo_key: 'lockBoxUserRole',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civilianId',
      title: 'civilianId',
      translate: 'civilianId',
      type: 'text',
      required: false,
      default: detailsData.civilianId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civExpirityDate',
      title: 'civExpirityDate',
      translate: 'civExpirityDate',
      type: 'date',
      required: false,
      // default: new DateFormatPipe(this.injector, this._locale).transform(detailsData.civExpirityDate, 'dd/MM/yyyy'),
      default: detailsData.civExpirityDate,
      validators: [],
      widget: 'datepicker-gr',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'dateOfBirth',
      title: 'dateOfBirth',
      translate: 'dateOfBirth',
      type: 'date',
      required: false,
      default: detailsData.dateOfBirth,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: detailsData.status,
      validators: [],
      select_combo_key: 'lockBoxUserStatus',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'regionPK',
      title: 'regionPK',
      translate: 'regionPK',
      type: 'select',
      required: false,
      default: detailsData.regionPK,
      validators: [],
      select_combo_key: 'regionList',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'cityPK',
      title: 'cityPK',
      translate: 'cityPK',
      type: 'select',
      required: false,
      default: detailsData.cityPK,
      validators: [],
      select_combo_key: 'cityList',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'mobile',
      title: 'mobile',
      translate: 'mobile',
      type: 'text',
      required: false,
      default: detailsData.mobile,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'email',
      title: 'email',
      translate: 'email',
      type: 'text',
      required: false,
      default: detailsData.email,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'employeeNumber',
      title: 'employeeNumber',
      translate: 'employeeNumber',
      type: 'text',
      required: false,
      default: detailsData.employeeNumber,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'position',
      title: 'position',
      translate: 'position',
      type: 'text',
      required: false,
      default: detailsData.position,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'department',
      title: 'department',
      translate: 'department',
      type: 'text',
      required: false,
      default: detailsData.department,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'storeId',
      title: 'storeId',
      translate: 'storeId',
      type: 'text',
      required: false,
      default: detailsData.storeId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'address',
      title: 'address',
      translate: 'address',
      type: 'text',
      required: false,
      default: detailsData.address,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'sponsorNumber',
      title: 'sponsorNumber',
      translate: 'sponsorNumber',
      type: 'text',
      required: false,
      default: detailsData.sponsorNumber,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'sponsorName',
      title: 'sponsorName',
      translate: 'sponsorName',
      type: 'text',
      required: false,
      default: detailsData.sponsorName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'nationality',
      title: 'nationality',
      translate: 'nationality',
      type: 'text',
      required: false,
      default: detailsData.nationality,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'occupation',
      title: 'occupation',
      translate: 'occupation',
      type: 'text',
      required: false,
      default: detailsData.occupation,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civIssueDate',
      title: 'civIssueDate',
      translate: 'civIssueDate',
      type: 'date',
      required: false,
      default: detailsData.civIssueDate,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civIssuePlace',
      title: 'civIssuePlace',
      translate: 'civIssuePlace',
      type: 'text',
      required: false,
      default: detailsData.civIssuePlace,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userMaxAmount',
      title: 'userMaxAmount',
      translate: 'userMaxAmount',
      type: 'text',
      required: false,
      default: detailsData.userMaxAmount,
      validators: [],
      inputPattern: 'onlyPositiveDecimalNumbers',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userFingerPrint',
      title: 'userFingerPrint',
      translate: 'userFingerPrint',
      type: 'text',
      required: false,
      default: detailsData.userFingerPrint,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    return _fieldsConfigForForm
  }

  protected createValidateRequest(values: any): Observable<any> {
    this.validateResponse = {}

    const params = {
      status: 'D',
      user: values,
    }

    return this.http
      .post(
        this.config.getServicesUrl() + '/lockbox/userManagement/changeStatus',
        params,
      )
      .pipe(
        map((response) => {
          this.validateResponse = params
          return response
        }),
      )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const params = this.validateResponse
    return this.http.post(
      this.config.getServicesUrl() +
        '/lockbox/userManagement/changeStatusConfirm',
      params,
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }
}
