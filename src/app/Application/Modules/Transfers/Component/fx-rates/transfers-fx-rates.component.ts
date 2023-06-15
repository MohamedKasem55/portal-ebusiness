import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import { TransfersFxRatesService } from './transfers-fx-rates.service'

@Component({
  selector: 'app-transfers-fx-rates',
  templateUrl: './transfers-fx-rates.component.html',
  styleUrls: ['./transfers-fx-rates.component.scss'],
})
export class TransfersFxRatesComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  combosData: any = {}

  constructor(
    public fb: FormBuilder,
    public service: TransfersFxRatesService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = ''
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      fromCurrencyCode: ['', [Validators.required]],
      toCurrencyCode: ['', [Validators.required]],
      baseAmount: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    super.ngOnInit()

    const combosKeys = ['currency', 'currencyIso']

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosKeys, true)
        .subscribe((resultC) => {
          if (resultC === null) {
            this.onError(resultC)
          } else {
            const data: any = resultC
            for (let i = 0; i < combosKeys.length; i++) {
              this.combosData[combosKeys[i]] = data[combosKeys[i]]
            }
            this.search()
          }
        }),
    )
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    const searchCriteria = {
      fromCurrencyCode: searchElement.fromCurrencyCode,
      toCurrencyCode: searchElement.toCurrencyCode,
      baseAmount: searchElement.baseAmount,
    }

    this.subscriptions.push(
      this.service
        .getResults(searchCriteria, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
            this.elementsPage.data.forEach((item) => {
              item['currencyCodeText'] = this.getCurrencyText(
                item['currencyCode'],
              )
              item['currencyCodeName'] = this.getCurrencyName(
                item['currencyCode'],
              )
            })
          }
        }),
    )
  }

  getCurrencyText(code) {
    const find = this.combosData['currencyIso'].find((c) => c['key'] == code)
    return find ? find['value'] : code
  }

  getCurrencyName(code) {
    const find = this.combosData['currency'].find((c) => c['key'] == code)
    return find ? find['value'] : code
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['currencyCode']
  }

  reset() {
    this.searchForm.controls.fromCurrencyCode.reset()
    this.searchForm.controls.toCurrencyCode.reset()
    this.searchForm.controls.baseAmount.reset()
    this.search()
  }

  refreshData() {}

  // if external paging is false -----------------------------

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.getList(
      this.searchFormData,
      this.order,
      this.orderType,
      1,
      this.elementsPage.page.pageSize,
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.elementsPage.page.pageNumber = dataTableEvent.offset
    this.searchFormData = Object.assign({}, this.searchForm.value)
    //this.getList(this.searchFormData, this.order, this.orderType, dataTableEvent.offset + 1, this.elementsPage.page.pageSize);
  }

  setPageSize(event: any) {
    this.elementsPage.page.pageSize = +event.target.value
    this.table.offset = 0
    this.table.recalculate()
  }

  // ----------------------------------------------------------
}
