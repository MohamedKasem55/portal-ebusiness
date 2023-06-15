import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { DividendDistributionInquiryListService } from './dividend-distribution-inquiry-list.service'

@Component({
  templateUrl: './dividend-distribution-inquiry-list.component.html',
  styleUrls: ['./dividend-distribution-inquiry-list.component.scss'],
})
export class DividendDistributionInquiryListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  fieldsConfigForSearchForm: any[] = []

  combosData: any = {}

  translate_prefix = ''

  constructor(
    public fb: FormBuilder,
    public service: DividendDistributionInquiryListService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'civilianId'

    this.orderType = 'asc'

    this.searchForm = this.fb.group({})

    this.fieldsConfigForSearchForm = this.service.getFieldsConfigForSearchForm()

    this.combosData = {
      _optionList: [],
      yearsList: [],
      quartersList: [],
    }

    this.translate_prefix = this.service.getTranslatePrefix()
  }

  ngOnInit() {
    super.ngOnInit()

    this.subscriptions.push(
      this.service.getListPeriods().subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          const combosData = this.service.getCombosData()

          const yearsList = []

          for (let i = 0; i < result.length; i++) {
            yearsList.push({
              key: result[i].year,
              value: result[i].year,
            })

            const quartersList = []
            for (let j = 0; j < result[i].quarters.length; j++) {
              quartersList.push({
                key: '' + result[i].quarters[j],
                value: '' + result[i].quarters[j],
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
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  public getStatusText(value: any, dataKey: string, row: any, injector: Injector, locale: any): any {
        if (value){
            return injector.get(TranslateService).instant('dividendDistribution.inquiry.paidValue');
        }else{
           return injector.get(TranslateService).instant('dividendDistribution.inquiry.paidValue');
        }
}

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['accountNumber24'] + row['civilianId'] + row['shareHolderNumber']
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
}
