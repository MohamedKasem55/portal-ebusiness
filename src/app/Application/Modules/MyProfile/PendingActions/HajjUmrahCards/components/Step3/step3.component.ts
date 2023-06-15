import { OnInit, Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('reportErrorTable') table: any

  step = 3
  sharedData: any = {}
  error = false
  batchListResult = []

  tableDisplaySize = 20

  constructor(private router: Router, public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/bulk-payment/step1'])
    }
    const selectedLanguage = this.translate.currentLang
    this.batchListResult =
      this.sharedData.responseValidate.batchListsContainerDTO.toAuthorize.concat(
        this.sharedData.responseValidate.batchListsContainerDTO.toProcess,
      )
    if (this.sharedData.listResult) {
      for (let i = 0; i <= this.batchListResult.length - 1; i++) {
        if (
          this.batchListResult[i].cardNumber ===
          this.sharedData.listResult[i].cardNumber
        ) {
          if (selectedLanguage === 'ar') {
            this.batchListResult[i].reasonCode =
              this.sharedData.listResult[i].arabicDescription
          } else {
            this.batchListResult[i].reasonCode =
              this.sharedData.listResult[i].englishDescription
          }
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
    this.router.navigate(['/myprofile/pending/Hajj-Umrah/step1'])
  }

  errorList(): boolean {
    return this.error
  }
}
