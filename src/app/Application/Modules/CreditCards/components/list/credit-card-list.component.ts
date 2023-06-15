import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { CreditCardDetailsService } from '../details/credit-card-details.service'
import { CreditCardListService } from './credit-card-list.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss'],
})
export class CreditCardListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  carouselMaxColumns: number
  carouselMaxRows: number
  carouselFirstColumn: number
  carouselCurrentColumn: number
  carouselColumnWidth: any
  carouselItems: any[]

  constructor(
    public fb: FormBuilder,
    public service: CreditCardListService,
    public serviceDetails: CreditCardDetailsService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'cardNumber'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    this.carouselInit()

    this.search()

    super.ngOnInit()
  }

  carouselInit() {
    this.carouselMaxColumns = 3
    this.carouselMaxRows = 3
    this.carouselFirstColumn = 0
    this.carouselCurrentColumn = this.carouselFirstColumn
    this.carouselColumnWidth = Math.floor(100 / this.carouselMaxColumns) + '%'
    this.carouselItems = []
  }

  carouselUpdate() {
    let tempCarouselItems = []
    const total = this.elementsPage.page.totalElements
    const total_columns = Math.ceil((1.0 * total) / this.carouselMaxRows)
    if (
      this.carouselCurrentColumn < 0 ||
      this.carouselCurrentColumn > total_columns
    ) {
      this.carouselCurrentColumn = this.carouselFirstColumn
    }
    if (total > 0) {
      tempCarouselItems = []
      let pos = 0
      while (pos < total) {
        const columnItems = []
        for (let i = 0; i < this.carouselMaxRows; i++) {
          if (pos < total) {
            columnItems.push(this.elementsPage.data[pos])
            pos++
          }
        }
        tempCarouselItems.push(columnItems)
      }
    } else {
      tempCarouselItems = []
    }
    this.carouselItems = []
    for (
      let i = this.carouselCurrentColumn;
      i <
      this.carouselCurrentColumn +
        Math.min(this.carouselMaxColumns, total_columns);
      i++
    ) {
      this.carouselItems.push(tempCarouselItems[i % total_columns])
    }
  }

  previous() {
    this.carouselCurrentColumn--
    this.carouselUpdate()
  }

  next() {
    this.carouselCurrentColumn++
    this.carouselUpdate()
  }

  getCardType(card) {
    switch (card.cardType) {
      case '1':
        return 'ATM'
        break
      case '2':
        return 'VISA'
        break
      case '3':
        return 'MASTER'
        break
      default:
        return ''
        break
    }
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
            this.carouselUpdate()
          }
        }),
    )
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  goDetails(item) {
    this.serviceDetails.setSelectedItem(item)
    this.router.navigate(['/credit-cards/details'])
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['cardNumber']
  }

  reset() {
    //this.searchForm.controls.status.reset();
    //this.searchForm.controls.type.reset();
    //this.searchForm.controls.userId.reset();
    //this.searchForm.controls.userName.reset();
    this.search()
  }

  refreshData() {}

  getAllTables() {
    return []
  }

  onDetailToggle(event) {}

  getElementsDataForTableExport() {
    const data = this.elementsPage.data
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      data[i].cardTypeName = this.getCardType(data[i])
    }
    return data
  }
}
