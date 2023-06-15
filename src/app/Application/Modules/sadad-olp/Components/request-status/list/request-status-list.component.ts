import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { Subscription } from 'rxjs'
import { RequestStatusRefundsListComponent } from './refunds/request-status-refunds-list.component'
import { RequestStatusDisputesListComponent } from './disputes/request-status-disputes-list.component'

@Component({
  selector: 'app-request-status-list-form',
  templateUrl: './request-status-list.component.html',
  styleUrls: ['./request-status-list.component.scss'],
})
export class OLPRequestStatusListComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  subscriptions: Subscription[] = []

  @ViewChild(RequestStatusRefundsListComponent, { static: true })
  childRefunds: RequestStatusRefundsListComponent

  @ViewChild(RequestStatusDisputesListComponent, { static: true })
  childDisputes: RequestStatusDisputesListComponent

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
