import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('withinTable') table: any

  step = 3
  sharedData: any = {}

  withinDisplaySize = 20

  constructor(public router: Router, public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  finish() {
    this.router.navigate(['/myprofile/pending/aramco-beneficiaries/step1'])
  }
}
