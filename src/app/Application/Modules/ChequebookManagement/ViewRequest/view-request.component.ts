import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { TranslateDatePipe } from '../../../Components/common/Pipes/hijra-date-pipe'
import { Exception } from 'app/Application/Model/exception'
import { ViewRequestService } from './view-request.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
})
export class ViewRequestComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('chequeBookTable', { static: true }) table: any
  step: number
  option: string
  viewRequest: any
  requestSelected: any
  edit = false
  delete = false

  isSearchCollapsed = true
  pageNumber: any
  size: any
  totalElements: any
  tablePageSize = 20
  filterCriteria: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  bsConfig: any
  accounts: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate
  accountNotSelected = true

  selectedAccount: any = null

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private service: ViewRequestService,
    public storage: StorageService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super()
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = fb.group({
      account: [''],
      requestNumber: [{ value: '', disabled: true }],
      dateFrom: [''],
      dateTo: [''],
    })

    // this.viewRequest = [{
    //   requestNumber: "12212121212",
    //   account: "",
    //   bookType: "",
    //   quantity: "",
    //   deliveryType: "",
    //   requestDate: "",
    //   status: ""
    // }];
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
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
    this.filterCriteria = 'date'
    this.getAccounts()
  }

  getAccounts() {
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result: any) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          this.onError(result)
          return
        } else {
          this.accounts = result
        }
      }),
    )
  }

  searchFilterSubmit() {
    if (this.selectedAccount === null) {
      this.accountNotSelected = false
    } else if (this.selectedAccount.fullAccountNumber) {
      this.accountNotSelected = true
    }
    if (
      this.selectedAccount.fullAccountNumber !=
        this.form.controls['account'].value &&
      this.accountNotSelected
    ) {
      // this.selectedAccount = this.form['account']['fullAccountNumber'].value;
      this.form.reset()
      this.form.controls['account'].setValue(
        this.selectedAccount.fullAccountNumber,
      )
      this.setPage(null)
    } else {
      this.setPage(null)
    }
  }

  reset() {
    this.form.reset()
    this.searchFilterSubmit()
  }

  onCriteriaChange(type) {
    if (type) {
      this.filterCriteria = type
      if (this.filterCriteria === 'date') {
        this.form.controls.requestNumber.reset()
        this.form.controls.requestNumber.disable()
        this.form.controls.dateFrom.enable()
        this.form.controls.dateTo.enable()
      }
      if (this.filterCriteria === 'requestNumber') {
        this.form.controls.dateFrom.reset()
        this.form.controls.dateTo.reset()
        this.form.controls.dateFrom.disable()
        this.form.controls.dateTo.disable()
        this.form.controls.requestNumber.enable()
      }
    }
  }

  finish() {
    this.step = 1
    this.router.navigate(['/accounts/chequebook'])
  }

  setPageSize(event) {
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    const data = {
      accountNumber: this.form.controls['account'].value,
      checkNumber: this.form.controls['requestNumber'].value,
      dateFrom: this.form.controls['dateFrom'].value
        ? new DateFormatPipe(this.injector, this._locale).transform(
            this.form.controls['dateFrom'].value,
            'yyyy-MM-dd',
          )
        : null,
      dateTo: this.form.controls['dateTo'].value
        ? new DateFormatPipe(this.injector, this._locale).transform(
            this.form.controls['dateTo'].value,
            'yyyy-MM-dd',
          )
        : null,
      page: pageInfo.offset + 1,
      rows: this.tablePageSize,
    }

    this.subscriptions.push(
      this.service.getchequebookList(data).subscribe((result: any) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          this.onError(result)
          return
        } else {
          this.viewRequest = result
        }
      }),
    )
  }

  isDisabled() {
    return false
  }

  editRequest() {
    this.edit = true
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
