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
import { StorageService } from '../../../../../core/storage/storage.service'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { FileUploadService } from './file-upload.service'
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
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() initSalaryPayment: any

  @Output() onInit = new EventEmitter<any>()

  bank: any
  employeePage: PagedData<any>
  authorizationPage: PagedData<any>
  employeeData: any
  private order: string
  private orderType: string
  searchForm: FormGroup
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate

  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['payrollBankCode']
  suspicious: []

  cic: any
  companyName: any

  constructor(
    private fb: FormBuilder,
    public service: FileUploadService,
    public staticService: StaticService,
    public translate: TranslateService,
    public storage: StorageService,
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

  ngOnInit() {
    this.cic = JSON.parse(this.storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.companyName = JSON.parse(this.storage.retrieve('currentUser'))[
      'company'
    ]['companyName']

    this.employeePage.data = this.initSalaryPayment.pageListPayrolls
    this.employeePage.page.totalPages = 1
    this.employeePage.page.totalElements = this.employeePage.data.length
    this.employeePage.page.size = this.employeePage.data.length
    this.authorizationPage.data =
      this.initSalaryPayment.payrollBatchDTO.futureSecurityLevelsDTOList
    this.authorizationPage.page.totalPages = 1
    this.authorizationPage.page.totalElements =
      this.authorizationPage.data.length
    this.authorizationPage.page.size = this.authorizationPage.data.length
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: any = result
          this.bank =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
        }),
    )
    this.onInit.emit(this)

    this.suspicious =
      this.initSalaryPayment.suspiciousPendingDuplicatedFiles.concat(
        this.initSalaryPayment.suspiciousPendingUploadDuplicatedFiles,
        this.initSalaryPayment.suspiciousSentDuplicatedFiles,
        this.initSalaryPayment.suspiciousSentUploadDuplicatedFiles,
      )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    //console.log(res.error);
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
    return !this.authorization || this.authorization.valid()
  }
}
