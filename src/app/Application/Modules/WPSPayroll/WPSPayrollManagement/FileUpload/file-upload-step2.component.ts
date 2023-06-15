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
import { FileUploadService } from './file-upload.service'
import { StaticService } from '../../../Common/Services/static.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-file-upload-step2',
  templateUrl: './file-upload-step2.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorizationPageTable') authorizationPageTable: any
  @ViewChild('employeePageTable', { static: true }) employeePageTable: any
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() initSalaryPayment: any

  @Output() onInit = new EventEmitter<any>()

  bank: any[] = []
  employeePage: PagedData<any>
  authorizationPage: PagedData<any>
  employeeData: any
  private order: string
  private orderType: string
  searchForm: FormGroup
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  suspicious: []

  combosSolicitados: string[] = ['payrollBankCode']

  constructor(
    private fb: FormBuilder,
    public service: FileUploadService,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {
    super()
    this.requestValidate = new RequestValidate()
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

  getAllTables(): any[] {
    const tablas = []
    if (this.authorizationPageTable) {
      tablas.push(this.authorizationPageTable)
    }
    if (this.employeePageTable) {
      tablas.push(this.employeePageTable)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.employeePage.data = this.initSalaryPayment.companyEmployeeList
    this.employeePage.page.totalElements = this.employeePage.data.length
    this.employeePage.page.size = this.employeePage.data.length
    this.employeePage.page.totalPages =
      this.employeePage.page.totalElements / this.employeePage.page.pageSize
    this.authorizationPage.data =
      this.initSalaryPayment.payrollBatch.futureSecurityLevelsDTOList
    this.authorizationPage.page.totalElements =
      this.authorizationPage.data.length
    this.authorizationPage.page.size = this.authorizationPage.data.length
    this.authorizationPage.page.totalPages =
      this.authorizationPage.page.totalElements /
      this.authorizationPage.page.pageSize
    this.generateChallengeAndOTP =
      this.initSalaryPayment.generateChallengeAndOTP
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object = result
          this.bank =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
        }),
    )

    this.suspicious = this.initSalaryPayment.files

    this.onInit.emit(this)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    if(res.error){
      this.mensajeError['code'] = res.error.errorCode
      this.mensajeError['description'] = res.error.errorDescription
    }
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.employeePage.page.pageNumber = dataTableEvent.offset
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.employeePage.page.pageNumber = 1

    // to implement
  }

    valid() {
        if (this.authorization) {
            return this.authorization.valid()
        }
    }
}
