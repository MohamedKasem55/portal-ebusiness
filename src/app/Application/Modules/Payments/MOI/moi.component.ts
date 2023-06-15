import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  selector: 'app-moi',
  templateUrl: './moi.component.html',
  styles: [],
})
export class MOIComponent implements OnInit {
  moiComponents = [
    {
      key: 'payments',
      route: '/payments/moi/payments',
      translate: 'payments.moiPayments.payments.name',
    },
    {
      key: 'refunds',
      route: '/payments/moi/refunds',
      translate: 'payments.moiPayments.refunds.name',
    },
    // {
    //   key: 'feedback-files',
    //   route: '/payments/moi/feedback-files',
    //   translate: 'payments.moiPayments.feedBack.name',
    // },
    {
      key: 'processedTransactions',
      route: '/payments/moi/processedTransactions',
      translate: 'menu.sadad.government_payment.processed_Transactions',
    },
    {
      key: 'request-status',
      route: '/payments/moi/request-status',
      translate: 'payments.moiPayments.request.name',
    },
  ]
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goComponentLink(route) {
    this.router.navigate([route])
  }

  checkAuthorization(key): boolean {
    let result = false

    switch (key) {
      case 'payments':
        result = this.authenticationService.activateOption(
          'MOIPayment',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        )
        break
      case 'refunds':
        result = this.authenticationService.activateOption(
          'MOIRefunds',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        )
        break

      // case 'feedback-files':
      //   result = this.authenticationService.activateOption(
      //     'MOIFeedBackFiles',
      //     ['EGOVERNMENT_PRIVILEGE'],
      //     ['EgovGroup'],
      //   )
      //   break

      case 'processedTransactions':
        result = this.authenticationService.activateOption(
          'MOIRequestStatus',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        )
        break

      case 'request-status':
        result = this.authenticationService.activateOption(
          'MOIRequestStatus',
          ['EGOVERNMENT_PRIVILEGE'],
          ['EgovGroup'],
        )
        break
    }

    return result
  }
}
