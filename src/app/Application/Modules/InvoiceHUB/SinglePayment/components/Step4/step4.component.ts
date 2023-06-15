import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step4.component.html',
})
export class Step4Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('table') table: any

  step = 4
  sharedData: any = {}
  tableDisplaySize = 10

  constructor(private router: Router, public translate: TranslateService) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    /*if (Object.keys(this.sharedData).length === 0) {
            this.router.navigate(['/invoiceHUB/multi-payment/step1']);
        }*/
  }

  isOk() {
    return (
      !this.sharedData['batchsFailed'] ||
      this.sharedData['batchsFailed'].length == 0
    )
  }

  isPending() {
    if (
      this.sharedData.generateChallengeAndOTP &&
      (this.sharedData.generateChallengeAndOTP.typeAuthentication ===
        'STATIC' ||
        this.sharedData.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.sharedData.generateChallengeAndOTP.typeAuthentication ===
          'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }

  valid() {
    return true
  }
}
