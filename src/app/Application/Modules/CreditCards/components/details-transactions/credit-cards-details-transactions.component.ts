import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { AuthenticationService } from 'app/core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { CreditCardsDetailsTransactionsService } from './credit-cards-details-transactions.service'

@Component({
  selector: 'app-credit-card-details-transactions',
  templateUrl: './credit-cards-details-transactions.component.html',
  styleUrls: ['./credit-cards-details-transactions.component.scss'],
})
export class CreditCardsDetailsTransactionsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input()
  selectedCard: any

  constructor(
    public fb: FormBuilder,
    public service: CreditCardsDetailsTransactionsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = ''
    this.orderType = 'desc'

    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()

    /*
        if (this.selectedCard) {
            const data = {
                "card": this.selectedCard
            };
        }
         */
    this.search()
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    const searchCriteria = {
      card: this.selectedCard,
    }

    this.subscriptions.push(
      this.service
        .getResults(searchCriteria, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['id']
  }

  reset() {
    //this.search();
  }

  refreshData() {}
}
