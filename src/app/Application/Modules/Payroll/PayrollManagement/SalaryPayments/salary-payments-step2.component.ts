import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { SalaryPaymentsService } from './salary-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-salary-payments-step2',
  templateUrl: './salary-payments-step2.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() formSalary: FormGroup
  @Input() bank: any
  @Input() initSalaryPayment: any
  @Input() tableSelectedRows: any
  @Input() accounts: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  employeePage: PagedData<any>
  authorizationPage: PagedData<any>
  employeeData: any
  private order: string
  private orderType: string
  searchForm: FormGroup
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    private fb: FormBuilder,
    public service: SalaryPaymentsService,
    public translate: TranslateService,
  ) {
    super()
    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    this.authorizationPage = new PagedData<any>()
    this.authorizationPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    const page2 = new Page()
    page2.pageNumber = 1
    page2.pageSize = 20
    this.employeePage.page = page
    this.authorizationPage.page = page2
  }

  ngOnInit() {
    this.employeePage.data = this.tableSelectedRows
    //console.log(this.employeePage.data,this.employeePage.data.length);
    this.employeePage.page.totalPages = 1
    this.employeePage.page.totalElements = this.employeePage.data.length
    this.employeePage.page.size = this.employeePage.data.length
    this.authorizationPage.data =
      this.initSalaryPayment.salaryPaymentDetailsDTO.futureSecurityLevelsDTOList
    this.authorizationPage.page.totalPages = 1
    this.authorizationPage.page.totalElements =
      this.authorizationPage.data.length
    this.authorizationPage.page.size = this.authorizationPage.data.length
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.employeePage.page.pageNumber = dataTableEvent.offset

    const account =
      this.formSalary.value.accountFrom != null &&
      this.formSalary.value.accountFrom != ''
        ? this.accounts[this.formSalary.value.accountFrom].fullAccountNumber
        : null
    this.subscriptions.push(
      this.service
        .listPayrollEmploy(
          account,
          this.formSalary.value.valueDate,
          this.formSalary.value.batchName,
          this.searchForm.value,
          this.employeePage.page.pageNumber + 1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.employeePage.page.pageNumber = 1

    const account =
      this.formSalary.value.accountFrom != null &&
      this.formSalary.value.accountFrom != ''
        ? this.accounts[this.formSalary.value.accountFrom].fullAccountNumber
        : null
    this.subscriptions.push(
      this.service
        .listPayrollEmploy(
          account,
          this.formSalary.value.valueDate,
          this.formSalary.value.batchName,
          this.searchForm.value,
          this.employeePage.page.pageNumber,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
          }
        }),
    )
  }

  valid() {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }
}
