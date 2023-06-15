import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { Subscription } from 'rxjs';

@Component({
  selector: 'request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
})
export class RequestDetailsComponent implements OnInit, OnDestroy {
  breadCrumb: Breadcrumb[] = [];
  subscriptions: Subscription[] = []

  constructor(private router: Router, public translate: TranslateService,

    ) {}
  ngOnInit(): void {
    this.subscriptions.push(
      this.translate.get('fleet').subscribe((data: any) => {
        this.breadCrumb = [
          { txt: data.newRequest.Finance, active: false },
          { txt: data.newRequest.NoteligibleTitle, active: true },
        ]
      })
    )
     
  }
  navigateTo(pageRoute: string) {
    this.router.navigate(['financeProduct/fleet/request/application-details'])
  }

  submitApplication() {}
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(element=>{
      element.unsubscribe()
    })
  }
}
