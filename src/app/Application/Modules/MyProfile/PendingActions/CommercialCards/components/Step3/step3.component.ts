import { OnInit, Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
  styleUrls: ['../../commercial-cards.component.scss'],
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('reportErrorTable', { static: false }) table: any

  step = 3
  sharedData: any = {}
  error = false
  tableDisplaySize = 20

  constructor(private router: Router, public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    if (Object.keys(this.sharedData).length === 0) {
      this.router.navigate(['/myprofile/pending/commercial-cards/step1'])
    }
    this.error = false
    if (this.sharedData.validation.errorList) {
      for (
        let i = this.sharedData.validation?.errorList?.length - 1;
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
    this.router.navigate(['/myprofile/pending/commercialcards/step1'])
  }

  errorList(): boolean {
    return this.error
  }

  public showErrorIcon(): boolean {
    return this.sharedData?.confirm?.errorList?.some(
      (element) => element.returnCode === '999',
    )
  }
}
