import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { AbstractListDynamicService } from '../../../Common/Services/Abstract/abstract-list-dynamic.service'
import { DomSanitizer } from '@angular/platform-browser'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class LockboxTerminalsListService extends AbstractListDynamicService {
  combosData: any = {}

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
    public sanitizer: DomSanitizer,
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
      key: 'radiobutton',
      title: 'radiobutton',
      translate: 'radiobutton',
      type: 'radioGroup',
      required: true,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'options',
      translate_rendered_text: true,
      widget_options_in_separated_lines: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'userPk',
      title: 'userPk',
      translate: 'user',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'users',
    })

    _fieldsConfigForSearchForm.push({
      key: 'accountPk',
      title: 'accountPk',
      translate: 'account',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'accounts',
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'terminalID',
        propName: 'terminalID',
        propValue: (row, service, combosData) => row.terminalID,
        translate: 'lockbox.cdmTerminals.terminalID',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'terminalIdExport',
        column_width: 100,
        export_column_width: 80,
      },
      {
        key: 'serialNumber',
        propName: 'serialNumber',
        propValue: (row, service, combosData) => row.serialNumber,
        translate: 'lockbox.cdmTerminals.serialNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'serialNumberExport',
        append_next_column: false,
        export_column_width: '*',
      },
      {
        key: 'terminalName',
        propName: 'terminalName',
        propValue: (row, service, combosData) => row.terminalName,
        translate: 'lockbox.cdmTerminals.terminalName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'terminalNameExport',
        export_column_width: '*',
      },
      {
        key: 'defaultAccount',
        propName: 'defaultAccount',
        propValue: (row, service, combosData) => row.defaultAccount,
        translate: 'lockbox.cdmTerminals.defaultAccount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'defaultAccountExport',
        column_width: 200,
        append_next_column: false,
        export_column_width: 150,
      },
      {
        key: 'siteId',
        propName: 'siteId',
        propValue: (row, service, combosData) => row.siteCode,
        translate: 'lockbox.cdmTerminals.siteId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'siteIdExport',
        column_width: 100,
        export_column_width: 50,
      },
      {
        key: 'location1',
        propName: 'location1',
        propValue: (row, service, combosData) => row.location1,
        translate: 'lockbox.cdmTerminals.location1',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'location1Export',
        column_width: 150,
        export_column_width: 50,
      },
      {
        key: 'region',
        propName: 'region',
        propValue: (row, service, combosData) =>
          new DOMParser().parseFromString(row.region, 'text/html')
            .documentElement.textContent,
        translate: 'lockbox.cdmTerminals.region',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'regionExport',
        append_next_column: false,
        export_column_width: '*',
      },
      {
        key: 'city',
        propName: 'city',
        propValue: (row, service, combosData) =>
          new DOMParser().parseFromString(row.city, 'text/html').documentElement
            .textContent,
        translate: 'lockbox.cdmTerminals.city',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'cityExport',
        export_column_width: '*',
      },
      {
        key: 'vendor',
        propName: 'vendor',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxMachineVendor']
            ? combosData['lockBoxMachineVendor']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.vendor)
          if (elem != null) {
            return elem.value
          }
          return row.vendor
        },
        translate: 'lockbox.cdmTerminals.vendor',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'vendorExport',
        append_next_column: false,
        export_column_width: '*',
        column_width: 80,
        modelKey: 'lockBoxMachineVendor',
      },
      {
        key: 'status',
        propName: 'status',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxTerminalStatus']
            ? combosData['lockBoxTerminalStatus']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.status)
          if (elem != null) {
            return elem.value
          }
          return row.status
        },
        translate: 'lockbox.cdmTerminals.status',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'statusExport',
        column_width: 120,
        export_column_width: 80,
        modelKey: 'lockBoxTerminalStatus',
      },
    ]

    return _fieldsConfigForList
  }

  //----------------------------------------------------------------------

  public isSelectItemsAllowed(): boolean {
    return true
  }

  //----------------------------------------------------------------------

  public getInitValues(values: any): Observable<any> {
    return this.http.get(
      this.servicesUrl + '/lockbox/terminalManagement/list/init',
    )
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      search: criteria.search ? true : false,
      radiobutton: criteria.radiobutton,
      userPk: criteria.radiobutton == 1 ? criteria.userPk.lbUserPK : null,
      accountPk:
        criteria.radiobutton == 2 ? criteria.accountPk.accountPk : null,
    }

    return this.http.post(
      this.servicesUrl + '/lockbox/terminalManagement/list/search',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return {
      data: {
        items: _body.terminalList,
        size: _body.terminalList.length,
        total: _body.terminalList.length,
      },
      size: _body.terminalList.length,
      total: _body.terminalList.length,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockbox.cdmTerminals.menu')
  }

  public showExportButtons() {
    return true
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }
}
