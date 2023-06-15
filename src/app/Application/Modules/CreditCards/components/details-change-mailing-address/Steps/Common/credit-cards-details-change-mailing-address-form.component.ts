import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../../../core/storage/storage.service'

@Component({
  selector: 'app-credit-cards-details-change-mailing-address-form',
  templateUrl:
    './credit-cards-details-change-mailing-address-form.component.html',
})
export class CreditCardsDetailsChangeMailingAddressFormComponent
  implements OnInit, OnDestroy
{
  @Input() formModel: any

  @Input() card: any

  @Input() inquiryMailingData: any

  @Input() combosData: any

  subscriptions: Subscription[] = []

  constructor(
    public translate: TranslateService,
    public storageService: StorageService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  get company() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const company = currentUser.company
    return company
  }
}
