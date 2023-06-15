import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AuthenticationService } from 'app/core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { CreditCardsDetailsStatementsService } from './credit-cards-details-statements.service'

@Component({
  selector: 'app-credit-card-details-statements',
  templateUrl: './credit-cards-details-statements.component.html',
  styleUrls: ['./credit-cards-details-statements.component.scss'],
})
export class CreditCardsDetailsStatementsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  months: any[] = []

  totalAmount: number

  @Input()
  selectedCard: any

  constructor(
    public fb: FormBuilder,
    public service: CreditCardsDetailsStatementsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
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

    if (this.selectedCard) {
      const data = {
        card: this.selectedCard,
      }

      this.subscriptions.push(
        this.service.statementsListKeysValues(data).subscribe((result) => {
          this.months = result.listKeyValue
          //this.searchForm.controls.months.setValue(this.months[0]['key']);
          //this.search();
        }),
      )
    }
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
            this.elementsPage = result
            // TODO this.totalAmount = 0;
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

  refreshData() {}

  getStatementsItemsTotalAmount() {
    if (this.elementsPage.data.length == 0) {
      return 0
    } else {
      return this.elementsPage.data[0].totalAmount
    }
  }
}
