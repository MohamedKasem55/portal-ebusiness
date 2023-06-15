import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { catchError, map } from 'rxjs/operators'
import { PagedData } from '../../../../../Model/paged-data'
import { Page } from '../../../../../Model/page'

@Injectable()
export class DividendDistributionReportsListService extends AbstractListService {
  private _fieldsConfigForSearchForm: any[] = []

  private _combosData: any = {}

  private _translate_prefix = 'dividendDistribution.reports'

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
      parameter: criteria.fileName != null ? criteria.fileName : '',
    }

    return this.http
      .post(this.servicesUrl + '/dividend/listreports', data)
      .pipe(
        map((response: any) => {
          const _body = response
          if (response.errorCode !== '0') {
            return null
          } else {
            if (response.listStatement) {
              _body.listStatement = response.listStatement.filter(
                (item, i) =>
                  item.fileName
                    .toLowerCase()
                    .indexOf(data.parameter.toLowerCase()) != -1,
              )
            }
            return _body
          }
        }),
        catchError(this.handleError),
      )
  }

  protected getOutputFromRequestedData(_body) {
    return {
      items: _body.listStatement ? _body.listStatement : [], // _body.cardsList,
      total: _body.listStatement ? _body.listStatement.length : 0,
      size: _body.listStatement ? _body.listStatement.length : 0,
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

  public getDownloadFile(values: any = {}): Observable<any> {
    return this.createDownloadFileRequest(values).pipe(
      map((response: any) => {
        const _body = response
        const output = this.getOutputFromDownloadFileRequestedData(
          _body,
          values,
        )
        return output
      }),
      catchError(this.handleError),
    )
  }

  protected createDownloadFileRequest(values: any = {}): Observable<any> {
    const data = {
      parameter: values.parameter != '' ? values.parameter : null,
    }

    return this.http.post(this.servicesUrl + '/dividend/report', data, {
      responseType: 'blob',
    })
  }

  protected getOutputFromDownloadFileRequestedData(_body, values) {
    return this.downloadFile(_body, values.parameter)
  }

  protected downloadFile(blob, name: string): boolean {
    if (blob !== null) {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
    return true
  }

  //----------------------------------------------------------------------------------

  public getFieldsConfigForSearchForm(): any[] {
    this._fieldsConfigForSearchForm = [
      {
        key: 'fileName',
        title: 'fileName',
        translate: 'fileName',
        type: 'text',
        required: false,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      /*{
                key: "year",
                title: "year",
                translate: "year",
                type: "select",
                required: true,
                default: "",
                validators: [],
                select_combo_key: "yearsList",
                widget: "",
                widget_container_class: "col-xs-12 col-sm-3",
                widget_container_init_row: false,
                widget_container_end_row: false,
            },
            {
                key: "quarter",
                title: "quarter",
                translate: "quarter",
                type: "select",
                required: true,
                default: "",
                validators: [],
                select_combo_key: "quartersList",
                select_dependent: true,
                select_parent: "year",
                select_combo_key_by_parent_value: "quartersList[%value0%]",
                widget: "",
                widget_container_class: "col-xs-12 col-sm-3",
                widget_container_init_row: false,
                widget_container_end_row: false,
            },
            {
                key: "type",
                title: "type",
                translate: "type",
                type: "select",
                required: true,
                default: "A",
                validators: [],
                select_combo_key: "recordTypeDD", // loaded from static service
                widget: "",
                widget_container_class: "col-xs-12 col-sm-3",
                widget_container_init_row: false,
                widget_container_end_row: false,
            },*/
    ]
    return this._fieldsConfigForSearchForm
  }

  public getCombosData(): any {
    this._combosData['yearsList'] = []
    this._combosData['quartersList'] = []
    this._combosData['dividendDistribution'] = []
    return this._combosData
  }

  public getTranslatePrefix() {
    return this._translate_prefix
  }
}
