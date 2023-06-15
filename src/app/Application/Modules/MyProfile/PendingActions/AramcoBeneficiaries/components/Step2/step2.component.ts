import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { BeneficiariesService } from '../../beneficiaries.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('authorization') authorization: any
  @ViewChild('withinTable') table: any
  step = 2
  sharedData: any = {}

  withinDisplaySize = 20
  localDisplaySize = 20
  internationalDisplaySize = 20

  authorizeValidateMultipleSubscription: Subscription

  constructor(
    public service: BeneficiariesService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData.authorizeValidateMultiple = {}

    if (this.sharedData.aproveFlow) {
      this.sharedData.requestValidate = new RequestValidate()
      this.authorizeValidateMultipleSubscription = this.service
        .authorizeValidateMultiple(
          this.sharedData.withinSelected,
          this.sharedData.localSelected,
          this.sharedData.internationalSelected,
        )
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.authorizeValidateMultiple = result
          }
          this.authorizeValidateMultipleSubscription.unsubscribe()
        })
    }
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }
}
