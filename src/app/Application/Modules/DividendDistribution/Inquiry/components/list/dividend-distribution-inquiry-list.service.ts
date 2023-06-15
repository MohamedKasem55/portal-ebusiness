import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class DividendDistributionInquiryListService extends AbstractListService {
  private _fieldsConfigForSearchForm: any[] = []

  private _combosData: any = {}

  private _translate_prefix = 'dividendDistribution.inquiry'

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const data = {
      page,
      rows,
      civilianId: criteria.civilianId != '' ? criteria.civilianId : null,
      shareHolder: criteria.shareHolder != '' ? criteria.shareHolder : null,
      year: criteria.year,
      quarter: criteria.quarter,
      recordType: criteria.recordType != '' ? criteria.recordType : null,
    }

    return this.http.post(this.servicesUrl + '/dividend/inquiry', data)
  }

  protected getOutputFromRequestedData(_body) {
    // _body.availableBalance

    return {
      items: _body.dividendList ? _body.dividendList.items : [], // _body.cardsList,
      total: _body.dividendList ? _body.dividendList.length : 0,
      size: _body.dividendList ? _body.dividendList.length : 0,
    }
  }

  //----------------------------------------------------------------------------------

  public getListPeriods(values: any = {}): Observable<any> {
    return this.createListPeriodsRequest(values).pipe(
      map((response: any) => {
        const _body = response

        if (response.errorCode !== '0') {
          return null
        } else {
          const output = this.getOutputFromListPeriodsRequestedData(_body)
          return output
        }
      }),
      catchError(this.handleError),
    )
  }

  protected createListPeriodsRequest(values: any = {}): Observable<any> {
    const data: any = {}

    return this.http.get(this.servicesUrl + '/dividend/periods', {
      params: data,
    })
  }

  protected getOutputFromListPeriodsRequestedData(_body) {
    return _body.listPeriods
  }

  //----------------------------------------------------------------------------------

  public getFieldsConfigForSearchForm(): any[] {
    this._fieldsConfigForSearchForm = [
      {
        key: '_option',
        title: '_option',
        translate: '_option',
        type: 'radioGroup',
        required: true,
        default: 'civilianId',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-6 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: true,
        widget_options_in_separated_lines: false,
        select_combo_key: '_optionList',
        translate_rendered_text: true,
        mask_fields_to_show: {
          '': [],
          civilianId: ['civilianId'],
          shareHolder: ['shareHolder'],
        },
      },
      {
        key: 'civilianId',
        title: 'civilianId',
        translate: 'civilianId',
        type: 'text',
        required: true,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'shareHolder',
        title: 'shareHolder',
        translate: 'shareHolder',
        type: 'text',
        required: true,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'year',
        title: 'year',
        translate: 'year',
        type: 'select',
        required: true,
        default: '',
        validators: [],
        select_combo_key: 'yearsList',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'quarter',
        title: 'quarter',
        translate: 'quarter',
        type: 'select',
        required: true,
        default: '',
        validators: [],
        select_combo_key: 'quartersList',
        select_dependent: true,
        select_parent: 'year',
        select_combo_key_by_parent_value: 'quartersList[%value0%]',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'recordType',
        title: 'recordType',
        translate: 'recordType',
        type: 'select',
        required: true,
        default: 'A',
        validators: [],
        select_combo_key: 'recordTypeDD', // loaded from static service
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
    ]
    return this._fieldsConfigForSearchForm
  }

  public getCombosData(): any {
    this._combosData['yearsList'] = []
    this._combosData['quartersList'] = []

    this._combosData['_optionList'] = [
      {
        key: 'civilianId',
        value: this.getTranslatePrefix() + '.civilianId',
      },
      {
        key: 'shareHolder',
        value: this.getTranslatePrefix() + '.shareHolder',
      },
    ]
    return this._combosData
  }

  public getTranslatePrefix() {
    return this._translate_prefix
  }
}
