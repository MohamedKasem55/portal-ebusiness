import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'

import { AuthenticationService } from 'app/core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { CardsDetailsStatementsService } from './cards-details-statements.service'

@Component({
  selector: 'app-card-details-statements',
  templateUrl: './cards-details-statements.component.html',
})
export class CardsDetailsStatementsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  months: any[] = []

  totalAmount: number

  @Input()
  selectedCard: string

  constructor(
    public fb: FormBuilder,
    public service: CardsDetailsStatementsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private injector: Injector,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = ''
    this.orderType = 'desc'

    this.totalAmount = 0

    this.searchForm = this.fb.group({
      month: ['', []],
    })
  }

  ngOnInit() {
    super.ngOnInit()
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    const searchCriteria = {
      card: this.selectedCard,
      month: searchElement.month,
    }

    this.subscriptions.push(
      this.service
        .getResults(searchCriteria, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            result.data = result.data.map((item) => {
              item = {
                ...item,
                amountCurrencyItem: item.amount + ' ' + item.currency,
              }
              return item
            })
            this.elementsPage = result
          }
        }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['transactionId']
  }

  reset() {
    this.searchForm.controls.months.reset()
    //this.search();
  }

  refreshData() {
    if (this.selectedCard) {
      this.subscriptions.push(
        this.service
          .statementsListKeysValues(this.selectedCard)
          .subscribe((result) => {
            this.months = result.statementList
            this.months.forEach((month) => {
              const date = new Date(month['stmtDate'])
              month.value =
                date.getFullYear() != 9999
                  ? this.injector
                      .get(DateFormatPipe)
                      .transform(month['stmtDate'], 'MMMM yyyy')
                  : this.injector
                      .get(TranslateService)
                      .instant('commercialCards.currentMonth')
            })
          }),
      )
    }
  }

  getStatementsItemsTotalAmount() {
    if (this.elementsPage.data.length == 0) {
      return 0
    } else {
      return this.elementsPage.data[0].totalAmount
    }
  }
}
