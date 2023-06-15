import { AuthGuardRequestStatus } from './RequestStatus/auth-guard-request-status.service'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { RequestStatusComponent } from './RequestStatus/request-status.component'
import { AuthGuardRequestCards } from './PrePaidCardRequest/auth-guard.service'
import { AuthGuardCardPayment } from './PrePaidCardPayment/auth-guard.service'
import { AuthGuardResetPIN } from './PrePaidCardReset/auth-guard.service'
import { AuthGuardBlockCards } from './PrePaidCardBlock/auth-guard.service'
import { AuthGuardActivateCards } from './PrePaidCardActivate/auth-guard.service'
import { AuthGuardViewQueryCards } from './PrePaidCardViewQuery/auth-guard.service'

export const routes: Routes = [
  {
    path: '',
    component: RequestStatusComponent,
  },
  {
    path: 'requeststatus',
    canLoad: [AuthGuardRequestStatus],
    loadChildren: () =>
      import('./RequestStatus/request-status.module').then(
        (m) => m.RequestStatusModule,
      ),
  },
  {
    path: 'prepaidcardlist',
    loadChildren: () =>
      import('./PrePaidCardList/prePaidCardList.modules').then(
        (m) => m.PrePaidCardsListModule,
      ),
  },
  {
    path: 'prepaidcardviewquery',
    canLoad: [AuthGuardViewQueryCards],
    loadChildren: () =>
      import('./PrePaidCardViewQuery/module-module').then(
        (m) => m.PrePaidCardViewQueryModule,
      ),
  },
  {
    path: 'prepaidcardactivate',
    canLoad: [AuthGuardActivateCards],
    loadChildren: () =>
      import('./PrePaidCardActivate/module-module').then(
        (m) => m.PrePaidCardsActivateModule,
      ),
  },
  {
    path: 'prepaidcardReplacement',
    canLoad: [AuthGuardBlockCards],
    loadChildren: () =>
      import('./PrePaidCardBlock/module-module').then(
        (m) => m.PrePaidCardBlockModule,
      ),
  },
  {
    path: 'prepaidcardLostStolen',
    canLoad: [AuthGuardBlockCards],
    loadChildren: () =>
      import('./PrePaidCardBlock/module-module').then(
        (m) => m.PrePaidCardBlockModule,
      ),
  },
  {
    path: 'prepaidcardclosure',
    canLoad: [AuthGuardBlockCards],
    loadChildren: () =>
      import('./PrePaidCardBlock/module-module').then(
        (m) => m.PrePaidCardBlockModule,
      ),
  },
  {
    path: 'prepaidcardresetpin',
    canLoad: [AuthGuardResetPIN],
    loadChildren: () =>
      import('./PrePaidCardReset/module-module').then(
        (m) => m.PrePaidCardResetPINModule,
      ),
  },
  {
    path: 'loadfundpayment',
    canLoad: [AuthGuardCardPayment],
    loadChildren: () =>
      import('./PrePaidCardPayment/module-module').then(
        (m) => m.PrePaidCardPaymentModule,
      ),
  },
  {
    path: 'refundfundpayment',
    canLoad: [AuthGuardCardPayment],
    loadChildren: () =>
      import('./PrePaidCardPayment/module-module').then(
        (m) => m.PrePaidCardPaymentModule,
      ),
  },
  {
    path: 'prepaidcardrequest',
    canLoad: [AuthGuardRequestCards],
    loadChildren: () =>
      import('./PrePaidCardRequest/request-pre-paid-cards.module').then(
        (m) => m.RequestPrePaidCardsModule,
      ),
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleImpl {
  public static routes: any = routes
}
