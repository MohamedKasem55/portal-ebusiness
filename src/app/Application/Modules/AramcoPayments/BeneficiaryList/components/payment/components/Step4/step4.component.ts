import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step4.component.html',
})
export class Step4Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('reportErrorTable') table: any

  step = 4
  sharedData: any = {}
  form: FormGroup

  constructor(private router: Router, public translate: TranslateService) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
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
