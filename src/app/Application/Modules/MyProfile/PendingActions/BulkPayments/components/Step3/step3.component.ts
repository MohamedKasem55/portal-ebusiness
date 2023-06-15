import { OnInit, Component, ViewChild } from '@angular/core'
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

  ngOnInit(): void {
    super.ngOnInit()
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/bulk-payment/step1'])
    }
    this.error = false
    //const message = (this.translate.currentLang == "en" ? "Transaction Successful":"\u001A\u001A\u001A\u001A\u001A\u001A\u001A  \u001A\u001A\u001A\u001A\u001A");
    if (this.sharedData.validation) {
      for (
        let i = this.sharedData.validation.errorList.length - 1;
        i >= 0;
        i--
      ) {
        if (this.sharedData.validation.errorList[i].rejectedReason != null) {
          this.error = true
        }
      }
    }
  }
  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  finish() {
    this.router.navigate(['/myprofile/pending/bulkpayments/step1'])
  }
  errorList(): boolean {
    return this.error
  }
}
