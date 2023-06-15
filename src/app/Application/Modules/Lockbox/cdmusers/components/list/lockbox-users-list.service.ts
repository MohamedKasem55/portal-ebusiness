import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'
import { AbstractListDynamicService } from '../../../../Common/Services/Abstract/abstract-list-dynamic.service'

@Injectable()
export class LockboxUsersListService extends AbstractListDynamicService {
  combosData: any = {}

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    super(translate, http, config)
  }

  //----------------------------------------------------------------------

  /**
   * Returns search form fields definitions
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
      key: 'search',
      title: 'search',
      translate: 'search',
      type: 'hidden',
      required: false,
      default: true,
      validators: [],
      widget: '',
      widget_container_class: 'hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'userName',
      title: 'userName',
      translate: 'userName',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'userId',
      title: 'userId',
      translate: 'userId',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'userStatus',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: true,
      select_combo_key: 'lockBoxUserStatus',
    })

    _fieldsConfigForSearchForm.push({
      key: 'civilianId',
      title: 'civilianId',
      translate: 'civilianId',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'civilianIdList',
    })

    _fieldsConfigForSearchForm.push({
      key: 'civilianIdExpiryDateFrom',
      title: 'civilianIdExpiryDateFrom',
      translate: 'civilianIdExpiryDateFrom',
      type: 'date',
      required: false,
      default: '',
      validators: [],
      widget: 'datepicker-gr',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'civilianIdExpiryDateTo',
      title: 'civilianIdExpiryDateTo',
      translate: 'civilianIdExpiryDateTo',
      type: 'date',
      required: false,
      default: '',
      validators: [],
      widget: 'datepicker-gr',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })

    _fieldsConfigForSearchForm.push({
      key: 'terminalId',
      title: 'terminalId',
      translate: 'terminalId',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'listLbTerminalList',
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'userId',
        propName: 'userId',
        propValue: (row, service, combosData) => row.userId,
        translate: 'lockbox.cdmUsers.userId',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 250,
        export_column_width: 80,
        append_next_column: true,
      },
      {
        key: 'userName',
        propName: 'userName',
        propValue: (row, service, combosData) => row.userName,
        translate: 'lockbox.cdmUsers.userName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 150,
      },
      {
        key: 'role',
        propName: 'role',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxUserRole']
            ? combosData['lockBoxUserRole']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.role)
          if (elem != null) {
            return elem.value
          }
          return row.role
        },
        translate: 'lockbox.cdmUsers.role',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'roleExport',
        column_width: 150,
        append_next_column: true,
      },
      {
        key: 'employeeNumber',
        propName: 'employeeNumber',
        propValue: (row, service, combosData) => row.employeeNumber,
        translate: 'lockbox.cdmUsers.employeeNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 80,
      },
      {
        key: 'civilianId',
        propName: 'civilianId',
        propValue: (row, service, combosData) => row.civilianId,
        translate: 'lockbox.cdmUsers.civilianId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 200,
        export_column_width: 80,
        append_next_column: true,
      },
      {
        key: 'civExpirityDate',
        propName: 'civExpirityDate',
        propValue: (row, service, combosData) =>
          new DateFormatPipe(this.injector, this.locale).transform(
            row.civExpirityDate,
            'dd/MM/yyyy',
          ),
        translate: 'lockbox.cdmUsers.civExpirityDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 80,
      },
      {
        key: 'mobile',
        propName: 'mobile',
        propValue: (row, service, combosData) => row.mobile,
        translate: 'lockbox.cdmUsers.mobile',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 250,
        export_column_width: 80,
        append_next_column: true,
      },
      {
        key: 'email',
        propName: 'email',
        propValue: (row, service, combosData) => row.email,
        translate: 'lockbox.cdmUsers.email',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 150,
      },
      {
        key: 'position',
        propName: 'position',
        propValue: (row, service, combosData) => row.position,
        translate: 'lockbox.cdmUsers.position',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 150,
        export_column_width: 100,
        append_next_column: true,
      },
      {
        key: 'department',
        propName: 'department',
        propValue: (row, service, combosData) => row.department,
        translate: 'lockbox.cdmUsers.department',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 100,
      },
      {
        key: 'cityName',
        propName: 'cityName',
        propValue: (row, service, combosData) => row.cityName,
        translate: 'lockbox.cdmUsers.cityName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 150,
        export_column_width: 80,
        append_next_column: true,
      },
      {
        key: 'status',
        propName: 'status',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxUserStatus']
            ? combosData['lockBoxUserStatus']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.status)
          if (elem != null) {
            return elem.value
          }
          return row.status
        },
        translate: 'lockbox.cdmUsers.status',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'statusExport',
        export_column_width: 80,
      },
      {
        key: 'comment',
        propName: 'comment',
        propValue: (row, service, combosData) => row.comment,
        translate: 'lockbox.cdmUsers.comment',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 150,
      },
    ]

    return _fieldsConfigForList
  }

  //----------------------------------------------------------------------

  public isSelectItemsAllowed(): boolean {
    return false
  }

  //----------------------------------------------------------------------

  public getInitValues(values: any): Observable<any> {
    const params = {}

    return this.http.post(
      this.servicesUrl + '/lockbox/userManagement/list/init',
      params,
    )
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params: any = Object.assign({}, criteria, {
      search: criteria.search ? true : false,
      page,
      rows,
    })

    Object.keys(params).forEach((key) => {
      if (params[key] == '') {
        params[key] = null
      }
    })

    return this.http.post(
      this.servicesUrl + '/lockbox/userManagement/list/search',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return {
      data: {
        items: _body.lbUserList.items,
        size: _body.lbUserList.size,
        total: _body.lbUserList.total,
      },
      size: _body.lbUserList.size,
      total: _body.lbUserList.total,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockbox.cdmUsers.list')
  }

  public showExportButtons() {
    return true
  }
}
