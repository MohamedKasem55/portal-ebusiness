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
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { SalaryPaymentsService } from './salary-payments.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { SecuredAuthentication } from 'app/Application/Components/secured-authentication/secured-authentication.component'

@Component({
  selector: 'app-salary-payments-step2',
  templateUrl: './salary-payments-step2.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('employeePageTable') table: any
  @ViewChild('authorization') authorization: SecuredAuthentication
  @Input() formSalary: FormGroup
  @Input() bank: any
  @Input() initSalaryPayment: any
  @Input() tableSelectedRows: any
  @Input() accounts: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate

  propous: any
  employeePage: PagedData<any>
  authorizationPage: PagedData<any>
  employeeData: any
  private order: string
  private orderType: string
  searchForm: FormGroup

  combosSolicitados: string[] = ['payrollPaymentPurpose']

  constructor(
    private fb: FormBuilder,
    public service: SalaryPaymentsService,
    public translate: TranslateService,
    public staticService: StaticService,
  ) {
    super()
    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    this.authorizationPage = new PagedData<any>()
    this.authorizationPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 50
    const page2 = new Page()
    page2.pageNumber = 1
    page2.pageSize = 50
    this.employeePage.page = page
    this.authorizationPage.page = page2
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  valid(): boolean {
      return this.authorization.valid()
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object = result
          this.propous =
            data[this.combosSolicitados.indexOf('payrollPaymentPurpose')][
              'values'
            ]
        }),
    )
    this.employeePage.data = this.tableSelectedRows
    //console.log(this.employeePage.data,this.employeePage.data.length);
    this.employeePage.page.totalPages = 1
    this.employeePage.page.totalElements = this.employeePage.data.length
    this.employeePage.page.size = this.employeePage.data.length
    this.authorizationPage.data =
      this.initSalaryPayment.salaryPaymentDetails.futureSecurityLevelsDTOList
    this.authorizationPage.page.totalPages = 1
    this.authorizationPage.page.totalElements =
      this.authorizationPage.data.length
    this.authorizationPage.page.size = this.authorizationPage.data.length
    this.employeePage.data.forEach((elem) => {
      elem['_bankForPrint'] = this.bank[elem['bankCodePayroll']]
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onError(error: any) {
  }
}
