import { Component, OnInit, Input, OnDestroy, Injector } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { Router } from '@angular/router'
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component'
import { DateFormatPipe } from 'app/Application/Components/common/Pipes/date-format-pipe'
import { StatementsListService } from './statements-list.service'

@Component({
  selector: 'app-statements-list',
  templateUrl: './statements-list.component.html',
})
export class StatementsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() cardSeqNumber: string
  months: any[] = []

  totalAmount: number

  constructor(
    public fb: FormBuilder,
    public service: StatementsListService,
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
      card: this.cardSeqNumber,
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
    if (this.cardSeqNumber) {
      this.subscriptions.push(
        this.service
          .statementsListKeysValues(this.cardSeqNumber)
          .subscribe((result) => {
            this.months = result.statementList
            this.months.forEach((month) => {
              const date = new Date(month['stmtDate'])
              month.value =
                date.getFullYear() != 9999
                  ? this.injector
                      .get(DateFormatPipe)
                      .transform(month['stmtDate'], 'dd MMMM yyyy')
                  : this.injector
                      .get(TranslateService)
                      .instant('commercialCards.currentMonth')
            })
          }),
      )
    }
  }

  getStatementsItemsTotalAmount() {
    let amount: number = 0
    this.elementsPage
    if (this.elementsPage.data.length == 0) {
      return 0
    } else {
      const bill = this.elementsPage.data
      bill.forEach((element) => {
        amount += +element.amount
      })
      // return this.elementsPage.data[0].totalAmount
      return amount
    }
  }
}
