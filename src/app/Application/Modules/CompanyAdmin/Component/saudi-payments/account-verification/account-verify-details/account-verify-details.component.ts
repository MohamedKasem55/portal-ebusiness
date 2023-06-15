import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AccountVerifyDetailsService} from "./account-verify-details.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'arb-account-verify-details',
  templateUrl: './account-verify-details.component.html',
  styleUrls: ['./account-verify-details.component.scss']
})
export class AccountVerifyDetailsComponent implements OnInit {

  accountVerifyReqDetails: any
  messageId: string

  constructor(
      public router: Router,
      public service: AccountVerifyDetailsService,
      public translate: TranslateService
  ) {
    this.messageId = this.router.getCurrentNavigation()?.extras?.state.messageId
  }

  ngOnInit(): void {
    const reqParams = {
      messageId: this.messageId
    }

    this.service.getVerifyAccountReqDetails(reqParams).subscribe(result => {
      if(result.errorCode == '0'){
        this.accountVerifyReqDetails = result.details
      }
    })
  }

  routeToList(){
    this.router.navigateByUrl('/companyadmin/saudi-payments/account-verification/list')
  }

  getDisclaimerText(): string{
    let text = "This result is only valid for the same day of inquiry"
    this.translate.get("saudiPayments.accountVerify.disclaimer").subscribe(result => {
      if(result){
        text = result
      }
    })

    return text
  }
}
