import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { DividendDistributionReportsListService } from './dividend-distribution-reports-list.service'

@Component({
  templateUrl: './dividend-distribution-reports-list.component.html',
  styleUrls: ['./dividend-distribution-reports-list.component.scss'],
})
export class DividendDistributionReportsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  fieldsConfigForSearchForm: any[] = []

  combosData: any = {}

  translate_prefix = ''

  constructor(
    public fb: FormBuilder,
    public service: DividendDistributionReportsListService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'fileName'

    this.orderType = 'asc'

    this.searchForm = this.fb.group({})

    this.fieldsConfigForSearchForm = this.service.getFieldsConfigForSearchForm()

    this.combosData = {
      yearsList: [],
      quartersList: [],
    }

    this.translate_prefix = this.service.getTranslatePrefix()
    this.combosData = this.service.getCombosData()
  }

  ngOnInit() {
    super.ngOnInit()

    this.subscriptions.push(
      this.service.getListPeriods().subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          const combosData = this.combosData

          const yearsList = []

          for (let i = 0; i < result.length; i++) {
            yearsList.push({
              key: result[i].year,
              value: result[i].year,
            })

            const quartersList = []
            for (let j = 0; j < result[i].quarters.length; j++) {
              quartersList.push({
                key: result[i].quarters[j],
                value: result[i].quarters[j],
              })
            }
            combosData['quartersList' + result[i].year] = quartersList
          }

          combosData['yearsList'] = yearsList
          combosData['quartersList'] = []
          this.combosData = combosData
        }

        this.search()
      }),
    )

    const combosKeys = ['dividendDistribution']

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const dividendDistributionValues =
        data[combosKeys.indexOf('dividendDistribution')]['values']
      Object.keys(dividendDistributionValues).map((key, index) => {
        this.combosData['dividendDistribution'][key] =
          dividendDistributionValues[key]
      })
    })
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            for (const item of result.data) {
              const quarter = 'quarter' + item.quarter
              const fileType = 'fileType.' + item.type
              const quarterTrans = this.combosData['dividendDistribution'][
                quarter
              ]
                ? this.combosData['dividendDistribution'][quarter]
                : item.quarter
              const typeTrans = this.combosData['dividendDistribution'][
                fileType
              ]
                ? this.combosData['dividendDistribution'][fileType]
                : item.type
              item.quarterTrans = quarterTrans
              item.typeTrans = typeTrans
            }
            this.elementsPage = result
          }
        }),
    )
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['fileName']
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  refreshData() {}

  getAllTables() {
    return []
  }

  onDetailToggle(event) {}

  downloadFile(row) {
    this.subscriptions.push(
      this.service
        .getDownloadFile({
          parameter: row.fileName,
        })
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            // do nothing
          }
        }),
    )
  }
}
