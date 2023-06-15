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
import { DirectDebitsPaymentsService } from './direct-debits-payments.service'
import { StaticService } from '../../Common/Services/static.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-direct-debits-payments-step2',
  templateUrl: './direct-debits-payments-step2.component.html',
  styleUrls: ['./direct-debits-payments.component.scss'],
})
export class DirectDebitsPaymentsStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('elementPageTable', { static: true }) table: any
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() form: FormGroup
  @Input() bank: any
  @Input() validData: any
  @Input() tableSelectedRows: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  elementPage: PagedData<any>
  private order: string
  private orderType: string

  authorizationPage: PagedData<any>

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = []

  constructor(
    private fb: FormBuilder,
    public service: DirectDebitsPaymentsService,
    public translate: TranslateService,
    public staticService: StaticService,
  ) {
    super()
    this.elementPage = new PagedData<any>()
    this.elementPage.data = []
    this.authorizationPage = new PagedData<any>()
    this.authorizationPage.data = []
    const page = new Page()
    const page2 = new Page()
    page2.pageNumber = 1
    page2.pageSize = 20
    this.elementPage.page = page
    this.authorizationPage.page = page2
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.elementPage.data = this.tableSelectedRows
    this.elementPage.page.pageSize = 50
    this.elementPage.page.totalPages = 1
    this.elementPage.page.totalElements = this.tableSelectedRows.length
    this.elementPage.page.size = 50
    this.authorizationPage.data =
      this.validData.directDebit.futureSecurityLevelsDTOList
    this.authorizationPage.page.totalPages = 1
    this.authorizationPage.page.totalElements =
      this.authorizationPage.data.length
    this.authorizationPage.page.size = this.authorizationPage.data.length
    this.onInit.emit(this as Component)
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
}
