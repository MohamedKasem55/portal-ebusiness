import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router, public translate: TranslateService) {}

  ngOnInit(): void {}

  isPending() {
    return false
    /*if(this.sharedData.generateChallengeAndOTP && (this.sharedData.generateChallengeAndOTP.typeAuthentication==='STATIC'
            || this.sharedData.generateChallengeAndOTP.typeAuthentication==='OTP'
            || this.sharedData.generateChallengeAndOTP.typeAuthentication==='CHALLENGE')){
            return false;
        }else{
            return true;
        }*/
  }

  valid() {
    return true
  }
}
