import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

import { AuthenticationService } from 'app/core/security/authentication.service'
import { CreditCardDetailsService } from './credit-card-details.service'

@Component({
  templateUrl: './credit-card-details.component.html',
  styleUrls: ['./credit-card-details.component.scss'],
})
export class CreditCardDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []

  selectedItem: any

  cardInformation: any

  activeTab: number

  constructor(
    public fb: FormBuilder,
    public service: CreditCardDetailsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    this.selectedItem = this.service.getSelectedItem()
    this.activeTab = 1
  }

  back() {
    this.cardInformation = null
    this.service.clearData()
    this.router.navigate(['/credit-cards/list'])
  }

  /*
    delete() {
        this.router.navigate(['/credit-cards/delete']);
    }

    edit() {
        this.router.navigate(['/credit-cards/modify']);
    }*/

  ngOnInit() {
    if (!this.selectedItem || Object.entries(this.selectedItem).length === 0) {
      this.back()
    }

    this.subscriptions.push(
      this.service.init().subscribe((result) => {
        //this.model.disable();
        this.subscriptions.push(
          this.service.detail(this.selectedItem).subscribe((resultSt) => {
            this.cardInformation = resultSt.resultCardSerialList
          }),
        )
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getCardType(card) {
    if (!card) {
      return ''
    }
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

  setActiveTab(tab) {
    this.activeTab = tab
  }

  isActiveTab(tab) {
    return this.activeTab == tab
  }

  /*
    isDeletable() {
        return (this.authenticationService.activateOption('CreditCards', [], ['CcGroup']))//&& this.selectedUser['status'] != 'IN');
    }

    isEditable() {
        return (this.authenticationService.activateOption('CreditCards', [], ['CcGroup']))//&& this.selectedUser['status'] != 'IN');
    }*/
}
