import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Router } from '@angular/router'

@Injectable()
export class LetterGuaranteeListService extends AbstractListService {
  combosData: any = {}

  constructor(
    protected dateService: DatePipe,
    protected router: Router,
    protected translate: TranslateService,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) protected locale: string,
  ) {
    super(http, config)
  }

  //----------------------------------------------------------------------

  setCombosData(combosData: any) {
    this.combosData = combosData
  }

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

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'name',
        propName: 'name',
        propValue: (row, service, combosData) => {
          return this.translate.instant('letter_guarantee.' + row.name)
        },
        translate: 'letter_guarantee.templateName',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        width: '*',
      },
    ]

    return _fieldsConfigForList
  }

  //----------------------------------------------------------------------

  public isEmpty(value): boolean {
    return value === null || value === undefined || value === ''
  }

  public isSelectItemsAllowed(): boolean {
    return true
  }

  public getExportColumns() {
    const exportColumns = []
    this.getFieldsConfigForList().forEach((_fieldConfig) => {
      if (
        _fieldConfig.hasOwnProperty('export') &&
        _fieldConfig.export === true
      ) {
        exportColumns.push(
          Object.assign({}, _fieldConfig, {
            title: this.translate.instant(_fieldConfig.translate),
            dataKey: _fieldConfig.exportKey
              ? _fieldConfig.exportKey
              : _fieldConfig.key,
            width: _fieldConfig.export_column_width
              ? _fieldConfig.export_column_width
              : _fieldConfig.width
              ? _fieldConfig.width
              : '*',
          }),
        )
      }
    })
    return exportColumns
  }

  //----------------------------------------------------------------------

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    return of({
      errorCode: '0',
      fileList: {
        size: 2,
        total: 2,
        items: [
          {
            name: 'New_LG',
            url: 'LG.pdf',
          },
          {
            name: 'Amendment_LG',
            url: 'LGAmendment.pdf',
          },
        ],
      },
    })
  }

  protected getOutputFromRequestedData(_body) {
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (_body.fileList.items && _body.fileList.items.length >= 0) {
      _body.fileList.items.forEach((item, index, self) => {
        _fieldsConfigForList.forEach((_fieldConfig) => {
          if (
            _fieldConfig.hasOwnProperty('export') &&
            _fieldConfig.export === true &&
            _fieldConfig.exportKey
          ) {
            const exportDataKey = _fieldConfig.exportKey
            item[exportDataKey] = _fieldConfig.propValue(
              item,
              this,
              this.combosData,
            )
          }
        })
      })
    }

    return {
      data: {
        items: _body.fileList.items,
        size: _body.fileList.size,
        total: _body.fileList.total,
      },
      size: _body.fileList.size,
      total: _body.fileList.total,
    }
  }

  public getExportHeader() {
    return this.translate.instant('letter_guarantee.download-templates')
  }

  public showExportButtons() {
    return false
  }

  getDownloadedFile(values): Observable<any> {
    const output = {
      file: new Blob(),
      fileName: values.file.url,
    }
    const data = {
      name: values.file.url,
    }

    return this.http
      .post(this.servicesUrl + '/template/download', data, {
        responseType: 'blob',
      })
      .pipe(
        map((res) => {
          output.file = res
          output.fileName = data.name
          return output
        }),
      )
  }

  public branches(): Observable<any> {
    return this.http.get(this.servicesUrl + '/letterGuarantee/branches')
  }
}
