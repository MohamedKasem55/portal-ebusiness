import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-card-operations-step4',
  templateUrl: './card-operations-step4.component.html',
})
export class CardOperationsStep4Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('reportErrorTable') table: any
  step = 4
  sharedData: any = {}

  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  isOk() {
    const valido = true
    if (this.sharedData.validation.details == null) {
      return valido
    }
    for (let i = 0; i < this.sharedData.validation.details.length; i++) {
      if (
        this.sharedData.validation.details[i]['reasonCode'] != '00' &&
        this.sharedData.validation.details[i]['reasonCode'] != ''
      ) {
        return false
      }
    }
    return valido
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
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
}
