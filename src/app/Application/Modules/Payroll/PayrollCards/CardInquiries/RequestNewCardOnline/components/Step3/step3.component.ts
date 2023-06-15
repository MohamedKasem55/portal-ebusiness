import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('table') table: any
  step = 3
  sharedData: any = {}

  tableDisplaySize = 20

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
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  finish() {
    this.router.navigate(['/payroll/payroll-cards/card-inquiries'])
  }

  isOk() {
    const valida = true
    if (this.sharedData.processed == null) {
      return valida
    }
    for (let i = 0; i < this.sharedData.processed.length; i++) {
      if (this.sharedData.processed[i]['reasonCode'] != '00') {
        return false
      }
    }
    return valida
  }

  isPending() {
    if (
      this.sharedData.responseInitiateNewCard.generateChallengeAndOTP &&
      (this.sharedData.responseInitiateNewCard.generateChallengeAndOTP
        .typeAuthentication === 'STATIC' ||
        this.sharedData.responseInitiateNewCard.generateChallengeAndOTP
          .typeAuthentication === 'OTP' ||
        this.sharedData.responseInitiateNewCard.generateChallengeAndOTP
          .typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }
}
