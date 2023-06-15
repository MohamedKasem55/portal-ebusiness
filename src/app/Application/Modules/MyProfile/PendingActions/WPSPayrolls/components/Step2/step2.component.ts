import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { PayrollsService } from '../../payrolls.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('authorization') authorization: any
  @ViewChild('employeePageTable') employeePageTable: any
  @ViewChild('authorizationPageTable') authorizationPageTable: any

  step = 2
  sharedData: any = {}

  salaryDisplaySize = 50
  payrollDisplaySize = 50

  validateSubscription: Subscription
  pageEmployeeSize = 0
  pageAuthorizationSize = 20

  bsConfig: any
  today = new Date()
  cic: any
  companyName: any

  constructor(
    public service: PayrollsService,
    public translate: TranslateService,
    private router: Router,
    public storage: StorageService,
  ) {
    super()
    this.cic = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.companyName = JSON.parse(storage.retrieve('currentUser'))['company'][
      'companyName'
    ]
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.sharedData.responseValidate = {}
    this.sharedData.requestValidate = new RequestValidate()

    if (this.sharedData.salarySelected.length !== 0) {
      this.validateSubscription = this.service
        .salaryPaymentsValidate(this.sharedData.salarySelected[0])
        .subscribe((result) => {
          this.validateSubscription.unsubscribe()
          if (!result.error) {
            this.sharedData.responseValidate = result
            //console.log("this.sharedData", this.sharedData.responseValidate.selectedEmployeeList);
          } else {
            this.router.navigate(['/myprofile/pending/wpspayrolls/step1'])
          }
        })
    }

    if (this.sharedData.payrollSelected.length !== 0) {
      this.validateSubscription = this.service
        .importsPayrollsValidate(this.sharedData.payrollSelected)
        .subscribe((result) => {
          this.validateSubscription.unsubscribe()
          if (!result.error) {
            this.sharedData.responseValidate = result
            //console.log("this.sharedData", this.sharedData);
          } else {
            this.router.navigate(['/myprofile/pending/wpspayrolls/step1'])
          }
        })
    }
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.employeePageTable) {
      tablas.push(this.employeePageTable)
    }
    if (this.authorizationPageTable) {
      tablas.push(this.authorizationPageTable)
    }
    return tablas
  }

  valid() {
    return !(
      this.sharedData.responseValidate &&
      this.sharedData.responseValidate.errors &&
      this.sharedData.responseValidate.errors.length > 0
    )
  }

  openModal(
    row: { futureSecurityLevelsDTOList: any; securityLevelsDTOList: any },
    popup: { openModal: { (arg0: any): void; (arg0: any): void } },
  ) {
    popup.openModal(row.securityLevelsDTOList)
  }

  getErrorBatchId(error) {
    if (typeof error === 'string') {
      return ''
    }
    const keys = Object.keys(error)
    return (keys.length > 0 ? JSON.stringify(keys) : '') + ' '
  }

  getErrorBatchMsg(error) {
    if (typeof error === 'string') {
      return error
    }
    const keys = Object.keys(error)
    const msgs = []
    keys.forEach((key, i) => {
      msgs.push(error[key])
    })
    return msgs.join(', ')
  }
}
