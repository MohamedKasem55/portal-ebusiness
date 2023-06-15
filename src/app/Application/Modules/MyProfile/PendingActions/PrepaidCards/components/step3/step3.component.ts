import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['../../prepaid-cards.component.scss'],
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('reportErrorTable') table: any

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
      this.router.navigate(['/myprofile/pending/prepaidCards/step1'])
    }
    this.error = false
    //const message = (this.translate.currentLang == "en" ? "Transaction Successful":"\u001A\u001A\u001A\u001A\u001A\u001A\u001A  \u001A\u001A\u001A\u001A\u001A");
    if (this.sharedData.validation && this.sharedData.validation.errorList) {
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
    // console.log('sharedData step3: ', this.sharedData);
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  finish() {
    this.router.navigate(['/myprofile/pending/prepaidCards/step1'])
  }
  errorList(): boolean {
    return this.error
  }

  public showErrorIcon(): boolean {
    return this.sharedData?.confirm?.resultList?.some(
      (element) => element.returnCode === '999',
    )
  }
}
