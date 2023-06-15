import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { SelectedDataService } from '../../../Accounts/Services/selected-data-service'
import { StaticService } from '../../../Common/Services/static.service'
import { SalaryPaymentsService } from './salary-payments.service'
import { HijraDateFormatPipe } from '../../../../Components/common/Pipes/hijra-date-format-pipe'

const moment = require('moment-hijri')

@Component({
  selector: 'app-salary-payments-step1',
  templateUrl: './salary-payments-step1.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() formSalary: FormGroup
  @Input() bank: any
  @Input() accounts: any
  @Input() tableSelectedRows: any
  @Output() onInit = new EventEmitter<Component>()

  employeePage: PagedData<any>
  private order: string
  private orderType: string

  payrollDetails: any
  employeeData: any

  bsConfig: any

  isCollapsedContent = true
  searchForm: FormGroup
  searchFormData: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['payrollBankCode']

  selectedAccount: any
  selectAllOnPage: any = []

  public bsConfigEN = {
    showWeekNumbers: false,
    adaptivePosition: true,
    containerClass: 'theme-dark-blue',
    isAnimated: true,
    locale: 'en',
    dateInputFormat: 'DD/MM/YYYY',
  }

  public bsConfigAR = {
    showWeekNumbers: false,
    adaptivePosition: true,
    containerClass: 'theme-dark-blue',
    isAnimated: true,
    locale: 'ar',
    dateInputFormat: 'DD/MM/YYYY',
  }

  constructor(
    private fb: FormBuilder,
    public service: SalaryPaymentsService,
    public storageService: StorageService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public sharedAccountData: SelectedDataService,
    private injector: Injector,
  ) {
    super()

    this.searchForm = this.fb.group({
      employeeNumber: '',
      employeeName: '',
      civilianId: '',
    })

    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 50
    this.employeePage.page = page
    this.order = 'employeeNumber'
    this.orderType = 'desc'
  }

  ngOnInit() {
    const hijra = new HijraDateFormatPipe(this.injector)
    this.selectedAccount =
      this.sharedAccountData.getModelServiceCurrentAccount()
    this.sharedAccountData.clearModelServiceCurrentAccount()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.formSalary.controls['valueDate'].valueChanges.subscribe((values) => {
        this.formSalary.controls['hijraDate'].setValue(
          hijra.transform(values, 'dd/MM/yyyy'),
        )
      }),
    )
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object = result
          this.bank =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']

          //console.log('bank', this.bank);
          //console.log(this.bank['RJHI']);
        }),
    )
    this.subscriptions.push(
      this.service.payrollDetails().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.accounts = this.extractAccountKeyValue(
            result.accountListDTOLocal,
          )
          //console.log(this.selectedAccount);
          if (this.selectedAccount) {
            this.formSalary.controls['accountFrom'].patchValue(
              this.getAccountSelected(this.selectedAccount),
            )
          }
          this.payrollDetails = result
        }
      }),
    )
    this.subscriptions.push(
      this.service
        .employeeWithoutAccount(
          this.order,
          this.orderType,
          this.employeePage.page.pageNumber,
          this.employeePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
            //console.log('empleados',result.data.employeesList);
          }
        }),
    )

    const user = JSON.parse(this.storageService.retrieve('currentUser'))
    this.formSalary.controls.customerCIC.setValue(user.company.profileNumber)
    this.formSalary.controls.organizationName.setValue(user.company.companyName)
    this.onInit.emit(this as Component)
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  getAccountSelected(account) {
    if (account) {
      for (let i = this.accounts.length - 1; i >= 0; i--) {
        if (
          this.accounts[i].value.fullAccountNumber == account.fullAccountNumber
        ) {
          return this.accounts[i].key
        }
      }
    }
    return
  }

  search() {
    this.tableSelectedRows = []

    this.searchFormData = Object.assign({}, this.searchForm.value)
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
          this.searchFormData,
          1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
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

  reset() {
    this.tableSelectedRows = []
    this.searchForm.reset()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .employeeWithoutAccount(
          this.order,
          this.orderType,
          this.employeePage.page.pageNumber,
          this.employeePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
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
          this.searchFormData,
          this.employeePage.page.pageNumber + 1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
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
          this.searchFormData,
          this.employeePage.page.pageNumber,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
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

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //console.log(selected.length);
    this.selectAllOnPage[this.employeePage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.employeePage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.employeePage.data.map((employee) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => selected.employeePk !== employee.employeePk,
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.employeePage.data)
      this.selectAllOnPage[this.employeePage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //
    } else {
      // Unselect all
      this.employeePage.data.map((employee) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => selected.employeePk !== employee.employeePk,
        )
      })
      this.selectAllOnPage[this.employeePage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelectedRows)
    }
  }
  getIdFunction() {
    return this.getId.bind(this)
  }
  getId(row) {
    return row['employeePk']
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
