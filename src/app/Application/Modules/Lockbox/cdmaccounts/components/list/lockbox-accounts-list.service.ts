import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'
import { AbstractListDynamicService } from '../../../../Common/Services/Abstract/abstract-list-dynamic.service'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable()
export class LockboxAccountsListService extends AbstractListDynamicService {
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
      translate: 'userPk',
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
      key: 'terminalPk',
      title: 'terminalPk',
      translate: 'terminalPk',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'terminals',
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'fullAccountNumber',
        propName: 'fullAccountNumber',
        propValue: (row, service, combosData) => row.fullAccountNumber,
        translate: 'lockbox.cdmAccounts.fullAccountNumber',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 200,
      },
      {
        key: 'alias',
        propName: 'alias',
        propValue: (row, service, combosData) => row.ccdmAlias,
        translate: 'lockbox.cdmAccounts.alias',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        export_column_width: 200,
        append_next_column: false,
      },
      {
        key: 'logo',
        propName: 'logo',
        propValue: (row, service, combosData) =>
          row.logo.content
            ? this.getTrustedHtml(
                '<img style="width: 45px; height: 45px" src="data:' +
                  row.logo.type +
                  ';base64,' +
                  row.logo.content +
                  '">',
              )
            : '',
        translate: 'lockbox.cdmAccounts.logo',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: false,
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

    return this.http.get(
      this.servicesUrl + '/lockbox/accountManagement/list/init',
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
      terminalPk:
        criteria.radiobutton == 2 ? criteria.terminalPk.terminalID : null,
    }

    return this.http.post(
      this.servicesUrl + '/lockbox/accountManagement/list/search',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return {
      data: {
        items: _body.accountList,
        size: _body.accountList.length,
        total: _body.accountList.length,
      },
      size: _body.accountList.length,
      total: _body.accountList.length,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockBox.cdmAccounts.list')
  }

  public showExportButtons() {
    return true
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }
}
