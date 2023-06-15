import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  step = 3
  sharedData: any = {}
  error = false
  tableDisplaySize0 = 20
  tableDisplaySize = 20

  constructor(
    private router: Router,
    private translateService: TranslateService,
  ) {
    super()
  }

  ngOnInit(): void {
    const selectedLanguage = this.translateService.currentLang
    if (this.sharedData.listResult) {
      for (let i = this.sharedData.listResult.length - 1; i >= 0; i--) {
        if (
          this.sharedData.operationsSelected[i].cardNumber ===
          this.sharedData.listResult[i].cardNumber
        ) {
          if (selectedLanguage === 'ar') {
            this.sharedData.operationsSelected[i].reasonCode =
              this.sharedData.listResult[i].arabicDescription
            this.sharedData.operationsSelected[i].rC =
              this.sharedData.listResult[i].arabicDescription
          } else {
            this.sharedData.operationsSelected[i].reasonCode =
              this.sharedData.listResult[i].englishDescription
            this.sharedData.operationsSelected[i].rC =
              this.sharedData.listResult[i].englishDescription
          }
        }
        if (this.sharedData.listResult[i].reasonCode != '00') {
          this.error = true
        }
      }
    }

    if (this.sharedData.listNew) {
      for (let i = this.sharedData.listNew.length - 1; i >= 0; i--) {
        if (this.sharedData.listNew[i].reasonCode != '00') {
          this.error = true
        }
      }
    }
  }

  finish() {
    this.sharedData = {}
    this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
  }

  errorList(): boolean {
    return this.error
  }
}
