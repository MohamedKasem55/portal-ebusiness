import { AbstractListService } from './abstract-list.service'
import { TranslateService } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

export abstract class AbstractListDynamicService extends AbstractListService {
  combosData: any = {}

  constructor(
    protected translate: TranslateService,
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  //----------------------------------------------------------------------

  public setCombosData(combosData: any) {
    this.combosData = combosData
  }

  /**
   * Returns search form fields definitions
   */
  public abstract getFieldsConfigForSearchForm(): any[]

  /**
   * Returns list fields definitions for results
   */
  public abstract getFieldsConfigForList(): any[]

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
            modelKey: _fieldConfig.modelKey,
            width: _fieldConfig.export_column_width
              ? _fieldConfig.export_column_width
              : _fieldConfig.width
              ? _fieldConfig.width
              : 'auto',
          }),
        )
      }
    })
    return exportColumns
  }

  //----------------------------------------------------------------------

  protected postProcessOutputFromRequestedData(output) {
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (output.data.items && output.data.items.length >= 0) {
      _fieldsConfigForList.forEach((_fieldConfig) => {
        if (
          _fieldConfig.hasOwnProperty('export') &&
          _fieldConfig.export === true &&
          _fieldConfig.exportKey
        ) {
          output.data.items.forEach((item) => {
            const exportDataKey = _fieldConfig.exportKey
            item[exportDataKey] = _fieldConfig.propValue(
              item,
              this,
              this.combosData,
            )
          })
        }
      })
    }

    return output
  }

  public abstract getExportHeader(): any

  public abstract showExportButtons(): any

  public getUnescapedStr(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return txt.value
  }
}
