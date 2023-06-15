import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ChequebookService } from '../../chequebook.service'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any

  step = 2
  sharedData: any = {}

  generateChallengeAndOTP: ResponseGenerateChallenge

  constructor(
    private service: ChequebookService,
    public translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/chequebook/step1'])
    }
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }
}
