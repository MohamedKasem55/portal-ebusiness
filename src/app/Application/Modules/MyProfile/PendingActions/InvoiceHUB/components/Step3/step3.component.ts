import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('reportErrorTable') table: any

  step = 3
  sharedData: any = {}
  error = false

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
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/invoiceHUB/step1'])
    }
    this.error = false
    const message =
      this.translate.currentLang == 'en'
        ? 'Core Transaction Successful'
        : 'Core \u001A\u001A\u001A\u001A\u001A\u001A\u001A  \u001A\u001A\u001A\u001A\u001A'
    if (
      this.sharedData.validation.batchsFailed &&
      this.sharedData.validation.batchsFailed.length != 0
    ) {
      this.error = true
    }
  }

  finish() {
    this.router.navigate(['/myprofile/pending/invoiceHUB/step1'])
  }

  errorList(): boolean {
    return this.error
  }
}
