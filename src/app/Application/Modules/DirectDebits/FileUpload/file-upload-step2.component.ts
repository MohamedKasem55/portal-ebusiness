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
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { FileUploadService } from './file-upload.service'
import { StaticService } from '../../Common/Services/static.service'
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
  @ViewChild('payerPageTable', { static: true }) table: any
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() initDirectDebitPayment: any

  @Output() onInit = new EventEmitter<any>()

  bank: any[] = []
  payerPage: PagedData<any>
  authorizationPage: PagedData<any>
  payerData: any
  private order: string
  private orderType: string
  searchForm: FormGroup
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['directDebitBankCode']

  constructor(
    private fb: FormBuilder,
    public service: FileUploadService,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {
    super()
    this.requestValidate = new RequestValidate()
    this.payerPage = new PagedData<any>()
    this.payerPage.data = []
    this.authorizationPage = new PagedData<any>()
    this.authorizationPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    const page2 = new Page()
    page2.pageNumber = 1
    page2.pageSize = 20
    this.payerPage.page = page
    this.authorizationPage.page = page2
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data = result
          this.bank =
            data[this.combosSolicitados.indexOf('directDebitBankCode')][
              'values'
            ]
          // Object.keys(banks).map((key, index) => {
          //     if (!(key === "order")) {
          //         this.bank.push({ key: key, value: banks[key] });
          //     }
          // });
        }),
    )
    this.payerPage.data = this.initDirectDebitPayment.fileDetailsList
    for (const data of this.payerPage.data) {
      data.payerBankCode = data.payerBankCode.trim()
    }
    this.payerPage.page.totalElements = this.payerPage.data.length
    this.payerPage.page.size = this.payerPage.data.length
    this.payerPage.page.totalPages =
      this.payerPage.page.totalElements / this.payerPage.page.pageSize
    this.generateChallengeAndOTP =
      this.initDirectDebitPayment.generateChallengeAndOTP
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
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.payerPage.page.pageNumber = dataTableEvent.offset
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.payerPage.page.pageNumber = 1

    // to implement
  }

  valid() {
    return this.authorization.valid()
  }
}
